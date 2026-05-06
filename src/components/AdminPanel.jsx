import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllProjects,
  getAdminProjects,
  addProject,
  updateProject,
  deleteProject,
} from '../data/projectStore';
import { projects as staticProjects } from '../data/portfolio';
import './AdminPanel.css';

/* ─── Password — change this to your own secret ─── */
const ADMIN_PASSWORD = 'REDACTED';
const AUTH_KEY = 'dkm_admin_auth';

/* ═══════════════════════════════════════════════════
   Tag Input Component
   ═══════════════════════════════════════════════════ */
function TagsInput({ tags, onChange }) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  function handleKey(e) {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      const newTag = input.trim();
      if (!tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInput('');
    } else if (e.key === 'Backspace' && !input && tags.length) {
      onChange(tags.slice(0, -1));
    }
  }

  function removeTag(idx) {
    onChange(tags.filter((_, i) => i !== idx));
  }

  return (
    <div className="tags-input-wrapper" onClick={() => inputRef.current?.focus()}>
      {tags.map((tag, idx) => (
        <span key={tag + idx} className="tag-chip">
          {tag}
          <button type="button" onClick={() => removeTag(idx)}>×</button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        placeholder={tags.length ? '' : 'Type tag + Enter'}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Toast
   ═══════════════════════════════════════════════════ */
function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return <div className="admin-toast">✓ {message}</div>;
}

/* ═══════════════════════════════════════════════════
   Delete Modal
   ═══════════════════════════════════════════════════ */
function DeleteModal({ title, onConfirm, onCancel }) {
  return (
    <div className="admin-modal-backdrop" onClick={onCancel}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Delete Project</h3>
        <p>Are you sure you want to delete <strong>"{title}"</strong>? This action cannot be undone.</p>
        <div className="modal-actions">
          <button className="btn-admin small" onClick={onCancel}>Cancel</button>
          <button className="btn-admin small danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Project Form  (Add / Edit)
   ═══════════════════════════════════════════════════ */
function ProjectForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    tags: [],
    github: '',
    live: '',
    featured: false,
    ...initial,
  });

  function handle(field, val) {
    setForm((prev) => ({ ...prev, [field]: val }));
  }

  function submit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
  }

  const isEdit = !!initial?.id;

  return (
    <div className="admin-form-container">
      <form className="admin-form" onSubmit={submit}>
        <div className="form-group">
          <label>Project Title *</label>
          <input
            value={form.title}
            onChange={(e) => handle('title', e.target.value)}
            placeholder="e.g. Smart Irrigation System"
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            value={form.description}
            onChange={(e) => handle('description', e.target.value)}
            placeholder="A short description of what this project does, what problem it solves..."
            required
          />
        </div>

        <div className="form-group">
          <label>Tags</label>
          <TagsInput tags={form.tags} onChange={(tags) => handle('tags', tags)} />
          <span className="form-help">Press Enter or comma to add a tag</span>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>GitHub URL</label>
            <input
              value={form.github}
              onChange={(e) => handle('github', e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>
          <div className="form-group">
            <label>Live Demo URL</label>
            <input
              value={form.live}
              onChange={(e) => handle('live', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        <label className="form-checkbox">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => handle('featured', e.target.checked)}
          />
          <span>Mark as Featured (highlighted with cyan accent)</span>
        </label>

        {/* Live preview */}
        {form.title && (
          <div className="admin-preview-section">
            <h3>📋 Live Preview</h3>
            <PreviewCard project={form} />
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-admin primary">
            {isEdit ? '⟳ Update Project' : '+ Publish Project'}
          </button>
          <button type="button" className="btn-admin" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Preview Card (mini version of the actual card)
   ═══════════════════════════════════════════════════ */
function PreviewCard({ project }) {
  return (
    <div
      style={{
        background: 'var(--card)',
        border: `1px solid ${project.featured ? 'var(--cyan)' : 'var(--border)'}`,
        padding: '1.4rem 1.2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.7rem',
        position: 'relative',
        overflow: 'hidden',
        maxWidth: 380,
      }}
    >
      {project.featured && (
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 2,
            background: 'linear-gradient(90deg, var(--cyan), var(--blue), transparent)',
          }}
        />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '1.4rem', opacity: 0.7 }}>📂</span>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          {project.github && (
            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              GitHub ↗
            </span>
          )}
          {project.live && (
            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.58rem', color: 'var(--cyan)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Live ↗
            </span>
          )}
        </div>
      </div>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>
        {project.title}
      </h3>
      <p style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--muted)', lineHeight: 1.7 }}>
        {project.description || 'No description yet...'}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
        {project.tags?.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: 'var(--mono)', fontSize: '0.5rem',
              padding: '0.15rem 0.4rem', border: '1px solid var(--border)',
              color: 'var(--muted)', letterSpacing: '0.06em',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Main Admin Panel
   ═══════════════════════════════════════════════════ */
export default function AdminPanel() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === 'true');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [view, setView] = useState('list'); // 'list' | 'add' | 'edit'
  const [editTarget, setEditTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [allProjects, setAllProjects] = useState([]);
  const [adminProjectsList, setAdminProjectsList] = useState([]);

  // Load / reload projects from Firestore
  async function loadProjects() {
    try {
      const [all, admin] = await Promise.all([getAllProjects(), getAdminProjects()]);
      setAllProjects(all);
      setAdminProjectsList(admin);
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  }

  useEffect(() => {
    if (authed) loadProjects();
  }, [authed]);

  const totalProjects = allProjects.length;
  const featuredCount = allProjects.filter((p) => p.featured).length;
  const liveCount = allProjects.filter((p) => p.live).length;

  function handleLogin(e) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      setAuthed(true);
      setError('');
    } else {
      setError('Incorrect password. Access denied.');
      setPassword('');
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
    navigate('/admin');
  }

  async function handleAdd(form) {
    await addProject(form);
    await loadProjects();
    setView('list');
    setToast('Project published successfully!');
  }

  async function handleUpdate(form) {
    await updateProject(editTarget.id, form);
    await loadProjects();
    setView('list');
    setEditTarget(null);
    setToast('Project updated successfully!');
  }

  async function handleDelete() {
    await deleteProject(deleteTarget.id);
    await loadProjects();
    setDeleteTarget(null);
    setToast('Project deleted.');
  }

  function startEdit(project) {
    setEditTarget(project);
    setView('edit');
  }

  /* ─── Login screen ───────────────────────────────── */
  if (!authed) {
    return (
      <div className="admin-overlay">
        <div className="admin-login">
          <div className="admin-login-card">
            <span className="login-icon">🔐</span>
            <h1>Admin Panel</h1>
            <p className="login-subtitle">portfolio management system</p>
            {error && <div className="error-msg">⚠ {error}</div>}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoFocus
                />
              </div>
              <button type="submit" className="btn-admin primary" style={{ width: '100%', justifyContent: 'center' }}>
                Authenticate →
              </button>
            </form>
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button
                className="btn-admin back"
                onClick={() => navigate('/')}
                style={{ fontSize: '0.6rem' }}
              >
                ← Back to Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Dashboard ──────────────────────────────────── */
  return (
    <div className="admin-overlay">
      <div className="admin-dash">
        {/* Top bar */}
        <div className="admin-topbar">
          <h1>⚡ Admin Dashboard</h1>
          <div className="admin-topbar-actions">
            <button className="btn-admin small" onClick={() => navigate('/')}>
              ← Portfolio
            </button>
            <button className="btn-admin small danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">📂</div>
            <div className="admin-stat-info">
              <h3>{totalProjects}</h3>
              <p>Total Projects</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">⭐</div>
            <div className="admin-stat-info">
              <h3>{featuredCount}</h3>
              <p>Featured</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">🚀</div>
            <div className="admin-stat-info">
              <h3>{liveCount}</h3>
              <p>Live Demos</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">🔧</div>
            <div className="admin-stat-info">
              <h3>{adminProjectsList.length}</h3>
              <p>Admin-Added</p>
            </div>
          </div>
        </div>

        {/* Content area */}
        {view === 'list' && (
          <>
            {/* Section header */}
            <div className="admin-section-header">
              <div>
                <div className="admin-section-label">// manage</div>
                <h2>All Projects</h2>
              </div>
              <button className="btn-admin primary" onClick={() => setView('add')}>
                + Add New Project
              </button>
            </div>

            {/* Static Projects */}
            {staticProjects.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div className="admin-section-label" style={{ marginBottom: '0.6rem', opacity: 0.6 }}>
                  Static projects (edit in code)
                </div>
                <div className="admin-project-list">
                  {staticProjects.map((project, i) => (
                    <div key={`static-${i}`} className="admin-project-row static-project">
                      <div className="admin-project-info">
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                        <div className="admin-project-meta">
                          <span className="badge badge-static">STATIC</span>
                          {project.featured && <span className="badge badge-featured">FEATURED</span>}
                          {project.tags?.slice(0, 4).map((tag) => (
                            <span key={tag} className="tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className="admin-project-actions">
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-admin small"
                          >
                            Live ↗
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Projects */}
            <div>
              <div className="admin-section-label" style={{ marginBottom: '0.6rem' }}>
                Admin-added projects
              </div>
              {adminProjectsList.length === 0 ? (
                <div className="admin-empty">
                  <div className="empty-icon">📭</div>
                  <h3>No admin projects yet</h3>
                  <p>Click "Add New Project" to publish your first project from the admin panel.</p>
                </div>
              ) : (
                <div className="admin-project-list">
                  {adminProjectsList.map((project) => (
                    <div key={project.id} className="admin-project-row">
                      <div className="admin-project-info">
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                        <div className="admin-project-meta">
                          <span className="badge badge-admin">ADMIN</span>
                          {project.featured && <span className="badge badge-featured">FEATURED</span>}
                          {project.tags?.slice(0, 4).map((tag) => (
                            <span key={tag} className="tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className="admin-project-actions">
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-admin small"
                          >
                            Live ↗
                          </a>
                        )}
                        <button className="btn-admin small" onClick={() => startEdit(project)}>
                          Edit
                        </button>
                        <button className="btn-admin small danger" onClick={() => setDeleteTarget(project)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {view === 'add' && (
          <>
            <button className="btn-admin back" onClick={() => setView('list')}>
              ← Back to Projects
            </button>
            <div style={{ marginTop: '1rem' }}>
              <div className="admin-section-label">// new project</div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                Publish a New Project
              </h2>
              <ProjectForm onSave={handleAdd} onCancel={() => setView('list')} />
            </div>
          </>
        )}

        {view === 'edit' && editTarget && (
          <>
            <button className="btn-admin back" onClick={() => { setView('list'); setEditTarget(null); }}>
              ← Back to Projects
            </button>
            <div style={{ marginTop: '1rem' }}>
              <div className="admin-section-label">// edit project</div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                Edit: {editTarget.title}
              </h2>
              <ProjectForm
                initial={editTarget}
                onSave={handleUpdate}
                onCancel={() => { setView('list'); setEditTarget(null); }}
              />
            </div>
          </>
        )}
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          title={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
