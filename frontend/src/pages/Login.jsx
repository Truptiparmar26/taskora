// import { useState } from "react";
// import API from "../services/api";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import TaskoraLogo from "../components/TaskoraLogo"; 

// function Login() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const res = await API.post("/auth/login", form);
//       login(res.data);
//       navigate("/dashboard");
//     } catch (err) {
//       console.error(err);
//       alert("Login failed. Please check your credentials.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#0B0F19] text-white font-sans overflow-hidden relative">
      
//       {/* Background Glows */}
//       <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
//       <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

//       {/* --- LEFT SIDE (Desktop) --- */}
//       <div className="hidden md:flex w-1/2 flex-col justify-center items-center p-16 relative z-10">
//         <div className="max-w-lg space-y-8 text-center">
//           <div className="inline-flex justify-center mb-4">
//             <TaskoraLogo size={80} />
//           </div>
          
//           <h1 className="text-6xl font-bold tracking-tight text-white">
//             Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Taskora</span>
//           </h1>
//           <p className="text-xl text-slate-400 leading-relaxed">
//             The all-in-one platform to manage your tasks, notes, and daily workflow seamlessly.
//           </p>
//         </div>
//       </div>

//       {/* --- RIGHT SIDE (Form) --- */}
//       <div className="flex-1 w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10">
//         <div className="w-full max-w-[420px] bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl animate-fade-in-up">
          
//           {/* Mobile Logo */}
//           <div className="md:hidden flex justify-center mb-6">
//             <TaskoraLogo size={60} />
//           </div>

//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Sign In</h2>
//             <p className="text-slate-400 text-sm">Welcome back! Please enter your details.</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
            
//             {/* --- FIXED INPUT 1: EMAIL --- */}
//             <div className="relative group">
//               <input
//                 type="email"
//                 id="email"
//                 className="peer w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 pt-6 pb-2 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 z-0"
//                 placeholder="Email"
//                 value={form.email}
//                 onChange={(e) => setForm({ ...form, email: e.target.value })}
//                 required
//               />
//               <label
//                 htmlFor="email"
//                 // CSS LOGIC EXPLANATION:
//                 // 'top-2.5' = Default position (UP)
//                 // 'peer-placeholder-shown:top-4' = Move DOWN when empty
//                 // 'bg-[#0B0F19]' = Page color background (when UP)
//                 // 'peer-placeholder-shown:bg-transparent' = Transparent when DOWN (so it doesn't cover text)
//                 className="absolute left-4 top-2.5 text-slate-400 text-sm transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:text-xs pointer-events-none z-10 bg-[#0B0F19] peer-placeholder-shown:bg-transparent px-1 rounded"
//               >
//                 Email Address
//               </label>
//             </div>

//             {/* --- FIXED INPUT 2: PASSWORD --- */}
//             <div className="relative group">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 id="password"
//                 className="peer w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 pt-6 pb-2 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 pr-12 z-0"
//                 placeholder="Password"
//                 value={form.password}
//                 onChange={(e) => setForm({ ...form, password: e.target.value })}
//                 required
//               />
//               <label
//                 htmlFor="password"
//                 className="absolute left-4 top-2.5 text-slate-400 text-sm transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:text-xs pointer-events-none z-10 bg-[#0B0F19] peer-placeholder-shown:bg-transparent px-1 rounded"
//               >
//                 Password
//               </label>
              
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-4 top-3.5 text-slate-400 hover:text-white transition-colors focus:outline-none z-20"
//               >
//                 {showPassword ? (
//                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
//                 ) : (
//                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
//                 )}
//               </button>
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {isLoading ? "Signing in..." : "Sign In"}
//             </button>
//           </form>

//           <div className="mt-8 text-center text-sm text-slate-400">
//             Don't have an account?{" "}
//             <span
//               className="text-white font-bold hover:text-indigo-400 cursor-pointer transition-colors"
//               onClick={() => navigate("/register")}
//             >
//               Create Account
//             </span>
//           </div>
//         </div>
//       </div>

//       <style jsx global>{`
//         @keyframes fade-in-up {
//           0% { opacity: 0; transform: translateY(15px); }
//           100% { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
//       `}</style>
//     </div>
//   );
// }

// export default Login;

import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TaskoraLogo from "../components/TaskoraLogo"; 

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await API.post("/auth/login", form);
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // --- FIX 1: min-h-screen ko badal kar min-h-[100dvh] kiya (Mobile scroll fix) ---
    // --- FIX 2: overflow-y-auto add kiya taaki content jyada ho toh scroll ho ---
    <div className="min-h-[100dvh] w-full flex flex-col lg:flex-row bg-[#0B0F19] text-white font-sans relative overflow-y-auto">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* --- LEFT SIDE (Desktop Only) --- */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center p-16 relative z-10">
        <div className="max-w-lg space-y-8 text-center">
          <div className="inline-flex justify-center mb-4">
            <TaskoraLogo size={80} />
          </div>
          
          <h1 className="text-6xl font-bold tracking-tight text-white">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Taskora</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            The all-in-one platform to manage your tasks, notes, and daily workflow seamlessly.
          </p>
        </div>
      </div>

      {/* --- RIGHT SIDE (Form) --- */}
      <div className="flex-1 w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10 my-auto">
        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl animate-fade-in-up">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <TaskoraLogo size={60} />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Sign In</h2>
            <p className="text-slate-400 text-sm">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* INPUT 1: EMAIL */}
            <div className="relative group">
              <input
                type="email"
                id="email"
                className="peer w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 pt-6 pb-2 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 z-0"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <label
                htmlFor="email"
                className="absolute left-4 top-2.5 text-slate-400 text-sm transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:text-xs pointer-events-none z-10 bg-[#0B0F19] peer-placeholder-shown:bg-transparent px-1 rounded"
              >
                Email Address
              </label>
            </div>

            {/* INPUT 2: PASSWORD */}
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="peer w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 pt-6 pb-2 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 pr-12 z-0"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <label
                htmlFor="password"
                className="absolute left-4 top-2.5 text-slate-400 text-sm transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:text-xs pointer-events-none z-10 bg-[#0B0F19] peer-placeholder-shown:bg-transparent px-1 rounded"
              >
                Password
              </label>
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-white transition-colors focus:outline-none z-20"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <span
              className="text-white font-bold hover:text-indigo-400 cursor-pointer transition-colors"
              onClick={() => navigate("/register")}
            >
              Create Account
            </span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `}</style>
    </div>
  );
}

export default Login;