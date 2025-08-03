import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import PaymentsByMonthChart from './components/PaymentsByMonthChart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Analytics = () => {
  const [payments, setPayments] = useState([]);
  const [villas, setVillas] = useState([]);
  const [selectedVillaId, setSelectedVillaId] = useState('');
  const [missedMonths, setMissedMonths] = useState([]);

  useEffect(() => {
    fetchPayments();
    fetchVillas();
  }, []);

  const fetchPayments = async () => {
    const { data, error } = await supabase.from('payments').select('*');
    if (!error) setPayments(data);
    else console.error('Error fetching payments:', error);
  };

  const fetchVillas = async () => {
    const { data, error } = await supabase.from('villas').select('*');
    if (!error) setVillas(data);
    else console.error('Error fetching villas:', error);
  };

  const handleVillaChange = (e) => {
    const villaId = e.target.value;
    setSelectedVillaId(villaId);
    calculateMissedMonths(villaId);
  };

  const calculateMissedMonths = (villaId) => {
    const allMonths = [...new Set(payments.map(p => p.month))];

    const paidMonths = payments
      .filter(p => String(p.villa_id) === String(villaId)) // ✅ Fixed type mismatch
      .map(p => p.month);

    const missed = allMonths.filter(m => !paidMonths.includes(m));
    const formatted = missed
      .map(m => ({ month: m, missed: 1 }))
      .sort((a, b) => new Date(a.month) - new Date(b.month)); // 📅 Optional: sort months

    setMissedMonths(formatted);
  };

  const handlePieClick = (month) => {
    const paidVillas = payments
      .filter(p => p.month === month)
      .map(p => {
        const villa = villas.find(v => v.id === p.villa_id);
        return villa ? villa.villaNo : `Villa ${p.villa_id}`;
      });

    alert(`Villas paid in ${month}: ${paidVillas.join(', ')}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: 'purple' }}>Payments by Month - 2025</h2>

      <PaymentsByMonthChart payments={payments} onMonthClick={handlePieClick} />

      <hr />

      <h2 style={{ color: 'purple' }}>Missed Payments by Villa</h2>
      <label>Select a Villa: </label>
      <select value={selectedVillaId} onChange={handleVillaChange}>
        <option value="">-- Select --</option>
        {villas.map((v) => (
          <option key={v.id} value={v.id}>
            {v.villaNo}
          </option>
        ))}
      </select>

      {selectedVillaId && missedMonths.length > 0 && (
        <ResponsiveContainer width="90%" height={300}>
          <BarChart data={missedMonths}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="missed" fill="#ff4d4f" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Analytics;
