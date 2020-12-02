import React, { useContext, useEffect, useState } from 'react'
import { RacesContext } from '../../contexts/races'
import { request } from '../../utils/requests'

import {
   Segment, Header, Button, Grid, Image, Menu, Container, Loader, List, Icon,
  } from 'semantic-ui-react'

const RaceData = ({ setForm, formData, navigation }) => {
  const [races, setRaces] = useContext(RacesContext)
  const [loading, setLoading] = useState(true)
  const { race } = formData
  const { next, previous } = navigation

  const handleTabClick = (event, data) => {
    let dataObj = { target: { name: 'race', value: data.name } }
    setForm(dataObj)
  }

  useEffect(() => {
    request.get('/races')
    .then(res => {
      setRaces(res.data.races)
      setLoading(false)
    })
    .catch(err => console.log(err))
  }, [])

  const getListFromKeys = (obj, keyArr) => {
    let list = []
    for (let key of keyArr) {
      list.push(
        <List.Item key={key}>
          <Icon name='triangle right' />
          <List.Content>
            <List.Header>{key.replace(/_/g, ' ').toTitleCase()}</List.Header>
            <List.Description>{obj[key]}</List.Description>
          </List.Content>
        </List.Item>
      )
    }
    return list
  }

  const createRaceSummary = (name) => {
    let raceObj = races.filter(obj => {
      return obj.name === name
    })[0]

    let descriptionArr = raceObj.description.split('\\n\\n').map(obj => {
      return <p>{obj}</p>
    })
    let languages = raceObj.languages.map(lang => { return lang.toTitleCase() }).join(', ')
    let permittedClasses = raceObj.permitted_classes.map(cls => { return cls.toTitleCase() }).join(', ')

    let abilitiesObj = raceObj['abilities']
    let bonusObj = raceObj['abilities']['bonuses']

    let bonuses = (name === 'human')
      ? <List.Item>None</List.Item>
      : getListFromKeys(bonusObj, Object.keys(bonusObj))

    let abilities = (['human', 'half_orc'].includes(name))
      ? <List.Item>None</List.Item>
      : getListFromKeys(abilitiesObj, Object.keys(abilitiesObj).filter(k => { return k !== 'bonuses' }))

    return (
        <div>
        <Container style={{fontSize: '.9rem'}}> <Header as='h2'>{raceObj.name.replace(/_/g, '-').toTitleCase()}</Header>
        {descriptionArr}
        </Container>
        <Grid padded>
          <Grid.Row columns={2}>
            <Grid.Column width={7}>
              <Container style={{fontSize: '.9rem'}}>
                <Header as='h3'>Racial Abilities</Header>
                <List>{abilities}</List>
              </Container>
            </Grid.Column>
            <Grid.Column width={9}>
              <Container style={{fontSize: '.9rem'}}>
                <Header as='h3'>Bonuses</Header>
                <List>{bonuses}</List>
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Container style={{paddingLeft: '25px'}}>
          <List>
            <List.Item key='lang'>
              <List.Icon name='triangle right' />
              <List.Content>
                <List.Header>Languages</List.Header>
                <List.Description>{languages}</List.Description>
              </List.Content>
            </List.Item>
            <List.Item key='classes'>
              <List.Icon name='triangle right' />
              <List.Content>
                <List.Header>Permitted Classes</List.Header>
                <List.Description>{permittedClasses}</List.Description>
              </List.Content>
            </List.Item>
          </List>
        </Container>
        </div>
    )
  }

  return (
    <Segment raised>
      <Header as='h1' content='Choose a Race'/>
      <Menu attached='top' key='menu1' tabular>
        <Menu.Item
          name='dwarf'
          active={race === 'dwarf'}
          onClick={handleTabClick}
        />
        <Menu.Item
          name='elf'
          active={race === 'elf'}
          onClick={handleTabClick}
        />
        <Menu.Item
          name='gnome'
          active={race === 'gnome'}
          onClick={handleTabClick}
        />
        <Menu.Item
          name='half_elf'
          active={race === 'half_elf'}
          onClick={handleTabClick}
        >Half-Elf</Menu.Item>
        <Menu.Item
          name='halfling'
          active={race === 'halfling'}
          onClick={handleTabClick}
        />
        <Menu.Item
          name='half_orc'
          active={race === 'half_orc'}
          onClick={handleTabClick}
        >Half-Orc</Menu.Item>
        <Menu.Item
          name='human'
          active={race === 'human'}
          onClick={handleTabClick}
        />
      </Menu>
      <Container style={{padding: '25px'}}>
      <Grid divided>
        <Grid.Row columns={2} style={{height: '60vh'}}>
          <Grid.Column width={6}>
            <Image src={`/race-images/${formData.race}.png`}
              alt={`Picture of ${formData.race}`} fluid />
          </Grid.Column>
          <Grid.Column width={10} style={{overflowY: 'scroll', maxHeight: '380px'}}>
            {loading
              ? <Loader inverted />
              : createRaceSummary(race)
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
      </Container>
      <div style={{display: 'flex', justifyContent: 'right'}}>
        <Button onClick={next}>Select and Continue</Button>
      </div>
    </Segment>
  )
}

export default RaceData