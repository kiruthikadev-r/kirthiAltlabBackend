const Ticket = require('../models/Ticket');
const {Agent, User} = require('../models/User');
const { v4: uuidv4 } = require('uuid');

exports.getTickets = async (req, res) => {
    const uniqueId = req.header('uniqueId');

    if (!uniqueId) {
      return res.status(401).json({ message: 'No uniqueId, authorization denied' });
    }
  
    try {
      const user = await User.findOne({ uniqueId });
      const agent = await Agent.findOne({ uniqueId });

      let tickets;

      if (agent) {
        tickets = await Ticket.find();
      } else if (user) {
        tickets = await Ticket.find({ customer: uniqueId });
      } else {
        return res.status(404).json({ message: 'User or agent not found' });
      }
  
      if (tickets.length === 0) {
        return res.status(404).json({ message: 'No tickets found' });
      }
  
      res.status(200).json({ tickets });
    } catch (error) {
      console.error('Error fetching tickets:', error);
      res.status(500).json({ message: 'Server Error', error });
    }
  };

exports.createTicket = async (req, res) => {
    const { title, content } = req.body;
    const customerId = req.user.uniqueId;
    const customerName = req.user.name;

    try {
      const ticketId = uuidv4();
      const newTicket = new Ticket({
        ticketId,
        title,
        customer: customerId,
        customerName,
        notes: [{ author: customerId, content, authorName: customerName }],
      });

      await newTicket.save();
      res.status(201).json({ message: 'Ticket created successfully', ticket: newTicket });
    } catch (error) {
      res.status(500).json({ message: 'Error creating ticket', error });
    }
  };

exports.addNote = async (req, res) => {
  const ticketId = req.params.id;
  const { content } = req.body;
  const userId = req.user.uniqueId;
  const userName = req.user.name;

  try {
    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    ticket.notes.push({ author: userId, content, authorName: userName });
    await ticket.save();

    res.status(201).json({ message: 'Note added successfully', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Error adding note', error });
  }
};

exports.updateTicketStatus = async (req, res) => {
  const ticketId = req.params.id;
  const { status } = req.body;

  try {
    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const agent = await Agent.findOne({ uniqueId: req.user.uniqueId });
    if (!agent) {
      return res.status(403).json({ message: 'Access denied' });
    }

    ticket.status = status;
    await ticket.save();

    res.status(200).json({ message: 'Ticket status updated successfully', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Error updating ticket status', error });
  }
};

