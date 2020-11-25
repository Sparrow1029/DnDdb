import React from 'react';
import NavSidebar from '../components/sidenav';
import styles from '../styles/Global.module.css';
import {
  Container, Header, Icon, Grid, Segment
} from 'semantic-ui-react';

const CharacterPage = () => {
  return (
    <NavSidebar>
      <div className={styles.contentContainer}>
        <Header as='h1' icon='database' textAlign='center' content='Character Page' />
        <Grid columns={2} stackable>
          <Grid.Column>
            <Segment>Assassin</Segment> 
          </Grid.Column>
          <Grid.Column>
            <Segment>Content</Segment> 
          </Grid.Column>
        </Grid>
      </div>
    </NavSidebar>
  )
}

export default CharacterPage;
