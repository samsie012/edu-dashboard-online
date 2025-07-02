
import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import StudentDashboard from '../components/StudentDashboard';
import TeacherDashboard from '../components/TeacherDashboard';
import AdminDashboard from '../components/AdminDashboard';

const Index = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setUserRole(userData.role);
  };

  const handleLogout = () => {
    setUser(null);
    setUserRole(null);
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div>
      {userRole === 'student' && <StudentDashboard user={user} onLogout={handleLogout} />}
      {userRole === 'teacher' && <TeacherDashboard user={user} onLogout={handleLogout} />}
      {userRole === 'admin' && <AdminDashboard user={user} onLogout={handleLogout} />}
    </div>
  );
};

export default Index;
