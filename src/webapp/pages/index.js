import { useContext, useEffect } from 'react'
import { UserContext } from '../contexts/user'
import { request } from '../utils/requests'
import Cookies from 'js-cookie'
import { Router, useRouter } from 'next/router'
import { Loader } from 'semantic-ui-react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    let loggedIn = new Promise((resolve, reject) => {
      const token = Cookies.get('access_token')
      const userId = Cookies.get('dnd_user_id')
      if (token && userId) {
        resolve(true)
      }
      reject(false)
    })
    loggedIn
    .then(() => {
      router.push('/home')
    })
    .catch(() => {
      router.push('/login')
    })
  }, [])

  return (
    <div style={{
      padding: '100px',
      }}>
        <Loader inverted content='Please wait...'/>
    </div>
  )
}