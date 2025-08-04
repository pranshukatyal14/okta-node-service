const oktaService = require('../services/oktaService');

exports.getUsersWithDevices = async (req, res) => {
  try {
    const result = await oktaService.getUsersAndDevices();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in controller:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from Okta' });
  }
};
