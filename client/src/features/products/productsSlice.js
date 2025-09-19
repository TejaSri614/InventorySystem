// src/features/products/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://inventorysystem-backend-8844.onrender.com/api'; // your backend base URL

// 1️⃣ Fetch all products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/products`, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });
      return res.data; // array of products
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to load products'
      );
    }
  }
);

// 2️⃣ Request restock for a low-stock product
export const requestRestock = createAsyncThunk(
  'products/requestRestock',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_URL}/products/${productId}/restock`,
        { quantity },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return res.data; // updated product
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to request restock'
      );
    }
  }
);

// 3️⃣ Add a new product
export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (newProductData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_URL}/products`,
        newProductData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return res.data; // backend should return created product
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to add product'
      );
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Request restock
      .addCase(requestRestock.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        const index = state.items.findIndex((p) => p._id === updatedProduct._id);
        if (index !== -1) {
          state.items[index] = updatedProduct;
        }
      })
      .addCase(requestRestock.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Add product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload); // append new product
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;
