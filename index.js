const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = 3000;

app.set('secret', 'mysecretkey')
app.use(bodyParser.json());

// Mount users router
app.use('/admin', adminRouter);

// Mount the authentication middleware
app.use(authMiddleware)

// Mount users router
app.use('/users', usersRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

