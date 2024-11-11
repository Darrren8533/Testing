const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const dbConfig = {
  user: 'sa',
  password: 'abc12345',
  server: 'LAPTOP-VV41G823',
  database: 'CAMS',
  options: {
    encrypt: false,  
    enableArithAbort: true,
  },
};

app.post('/register', async (req, res) => {
  const { firstName, lastName, username, password, email } = req.body;

  try {
    // Connect to SQL database
    const pool = await sql.connect(dbConfig);

    // Check if the username or email already exists
    const checkUser = await pool.request()
      .input('username', sql.NVarChar, username)
      .input('email', sql.NVarChar, email)
      .query(`
        SELECT username, uEmail FROM dbo.Users
        WHERE username = @username OR uEmail = @email
      `);

    if (checkUser.recordset.length > 0) {
      return res.status(409).json({ message: 'Username or email already exists', success: false });
    }

    // Insert the new user into the Users table, providing a default value for 'uTitle'
    await pool.request()
      .input('firstName', sql.NVarChar, firstName)
      .input('lastName', sql.NVarChar, lastName)
      .input('username', sql.NVarChar, username)
      .input('password', sql.NVarChar, password)  
      .input('email', sql.NVarChar, email)
      .input('uTitle', sql.NVarChar, 'Mr.')
      .input('userGroup', sql.NVarChar, 'Customer')  
      .input('uStatus', sql.NVarChar, 'registered')
      
      
      .query(`
        INSERT INTO dbo.Users (uFirstName, uLastName, username, password, uEmail, uTitle, userGroup, uStatus)
        VALUES (@firstName, @lastName, @username, @password, @email, @uTitle,  @userGroup, @uStatus)
      `);

    res.status(201).json({ message: 'User registered successfully', success: true });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'Server error', success: false });
  } finally {
    sql.close();
  }
});



// Handles all user types
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {

    const pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .input('password', sql.NVarChar, password)
      .query(`
        SELECT userGroup FROM dbo.Users
        WHERE username = @username
        AND password = @password
      `);

    if (result.recordset.length > 0) {

      const userGroup = result.recordset[0].userGroup;

      await pool.request()
        .input('username', sql.NVarChar, username)
        .query(`
          UPDATE dbo.Users
          SET uStatus = 'login'
          WHERE username = @username
        `);

      res.status(200).json({ message: 'Login Successful', success: true, userGroup });
    } 
    
    else {
      res.status(401).json({ message: 'Invalid username or password', success: false });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error', success: false });
  } 
  
  finally {
    sql.close();
  }
});

// Fetch all customers
app.get('/users/customers', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`
      SELECT uFirstName, uLastName, uEmail, uPhoneNo, uCountry, uZipCode, uGender
      FROM dbo.Users
      WHERE userGroup = 'Customer'
    `);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ message: 'Server error', success: false });
  } finally {
    sql.close();
  }
});

// Fetch all owners
app.get('/users/owners', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`
      SELECT username, uFirstName, uLastName, uEmail, uPhoneNo, uCountry, uZipCode, uGender, userGroup
      FROM dbo.Users
      WHERE userGroup = 'Owner'
    `);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error fetching owners:', err);
    res.status(500).json({ message: 'Server error', success: false });
  } finally {
    sql.close();
  }
});

// Fetch all operators (Moderator and administrator)
app.get('/users/operators', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`
      SELECT username, uFirstName, uLastName, uEmail, uPhoneNo, userGroup, uGender, uCountry, uZipCode
      FROM dbo.Users
      WHERE userGroup IN ('Moderator', 'Administrator')
    `);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error fetching operators:', err);
    res.status(500).json({ message: 'Server error', success: false });
  } finally {
    sql.close();
  }
});

// Properties Listing
app.post('/propertiesListing', upload.array('propertyImage', 10), async (req, res) => { 
  const { username, propertyName, propertyPrice, propertyDescription, propertyLocation, propertyBedType, propertyGuestPaxNo, propertyStatus } = req.body;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'Please upload at least one property image.' });
  }

  try {
    const pool = await sql.connect(dbConfig);

    const userResult = await pool
      .request()
      .input('username', sql.VarChar, username)
      .query('SELECT userID FROM Users WHERE username = @username');

      if (userResult.recordset.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userID = userResult.recordset[0].userID;

      // Convert each image buffer to a base64 string and concatenate with commas
      const base64Images = req.files.map(file => file.buffer.toString('base64'));
      const concatenatedImages = base64Images.join(',');

      await pool
        .request()
        .input('propertyName', sql.VarChar, propertyName)
        .input('propertyPrice', sql.Float, propertyPrice)
        .input('propertyDescription', sql.VarChar, propertyDescription)
        .input('propertyLocation', sql.VarChar, propertyLocation)
        .input('propertyBedType', sql.VarChar, propertyBedType)
        .input('propertyGuestPaxNo', sql.VarChar, propertyGuestPaxNo)
        .input('propertyStatus', sql.VarChar, propertyStatus)
        .input('userID', sql.Int, userID)
        .input('propertyImage', sql.VarChar(sql.MAX), concatenatedImages)
        .query('INSERT INTO Property (propertyName, propertyPrice, propertyDescription, propertyLocation, propertyBedType, propertyGuestPaxNo, propertyStatus, userID, propertyImage) VALUES (@propertyName, @propertyPrice, @propertyDescription, @propertyLocation, @propertyBedType, @propertyGuestPaxNo, @propertyStatus, @userID, @propertyImage)');

    res.status(201).json({ message: 'Property created successfully' });
  }catch(err) {
    console.error('Error inserting property: ', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

app.post('/moderatorpropertiesListing', upload.array('propertyImage', 10), async (req, res) => { 
  const { username, propertyName, propertyPrice, propertyDescription, propertyLocation, propertyBedType, propertyGuestPaxNo, propertyStatus } = req.body;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'Please upload at least one property image.' });
  }

  try {
    const pool = await sql.connect(dbConfig);

    const userResult = await pool
      .request()
      .input('username', sql.VarChar, username)
      .query('SELECT userID FROM Users WHERE username = @username');

      if (userResult.recordset.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userID = userResult.recordset[0].userID;

      // Convert each image buffer to a base64 string and concatenate with commas
      const base64Images = req.files.map(file => file.buffer.toString('base64'));
      const concatenatedImages = base64Images.join(',');

      await pool
        .request()
        .input('propertyName', sql.VarChar, propertyName)
        .input('propertyPrice', sql.Float, propertyPrice)
        .input('propertyDescription', sql.VarChar, propertyDescription)
        .input('propertyLocation', sql.VarChar, propertyLocation)
        .input('propertyBedType', sql.VarChar, propertyBedType)
        .input('propertyGuestPaxNo', sql.VarChar, propertyGuestPaxNo)
        .input('propertyStatus', sql.VarChar, propertyStatus)
        .input('userID', sql.Int, userID)
        .input('propertyImage', sql.VarChar(sql.MAX), concatenatedImages)
        .query('INSERT INTO Property (propertyName, propertyPrice, propertyDescription, propertyLocation, propertyBedType, propertyGuestPaxNo, propertyStatus, userID, propertyImage) VALUES (@propertyName, @propertyPrice, @propertyDescription, @propertyLocation, @propertyBedType, @propertyGuestPaxNo, @propertyStatus, @userID, @propertyImage)');

    res.status(201).json({ message: 'Property created successfully' });
  }catch(err) {
    console.error('Error inserting property: ', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// Fetch properties for dashboard
app.get('/propertiesListing', async (req, res) => {
  try {
    // 在请求内部初始化连接池
    const poolPromise = new sql.ConnectionPool(dbConfig)
      .connect()
      .then(pool => {
        console.log('Connected to database');
        return pool;
      })
      .catch(err => {
        console.error('Database Connection Failed:', err);
        throw new Error('Database Connection Failed');
      });

    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT 
        p.propertyID, 
        p.propertyName, 
        p.propertyPrice, 
        p.propertyDescription, 
        p.propertyLocation, 
        p.propertyBedType, 
        p.propertyGuestPaxNo, 
        p.propertyStatus, 
        p.propertyImage,
        p.userID,
        u.uFirstName, 
        u.uLastName
      FROM Property p
      JOIN Users u ON p.userID = u.userID
    `);


    const properties = result.recordset.map(property => ({
      ...property,
      propertyImage: property.propertyImage ? property.propertyImage.split(',') : []
    }));

    res.status(200).json({ properties });
  } catch (err) {
    console.error('Error fetching properties: ', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  } finally {
    sql.close(); 
  }
});

app.get('/moderatorpropertiesListing', async (req, res) => {
  try {
    // 在请求内部初始化连接池
    const poolPromise = new sql.ConnectionPool(dbConfig)
      .connect()
      .then(pool => {
        console.log('Connected to database');
        return pool;
      })
      .catch(err => {
        console.error('Database Connection Failed:', err);
        throw new Error('Database Connection Failed');
      });

    const pool = await poolPromise;

    const { username } = req.query;
    console.log('Fetched username:', username);

    const userResult = await pool.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT userID FROM Users WHERE username = @username');

    if (!userResult.recordset || userResult.recordset.length === 0) {
      console.log('No user found for username:', username);
      return res.status(404).json({ error: 'User not found' });
    }

    const userID = userResult.recordset[0].userID;
    console.log('Found userID:', userID);

    const propertiesResult = await pool.request()
      .input('userID', sql.Int, userID)
      .query(`
        SELECT 
          p.propertyID, 
          p.propertyName, 
          p.propertyPrice, 
          p.propertyDescription, 
          p.propertyLocation, 
          p.propertyBedType, 
          p.propertyGuestPaxNo, 
          p.propertyStatus, 
          p.propertyImage,
          p.userID,
          u.uFirstName, 
          u.uLastName
        FROM Property p
        JOIN Users u ON p.userID = u.userID
        WHERE p.userID = @userID
      `);

    const properties = propertiesResult.recordset.map(property => ({
      ...property,
      propertyImage: property.propertyImage ? property.propertyImage.split(',') : []
    }));

    res.status(200).json({ properties });
  } catch (err) {
    console.error('Error fetching properties: ', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});


// Backend (Node.js + Express)
app.patch('/properties/:propertyID/status', async (req, res) => {
  const { propertyID } = req.params;
  const { status } = req.body; 

  try {
    const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
      console.log('Connected to database');
      return pool;
    })
    .catch(err => {
      console.error('Database Connection Failed:', err);
      throw new Error('Database Connection Failed');
    });
    const pool = await poolPromise;
    await pool.request()
      .input('propertyID', sql.Int, propertyID)
      .input('status', sql.NVarChar, status)
      .query(`UPDATE Property SET propertyStatus = @status WHERE propertyID = @propertyID`);

    res.status(200).json({ message: 'Property status updated successfully' });
  } catch (err) {
    console.error('Error updating property status:', err);
    res.status(500).json({ error: 'Failed to update property status' });
  }
});


// User Logout
app.post('/logout', async(req, res) => {
  const { username } = req.body;

  try {
    const pool = await sql.connect(dbConfig);

    await pool.request()
      .input('username', sql.VarChar, username)
      .query("UPDATE Users SET uStatus = 'logout' WHERE username = @username");

    res.status(200).json({ message: 'Logout Successfully', success: true });
  }catch (err) {
    console.error('Error during logout:', err);
    res.status(500).json({ message: 'Server error', success: false });
  }finally {
    sql.close();
  }
});

// Checking Users' Status 
app.get('/checkStatus', async(req, res) => {
  const { username } = req.query;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('username', sql.VarChar, username)
      .query('SELECT uStatus FROM Users WHERE username = @username');

    if (result.recordset.length > 0) {
      const uStatus = result.recordset[0].uStatus;
      res.status(200).json({ uStatus });
    }else {
      res.status(404).json({ message: 'User not found' });
    }
  }catch (err) {
    console.error('Error fetching user status:', err);
    res.status(500).json({ message: 'Server error' });
  }finally {
    sql.close();
  }
});

// Using Nodemailer to send a message
app.post('/contact_us', async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'wilson336933@gmail.com',
      pass: 'nditynbfwuchdpgx',
    },
  });

  const mailOptions = {
    from: 'wilson336933@gmail.com',  
    to: 'omg71933@gmail.com',
    subject: `Message from ${name}`,

    html: `
    <h1>New Message from ${name}</h1>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
    <p><strong>Email:</strong> ${email}</p>`,

    replyTo: email, 
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error.response);
    res.status(500).json({ message: 'Failed to send email', error: error.response});
  }
});

// Record Reservation Data
app.post('/reservation', async (req, res) => {
  const { propertyID, checkInDateTime, checkOutDateTime, reservationBlockTime, request, totalPrice, adults, children, rcFirstName, rcLastName, rcEmail, rcPhoneNo, rcTitle } = req.body;
  
  console.log("Adults:", adults);

  // Format the reservationPaxNo string based on adults and children count
  const reservationPaxNo = `${adults} ${adults === 1 ? 'Adult' : 'Adults'} ${children} ${children === 1 ? 'Kid' : 'Kids'}`;

  try {
    const pool = await sql.connect(dbConfig);

    const customerResult = await pool.request()
      .input('rcFirstName', sql.VarChar, rcFirstName)
      .input('rcLastName', sql.VarChar, rcLastName)
      .input('rcEmail', sql.VarChar, rcEmail)
      .input('rcPhoneNo', sql.BigInt, rcPhoneNo)
      .input('rcTitle', sql.VarChar, rcTitle)
      .query(`INSERT INTO dbo.Reservation_Customer_Details (rcFirstName, rcLastName, rcEmail, rcPhoneNo, rcTitle) OUTPUT inserted.rcID VALUES (@rcFirstName, @rcLastName, @rcEmail, @rcPhoneNo, @rcTitle)`);

    const rcID = customerResult.recordset[0].rcID;

    await pool.request()
      .input('propertyID', sql.Int, propertyID)
      .input('checkInDateTime', sql.DateTime, checkInDateTime)
      .input('checkOutDateTime', sql.DateTime, checkOutDateTime)
      .input('reservationBlockTime', sql.DateTime, reservationBlockTime)
      .input('request', sql.VarChar, request)
      .input('totalPrice', sql.Float, totalPrice)
      .input('rcID', sql.Int, rcID)
      .input('reservationPaxNo', sql.VarChar, reservationPaxNo)
      .query(`INSERT INTO dbo.Reservation (propertyID, checkInDateTime, checkOutDateTime, reservationBlockTime, request, totalPrice, rcID, reservationPaxNo) VALUES (@propertyID, @checkInDateTime, @checkOutDateTime, @reservationBlockTime, @request, @totalPrice, @rcID, @reservationPaxNo)`);

    res.status(201).json({ message: 'Reservation and Customer Details Added Successfully' });
  }catch (err) {
    console.error('Error inserting reservation data:', err);
    res.status(500).json({ message: 'Internal Server Error', details: err.message });
  }
});

// Fetch Properties 
app.get('/product', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT * FROM Property');

    // Split the propertyImage string into an array for each property
    const properties = result.recordset.map(property => {
      return {
        ...property,
        propertyImage: property.propertyImage ? property.propertyImage.split(',') : []
      };
    });

    res.status(200).json(properties);
  } catch (err) {
    console.error('Error fetching properties: ', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
