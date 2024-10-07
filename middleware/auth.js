const { User } = require('../models/User');
const { Agent } = require('../models/User');

module.exports = async (req, res, next) => {
  const uniqueId = req.header('uniqueId');
  if (!uniqueId) {
    return res.status(401).json({ message: 'No uniqueId, authorization denied' });
  }

  try {
    const user = await User.findOne({ uniqueId });
    const agent = await Agent.findOne({ uniqueId });

    if (!user && !agent) {
      return res.status(401).json({ message: 'Invalid uniqueId, user not found' });
    }

    req.user = user || agent;
    next();
  } catch (error) {
    console.error('Error in authentication middleware:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

