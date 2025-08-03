import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { isBoardMember as isAdmin, logout } from '../utils/auth';
import { Link } from 'react-router-dom';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [message, setMessage] = useState('');
  const [editId, setEditId] = useState(null);
  const [isWritable, setIsWritable] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
    setIsWritable(isAdmin());
  }, []);

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Fetch error:', error.message);
    else setAnnouncements(data);
  };

  const resetForm = () => {
    setMessage('');
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;

    const payload = { message };

    let error;
    if (editId) {
      ({ error } = await supabase.from('announcements').update(payload).eq('id', editId));
    } else {
      ({ error } = await supabase.from('announcements').insert([payload]));
    }

    if (error) console.error('Save error:', error.message);

    resetForm();
    fetchAnnouncements();
  };

  const handleEdit = (announcement) => {
    setMessage(announcement.message);
    setEditId(announcement.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (error) console.error('Delete error:', error.message);
    fetchAnnouncements();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Navigation */}
      <nav className="bg-white shadow-md rounded px-6 py-4 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">Announcements</h1>
        <div className="space-x-4">
          <Link to="/" className="text-blue-500 hover:text-blue-700">Dashboard</Link>
          <Link to="/villas" className="text-blue-500 hover:text-blue-700">Villas</Link>
          <Link to="/payments" className="text-blue-500 hover:text-blue-700">Payments</Link>
          <Link to="/complaints" className="text-blue-500 hover:text-blue-700">Complaints</Link>
          <button onClick={logout} className="ml-4 text-red-600 font-semibold">Logout</button>
        </div>
      </nav>

      {/* Read-only notice */}
      {!isWritable && (
        <div className="text-center text-gray-600 italic mb-4">
          Read-only access. Only board members can manage announcements.
        </div>
      )}

      {/* Form */}
      {isWritable && (
        <div className="bg-white p-6 rounded shadow-md mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Enter announcement"
              className="border px-3 py-2 rounded"
              required
            />
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded w-full">
              {editId ? 'Update Announcement' : 'Add Announcement'}
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white p-6 rounded shadow-md overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">All Announcements</h2>
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Message</th>
              <th className="px-4 py-2">Date</th>
              {isWritable && <th className="px-4 py-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {announcements.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center text-gray-500 italic py-4">No announcements yet.</td>
              </tr>
            ) : (
              announcements.map((ann) => (
                <tr key={ann.id} className="border-t">
                  <td className="px-4 py-2">{ann.message}</td>
                  <td className="px-4 py-2">
                    {new Date(ann.created_at).toLocaleString()}
                  </td>
                  {isWritable && (
                    <td className="px-4 py-2 space-x-2">
                      <button onClick={() => handleEdit(ann)} className="text-blue-500 hover:underline">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(ann.id)} className="text-red-500 hover:underline">
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Announcements;
