// import { useState } from "react";
// import API from "../services/api";
// import { useNavigate } from "react-router-dom";

// function Register() {
//   const [form, setForm] = useState({ name: "", email: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await API.post("/auth/register", form);
//       navigate("/");
//     } catch {
//       setError("Registration failed");
//     }
//   };

//   return (
//     <div className="h-screen flex">
      
//       {/* Left Side */}
//       <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 text-white items-center justify-center">
//         <div>
//           <h1 className="text-4xl font-bold mb-3">Welcome 🚀</h1>
//           <p className="text-lg">Create your account and start your journey</p>
//         </div>
//       </div>

//       {/* Right Side */}
//       <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100">
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white p-8 rounded-2xl shadow-lg w-96"
//         >
//           <h2 className="text-2xl font-bold mb-6 text-center">
//             Create Account
//           </h2>

//           {error && <p className="text-red-500 text-sm">{error}</p>}

//           <input
//             type="text"
//             placeholder="Full Name"
//             className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-400 outline-none"
//             onChange={(e) =>
//               setForm({ ...form, name: e.target.value })
//             }
//           />

//           <input
//             type="email"
//             placeholder="Email"
//             className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-400 outline-none"
//             onChange={(e) =>
//               setForm({ ...form, email: e.target.value })
//             }
//           />

//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               className="w-full p-3 border rounded-lg mb-2 focus:ring-2 focus:ring-indigo-400 outline-none"
//               onChange={(e) =>
//                 setForm({ ...form, password: e.target.value })
//               }
//             />
//             <span
//               className="absolute right-3 top-3 cursor-pointer"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               👁️
//             </span>
//           </div>

//           <button className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition">
//             Register
//           </button>

//           <p className="text-center mt-4 text-sm">
//             Already have an account?{" "}
//             <span
//               className="text-indigo-600 cursor-pointer"
//               onClick={() => navigate("/")}
//             >
//               Login
//             </span>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Register;

import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import TaskoraLogo from "../components/TaskoraLogo";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      navigate("/");
    } catch {
      setError("Registration failed");
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
            Create your account and start your journey with us today.
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
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h2>
            <p className="text-slate-400 text-sm">Join us and manage your tasks seamlessly.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Error Message */}
            {error && <p className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded-lg border border-red-900/50">{error}</p>}

            {/* INPUT 1: FULL NAME */}
            <div className="relative group">
              <input
                type="text"
                id="name"
                className="peer w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 pt-6 pb-2 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 z-0"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <label
                htmlFor="name"
                className="absolute left-4 top-2.5 text-slate-400 text-sm transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:text-xs pointer-events-none z-10 bg-[#0B0F19] peer-placeholder-shown:bg-transparent px-1 rounded"
              >
                Full Name
              </label>
            </div>

            {/* INPUT 2: EMAIL */}
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

            {/* INPUT 3: PASSWORD */}
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
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
            >
              Register
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <span
              className="text-white font-bold hover:text-indigo-400 cursor-pointer transition-colors"
              onClick={() => navigate("/")}
            >
              Login
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

export default Register;