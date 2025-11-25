import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>
      
      <div className="user-info">
        <div className="user-card">
          <img src={user.picture} alt="Profile" className="profile-picture" />
          <div className="user-details">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p>User ID: {user.id}</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <h2>Welcome to your dashboard!</h2>
        <p>You have successfully authenticated with Google.</p>
      </div>
    </div>
  );
};

export default Dashboard;
