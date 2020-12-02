import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { logout } from '../utils/requests'

import {
  Segment, Menu, Sidebar, Icon, Container, Button
} from 'semantic-ui-react';
import styles from '../styles/Nav.module.css';

const NavSidebar = (props) => {
  const [visible, setVisible] = React.useState(false);
  const router = useRouter()

  const toggle = () => {
    setVisible(!visible);
  }

  return (
    <div>
      <Sidebar.Pushable as={Segment}>
        <Sidebar
          as={Menu}
          animation='overlay'
          direction='right'
          icon='labeled'
          inverted
          onHide={() => setVisible(false)}
          vertical
          visible={visible}
          width='thin'
        >
          <Link href="/home">
            <Menu.Item>
              <Icon name='users' />
              Characters
            </Menu.Item>
          </Link>
          <Menu.Item onClick={logout}>
            <Icon name='sign-out' />
            Sign out
          </Menu.Item>
          {/*
            <Icon
              name='angle double left inverted big'
              onClick={router.back}
              style={{position: "fixed", bottom: "10px"}}
              className={styles.closeMenu}
            />
          */}
        </Sidebar>

        <Sidebar.Pusher dimmed={visible} style={{minHeight: "100vh"}}>
          <div className={styles.toggle}>
            <Icon name='bars' size='big' onClick={toggle}/>
          </div>

          <div className={styles.backButton}>
            <Button content='Back' icon='left arrow' labelPosition='left' onClick={router.back} />
          </div>
          <Container fluid>
            {props.children}
          </Container>
        </Sidebar.Pusher>
       </Sidebar.Pushable>
    </div>
  )
}

export default NavSidebar;
