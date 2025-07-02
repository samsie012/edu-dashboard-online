
import React, { useState } from 'react';

const StudentDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('courses');

  // Simulated student data
  const enrolledCourses = [
    { id: 1, name: 'Mathematics 101', teacher: 'Prof. Smith', progress: 75 },
    { id: 2, name: 'Physics 101', teacher: 'Dr. Johnson', progress: 60 },
    { id: 3, name: 'Chemistry 101', teacher: 'Prof. Davis', progress: 85 }
  ];

  const assignments = [
    { id: 1, title: 'Math Assignment 1', course: 'Mathematics 101', dueDate: '2024-07-10', status: 'pending' },
    { id: 2, title: 'Physics Lab Report', course: 'Physics 101', dueDate: '2024-07-08', status: 'submitted' },
    { id: 3, title: 'Chemistry Quiz', course: 'Chemistry 101', dueDate: '2024-07-12', status: 'pending' }
  ];

  const grades = [
    { id: 1, assignment: 'Math Quiz 1', course: 'Mathematics 101', grade: 'A-', points: '87/100' },
    { id: 2, assignment: 'Physics Exam', course: 'Physics 101', grade: 'B+', points: '82/100' },
    { id: 3, assignment: 'Chemistry Lab', course: 'Chemistry 101', grade: 'A', points: '95/100' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
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
            {['courses', 'assignments', 'grades'].map((tab) => (
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
          {activeTab === 'courses' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map(course => (
                <div key={course.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
                    <p className="text-sm text-gray-600">{course.teacher}</p>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="mt-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <button className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                      View Course
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {assignments.map(assignment => (
                  <li key={assignment.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{assignment.title}</h4>
                        <p className="text-sm text-gray-600">{assignment.course}</p>
                        <p className="text-sm text-gray-500">Due: {assignment.dueDate}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        assignment.status === 'submitted' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {assignment.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'grades' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {grades.map(grade => (
                  <li key={grade.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{grade.assignment}</h4>
                        <p className="text-sm text-gray-600">{grade.course}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-indigo-600">{grade.grade}</span>
                        <p className="text-sm text-gray-500">{grade.points}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
