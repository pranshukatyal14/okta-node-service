const express = require('express');
const router = express.Router();
const { getUsersWithDevices } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth.middleware');


router.get('/devices',authMiddleware, getUsersWithDevices);

module.exports = router;
