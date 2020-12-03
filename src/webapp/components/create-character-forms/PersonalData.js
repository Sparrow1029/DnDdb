import React, { useContext } from 'react'
import { ClassesContext } from '../../contexts/class'
// import styles from '../../styles/Global.module.css'

import { rollStat, rollHP } from '../../utils/diceRolls'

import { Form, Icon, Segment, Header, Button, Grid } from 'semantic-ui-react'

const genderOptions = [
  { key: 'male', text: 'Male', value: 'male', icon: 'man', },
  { key: 'female', text: 'Female', value: 'female', icon: 'woman', },
]

const PersonalData = ({ setForm, formData, navigation }) => {
  const { name, gender, race } = formData
  const { next, previous } = navigation
  // TODO: get the current class as a prop/context object instead of this thing
  const classObj = useContext(ClassesContext)[0]
    .filter(obj => {
    return obj.name === formData.class_
  })[0]

  const updateGender = (event, data) => {
    // react-hooks-helper `useForm()` only deconstructs the `target` property from an
    // event. For Dropdowns/selections/etc, the event AND data objects are sent to the callback function.
    let updateData = { target: { name: data.name, value: data.value } }
    setForm(updateData)
  }

  const rollHPForMe = () => {
    let hitDie = Number( classObj.restrictions.hit_die.replace(/d/g, '') )
    let numDice = classObj.name === 'ranger' ? 2 : 1
    let HP = rollHP(numDice, hitDie)
    setForm({ target: { name: 'max_hp', value: HP } })
  }

  const rollStatsForMe = () => {
    for (let i of ['str', 'dex', 'con', 'int', 'wis', 'cha']) {
      setForm({ target: { name: `base_stats.${i}`, value: rollStat() } })
    }
  }

  const setNum = (event) => {
    let { value } = event.target
    value = Number(value)
    if (!isNaN(value) && Number.isInteger(value) && value <= 20 && value >= 0){
      setForm(event)
    }
  }

  return (
    <Segment raised>
      <Header as='h1' content='Personal Info'/>
      <div style={{height: '69.5vh'}}>
      <Form style={{padding: '20px'}}>
        <Form.Group>
          <Form.Input
            label='Name'
            placeholder='Character Name'
            name='name'
            value={name}
            onChange={setForm}
            width={12}
          />
          <Form.Dropdown
            selection
            width={6}
            label='Gender'
            name='gender'
            value={formData.gender}
            options={genderOptions}
            onChange={updateGender}
          />
        </Form.Group>
        <Grid>
          <Grid.Row centered>
            <Grid.Column style={{overflow: "scroll"}}>
              <Header as='h3'>
                Base Scores
                <Header.Subheader>
                  Use the 'Roll' button or roll your own dice! Dm's discretion
                </Header.Subheader>
              </Header>
              <Form.Group widths={2}>
                <Form.Input
                  size='small'
                  label='Str'
                  name='base_stats.str'
                  value={formData.base_stats.str}
                  onChange={setNum}
                  transparent
                />
                <Form.Input
                  size='small'
                  label='Dex'
                  name='base_stats.dex'
                  value={formData.base_stats.dex}
                  onChange={setNum}
                  transparent
                />
                <Form.Input
                  size='small'
                  label='Con'
                  name='base_stats.con'
                  value={formData.base_stats.con}
                  onChange={setNum}
                  transparent
                />
                <Form.Input
                  size='small'
                  label='Int'
                  name='base_stats.int'
                  value={formData.base_stats.int}
                  onChange={setNum}
                  transparent
                />
                <Form.Input
                  size='small'
                  label='Wis'
                  name='base_stats.wis'
                  value={formData.base_stats.wis}
                  onChange={setNum}
                  transparent
                />
                <Form.Input
                  size='small'
                  label='Cha'
                  name='base_stats.cha'
                  value={formData.base_stats.cha}
                  onChange={setNum}
                  transparent
                />
                <Button icon onClick={rollStatsForMe}>
                  <Icon name='star'/>
                  &nbsp;Roll
                </Button>
              </Form.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <Button onClick={previous}>Previous</Button>
        <Button onClick={next}>Next</Button>
      </div>
    </Segment>
  )
}

export default PersonalData