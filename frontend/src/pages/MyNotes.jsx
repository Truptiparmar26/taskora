import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from "./Layout";
import API from "../services/api";
import { 
  MagnifyingGlass, Plus, PencilSimple, Trash, ArrowLeft, 
  // --- FIX: Pin ko hata kar PushPin add kiya ---
  PushPin, 
  Note as NoteIcon, XCircle, CheckCircle
} from '@phosphor-icons/react';
import './PageStyles.css'; 

export default function MyNotes({ darkMode, toggleTheme }) {  
  const navigate = useNavigate();
  
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('list'); 
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  const [formData, setFormData] = useState({ 
    title: 'Untitled', 
    content: '', 
    color: '#ffffff', 
    tags: '', 
    isPinned: false 
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await API.get("/notes"); 
      setNotes(res.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      showToast("Failed to load notes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const openAddNotePage = () => {
    setEditingNote(null);
    setFormData({ title: '', content: '', color: '#ffffff', tags: '', isPinned: false });
    setView('form');
  };

  const openEditPage = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title || 'Untitled',
      content: note.content || '',
      color: note.color || '#ffffff',
      tags: note.tags ? note.tags.join(', ') : '',
      isPinned: note.isPinned || false
    });
    setView('form');
  };

  const goBack = () => {
    setView('list');
    setEditingNote(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      const dataToSend = { ...formData, tags: tagsArray };

      if (editingNote) {
        await API.put(`/notes/${editingNote._id}`, dataToSend);
        showToast("Note updated successfully!");
      } else {
        await API.post("/notes", dataToSend);
        showToast("Note created successfully!");
      }
      fetchNotes();
      goBack();
    } catch (error) {
      console.error("Error saving note:", error);
      showToast("Failed to save note.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await API.delete(`/notes/${id}`);
        showToast("Note deleted successfully!");
        fetchNotes();
      } catch (error) {
        showToast("Failed to delete note.", "error");
      }
    }
  };

  const togglePin = async (note) => {
    // Optimistic Update
    const updatedNotes = notes.map(n => 
      n._id === note._id ? { ...n, isPinned: !n.isPinned } : n
    );
    setNotes(updatedNotes);
    showToast("Note pin status updated!");
  };

  const processedNotes = notes
    .filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase()) || 
                            (note.content && note.content.toLowerCase().includes(search.toLowerCase()));
      const matchesPinned = showPinnedOnly ? note.isPinned : true;
      return matchesSearch && matchesPinned;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <Layout darkMode={darkMode} toggleTheme={toggleTheme}>
      <div className="my-tasks-wrapper">
        {view === 'list' && (
          <>
            <div className="controls-area">
              <div className="search-filters-row">
                <div className="search-bar" style={{flex: 1}}>
                  <MagnifyingGlass size={20} className="search-icon" />
                  <input type="text" placeholder="Search notes..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <button 
                  className={`filter-tab ${showPinnedOnly ? 'active' : ''}`} 
                  onClick={() => setShowPinnedOnly(!showPinnedOnly)} 
                  style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  {/* --- FIX: PushPin icon use kiya --- */}
                  <PushPin weight={showPinnedOnly ? "fill" : "regular"} /> Pinned
                </button>
                <button className="btn-primary" onClick={openAddNotePage}>
                  <Plus size={20} weight="bold" /> Add Note
                </button>
              </div>
            </div>
            {loading ? (
              <div className="loading-state">Loading your notes...</div>
            ) : (
              <div className="task-list">
                {processedNotes.length === 0 ? (
                  <div className="empty-state">
                    <NoteIcon size={48} />
                    <p>No notes found.</p>
                    <button onClick={openAddNotePage} className="btn-link">Create a new note</button>
                  </div>
                ) : (
                  processedNotes.map(note => (
                    <div key={note._id} className="task-card" style={{ backgroundColor: note.color, color: isLightColor(note.color) ? '#111827' : '#ffffff' }}>
                      <div className="task-content" style={{ color: 'inherit' }}>
                        <div className="task-header-row">
                          <h3 style={{ color: 'inherit', fontWeight: 'bold' }}>{note.title}</h3>
                          <div style={{ display: 'flex', gap: '10px' }}>
                             {/* --- FIX: PushPin icon use kiya --- */}
                             {note.isPinned && <PushPin size={18} weight="fill" color="var(--primary)" />}
                             <span className="meta-date">{new Date(note.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <p style={{ color: 'inherit', opacity: 0.8, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{note.content}</p>
                      </div>
                      <div className="task-actions">
                        {/* --- FIX: PushPin icon use kiya --- */}
                        <button onClick={() => togglePin(note)} className="action-btn" title="Pin">
                          <PushPin size={18} />
                        </button>
                        <button onClick={() => openEditPage(note)} className="action-btn" title="Edit">
                          <PencilSimple size={18} />
                        </button>
                        <button onClick={() => handleDelete(note._id)} className="action-btn btn-delete" title="Delete">
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
        {view === 'form' && (
          <div className="page-form-container">
            <header className="top-header" style={{borderBottom: '1px solid var(--border)', padding: '0 0 1rem 0', marginBottom: '1rem'}}>
               <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={goBack} className="back-btn"><ArrowLeft size={20} weight="bold" /><span>Back to Notes</span></button>
                <div style={{ height: '24px', width: '1px', background: 'var(--border)' }}></div>
                <h2>{editingNote ? 'Edit Note' : 'Create New Note'}</h2>
              </div>
            </header>
            <form onSubmit={handleSave} className="large-form">
              <div className="form-section">
                <div className="form-group"><label>Title</label><input className="form-control large-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Note Title" /></div>
                <div className="form-group"><label>Content</label><textarea className="form-control large-input" rows="8" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="Write your thoughts here..." required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Color</label><div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><input type="color" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} style={{ height: '40px', width: '60px', cursor: 'pointer', padding: 0, border: 'none', borderRadius: '8px' }} /><span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Pick background color</span></div></div>
                <div className="form-group"><label>Tags (Comma separated)</label><input type="text" className="form-control" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="e.g. work, personal, ideas" /></div>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" id="isPinned" checked={formData.isPinned} onChange={(e) => setFormData({...formData, isPinned: e.target.checked})} style={{ width: '20px', height: '20px' }} />
                <label htmlFor="isPinned" style={{ cursor: 'pointer' }}>Pin Note</label>
              </div>
              <div className="form-footer">
                <button type="button" onClick={goBack} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary large-btn">Save Note</button>
              </div>
            </form>
          </div>
        )}
        {toast.show && (
          <div className={`toast-notification toast-${toast.type}`}>
            {toast.type === 'success' ? <CheckCircle size={20} weight="fill" /> : <XCircle size={20} weight="fill" />}
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    </Layout>
  );
}

function isLightColor(hex) {
  if (!hex) return false;
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >>  8) & 0xff;
  const b = (rgb >>  0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma > 128;
}