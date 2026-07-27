import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Layout from './Layout';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, Trash, PencilSimple, Note as NoteIcon, 
  MagnifyingGlass, Tag, Calendar, Sparkle, X, 
  CheckCircle, FolderOpen, Info 
} from '@phosphor-icons/react';
import './PageStyles.css';

export default function MyNotes({ darkMode, toggleTheme }) {
  const [notes, setNotes] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Work',
    tagColor: '#6366f1'
  });

  const { showToast } = useAuth();
  const triggerToast = showToast || ((msg) => console.log(msg));

  const fetchNotes = async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
      triggerToast("Unable to synchronize notes repository.", "Connection Alert", "error");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const openNewNoteModal = () => {
    setEditingId(null);
    setFormData({ title: '', content: '', category: 'Work', tagColor: '#6366f1' });
    setIsModalOpen(true);
  };

  const openEditModal = (note) => {
    setEditingId(note._id);
    setFormData({
      title: note.title || '',
      content: note.content || '',
      category: note.category || 'Work',
      tagColor: note.tagColor || '#6366f1'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/notes/${editingId}`, formData);
        triggerToast("Note memorandum updated in cloud vault.", "Memorandum Revised ⚡", "success");
      } else {
        await API.post("/notes", formData);
        triggerToast("New intelligence note archived successfully.", "Note Archived 📝", "success");
      }
      setIsModalOpen(false);
      fetchNotes();
    } catch (error) {
      console.error("Error saving note:", error);
      const errMsg = error.response?.data?.msg || error.response?.data?.message || "Could not publish memorandum.";
      triggerToast(errMsg, "Operation Failed", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/notes/${id}`);
      triggerToast("Memorandum permanently wiped from vault.", "Note Purged 🗑️", "error");
      setNotes(notes.filter(n => n._id !== id));
    } catch (err) {
      triggerToast("Failed to delete note record.", "Delete Error", "error");
    }
  };

  // Filter & Search Logic
  const filteredNotes = notes.filter(note => {
    const matchesCategory = categoryFilter === 'all' || (note.category && note.category.toLowerCase() === categoryFilter.toLowerCase());
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getCategoryTheme = (category) => {
    const c = (category || '').toLowerCase();
    if (c === 'work' || c === 'business') return 'badge-progress';
    if (c === 'personal' || c === 'home') return 'badge-completed';
    return 'badge-pending';
  };

  return (
    <Layout darkMode={darkMode} toggleTheme={toggleTheme}>
      <div className="my-tasks-wrapper">
        
        {/* =========================================================
            1. WORKSPACE COMMAND DECK HERO (NOTES EDITION)
            ========================================================= */}
        <section className="workspace-hero-deck" style={{ backgroundImage: 'radial-gradient(circle at 85% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 65%)' }}>
          <div className="hero-deck-left">
            <div className="deck-tag-pill" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
              <NoteIcon size={16} weight="fill" />
              <span>Executive Vault & Memorandums</span>
            </div>
            <h1 className="deck-title">
              Intelligence <span>Notes & Insights</span>
            </h1>
            <p className="deck-subtitle">
              Capture strategic brainstorming, architect meeting minutes, and organize high-priority knowledge in an encrypted digital vault.
            </p>
          </div>

          <div className="hero-deck-stats">
            <div className="mini-stat-card">
              <span className="mini-label">Total Vault</span>
              <strong className="mini-val">{notes.length}</strong>
            </div>
            <div className="mini-stat-card">
              <span className="mini-label">Work & Strategic</span>
              <strong className="mini-val text-amber">{notes.filter(n => (n.category || '').toLowerCase() === 'work').length}</strong>
            </div>
            <div className="mini-stat-card">
              <span className="mini-label">Personal Ideas</span>
              <strong className="mini-val text-emerald">{notes.filter(n => (n.category || '').toLowerCase() === 'personal').length}</strong>
            </div>
          </div>
        </section>

        {/* =========================================================
            2. INTERACTIVE CONTROLS & FILTER HUB
            ========================================================= */}
        <section className="controls-hub">
          <div className="search-studio">
            <MagnifyingGlass size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search intelligence memorandums..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="clear-search-btn">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="action-bar-right">
            <div className="filter-studio-tabs">
              <button className={`tab-pill ${categoryFilter === 'all' ? 'active' : ''}`} onClick={() => setCategoryFilter('all')}>
                All Folders
              </button>
              <button className={`tab-pill ${categoryFilter === 'work' ? 'active' : ''}`} onClick={() => setCategoryFilter('work')}>
                Work
              </button>
              <button className={`tab-pill ${categoryFilter === 'personal' ? 'active' : ''}`} onClick={() => setCategoryFilter('personal')}>
                Personal
              </button>
              <button className={`tab-pill ${categoryFilter === 'ideas' ? 'active' : ''}`} onClick={() => setCategoryFilter('ideas')}>
                Ideas
              </button>
            </div>

            <button className="btn-deploy-task" onClick={openNewNoteModal} style={{ background: 'linear-gradient(135deg, #a855f7 0%, #d946ef 100%)', boxShadow: '0 4px 15px rgba(168, 85, 247, 0.35)' }}>
              <Plus size={20} weight="bold" />
              <span>Archive Note</span>
            </button>
          </div>
        </section>

        {/* =========================================================
            3. LUXURY NOTE GRID PORTAL
            ========================================================= */}
        <div className="task-grid-premium">
          {filteredNotes.length === 0 ? (
            <div className="no-targets-state">
              <FolderOpen size={48} className="no-targets-icon" style={{ color: '#a855f7' }} />
              <h3>No Memorandums Discovered</h3>
              <p>Try resetting your filter terminology or click 'Archive Note' to record a new strategic insight.</p>
            </div>
          ) : (
            filteredNotes.map(note => (
              <div key={note._id} className="task-pod" style={{ borderLeft: `4px solid ${note.tagColor || '#a855f7'}` }}>
                
                {/* NOTE POD TOP SECTION */}
                <div className="pod-header">
                  <span className={`badge-pill ${getCategoryTheme(note.category)}`} style={{ fontSize: '0.74rem' }}>
                    <Tag size={13} weight="fill" />
                    {note.category || 'General'}
                  </span>

                  <div className="pod-quick-actions">
                    <button onClick={() => openEditModal(note)} className="icon-action-btn edit-btn" title="Revise note content">
                      <PencilSimple size={18} weight="bold" />
                    </button>
                    <button onClick={() => handleDelete(note._id)} className="icon-action-btn del-btn" title="Purge memorandum from vault">
                      <Trash size={18} weight="bold" />
                    </button>
                  </div>
                </div>

                {/* NOTE POD BODY SECTION */}
                <div className="pod-body" style={{ minHeight: '80px' }}>
                  <h3 className="pod-title">{note.title}</h3>
                  <p className="pod-desc" style={{ whiteSpace: 'pre-line' }}>{note.content}</p>
                </div>

                {/* NOTE POD FOOTER SECTION */}
                <div className="pod-footer" style={{ borderTop: '1px dashed var(--border)' }}>
                  <div className="pod-meta">
                    <Calendar size={16} weight="bold" />
                    <span>Archived {formatDate(note.createdAt || note.updatedAt)}</span>
                  </div>
                  
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Encrypted Vault
                  </span>
                </div>

              </div>
            ))
          )}
        </div>

        {/* =========================================================
            4. ARCHIVE NOTE MODAL DIALOGUE
            ========================================================= */}
        {isModalOpen && (
          <div className="modal-portal-backdrop" onClick={() => setIsModalOpen(false)}>
            <div className="modal-command-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-line">
                <h3>{editingId ? "Revise Memorandum" : "Archive Intelligence Note"}</h3>
                <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                  <X size={22} weight="bold" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-studio-form">
                <div className="form-group-item">
                  <label>Memorandum Title *</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter concise title..." 
                    required 
                  />
                </div>

                <div className="form-group-item">
                  <label>Content & Strategic Insights *</label>
                  <textarea 
                    rows="6" 
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Document full intelligence briefing, checklists, or ideas..."
                    required
                  ></textarea>
                </div>

                <div className="form-row-twin">
                  <div className="form-group-item">
                    <label>Folder Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Work">Work & Strategic 🏢</option>
                      <option value="Personal">Personal & Home 🏠</option>
                      <option value="Ideas">Innovation Ideas 💡</option>
                    </select>
                  </div>

                  <div className="form-group-item">
                    <label>Accent Tag Color</label>
                    <div style={{ display: 'flex', gap: '8px', paddingTop: '6px' }}>
                      {['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#ef4444'].map(col => (
                        <div 
                          key={col}
                          onClick={() => setFormData({ ...formData, tagColor: col })}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: col,
                            cursor: 'pointer',
                            border: formData.tagColor === col ? '3px solid #ffffff' : '1px solid transparent',
                            boxShadow: formData.tagColor === col ? '0 0 10px rgba(255,255,255,0.6)' : 'none',
                            transition: 'all 0.2s'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="modal-form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit-studio" style={{ background: 'linear-gradient(135deg, #a855f7 0%, #d946ef 100%)' }}>
                    <Sparkle size={18} weight="fill" />
                    <span>{editingId ? "Save Revisions ⚡" : "Publish Note 📝"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}