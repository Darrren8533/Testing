import React, { useState, useEffect } from 'react';
import { fetchCustomers } from '../../../../../../Backend/Api/api';
import ActionDropdown from '../../../../Component/ActionDropdown/ActionDropdown';
import { FaEllipsisH, FaEye, FaShoppingCart, FaBan } from 'react-icons/fa';
import Modal from '../../../../Component/Modal/Modal';
import SearchBar from '../../../../Component/SearchBar/SearchBar';
import '../../../../Component/MainContent/MainContent.css';
import '../../../../Component/ActionDropdown/ActionDropdown.css';
import '../../../../Component/Modal/Modal.css';
import '../../../../Component/Table/Table.css';

const Customers = () => {
  const [users, setUsers] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const customerData = await fetchCustomers();
        setUsers(customerData);
      } catch (error) {
        console.error('Failed to fetch customer details', error);
      }
    };
    fetchUsers();
  }, []);

  const handleAction = (action, user) => {
    if (action === 'view') {
      setSelectedCustomer(user);
    } else if (action === 'view_booking') {
      alert(`Viewing booking for: ${user.uFirstName} ${user.uLastName}`);
    } else if (action === 'suspend') {
      alert(`Suspending customer: ${user.uFirstName} ${user.uLastName}`);
    }
    setOpenDropdown(null);
  };

  const toggleDropdown = (index, event) => {
    const buttonPosition = event.currentTarget.getBoundingClientRect();
    setOpenDropdown(openDropdown?.index === index ? null : { index, position: buttonPosition });
  };

  const customerDropdownItems = [
    { label: 'View Customer', icon: <FaEye />, action: 'view' },
    { label: 'View Booking', icon: <FaShoppingCart />, action: 'view_booking' },
    { label: 'Suspend', icon: <FaBan />, action: 'suspend' },
  ];

  // Filter users based on searchKey
  const filteredUsers = users.filter((user) =>
    `${user.uFirstName} ${user.uLastName} ${user.uEmail} ${user.uPhoneNo}`
      .toLowerCase()
      .includes(searchKey.toLowerCase())
  );

  return (
    <div>
      <div className="header-container">
        <h1 className="dashboard-page-title">Customer Details</h1>
        <SearchBar value={searchKey} onChange={setSearchKey} placeholder="Search customers..." />
      </div>

      <div className="styled-table-wrapper">
        <table className="styled-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
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
                        items={customerDropdownItems}
                        onAction={(action) => handleAction(action, user)}
                      />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!selectedCustomer}
        title={`${selectedCustomer?.uFirstName} ${selectedCustomer?.uLastName}`}
        onClose={() => setSelectedCustomer(null)}
      >
        <p><strong>Email:</strong> {selectedCustomer?.uEmail}</p>
        <p><strong>Phone:</strong> {selectedCustomer?.uPhoneNo}</p>
        <p><strong>Gender:</strong> {selectedCustomer?.uGender}</p>
        <p><strong>Country:</strong> {selectedCustomer?.uCountry}</p>
      </Modal>
    </div>
  );
};

export default Customers;
