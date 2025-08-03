import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { isBoardMember } from '../utils/auth';

const Villas = () => {
  const [villas, setVillas] = useState([]);
  const [villaNo, setVillaNo] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [boardMember, setBoardMember] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isWritable, setIsWritable] = useState(false);

  useEffect(() => {
    fetchVillas();
    setIsWritable(isBoardMember());
  }, []);

  const fetchVillas = async () => {
    const { data, error } = await supabase
      .from('villas')
      .select('*')
      .order('id');
    if (error) console.error('Fetch error:', error.message);
    else setVillas(data);
  };

  const resetForm = () => {
    setVillaNo('');
    setOwnerName('');
    setEmail('');
    setPhone('');
    setBoardMember(false);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!villaNo || !ownerName || !email || !phone) {
      alert('All fields are required.');
      return;
    }

    const villaData = {
      villaNo,
      ownerName,
      email,
      phone,
      isBoardMember: boardMember,
    };

    let error;
    if (editId) {
      ({ error } = await supabase
        .from('villas')
        .update(villaData)
        .eq('id', editId));
    } else {
      ({ error } = await supabase.from('villas').insert([villaData]));
    }

    if (error) console.error('Save error:', error.message);

    resetForm();
    fetchVillas();
  };

  const handleEdit = (villa) => {
    setVillaNo(villa.villaNo);
    setOwnerName(villa.ownerName);
    setEmail(villa.email);
    setPhone(villa.phone);
    setBoardMember(villa.isBoardMember);
    setEditId(villa.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this villa?')) return;
    const { error } = await supabase.from('villas').delete().eq('id', id);
    if (error) console.error('Delete failed:', error.message);
    fetchVillas();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <nav className="bg-white shadow-md rounded px-6 py-4 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-700">Villa Owner's Management</h1>
      </nav>

      {!isWritable && (
        <div className="text-center text-gray-600 italic mb-4">
          Read-only access. Only board members can manage villas.
        </div>
      )}

      {isWritable && (
        <div className="bg-white p-6 rounded shadow-md mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Villa No"
              value={villaNo}
              onChange={(e) => setVillaNo(e.target.value)}
              className="border px-3 py-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Owner Name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="border px-3 py-2 rounded"
              required
            />
            <input
              type="email"
              placeholder="Owner Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border px-3 py-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border px-3 py-2 rounded"
              required
            />
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={boardMember}
                onChange={(e) => setBoardMember(e.target.checked)}
                className="mr-2"
              />
              Board Member
            </label>
            <div className="flex gap-4">
              <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded w-full">
                {editId ? 'Update Villa' : 'Add Villa'}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded w-full"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded shadow-md overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">All Villas</h2>
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Villa No</th>
              <th className="px-4 py-2 text-center">Owner</th>
              <th className="px-4 py-2 text-center">Email</th>
              <th className="px-4 py-2 text-center">Phone</th>
              <th className="px-4 py-2 text-center">Board Member</th>
              {isWritable && <th className="px-4 py-2 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {villas.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 italic py-4">
                  No villas found.
                </td>
              </tr>
            ) : (
              villas.map((villa) => (
                <tr key={villa.id} className="border-t">
                  <td className="px-4 py-3 text-left align-middle">{villa.villaNo}</td>
                  <td className="px-4 py-3 text-center align-middle">{villa.ownerName}</td>
                  <td className="px-4 py-3 text-center align-middle">{villa.email}</td>
                  <td className="px-4 py-3 text-center align-middle">{villa.phone}</td>
                  <td className="px-4 py-3 text-center align-middle">
                    {villa.isBoardMember ? 'Yes' : 'No'}
                  </td>
                  {isWritable && (
                    <td className="px-4 py-3 text-center align-middle">
                      <div className="flex justify-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleEdit(villa)}
                          className="text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(villa.id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
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

export default Villas;
