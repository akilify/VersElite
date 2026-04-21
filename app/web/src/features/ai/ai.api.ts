import { apiFetch } from "@/lib/api";

export async function generatePlan(data: {
  theme: string;
  tone: string;
  style: string;
}) {
  return await apiFetch("/api/ai/plan", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
