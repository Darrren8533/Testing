import React, { useState, useEffect } from 'react';
import { moderatorfetchPropertiesListing } from '../../../../../../Backend/Api/api';
import ActionDropdown from '../../../../Component/ActionDropdown/ActionDropdown';
import Modal from '../../../../Component/Modal/Modal';
import PropertyForm from '../../../../Component/ModeratorPropertyForm/ModeratorPropertyForm';
import SearchBar from '../../../../Component/SearchBar/SearchBar';
import Filter from '../../../../Component/Filter/Filter';
import { FaEllipsisH, FaEye, FaArrowLeft, FaArrowRight, FaEdit, FaBan } from 'react-icons/fa';
import '../../../../Component/MainContent/MainContent.css';
import '../../../../Component/ActionDropdown/ActionDropdown.css';
import '../../../../Component/Modal/Modal.css';
import '../../../../Component/SearchBar/SearchBar.css';
import '../Property Listing/PropertyListing.css';

const PropertyListing = () => {
    const [properties, setProperties] = useState([]);
    const [searchKey, setSearchKey] = useState('');
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedName, setSelectedName] = useState('All');
    const [appliedFilters, setAppliedFilters] = useState({ status: 'All', name: 'All' });
    const [isPropertyFormOpen, setIsPropertyFormOpen] = useState(false);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const propertyData = await moderatorfetchPropertiesListing();
                setProperties(propertyData.properties);
            } catch (error) {
                console.error('Failed to fetch property details', error);
            }
        };
        fetchProperties();
    }, []);

    const handleApplyFilters = () => setAppliedFilters({ status: selectedStatus, name: selectedName });

    const filters = [
        {
            name: 'status',
            label: 'Status',
            value: selectedStatus,
            onChange: setSelectedStatus,
            options: [
                { value: 'All', label: 'All Statuses' },
                { value: 'Available', label: 'Available' },
                { value: 'Unavailable', label: 'Unavailable' },
                { value: 'Pending', label: 'Pending Review' },
            ],
        },
    ];

    const handleAction = (action, property) => {
        if (action === 'view') {
            setSelectedProperty(property);
            setCurrentImageIndex(0);
        }
        setOpenDropdown(null);
    };

    const toggleDropdown = (index, event) => {
        const buttonPosition = event.currentTarget.getBoundingClientRect();
        setOpenDropdown(openDropdown?.index === index ? null : { index, position: buttonPosition });
    };

    const propertyDropdownItems = [
        { label: 'View Details', icon: <FaEye />, action: 'view' }
    ];

    const filteredProperties = properties.filter(
        (property) =>
            (appliedFilters.status === 'All' || property.propertyStatus === appliedFilters.status) &&
            (appliedFilters.name === 'All' || property.propertyName === appliedFilters.name) &&
            (property.propertyName.toLowerCase().includes(searchKey.toLowerCase()) ||
                property.propertyLocation.toLowerCase().includes(searchKey.toLowerCase()))
    );

    const nextImage = () => {
        if (selectedProperty) {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedProperty.propertyImage.length);
        }
    };

    const prevImage = () => {
        if (selectedProperty) {
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + selectedProperty.propertyImage.length) % selectedProperty.propertyImage.length);
        }
    };

    return (
        <div>
            <div className="header-container">
                <h1 className="dashboard-page-title">Property Listing</h1>
                <SearchBar value={searchKey} onChange={setSearchKey} placeholder="Search properties..." />
            </div>

            <Filter filters={filters} onApplyFilters={handleApplyFilters} />

            <button className="request-property-button" onClick={() => setIsPropertyFormOpen(true)}>
                Request New Property
            </button>

            <div className="styled-table-wrapper">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Location</th>
                            <th>Owner</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProperties.length > 0 ? (
                            filteredProperties.map((property, index) => (
                                <tr key={property.propertyID}>
                                    <td>{property.propertyID}</td>
                                    <td>
                                        {property.propertyImage && property.propertyImage.length > 0 ? (
                                            <img src={`data:image/jpeg;base64,${property.propertyImage[0]}`} alt={property.propertyName} style={{ width: 80, height: 80 }} />
                                        ) : (
                                            <span>No Image</span>
                                        )}
                                    </td>
                                    <td>{property.propertyName}</td>
                                    <td>${property.propertyPrice}</td>
                                    <td>{property.propertyLocation}</td>
                                    <td>{`${property.uFirstName} ${property.uLastName}`}</td>
                                    <td>{property.propertyStatus}</td>
                                    <td className="actions-cell">
                                        <button className="actions-button" onClick={(event) => toggleDropdown(index, event)}><FaEllipsisH /></button>
                                        {openDropdown && openDropdown.index === index && (
                                            <ActionDropdown position={openDropdown.position} items={propertyDropdownItems} onAction={(action) => handleAction(action, property)} />
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8}>No properties found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedProperty && (
                <Modal isOpen={!!selectedProperty} title={selectedProperty?.propertyName} onClose={() => setSelectedProperty(null)}>
                    <div className="property-modal-content">
                        {selectedProperty.propertyImage && selectedProperty.propertyImage.length > 0 ? (
                            <div className="property-slideshow">
                                <button className="property-slideshow-button left" onClick={prevImage}><FaArrowLeft /></button>
                                <img src={`data:image/jpeg;base64,${selectedProperty.propertyImage[currentImageIndex]}`} alt={`${selectedProperty.propertyName} - Image ${currentImageIndex + 1}`} className="property-slideshow-image" />
                                <button className="property-slideshow-button right" onClick={nextImage}><FaArrowRight /></button>
                            </div>
                        ) : (
                            <p>No images available</p>
                        )}
                        <p><strong>Owner:</strong> {selectedProperty.uFirstName} {selectedProperty.uLastName}</p>
                        <p><strong>Price:</strong> ${selectedProperty.propertyPrice}</p>
                        <p><strong>Location:</strong> {selectedProperty.propertyLocation}</p>
                        <p><strong>Guest Capacity:</strong> {selectedProperty.propertyGuestPaxNo}</p>
                        <p><strong>Status:</strong> {selectedProperty.propertyStatus}</p>
                        <p><strong>Room Type:</strong> {selectedProperty.propertyBedType}</p>
                        <p><strong>Description:</strong> {selectedProperty.propertyDescription}</p>
                    </div>
                </Modal>
            )}

            {isPropertyFormOpen && (
                <div className="property-form-overlay" onClick={() => setIsPropertyFormOpen(false)}>
                    <div className="property-form-content" onClick={(e) => e.stopPropagation()}>
                        <button className="property-form-close-button" onClick={() => setIsPropertyFormOpen(false)}>✕</button>
                        <PropertyForm onClose={() => setIsPropertyFormOpen(false)} isModerator={true} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyListing;