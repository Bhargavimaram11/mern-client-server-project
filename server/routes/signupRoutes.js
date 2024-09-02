// routes/signupRoutes.js
const express = require('express');
const router = express.Router();
const { signup, getAllusers, getuserbyid, updateUser, deleteuser } = require('../controllers/signupController');
// const verifyToken = require('../middleware/authMiddleware'); // Import the middleware

router.post('/signup', signup);
router.get('/signup', getAllusers);
router.get('/signup/:id', getuserbyid);
router.put('/signup/:id', updateUser); // Apply middleware here
router.delete('/signup/:id', deleteuser); // Apply middleware here

module.exports = router;
