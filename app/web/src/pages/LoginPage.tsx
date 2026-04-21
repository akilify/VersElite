import { useState } from "react";
import { signIn } from "@/features/auth/auth.api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signIn(email, password);
      alert("Login successful!");
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <div className="p-10 text-white">
      <h2 className="text-2xl mb-4">Login</h2>
      <input
        className="block mb-2 p-2 text-black"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="block mb-2 p-2 text-black"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-blue-500 px-4 py-2 rounded" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}
