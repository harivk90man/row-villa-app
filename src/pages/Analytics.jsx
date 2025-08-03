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
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [paidVillas, setPaidVillas] = useState([]);
  const [unpaidVillas, setUnpaidVillas] = useState([]);

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
      .filter(p => String(p.villa_id) === String(villaId))
      .map(p => p.month);

    const missed = allMonths.filter(m => !paidMonths.includes(m));
    const formatted = missed
      .map(m => ({ month: m, missed: 1 }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));

    setMissedMonths(formatted);
  };

  const handlePieClick = (month) => {
    setSelectedMonth(month);

    const paid = payments.filter(p => p.month === month).map(p => p.villa_id);

    const paidVillaList = villas.filter(v => paid.includes(v.id));
    const unpaidVillaList = villas.filter(v => !paid.includes(v.id));

    setPaidVillas(paidVillaList);
    setUnpaidVillas(unpaidVillaList);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-xl sm:text-2xl font-bold text-purple-700 mb-4">
        Payments by Month - 2025
      </h2>

      {payments.length > 0 && villas.length > 0 && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <PaymentsByMonthChart
            payments={payments}
            villas={villas}
            onMonthClick={handlePieClick}
          />
        </div>
      )}

      {selectedMonth && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="text-lg font-semibold mb-2 text-purple-700">
            Detailed View for {selectedMonth}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-600 mb-2">✅ Villas Paid:</h4>
              <ul className="list-disc pl-6">
                {paidVillas.map((v) => (
                  <li key={v.id}>Villa {v.villaNo}</li>
                ))}
                {paidVillas.length === 0 && <li>None</li>}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-red-600 mb-2">❌ Villas Unpaid:</h4>
              <ul className="list-disc pl-6">
                {unpaidVillas.map((v) => (
                  <li key={v.id}>Villa {v.villaNo}</li>
                ))}
                {unpaidVillas.length === 0 && <li>None</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl sm:text-2xl font-bold text-purple-700 mb-4">Missed Payments by Villa</h2>

        <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2">
          <label htmlFor="villaSelect" className="font-medium text-gray-700">Select a Villa:</label>
          <select
            id="villaSelect"
            value={selectedVillaId}
            onChange={handleVillaChange}
            className="border p-2 rounded w-full sm:w-auto"
          >
            <option value="">-- Select --</option>
            {villas.map((v) => (
              <option key={v.id} value={v.id}>
                {v.villaNo}
              </option>
            ))}
          </select>
        </div>

        {selectedVillaId && missedMonths.length > 0 && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={missedMonths}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="missed" fill="#ff4d4f" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Analytics;
