import express from 'express';
import bodyParser from 'body-parser';
import authMiddleware from './middlewares/authMiddleware.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';

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
