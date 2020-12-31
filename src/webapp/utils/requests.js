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
  localStorage.clear()
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

const saveCharacter = (charData) => {
  console.log(charData)
  let token = Cookies.get('access_token')
  return axios.patch(
    BASE_URL + `/characters/${charData.id}`,
    charData, {
      headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

async function getStore () {
  await axios.get(
    BASE_URL + '/store/equipment'
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

export { registerUser, login, logout, createCharacter, deleteCharacter, saveCharacter, request };