import React, { useContext, useEffect, useState } from 'react'
import { RacesContext } from '../../contexts/races'
import { ClassesContext } from '../../contexts/class'
import { request } from '../../utils/requests'
import uuid from 'react-uuid'
import { getListFromKeys } from '../../utils/formatting'

import {
   Segment, Header, Button, Grid, Image, Menu, Container, Loader, List, Icon,
} from 'semantic-ui-react'
import styles from '../../styles/Responsive.module.css'

const RaceData = ({ setForm, formData, navigation }) => {
  const [races, setRaces] = useContext(RacesContext)
  const [loading, setLoading] = useState(true)
  const { race } = formData
  const { next } = navigation

  useEffect(() => {
    request.get('/races')
    .then(res => {
      setRaces(res.data.races)
      setLoading(false)
    })
    .catch(err => console.log(err))
  }, [])

  const handleTabClick = (_, { name }) => {
    setForm({ target: { name: 'race', value: name } })
  }

  const nextForm = () => {
    let cls = races.filter(obj => obj.name === race)[0].permitted_classes[0]
    setForm({ target: {name: 'class_', value: cls }})
    next()
  }

  const createRaceSummary = (name) => {
    let raceObj = races.filter(obj => {
      return obj.name === name
    })[0]

    let descriptionArr = raceObj.description.split('\\n\\n').map(obj => {
      return <p key={uuid()}>{obj}</p>
    })
    let languages = raceObj.languages.map(lang => { return lang.toTitleCase() }).join(', ')
    let permittedClasses = raceObj.permitted_classes.map(cls => { return cls.replace(/_/g, ' ').toTitleCase() }).join(', ')

    let abilitiesObj = raceObj['abilities']
    let bonusObj = raceObj['abilities']['bonuses']

    let bonuses = (name === 'human')
      ? <List><List.Item key={uuid()}>None</List.Item></List>
      : getListFromKeys(bonusObj, Object.keys(bonusObj))

    let abilities = (['human', 'half_orc'].includes(name))
      ? <List><List.Item key={uuid()}>None</List.Item></List>
      : getListFromKeys(abilitiesObj, Object.keys(abilitiesObj).filter(k => { return k !== 'bonuses' }))

    return (
        <div key={uuid()}>
        <Container style={{fontSize: '.9rem'}}>
          <Header as='h2'>
           {raceObj.name.replace(/_/g, '-').toTitleCase()}
          </Header>
          {descriptionArr}
        </Container>
        <Grid padded>
          <Grid.Row columns={2}>
            <Grid.Column width={7}>
              <Container style={{fontSize: '.9rem'}}>
                <Header as='h3'>Racial Abilities</Header>
                {abilities}
              </Container>
            </Grid.Column>
            <Grid.Column width={9}>
              <Container style={{fontSize: '.9rem'}}>
                <Header as='h3'>Bonuses</Header>
                {bonuses}
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Container style={{paddingLeft: '25px'}}>
          <List>
            <List.Item>
              <List.Icon name='triangle right' />
              <List.Content>
                <List.Header>Languages</List.Header>
                <List.Description>{languages}</List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
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
      <Menu attached='top' tabular className={styles.wrapped}>
        <Menu.Item name='dwarf' active={race === 'dwarf'} onClick={handleTabClick} />
        <Menu.Item name='elf' active={race === 'elf'} onClick={handleTabClick} />
        <Menu.Item name='gnome' active={race === 'gnome'} onClick={handleTabClick} />
        <Menu.Item name='half_elf' active={race === 'half_elf'} onClick={handleTabClick} >Half-Elf</Menu.Item>
        <Menu.Item name='halfling' active={race === 'halfling'} onClick={handleTabClick} />
        <Menu.Item name='half_orc' active={race === 'half_orc'} onClick={handleTabClick} >Half-Orc</Menu.Item>
        <Menu.Item name='human' active={race === 'human'} onClick={handleTabClick} />
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
        <Button onClick={nextForm}>Select and Continue</Button>
      </div>
    </Segment>
  )
}

export default RaceData