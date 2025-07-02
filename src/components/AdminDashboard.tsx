
import React, { useState } from 'react';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Simulated admin data
  const systemStats = {
    totalStudents: 150,
    totalTeachers: 12,
    totalCourses: 25,
    totalAssignments: 85
  };

  const recentUsers = [
    { id: 1, name: 'John Student', role: 'student', email: 'john@email.com', joinDate: '2024-07-01' },
    { id: 2, name: 'Mary Teacher', role: 'teacher', email: 'mary@email.com', joinDate: '2024-06-28' },
    { id: 3, name: 'Bob Student', role: 'student', email: 'bob@email.com', joinDate: '2024-06-25' }
  ];

  const allCourses = [
    { id: 1, name: 'Mathematics 101', teacher: 'Prof. Smith', students: 25, status: 'active' },
    { id: 2, name: 'Physics 101', teacher: 'Dr. Johnson', students: 20, status: 'active' },
    { id: 3, name: 'Chemistry 101', teacher: 'Prof. Davis', students: 30, status: 'active' },
    { id: 4, name: 'Biology 101', teacher: 'Dr. Wilson', students: 0, status: 'inactive' }
  ];

  const allUsers = [
    { id: 1, name: 'John Student', role: 'student', email: 'john@email.com', status: 'active' },
    { id: 2, name: 'Jane Student', role: 'student', email: 'jane@email.com', status: 'active' },
    { id: 3, name: 'Prof. Smith', role: 'teacher', email: 'smith@email.com', status: 'active' },
    { id: 4, name: 'Dr. Johnson', role: 'teacher', email: 'johnson@email.com', status: 'active' },
    { id: 5, name: 'Bob Student', role: 'student', email: 'bob@email.com', status: 'inactive' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}!</p>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'users', 'courses', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold">S</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                          <dd className="text-lg font-medium text-gray-900">{systemStats.totalStudents}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold">T</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Teachers</dt>
                          <dd className="text-lg font-medium text-gray-900">{systemStats.totalTeachers}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold">C</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Courses</dt>
                          <dd className="text-lg font-medium text-gray-900">{systemStats.totalCourses}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold">A</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Assignments</dt>
                          <dd className="text-lg font-medium text-gray-900">{systemStats.totalAssignments}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Recent User Registrations</h3>
                </div>
                <ul className="divide-y divide-gray-200">
                  {recentUsers.map(user => (
                    <li key={user.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{user.name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-sm text-gray-500">Joined: {user.joinDate}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'teacher' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">User Management</h3>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                  Add New User
                </button>
              </div>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {allUsers.map(user => (
                    <li key={user.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{user.name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'teacher' 
                              ? 'bg-green-100 text-green-800' 
                              : user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                          <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Course Management</h3>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                  Create New Course
                </button>
              </div>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {allCourses.map(course => (
                    <li key={course.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{course.name}</h4>
                          <p className="text-sm text-gray-600">Teacher: {course.teacher}</p>
                          <p className="text-sm text-gray-600">Students: {course.students}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            course.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {course.status}
                          </span>
                          <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-6">System Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-6">
                    <h4 className="text-lg font-medium text-gray-900">General Settings</h4>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">System Name</label>
                        <input
                          type="text"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                          defaultValue="Learning Management System"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Max Students per Course</label>
                        <input
                          type="number"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                          defaultValue="50"
                        />
                      </div>
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                        Save Settings
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-6">
                    <h4 className="text-lg font-medium text-gray-900">System Maintenance</h4>
                    <div className="mt-4 space-y-4">
                      <button className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                        Backup Database
                      </button>
                      <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Export User Data
                      </button>
                      <button className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                        System Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
