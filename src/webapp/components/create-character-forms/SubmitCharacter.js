import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Segment, Loader, Container, Message, Button } from 'semantic-ui-react'
import { request, sleep } from '../../utils/requests'
import Cookies from 'js-cookie'

import styles from '../../styles/Responsive.module.css'

const SubmitCharacter = ({formData}) => {
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (loading) {
      formData['class'] = formData['class_']
      formData['money'] = {gp: formData.gold, sp: 0, cp: 0, ep: 0, pp: 0}
      delete formData.class_
      delete formData.gold
      console.log("Sending data")
      console.log(formData)
      setErr(null)
      request.post('/characters/create', formData,
        {headers : {
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        }})
        .then(res => {
          setErr(null)
          setSuccess(true)
          console.log(res.data)
          setLoading(false)
          sleep(2000)
          router.push('/home')
        })
        .catch(err => setErr(err.response.data.detail))
      }
  }, [loading])

  return (
    <Container style={{padding: '200px'}}>
      <div className={styles.center}>
        <>
        {(loading && !err && !success) &&
          <div>
            <Loader active={loading} size='massive'>Creating</Loader>
          </div>
        }
        </>
        <>
        {success &&
        <div>
          <Message positive>Success!</Message>
        </div>
        }
        </>
        <>
        {(err !== null) &&
          <div>
            <Message negative>{err}</Message>
            <Button icon='x' onClick={() => {router.push("/home")}}>
              Back to Home Page
            </Button>
          </div>
        }
        </>
      </div>
    </Container>
  )
}

export default SubmitCharacter