const express = require('express');
const bodyParser = require('body-parser');
const authMiddleware = require('./middlewares/authMiddleware');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
// const { initializeDB } = require('./DatabaseSingleton'); // Import the initializeDB function
const app = express();
const PORT = 3000;

app.set('secret', 'mysecretkey')
app.use(bodyParser.json());

// Mount admin routes
app.use('/admin', adminRoutes);

// Mount the authentication middleware
app.use(authMiddleware);

// Mount user routes
app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
