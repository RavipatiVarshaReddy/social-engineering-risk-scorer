import { useState, useEffect } from "react";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeText = async (value) => {
    if (!value.trim()) {
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: value }),
      });

      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Backend not responding.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      analyzeText(text);
    }, 500);

    return () => clearTimeout(delay);
  }, [text]);

  const getRiskColor = (level) => {
    if (!level) return "white";
    if (level === "High") return "#ff4d4f";
    if (level === "Medium") return "#faad14";
    return "#52c41a";
  };

  const getBarColor = (score) => {
    if (score > 60) return "#ff4d4f";
    if (score > 30) return "#faad14";
    return "#52c41a";
  };

  const getScoreColor = (value) => {
    if (value >= 20) return "#ff4d4f";
    if (value > 0) return "#faad14";
    return "#52c41a";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        fontFamily: "Arial, sans-serif",
        padding: "60px",
        color: "white",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "48px",
          marginBottom: "50px",
        }}
      >
        Social Engineering Risk Scorer
      </h1>

      <textarea
        rows="6"
        style={{
          width: "100%",
          padding: "20px",
          borderRadius: "14px",
          border: "none",
          fontSize: "18px",
          backgroundColor: "#2d3748",
          color: "white",
          outline: "none",
        }}
        placeholder="Paste social media bio or post..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {loading && (
        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
            color: "#4da6ff",
            fontWeight: "bold",
          }}
        >
          ⚡ AI analyzing in real-time...
        </p>
      )}

      {error && (
        <p style={{ color: "#ff4d4f", marginTop: "20px" }}>{error}</p>
      )}

      {result && (
        <div
          style={{
            marginTop: "70px",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
            padding: "50px",
            borderRadius: "20px",
            boxShadow: "0 0 40px rgba(0,0,0,0.5)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: "32px",
            }}
          >
            Risk Score: {result.score}/100
          </h2>

          {/* 🔥 Animated Progress Bar */}
          <div
            style={{
              height: "12px",
              backgroundColor: "#1e293b",
              borderRadius: "20px",
              marginTop: "20px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${result.score}%`,
                background: getBarColor(result.score),
                transition: "width 0.6s ease",
              }}
            />
          </div>

          <h2
            style={{
              textAlign: "center",
              color: getRiskColor(result.risk_level),
              fontSize: "42px",
              fontWeight: "bold",
              marginTop: "20px",
              textShadow:
                result.risk_level === "High"
                  ? "0 0 20px rgba(255,77,79,0.8)"
                  : "none",
            }}
          >
            {result.risk_level} Risk
          </h2>

          <p
            style={{
              textAlign: "center",
              opacity: 0.8,
              fontSize: "18px",
              marginTop: "10px",
            }}
          >
            {result.risk_summary}
          </p>

          <h3 style={{ marginTop: "60px", fontSize: "24px" }}>
            Exposure Breakdown
          </h3>

          {/* 🔥 Grid Layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginTop: "30px",
            }}
          >
            {Object.entries(result.breakdown).map(([key, value]) => (
              <div
                key={key}
                style={{
                  background: "#0b1a2b",
                  padding: "20px",
                  borderRadius: "12px",
                }}
              >
                <h4 style={{ textTransform: "capitalize" }}>{key}</h4>
                <p
                  style={{
                    fontSize: "22px",
                    fontWeight: "bold",
                    color: getScoreColor(value),
                  }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          <h3 style={{ marginTop: "60px", fontSize: "24px" }}>
            Recommendations
          </h3>

          {Array.isArray(result.recommendations) &&
          result.recommendations.length ? (
            <ul style={{ marginTop: "20px", fontSize: "18px" }}>
              {result.recommendations.map((rec, idx) => (
                <li key={idx} style={{ marginBottom: "12px" }}>
                  {rec}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ opacity: 0.7 }}>No recommendations available</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;