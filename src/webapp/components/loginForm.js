import React from 'react'
import styles from '../styles/Forms.module.css'
import { login } from '../utils/requests'
import { Form, Button } from 'semantic-ui-react'

const LoginForm = () => {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')

  const submitForm = () => {
    login({ username, password })
    console.log("Success")
  }

  return (
    <div className={styles.loginForm}>
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
      </Form>
    </div>
  )
}

export default LoginForm;
