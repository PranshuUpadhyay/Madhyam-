import React, { useState, useEffect } from 'react';
import { blogService } from '../api/services';
import ReactMarkdown from 'react-markdown';
import backgroundImage from '../assets/img/bg_blog.png';

export default function BlogPostForm() {
  const [form, setForm] = useState({ title: '', content: '', tags: '', image: null });
  const [status, setStatus] = useState('');
  const [posts, setPosts] = useState([]);
  const [modalPost, setModalPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [showMyBlogs, setShowMyBlogs] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '', tags: '', image: null });
  const [editImagePreview, setEditImagePreview] = useState(null);

  // Get current user from localStorage or context
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    setCurrentUser(user);
  }, []);

  // Fetch blogs from backend using blogService
  const fetchBlogs = async (authorId = null) => {
    try {
      setLoading(true);
      let response;
      if (authorId) {
        response = await blogService.getBlogsByAuthor(authorId);
      } else {
        response = await blogService.getAllBlogs();
      }
      setPosts(response.data.data || []);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to fetch blog posts.');
    } finally {
      setLoading(false);
    }
  };

  // Load blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setForm({ ...form, image: null });
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!currentUser) {
      setError('Please log in to create a blog post.');
      setLoading(false);
      return;
    }

    try {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('content', form.content);
      formData.append('tags', form.tags);
      formData.append('authorId', currentUser.id);
      formData.append('status', 'published');
      if (form.image) {
        formData.append('image', form.image);
      }
      const response = await blogService.createBlog(formData, true); // pass a flag for multipart
      
      if (response.data.success) {
        setStatus('Blog post submitted successfully!');
        setForm({ title: '', content: '', tags: '', image: null });
        // Refresh the blog list
        fetchBlogs();
      }
    } catch (err) {
      console.error('Error creating blog:', err);
      setError('Failed to submit blog post.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMyBlogs = () => {
    if (showMyBlogs) {
      fetchBlogs(); // Show all blogs
    } else {
      fetchBlogs(currentUser?.id); // Show user's blogs
    }
    setShowMyBlogs(!showMyBlogs);
  };

  // Helper to get full image URL
  const getImageUrl = (image) => {
    if (!image) return '';
    if (image.startsWith('/uploads')) {
      return `http://localhost:5000${image}`;
    }
    return image;
  };

  // Add edit handler
  const handleEditPost = (post) => {
    setEditingPostId(post.id);
    setEditForm({
      title: post.title,
      content: post.content,
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
      image: null // Only set if user uploads a new image
    });
    setEditImagePreview(post.image ? getImageUrl(post.image) : null);
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setEditForm({ ...editForm, image: files[0] });
      if (files[0]) {
        setEditImagePreview(URL.createObjectURL(files[0]));
      } else {
        setEditImagePreview(null);
      }
    } else {
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const handleEditSubmit = async (e, post) => {
    e.preventDefault();
    try {
      let updateData;
      if (editForm.image) {
        updateData = new FormData();
        updateData.append('title', editForm.title);
        updateData.append('content', editForm.content);
        updateData.append('tags', editForm.tags);
        updateData.append('image', editForm.image);
      } else {
        updateData = {
          title: editForm.title,
          content: editForm.content,
          tags: editForm.tags
        };
      }
      await blogService.updateBlog(post.id, updateData);
      setPosts(posts.map(p => p.id === post.id ? { ...p, ...editForm, tags: editForm.tags.split(',').map(t => t.trim()), image: editImagePreview || p.image } : p));
      setEditingPostId(null);
      setEditForm({ title: '', content: '', tags: '', image: null });
      setEditImagePreview(null);
    } catch (err) {
      alert('Failed to update blog post.');
    }
  };

  const handleEditCancel = () => {
    setEditingPostId(null);
    setEditForm({ title: '', content: '', tags: '', image: null });
    setEditImagePreview(null);
  };

  // Update delete handler to add debug log
  const handleDeletePost = async (post) => {
    console.log('Delete clicked for', post);
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await blogService.deleteBlog(post.id);
      setPosts(posts.filter(p => p.id !== post.id));
    } catch (err) {
      alert('Failed to delete blog post.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-600">
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">Write for Madhyam</h1>
        <div className="my-8 flex justify-center">
          <img src={backgroundImage} alt="divider" className="w-full max-w-xl" />
        </div>
        <p className="text-center mb-8 text-lg">
          Share your thoughts, ideas, and experiences about food, sustainability, or community support.
        </p>

        {/* Blog Creation Form */}
        {currentUser && (
          <form onSubmit={handleSubmit} className="grid gap-6 bg-white p-6 rounded shadow mb-10">
            <input
              type="text"
              name="title"
              placeholder="Blog Title"
              value={form.title}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded"
              required
            />
            <textarea
              name="content"
              rows="8"
              value={form.content}
              onChange={handleChange}
              placeholder="Write your blog content here..."
              className="border border-gray-300 p-2 rounded font-mono"
              required
            ></textarea>
            <input
              type="text"
              name="tags"
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded"
            />
            <div>
              <label className="block mb-2 font-medium">Image</label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 focus:outline-none"
                  onClick={() => document.getElementById('blog-image-input').click()}
                >
                  Add Image
                </button>
                <input
                  id="blog-image-input"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview && (
                  <div className="flex items-center gap-2">
                    <img src={imagePreview} alt="Preview" className="w-20 h-14 object-cover rounded border" />
                    <button
                      type="button"
                      className="bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200 focus:outline-none"
                      onClick={handleRemoveImage}
                      title="Remove Image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Blog Post'}
            </button>
            {status && <p className="text-center text-sm text-green-600">{status}</p>}
            {error && <p className="text-center text-sm text-red-600">{error}</p>}
          </form>
        )}

        {/* Blog Filter Controls */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {showMyBlogs ? 'My Blog Posts' : 'All Blog Posts'}
          </h2>
          {currentUser && (
            <button
              onClick={toggleMyBlogs}
              className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
            >
              {showMyBlogs ? 'Show All Posts' : 'Show My Posts'}
            </button>
          )}
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="text-center py-8">
            <p>Loading blog posts...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">
                {showMyBlogs ? 'You haven\'t created any blog posts yet.' : 'No blog posts available.'}
              </div>
            ) : (
              posts.map((post, idx) => (
                <div
                  key={post.id || idx}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer flex flex-col relative"
                  onClick={() => setModalPost(post)}
                >
                  {/* Action buttons for owner */}
                  {currentUser && post.author?.id === currentUser.id && (
                    <div className="absolute top-2 right-2 flex gap-2 z-10" onClick={e => e.stopPropagation()}>
                      {editingPostId === post.id ? (
                        <form onSubmit={e => handleEditSubmit(e, post)} className="p-4 md:p-6 bg-gray-50 rounded-lg flex flex-col gap-3">
                          <input
                            type="text"
                            name="title"
                            value={editForm.title}
                            onChange={handleEditChange}
                            className="border border-gray-300 p-2 rounded"
                            required
                            placeholder="Blog Title"
                          />
                          <textarea
                            name="content"
                            value={editForm.content}
                            onChange={handleEditChange}
                            rows={4}
                            className="border border-gray-300 p-2 rounded"
                            required
                            placeholder="Blog Content"
                          />
                          <input
                            type="text"
                            name="tags"
                            value={editForm.tags}
                            onChange={handleEditChange}
                            className="border border-gray-300 p-2 rounded"
                            placeholder="Tags (comma separated)"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              name="image"
                              accept="image/*"
                              onChange={handleEditChange}
                              className="border border-gray-300 p-2 rounded"
                            />
                            {editImagePreview && (
                              <img src={editImagePreview} alt="Preview" className="w-20 h-14 object-cover rounded border" />
                            )}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
                            <button type="button" onClick={handleEditCancel} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <button
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 focus:outline-none"
                            title="Edit Post"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditPost(post);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h2v2H7v-2h2z" />
                            </svg>
                          </button>
                          <button
                            className="bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-2 focus:outline-none ml-2"
                            title="Delete Post"
                            onClick={e => { e.stopPropagation(); handleDeletePost(post); }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  {post.image && (
                    <img
                      src={getImageUrl(post.image)}
                      alt="Blog"
                      className="w-full h-40 object-cover rounded-t"
                    />
                  )}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {post.tags && post.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 mb-3 line-clamp-3">{post.content.slice(0, 120)}...</p>
                    <div className="mt-auto flex items-center justify-between text-xs text-gray-400">
                      <span>By {post.author?.username || post.author?.firstName || 'Anonymous'}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal for full post */}
        {modalPost && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                onClick={() => setModalPost(null)}
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-2">{modalPost.title}</h2>
              {modalPost.image && (
                <img
                  src={getImageUrl(modalPost.image)}
                  alt="Blog"
                  className="mb-4 w-full max-h-64 object-cover rounded"
                />
              )}
              <div className="mb-2 flex gap-2 flex-wrap">
                {modalPost.tags && modalPost.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mb-4 text-gray-500 text-sm">
                By {modalPost.author?.username || modalPost.author?.firstName || 'Anonymous'} | {new Date(modalPost.createdAt).toLocaleDateString()}
              </div>
              <div className="prose prose-blue max-w-none">
                <ReactMarkdown>{modalPost.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
