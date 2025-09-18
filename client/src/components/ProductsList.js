import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, requestRestock, addProduct } from '../features/products/productsSlice';
import { useLocation } from 'react-router-dom';

const ProductsList = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);
  const location = useLocation();

  // read category from query string
  const params = new URLSearchParams(location.search);
  const categoryFilter = params.get('category');

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    price: '',
    stockAvailable: '',
    minStock: '',
    category: '',
    image: '',
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleRestock = (id) => {
    const qty = prompt('Enter quantity to restock:');
    if (qty && !isNaN(qty)) {
      dispatch(requestRestock({ productId: id, quantity: Number(qty) }));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      addProduct({
        ...formData,
        price: Number(formData.price),
        stockAvailable: Number(formData.stockAvailable),
        minStock: Number(formData.minStock),
      })
    );
    setFormData({
      productId: '',
      name: '',
      price: '',
      stockAvailable: '',
      minStock: '',
      category: '',
      image: '',
    });
    setShowModal(false);
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading products…</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  // filter items by category if provided
  const filteredItems = categoryFilter
    ? items.filter((item) => item.category === categoryFilter)
    : items;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-center">
          {categoryFilter ? `${categoryFilter} Products` : 'Products'}
        </h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Add Product
          </button>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
            >
              <div className="h-40 w-full flex items-center justify-center bg-gray-50 rounded mb-3">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full object-contain rounded"
                  />
                ) : (
                  <span className="text-gray-400">No image</span>
                )}
              </div>
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-500">ID: {product.productId}</p>
              <p className="text-sm">Category: {product.category}</p>
              <p className="text-sm">Price: ₹{product.price}</p>
              <p className="text-sm">
                Stock:{' '}
                <span
                  className={
                    product.stockAvailable < product.minStock
                      ? 'text-red-500 font-semibold'
                      : 'text-green-600 font-semibold'
                  }
                >
                  {product.stockAvailable}
                </span>{' '}
                (Min: {product.minStock})
              </p>

              <div className="mt-auto pt-3">
                {product.stockAvailable < product.minStock ? (
                  <button
                    onClick={() => handleRestock(product._id)}
                    className="w-50 bg-red-500 hover:bg-green-600 text-white px-3 py-2 rounded"
                  >
                    Request Restock
                  </button>
                ) : (
                  <span className="block text-green-600 font-semibold text-center">
                    In Stock
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Product Button */}
        
      </div>

      {/* Modal for Add Product */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
          type="text"
          name="productId"
          placeholder="Product ID"
          value={formData.productId}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="number"
          name="stockAvailable"
          placeholder="Stock Available"
          value={formData.stockAvailable}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="number"
          name="minStock"
          placeholder="Minimum Stock"
          value={formData.minStock}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />

        <div className="flex justify-end gap-2 pt-3">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Product
          </button>
        </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
