import React, { useState, useEffect } from 'react';
import { 
  User, Lock, Trash, Camera, CheckCircle, CaretRight, Shield, 
  Envelope, Sparkle, ShieldCheck, Key, WarningCircle, Lightning, 
  XCircle, Info, Crown, Eye, EyeSlash
} from '@phosphor-icons/react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import './Profile.css';
import './PageStyles.css'; // Access global luxury toast tokens

export default function Profile({ darkMode, toggleTheme }) {
  const { user, updateUser, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, title: '', message: '', type: 'success' });

  const [profileData, setProfileData] = useState({ name: '', img: '' });
  const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name || '', img: user.img || '' });
    }
  }, [user]);

  const showToast = (title, message, type = 'success') => {
    setToast({ show: true, title, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3500);
  };

  // 1. UPDATE PROFILE DETAILS (Name & Photo)
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.put("/auth/profile", { name: profileData.name.trim(), img: profileData.img });
      updateUser(res.data.user);
      showToast("Identity Synchronized ⚡", "Your profile credentials and avatar have been saved to cloud storage.", "success");
    } catch (error) {
      console.error("Error Details:", error);
      let errorMsg = "Unable to sync identity credentials with server.";
      if (error.response?.data?.msg) errorMsg = error.response.data.msg;
      else if (error.response?.data?.message) errorMsg = error.response.data.message;
      else if (error.message) errorMsg = error.message;

      showToast("Sync Failed", errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("File Too Large", "Please pick an image smaller than 5MB.", "error");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, img: reader.result }));
        showToast("Photo Selected 📷", "Click 'Synchronize Identity' below to publish your new avatar.", "info");
      };
    }
  };

  // 2. CHANGE PASSWORD PROTOCOLS
  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passData.new !== passData.confirm) {
      showToast("Verification Error", "New passwords do not match. Please verify character entry.", "error");
      return;
    }
    if (passData.new.length < 6) {
      showToast("Security Standard", "New password must contain at least 6 characters.", "error");
      return;
    }
    setLoading(true);
    try {
      await API.put("/auth/change-password", {
        currentPassword: passData.current,
        newPassword: passData.new
      });
      showToast("Security Calibrated 🔐", "Authentication credentials successfully updated across active sessions.", "success");
      setPassData({ current: '', new: '', confirm: '' });
    } catch (error) {
      const msg = error.response?.data?.msg || "Failed to alter security credentials. Verify current password.";
      showToast("Authentication Denied", msg, "error");
    } finally {
      setLoading(false);
    }
  };

  // 3. TERMINATE ACCOUNT PROTOCOLS
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("⚠️ HIGH ALERT: Are you absolutely certain you want to permanently terminate your account and wipe all workspace records? This action is irreversible.");
    if (confirmDelete) {
      try {
        await API.delete("/auth/delete-account");
        showToast("Account Purged 🗑️", "Terminating active sessions and clearing cloud cache...", "success");
        setTimeout(() => {
          logout();
        }, 1800);
      } catch (error) {
        showToast("Termination Error", "Could not complete account deletion protocol at this moment.", "error");
      }
    }
  };

  const tabs = [
    { id: 'general', label: 'Personal Identity & Avatar', icon: User },
    { id: 'security', label: 'Password & Authentication', icon: ShieldCheck },
    { id: 'danger', label: 'Danger & Archive Command', icon: Trash, danger: true },
  ];

  const getInitial = () => {
    const name = profileData.name || user?.name || user?.email || 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <Layout darkMode={darkMode} toggleTheme={toggleTheme}>
      <div className="profile-page-wrapper">
        
        {/* =========================================================
            1. EXECUTIVE HERO COMMAND DECK
            ========================================================= */}
        <section className="profile-hero-deck">
          <div className="profile-hero-left">
            <div className="profile-badge-pill">
              <Crown size={16} weight="fill" />
              <span>Executive Account Studio</span>
            </div>
            <h1 className="profile-hero-title">
              Profile & <span>Security Command</span>
            </h1>
            <p>Manage personal identity credentials, calibrate multi-layer authentication security protocols, and configure workspace avatar presence.</p>
          </div>

          <div className="profile-hero-stats">
            <div className="profile-pod">
              <span>Identity State</span>
              <strong className="pod-status-verified">Verified ⚡</strong>
            </div>
            <div className="profile-pod">
              <span>Security Shield</span>
              <strong className="pod-status-enhanced">Enhanced 🛡️</strong>
            </div>
            <div className="profile-pod">
              <span>Vault Access</span>
              <strong className="pod-status-active">Active 🌟</strong>
            </div>
          </div>
        </section>

        {/* =========================================================
            2. SETTINGS COMMAND GRID & NAVIGATION BAR
            ========================================================= */}
        <div className="settings-command-grid">
          
          <aside className="settings-nav-sidebar">
            <h3>Command Navigation</h3>
            <nav>
              {tabs.map(tab => (
                <button 
                  key={tab.id} 
                  className={`settings-pill-btn ${activeTab === tab.id ? 'active' : ''} ${tab.danger ? 'danger-pill' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <div className="nav-pill-left">
                    <tab.icon size={20} weight={activeTab === tab.id ? 'fill' : 'bold'} />
                    <span>{tab.label}</span>
                  </div>
                  {activeTab === tab.id && <CaretRight size={18} weight="bold" />}
                </button>
              ))}
            </nav>
          </aside>

          <main className="settings-main-area">
            
            {/* --- TAB 1: GENERAL INFORMATION & AVATAR STUDIO --- */}
            {activeTab === 'general' && (
              <div className="settings-studio-card">
                <div className="studio-card-header">
                  <h2>
                    <User size={28} weight="duotone" style={{ color: '#06b6d4' }} />
                    Personal Identity & Credentials
                  </h2>
                  <p>Customize your workspace representation, publish a custom neon avatar, and review authenticated contact parameters.</p>
                </div>

                <form onSubmit={handleProfileSave} className="profile-studio-form">
                  
                  {/* NEON HALO AVATAR SHOWCASE */}
                  <div className="photo-showcase-section">
                    <div className="avatar-neon-halo">
                      <div className="avatar-inner-circle">
                        {profileData.img ? (
                          <img src={profileData.img} alt="Executive Avatar" />
                        ) : (
                          <span>{getInitial()}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="photo-action-buttons">
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 4px', color: 'var(--text-primary)' }}>
                        Workspace Avatar Presence
                      </h4>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0 0 12px' }}>
                        Supports JPG, PNG, or GIF format. Optimal resolution 400x400px.
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <label className="btn-change-photo">
                          <Camera size={18} weight="bold" /> 
                          <span>Select Avatar Photo</span>
                          <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                        </label>

                        {profileData.img && (
                          <button 
                            type="button" 
                            onClick={() => {
                              setProfileData(prev => ({ ...prev, img: '' }));
                              showToast("Avatar Reset", "Default identity emblem applied. Click 'Synchronize' below to confirm.", "info");
                            }} 
                            className="btn-remove-photo"
                            title="Reset to initials emblem"
                          >
                            <Trash size={15} weight="bold" /> Remove Photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* FORM FIELDS GRID */}
                  <div className="profile-form-grid">
                    <div className="profile-field-group">
                      <label htmlFor="user-fullname">
                        <Sparkle size={16} weight="fill" style={{ color: '#a855f7' }} />
                        Executive Full Name
                      </label>
                      <input 
                        id="user-fullname"
                        type="text" 
                        value={profileData.name} 
                        onChange={e => setProfileData({...profileData, name: e.target.value})}
                        className="profile-studio-input"
                        placeholder="Enter your professional display name"
                        required
                      />
                    </div>

                    <div className="profile-field-group">
                      <label htmlFor="user-email-disabled">
                        <Envelope size={16} weight="fill" style={{ color: '#6366f1' }} />
                        Authenticated Primary Email
                      </label>
                      <div className="profile-input-disabled" title="Primary authentication email address cannot be modified directly for security compliance.">
                        <Lock size={18} style={{ color: '#6366f1', flexShrink: 0 }} />
                        <input id="user-email-disabled" type="text" value={user?.email || 'authenticated@workspace.dev'} disabled />
                      </div>
                    </div>
                  </div>

                  <div className="studio-form-actions">
                    <button type="submit" className="btn-studio-save" disabled={loading}>
                      <Lightning size={22} weight="fill" />
                      <span>{loading ? 'Synchronizing Data...' : 'Synchronize Identity ⚡'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* --- TAB 2: SECURITY & PASSWORD COMMAND --- */}
            {activeTab === 'security' && (
              <div className="settings-studio-card">
                <div className="studio-card-header">
                  <h2>
                    <ShieldCheck size={28} weight="duotone" style={{ color: '#10b981' }} />
                    Password & Security Calibration
                  </h2>
                  <p>Enhance workspace resilience by cycling your cryptographic login token and auditing session verification protocols.</p>
                </div>

                <form onSubmit={handlePasswordSave} className="profile-studio-form">
                  
                  <div className="security-notice-box">
                    <Info size={24} weight="fill" style={{ color: '#6366f1', flexShrink: 0 }} />
                    <div>
                      <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '3px' }}>Security Best Practice Recommendation</strong>
                      To safeguard executive tasks and notes, construct an alphanumeric password of at least 8 characters containing upper/lowercase symbols and numbers.
                    </div>
                  </div>

                  <div className="profile-field-group" style={{ maxWidth: '100%' }}>
                    <label htmlFor="pass-current">
                      <Key size={16} weight="fill" style={{ color: '#f59e0b' }} />
                      Current Authentication Password
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input 
                        id="pass-current"
                        type={showPassword.current ? "text" : "password"} 
                        value={passData.current}
                        onChange={e => setPassData({...passData, current: e.target.value})}
                        className="profile-studio-input"
                        style={{ paddingRight: '3.2rem' }}
                        placeholder="Enter current active account password"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(p => ({ ...p, current: !p.current }))}
                        style={{ position: 'absolute', right: '1.2rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        title={showPassword.current ? "Hide password" : "Show password"}
                      >
                        {showPassword.current ? <EyeSlash size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="profile-form-grid">
                    <div className="profile-field-group">
                      <label htmlFor="pass-new">
                        <Lock size={16} weight="fill" style={{ color: '#10b981' }} />
                        New Cryptographic Password
                      </label>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input 
                          id="pass-new"
                          type={showPassword.new ? "text" : "password"} 
                          value={passData.new}
                          onChange={e => setPassData({...passData, new: e.target.value})}
                          className="profile-studio-input"
                          style={{ paddingRight: '3.2rem' }}
                          placeholder="Construct new strong password"
                          required
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(p => ({ ...p, new: !p.new }))}
                          style={{ position: 'absolute', right: '1.2rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          {showPassword.new ? <EyeSlash size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div className="profile-field-group">
                      <label htmlFor="pass-confirm">
                        <Shield size={16} weight="fill" style={{ color: '#6366f1' }} />
                        Verify New Password
                      </label>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input 
                          id="pass-confirm"
                          type={showPassword.confirm ? "text" : "password"} 
                          value={passData.confirm}
                          onChange={e => setPassData({...passData, confirm: e.target.value})}
                          className="profile-studio-input"
                          style={{ paddingRight: '3.2rem' }}
                          placeholder="Re-type new password to verify"
                          required
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(p => ({ ...p, confirm: !p.confirm }))}
                          style={{ position: 'absolute', right: '1.2rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          {showPassword.confirm ? <EyeSlash size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="studio-form-actions">
                    <button type="submit" className="btn-studio-save" disabled={loading}>
                      <ShieldCheck size={22} weight="fill" />
                      <span>{loading ? 'Securing Vault...' : 'Calibrate Security 🔐'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* --- TAB 3: DANGER & ARCHIVE COMMAND --- */}
            {activeTab === 'danger' && (
              <div className="settings-studio-card danger-card-border">
                <div className="studio-card-header">
                  <h2>
                    <WarningCircle size={28} weight="duotone" style={{ color: '#ef4444' }} />
                    Danger & Archive Command
                  </h2>
                  <p>Execute irreversible account operations and manage terminal workspace data purging protocols.</p>
                </div>

                <div className="danger-studio-box">
                  <div className="danger-text-area">
                    <h3>Terminate Workspace Identity</h3>
                    <p>
                      Permanently delete your account profile, wipe all associated task repositories, notes, and cloud metadata. 
                      <strong> Once triggered, this protocol cannot be undone.</strong>
                    </p>
                  </div>
                  <button className="btn-delete-executive" onClick={handleDeleteAccount} title="Execute permanent account removal">
                    <Trash size={22} weight="bold" />
                    <span>Terminate Account</span>
                  </button>
                </div>
              </div>
            )}

          </main>
        </div>

        {/* =========================================================
            STATE-OF-THE-ART LUXURY GLASS TOAST SYSTEM
            ========================================================= */}
        {toast.show && (
          <div className="luxury-toast">
            <div className={`toast-badge-icon toast-${toast.type}-badge`}>
              {toast.type === 'success' && <CheckCircle size={24} weight="fill" />}
              {toast.type === 'error' && <XCircle size={24} weight="fill" />}
              {toast.type === 'info' && <Info size={24} weight="fill" />}
            </div>
            
            <div className="toast-details">
              <h4>{toast.title || (toast.type === 'error' ? 'Security Alert' : 'Success')}</h4>
              <p>{toast.message}</p>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
