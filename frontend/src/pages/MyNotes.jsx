import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from "./Layout";
import API from "../services/api";
import { 
  MagnifyingGlass, Plus, PencilSimple, Trash, ArrowLeft, 
  PushPin, Note as NoteIcon, XCircle, CheckCircle, 
  Sparkle, Info, Lightning, Tag, Calendar, BookmarkSimple, Palette, BookOpen
} from '@phosphor-icons/react';
import './PageStyles.css'; 

export default function MyNotes({ darkMode, toggleTheme }) {  
  const navigate = useNavigate();
  
  // --- STATE MANAGEMENT ---
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'pinned' | 'tagged'
  const [search, setSearch] = useState('');
  const [view, setView] = useState('list'); 
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  
  // --- STATE-OF-THE-ART LUXURY TOAST STATE ---
  const [toast, setToast] = useState({ show: false, title: '', message: '', type: 'success' });
  
  // FORM STATE
  const [formData, setFormData] = useState({ 
    title: '', 
    content: '', 
    color: '#6366f1', 
    tags: '', 
    isPinned: false 
  });

  // --- LUXURY TOAST NOTIFICATION TRIGGER ---
  const showToast = (title, message, type = 'success') => {
    setToast({ show: true, title, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  // --- FETCH NOTES DATA ---
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await API.get("/notes"); 
      setNotes(res.data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      showToast("Sync Error", "Unable to load knowledge vault from server.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // --- VAULT STATS CALCULATION ---
  const stats = {
    total: notes.length,
    pinned: notes.filter(n => n.isPinned).length,
    tagged: notes.filter(n => n.tags && n.tags.length > 0).length
  };

  // --- NAVIGATION & FORM HELPERS ---
  const openAddNotePage = () => {
    setEditingNote(null);
    resetForm();
    setView('form');
  };

  const openEditPage = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title || '', 
      content: note.content || '', 
      color: note.color || '#6366f1', 
      tags: note.tags ? note.tags.join(', ') : '', 
      isPinned: Boolean(note.isPinned)
    });
    setView('form');
  };

  const resetForm = () => {
    setFormData({ 
      title: '', 
      content: '', 
      color: '#6366f1', 
      tags: '', 
      isPinned: false 
    });
  };

  const goBack = () => {
    setView('list');
    setEditingNote(null);
    resetForm();
  };

  // --- CRUD OPERATIONS ---
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = formData.tags
        .split(',')
        .map(t => t.trim().replace(/^#/, ''))
        .filter(t => t !== '');

      const dataToSend = { 
        ...formData, 
        title: formData.title.trim() || 'Untitled Idea',
        tags: tagsArray 
      };

      if (editingNote) {
        await API.put(`/notes/${editingNote._id}`, dataToSend);
        showToast("Vault Updated ⚡", "Your idea refinement has been saved to cloud storage.", "success");
      } else {
        await API.post("/notes", dataToSend);
        showToast("Idea Captured 🚀", "New note has been permanently secured in your knowledge vault.", "success");
      }
      fetchNotes();
      goBack();
    } catch (error) {
      console.error("Error saving note:", error);
      showToast("Operation Failed", "We encountered an error while saving your note. Please try again.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you certain you wish to permanently archive this vault note?')) {
      try {
        await API.delete(`/notes/${id}`);
        showToast("Note Archived 🗑️", "The specified idea has been removed from your vault.", "info");
        fetchNotes();
      } catch (error) {
        console.error("Error deleting note:", error);
        showToast("Deletion Failed", "Unable to delete note right now. Verify network status.", "error");
      }
    }
  };

  const togglePin = async (note) => {
    try {
      const updatedPinStatus = !note.isPinned;
      // Optimistic state update
      setNotes(prev => prev.map(n => n._id === note._id ? { ...n, isPinned: updatedPinStatus } : n));
      
      await API.put(`/notes/${note._id}`, { ...note, isPinned: updatedPinStatus });
      
      if (updatedPinStatus) {
        showToast("Pinned to Top Deck 📌", `"${note.title || 'Note'}" locked into high-visibility priority list.`, "success");
      } else {
        showToast("Unpinned Note", `"${note.title || 'Note'}" moved back to general vault.`, "info");
      }
    } catch (error) {
      console.error("Error updating pin:", error);
      showToast("Pin Failed", "Could not alter pin status.", "error");
      fetchNotes(); // Revert optimistic update
    }
  };

  // --- FILTERING, SEARCHING & SORTING ---
  const processedNotes = notes
    .filter(note => {
      const searchLower = search.toLowerCase();
      const matchesSearch = (note.title || '').toLowerCase().includes(searchLower) || 
                            (note.content || '').toLowerCase().includes(searchLower) ||
                            (note.tags && note.tags.some(t => t.toLowerCase().includes(searchLower)));
      
      if (filter === 'pinned') return matchesSearch && note.isPinned;
      if (filter === 'tagged') return matchesSearch && note.tags && note.tags.length > 0;
      return matchesSearch;
    })
    .sort((a, b) => {
      // Pinned always on top if viewing all
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      const dateA = new Date(a.createdAt || a.updatedAt || Date.now());
      const dateB = new Date(b.createdAt || b.updatedAt || Date.now());
      
      if (sortBy === 'oldest') return dateA - dateB;
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      return dateB - dateA; // default newest
    });

  // Pre-curated luxury accent colors for note decoration
  const colorThemes = [
    { name: 'Royal Indigo', hex: '#6366f1' },
    { name: 'Classic Cyan', hex: '#06b6d4' },
    { name: 'Vibrant Emerald', hex: '#10b981' },
    { name: 'Sunset Amber', hex: '#f59e0b' },
    { name: 'Neon Rose', hex: '#ec4899' },
    { name: 'Electric Purple', hex: '#a855f7' }
  ];

  return (
    <Layout darkMode={darkMode} toggleTheme={toggleTheme}>
      <div className="my-tasks-wrapper">
        
        {/* =========================================================
            VIEW 1: FUTURISTIC WORKSPACE NOTES DECK
            ========================================================= */}
        {view === 'list' && (
          <>
            {/* HERO ANALYTICS DECK */}
            <section className="workspace-hero-deck">
              <div className="hero-deck-left">
                <div className="hero-badge-pill">
                  <BookmarkSimple size={16} weight="fill" />
                  <span>Creative Hub & Knowledge Vault</span>
                </div>
                <h1 className="hero-main-title">
                  Smart <span>Notes & Ideas</span>
                </h1>
                <p>Capture brainstorms, architect technical documentation, pin high-priority insights, and retrieve knowledge at lightning speed.</p>
              </div>

              <div className="hero-deck-stats">
                <div className="kpi-pod pod-glow-cyan">
                  <span>Pinned Ideas</span>
                  <strong>{stats.pinned}</strong>
                </div>
                <div className="kpi-pod pod-glow-indigo">
                  <span>Total Vault</span>
                  <strong style={{ color: '#6366f1' }}>{stats.total}</strong>
                </div>
                <div className="kpi-pod pod-glow-red">
                  <span>Tagged Topics</span>
                  <strong style={{ color: '#ef4444' }}>{stats.tagged}</strong>
                </div>
              </div>
            </section>

            {/* CONTROL HUB & FILTERS BAR */}
            <div className="controls-hub">
              
              <div className="search-studio">
                <MagnifyingGlass className="search-icon" weight="bold" />
                <input 
                  type="text" 
                  placeholder="Search vault by headline, contents, or tags (#dev)..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                />
              </div>
              
              <div className="filter-studio-tabs">
                {[
                  { key: 'all', label: '🌟 All Vault Notes', icon: null },
                  { key: 'pinned', label: '📌 Pinned Only', icon: null },
                  { key: 'tagged', label: '🏷️ Tagged Items', icon: null }
                ].map(tab => (
                  <button 
                    key={tab.key} 
                    className={`pill-tab ${filter === tab.key ? 'active' : ''}`}
                    onClick={() => setFilter(tab.key)}
                  >
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="action-bar-right">
                <select 
                  className="studio-input" 
                  style={{ width: 'auto', minWidth: '160px', padding: '0.7rem 1rem', cursor: 'pointer', borderRadius: '12px', minHeight: '46px' }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  title="Sort note ordering"
                >
                  <option value="newest">⚡ Newest First</option>
                  <option value="oldest">📅 Oldest First</option>
                  <option value="title">🔤 Alphabetical (A-Z)</option>
                </select>

                <button className="btn-add-task-hero" onClick={openAddNotePage} title="Capture a new idea in vault">
                  <Plus size={22} weight="extrabold" />
                  <span>Capture Idea</span>
                </button>
              </div>

            </div>

            {/* ULTRA-VIBRANT NOTES CARDS GRID */}
            {loading ? (
              <div className="loading-state" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#a855f7', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <Sparkle size={28} weight="fill" className="animate-spin" /> Synchronizing Knowledge Vault...
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>Decrypting notebook entries and linking cloud metadata.</p>
              </div>
            ) : (
              <div className="task-grid-premium">
                {processedNotes.length === 0 ? (
                  <div className="empty-state" style={{ gridColumn: '1 / -1', background: 'var(--bg-card)', padding: '5rem 2rem', borderRadius: '24px', border: '1px solid rgba(139, 92, 246, 0.2)', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #06b6d4, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#fff', boxShadow: '0 10px 25px rgba(6, 182, 212, 0.5)' }}>
                      <BookOpen size={42} weight="fill" />
                    </div>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Matching Notes in Vault</h3>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.75rem', lineHeight: '1.6' }}>Your knowledge repository is currently empty for this filter! Initiate your first technical note or creative brainstorm.</p>
                    <button onClick={openAddNotePage} className="btn-add-task-hero">
                      + Capture New Idea
                    </button>
                  </div>
                ) : (
                  processedNotes.map(note => {
                    const noteColor = note.color || '#6366f1';
                    const isPinned = Boolean(note.isPinned);
                    const tagsList = note.tags || [];
                    const wordCount = (note.content || '').trim().split(/\s+/).filter(Boolean).length;
                    
                    return (
                      <div key={note._id} className="premium-card" style={{ borderTop: `5px solid ${noteColor}` }}>
                        
                        <div>
                          <div className="card-header-bar" style={{ alignItems: 'center' }}>
                            <h3 className="card-title-text" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {note.title || 'Untitled Idea'}
                            </h3>
                            
                            {/* PIN BADGE BUTTON */}
                            <button 
                              onClick={(e) => { e.stopPropagation(); togglePin(note); }}
                              className={`priority-pill ${isPinned ? 'pill-medium' : ''}`}
                              style={{ 
                                background: isPinned ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'var(--bg-body)', 
                                color: isPinned ? '#ffffff' : 'var(--text-secondary)',
                                border: isPinned ? 'none' : '1px solid var(--border)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              title={isPinned ? "Click to unpin from top" : "Click to pin to top deck"}
                            >
                              <PushPin size={15} weight={isPinned ? "fill" : "bold"} />
                              <span>{isPinned ? 'Pinned' : 'Pin'}</span>
                            </button>
                          </div>
                          
                          <p className="card-desc-body" style={{ WebkitLineClamp: 5, minHeight: '60px' }}>
                            {note.content || 'No text content provided for this entry.'}
                          </p>
                        </div>

                        <div>
                          {/* TAGS ROW */}
                          {tagsList.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.2rem' }}>
                              {tagsList.map((tag, i) => (
                                <span key={i} className="deadline-tag" style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem', background: 'rgba(139, 92, 246, 0.1)', borderColor: 'rgba(139, 92, 246, 0.25)', color: '#a855f7' }}>
                                  <Tag size={12} weight="bold" />
                                  <span>#{tag}</span>
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="card-meta-footer">
                            <span className="deadline-tag" title="Note Word Count & Creation">
                              <Calendar size={15} weight="duotone" style={{ color: noteColor }} /> 
                              <span>
                                {note.createdAt ? new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Today'} • {wordCount} {wordCount === 1 ? 'word' : 'words'}
                              </span>
                            </span>

                            <div className="card-tools">
                              <button onClick={() => openEditPage(note)} className="btn-tool" title="Edit note entry">
                                <PencilSimple size={18} weight="bold" />
                              </button>
                              <button onClick={() => handleDelete(note._id)} className="btn-tool delete-tool" title="Permanently archive note">
                                <Trash size={18} weight="bold" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </>
        )}

        {/* =========================================================
            VIEW 2: FUTURISTIC VISUAL STUDIO FORM (Add / Edit Note)
            ========================================================= */}
        {view === 'form' && (
          <div className="studio-form-wrapper">
            
            <div className="studio-form-card">
              
              <header className="studio-header">
                <button onClick={goBack} className="btn-back-studio" title="Cancel and return to vault">
                  <ArrowLeft size={20} weight="bold" />
                  <span>Back</span>
                </button>

                <div className="studio-title-box">
                  <h2>{editingNote ? 'Edit Vault Note' : 'Capture New Idea'}</h2>
                  <p>{editingNote ? 'Modify technical contents, update topic tags, or switch accent themes.' : 'Document insights and lock them into your high-availability cloud vault.'}</p>
                </div>
              </header>

              <form onSubmit={handleSave} className="studio-fields-stack">
                
                <div className="studio-group">
                  <label htmlFor="note-title-studio">
                    <Sparkle size={18} weight="fill" style={{ color: '#06b6d4' }} />
                    Note Title & Headline
                  </label>
                  <input 
                    id="note-title-studio"
                    className="studio-input" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    required 
                    placeholder="e.g., Q3 System Architecture Brainstorming & API Endpoints"
                  />
                </div>

                <div className="studio-group">
                  <label htmlFor="note-content-studio">
                    <Info size={18} weight="fill" style={{ color: '#6366f1' }} />
                    Detailed Documentation & Thoughts
                  </label>
                  <textarea 
                    id="note-content-studio"
                    className="studio-input" 
                    rows="7"
                    style={{ lineHeight: '1.65', resize: 'vertical' }}
                    value={formData.content} 
                    onChange={e => setFormData({...formData, content: e.target.value})} 
                    placeholder="Type notes, copy code snippets, paste meeting action items, or outline strategic milestones..."
                    required 
                  />
                </div>

                <div className="studio-group">
                  <label htmlFor="note-tags-studio">
                    <Tag size={18} weight="fill" style={{ color: '#ec4899' }} />
                    Topic Tags (Comma Separated)
                  </label>
                  <input 
                    id="note-tags-studio"
                    type="text" 
                    className="studio-input" 
                    value={formData.tags} 
                    onChange={e => setFormData({...formData, tags: e.target.value})} 
                    placeholder="e.g., dev, meetings, personal, urgent"
                  />
                  <small style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginLeft: '4px' }}>
                    💡 Tags organize items into filterable categories across your vault.
                  </small>
                </div>

                {/* VISUAL ACCENT COLOR PALETTE TILES */}
                <div className="studio-group">
                  <label>
                    <Palette size={18} weight="fill" style={{ color: '#f59e0b' }} />
                    Card Accent Theme
                  </label>
                  <div className="visual-options-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))' }}>
                    {colorThemes.map(theme => (
                      <div 
                        key={theme.hex}
                        className={`option-card-btn ${formData.color === theme.hex ? 'selected-option' : ''}`}
                        onClick={() => setFormData({...formData, color: theme.hex})}
                        style={{ padding: '0.85rem 0.6rem' }}
                      >
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: theme.hex, marginBottom: '4px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}></div>
                        <span style={{ fontSize: '0.85rem' }}>{theme.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* VISUAL PINNING TOGGLE TILE */}
                <div className="studio-group">
                  <label>
                    <PushPin size={18} weight="fill" style={{ color: '#a855f7' }} />
                    Vault Placement & Priority
                  </label>
                  <div className="visual-options-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                    <div 
                      className={`option-card-btn ${formData.isPinned ? 'selected-option' : ''}`}
                      onClick={() => setFormData({...formData, isPinned: true})}
                    >
                      <PushPin size={22} weight="fill" style={{ color: '#f59e0b', marginBottom: '4px' }} />
                      <span>📌 Pinned to Top Deck</span>
                      <small style={{ fontSize: '0.78rem', opacity: 0.8 }}>High visibility across vault</small>
                    </div>

                    <div 
                      className={`option-card-btn ${!formData.isPinned ? 'selected-option' : ''}`}
                      onClick={() => setFormData({...formData, isPinned: false})}
                    >
                      <BookOpen size={22} weight="duotone" style={{ color: '#6366f1', marginBottom: '4px' }} />
                      <span>📥 Standard Vault Entry</span>
                      <small style={{ fontSize: '0.78rem', opacity: 0.8 }}>Organized by creation time</small>
                    </div>
                  </div>
                </div>

                <div className="studio-footer">
                  <button type="button" onClick={goBack} className="btn-studio-cancel">
                    Cancel & Return
                  </button>
                  <button type="submit" className="btn-studio-submit">
                    <Lightning size={22} weight="fill" />
                    <span>{editingNote ? 'Synchronize Updates ⚡' : 'Secure in Vault 🚀'}</span>
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

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
              <h4>{toast.title || (toast.type === 'error' ? 'System Alert' : 'Success')}</h4>
              <p>{toast.message}</p>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}