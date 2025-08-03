import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { isBoardMember } from '../utils/auth';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

const COLORS = ['#00C49F', '#FF8042'];

const AssociationAccount = () => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [newExpense, setNewExpense] = useState({ title: '', amount: '' });
  const boardAccess = isBoardMember();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: paymentData } = await supabase.from('payments').select('*');
    setPayments(paymentData || []);
    const totalIncome = paymentData?.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0) || 0;
    setIncome(totalIncome);

    const { data: expensesData } = await supabase.from('expenses').select('*');
    setExpenses(expensesData || []);
  };

  const handleAddExpense = async () => {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error('Error fetching user:', userError);
      return;
    }

    const { error } = await supabase.from('expenses').insert([
      {
        title: newExpense.title,
        amount: newExpense.amount,
        date: now.toISOString().split('T')[0],
        month,
        added_by: user.email,
      },
    ]);

    if (!error) {
      setNewExpense({ title: '', amount: '' });
      fetchData();
    }
  };

  const handleDeleteExpense = async (id) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (!error) {
      fetchData();
    }
  };

  const totalExpense = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const balance = income - totalExpense;

  const monthlyData = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const monthStr = month.toString().padStart(2, '0');
    const monthName = new Date(2025, index).toLocaleString('default', { month: 'short' });

    const incomeMonth = payments
      .filter((p) => {
        const paymentMonth = p.month?.split('-')[1];
        return paymentMonth === monthStr;
      })
      .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

    const expenseMonth = expenses
      .filter((e) => {
        const expenseMonth = e.month?.split('-')[1];
        return expenseMonth === monthStr;
      })
      .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

    return {
      month: monthName,
      income: incomeMonth,
      expense: expenseMonth,
    };
  });

  const pieData = [
    { name: 'Income', value: income },
    { name: 'Expenses', value: totalExpense },
  ];

  const groupedExpenses = expenses.reduce((acc, expense) => {
    const monthKey = expense.month;
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(expense);
    return acc;
  }, {});

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">Association Account Summary</h2>
      <div className="mb-6">
        <p><strong>Total Income:</strong> ₹{income}</p>
        <p><strong>Total Expenses:</strong> ₹{totalExpense}</p>
        <p><strong>Current Balance:</strong> ₹{balance}</p>
      </div>

      {boardAccess && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Add Expense</h3>
          <div className="flex gap-2 mb-2">
            <input
              className="border p-2 flex-1"
              placeholder="Expense Title"
              value={newExpense.title}
              onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
            />
            <input
              className="border p-2 w-32"
              placeholder="Amount"
              type="number"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            />
            <button className="bg-purple-600 text-white px-4 py-2 rounded" onClick={handleAddExpense}>Add</button>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">All Expenses</h3>
        <ul className="bg-white p-4 rounded shadow">
          {Object.keys(groupedExpenses).sort().reverse().map((monthKey) => {
            const monthName = format(new Date(monthKey + '-01'), 'MMMM yyyy');
            return (
              <div key={monthKey} className="mb-4">
                <h4 className="text-lg font-semibold text-purple-700">{monthName}</h4>
                <ul>
                  {groupedExpenses[monthKey].map((e) => (
                    <li key={e.id} className="mb-1 flex justify-between items-center">
                      <div>
                        {e.date}: ₹{e.amount} - {e.title} <span className="text-sm text-gray-500">({e.added_by})</span>
                      </div>
                      {boardAccess && (
                        <button onClick={() => handleDeleteExpense(e.id)} className="text-red-600 text-sm ml-4">Delete</button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </ul>
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-2">Monthly Income & Expenses</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#00C49F" />
            <Bar dataKey="expense" fill="#FF8042" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Income vs Expense Overview</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AssociationAccount;