import { useContext, useEffect } from 'react'
import { UserContext } from '../contexts/user'
import { request } from '../utils/requests'
import Cookies from 'js-cookie'
import { Router, useRouter } from 'next/router'
import { Loader } from 'semantic-ui-react'

export default function Home() {

  const token = Cookies.get('auth_token')
  const userId = Cookies.get('dndUserId')
  const router = useRouter()

  useEffect(() => {
    if (token && userId) {
      router.push('/home')
    } else {
      router.push('/login')
    }
  }, [])

  return (
    <div style={{
      padding: '100px',
      }}>
        <Loader inverted content='Please wait...'/>
    </div>
  )
}