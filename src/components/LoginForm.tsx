
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');

  // Simulated user database (in real app, this would be PHP/MySQL)
  const users = [
    { id: 1, email: 'student@lms.com', password: 'student123', role: 'student', name: 'John Student' },
    { id: 2, email: 'teacher@lms.com', password: 'teacher123', role: 'teacher', name: 'Jane Teacher' },
    { id: 3, email: 'admin@lms.com', password: 'admin123', role: 'admin', name: 'Admin User' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const user = users.find(u => 
      u.email === formData.email && 
      u.password === formData.password && 
      u.role === formData.role
    );

    if (user) {
      onLogin(user);
    } else {
      setError('Invalid credentials or role selection');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Learning Management System
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter your password"
              />
            </div>
            <div>
              <Label htmlFor="role">Login As</Label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </button>
          </div>

          <div className="text-sm text-center text-gray-600">
            <p>Demo Credentials:</p>
            <p>Student: student@lms.com / student123</p>
            <p>Teacher: teacher@lms.com / teacher123</p>
            <p>Admin: admin@lms.com / admin123</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
