import React from 'react'
import { useRouter } from 'next/router'
import RacesContextProvider from '../../contexts/races'
import ClassesContextProvider from '../../contexts/class'

import CreateCharacterForm from '../../components/create-character-forms/CreateCharacterForm'

import NavSideBar from '../../components/sidenav'
import { Container, Grid } from 'semantic-ui-react'

const CreateChar = () => {
  return (
    <RacesContextProvider><ClassesContextProvider>
    <Container fluid style={{paddingTop: '20px' }}>
      <Grid>
        <Grid.Row centered>
          <Grid.Column width={12}>
            <CreateCharacterForm />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
    </ClassesContextProvider></RacesContextProvider>
  )
}

CreateChar.Layout = NavSideBar

export default CreateChar;