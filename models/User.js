const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  uniqueId: { type: String, unique: true },
  role: { type: String, enum: ['customer', 'agent', 'admin'], default: 'customer' },
});

const AgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  uniqueId: { type: String, unique: true }, 
  isTopAdmin: { type: Boolean, default: false },
  role: { type: String, enum: ['agent', 'admin'], default: 'agent' },
});

const User = mongoose.model('User', UserSchema); 
const Agent = mongoose.model('Agent', AgentSchema);

module.exports = {
  User,
  Agent,
};

