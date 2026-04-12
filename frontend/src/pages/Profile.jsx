import React, { useState, useEffect } from 'react';
import { User, Lock, Trash, Camera, Check, CaretRight, Shield, Envelope } from '@phosphor-icons/react';
import API from '../services/api'; // Ensure this path is correct
import { useAuth } from '../context/AuthContext'; // Ensure this path is correct
import Layout from './Layout'; // Ensure this path is correct
import './Profile.css';
import "../App.css"; 
export default function Profile({ darkMode, toggleTheme }) {
  const { user, updateUser, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [profileData, setProfileData] = useState({ name: '', img: '' });
  const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name || '', img: user.img || '' });
    }
  }, [user]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  // 1. UPDATE PROFILE (Name & Photo)
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.put("/auth/profile", { name: profileData.name, img: profileData.img });
      updateUser(res.data.user);
      showToast("Profile updated successfully!");
    } catch (error) {
      console.error("Error Details:", error);
      
      let errorMsg = "Failed to update profile.";
      
      if (error.response && error.response.data) {
        if (error.response.data.msg) {
          errorMsg = error.response.data.msg;
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }

      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProfileData({ ...profileData, img: reader.result });
      };
    }
  };

  // 2. CHANGE PASSWORD
  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passData.new !== passData.confirm) {
      showToast("Passwords do not match", "error");
      return;
    }
    setLoading(true);
    try {
      await API.put("/auth/change-password", {
        currentPassword: passData.current,
        newPassword: passData.new
      });
      showToast("Password changed successfully!");
      setPassData({ current: '', new: '', confirm: '' });
    } catch (error) {
      const msg = error.response?.data?.msg || "Failed to change password";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  // 3. DELETE ACCOUNT
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This cannot be undone.");
    if (confirmDelete) {
      try {
        await API.delete("/auth/delete-account");
        showToast("Account deleted. Logging out...", "success");
        setTimeout(() => {
          logout();
        }, 1500);
      } catch (error) {
        showToast("Failed to delete account.", "error");
      }
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'danger', label: 'Danger Zone', icon: Trash, color: 'red' },
  ];

  return (
    <Layout darkMode={darkMode} toggleTheme={toggleTheme}>
      <div className="profile-page-wrapper">
        
        {toast.show && (
          <div className={`profile-toast ${toast.type === 'error' ? 'profile-toast-error' : ''}`}>
            {toast.type === 'success' ? <Check size={20} weight="fill" /> : <Shield size={20} weight="fill" />}
            <span>{toast.message}</span>
          </div>
        )}

        <div className="settings-grid">
          
          <aside className="settings-sidebar">
            <h3>Settings</h3>
            <nav>
              {tabs.map(tab => (
                <button 
                  key={tab.id} 
                  className={`settings-nav-btn ${activeTab === tab.id ? 'active' : ''} ${tab.color === 'red' ? 'danger-text' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <div className="nav-left">
                    <tab.icon size={20} weight={activeTab === tab.id ? 'fill' : 'regular'} />
                    {tab.label}
                  </div>
                  {activeTab === tab.id && <CaretRight size={16} weight="bold" />}
                </button>
              ))}
            </nav>
          </aside>

          <main className="settings-main">
            
            {activeTab === 'general' && (
              <div className="settings-card animate-fade">
                <div className="card-header">
                  <h2>General Information</h2>
                  <p>Update your photo and personal details here.</p>
                </div>

                <form onSubmit={handleProfileSave} className="profile-form">
                  <div className="photo-upload-section">
                    {/* This div enforces the round shape via CSS */}
                    <div className="avatar-circle-large">
                      {profileData.img ? (
                        <img src={profileData.img} alt="Profile" />
                      ) : (
                        <User size={40} />
                      )}
                    </div>
                    
                    <div className="upload-controls">
                      <label className="custom-file-upload">
                        <Camera size={18} /> Change Photo
                        <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                      </label>
                      <button 
                        type="button" 
                        onClick={() => setProfileData({...profileData, img: ''})} 
                        className="text-xs text-red-500 hover-underline"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: 'fit-content', textAlign: 'left' }}
                      >
                        Remove Photo
                      </button>
                    </div>
                  </div>

                  <div className="form-rows">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        value={profileData.name} 
                        onChange={e => setProfileData({...profileData, name: e.target.value})}
                        className="input-control"
                      />
                    </div>

                    <div className="form-group">
                      <label>Email Address</label>
                      <div className="input-wrapper-disabled">
                        <Envelope size={18} />
                        <input type="text" value={user?.email} disabled />
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-save" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="settings-card animate-fade">
                <div className="card-header">
                  <h2>Security</h2>
                  <p>Manage your password and account security.</p>
                </div>

                <form onSubmit={handlePasswordSave} className="profile-form">
                  <div className="form-group">
                    <label>Current Password</label>
                    <input 
                      type="password" 
                      value={passData.current}
                      onChange={e => setPassData({...passData, current: e.target.value})}
                      className="input-control"
                      required
                    />
                  </div>

                  <div className="form-rows">
                    <div className="form-group">
                      <label>New Password</label>
                      <input 
                        type="password" 
                        value={passData.new}
                        onChange={e => setPassData({...passData, new: e.target.value})}
                        className="input-control"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input 
                        type="password" 
                        value={passData.confirm}
                        onChange={e => setPassData({...passData, confirm: e.target.value})}
                        className="input-control"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-save" disabled={loading}>
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'danger' && (
              <div className="settings-card animate-fade danger-zone-card">
                <div className="card-header">
                  <h2 className="text-danger">Danger Zone</h2>
                  <p>Irreversible and destructive actions.</p>
                </div>

                <div className="danger-box">
                  <div className="danger-info">
                    <h3>Delete Account</h3>
                    <p>Once you delete your account, there is no going back. Please be certain.</p>
                  </div>
                  <button className="btn-delete-acc" onClick={handleDeleteAccount}>
                    Delete Account
                  </button>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </Layout>
  );
}

// import React, { useState, useEffect } from 'react';
// import Layout from './Layout'; // Make sure the path is correct
// import { Stack, Hourglass, CheckCircle, TrendUp } from '@phosphor-icons/react';
// import { 
//   PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
//   CartesianGrid, Tooltip, Legend, ResponsiveContainer 
// } from 'recharts';
// // No need to import CSS here if it's imported in Layout or globally, 
// // but good to keep consistent.

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// // Mock Data for demonstration
// const MOCK_TASKS = [
//   { _id: 1, title: 'Design Review', status: 'completed', priority: 'high' },
//   { _id: 2, title: 'Q3 Report', status: 'progress', priority: 'high' },
//   { _id: 3, title: 'Email Marketing', status: 'pending', priority: 'medium' },
//   { _id: 4, title: 'Fix Login Bug', status: 'pending', priority: 'high' },
//   { _id: 5, title: 'Update Documentation', status: 'completed', priority: 'low' },
//   { _id: 6, title: 'Client Meeting', status: 'pending', priority: 'medium' },
//   { _id: 7, title: 'Server Migration', status: 'progress', priority: 'high' },
//   { _id: 8, title: 'Team Lunch', status: 'completed', priority: 'low' },
// ];

// export default function Dashboard() {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [darkMode, setDarkMode] = useState(false);
  
//   // Mock User
//   const user = { id: 'u1', name: 'Alex Morgan', role: 'Admin' };

//   const toggleTheme = () => setDarkMode(!darkMode);

//   const fetchTasks = async () => {
//     try {
//       setLoading(true);
//       // TODO: Replace with your actual API call
//       // const res = await API.get("/tasks"); 
//       // setTasks(res.data);
      
//       // Simulating API delay
//       await new Promise(resolve => setTimeout(resolve, 800));
//       setTasks(MOCK_TASKS); 
//     } catch (error) {
//       console.error("Error fetching tasks:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const stats = {
//     total: tasks.length,
//     pending: tasks.filter(t => t.status === 'pending').length,
//     progress: tasks.filter(t => t.status === 'progress').length,
//     completed: tasks.filter(t => t.status === 'completed').length,
//   };

//   const statusData = [
//     { name: 'Pending', value: stats.pending },
//     { name: 'In Progress', value: stats.progress },
//     { name: 'Completed', value: stats.completed },
//   ].filter(item => item.value > 0);

//   const priorityCounts = tasks.reduce((acc, task) => {
//     acc[task.priority] = (acc[task.priority] || 0) + 1;
//     return acc;
//   }, {});

//   const priorityData = [
//     { name: 'Low', count: priorityCounts.low || 0 },
//     { name: 'Medium', count: priorityCounts.medium || 0 },
//     { name: 'High', count: priorityCounts.high || 0 },
//   ];

//   return (
//     <Layout darkMode={darkMode} toggleTheme={toggleTheme} user={user}>
//       {loading ? (
//         <div className="loading-state">Loading Dashboard...</div>
//       ) : (
//         <div className="dashboard-view">
          
//           {/* STATS GRID */}
//           <div className="stats-grid">
//             <div className="stat-card">
//               <div className="stat-icon icon-blue"><Stack size={24} /></div>
//               <div><h3>{stats.total}</h3><p>Total Tasks</p></div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-icon icon-yellow"><Hourglass size={24} /></div>
//               <div><h3>{stats.pending + stats.progress}</h3><p>Pending</p></div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-icon icon-green"><CheckCircle size={24} /></div>
//               <div><h3>{stats.completed}</h3><p>Completed</p></div>
//             </div>
//           </div>

//           {/* CHARTS CONTAINER */}
//           <div className="charts-container">
//             {/* Pie Chart */}
//             <div className="chart-card">
//               <h3><TrendUp size={20} /> Task Status</h3>
//               <div style={{ width: '100%', height: 300 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={statusData}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       label={(entry) => `${entry.name} (${entry.value})`}
//                       outerRadius={80}
//                       fill="#8884d8"
//                       dataKey="value"
//                     >
//                       {statusData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             {/* Bar Chart */}
//             <div className="chart-card">
//               <h3><TrendUp size={20} /> Priority Distribution</h3>
//               <div style={{ width: '100%', height: 300 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={priorityData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="count" fill="#8884d8" radius={[10, 10, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </Layout>
//   );
// }

