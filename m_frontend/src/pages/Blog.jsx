import React, { useState } from 'react';
import axios from '../api/apiInstance';
import ReactMarkdown from 'react-markdown';
import backgroundImage from '../assets/img/bg_blog.png';
import img from '../assets/divider.svg';

export default function BlogPostForm() {
  const [form, setForm] = useState({ title: '', content: '', tags: '', image: null });
  const [status, setStatus] = useState('');
  const [posts, setPosts] = useState([]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', form.title);
      data.append('content', form.content);
      data.append('tags', form.tags);
      if (form.image) data.append('image', form.image);

      const res = await axios.post('/blog', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setStatus('Blog post submitted successfully!');
      setPosts([res.data, ...posts]);
      setForm({ title: '', content: '', tags: '', image: null });
    } catch (err) {
      console.error(err);
      setStatus('Failed to submit blog post.');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-gray-600"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">Write for Madhyam</h1>
        <div className="my-8 flex justify-center">
                  <img src={img} alt="divider" className="w-full max-w-xl" />
        </div>
        <p className="text-center mb-8 text-lg">
          Share your thoughts, ideas, and experiences about food, sustainability, or community support.
        </p>

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
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
          />
          <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            Submit Blog Post
          </button>
          {status && <p className="text-center text-sm text-green-600">{status}</p>}
        </form>

        {posts.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-4">Your Posts</h2>
            {posts.map((post, idx) => (
              <div key={idx} className="p-4 border rounded bg-white shadow">
                <h3 className="text-2xl font-semibold mb-2">{post.title}</h3>
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt="Blog"
                    className="mb-4 w-full max-h-64 object-cover rounded"
                  />
                )}
                <ReactMarkdown className="prose">{post.content}</ReactMarkdown>
                {post.tags && (
                  <p className="mt-2 text-sm text-gray-500">Tags: {post.tags}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
