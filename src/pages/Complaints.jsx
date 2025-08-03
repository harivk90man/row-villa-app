import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { isBoardMember as isAdmin, logout } from '../utils/auth';
import { Link } from 'react-router-dom';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [villaNo, setVillaNo] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [editId, setEditId] = useState(null);
  const [isWritable, setIsWritable] = useState(false);

  useEffect(() => {
    fetchComplaints();
    setIsWritable(isAdmin());
  }, []);

  const fetchComplaints = async () => {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Fetch error:', error.message);
    else setComplaints(data);
  };

  const resetForm = () => {
    setVillaNo('');
    setDescription('');
    setStatus('Pending');
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!villaNo || !description) return;

    const payload = { villaNo, description, status };

    let error;
    if (editId) {
      ({ error } = await supabase.from('complaints').update(payload).eq('id', editId));
    } else {
      ({ error } = await supabase.from('complaints').insert([payload]));
    }

    if (error) console.error('Save error:', error.message);

    resetForm();
    fetchComplaints();
  };

  const handleEdit = (complaint) => {
    setVillaNo(complaint.villaNo);
    setDescription(complaint.description);
    setStatus(complaint.status);
    setEditId(complaint.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this complaint?')) return;
    const { error } = await supabase.from('complaints').delete().eq('id', id);
    if (error) console.error('Delete error:', error.message);
    fetchComplaints();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <nav className="bg-white shadow-md rounded px-6 py-4 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">Complaints</h1>
        
      </nav>

      {!isWritable && (
        <div className="text-center text-gray-600 italic mb-4">
          Read-only access. Only board members can manage complaints.
        </div>
      )}

      {isWritable && (
        <div className="bg-white p-6 rounded shadow-md mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Villa No"
              value={villaNo}
              onChange={(e) => setVillaNo(e.target.value)}
              required
              className="border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Complaint Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="border px-3 py-2 rounded"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border px-3 py-2 rounded"
            >
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
            </select>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded col-span-1 md:col-span-3">
              {editId ? 'Update' : 'Add Complaint'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded shadow-md overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Complaint List</h2>
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Villa No</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Created</th>
              {isWritable && <th className="px-4 py-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 italic py-4">No complaints found.</td>
              </tr>
            ) : (
              complaints.map((comp) => (
                <tr key={comp.id} className="border-t">
                  <td className="px-4 py-2">{comp.villaNo}</td>
                  <td className="px-4 py-2">{comp.description}</td>
                  <td className="px-4 py-2">{comp.status}</td>
                  <td className="px-4 py-2">
                    {new Date(comp.created_at).toLocaleString()}
                  </td>
                  {isWritable && (
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(comp)}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(comp.id)}
                        className="text-red-500 hover:underline"
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

export default Complaints;
