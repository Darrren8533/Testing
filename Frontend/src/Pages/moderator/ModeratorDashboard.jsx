import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from '../../Component/Sidebar/Sidebar';
import Dashboard from './Modules/Dashboard/Dashboard';
import PropertyListing from './Modules/Property Listing/PropertyListing';
import NoAccess from '../../Component/NoAccess/NoAccess';
import { FiHome } from 'react-icons/fi';
import '../../Component/MainContent/MainContent.css';

const ModeratorDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userGroup, setUserGroup] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    const userGroupStatus = localStorage.getItem('userGroup');

    setIsLoggedIn(loggedInStatus === 'true');
    setUserGroup(userGroupStatus);

    // Redirect to NoAccess page if not logged in or userGroup is not 'Moderator'
    if (loggedInStatus !== 'true' || userGroupStatus !== 'Moderator') {
      navigate('/no-access');
    }
  }, [navigate]);

  // Display a loading state until authentication is confirmed
  if (!isLoggedIn || userGroup !== 'Moderator') {
    return <div>Loading...</div>;
  }

  const links = [
    { path: '/login/moderator_dashboard/dashboard', label: 'Dashboard', icon: <FiHome /> },
    { path: '/login/moderator_dashboard/property-listing', label: 'Property Listing', icon: <FiHome /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className={`dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        title="Moderator"
        links={links}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        handleLogout={handleLogout}
      />
      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="property-listing" element={<PropertyListing />} />
          {/* Catch-all for undefined routes */}
          <Route path="*" element={<NoAccess />} />
        </Routes>
      </div>
    </div>
  );
};

export default ModeratorDashboard;
