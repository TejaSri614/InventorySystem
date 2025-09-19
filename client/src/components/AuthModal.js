import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);
  // Redirect to home page after successful login
  useEffect(() => {
    if (user && !loading && !error) {
      navigate('/');
      if (onClose) onClose();
    }
  }, [user, loading, error, navigate, onClose]);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(loginUser(formData));
      setFormData({ email: '', password: '' });
    } else {
      // register new user
      try { // your backend base URL
        await axios.post('https://inventorysystem-backend-8844.onrender.com/api/auth/register', formData);
        alert('Registered successfully! You can now log in.');
        setFormData({ email: '', password: '' });
        setIsLogin(true);
      } catch (err) {
        alert(err.response?.data?.message || 'Register failed');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-black text-center">{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-black"
            required 
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-black"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
          >
            {loading ? 'Please wait…' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-blue-600 text-md text-center">
          {isLogin ? 'No account?' : 'Already registered?'}{' '}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 cursor-pointer"
          >
            {isLogin ? 'Register here' : 'Login here'}
          </span>
        </p>

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 underline text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
