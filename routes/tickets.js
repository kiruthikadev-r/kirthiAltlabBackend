const express = require('express');
const { getTickets, createTicket, addNote, updateTicketStatus } = require('../controllers/ticketController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/agent/tickets', auth, getTickets);
router.post('/tickets', auth, createTicket); 

router.post('/tickets/:id/notes', auth, addNote);

router.put('/tickets/:id/status', auth, updateTicketStatus);

module.exports = router;

