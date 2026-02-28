# ==========================================================
# Adversarial Risk Simulation Engine (Round 3 Upgrade)
# ==========================================================

from typing import Dict, List


def generate_attacker_inference(category_breakdown: Dict[str, float]) -> List[str]:
    """
    Generates deterministic attacker inferences based on
    detected exposure category strengths.
    """

    inferences = []

    contact = category_breakdown.get("contact", 0)
    corporate = category_breakdown.get("corporate", 0)
    location = category_breakdown.get("location", 0)
    family = category_breakdown.get("family", 0)
    routine = category_breakdown.get("routine", 0)

    # Threshold to consider a category as meaningfully exposed
    threshold = 0.3

    contact_exposed = contact > threshold
    corporate_exposed = corporate > threshold
    location_exposed = location > threshold
    family_exposed = family > threshold
    routine_exposed = routine > threshold

    # -------------------------
    # Individual Inferences
    # -------------------------

    if routine_exposed:
        inferences.append(
            "Daily routine timing becomes more predictable to external observers."
        )

    if corporate_exposed:
        inferences.append(
            "Workplace identifiable, increasing targeted phishing or impersonation risk."
        )

    if location_exposed:
        inferences.append(
            "Geographical exposure may enable location-based scams or targeted outreach."
        )

    if family_exposed:
        inferences.append(
            "Household composition information exposed, increasing social engineering exposure."
        )

    if contact_exposed:
        inferences.append(
            "Direct contact details increase likelihood of unsolicited outreach attempts."
        )

    # -------------------------
    # Compound Patterns
    # -------------------------

    if location_exposed and routine_exposed:
        inferences.append(
            "Location combined with timing details allows activity pattern modeling."
        )

    if corporate_exposed and location_exposed:
        inferences.append(
            "Workplace and geographic exposure together increase profiling depth."
        )

    if family_exposed and routine_exposed:
        inferences.append(
            "Family and routine information combined increases structured targeting exposure."
        )

    return inferences