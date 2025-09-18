import React from 'react';

const SummaryCards = ({ totalProducts, lowStockCount,categoryCount }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white shadow rounded p-4 flex flex-col items-center">
        <span className="text-gray-500">Total Products</span>
        <span className="text-2xl font-bold">{totalProducts}</span>
      </div>
      <div className="bg-white shadow rounded p-4 flex flex-col items-center">
        <span className="text-gray-500">Low Stock Products</span>
        <span className="text-2xl font-bold">{lowStockCount}</span>
      </div>
      <div className="bg-white shadow rounded p-4 flex flex-col items-center">
        <span className="text-gray-500">Total Categories</span>
        <span className="text-2xl font-bold">{categoryCount}</span>
      </div>
    </div>
  );
};

export default SummaryCards;
