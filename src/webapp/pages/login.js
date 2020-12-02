import React, { useState, useEffect } from 'react'

import LoginForm from '../components/loginForm'
import RegisterForm from '../components/registerForm'
import NavSidebar from '../components/sidenav'

import { Button, Container, Modal } from 'semantic-ui-react'
import styles from '../styles/Global.module.css'

const Login = () => {
  const [showRegister, setShowRegister] = useState(false)

  return (
    <Container>
      <h1 className={styles.title}>
        Welcome to DnDdb!
      </h1>
      <div style={{padding: "100px 0 100px 0"}}></div>
      <LoginForm />
      <div style={{position: 'absolute', left: '50%', bottom: '20px', transform: 'translate(-50%, -50%)'}}>
      <Modal
        closeIcon
        onClose={() => setShowRegister(false)}
        onOpen={() => setShowRegister(true)}
        open={showRegister}
        trigger={<Button>Register Here</Button>}
        size='mini'
      >
        <RegisterForm />
      </Modal>
      </div>
    </Container>
  )
};

export default Login