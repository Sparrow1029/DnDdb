import React from 'react'
import styles from '../styles/Forms.module.css'
import Link from 'next/link'
import { login } from '../utils/requests'
import { Form, Button, Container, Grid } from 'semantic-ui-react'

const LoginForm = () => {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')

  const submitForm = () => {
    login({ username, password })
    console.log("Success")
  }

  return (
    // <div className={styles.loginForm}>
    <Container fluid>
      <Grid>
        <Grid.Row centered>
          <Grid.Column width={4} style={{border: "solid 1px", paddingTop: "10px"}}>
            <Form>
              <Form.Input
              // error={{ content: 'Please enter username', pointing: 'below' }}
                fluid
                label='Username'
                placeholder='Username'
                id='username'
                value={ username }
                onChange={e => setUsername(e.target.value)}
              />
              <Form.Input
              // error='Please enter password'
                fluid
                label='Password'
                type='password'
                placeholder='Username'
                id='password'
                value={ password }
                onChange={e => setPassword(e.target.value)}
              />
              <Button type='submit' onClick={submitForm}>Login</Button>
              <p style={{ textAlign: "center" }}>Not registered? <Link href="home">Register Here</Link></p>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
    // </div>
  )
}

export default LoginForm;
