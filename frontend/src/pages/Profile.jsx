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

export default function Profile({ darkMode, toggleTheme }) {
  const { user, login, showToast } = useAuth();

  // Navigation Studio Tab (general | security | danger)
  const [activeTab, setActiveTab] = useState('general');

  // General Profile Identity State
  const [generalForm, setGeneralForm] = useState({
    name: '',
    email: '',
    img: ''
  });
  const [isUpdatingGeneral, setIsUpdatingGeneral] = useState(false);

  // Security & Password Calibration State
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingSecurity, setIsUpdatingSecurity] = useState(false);

  const triggerToast = showToast || ((msg) => console.log(msg));

  useEffect(() => {
    if (user) {
      setGeneralForm({
        name: user.name || '',
        email: user.email || '',
        img: user.img || ''
      });
    }
  }, [user]);

  // Handle General Profile Updates
  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingGeneral(true);
    try {
      const res = await API.put("/auth/profile", generalForm);
      if (res.data && res.data.user) {
        login(res.data.user, localStorage.getItem('token'));
      } else {
        login({ ...user, ...generalForm }, localStorage.getItem('token'));
      }
      triggerToast("Your workspace profile parameters have been successfully synchronized.", "Profile Studio Calibrated ✨", "success");
    } catch (err) {
      console.error("General profile update error:", err);
      triggerToast(
        err.response?.data?.message || "Could not save changes. Verify network status and try again.", 
        "Synchronization Error", 
        "error"
      );
    } finally {
      setIsUpdatingGeneral(false);
    }
  };

  // Handle Security Password Calibration
  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    if (!securityForm.currentPassword || !securityForm.newPassword) {
      triggerToast("Please provide both current and new security credentials.", "Missing Credentials", "info");
      return;
    }
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      triggerToast("New password values do not match.", "Verification Warning", "error");
      return;
    }
    if (securityForm.newPassword.length < 6) {
      triggerToast("Security standards require a password length of at least 6 characters.", "Weak Password", "error");
      return;
    }

    setIsUpdatingSecurity(true);
    try {
      await API.put("/auth/password", {
        currentPassword: securityForm.currentPassword,
        newPassword: securityForm.newPassword
      });
      triggerToast("Your security clearance credentials have been updated.", "Security Upgraded 🔒", "success");
      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error("Password change error:", err);
      triggerToast(
        err.response?.data?.message || "Password authorization failed. Please check your current password.", 
        "Security Alert", 
        "error"
      );
    } finally {
      setIsUpdatingSecurity(false);
    }
  };

  // Handle Workspace Account Destruction
  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(
      "⚠️ EXTREME CAUTION: This will permanently wipe your user profile, active tasks, and encrypted notes from the repository. Proceed?"
    );
    if (!isConfirmed) return;

    try {
      await API.delete("/auth/profile");
      triggerToast("Workspace account terminated. Purging credentials...", "Farewell 🏁", "error");
      setTimeout(() => {
        localStorage.clear();
        window.location.href = '/';
      }, 1500);
    } catch (err) {
      console.error("Account termination error:", err);
      triggerToast("Could not process account termination at this time.", "Error Terminating", "error");
    }
  };

  const getInitial = () => {
    if (!user) return 'E';
    const name = user.name || user.email || 'Executive';
    return name.charAt(0).toUpperCase();
  };

  return (
    <Layout darkMode={darkMode} toggleTheme={toggleTheme}>
      <div className="profile-studio-wrapper">
        
        {/* =========================================================
            1. EXECUTIVE HERO COMMAND DECK
            ========================================================= */}
        <section className="profile-hero-deck">
          <div className="profile-hero-left">
            <div className="executive-badge">
              <Crown size={16} weight="fill" />
              <span>Executive Security & Identity Suite</span>
            </div>
            <h1 className="hero-profile-title">
              Account <span>Studio & Controls</span>
            </h1>
            <p className="hero-profile-subtitle">
              Manage your corporate identity parameters, upgrade cryptographic credentials, and govern repository authorizations.
            </p>
          </div>

          <div className="profile-kpi-deck">
            <div className="kpi-pod">
              <span className="kpi-label">Identity Status</span>
              <strong className="kpi-value text-emerald">
                <ShieldCheck size={24} weight="fill" /> Active
              </strong>
            </div>
            <div className="kpi-pod">
              <span className="kpi-label">Access Level</span>
              <strong className="kpi-value text-violet">
                <Lightning size={24} weight="fill" /> Tier 1
              </strong>
            </div>
            <div className="kpi-pod">
              <span className="kpi-label">Security Protocol</span>
              <strong className="kpi-value">256-Bit</strong>
            </div>
          </div>
        </section>

        {/* =========================================================
            2. PROFILE COMMAND WORKSPACE GRID
            ========================================================= */}
        <div className="profile-command-grid">
          
          {/* --- Left Command Nav Studio --- */}
          <aside className="profile-nav-studio">
            <button
              onClick={() => setActiveTab('general')}
              className={`studio-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
            >
              <div className="tab-content-wrap">
                <User size={20} weight={activeTab === 'general' ? "fill" : "bold"} />
                <span>Identity & Avatar</span>
              </div>
              <CaretRight size={18} weight="bold" />
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`studio-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            >
              <div className="tab-content-wrap">
                <Lock size={20} weight={activeTab === 'security' ? "fill" : "bold"} />
                <span>Security Clearance</span>
              </div>
              <CaretRight size={18} weight="bold" />
            </button>

            <button
              onClick={() => setActiveTab('danger')}
              className={`studio-tab-btn danger-tab ${activeTab === 'danger' ? 'active' : ''}`}
            >
              <div className="tab-content-wrap">
                <Trash size={20} weight="bold" />
                <span>Account Deletion</span>
              </div>
              <CaretRight size={18} weight="bold" />
            </button>
          </aside>

          {/* --- Right Content Workspace Deck --- */}
          <div className="profile-content-studio">
            
            {/* TAB 1: IDENTITY & AVATAR STUDIO */}
            {activeTab === 'general' && (
              <div>
                <div className="panel-section-header">
                  <div className="panel-title-wrap">
                    <h2>Executive Identity & Avatar</h2>
                    <p>Customize your personal showcase photograph, public identity moniker, and primary communication channel.</p>
                  </div>
                </div>

                <form onSubmit={handleGeneralSubmit} className="profile-form-studio">
                  
                  {/* AVATAR SHOWCASE STATION */}
                  <div className="avatar-showcase-station">
                    <div className="avatar-neon-halo">
                      {generalForm.img ? (
                        <img src={generalForm.img} alt="Avatar Preview" className="showcase-avatar-img" />
                      ) : (
                        <div className="showcase-avatar-placeholder">{getInitial()}</div>
                      )}
                      <div className="avatar-upload-trigger" title="Live image rendering active">
                        <Camera size={16} weight="fill" />
                      </div>
                    </div>

                    <div className="avatar-guidance-box" style={{ flex: 1, minWidth: '220px' }}>
                      <h4>Digital Showcase Photograph</h4>
                      <p>Provide a direct secure web URL (e.g. Unsplash or GitHub avatar) to personalize your workspace brand identity.</p>
                      <div className="input-with-icon">
                        <Camera size={18} className="input-prefix-icon" />
                        <input
                          type="url"
                          placeholder="Paste secure image link (https://...)"
                          value={generalForm.img}
                          onChange={(e) => setGeneralForm({ ...generalForm, img: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* FORM TWIN FIELDS */}
                  <div className="form-grid-twin">
                    <div className="input-capsule">
                      <label htmlFor="user-name-input">
                        <User size={16} weight="bold" /> Full Executive Moniker *
                      </label>
                      <div className="input-with-icon">
                        <User size={18} className="input-prefix-icon" />
                        <input
                          id="user-name-input"
                          type="text"
                          required
                          value={generalForm.name}
                          onChange={(e) => setGeneralForm({ ...generalForm, name: e.target.value })}
                          placeholder="e.g. Trupti Parmar"
                        />
                      </div>
                    </div>

                    <div className="input-capsule">
                      <label htmlFor="user-email-input">
                        <Envelope size={16} weight="bold" /> Communication Address *
                      </label>
                      <div className="input-with-icon">
                        <Envelope size={18} className="input-prefix-icon" />
                        <input
                          id="user-email-input"
                          type="email"
                          required
                          value={generalForm.email}
                          onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })}
                          placeholder="e.g. executive@workspace.dev"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="profile-action-footer">
                    <button 
                      type="button" 
                      onClick={() => {
                        if (user) setGeneralForm({ name: user.name || '', email: user.email || '', img: user.img || '' });
                        triggerToast("Form reset to currently archived profile state.", "Reversed Revisions", "info");
                      }} 
                      className="btn-studio-secondary"
                    >
                      Discard Changes
                    </button>

                    <button type="submit" disabled={isUpdatingGeneral} className="btn-studio-primary">
                      {isUpdatingGeneral ? (
                        <><span>Synchronizing Vault...</span></>
                      ) : (
                        <>
                          <Sparkle size={18} weight="fill" />
                          <span>Commit Identity Updates</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* TAB 2: SECURITY CLEARANCE STUDIO */}
            {activeTab === 'security' && (
              <div>
                <div className="panel-section-header">
                  <div className="panel-title-wrap">
                    <h2>Cryptographic Clearance & Credentials</h2>
                    <p>Upgrade your authentication password to preserve strict security across your workspace and cloud tasks.</p>
                  </div>
                </div>

                <form onSubmit={handleSecuritySubmit} className="profile-form-studio">
                  <div style={{ padding: '1.25rem 1.5rem', background: 'var(--bg-accent-subtle)', borderRadius: '14px', borderLeft: '4px solid var(--primary)', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '700', fontSize: '0.92rem', marginBottom: '4px' }}>
                      <Shield size={18} weight="fill" />
                      <span>Zero-Knowledge Security Standard</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                      Your credentials are cryptographically hashed using advanced salting protocols before persisting to the cluster.
                    </p>
                  </div>

                  <div className="input-capsule">
                    <label htmlFor="current-pass-input">
                      <Key size={16} weight="bold" /> Current Secret Key *
                    </label>
                    <div className="input-with-icon">
                      <Lock size={18} className="input-prefix-icon" />
                      <input
                        id="current-pass-input"
                        type={showCurrentPassword ? "text" : "password"}
                        required
                        value={securityForm.currentPassword}
                        onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                        placeholder="Enter currently active password..."
                      />
                      <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="password-eye-toggle" title="Toggle password visibility">
                        {showCurrentPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-grid-twin">
                    <div className="input-capsule">
                      <label htmlFor="new-pass-input">
                        <Lock size={16} weight="bold" /> New Secret Key *
                      </label>
                      <div className="input-with-icon">
                        <Lock size={18} className="input-prefix-icon" />
                        <input
                          id="new-pass-input"
                          type={showNewPassword ? "text" : "password"}
                          required
                          value={securityForm.newPassword}
                          onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                          placeholder="Min. 6 characters required..."
                        />
                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="password-eye-toggle" title="Toggle password visibility">
                          {showNewPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div className="input-capsule">
                      <label htmlFor="confirm-pass-input">
                        <CheckCircle size={16} weight="bold" /> Confirm Secret Key *
                      </label>
                      <div className="input-with-icon">
                        <Lock size={18} className="input-prefix-icon" />
                        <input
                          id="confirm-pass-input"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={securityForm.confirmPassword}
                          onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                          placeholder="Re-type new password..."
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="password-eye-toggle" title="Toggle password visibility">
                          {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="profile-action-footer">
                    <button type="submit" disabled={isUpdatingSecurity} className="btn-studio-primary">
                      {isUpdatingSecurity ? (
                        <><span>Upgrading Security...</span></>
                      ) : (
                        <>
                          <ShieldCheck size={18} weight="fill" />
                          <span>Upgrade Cryptographic Credentials</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 3: ACCOUNT DESTRUCT DANGER ZONE */}
            {activeTab === 'danger' && (
              <div>
                <div className="panel-section-header">
                  <div className="panel-title-wrap">
                    <h2 style={{ color: 'var(--danger)' }}>Account Destruction Station</h2>
                    <p>Execute permanent termination of your user clearance and obliterate all archived milestones.</p>
                  </div>
                </div>

                <div className="danger-zone-container">
                  <div className="danger-info-block">
                    <h3>
                      <WarningCircle size={26} weight="fill" />
                      Irreversible Termination Protocol
                    </h3>
                    <p>
                      Initiating account destruction will purge your profile, remove cryptographic authorizations, and permanently erase all task records from our cloud database. This operation cannot be undone.
                    </p>
                  </div>

                  <button onClick={handleDeleteAccount} className="btn-destroy-workspace">
                    <Trash size={20} weight="bold" />
                    <span>Obliterate Workspace Account</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </Layout>
  );
}
