import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';
import { logout } from '../utils/auth';

const Analytics = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    const { data, error } = await supabase
      .from('payments')
      .select('villa_id, month, villas(villaNo)');

    if (error) {
      console.error('Error fetching analytics:', error.message);
      setLoading(false);
      return;
    }

    // Group by month and villa
    const grouped = {};
    data.forEach(({ villa_id, month, villas }) => {
      if (!grouped[month]) grouped[month] = {};
      grouped[month][villas?.villaNo] = true; // paid = true
    });

    // Get all villa numbers from villas table
    const { data: villasData } = await supabase.from('villas').select('villaNo');
    const allVillas = villasData.map(v => v.villaNo).sort((a, b) => a - b);

    // Create final display structure
    const finalSummary = Object.entries(grouped).map(([month, paidMap]) => {
      const monthRow = { month };
      allVillas.forEach(v => {
        monthRow[v] = paidMap[v] ? '✅' : '❌';
      });
      return monthRow;
    });

    setSummary(finalSummary);
    setLoading(false);
  };

  return (
    <div className="p-8">
      <nav className="bg-white shadow-md rounded px-6 py-4 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">Payment Analytics</h1>
        <div className="space-x-4">
          <Link to="/" className="text-blue-500 hover:text-blue-700">Dashboard</Link>
          <Link to="/villas" className="text-blue-500 hover:text-blue-700">Villas</Link>
          <Link to="/payments" className="text-blue-500 hover:text-blue-700">Payments</Link>
          <Link to="/complaints" className="text-blue-500 hover:text-blue-700">Complaints</Link>
        </div>
      </nav>

      {loading ? (
        <div className="text-center text-gray-500">Loading analytics...</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Month</th>
                {summary.length > 0 &&
                  Object.keys(summary[0])
                    .filter(k => k !== 'month')
                    .map(v => (
                      <th key={v} className="px-2 py-2 text-center">Villa {v}</th>
                    ))}
              </tr>
            </thead>
            <tbody>
              {summary.map((row, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2 font-semibold">{row.month}</td>
                  {Object.entries(row)
                    .filter(([k]) => k !== 'month')
                    .map(([villa, status]) => (
                      <td key={villa} className="px-2 py-2 text-center">
                        {status}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Analytics;
