import React, { useState, useEffect } from 'react';
import { X, PencilSimple, UploadSimple } from '@phosphor-icons/react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import './EditProfile.css';

export default function EditProfile({ isOpen, onClose }) {
  const { user, setUser } = useAuth();
  const [name, setName] = useState('');
  const [img, setImg] = useState('');
  const [loading, setLoading] = useState(false);

  // Jab modal khule, toh current user data fill karein
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setImg(user.img || '');
    }
  }, [user, isOpen]);

  // Image Upload ko Base64 mein convert karne ka function
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImg(reader.result); // Base64 string set karein
      };
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.put("/auth/profile", { name, img });
      
      // Context update karein taaki sidebar turant update ho
      setUser(res.data.user);
      onClose();
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Profile</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSave} className="profile-form">
          {/* Avatar Preview */}
          <div className="avatar-upload">
            <div className="avatar-preview-large">
              {img ? (
                <img src={img} alt="Preview" />
              ) : (
                <span>{name ? name.charAt(0).toUpperCase() : 'U'}</span>
              )}
            </div>
            <label className="upload-btn">
              <UploadSimple size={20} /> Change Photo
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </label>
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="form-input"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}