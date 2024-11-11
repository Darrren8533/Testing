//Register
export const signupUser = async (userData) => {
  try {
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    return response;
  } catch (error) {
    console.error('API error:', error);
    throw error; 
  }
};

// Login
export const loginUser = async (userData) => {
  try {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    return response;
  } catch (error) {
    console.error('API error:', error);
    throw error; 
  }
};

// Logout
export const logoutUser = async (username) => {
  try {
    const response = await fetch('http://localhost:5000/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    const responseData = await response.json();
    return responseData;
  }catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

// Properties Listing
export const propertiesListing = async (propertyData) => {
  try {
    const response = await fetch('http://localhost:5000/propertiesListing', {
      method: 'POST',
      body: propertyData,
    });

    if(!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create property');
    }

    const responseData = await response.json();
    return responseData;
  }catch (error) {
    console.error('API error: ', error);
    throw error;
  }
};

// Properties Listing
export const moderatorpropertiesListing = async (propertyData) => {
  try {
    const response = await fetch('http://localhost:5000/moderatorpropertiesListing', {
      method: 'POST',
      body: propertyData,
    });
    console.log("Response status:", response.status);

    if(!response.ok) {
      const errorData = await response.json();
      console.error("API response error:", errorData);
      throw new Error(errorData.error || 'Failed to create property');
    }

    const responseData = await response.json();
    console.log("API response data:", responseData);
    return responseData;
  } catch (error) {
    console.error('API error: ', error);
    throw error;
  }
};


// Properties Fetching
export const fetchProperties = async () => {
  try {
    const response = await fetch('http://localhost:5000/product');

    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error; 
  }
};

// Fetch Properties in dashboard
export const fetchPropertiesListing = async () => {
  try {
    const response = await fetch('http://localhost:5000/propertiesListing');
    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }
    const data = await response.json();
    return data;
  } catch (error) {
  console.error('Error fetching properties', error);
  throw error;
  }
  };


// Fetch Properties in dashboard
export const moderatorfetchPropertiesListing = async () => {
  const username = localStorage.getItem('username');
  try {
    const response = await fetch(`http://localhost:5000/moderatorpropertiesListing?username=${username}`);

    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error fetching properties', error);
    throw error;
  }
};


// Fetch Customers
export const fetchCustomers = async () => {
  try {
    const response = await fetch('http://localhost:5000/users/customers');

    if (!response.ok) {
      throw new Error('Failed to fetch customers');
    }

    return await response.json();
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

//Fetch Operators
export const fetchOperators = async () => {
  try {
    const response = await fetch('http://localhost:5000/users/operators');

    if (!response.ok) {
      throw new Error('Failed to fetch operators');
    }

    return await response.json();
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

//Fetch Operators
export const fetchOwners = async () => {
  try {
    const response = await fetch('http://localhost:5000/users/owners');

    if (!response.ok) {
      throw new Error('Failed to fetch owners');
    }

    return await response.json();
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

//Nodemailer
export const sendContactEmail = async (emailData) => {
  try {
    const response = await fetch('http://localhost:5000/contact_us', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    return response.json();
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

// Store Reservation Data
export const createReservation = async (reservationData) => {
  try {
    const response = await fetch('http://localhost:5000/reservation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create reservation');
    }

    return await response.json();
  }catch (error) {
    console.error('API error:', error);
    throw error;
  }
};