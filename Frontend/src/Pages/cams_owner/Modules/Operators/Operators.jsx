import React, { useState, useEffect, useRef } from 'react';
import { fetchOperators } from '../../../../../../Backend/Api/api';
import Filter from '../../../../Component/Filter/Filter';
import ActionDropdown from '../../../../Component/ActionDropdown/ActionDropdown';
import Modal from '../../../../Component/Modal/Modal';
import SearchBar from '../../../../Component/SearchBar/SearchBar';
import { FaSearch, FaEllipsisH, FaEye, FaBan } from 'react-icons/fa';
import '../../../../Component/MainContent/MainContent.css';
import '../../../../Component/ActionDropdown/ActionDropdown.css';
import '../../../../Component/Modal/Modal.css';
import '../../../../Component/Filter/Filter.css';
import '../../../../Component/Table/Table.css';
import '../../../../Component/SearchBar/SearchBar.css';
import '../Operators/Operators.css';

const Operators = () => {
  const [users, setUsers] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [appliedFilters, setAppliedFilters] = useState({ role: 'All' });
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const operatorData = await fetchOperators();
        setUsers(operatorData);
      } catch (error) {
        console.error('Failed to fetch operator details', error);
      }
    };
    fetchUsers();
  }, []);

  const handleApplyFilters = () => {
    setAppliedFilters({ role: selectedRole });
  };

  const filters = [
    {
      name: 'role',
      label: 'Role',
      value: selectedRole,
      onChange: setSelectedRole,
      options: [
        { value: 'All', label: 'All Roles' },
        { value: 'Administrator', label: 'Administrator' },
        { value: 'Moderator', label: 'Moderator' },
      ],
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      (appliedFilters.role === 'All' || user.userGroup === appliedFilters.role) &&
      (user.uFirstName?.toLowerCase().includes(searchKey.toLowerCase()) ||
        user.uLastName?.toLowerCase().includes(searchKey.toLowerCase()) ||
        user.uEmail.toLowerCase().includes(searchKey.toLowerCase()) ||
        user.uPhoneNo?.toLowerCase().includes(searchKey.toLowerCase()))
  );

  const handleAction = (action, user) => {
    if (action === 'view') {
      setSelectedOperator(user);
    } else if (action === 'suspend') {
      alert(`Suspending operator: ${user.uFirstName} ${user.uLastName}`);
    }
    setOpenDropdown(null);
  };

  const toggleDropdown = (index, event) => {
    const buttonPosition = event.currentTarget.getBoundingClientRect();
    setOpenDropdown(openDropdown?.index === index ? null : { index, position: buttonPosition });
  };

  const operatorDropdownItems = [
    { label: 'View Operator', icon: <FaEye />, action: 'view' },
    { label: 'Suspend', icon: <FaBan />, action: 'suspend' },
  ];

  return (
    <div>
      <div className="header-container">
        <h1 className="dashboard-page-title">Operator Details</h1>
        <SearchBar value={searchKey} onChange={setSearchKey} placeholder="Search operator..." />
      </div>

      <Filter filters={filters} onApplyFilters={handleApplyFilters} />

      <div className="styled-table-wrapper">
        <table className="styled-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={index}>
                  <td>{user.uFirstName}</td>
                  <td>{user.uLastName}</td>
                  <td>{user.uEmail}</td>
                  <td>{user.uPhoneNo}</td>
                  <td>
                    <span className={`role-badge ${user.userGroup.toLowerCase()}`}>
                      {user.userGroup}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="actions-button"
                      onClick={(event) => toggleDropdown(index, event)}
                    >
                      <FaEllipsisH />
                    </button>
                    {openDropdown && openDropdown.index === index && (
                      <ActionDropdown
                        position={openDropdown.position}
                        items={operatorDropdownItems}
                        onAction={(action) => handleAction(action, user)}
                      />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>
                  No operators found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedOperator && (
        <Modal
          isOpen={!!selectedOperator}
          title={`${selectedOperator.uFirstName} ${selectedOperator.uLastName}`}
          onClose={() => setSelectedOperator(null)}
        >
          <p><strong>Email:</strong> {selectedOperator.uEmail}</p>
          <p><strong>Phone:</strong> {selectedOperator.uPhoneNo}</p>
          <p><strong>Gender:</strong> {selectedOperator.uGender || 'N/A'}</p>
          <p><strong>Country:</strong> {selectedOperator.uCountry || 'N/A'}</p>
        </Modal>
      )}
    </div>
  );
};

export default Operators;
