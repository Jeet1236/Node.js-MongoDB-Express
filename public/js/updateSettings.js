/* eslint-disable */
const axios = require('axios');
import { showAlert } from './alerts';

// type is either password or data
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updatePasswords'
        : '/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',

      url: url,
      data: data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} Updated  successfully`);
    }
    console.log(res);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
