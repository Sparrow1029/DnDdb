import { React, useState, memo } from 'react'
import { Container, Grid, Form, Label, Button, Icon, Message } from 'semantic-ui-react'
import { login, registerUser } from '../utils/requests'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const RegisterForm = () => {
  const [loading, setLoading] = useState(false)
  const [hidden, setHidden] = useState(true)
  const [success, setSuccess] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const { register, errors, handleSubmit } = useForm()
  const router = useRouter()

  const submitForm = formData => {
    console.log(formData)
    setLoading(true);
    registerUser(formData)
    .then(resp => {
      setLoading(false)
      setSuccess(resp.data.msg + '!')

    })
    .catch(err => {
      setLoading(false)
      setErrMsg(err.response.data.detail)
    })
  }

  const toggleHidden = () => {
    setHidden(!hidden)
  }

  return (
    <Container style={{width: '100%'}}>
      <Grid>
        <Grid.Row centered>
          <Grid.Column width={16} style={{border: "solid 1px", paddingTop: "10px"}}>
            <Form loading={loading} onSubmit={handleSubmit(submitForm)} style={{padding: '25px'}}>
              <Form.Field required>
                <input placeholder="Email" name="email" ref={register({ required: true, pattern: /^\S+@\S+$/i })}/>
                {errors.email && <Label basic color='red' pointing>Please enter a valid email</Label>}
              </Form.Field>
              <Form.Field required>
                <label>Username</label>
                <input name="username" ref={register({ required: true, maxLength: 24 })}/>
                {errors.username && "Username is required"}
              </Form.Field>
              <Form.Field required>
                <label>Password</label>
                <input type={hidden ? "password" : "text"} name="password" ref={register({ required: true, minLength: 8 })} />
                {hidden &&
                  <Icon name="eye slash" style={{ float: "right" }} onClick={toggleHidden} />
                }
                {!hidden &&
                  <Icon name="eye" style={{ float: "right" }} onClick={toggleHidden} />
                }
              </Form.Field>
              <Form.Field>
                <label>Real Name (optional)</label>
                <input name="realname" ref={register} />
              </Form.Field>
              <Form.Field>
                <Button >Register</Button>
              </Form.Field>
            </Form>
            {errMsg &&
              <Message negative>
                <Message.Header>{errMsg}</Message.Header>
                <p>Please try again</p>
              </Message>
            }
            {success &&
              <Message positive>
                <Message.Header>{success}</Message.Header>
                <p>You may now sign in.</p>
              </Message>
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  )
}

export default RegisterForm