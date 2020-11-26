import React from 'react'
import { Container, Grid, Header } from 'semantic-ui-react'
import styles from '../styles/Global.module.css'
import NavSidebar from '../components/sidenav'

const UserHomePage = () => {
  return (
      <Container>
        <Grid>
          <Grid.Row centered>
            <Grid.Column width={16}>
              <h1 className={styles.title}>This is the user homepage!</h1>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
  )
}

UserHomePage.Layout = NavSidebar;

export default UserHomePage;
