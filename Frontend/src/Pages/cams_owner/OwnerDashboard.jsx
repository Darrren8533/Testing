import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from '../../Component/Sidebar/Sidebar';
import Dashboard from './Modules/Dashboard/Dashboard';
import Customers from './Modules/Customers/Customers';
import Operators from './Modules/Operators/Operators';
import Owners from './Modules/Owners/Owners';
import Reservations from './Modules/Reservations/Reservations';
import Finances from './Modules/Finances/Finances';
import Analytics from './Modules/Analytics/Analytics';
import CommunicationHub from './Modules/Communication Hub/CommunicationHub';
import AuditTrails from './Modules/Audit Trails/AuditTrails';
import NoAccess from '../../Component/NoAccess/NoAccess';
import { FiHome, FiUsers, FiCalendar, FiCreditCard, FiBarChart, FiMessageSquare, FiFileText } from 'react-icons/fi';
import { FaUserTie } from 'react-icons/fa';
import { RiAdminLine } from 'react-icons/ri';
import '../../Component/MainContent/MainContent.css';

const OwnerDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    const userGroup = localStorage.getItem('userGroup');

    if (loggedInStatus === 'true' && userGroup === 'Owner') {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
      navigate('/no-access');
    }
  }, [navigate]);

  if (!isAuthorized) {
    return <NoAccess />;
  }

  const links = [
    { path: '/login/owner_dashboard/dashboard', label: 'Dashboard', icon: <FiHome /> },
    { path: '/login/owner_dashboard/customers', label: 'Customers', icon: <FiUsers /> },
    { path: '/login/owner_dashboard/operators', label: 'Admin/Moderator', icon: <FaUserTie /> },
    { path: '/login/owner_dashboard/owners', label: 'Owners', icon: <RiAdminLine /> },
    { path: '/login/owner_dashboard/reservations', label: 'Reservations', icon: <FiCalendar /> },
    { path: '/login/owner_dashboard/finances', label: 'Finances', icon: <FiCreditCard /> },
    { path: '/login/owner_dashboard/analytics', label: 'Analytics', icon: <FiBarChart /> },
    { path: '/login/owner_dashboard/communication-hub', label: 'Communication Hub', icon: <FiMessageSquare /> },
    { path: '/login/owner_dashboard/audit-trails', label: 'Audit Trails', icon: <FiFileText /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className={`dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        title="CAMS Owner"
        links={links}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        handleLogout={handleLogout}
      />
      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="operators" element={<Operators />} />
          <Route path="owners" element={<Owners />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="finances" element={<Finances />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="communication-hub" element={<CommunicationHub />} />
          <Route path="audit-trails" element={<AuditTrails />} />
          {/* Catch-all for undefined routes */}
          <Route path="*" element={<NoAccess />} />
        </Routes>
      </div>
    </div>
  );
};

export default OwnerDashboard;
