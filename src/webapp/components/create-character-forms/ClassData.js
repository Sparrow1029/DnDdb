import React, { useContext, useEffect, useState } from 'react'
import { ClassesContext } from '../../contexts/class'
import { RacesContext } from '../../contexts/races'
import { request } from '../../utils/requests'
import uuid from 'react-uuid'

import { getStartingHP } from '../../utils/formatting'

import AlignmentTable from '../AlignmentTable'
import {
  Segment, Header, Button, Grid, Image, Menu, Container, Loader, List, Icon, Table
} from 'semantic-ui-react'
import styles from '../../styles/Responsive.module.css'

const ClassData = ({ setForm, formData, navigation }) => {
  const [classes, setClasses] = useContext(ClassesContext)
  const [races, setRaces] = useContext(RacesContext)
  const [raceObj, setRaceObj] = useState({})
  const [classObj, setClassObj] = useState({})
  const [loading, setLoading] = useState(true)
  const { class_, race } = formData
  const { next, previous } = navigation

  useEffect(() => {
    setRaceObj(races.filter(obj => {
      return obj.name === race
    })[0])
    request.get('/classes')
    .then(res => {
      setClasses(res.data.classes)
      setClassObj(res.data.classes.filter(obj => {
        return obj.name === class_
      })[0])
      setLoading(false)
    })
    .catch(err => console.dir(err))
  }, [class_, raceObj])

  const setAlignment = (event) => {
    let dataObj = ({ target: { name: 'alignment', value: event.target.id } })
    setForm(dataObj)
  }

  const handleTabClick = (_, { name }) => {
    let dataObj = { target: { name: 'class_', value: name } }
    setForm(dataObj)
    let { alignment, hit_die } = classes.filter(
        obj => { return obj.name === name })[0].restrictions
    setAlignment({ target: { id: alignment[0] }})// selectedClass.restrictions.alignment[0] } })
    setForm({ target: { name: 'max_hp', value: getStartingHP(name, hit_die) }})// selectedClass.restrictions.hit_die.replace(/d/g, '')) } })
  }

  const renderClassInfo = () => {
    let { armor, weapons_permitted, shield, proficiencies, penalty_to_hit, hit_die } = classObj.restrictions
    let minScores = []
    for (let score of ['min_str', 'min_dex', 'min_con', 'min_int', 'min_wis', 'min_cha']) {
      minScores.push(`${score.replace(/min_/g, '').toTitleCase()}: ${classObj.restrictions[score]}`)
    }
    let info = []
    info.push(<p key={uuid()}><strong>Hit Die:&nbsp;</strong>{`"${hit_die}"`}&nbsp;&nbsp;<span>{`(Start HP: ${hit_die.replace(/d/g, '')})`}</span></p>)
    info.push(<p key={uuid()}><strong>Minimum Scores:&nbsp;&nbsp;</strong>{minScores.join(', ')}</p>)
    info.push(<p key={uuid()}><strong>Permitted Weapons:&nbsp;</strong>{weapons_permitted.map(item => item.toTitleCase()).join(', ')}</p>)
    info.push(<p key={uuid()}><strong>Permitted Armor:&nbsp;</strong>{armor.map(item => item.toTitleCase()).join(', ')}</p>)
    info.push(<p key={uuid()}><strong>Permitted Shields:&nbsp;</strong>{shield.map(item => item.toTitleCase()).join(', ')}</p>)
    info.push(<p key={uuid()}><strong>Proficiencies:&nbsp;</strong>{proficiencies}</p>)
    info.push(<p key={uuid()}><strong>Penalty To Hit:&nbsp;</strong>{penalty_to_hit}</p>)
    return info
  }

  const renderAbilities = () => {
    let { abilities } = classObj
    let lvlOneAbilities = abilities.filter(abil => abil.level <= 1)
    let final = []
    for (let abil of lvlOneAbilities) {
      final.push(
        <List.Item key={uuid()}>
          <Icon name='triangle right' />
          <List.Content>
            <List.Header>{abil['ability'].toTitleCase()}</List.Header>
            <List.Description>{abil['description']}</List.Description>
          </List.Content>
        </List.Item>
      )
    }
    return <List>{final}</List>
  }

  const createClassSummary = () => {
    let summary = classObj.summary.split('\n').map(obj => {
      return <p key={uuid()}>{obj}</p>
    })

    return (
      <Container style={{padding: '0px 15px'}}>
      <Grid padded style={{fontSize: '0.9rem'}}>
        <Grid.Row columns={1}>
          <Container>
            <Header as='h2'>{class_.toTitleCase()}</Header>
            {summary}
          </Container>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Container style={{margin: '0px', padding: '0px'}}>
              {renderClassInfo()}
            </Container>
          </Grid.Column>
          <Grid.Column style={{fontSize: '.8rem'}}>
            <Header as='h4' textAlign='center'>Choose Alignment<span className={styles.asterisk}>&nbsp;*</span></Header>
            <AlignmentTable
              selected={formData.alignment}
              permitted={classObj.restrictions.alignment}
              handleClick={setAlignment}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Header as='h3' content={`${class_.toTitleCase()} Abilities`} />
            {renderAbilities()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      </Container>
    )
  }

  return (
    <Segment raised>
      <Header as='h1' content='Choose a Class'/>
      <div></div>
      {raceObj.permitted_classes
       ?<Menu attached='top' tabular className={styles.wrapped}>
        <Menu.Item disabled={!raceObj.permitted_classes.includes('assassin')} name='assassin' active={class_ === 'assassin'} onClick={handleTabClick} />
        <Menu.Item disabled={!raceObj.permitted_classes.includes('cleric')} name='cleric' active={class_ === 'cleric'} onClick={handleTabClick} />
        <Menu.Item disabled={!raceObj.permitted_classes.includes('druid')} name='druid' active={class_ === 'druid'} onClick={handleTabClick} />
        <Menu.Item disabled={!raceObj.permitted_classes.includes('fighter')} name='fighter' active={class_ === 'fighter'} onClick={handleTabClick} />
        <Menu.Item disabled={!raceObj.permitted_classes.includes('illusionist')} name='illusionist' active={class_ === 'illusionist'} onClick={handleTabClick} />
        <Menu.Item disabled={!raceObj.permitted_classes.includes('magic_user')} name='magic_user' active={class_ === 'magic_user'} onClick={handleTabClick} />
        <Menu.Item disabled={!raceObj.permitted_classes.includes('paladin')} name='paladin' active={class_ === 'paladin'} onClick={handleTabClick} />
        <Menu.Item disabled={!raceObj.permitted_classes.includes('ranger')} name='ranger' active={class_ === 'ranger'} onClick={handleTabClick} />
        <Menu.Item disabled={!raceObj.permitted_classes.includes('thief')} name='thief' active={class_ === 'thief'} onClick={handleTabClick} />
      </Menu>
      : <Loader />
}
      <Container style={{padding: '25px'}}>
      <Grid divided>
        <Grid.Row columns={2} style={{height: '60vh'}}>
          <Grid.Column width={5}>
            <div style={{overflow: 'hidden', height: '400px'}}>
            <Image src={`/class-images/${formData.class_}.jpg`} fluid alt={`Picture of ${formData.class_}`}/>
            </div>
          </Grid.Column>
          <Grid.Column width={11} style={{overflowY: 'scroll', maxHeight: '380px'}}>
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