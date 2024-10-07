const express = require('express');
const { register, login, adminRegister, getAllUsers } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin/register', adminRegister);
router.get('/all-user', getAllUsers);

module.exports = router;
