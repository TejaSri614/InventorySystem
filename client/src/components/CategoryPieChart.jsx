import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#33AA99'];

const CategoryPieChart = ({ data, title }) => {
  return (
    <div className="bg-white rounded shadow p-4 ">
      <h3 className="text-2xl font-semibold mb-2 text-center">{title}</h3>
      <PieChart width={350} height={300} className='mx-auto'>
        <Pie
          data={data}
          cx="50%"
          outerRadius={100}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default CategoryPieChart;
