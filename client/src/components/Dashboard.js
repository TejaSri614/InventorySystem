import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SummaryCards from './SummaryCards';
import { fetchProducts } from '../features/products/productsSlice';
import CategoryPieChart from './CategoryPieChart';
import LowStockTable from './LowStockTable';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // counts by category
  const categoryCounts = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});
  const categoryData = Object.entries(categoryCounts).map(([category, count]) => ({
    name: category,
    value: count,
  }));

  const totalProducts = items.length;
  const lowStockItems = items.filter((p) => p.stockAvailable < p.minStock);
  const lowStockCount = lowStockItems.length;

  // number of unique categories
  const categoryCount = new Set(items.map(item => item.category)).size;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">
          Welcome to Inventory Dashboard
        </h2>

        {/* summary cards */}
        <SummaryCards
          totalProducts={totalProducts}
          lowStockCount={lowStockCount}
          categoryCount={categoryCount}
        />

        {loading && <p className="mt-4">Loading products…</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}

        {/* charts and low stock table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow p-4">
            <CategoryPieChart data={categoryData} title="Items by Category" />
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-xl font-semibold mb-4 text-center underline">
              Low Stock Items
            </h3>
            <LowStockTable items={lowStockItems} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
