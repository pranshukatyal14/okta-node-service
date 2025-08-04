const axios = require('axios');
require('dotenv').config();

const headers = {
      Authorization: `SSWS ${process.env.OKTA_API_TOKEN}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };


async function fetchAllUsers() {
  try {
    
    const response = await axios.get(`${process.env.OKTA_DOMAIN}/api/v1/users`, {
      headers,
      params: { limit: 1 }, // Optional: remove or adjust as needed
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
      `${process.env.OKTA_DOMAIN}/api/v1/users/${userId}/devices`,
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


// export const collectPoints: (ui: number, p: number) => Promise<any> = (user_id, points) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const response = await axios.post(
//                 configuration.SERVICE.NFA_REWARDS_APP_URL + "/rewards/npl/collect/" + user_id,
//                 { points },
//                 {
//                     headers: {
//                         "api-key": configuration.APIKEY.INTERNAL_KEY,
//                     },
//                 }
//             );
//             const {
//                 data: { points: user_points },
//             } = response.data;
//             resolve(user_points);
//         } catch (error) {
//             reject(error);
//         }
//     });
// };
