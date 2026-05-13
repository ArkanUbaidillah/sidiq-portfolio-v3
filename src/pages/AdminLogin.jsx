import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Terminal, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await signIn(email, password);
    if (err) {
      setError("Email atau password salah.");
      setLoading(false);
    } else {
      navigate("/sidiq-admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-radial from-sky-900/10 via-transparent to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="bento-card p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mb-3">
              <Terminal size={24} className="text-sky-500" />
            </div>
            <h1 className="font-mono text-lg font-bold text-white">
              Admin Panel
            </h1>
            <p className="font-mono text-xs text-[#444] mt-1">
              sidiq.dev / admin
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="font-mono text-xs text-[#444] uppercase tracking-wider mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@example.com"
                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 font-mono text-sm text-white placeholder-[#222] focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-[#444] uppercase tracking-wider mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 pr-10 font-mono text-sm text-white placeholder-[#222] focus:outline-none focus:border-sky-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#333] hover:text-sky-500 transition-colors"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 font-mono text-xs">
                <AlertCircle size={12} /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-sky-600 text-white font-mono text-sm font-bold py-3 rounded-xl hover:bg-sky-500 transition-colors disabled:opacity-50 mt-2"
            >
              <Lock size={14} />
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#0f0f0f]">
            <Link
              to="/"
              className="block text-center font-mono text-xs text-[#333] hover:text-sky-500 transition-colors"
            >
              ← Kembali ke Portfolio
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
