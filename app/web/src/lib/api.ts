import { supabase } from "@/lib/supabase";

const BASE_URL = "http://localhost:5000";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  console.log("apiFetch - token present:", !!token);

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  return res.json();
}
