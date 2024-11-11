import React, { useState, useRef } from 'react';
import { moderatorpropertiesListing } from "../../../../Backend/Api/api";
import './ModeratorPropertyForm.css';

const ModeratorPropertyForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        propertyName: "",
        propertyPrice: "",
        propertyDescription: "",
        propertyLocation: "",
        propertyBedType: "",
        propertyGuestPaxNo: "",
        propertyImage: [],
    });

    const [message, setMessage] = useState("");
    const fileInputRef = useRef(null);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData((prev) => ({
            ...prev,
            propertyImage: [...prev.propertyImage, ...files],
        }));
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("username", formData.username);
        data.append("propertyName", formData.propertyName);
        data.append("propertyPrice", formData.propertyPrice);
        data.append("propertyDescription", formData.propertyDescription);
        data.append("propertyLocation", formData.propertyLocation);
        data.append("propertyBedType", formData.propertyBedType);
        data.append("propertyGuestPaxNo", formData.propertyGuestPaxNo);
        data.append("propertyStatus", "Pending");

        // Check if propertyImage is an array and has images
        if (formData.propertyImage.length > 0) {
            formData.propertyImage.forEach((file) => {
                data.append("propertyImage", file);
            });
        } else {
            setMessage("Please upload at least one property image.");
            return;
        }

        try {
            const response = await moderatorpropertiesListing(data);
            
            if (response && response.message) {
                setMessage(response.message);
            }

            setFormData({
                username: "",
                propertyName: "",
                propertyPrice: "",
                propertyDescription: "",
                propertyLocation: "",
                propertyBedType: "",
                propertyGuestPaxNo: "",
                propertyImage: [],
            });

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="property-listing-container">
            <h1>Create a New Property</h1>
            <form onSubmit={handleSubmit} className="property-listing-form">
                <div className="property-listing-form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="property-listing-form-group">
                    <label>Property Name:</label>
                    <input
                        type="text"
                        name="propertyName"
                        value={formData.propertyName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="property-listing-form-group">
                    <label>Property Price:</label>
                    <input
                        type="number"
                        step="0.01"
                        name="propertyPrice"
                        value={formData.propertyPrice}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="property-listing-form-group">
                    <label>Guest Capacity:</label>
                    <input
                        type="text"
                        name="propertyGuestPaxNo"
                        value={formData.propertyGuestPaxNo}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="property-listing-form-group">
                    <label>Bed Type:</label>
                    <input
                        type="text"
                        name="propertyBedType"
                        value={formData.propertyBedType}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="property-listing-form-group">
                    <label>Property Location:</label>
                    <input
                        type="text"
                        name="propertyLocation"
                        value={formData.propertyLocation}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="property-listing-form-group full-width">
                    <label>Property Description:</label>
                    <textarea
                        name="propertyDescription"
                        value={formData.propertyDescription}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="property-listing-form-group full-width">
                    <label>Property Image:</label>
                    <input
                        type="file"
                        name="propertyImage"
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        multiple
                        required
                    />
                </div>
                <button type="submit" className="property-listing-submit-button">Create Property</button>
            </form>
            {message && <p className="property-listing-message">{message}</p>}
        </div>
    );
};

export default ModeratorPropertyForm;