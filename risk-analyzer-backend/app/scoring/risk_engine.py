from typing import Dict
from app.models.schema import AnalyzeResponse, Breakdown
from app.scoring.adversarial_engine import generate_attacker_inference


def score_risk(raw_scores: Dict[str, float]) -> AnalyzeResponse:
    """
    Converts raw semantic scores into weighted risk score,
    risk level, recommendations, risk summary,
    and adversarial inference.
    """

    # -------------------------
    # Weighted Risk Score
    # -------------------------

    total_score = sum(raw_scores.values())
    score = float(min(total_score * 100, 100))

    # -------------------------
    # Risk Level Classification
    # -------------------------

    if score < 30:
        risk_level = "Low"
    elif score < 70:
        risk_level = "Medium"
    else:
        risk_level = "High"

    # -------------------------
    # Recommendations
    # -------------------------

    recommendations = []

    if raw_scores.get("location", 0) > 0.3:
        recommendations.append("Avoid sharing real-time location details.")

    if raw_scores.get("routine", 0) > 0.3:
        recommendations.append("Limit sharing specific daily routine timings.")

    if raw_scores.get("corporate", 0) > 0.3:
        recommendations.append("Reduce identifiable workplace mentions.")

    if raw_scores.get("family", 0) > 0.3:
        recommendations.append("Be cautious when sharing household-related details.")

    if raw_scores.get("contact", 0) > 0.3:
        recommendations.append("Avoid posting direct contact information publicly.")

    # -------------------------
    # Risk Summary (required by schema)
    # -------------------------

    risk_summary = (
        f"This post has a {risk_level.lower()} level of exposure "
        f"based on detected personal and contextual signals."
    )

    # -------------------------
    # 🆕 Adversarial Inference
    # -------------------------

    attacker_inference = generate_attacker_inference(raw_scores)

    # -------------------------
    # Final Structured Response
    # -------------------------

    return AnalyzeResponse(
        score=score,   # ✅ correct field
        risk_level=risk_level,
        breakdown=Breakdown(**raw_scores),   # ✅ convert dict → Breakdown model
        recommendations=recommendations,
        risk_summary=risk_summary,
        attacker_inference=attacker_inference
    )