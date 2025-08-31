const axios = require('axios');
const { config } = require('../config/index.js');
const headers = {
      Authorization: `SSWS ${config.apiToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };


async function fetchAllUsers() {
  try {
      console.log(`${config.oktaDomain}/api/v1/users`)
    const response = await axios.get(`${config.oktaDomain}/api/v1/users`, {
      headers,
      params: { limit: 1 }, 
    });

    return response.data;
  } catch (error) {
    console.error('Error response:', error.response?.data);
    throw new Error(
      'Failed to fetch users: ' +
        (error.response?.data?.errorSummary || error.message)
    );
  }
}

async function fetchUserDevices(userId) {
  try {
    const response = await axios.get(
      `${config.oktaDomain}/api/v1/users/${userId}/devices`,
      { headers }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) return [];
    throw new Error(`Failed to fetch devices for user ${userId}: ` + (error.response?.data?.errorSummary || error.message));
  }
}

exports.getUsersAndDevices = async () => {
  const users = await fetchAllUsers();
  const enrichedUsers = await Promise.all(users.map(async (user) => {
    const devices = await fetchUserDevices(user.id);
    return {
      id: user.id,
      email: user.profile.email,
      name: `${user.profile.firstName} ${user.profile.lastName}`,
      devices
    };
  }));
  return enrichedUsers;
};


