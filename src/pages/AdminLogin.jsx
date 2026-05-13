import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, Eye, EyeOff, Lock, Sparkles } from "lucide-react";
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
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="dot-grid absolute inset-0 opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="bento-card p-8">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-lg border border-sky-300/20 bg-sky-300/10">
              <Sparkles size={24} className="text-sky-200" />
            </div>
            <h1 className="font-display text-xl font-extrabold text-white">
              Admin Panel
            </h1>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              sidiq.dev / admin
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@example.com"
                className="w-full px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  className="w-full px-4 py-3 pr-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-sky-200"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
                <AlertCircle size={12} /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-sky-400 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-sky-300 disabled:opacity-50"
            >
              <Lock size={14} />
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 border-t border-white/10 pt-6">
            <Link
              to="/"
              className="block text-center text-xs font-bold text-slate-500 transition-colors hover:text-sky-200"
            >
              Kembali ke Portfolio
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
