'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../data/firebase';
import {
  getAllProjects,
  getAdminProjects,
  addProject,
  updateProject,
  deleteProject,
} from '../data/projectStore';
import {
  getAllBlogs,
  addBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  unpublishBlog,
} from '../data/blogStore';
import {
  getAdminSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  seedSkillsFromStatic,
} from '../data/skillStore';
import {
  getAdminExperiences,
  addExperience,
  updateExperience,
  deleteExperience,
  seedExperiencesFromStatic,
} from '../data/experienceStore';
import {
  getAdminEducation,
  addEducationEntry,
  updateEducationEntry,
  deleteEducationEntry,
  seedEducationFromStatic,
} from '../data/educationStore';
import { projects as staticProjects, skills as staticSkills, experience as staticExperience, education as staticEducation } from '../data/portfolio';
import './AdminPanel.css';

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
function DeleteModal({ title, itemType, onConfirm, onCancel }) {
  return (
    <div className="admin-modal-backdrop" onClick={onCancel}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Delete {itemType}</h3>
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
   Skill Form  (Add / Edit)
   ═══════════════════════════════════════════════════ */
function SkillForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    icon: '⚡',
    level: 50,
    category: '',
    ...initial,
  });

  function handle(field, val) {
    setForm((prev) => ({ ...prev, [field]: val }));
  }

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  }

  const isEdit = !!initial?.id;

  // Common emoji suggestions for quick picking
  const emojiSuggestions = ['🐍', '🤖', '📊', '🗄️', '⚙️', '🐼', '🔢', '🔬', '📈', '🧠', '🌐', '🔀', '💻', '🎨', '📱', '☁️', '🔥', '⚡', '🛠️', '🔒'];

  return (
    <div className="admin-form-container">
      <form className="admin-form" onSubmit={submit}>
        <div className="form-row">
          <div className="form-group">
            <label>Skill Name *</label>
            <input
              value={form.name}
              onChange={(e) => handle('name', e.target.value)}
              placeholder="e.g. Python"
              required
            />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <input
              value={form.category}
              onChange={(e) => handle('category', e.target.value)}
              placeholder="e.g. Language, AI/ML, Tools"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Icon (emoji)</label>
          <input
            value={form.icon}
            onChange={(e) => handle('icon', e.target.value)}
            placeholder="Paste an emoji"
            style={{ fontSize: '1.2rem', textAlign: 'center', maxWidth: 120 }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.4rem' }}>
            {emojiSuggestions.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handle('icon', emoji)}
                style={{
                  fontSize: '1rem', padding: '0.3rem 0.45rem',
                  background: form.icon === emoji ? 'rgba(0,229,255,0.15)' : 'var(--card)',
                  border: form.icon === emoji ? '1px solid var(--cyan)' : '1px solid var(--border)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Proficiency Level: {form.level}%</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input
              type="range"
              min="0"
              max="100"
              value={form.level}
              onChange={(e) => handle('level', Number(e.target.value))}
              style={{
                flex: 1, accentColor: 'var(--cyan)', height: 6, cursor: 'pointer',
              }}
            />
            <input
              type="number"
              min="0"
              max="100"
              value={form.level}
              onChange={(e) => handle('level', Math.min(100, Math.max(0, Number(e.target.value))))}
              style={{
                width: 60, textAlign: 'center',
                fontFamily: 'var(--mono)', fontSize: '0.78rem',
                background: 'rgba(2, 11, 24, 0.6)',
                border: '1px solid var(--border)', color: 'var(--text)',
                padding: '0.4rem',
              }}
            />
          </div>
          {/* Progress bar preview */}
          <div style={{
            marginTop: '0.5rem', height: 4,
            background: 'var(--border)', borderRadius: 2, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', borderRadius: 2,
              background: 'linear-gradient(90deg, var(--blue2), var(--cyan))',
              width: form.level + '%',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>

        {/* Live card preview */}
        <div style={{
          border: '1px solid var(--border)',
          borderLeft: '3px solid var(--cyan)',
          padding: '1.2rem',
          background: 'rgba(0,229,255,0.03)',
        }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--cyan)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
            👁 Live Preview
          </div>
          <div style={{
            display: 'inline-block',
            background: 'var(--card)', border: '1px solid var(--border)',
            padding: '1.1rem 0.9rem', textAlign: 'center',
            minWidth: 130,
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{form.icon || '⚡'}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.66rem', color: 'var(--text)', letterSpacing: '0.04em' }}>
              {form.name || 'Skill Name'}
            </div>
            <div style={{
              marginTop: '0.6rem', height: 2,
              background: 'var(--border)', borderRadius: 1, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: 1,
                background: 'linear-gradient(90deg, var(--blue2), var(--cyan))',
                width: (form.level || 0) + '%',
                transition: 'width 0.3s ease',
              }} />
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.55rem', color: 'var(--muted)', marginTop: '0.3rem' }}>
              {form.category || 'Category'}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-admin primary">
            {isEdit ? '⟳ Update Skill' : '+ Add Skill'}
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
   Experience Form  (Add / Edit)
   ═══════════════════════════════════════════════════ */
function ExperienceForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    period: '',
    duration: '',
    role: '',
    company: '',
    type: '',
    location: '',
    current: false,
    description: '',
    tags: [],
    ...initial,
  });

  function handle(field, val) {
    setForm((prev) => ({ ...prev, [field]: val }));
  }

  function submit(e) {
    e.preventDefault();
    if (!form.role.trim() || !form.company.trim()) return;
    onSave(form);
  }

  const isEdit = !!initial?.id;

  return (
    <div className="admin-form-container">
      <form className="admin-form" onSubmit={submit}>
        <div className="form-row">
          <div className="form-group">
            <label>Role / Position *</label>
            <input
              value={form.role}
              onChange={(e) => handle('role', e.target.value)}
              placeholder="e.g. Data Science Intern"
              required
            />
          </div>
          <div className="form-group">
            <label>Company *</label>
            <input
              value={form.company}
              onChange={(e) => handle('company', e.target.value)}
              placeholder="e.g. Nexthike IT Solution"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Period</label>
            <input
              value={form.period}
              onChange={(e) => handle('period', e.target.value)}
              placeholder="e.g. Jun 2025 — Present"
            />
          </div>
          <div className="form-group">
            <label>Duration</label>
            <input
              value={form.duration}
              onChange={(e) => handle('duration', e.target.value)}
              placeholder="e.g. 1 yr"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            <input
              value={form.type}
              onChange={(e) => handle('type', e.target.value)}
              placeholder="e.g. Internship · Remote"
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              value={form.location}
              onChange={(e) => handle('location', e.target.value)}
              placeholder="e.g. Nepal"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => handle('description', e.target.value)}
            placeholder="Describe your role and responsibilities..."
            style={{ minHeight: 100 }}
          />
        </div>

        <div className="form-group">
          <label>Tags</label>
          <TagsInput tags={form.tags} onChange={(tags) => handle('tags', tags)} />
          <span className="form-help">Press Enter or comma to add a tag</span>
        </div>

        <label className="form-checkbox">
          <input
            type="checkbox"
            checked={form.current}
            onChange={(e) => handle('current', e.target.checked)}
          />
          <span>Currently working here</span>
        </label>

        {/* Live preview */}
        <div style={{
          border: '1px solid var(--border)',
          borderLeft: '3px solid var(--cyan)',
          padding: '1.2rem',
          background: 'rgba(0,229,255,0.03)',
        }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--cyan)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
            👁 Live Preview
          </div>
          <div style={{ position: 'relative', paddingLeft: '2rem' }}>
            <div style={{
              position: 'absolute', left: 0, top: '0.3rem',
              width: 10, height: 10, borderRadius: '50%',
              background: form.current ? 'var(--cyan)' : 'var(--muted)',
              boxShadow: form.current ? '0 0 12px var(--cyan)' : 'none',
            }} />
            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.63rem', color: 'var(--cyan)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              {form.period || 'Period'} · {form.duration || 'Duration'}
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.2rem' }}>
              {form.role || 'Role'}
            </h3>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.8rem' }}>
              {form.company || 'Company'} &nbsp;·&nbsp; {form.type || 'Type'} &nbsp;·&nbsp; {form.location || 'Location'}
            </div>
            <p style={{ fontFamily: 'var(--mono)', fontSize: '0.73rem', color: 'var(--muted)', lineHeight: 1.9 }}>
              {form.description || 'Description...'}
            </p>
            <div style={{ marginTop: '0.8rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {form.current && (
                <span style={{ fontFamily: 'var(--mono)', fontSize: '0.58rem', padding: '0.2rem 0.6rem', border: '1px solid var(--cyan)', color: 'var(--cyan)', letterSpacing: '0.08em' }}>
                  ● Current
                </span>
              )}
              {(form.tags || []).map(tag => (
                <span key={tag} style={{ fontFamily: 'var(--mono)', fontSize: '0.58rem', padding: '0.2rem 0.6rem', border: '1px solid var(--border)', color: 'var(--muted)', letterSpacing: '0.06em' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-admin primary">
            {isEdit ? '⟳ Update Experience' : '+ Add Experience'}
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
   Education Form  (Add / Edit)
   ═══════════════════════════════════════════════════ */
function EducationForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    degree: '',
    school: '',
    period: '',
    current: false,
    ...initial,
  });

  function handle(field, val) {
    setForm((prev) => ({ ...prev, [field]: val }));
  }

  function submit(e) {
    e.preventDefault();
    if (!form.degree.trim() || !form.school.trim()) return;
    onSave(form);
  }

  const isEdit = !!initial?.id;

  return (
    <div className="admin-form-container">
      <form className="admin-form" onSubmit={submit}>
        <div className="form-group">
          <label>Degree / Qualification *</label>
          <input
            value={form.degree}
            onChange={(e) => handle('degree', e.target.value)}
            placeholder="e.g. Master's Degree · Data Science"
            required
          />
        </div>

        <div className="form-group">
          <label>School / Institution *</label>
          <input
            value={form.school}
            onChange={(e) => handle('school', e.target.value)}
            placeholder="e.g. Softwarica College of IT & E-Commerce"
            required
          />
        </div>

        <div className="form-group">
          <label>Period</label>
          <input
            value={form.period}
            onChange={(e) => handle('period', e.target.value)}
            placeholder="e.g. Nov 2025 — Present"
          />
        </div>

        <label className="form-checkbox">
          <input
            type="checkbox"
            checked={form.current}
            onChange={(e) => handle('current', e.target.checked)}
          />
          <span>Currently studying here</span>
        </label>

        {/* Live preview */}
        <div style={{
          border: '1px solid var(--border)',
          borderLeft: '3px solid var(--cyan)',
          padding: '1.2rem',
          background: 'rgba(0,229,255,0.03)',
        }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--cyan)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
            👁 Live Preview
          </div>
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            padding: '1.6rem', position: 'relative', display: 'inline-block',
            minWidth: 240,
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg, var(--blue2), var(--cyan))',
            }} />
            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--cyan)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              {form.degree || 'Degree'}
            </div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.4rem', lineHeight: 1.3 }}>
              {form.school || 'School'}
            </h3>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>
              {form.period || 'Period'}
            </div>
            {form.current && (
              <div style={{ marginTop: '0.7rem', fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--neon)' }}>
                ● IN PROGRESS
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-admin primary">
            {isEdit ? '⟳ Update Education' : '+ Add Education'}
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
   Blog Form  (Add / Edit) — Rich Editor with Images
   ═══════════════════════════════════════════════════ */
function BlogForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    tags: [],
    author: 'Devesh Kumar Mandal',
    featured: false,
    status: 'draft',
    seoDescription: '',
    seoKeywords: '',
    ...initial,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const contentRef = useRef(null);

  function handle(field, val) {
    setForm((prev) => ({ ...prev, [field]: val }));
  }

  function handleSave(status) {
    if (!form.title.trim()) return;
    onSave({ ...form, status });
  }

  // Cover image upload
  async function handleCoverUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setUploadMsg('Image too large — max 5MB');
      return;
    }
    setUploading(true);
    setUploadMsg('Uploading cover image...');
    try {
      const { uploadImage } = await import('../data/imageUpload');
      const url = await uploadImage(file, 'covers');
      handle('coverImage', url);
      setUploadMsg('Cover image uploaded!');
    } catch (err) {
      setUploadMsg('Upload failed — ' + err.message);
    }
    setUploading(false);
  }

  // Inline image upload — inserts markdown image tag at cursor
  async function handleInlineImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        setUploadMsg('Image too large — max 5MB');
        return;
      }
      setUploading(true);
      setUploadMsg('Uploading image...');
      try {
        const { uploadImage } = await import('../data/imageUpload');
        const url = await uploadImage(file, 'inline');
        insertAtCursor('\n![' + file.name + '](' + url + ')\n');
        setUploadMsg('Image inserted!');
      } catch (err) {
        setUploadMsg('Upload failed — ' + err.message);
      }
      setUploading(false);
    };
    input.click();
  }

  // Insert text at cursor position in the content textarea
  function insertAtCursor(text) {
    const ta = contentRef.current;
    if (!ta) {
      handle('content', form.content + text);
      return;
    }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = form.content.substring(0, start);
    const after = form.content.substring(end);
    const newContent = before + text + after;
    handle('content', newContent);
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = ta.selectionEnd = start + text.length;
    }, 0);
  }

  // Wrap selected text with markdown syntax
  function wrapSelection(prefix, suffix) {
    const ta = contentRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = form.content.substring(start, end);
    const text = selected || 'text';
    const before = form.content.substring(0, start);
    const after = form.content.substring(end);
    const wrapped = prefix + text + (suffix || prefix);
    handle('content', before + wrapped + after);
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = start + prefix.length;
      ta.selectionEnd = start + prefix.length + text.length;
    }, 0);
  }

  // Toolbar actions
  const toolbarBtns = [
    { label: 'H1', title: 'Heading 1', action: () => insertAtCursor('\n# ') },
    { label: 'H2', title: 'Heading 2', action: () => insertAtCursor('\n## ') },
    { label: 'H3', title: 'Heading 3', action: () => insertAtCursor('\n### ') },
    { label: 'B', title: 'Bold', action: () => wrapSelection('**'), style: { fontWeight: 'bold' } },
    { label: 'I', title: 'Italic', action: () => wrapSelection('*'), style: { fontStyle: 'italic' } },
    { label: '``', title: 'Inline Code', action: () => wrapSelection('`') },
    { label: '```', title: 'Code Block', action: () => insertAtCursor('\n```\n\n```\n') },
    { label: '—', title: 'Divider', action: () => insertAtCursor('\n---\n') },
    { label: '🔗', title: 'Link', action: () => insertAtCursor('[link text](https://url.com)') },
    { label: '📷', title: 'Upload Image', action: handleInlineImage },
    { label: '• List', title: 'Bullet List', action: () => insertAtCursor('\n- ') },
    { label: '> Quote', title: 'Blockquote', action: () => insertAtCursor('\n> ') },
  ];

  const isEdit = !!initial?.id;
  const isDraft = !initial?.status || initial?.status === 'draft';

  return (
    <div className="admin-form-container">
      <form className="admin-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label>Blog Title *</label>
          <input
            value={form.title}
            onChange={(e) => handle('title', e.target.value)}
            placeholder="e.g. How I Built a Smart Irrigation System"
            required
          />
        </div>

        {/* Cover Image */}
        <div className="form-group">
          <label>Cover Image</label>
          {form.coverImage && (
            <div style={{
              position: 'relative', marginBottom: '0.8rem',
              border: '1px solid var(--border)', overflow: 'hidden',
            }}>
              <img
                src={form.coverImage}
                alt="Cover preview"
                style={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block' }}
              />
              <button
                type="button"
                onClick={() => handle('coverImage', '')}
                style={{
                  position: 'absolute', top: 6, right: 6,
                  background: 'rgba(0,0,0,0.7)', color: '#fff',
                  border: 'none', padding: '0.2rem 0.5rem',
                  cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '0.6rem',
                }}
              >
                ✕ Remove
              </button>
            </div>
          )}
          <label style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem', border: '1px dashed var(--border)',
            cursor: uploading ? 'wait' : 'pointer', fontFamily: 'var(--mono)',
            fontSize: '0.65rem', color: 'var(--muted)',
            opacity: uploading ? 0.5 : 1,
          }}>
            {'📷 ' + (form.coverImage ? 'Change Cover Image' : 'Upload Cover Image')}
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </label>
          {uploadMsg && (
            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--cyan)', marginLeft: '0.8rem' }}>
              {uploadMsg}
            </span>
          )}
        </div>

        <div className="form-group">
          <label>Excerpt / Summary *</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => handle('excerpt', e.target.value)}
            placeholder="A short summary that appears on the blog card..."
            required
            style={{ minHeight: 80 }}
          />
        </div>

        {/* ── SEO Section ────────────────────────────────── */}
        <div style={{
          border: '1px solid var(--border)',
          borderLeft: '3px solid var(--cyan)',
          padding: '1.2rem',
          background: 'rgba(0,229,255,0.03)',
          display: 'flex', flexDirection: 'column', gap: '0.9rem',
        }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--cyan)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            🔍 SEO Settings (optional)
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>
              SEO Description
              <span style={{ color: 'var(--muted)', fontWeight: 400 }}> — shown in Google search results (max 160 chars)</span>
            </label>
            <textarea
              value={form.seoDescription}
              onChange={(e) => handle('seoDescription', e.target.value.slice(0, 160))}
              placeholder="Leave blank to auto-use the excerpt. Custom description for Google..."
              style={{ minHeight: 64 }}
            />
            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.55rem', color: form.seoDescription.length > 140 ? '#ff6b6b' : 'var(--muted)', textAlign: 'right', marginTop: '0.25rem' }}>
              {form.seoDescription.length}/160 chars
            </div>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>
              SEO Keywords
              <span style={{ color: 'var(--muted)', fontWeight: 400 }}> — comma separated, specific to this post</span>
            </label>
            <input
              type="text"
              value={form.seoKeywords}
              onChange={(e) => handle('seoKeywords', e.target.value)}
              placeholder="e.g. machine learning tutorial, Python NLP, text classification Nepal"
            />
            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.55rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
              💡 Tip: Use specific phrases people search for, e.g. "how to train NLP model Python"
            </div>
          </div>
        </div>

        {/* Content Editor with Toolbar */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ margin: 0 }}>Full Content (Markdown)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setPreviewMode(false)}
                style={{
                  background: !previewMode ? 'var(--border)' : 'transparent',
                  border: '1px solid var(--border)', color: 'var(--text)',
                  fontFamily: 'var(--mono)', fontSize: '0.58rem',
                  padding: '0.25rem 0.6rem', cursor: 'pointer',
                }}
              >
                {'✏️ Write'}
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode(true)}
                style={{
                  background: previewMode ? 'var(--border)' : 'transparent',
                  border: '1px solid var(--border)', color: 'var(--text)',
                  fontFamily: 'var(--mono)', fontSize: '0.58rem',
                  padding: '0.25rem 0.6rem', cursor: 'pointer',
                }}
              >
                {'👁 Preview'}
              </button>
            </div>
          </div>

          {!previewMode ? (
            <>
              {/* Toolbar */}
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '0.25rem',
                padding: '0.4rem', background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border)', borderBottom: 'none',
              }}>
                {toolbarBtns.map((btn) => (
                  <button
                    key={btn.label}
                    type="button"
                    title={btn.title}
                    onClick={btn.action}
                    disabled={uploading}
                    style={{
                      background: 'var(--card)', border: '1px solid var(--border)',
                      color: 'var(--text)', fontFamily: 'var(--mono)',
                      fontSize: '0.58rem', padding: '0.25rem 0.5rem',
                      cursor: uploading ? 'wait' : 'pointer',
                      ...(btn.style || {}),
                    }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
              <textarea
                ref={contentRef}
                value={form.content}
                onChange={(e) => handle('content', e.target.value)}
                placeholder={'Write your blog post using Markdown...\n\n# Heading\n**bold** *italic* `code`\n\n![image alt](url)\n\n- list item\n> blockquote'}
                style={{ minHeight: 320, fontFamily: 'var(--mono)', fontSize: '0.75rem', lineHeight: 1.7 }}
              />
            </>
          ) : (
            <div
              style={{
                minHeight: 320, padding: '1.5rem',
                border: '1px solid var(--border)', background: 'var(--card)',
                overflowY: 'auto', lineHeight: 1.8,
              }}
            >
              {form.content ? (
                <MarkdownPreview content={form.content} />
              ) : (
                <p style={{ color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: '0.7rem' }}>
                  Nothing to preview. Start writing in the editor.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Tags</label>
          <TagsInput tags={form.tags} onChange={(tags) => handle('tags', tags)} />
          <span className="form-help">Press Enter or comma to add a tag</span>
        </div>

        <div className="form-group">
          <label>Author</label>
          <input
            value={form.author}
            onChange={(e) => handle('author', e.target.value)}
            placeholder="Author name"
          />
        </div>

        <label className="form-checkbox">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => handle('featured', e.target.checked)}
          />
          <span>Mark as Featured</span>
        </label>

        <div className="form-actions">
          <button
            type="button"
            className="btn-admin primary"
            onClick={() => handleSave('published')}
            disabled={uploading}
          >
            {isEdit ? (isDraft ? '🚀 Publish Now' : '⟳ Update & Publish') : '🚀 Publish Blog Post'}
          </button>
          <button
            type="button"
            className="btn-admin"
            onClick={() => handleSave('draft')}
            disabled={uploading}
            style={{ borderColor: 'var(--muted)' }}
          >
            {isEdit ? '💾 Save as Draft' : '💾 Save Draft'}
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
   Markdown Preview — lightweight renderer
   ═══════════════════════════════════════════════════ */
function MarkdownPreview({ content }) {
  const [ReactMarkdown, setRM] = useState(null);
  const [remarkGfm, setGfm] = useState(null);

  useEffect(() => {
    Promise.all([
      import('react-markdown'),
      import('remark-gfm'),
    ]).then(([md, gfm]) => {
      setRM(() => md.default);
      setGfm(() => gfm.default);
    });
  }, []);

  if (!ReactMarkdown) {
    return <p style={{ color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: '0.7rem' }}>Loading preview...</p>;
  }

  return (
    <div className="blog-markdown-content">
      <ReactMarkdown
        remarkPlugins={remarkGfm ? [remarkGfm] : []}
        components={{
          img: ({ node, ...props }) => (
            <img {...props} style={{ maxWidth: '100%', height: 'auto', margin: '1rem 0', border: '1px solid var(--border)' }} />
          ),
          h1: ({ node, ...props }) => <h1 {...props} style={{ fontSize: '1.6rem', fontWeight: 800, margin: '1.5rem 0 0.5rem', color: 'var(--text)' }} />,
          h2: ({ node, ...props }) => <h2 {...props} style={{ fontSize: '1.3rem', fontWeight: 700, margin: '1.3rem 0 0.4rem', color: 'var(--text)' }} />,
          h3: ({ node, ...props }) => <h3 {...props} style={{ fontSize: '1.1rem', fontWeight: 700, margin: '1rem 0 0.3rem', color: 'var(--text)' }} />,
          p: ({ node, ...props }) => <p {...props} style={{ fontSize: '0.85rem', lineHeight: 1.85, color: 'var(--muted)', margin: '0.6rem 0' }} />,
          a: ({ node, ...props }) => <a {...props} style={{ color: 'var(--cyan)', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer" />,
          code: ({ node, inline, ...props }) =>
            inline
              ? <code {...props} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.4rem', fontFamily: 'var(--mono)', fontSize: '0.78rem', color: 'var(--cyan)' }} />
              : <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', overflowX: 'auto', border: '1px solid var(--border)', margin: '0.8rem 0' }}><code {...props} style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--text)' }} /></pre>,
          blockquote: ({ node, ...props }) => <blockquote {...props} style={{ borderLeft: '3px solid var(--cyan)', padding: '0.5rem 1rem', margin: '0.8rem 0', color: 'var(--muted)', fontStyle: 'italic' }} />,
          hr: () => <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1.5rem 0' }} />,
          ul: ({ node, ...props }) => <ul {...props} style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }} />,
          ol: ({ node, ...props }) => <ol {...props} style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }} />,
          li: ({ node, ...props }) => <li {...props} style={{ fontSize: '0.85rem', lineHeight: 1.85, color: 'var(--muted)', marginBottom: '0.3rem' }} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Main Admin Panel
   ═══════════════════════════════════════════════════ */
export default function AdminPanel() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');
  const [view, setView] = useState('list');
  const [editTarget, setEditTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState('project');

  // Projects state
  const [allProjects, setAllProjects] = useState([]);
  const [adminProjectsList, setAdminProjectsList] = useState([]);

  // Blogs state
  const [blogsList, setBlogsList] = useState([]);

  // Skills state
  const [skillsList, setSkillsList] = useState([]);
  const [skillsSeeding, setSkillsSeeding] = useState(false);

  // Experience state
  const [experienceList, setExperienceList] = useState([]);
  const [expSeeding, setExpSeeding] = useState(false);

  // Education state
  const [educationList, setEducationList] = useState([]);
  const [eduSeeding, setEduSeeding] = useState(false);

  // Firebase Auth listener — auto-detects login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthed(!!user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load projects
  async function loadProjects() {
    try {
      const [all, admin] = await Promise.all([getAllProjects(), getAdminProjects()]);
      setAllProjects(all);
      setAdminProjectsList(admin);
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  }

  // Load blogs
  async function loadBlogs() {
    try {
      const blogs = await getAllBlogs();
      setBlogsList(blogs);
    } catch (err) {
      console.error('Failed to load blogs:', err);
    }
  }

  // Load skills
  async function loadSkills() {
    try {
      const skills = await getAdminSkills();
      setSkillsList(skills);
    } catch (err) {
      console.error('Failed to load skills:', err);
    }
  }

  // Load experiences
  async function loadExperiences() {
    try {
      const exps = await getAdminExperiences();
      setExperienceList(exps);
    } catch (err) {
      console.error('Failed to load experiences:', err);
    }
  }

  // Load education
  async function loadEducation() {
    try {
      const edu = await getAdminEducation();
      setEducationList(edu);
    } catch (err) {
      console.error('Failed to load education:', err);
    }
  }

  useEffect(() => {
    if (authed) {
      loadProjects();
      loadBlogs();
      loadSkills();
      loadExperiences();
      loadEducation();
    }
  }, [authed]);

  const totalProjects = allProjects.length;
  const featuredCount = allProjects.filter((p) => p.featured).length;
  const liveCount = allProjects.filter((p) => p.live).length;

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Incorrect email or password.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No admin account found with this email.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else {
        setError('Authentication failed. Please try again.');
      }
      setPassword('');
    }
  }

  async function handleLogout() {
    await signOut(auth);
    navigate('/admin');
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setError('Please enter your email address first, then click Forgot Password.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError('');
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    }
  }

  // Project handlers
  async function handleAddProject(form) {
    await addProject(form);
    await loadProjects();
    setView('list');
    setToast('Project published successfully!');
  }

  async function handleUpdateProject(form) {
    await updateProject(editTarget.id, form);
    await loadProjects();
    setView('list');
    setEditTarget(null);
    setToast('Project updated successfully!');
  }

  async function handleDeleteProject() {
    await deleteProject(deleteTarget.id);
    await loadProjects();
    setDeleteTarget(null);
    setToast('Project deleted.');
  }

  // Blog handlers
  async function handleAddBlog(form) {
    await addBlog(form);
    await loadBlogs();
    setView('list');
    setToast(form.status === 'draft' ? 'Blog saved as draft!' : 'Blog post published successfully!');
  }

  async function handleUpdateBlog(form) {
    await updateBlog(editTarget.id, form);
    await loadBlogs();
    setView('list');
    setEditTarget(null);
    setToast(form.status === 'draft' ? 'Draft saved!' : 'Blog post published!');
  }

  async function handleDeleteBlog() {
    await deleteBlog(deleteTarget.id);
    await loadBlogs();
    setDeleteTarget(null);
    setToast('Blog post deleted.');
  }

  async function handlePublishBlog(blog) {
    await publishBlog(blog.id);
    await loadBlogs();
    setToast(`"${blog.title}" is now published!`);
  }

  async function handleUnpublishBlog(blog) {
    await unpublishBlog(blog.id);
    await loadBlogs();
    setToast(`"${blog.title}" moved to drafts.`);
  }

  // Skill handlers
  async function handleAddSkill(form) {
    await addSkill(form);
    await loadSkills();
    setView('list');
    setToast('Skill added successfully!');
  }

  async function handleUpdateSkill(form) {
    await updateSkill(editTarget.id, form);
    await loadSkills();
    setView('list');
    setEditTarget(null);
    setToast('Skill updated successfully!');
  }

  async function handleDeleteSkill() {
    await deleteSkill(deleteTarget.id);
    await loadSkills();
    setDeleteTarget(null);
    setToast('Skill deleted.');
  }

  async function handleSeedSkills() {
    setSkillsSeeding(true);
    try {
      await seedSkillsFromStatic();
      await loadSkills();
      setToast('Skills imported from portfolio data!');
    } catch (err) {
      setToast('Failed to import skills.');
    }
    setSkillsSeeding(false);
  }

  // Experience handlers
  async function handleAddExperience(form) {
    await addExperience(form);
    await loadExperiences();
    setView('list');
    setToast('Experience added successfully!');
  }

  async function handleUpdateExperience(form) {
    await updateExperience(editTarget.id, form);
    await loadExperiences();
    setView('list');
    setEditTarget(null);
    setToast('Experience updated successfully!');
  }

  async function handleDeleteExperience() {
    await deleteExperience(deleteTarget.id);
    await loadExperiences();
    setDeleteTarget(null);
    setToast('Experience deleted.');
  }

  async function handleSeedExperiences() {
    setExpSeeding(true);
    try {
      await seedExperiencesFromStatic();
      await loadExperiences();
      setToast('Experiences imported from portfolio data!');
    } catch (err) {
      setToast('Failed to import experiences.');
    }
    setExpSeeding(false);
  }

  // Education handlers
  async function handleAddEducation(form) {
    await addEducationEntry(form);
    await loadEducation();
    setView('list');
    setToast('Education entry added successfully!');
  }

  async function handleUpdateEducation(form) {
    await updateEducationEntry(editTarget.id, form);
    await loadEducation();
    setView('list');
    setEditTarget(null);
    setToast('Education entry updated successfully!');
  }

  async function handleDeleteEducation() {
    await deleteEducationEntry(deleteTarget.id);
    await loadEducation();
    setDeleteTarget(null);
    setToast('Education entry deleted.');
  }

  async function handleSeedEducation() {
    setEduSeeding(true);
    try {
      await seedEducationFromStatic();
      await loadEducation();
      setToast('Education entries imported from portfolio data!');
    } catch (err) {
      setToast('Failed to import education.');
    }
    setEduSeeding(false);
  }

  function handleDeleteConfirm() {
    if (deleteType === 'blog') {
      handleDeleteBlog();
    } else if (deleteType === 'skill') {
      handleDeleteSkill();
    } else if (deleteType === 'experience') {
      handleDeleteExperience();
    } else if (deleteType === 'education') {
      handleDeleteEducation();
    } else {
      handleDeleteProject();
    }
  }

  function startEdit(item) {
    setEditTarget(item);
    setView('edit');
  }

  function switchTab(tab) {
    setActiveTab(tab);
    setView('list');
    setEditTarget(null);
  }

  /* ─── Loading state ──────────────────────────────── */
  if (authLoading) {
    return (
      <div className="admin-overlay">
        <div className="admin-login">
          <div className="admin-login-card" style={{ textAlign: 'center' }}>
            <span className="login-icon">⏳</span>
            <p style={{ fontFamily: 'var(--mono)', color: 'var(--muted)', fontSize: '0.7rem' }}>Checking authentication...</p>
          </div>
        </div>
      </div>
    );
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
            {resetSent && <div className="success-msg" style={{
              background: 'rgba(57, 255, 20, 0.08)',
              border: '1px solid rgba(57, 255, 20, 0.25)',
              color: 'var(--neon)',
              padding: '0.8rem',
              fontFamily: 'var(--mono)',
              fontSize: '0.65rem',
              marginBottom: '0.5rem',
              lineHeight: 1.6,
            }}>✓ Password reset email sent to <strong>{email}</strong>. Check your inbox and spam folder.</div>}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setResetSent(false); }}
                  placeholder="admin@example.com"
                  autoFocus
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>
              <button type="submit" className="btn-admin primary" style={{ width: '100%', justifyContent: 'center' }}>
                🔐 Sign In →
              </button>
              <button
                type="button"
                onClick={handleForgotPassword}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--cyan)',
                  fontFamily: 'var(--mono)',
                  fontSize: '0.6rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  opacity: 0.8,
                }}
              >
                Forgot Password?
              </button>
            </form>
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button
                className="btn-admin back"
                onClick={() => router.push('/')}
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
            <button className="btn-admin small" onClick={() => router.push('/')}>
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
            <div className="admin-stat-icon">📝</div>
            <div className="admin-stat-info">
              <h3>{blogsList.filter(b => b.status === 'published').length}</h3>
              <p>Published Blogs</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">📋</div>
            <div className="admin-stat-info">
              <h3>{blogsList.filter(b => !b.status || b.status === 'draft').length}</h3>
              <p>Drafts</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">🛠️</div>
            <div className="admin-stat-info">
              <h3>{skillsList.length || staticSkills.length}</h3>
              <p>Skills</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">💼</div>
            <div className="admin-stat-info">
              <h3>{experienceList.length || staticExperience.length}</h3>
              <p>Experience</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">🎓</div>
            <div className="admin-stat-info">
              <h3>{educationList.length || staticEducation.length}</h3>
              <p>Education</p>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => switchTab('projects')}
          >
            📂 Projects
          </button>
          <button
            className={`admin-tab ${activeTab === 'blogs' ? 'active' : ''}`}
            onClick={() => switchTab('blogs')}
          >
            📝 Blog Posts
          </button>
          <button
            className={`admin-tab ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => switchTab('skills')}
          >
            🛠️ Skills
          </button>
          <button
            className={`admin-tab ${activeTab === 'experience' ? 'active' : ''}`}
            onClick={() => switchTab('experience')}
          >
            💼 Experience
          </button>
          <button
            className={`admin-tab ${activeTab === 'education' ? 'active' : ''}`}
            onClick={() => switchTab('education')}
          >
            🎓 Education
          </button>
        </div>

        {/* ═══ PROJECTS TAB ═══ */}
        {activeTab === 'projects' && view === 'list' && (
          <>
            <div className="admin-section-header">
              <div>
                <div className="admin-section-label">// manage</div>
                <h2>All Projects</h2>
              </div>
              <button className="btn-admin primary" onClick={() => setView('add')}>
                + Add New Project
              </button>
            </div>

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
                        <button className="btn-admin small danger" onClick={() => { setDeleteTarget(project); setDeleteType('project'); }}>
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

        {activeTab === 'projects' && view === 'add' && (
          <>
            <button className="btn-admin back" onClick={() => setView('list')}>
              ← Back to Projects
            </button>
            <div style={{ marginTop: '1rem' }}>
              <div className="admin-section-label">// new project</div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                Publish a New Project
              </h2>
              <ProjectForm onSave={handleAddProject} onCancel={() => setView('list')} />
            </div>
          </>
        )}

        {activeTab === 'projects' && view === 'edit' && editTarget && (
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
                onSave={handleUpdateProject}
                onCancel={() => { setView('list'); setEditTarget(null); }}
              />
            </div>
          </>
        )}

        {/* ═══ BLOGS TAB ═══ */}
        {activeTab === 'blogs' && view === 'list' && (
          <>
            <div className="admin-section-header">
              <div>
                <div className="admin-section-label">// manage</div>
                <h2>All Blog Posts</h2>
              </div>
              <button className="btn-admin primary" onClick={() => setView('add')}>
                + New Blog Post
              </button>
            </div>

            {blogsList.length === 0 ? (
              <div className="admin-empty">
                <div className="empty-icon">📝</div>
                <h3>No blog posts yet</h3>
                <p>Click "New Blog Post" to publish your first blog post.</p>
              </div>
            ) : (
              <div className="admin-project-list">
                {blogsList.map((blog) => {
                  const isDraft = !blog.status || blog.status === 'draft';
                  return (
                    <div key={blog.id} className="admin-project-row" style={isDraft ? { borderLeft: '3px solid var(--muted)', opacity: 0.85 } : { borderLeft: '3px solid var(--neon)' }}>
                      <div className="admin-project-info">
                        <h3>{blog.title}</h3>
                        <p>{blog.excerpt || blog.content?.substring(0, 120) + '...'}</p>
                        <div className="admin-project-meta">
                          {isDraft
                            ? <span className="badge badge-draft">DRAFT</span>
                            : <span className="badge badge-published">PUBLISHED</span>
                          }
                          {blog.featured && <span className="badge badge-featured">FEATURED</span>}
                          {blog.tags?.slice(0, 4).map((tag) => (
                            <span key={tag} className="tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className="admin-project-actions">
                        {isDraft ? (
                          <button className="btn-admin small" style={{ borderColor: 'var(--neon)', color: 'var(--neon)' }} onClick={() => handlePublishBlog(blog)}>
                            🚀 Publish
                          </button>
                        ) : (
                          <button className="btn-admin small" onClick={() => handleUnpublishBlog(blog)}>
                            ↩ Unpublish
                          </button>
                        )}
                        <button className="btn-admin small" onClick={() => startEdit(blog)}>
                          Edit
                        </button>
                        <button className="btn-admin small danger" onClick={() => { setDeleteTarget(blog); setDeleteType('blog'); }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'blogs' && view === 'add' && (
          <>
            <button className="btn-admin back" onClick={() => setView('list')}>
              ← Back to Blog Posts
            </button>
            <div style={{ marginTop: '1rem' }}>
              <div className="admin-section-label">// new blog post</div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                Write a New Blog Post
              </h2>
              <BlogForm onSave={handleAddBlog} onCancel={() => setView('list')} />
            </div>
          </>
        )}

        {activeTab === 'blogs' && view === 'edit' && editTarget && (
          <>
            <button className="btn-admin back" onClick={() => { setView('list'); setEditTarget(null); }}>
              ← Back to Blog Posts
            </button>
            <div style={{ marginTop: '1rem' }}>
              <div className="admin-section-label">// edit blog post</div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                Edit: {editTarget.title}
              </h2>
              <BlogForm
                initial={editTarget}
                onSave={handleUpdateBlog}
                onCancel={() => { setView('list'); setEditTarget(null); }}
              />
            </div>
          </>
        )}

        {/* ═══ SKILLS TAB ═══ */}
        {activeTab === 'skills' && view === 'list' && (
          <>
            <div className="admin-section-header">
              <div>
                <div className="admin-section-label">// manage</div>
                <h2>All Skills</h2>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {skillsList.length === 0 && (
                  <button
                    className="btn-admin"
                    onClick={handleSeedSkills}
                    disabled={skillsSeeding}
                    style={{ borderColor: 'var(--neon)', color: 'var(--neon)' }}
                  >
                    {skillsSeeding ? '⏳ Importing...' : '📥 Import from Portfolio'}
                  </button>
                )}
                <button className="btn-admin primary" onClick={() => setView('add')}>
                  + Add New Skill
                </button>
              </div>
            </div>

            {/* Live preview grid — same layout as portfolio */}
            {(skillsList.length > 0 || staticSkills.length > 0) && (
              <div style={{ marginBottom: '2rem' }}>
                <div className="admin-section-label" style={{ marginBottom: '0.8rem' }}>
                  👁 Portfolio Preview
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: '1rem',
                  padding: '1.2rem',
                  border: '1px solid var(--border)',
                  background: 'rgba(0,229,255,0.02)',
                }}>
                  {(skillsList.length > 0 ? skillsList : staticSkills).map((skill) => (
                    <div
                      key={skill.id || skill.name}
                      style={{
                        background: 'var(--card)', border: '1px solid var(--border)',
                        padding: '1.1rem 0.9rem', textAlign: 'center',
                        transition: 'border-color 0.3s, transform 0.2s',
                        cursor: 'default',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'var(--cyan)';
                        e.currentTarget.style.transform = 'translateY(-4px)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.transform = 'none';
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{skill.icon}</div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.66rem', color: 'var(--text)', letterSpacing: '0.04em' }}>
                        {skill.name}
                      </div>
                      <div style={{
                        marginTop: '0.6rem', height: 2,
                        background: 'var(--border)', borderRadius: 1, overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%', borderRadius: 1,
                          background: 'linear-gradient(90deg, var(--blue2), var(--cyan))',
                          width: skill.level + '%',
                          transition: 'width 0.5s ease',
                        }} />
                      </div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.55rem', color: 'var(--muted)', marginTop: '0.3rem' }}>
                        {skill.category}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills list — editable rows */}
            {skillsList.length === 0 ? (
              <div className="admin-empty">
                <div className="empty-icon">🛠️</div>
                <h3>No admin skills yet</h3>
                <p>Click "Import from Portfolio" to copy your current skills, or "Add New Skill" to start fresh.</p>
              </div>
            ) : (
              <div className="admin-project-list">
                {skillsList.map((skill) => (
                  <div key={skill.id} className="admin-project-row">
                    <div className="admin-project-info">
                      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>{skill.icon}</span>
                        {skill.name}
                      </h3>
                      <div className="admin-project-meta">
                        <span className="badge badge-admin">{skill.category}</span>
                        <span className="tag">{skill.level}% proficiency</span>
                      </div>
                    </div>
                    <div className="admin-project-actions">
                      <button className="btn-admin small" onClick={() => startEdit(skill)}>
                        Edit
                      </button>
                      <button className="btn-admin small danger" onClick={() => { setDeleteTarget(skill); setDeleteType('skill'); }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'skills' && view === 'add' && (
          <>
            <button className="btn-admin back" onClick={() => setView('list')}>
              ← Back to Skills
            </button>
            <div style={{ marginTop: '1rem' }}>
              <div className="admin-section-label">// new skill</div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                Add a New Skill
              </h2>
              <SkillForm onSave={handleAddSkill} onCancel={() => setView('list')} />
            </div>
          </>
        )}

        {activeTab === 'skills' && view === 'edit' && editTarget && (
          <>
            <button className="btn-admin back" onClick={() => { setView('list'); setEditTarget(null); }}>
              ← Back to Skills
            </button>
            <div style={{ marginTop: '1rem' }}>
              <div className="admin-section-label">// edit skill</div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                Edit: {editTarget.name}
              </h2>
              <SkillForm
                initial={editTarget}
                onSave={handleUpdateSkill}
                onCancel={() => { setView('list'); setEditTarget(null); }}
              />
            </div>
          </>
        )}
        {/* ═══ EXPERIENCE TAB ═══ */}
        {activeTab === 'experience' && view === 'list' && (
          <>
            <div className="admin-section-header">
              <div>
                <div className="admin-section-label">// manage</div>
                <h2>All Experience</h2>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {experienceList.length === 0 && (
                  <button
                    className="btn-admin"
                    onClick={handleSeedExperiences}
                    disabled={expSeeding}
                    style={{ borderColor: 'var(--neon)', color: 'var(--neon)' }}
                  >
                    {expSeeding ? '⏳ Importing...' : '📥 Import from Portfolio'}
                  </button>
                )}
                <button className="btn-admin primary" onClick={() => setView('add')}>
                  + Add Experience
                </button>
              </div>
            </div>

            {/* Live preview — timeline layout */}
            {(experienceList.length > 0 || staticExperience.length > 0) && (
              <div style={{ marginBottom: '2rem' }}>
                <div className="admin-section-label" style={{ marginBottom: '0.8rem' }}>
                  👁 Portfolio Preview
                </div>
                <div style={{
                  padding: '1.2rem 1.2rem 0.5rem 2.5rem',
                  border: '1px solid var(--border)',
                  background: 'rgba(0,229,255,0.02)',
                  position: 'relative',
                  borderLeft: '1px solid',
                  borderImage: 'linear-gradient(180deg, var(--cyan), var(--blue2), transparent) 1',
                }}>
                  {(experienceList.length > 0 ? experienceList : staticExperience).map((item) => (
                    <div key={item.id || item.company} style={{ position: 'relative', marginBottom: '2rem', paddingLeft: '1.5rem' }}>
                      <div style={{
                        position: 'absolute', left: '-2.05rem', top: '0.3rem',
                        width: 10, height: 10, borderRadius: '50%',
                        background: item.current ? 'var(--cyan)' : 'var(--muted)',
                        boxShadow: item.current ? '0 0 12px var(--cyan)' : 'none',
                      }} />
                      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.63rem', color: 'var(--cyan)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                        {item.period} · {item.duration}
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>{item.role}</div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>
                        {item.company} · {item.type} · {item.location}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience list — editable rows */}
            {experienceList.length === 0 ? (
              <div className="admin-empty">
                <div className="empty-icon">💼</div>
                <h3>No admin experiences yet</h3>
                <p>Click "Import from Portfolio" to copy your current experiences, or "Add Experience" to start fresh.</p>
              </div>
            ) : (
              <div className="admin-project-list">
                {experienceList.map((exp) => (
                  <div key={exp.id} className="admin-project-row" style={exp.current ? { borderLeft: '3px solid var(--cyan)' } : {}}>
                    <div className="admin-project-info">
                      <h3>{exp.role}</h3>
                      <p>{exp.company} · {exp.type} · {exp.location}</p>
                      <div className="admin-project-meta">
                        {exp.current && <span className="badge badge-featured">CURRENT</span>}
                        <span className="badge badge-admin">{exp.period}</span>
                        {(exp.tags || []).slice(0, 3).map((tag) => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="admin-project-actions">
                      <button className="btn-admin small" onClick={() => startEdit(exp)}>
                        Edit
                      </button>
                      <button className="btn-admin small danger" onClick={() => { setDeleteTarget(exp); setDeleteType('experience'); }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'experience' && view === 'add' && (
          <>
            <button className="btn-admin back" onClick={() => setView('list')}>
              ← Back to Experience
            </button>
            <div style={{ marginTop: '1rem' }}>
              <div className="admin-section-label">// new experience</div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                Add Experience
              </h2>
              <ExperienceForm onSave={handleAddExperience} onCancel={() => setView('list')} />
            </div>
          </>
        )}

        {activeTab === 'experience' && view === 'edit' && editTarget && (
          <>
            <button className="btn-admin back" onClick={() => { setView('list'); setEditTarget(null); }}>
              ← Back to Experience
            </button>
            <div style={{ marginTop: '1rem' }}>
              <div className="admin-section-label">// edit experience</div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                Edit: {editTarget.role}
              </h2>
              <ExperienceForm
                initial={editTarget}
                onSave={handleUpdateExperience}
                onCancel={() => { setView('list'); setEditTarget(null); }}
              />
            </div>
          </>
        )}

        {/* ═══ EDUCATION TAB ═══ */}
        {activeTab === 'education' && view === 'list' && (
          <>
            <div className="admin-section-header">
              <div>
                <div className="admin-section-label">// manage</div>
                <h2>All Education</h2>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {educationList.length === 0 && (
                  <button
                    className="btn-admin"
                    onClick={handleSeedEducation}
                    disabled={eduSeeding}
                    style={{ borderColor: 'var(--neon)', color: 'var(--neon)' }}
                  >
                    {eduSeeding ? '⏳ Importing...' : '📥 Import from Portfolio'}
                  </button>
                )}
                <button className="btn-admin primary" onClick={() => setView('add')}>
                  + Add Education
                </button>
              </div>
            </div>

            {/* Live preview — card grid matching portfolio */}
            {(educationList.length > 0 || staticEducation.length > 0) && (
              <div style={{ marginBottom: '2rem' }}>
                <div className="admin-section-label" style={{ marginBottom: '0.8rem' }}>
                  👁 Portfolio Preview
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '1.4rem',
                  padding: '1.2rem',
                  border: '1px solid var(--border)',
                  background: 'rgba(0,229,255,0.02)',
                }}>
                  {(educationList.length > 0 ? educationList : staticEducation).map((item) => (
                    <div
                      key={item.id || item.school}
                      style={{
                        background: 'var(--card)', border: '1px solid var(--border)',
                        padding: '1.6rem', position: 'relative',
                        transition: 'border-color 0.3s, transform 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'var(--cyan)';
                        e.currentTarget.style.transform = 'translateY(-5px)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.transform = 'none';
                      }}
                    >
                      <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                        background: 'linear-gradient(90deg, var(--blue2), var(--cyan))',
                      }} />
                      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--cyan)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                        {item.degree}
                      </div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                        {item.school}
                      </h3>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>
                        {item.period}
                      </div>
                      {item.current && (
                        <div style={{ marginTop: '0.7rem', fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--neon)' }}>
                          ● IN PROGRESS
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education list — editable rows */}
            {educationList.length === 0 ? (
              <div className="admin-empty">
                <div className="empty-icon">🎓</div>
                <h3>No admin education entries yet</h3>
                <p>Click "Import from Portfolio" to copy your current education, or "Add Education" to start fresh.</p>
              </div>
            ) : (
              <div className="admin-project-list">
                {educationList.map((edu) => (
                  <div key={edu.id} className="admin-project-row" style={edu.current ? { borderLeft: '3px solid var(--neon)' } : {}}>
                    <div className="admin-project-info">
                      <h3>{edu.degree}</h3>
                      <p>{edu.school}</p>
                      <div className="admin-project-meta">
                        {edu.current && <span className="badge badge-featured">IN PROGRESS</span>}
                        <span className="badge badge-admin">{edu.period}</span>
                      </div>
                    </div>
                    <div className="admin-project-actions">
                      <button className="btn-admin small" onClick={() => startEdit(edu)}>
                        Edit
                      </button>
                      <button className="btn-admin small danger" onClick={() => { setDeleteTarget(edu); setDeleteType('education'); }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'education' && view === 'add' && (
          <>
            <button className="btn-admin back" onClick={() => setView('list')}>
              ← Back to Education
            </button>
            <div style={{ marginTop: '1rem' }}>
              <div className="admin-section-label">// new education</div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                Add Education Entry
              </h2>
              <EducationForm onSave={handleAddEducation} onCancel={() => setView('list')} />
            </div>
          </>
        )}

        {activeTab === 'education' && view === 'edit' && editTarget && (
          <>
            <button className="btn-admin back" onClick={() => { setView('list'); setEditTarget(null); }}>
              ← Back to Education
            </button>
            <div style={{ marginTop: '1rem' }}>
              <div className="admin-section-label">// edit education</div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                Edit: {editTarget.degree}
              </h2>
              <EducationForm
                initial={editTarget}
                onSave={handleUpdateEducation}
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
          title={deleteTarget.title || deleteTarget.name || deleteTarget.role || deleteTarget.degree}
          itemType={deleteType === 'blog' ? 'Blog Post' : deleteType === 'skill' ? 'Skill' : deleteType === 'experience' ? 'Experience' : deleteType === 'education' ? 'Education' : 'Project'}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
