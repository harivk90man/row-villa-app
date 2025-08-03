import { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
  '#8e44ad', '#e67e22', '#2ecc71', '#e74c3c',
  '#3498db', '#1abc9c', '#9b59b6', '#f39c12'
];

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const PaymentsByMonthChart = ({ payments, villas }) => {
  const [data, setData] = useState([]);
  const [selectedYear] = useState(new Date().getFullYear());
  const [paidVillas, setPaidVillas] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    const grouped = {};

    const filtered = payments.filter(p =>
      p.month.startsWith(selectedYear.toString())
    );

    filtered.forEach(p => {
      const monthIndex = parseInt(p.month.split('-')[1]) - 1;
      const month = monthNames[monthIndex];
      if (!grouped[month]) grouped[month] = 0;
      grouped[month]++;
    });

    const pieData = Object.entries(grouped).map(([month, count]) => ({
      name: month,
      value: count,
    }));

    setData(pieData);
  }, [payments, selectedYear]);

  const handleMonthClick = (entry) => {
    const clickedMonth = monthNames.indexOf(entry.name) + 1;
    const monthStr = `${selectedYear}-${clickedMonth.toString().padStart(2, '0')}`;

    const filtered = payments.filter(p => p.month === monthStr);

    const villaNumbers = filtered.map(p => {
      const match = villas.find(v => v.id === p.villa_id);
      return match ? match.villaNo : p.villa_id;
    });

    setSelectedMonth(entry.name);
    setPaidVillas(villaNumbers);
  };

  return (
    <div className="bg-white shadow p-6 mt-8 rounded">
      <h2 className="text-xl font-bold text-purple-700 mb-4">
        Payments by Month - {selectedYear}
      </h2>

      <div className="flex flex-col lg:flex-row justify-between gap-8">
        <div className="flex justify-center">
          <PieChart width={400} height={300}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
              onClick={handleMonthClick}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="bg-gray-50 rounded p-4 w-full">
          <h3 className="text-lg font-semibold mb-2">
            {selectedMonth
              ? `Villas paid in ${selectedMonth}`
              : 'Click a month to see details'}
          </h3>
          {selectedMonth && paidVillas.length === 0 && (
            <p className="text-red-600">No villas paid this month.</p>
          )}
          <ul className="list-disc pl-5">
            {paidVillas.map((villa, idx) => (
              <li key={idx}>Villa {villa}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentsByMonthChart;
