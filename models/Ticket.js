const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const noteSchema = new mongoose.Schema({
  author: { type: String, required: true },
  authorName: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  attachment: { type: String }
});

const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, unique: true },
  title: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Active', 'Pending', 'Closed'], 
    default: 'Active' 
  },
  customer: { type: String, required: true }, 
  customerName: { type: String, required: true },
  lastUpdatedOn: { type: Date, default: Date.now },
  notes: [noteSchema]
}, { timestamps: true });

ticketSchema.pre('save', function (next) {
  if (this.isModified('notes')) {
    this.lastUpdatedOn = new Date();
  }
  next();
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;

