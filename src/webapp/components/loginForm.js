import { useState, useContext } from 'react'
import { UserContext } from '../contexts/user'
import Cookies from 'js-cookie'
import { login, request } from '../utils/requests'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

import { Form, Button, Container, Grid, Icon, Label, Message } from 'semantic-ui-react'

const LoginForm = ({ toggle }) => {
  const { userData } = useContext(UserContext)
  const { register, errors, handleSubmit } = useForm()
  const [errMsg, setErrMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [hidden, setHidden] = useState(true)
  const router = useRouter()

  const submitForm = (formData) => {
    setLoading(true)
    login(formData)
      .then(res => {
        if (res.status === 200) {
          Cookies.set('access_token', res.data.access_token)
          Cookies.set('dnd_user_id', res.data.user_id)
          router.push('/home')
        }
      })
      // .catch(err => console.log('err -> ', err.response))
      .catch(err => {
        console.log(err)
        // setErrMsg(err.response.data.detail)
        // setLoading(false)
      })
  }

  const toggleHidden = () => {
    setHidden(!hidden)
  }

  return (
    <Container>
      <Grid>
        <Grid.Row centered>
          <Grid.Column width={6} style={{border: "solid 1px", paddingTop: "10px"}}>
            <Form loading={loading} onSubmit={handleSubmit(submitForm)} style={{padding: '25px'}}>
              <Form.Field required>
                <input
                  name="username"
                  placeholder="Username"
                  ref={register({ required: true })}
                />
                {errors.username && <Label basic color='red' pointing>Username required</Label>}
              </Form.Field>
              <Form.Field required>
                <input
                  type={hidden ? "password" : "text"}
                  name="password"
                  placeholder="Password"
                  ref={register({ required: true })}
                />
                {hidden &&
                  <Icon name="eye slash" style={{ float: "right" }} onClick={toggleHidden} />
                }
                {!hidden &&
                  <Icon name="eye" style={{ float: "right" }} onClick={toggleHidden} />
                }
                {errors.password && <Label basic color='red' pointing>Enter password</Label>}
              </Form.Field>
              <Button primary>Login</Button>
              {errMsg &&
                <Message negative>
                  <Message.Header>{errMsg}</Message.Header>
                  <p>Something went wrong. Please try again</p>
                </Message>
              }
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  )
}

export default LoginForm;
