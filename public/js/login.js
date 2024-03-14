/* eslint-disable */
// require('@babel/polyfill');
const axios = require('axios');

export const login = async (email, password) => {
  console.log(email, password);
  console.log('sfas');
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    if (res.data.status === 'success') {
      alert('Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
    console.log(res);
  } catch (err) {
    console.log(err.response.data);
  }
};
