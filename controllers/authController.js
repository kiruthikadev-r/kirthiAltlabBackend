const { User, Agent } = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const uniqueId = uuidv4();

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      uniqueId
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully', uniqueId, role: newUser.role });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await Agent.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User/Agent not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '3h' });

    res.json({ token, uniqueId: user.uniqueId, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.adminRegister = async (req, res) => {
  try {
    const { name, email, password, isTopAdmin, role } = req.body;

    const existingAdmin = await Agent.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const uniqueId = uuidv4();

    const newAdmin = new Agent({
      name,
      email,
      password: hashedPassword,
      uniqueId,
      isTopAdmin,
      role,
    });

    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully!', uniqueId, role: newAdmin.role });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ message: 'Failed to register admin' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });

    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

