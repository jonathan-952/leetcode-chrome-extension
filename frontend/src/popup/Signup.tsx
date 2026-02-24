import { useState } from "react";

interface SignupProps {
  onSignup: () => void;
  onBack: () => void;
}

export default function Signup({ onSignup, onBack }: SignupProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSignup() {
    if (!username || !email || !password) {
      setError("fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    chrome.runtime.sendMessage(
      { type: "SIGNUP", payload: { username, email, password } },
      (response) => {
        setLoading(false);
        if (response?.success) onSignup();
        else setError(response?.error ?? "something went wrong.");
      }
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <div className="w-full max-w-lg px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-sm font-semibold tracking-tight">LC Recall</h1>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
          <p className="text-xs text-zinc-500 mb-4">Create an account</p>

          <input
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors"
          />
          <input
            placeholder="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors"
          />
          <input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSignup()}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors"
          />

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSignup}
              disabled={loading}
              style={{ backgroundColor: '#ffffff', color: '#18181b' }}
              className="flex-1 text-xs font-semibold py-2 rounded-lg hover:bg-zinc-200 disabled:opacity-50 transition-colors"
            >
              {loading ? "signing up..." : "sign up"}
            </button>
            <button
              onClick={onBack}
              className="flex-1 bg-zinc-800 text-zinc-300 text-xs font-semibold py-2 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}