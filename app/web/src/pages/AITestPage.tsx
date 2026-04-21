import { useState } from "react";
import { generatePlan } from "@/features/ai/ai.api";

export default function AITestPage() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    setResult(""); // Clear previous result
    try {
      const response = await generatePlan({
        theme: "love",
        tone: "emotional",
        style: "free verse",
      });
      console.log("AI response:", response);
      setResult(response.plan);
    } catch (error) {
      console.error("AI call failed:", error);
      setResult("Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#1a1a1a",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: "1rem" }}>AI Poetry Planner</h1>
      <button
        onClick={handleTest}
        disabled={loading}
        style={{
          padding: "12px 24px",
          background: loading ? "#888" : "#d4af37",
          color: "black",
          border: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          fontWeight: "bold",
          cursor: loading ? "not-allowed" : "pointer",
          marginBottom: "2rem",
        }}
      >
        {loading ? "Generating..." : "Generate Plan"}
      </button>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          backgroundColor: "#1e1e2f",
          color: "#f0e6d2",
          padding: "1.5rem",
          borderRadius: "12px",
          border: "2px solid #d4af37",
          fontSize: "1rem",
          lineHeight: "1.6",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          minHeight: "200px",
        }}
      >
        {result || "✨ Click the button to generate a poetry plan ✨"}
      </pre>
    </div>
  );
}
