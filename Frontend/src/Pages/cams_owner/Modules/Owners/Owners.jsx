import React, { useState, useEffect } from 'react';
import { fetchOwners } from '../../../../../../Backend/Api/api';
import ActionDropdown from '../../../../Component/ActionDropdown/ActionDropdown';
import { FaEllipsisH, FaEye, FaBan } from 'react-icons/fa';
import Modal from '../../../../Component/Modal/Modal';
import SearchBar from '../../../../Component/SearchBar/SearchBar';
import '../../../../Component/MainContent/MainContent.css';
import '../../../../Component/ActionDropdown/ActionDropdown.css';
import '../../../../Component/Modal/Modal.css';
import '../../../../Component/Table/Table.css';

const Owners = () => {
  const [owners, setOwners] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const fetchOwnersData = async () => {
      try {
        const ownerData = await fetchOwners();
        setOwners(ownerData);
      } catch (error) {
        console.error('Failed to fetch owner details', error);
      }
    };
    fetchOwnersData();
  }, []);

  const handleAction = (action, owner) => {
    if (action === 'view') {
      setSelectedOwner(owner);
    } else if (action === 'suspend') {
      alert(`Suspending owner: ${owner.uFirstName} ${owner.uLastName}`);
    }
    setOpenDropdown(null);
  };

  const toggleDropdown = (index, event) => {
    const buttonPosition = event.currentTarget.getBoundingClientRect();
    setOpenDropdown(openDropdown?.index === index ? null : { index, position: buttonPosition });
  };

  const ownerDropdownItems = [
    { label: 'View Owner', icon: <FaEye />, action: 'view' },
    { label: 'Suspend', icon: <FaBan />, action: 'suspend' },
  ];

  // Filter owners based on searchKey
  const filteredOwners = owners.filter((owner) =>
    `${owner.uFirstName} ${owner.uLastName} ${owner.uEmail} ${owner.uPhoneNo}`
      .toLowerCase()
      .includes(searchKey.toLowerCase())
  );

  return (
    <div>
      <div className="header-container">
        <h1 className="dashboard-page-title">Owner Details</h1>
        <SearchBar value={searchKey} onChange={setSearchKey} placeholder="Search owners..." />
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
            {filteredOwners.length > 0 ? (
              filteredOwners.map((owner, index) => (
                <tr key={index}>
                  <td>{owner.uFirstName}</td>
                  <td>{owner.uLastName}</td>
                  <td>{owner.uEmail}</td>
                  <td>{owner.uPhoneNo}</td>
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
                        items={ownerDropdownItems}
                        onAction={(action) => handleAction(action, owner)}
                      />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No owners found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!selectedOwner}
        title={`${selectedOwner?.uFirstName} ${selectedOwner?.uLastName}`}
        onClose={() => setSelectedOwner(null)}
      >
        <p><strong>Email:</strong> {selectedOwner?.uEmail}</p>
        <p><strong>Phone:</strong> {selectedOwner?.uPhoneNo}</p>
        <p><strong>Gender:</strong> {selectedOwner?.uGender || 'N/A'}</p>
        <p><strong>Country:</strong> {selectedOwner?.uCountry || 'N/A'}</p>
      </Modal>
    </div>
  );
};

export default Owners;
