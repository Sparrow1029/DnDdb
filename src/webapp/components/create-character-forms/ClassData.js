import React, { useContext, useEffect, useState } from 'react'
import { ClassesContext } from '../../contexts/class'
import { request } from '../../utils/requests'

import {
  Segment, Header, Button, Grid, Image, Menu, Container, Loader, List, Icon,
} from 'semantic-ui-react'

const ClassData = ({ setForm, formData, navigation }) => {
  const [classes, setClasses] = useContext(ClassesContext)
  const [loading, setLoading] = useState(true)
  const { class_ } = formData
  const { next, previous } = navigation


  useEffect(() => {
    request.get('/classes')
    .then(res => {
      setClasses(res.data.classes)
      setLoading(false)
    })
    .catch(err => console.dir(err))
  }, [])

  const handleTabClick = (event, data) => {
    let dataObj = { target: { name: 'class_', value: data.name } }
    setForm(dataObj)
  }

  const createClassSummary = () => {
    return (
      <Header as='h2'>
        {class_.toTitleCase()}
      </Header>
    )
  }

  return (
    <Segment raised>
      <Header as='h1' content='Choose a Class'/>
      <div></div>
      <Menu attached='top' tabular fluid>
        <Menu.Item
          name='assassin'
          active={class_ === 'assassin'}
          onClick={handleTabClick}
        />
        <Menu.Item
          name='cleric'
          active={class_ === 'cleric'}
          onClick={handleTabClick}
        />
        <Menu.Item
          name='druid'
          active={class_ === 'druid'}
          onClick={handleTabClick}
        />
        <Menu.Item
          name='fighter'
          active={class_ === 'fighter'}
          onClick={handleTabClick}
        />
        <Menu.Item
          name='illusionist'
          active={class_ === 'illusionist'}
          onClick={handleTabClick}
        />
        <Menu.Item
          name='magic_user'
          active={class_ === 'magic_user'}
          onClick={handleTabClick}
        />
        <Menu.Item
          name='paladin'
          active={class_ === 'paladin'}
          onClick={handleTabClick}
        />
        <Menu.Item
          name='ranger'
          active={class_ === 'ranger'}
          onClick={handleTabClick}
        />
        <Menu.Item
          name='thief'
          active={class_ === 'thief'}
          onClick={handleTabClick}
        />
      </Menu>
      <Container style={{padding: '25px'}}>
      <Grid divided>
        <Grid.Row columns={2}>
          <Grid.Column width={4}>
            <Image src={`/class-images/${formData.class_}.jpg`} style={{maxHeight: '380px'}}
              alt={`Picture of ${formData.class_}`}/>
          </Grid.Column>
          <Grid.Column width={12} style={{overflowY: 'scroll', maxHeight: '380px'}}>
            {loading
              ? <Loader inverted />
              : createClassSummary(class_)
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
      </Container>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <Button onClick={previous}>Previous</Button>
        <Button onClick={next}>Select and Continue</Button>
      </div>
    </Segment>
  )
}

export default ClassData