import React from 'react';
import Link from 'next/link';
import {
  Segment, Menu, Sidebar, Icon, Container, Button
} from 'semantic-ui-react';
import styles from '../styles/Nav.module.css';
import { useRouter } from 'next/router';

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
          icon='labeled'
          inverted
          onHide={() => setVisible(false)}
          vertical
          visible={visible}
          width='thin'
        > 
          <Link href="/home">
            <Menu.Item>
              <Icon name='home' />
              Home
            </Menu.Item>
          </Link>
          <Link href="character">
            <Menu.Item as='a'>
              <Icon name='gamepad' />
              Character
            </Menu.Item>
          </Link>
          <Menu.Item as='a'>
            <Icon name='camera' />
            Channels
          </Menu.Item>
          {/* <Icon
                name='angle double left inverted big'
                onClick={toggle}
                style={{position: "fixed", bottom: "10px"}}
                className={styles.closeMenu}
              /> */}
        </Sidebar>

        <Sidebar.Pusher dimmed={visible} style={{minHeight: "100vh"}}>
          <div className={styles.toggle}>
            <Icon name='bars' size='big' onClick={toggle}/>
          </div>
          <Container fluid>
            {props.children}
          </Container>
        </Sidebar.Pusher>
       </Sidebar.Pushable>
        <Button
          onClick={router.back}
          style={{position: 'absolute', top: 25, right: 25}}
        >Back</Button>
    </div>
  )
}

export default NavSidebar;
