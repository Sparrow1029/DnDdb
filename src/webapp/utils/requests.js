import axios from 'axios';
import Cookies from 'js-cookie';

async function login (loginData) {
  console.log("Doing the thing")
  console.log(process.env.API_URL + '/auth/login')
  let resp = await axios.post(
    process.env.API_URL + '/auth/login', 
    loginData,
    {headers: {
        'Content-Type': 'multipart/form-data',
      }}
    )
    .then(resp => {
      console.log(resp)
      if (resp.data.message == "Login successful") {
        Cookies.set('auth_token', resp.data.access_token, { expires: 7 })
        axios.defaults.headers.common['Authorization'] = `Bearer ${resp.data.access_token}`
        console.log(axios.defaults)
        return true;
      }
    })
    .catch(err => {
      console.log(err)
      // return err
    })
}

const request = axios.create({
  baseURL: process.env.API_URL,
  timeout: 1000,
  headers: {
    'Authorization': Cookies.get('auth_token') || 'not_logged_in'
  }
})

export { login, request };
