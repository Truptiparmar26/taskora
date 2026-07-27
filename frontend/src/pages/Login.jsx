import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TaskoraLogo from "../components/TaskoraLogo"; 

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login, showToast } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await API.post("/auth/login", form);
      login(res.data);
      if (showToast) {
        showToast(`Welcome back, ${res.data?.user?.name || "Executive"}! Entering Command Deck.`, "Login Successful 🚀", "success");
      }
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error details:", err);
      let serverMessage = err.response?.data?.msg || err.response?.data?.message;
      if (!serverMessage) {
        serverMessage = !err.response || err.message === "Network Error"
          ? "⚠️ Cannot connect to backend server. Please ensure your backend server (node server.js) is active on port 5000."
          : "Unable to authenticate. Please check your credentials and try again.";
      }
      setError(serverMessage);
      if (showToast) {
        showToast(serverMessage, "Authentication Alert ⚠️", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col lg:flex-row bg-[#0A0E1A] text-white font-sans relative overflow-y-auto selection:bg-indigo-500 selection:text-white">
      
      {/* Ambient Background Gradient Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-indigo-600/20 to-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/20 to-pink-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* --- LEFT SIDE BRANDING HERO (Desktop Only) --- */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center p-16 relative z-10 border-r border-slate-800/60">
        <div className="max-w-lg space-y-8 text-left">
          <div className="flex items-center gap-4 mb-6">
            <TaskoraLogo size={64} />
            <span className="text-4xl font-black tracking-tight text-white bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Taskora
            </span>
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight text-white leading-tight">
            Welcome Back to Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Digital Workspace.</span>
          </h1>
          
          <p className="text-lg text-slate-400 leading-relaxed font-normal">
            Sign in to access your synchronized dashboards, manage active milestones, and continue building your workflow momentum.
          </p>

          <div className="pt-4 space-y-4 text-slate-300 font-medium text-sm">
            <div className="flex items-center gap-3 bg-slate-900/50 p-3.5 rounded-2xl border border-slate-800/80 shadow-inner">
              <span className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-base">📊</span>
              <span>Personalized Productivity Dashboard & Analytical Metrics</span>
            </div>
            <div className="flex items-center gap-3 bg-slate-900/50 p-3.5 rounded-2xl border border-slate-800/80 shadow-inner">
              <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-base">🚀</span>
              <span>Priority Allocation & Custom Progress Reminders</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE (Login Form) --- */}
      <div className="flex-1 w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-14 relative z-10 my-auto">
        <div className="w-full max-w-md bg-[#111827]/90 backdrop-blur-2xl border border-slate-800/80 rounded-[28px] p-8 sm:p-10 shadow-2xl shadow-black/40 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80"></div>

          {/* Mobile Logo Header */}
          <div className="lg:hidden flex flex-col items-center justify-center mb-8 gap-3">
            <TaskoraLogo size={56} />
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Taskora</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Sign In</h2>
            <p className="text-slate-400 text-sm font-medium">Enter your authorized account credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* --- EXPLICIT, SPECIFIC ERROR WARNING TOAST --- */}
            {error && (
              <div className="flex items-start gap-3.5 p-4 bg-gradient-to-r from-red-950/80 via-red-900/40 to-red-950/80 border border-red-500/40 rounded-2xl text-red-200 text-sm shadow-lg shadow-red-950/50 backdrop-blur-md">
                <div className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 mt-0.5 font-bold">
                  !
                </div>
                <div className="flex-1">
                  <span className="font-bold text-red-300 block mb-0.5">Authentication Issue</span>
                  <span className="leading-relaxed opacity-95">{error}</span>
                </div>
              </div>
            )}

            {/* INPUT 1: EMAIL */}
            <div className="relative group">
              <input
                type="email"
                id="email"
                className="peer w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 pt-6 pb-2 text-white font-medium placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-transparent transition-all duration-300 group-hover:border-slate-600 z-0 shadow-inner"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); if(error) setError(""); }}
                required
              />
              <label
                htmlFor="email"
                className="absolute left-4 top-2 text-slate-400 text-xs font-semibold uppercase tracking-wider transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-xs peer-focus:font-semibold peer-focus:uppercase peer-focus:text-indigo-400 pointer-events-none z-10 bg-[#111827] px-1.5 rounded"
              >
                Email Address
              </label>
            </div>

            {/* INPUT 2: PASSWORD */}
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="peer w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 pt-6 pb-2 text-white font-medium placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-transparent transition-all duration-300 pr-12 group-hover:border-slate-600 z-0 shadow-inner"
                placeholder="Password"
                value={form.password}
                onChange={(e) => { setForm({ ...form, password: e.target.value }); if(error) setError(""); }}
                required
              />
              <label
                htmlFor="password"
                className="absolute left-4 top-2 text-slate-400 text-xs font-semibold uppercase tracking-wider transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-xs peer-focus:font-semibold peer-focus:uppercase peer-focus:text-indigo-400 pointer-events-none z-10 bg-[#111827] px-1.5 rounded"
              >
                Password
              </label>
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 p-1 text-slate-400 hover:text-white transition-colors focus:outline-none z-20"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/45 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 mt-2 text-base"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400 border-t border-slate-800/80 pt-6">
            New to Taskora?{" "}
            <span
              className="text-indigo-400 font-bold hover:text-indigo-300 cursor-pointer transition-colors inline-flex items-center gap-1 hover:underline"
              onClick={() => navigate("/register")}
            >
              Create Free Account →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;