import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';
import { isBoardMember, logout, getUser } from '../utils/auth';

const Payments = () => {
  const [villaList, setVillaList] = useState([]);
  const [selectedVilla, setSelectedVilla] = useState('');
  const [paymentMonth, setPaymentMonth] = useState('');
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('');
  const [remarks, setRemarks] = useState('');
  const [payments, setPayments] = useState([]);
  const [isWritable, setIsWritable] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    fetchVillas();
    fetchPayments();
    setIsWritable(isBoardMember());

    const user = getUser();
    setUserEmail(user?.email || '');
  }, []);

  const fetchVillas = async () => {
    const { data, error } = await supabase.from('villas').select('*').order('villaNo');
    if (error) console.error('Error fetching villas:', error);
    else setVillaList(data);
  };

  const fetchPayments = async () => {
    const { data, error } = await supabase.from('payments').select('*').order('id', { ascending: false });
    if (error) console.error('Error fetching payments:', error);
    else setPayments(data);
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!selectedVilla || !paymentMonth || !amount || !mode) {
      alert('All fields are required');
      return;
    }

    const newPayment = {
      villa_id: parseInt(selectedVilla),
      month: paymentMonth,
      amount: Number(amount),
      mode,
      remarks,
      recorded_by: userEmail,
      created_at: new Date().toISOString(),
      payment_date: new Date().toISOString(),
    };

    const { error } = await supabase.from('payments').insert([newPayment]);
    if (error) console.error('Error inserting payment:', error);
    else {
      fetchPayments();
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedVilla('');
    setPaymentMonth('');
    setAmount('');
    setMode('');
    setRemarks('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment?')) return;

    const { error } = await supabase.from('payments').delete().eq('id', id);
    if (error) console.error('Delete failed:', error);
    else fetchPayments();
  };

  const getVillaDisplay = (villaId) => {
    const villa = villaList.find((v) => v.id === villaId);
    return villa ? `${villa.villaNo} - ${villa.ownerName}` : 'Villa Not Found';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-4 rounded shadow mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-700">Payments</h1>
        <div className="space-x-4">
          <Link to="/" className="text-blue-600 hover:underline">Dashboard</Link>
          <Link to="/villas" className="text-blue-600 hover:underline">Villas</Link>
          <Link to="/complaints" className="text-blue-600 hover:underline">Complaints</Link>
          <Link to="/announcements" className="text-blue-600 hover:underline">Announcements</Link>
          <button onClick={logout} className="text-red-600 hover:underline font-semibold">Logout</button>
        </div>
      </div>

      {isWritable && (
        <form onSubmit={handleAddPayment} className="bg-white p-4 rounded shadow mb-6 grid grid-cols-5 gap-4">
          <select
            value={selectedVilla}
            onChange={(e) => setSelectedVilla(e.target.value)}
            className="form-select border p-2 rounded col-span-1"
          >
            <option value="">Select Villa</option>
            {villaList.map((villa) => (
              <option key={villa.id} value={villa.id}>
                {villa.villaNo} - {villa.ownerName}
              </option>
            ))}
          </select>

          <input
            type="month"
            value={paymentMonth}
            onChange={(e) => setPaymentMonth(e.target.value)}
            className="border p-2 rounded col-span-1"
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 rounded col-span-1"
          />

          <input
            type="text"
            placeholder="Mode (Cash/UPI/Bank)"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="border p-2 rounded col-span-1"
          />

          <input
            type="text"
            placeholder="Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="border p-2 rounded col-span-1"
          />

          <button type="submit" className="bg-purple-600 text-white rounded p-2 col-span-5">
            Add
          </button>
        </form>
      )}

      <div className="bg-white p-4 rounded shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Villa</th>
              <th className="p-2 border">Month</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Mode</th>
              <th className="p-2 border">Remarks</th>
              <th className="p-2 border">Date</th>
              {isWritable && <th className="p-2 border">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4 italic text-gray-500">No payments found.</td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id}>
                  <td className="p-2 border">{getVillaDisplay(p.villa_id)}</td>
                  <td className="p-2 border">{p.month}</td>
                  <td className="p-2 border">{p.amount}</td>
                  <td className="p-2 border">{p.mode}</td>
                  <td className="p-2 border">{p.remarks}</td>
                  <td className="p-2 border">{new Date(p.created_at).toLocaleDateString()}</td>
                  {isWritable && (
                    <td className="p-2 border">
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(p.id)}
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

export default Payments;
