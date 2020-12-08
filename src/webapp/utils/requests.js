import { useContext } from 'react'
import axios from 'axios';
import Cookies from 'js-cookie';
import Router from 'next/router'

const BASE_URL = process.env.API_URL

export function sleep(milliseconds) {
  let timeStart = new Date().getTime();
  while (true) {
    let elapsedTime = new Date().getTime() - timeStart;
    if (elapsedTime > milliseconds) {
      break;
    }
  }
}


const login = (loginData) => {
  return axios.post(
    BASE_URL + '/auth/login',
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
    BASE_URL + '/users',
    formData)
}

const createCharacter = (formData, token) => {
  return axios.post(
    BASE_URL + '/characters/create',
    formData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
}

const deleteCharacter = (charId, token) => {
  return axios.delete(
    BASE_URL + `/characters/${charId}`,
    { headers: {
      'Authorization': `Bearer ${token}`
    }}
  )
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

export { registerUser, login, logout, createCharacter, deleteCharacter, request };