import React, { useEffect, useState } from 'react'
import { request } from '../../utils/requests'

import CreateCharacterForm from '../../components/create-character-forms/CreateCharacterForm'

import NavSideBar from '../../components/sidenav'
import { Container, Grid, Loader } from 'semantic-ui-react'

const shapeData = (objArray) => {
  let newObj = {}
  for (let obj of objArray) {
    newObj[obj.name] = obj
  }
  return newObj
}

const CreateChar = () => {
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState({})
  const [races, setRaces] = useState({})

  useEffect(() => {
    request.get('/races')
    .then(res => {
      setRaces(shapeData(res.data.races))
      request.get('/classes')
      .then(res2 => {
        setClasses(shapeData(res2.data.classes))
        setLoading(false)
      })
      .catch(err => err.response)
    })
    .catch(err => err.response)
  }, [])

  return (
    <Container fluid style={{paddingTop: '20px' }}>
      <Grid>
        <Grid.Row centered>
          <Grid.Column width={12}>
            {loading
              ? <Loader content="Loading..."/>
              : <CreateCharacterForm clss={classes} rcs={races}/>
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  )
}

CreateChar.Layout = NavSideBar

export default CreateChar;