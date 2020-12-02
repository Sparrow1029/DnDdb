import { useContext } from 'react'
import axios from 'axios';
import Cookies from 'js-cookie';
import Router from 'next/router'

const login = (loginData) => {
  console.log("Logging in")
  console.log(process.env.API_URL + '/auth/login')
  return axios.post(
    process.env.API_URL + '/auth/login',
    loginData
    )
}


const logout = () => {
  console.log("Logging out")
  Cookies.remove('access_token')
  Cookies.remove('dnd_user_id')
  Router.push('/')
}

const registerUser = (formData) => {
  return axios.post(
    process.env.API_URL + '/users',
    formData)
}


const request = axios.create({
  baseURL: process.env.API_URL,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  }
})

axios.interceptors.request.use(
  config => {
    if (config.baseURL === process.env.API_URL && !config.headers.Authorization) {
      const token = Cookies.get('access_token') || null;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  error => Promise.reject(error)
);

export { registerUser, login, logout, request };