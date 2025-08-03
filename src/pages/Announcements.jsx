import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { isBoardMember as isAdmin } from '../utils/auth';

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
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      {/* Header */}
      <nav className="bg-white shadow-md rounded px-4 sm:px-6 py-3 sm:py-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-purple-700 mb-2 sm:mb-0">Announcements</h1>
      </nav>

      {/* Read-only message */}
      {!isWritable && (
        <div className="text-center text-gray-600 italic mb-4">
          Read-only access. Only board members can manage announcements.
        </div>
      )}

      {/* Announcement Form */}
      {isWritable && (
        <div className="bg-white p-4 sm:p-6 rounded shadow-md mb-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Enter announcement"
              className="border px-3 py-2 rounded resize-none"
              required
            />
            <button type="submit" className="bg-purple-700 text-white px-4 py-2 rounded">
              {editId ? 'Update Announcement' : 'Add Announcement'}
            </button>
          </form>
        </div>
      )}

      {/* Announcements Table */}
      <div className="bg-white p-4 sm:p-6 rounded shadow-md overflow-x-auto">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">All Announcements</h2>
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Message</th>
              <th className="px-4 py-2 text-left">Date</th>
              {isWritable && <th className="px-4 py-2 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {announcements.length === 0 ? (
              <tr>
                <td colSpan={isWritable ? 3 : 2} className="text-center text-gray-500 italic py-4">
                  No announcements yet.
                </td>
              </tr>
            ) : (
              announcements.map((ann) => (
                <tr key={ann.id} className="border-t">
                  <td className="px-4 py-2">{ann.message}</td>
                  <td className="px-4 py-2">{new Date(ann.created_at).toLocaleString()}</td>
                  {isWritable && (
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(ann)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ann.id)}
                        className="text-red-600 hover:underline"
                      >
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
