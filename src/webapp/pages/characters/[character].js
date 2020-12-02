import { React, useContext, useEffect, useState } from 'react';
import { CharacterContext } from '../../contexts/character'
import { useRouter } from 'next/router'
import { request } from '../../utils/requests'

import styles from '../../styles/Global.module.css';
import {
  Container, Header, Icon, Grid, Segment, Loader
} from 'semantic-ui-react';
import NavSidebar from '../../components/sidenav'

export default function CharacterPage () {
  const [loading, setLoading] = useState(true)
  const [char, setChar] = useContext(CharacterContext)
  const router = useRouter()

  useEffect(() => {
    if ([null, undefined].includes(char)) {
      console.log(router.query)
      request.get(`/characters/${router.query.character}`)
      .then(resp => {
        setChar(resp.data)
        setLoading(false)
      })
      .catch(err => console.log(err))
    }
  }, [])

  return (
      <Container style={{padding: '100px'}}>
        {(!char && loading)
        ? <Loader inverted content='Loading...' />
        : <>
        <Header as='h1' icon='database' textAlign='center' content='Character Page' />
        <Grid columns={2} stackable>
          <Grid.Column>
            <Segment>{char.class.toTitleCase()}</Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment>{char.name.toTitleCase()}</Segment>
          </Grid.Column>
        </Grid>
        </>
        }
      </Container>
  )
}

CharacterPage.Layout = NavSidebar;
