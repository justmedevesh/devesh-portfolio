import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { projects as staticProjects } from '../data/portfolio';
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
  const navigate = useNavigate();
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

  useEffect(() => {
    if (authed) {
      loadProjects();
      loadBlogs();
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

  function handleDeleteConfirm() {
    if (deleteType === 'blog') {
      handleDeleteBlog();
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
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          title={deleteTarget.title}
          itemType={deleteType === 'blog' ? 'Blog Post' : 'Project'}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
