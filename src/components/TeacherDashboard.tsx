
import React, { useState } from 'react';

const TeacherDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('courses');

  // Simulated teacher data
  const teachingCourses = [
    { id: 1, name: 'Mathematics 101', students: 25, section: 'A' },
    { id: 2, name: 'Mathematics 102', students: 20, section: 'B' },
    { id: 3, name: 'Statistics 101', students: 30, section: 'A' }
  ];

  const pendingAssignments = [
    { id: 1, student: 'John Doe', assignment: 'Math Assignment 1', course: 'Mathematics 101', submitted: '2024-07-05' },
    { id: 2, student: 'Jane Smith', assignment: 'Math Quiz 2', course: 'Mathematics 102', submitted: '2024-07-06' },
    { id: 3, student: 'Bob Johnson', assignment: 'Statistics Project', course: 'Statistics 101', submitted: '2024-07-07' }
  ];

  const recentGrades = [
    { id: 1, student: 'Alice Brown', assignment: 'Math Exam', course: 'Mathematics 101', grade: 'A-' },
    { id: 2, student: 'Charlie Davis', assignment: 'Stats Quiz', course: 'Statistics 101', grade: 'B+' },
    { id: 3, student: 'Emma Wilson', assignment: 'Math Project', course: 'Mathematics 102', grade: 'A' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
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
            {['courses', 'grading', 'students'].map((tab) => (
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
            <div>
              <div className="mb-6">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                  Create New Course
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachingCourses.map(course => (
                  <div key={course.id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
                      <p className="text-sm text-gray-600">Section {course.section}</p>
                      <p className="text-sm text-gray-600">{course.students} Students Enrolled</p>
                      <div className="mt-4 space-y-2">
                        <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                          Manage Course
                        </button>
                        <button className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400">
                          Create Assignment
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'grading' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Assignments to Grade</h3>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {pendingAssignments.map(assignment => (
                    <li key={assignment.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{assignment.assignment}</h4>
                          <p className="text-sm text-gray-600">Student: {assignment.student}</p>
                          <p className="text-sm text-gray-600">Course: {assignment.course}</p>
                          <p className="text-sm text-gray-500">Submitted: {assignment.submitted}</p>
                        </div>
                        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                          Grade Assignment
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-4 mt-8">Recently Graded</h3>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {recentGrades.map(grade => (
                    <li key={grade.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{grade.assignment}</h4>
                          <p className="text-sm text-gray-600">Student: {grade.student}</p>
                          <p className="text-sm text-gray-600">Course: {grade.course}</p>
                        </div>
                        <span className="text-lg font-bold text-indigo-600">{grade.grade}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Student Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachingCourses.map(course => (
                  <div key={course.id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
                      <p className="text-sm text-gray-600">Section {course.section}</p>
                      <p className="text-sm text-gray-600">{course.students} Students</p>
                      <div className="mt-4 space-y-2">
                        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                          View Students
                        </button>
                        <button className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400">
                          Export Grades
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
