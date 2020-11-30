import { useContext, useEffect } from 'react'
import { UserContext } from '../contexts/user'
import { request } from '../utils/requests'
import Cookies from 'js-cookie'
import { Router, useRouter } from 'next/router'

export default function Home() {

  const token = Cookies.get('auth_token')
  const userId = Cookies.get('dndUserId')
  const router = useRouter()

  useEffect(() => {
    console.log(token)
    console.log(userId)
    if (!token || !userId) {
      router.push('/login')
    } else {
      router.push('/home')
    }
  }, [])

  return (
    <h1>
      ...
    </h1>
  )
}