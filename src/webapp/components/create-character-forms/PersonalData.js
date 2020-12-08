import React, { useEffect, useState } from 'react'

import { rollMultiple, rollStat, rollStartingGold, rollStartingAge, getSize, rollHeight } from '../../utils/diceRolls'
import { disableEnterKey } from '../../utils/formatting'

import { Form, Input, Icon, Segment, Header, Button, Grid, Container} from 'semantic-ui-react'
import styles from '../../styles/Responsive.module.css'

const genderOptions = [
  { key: 'male', text: 'Male', value: 'male', icon: 'man', },
  { key: 'female', text: 'Female', value: 'female', icon: 'woman', }, ]

const PersonalData = ({ setForm, formData, navigation, ...props }) => {
  const { name, gender, race } = formData
  const { next, previous } = navigation // TODO: get the current class as a prop/context object instead of this thing
  const { classObj, raceObj } = props
  const [ sizeDesc, setSizeDesc ] = useState("Normal")

  useEffect(() => {
    // console.log("rerendering personal page")
    rollSizeForMe()
  }, [raceObj])

  /* Debug function */
  // const showMe = () => { console.dir(formData) }

  const updateGender = (_, data) => {
    // react-hooks-helper `useForm()` only deconstructs the `target` property from an
    // event. For Dropdowns/selections/etc, the event AND data objects are sent to the callback function.
    let updateData = { target: { name: data.name, value: data.value } }
    setForm(updateData)
    let sizes = raceObj.sizes[data.value]
    let normalKey = Object.keys(sizes)[2]
    let roll = Number(normalKey.split('-'))[0] + 1
    let { ft, in: in_, weight, size } = getSize(raceObj.sizes, data.value, roll)
    // roll height with 1d4
    let { feet, inches } = rollHeight(ft, in_)
    setForm({ target: { name: 'height.ft', value: feet }})
    setForm({ target: { name: 'height.in', value: inches } })
    let calcWeight = Number(rollMultiple(20, 1, Number(weight)))
    setForm({target: { name: 'weight', value: calcWeight }})
    setSizeDesc(size)
  }

  const rollStatsForMe = () => {
    for (let i of ['str', 'dex', 'con', 'int', 'wis', 'cha']) {
      setForm({ target: { name: `base_stats.${i}`, value: rollStat() } })
    }
  }

  const rollGoldForMe = () => {
    let amt = rollStartingGold(formData.class_)
    setForm({ target: { name: 'gold', value: amt } })
  }

  const rollAgeForMe = () => {
    let { age, die } = raceObj.starting_ages[classObj.name]
    setForm({ target: { name: 'age', value: rollStartingAge(age, die) } })
  }

  const rollSizeForMe = () => {
    let { ft, in: in_, weight, size } = getSize(raceObj.sizes, formData.gender)
    let { feet, inches } = rollHeight(ft, in_)
    setForm({ target: { name: 'height.ft', value: feet }})
    setForm({ target: { name: 'height.in', value: inches } })
    let calcWeight = Number(rollMultiple(20, 1, Number(weight)))
    setForm({target: { name: 'weight', value: calcWeight }})
    setSizeDesc(size)
  }

  const setFormInt = (event) => {
    let { value, max, min } = event.target
    max = (max !== null && max !== undefined) ? max : 0
    min = (min !== null && min !== undefined) ? min : 400
    value = Number(value)
    if (!isNaN(value) && Number.isInteger(value) && value <= max && value >= min) {
      setForm(event)
    }
  }

  return (
    <Segment raised>
      <Header as='h1' content='Personal Attributes' style={{margin: '10px'}}/>
      {/*<div style={{height: '69.5vh'}}>*/}
      <Container fluid>
        <Header as='h3'>
          Base Scores
          <Header.Subheader>
            Use the 'Roll' button or roll your own dice! DM's discretion
          </Header.Subheader>
        </Header>
        <Form onKeyPress={disableEnterKey}>
          <Form.Group widths={2} unstackable>
            <Form.Input
              size='small'
              label='Strength'
              name='base_stats.str'
              value={formData.base_stats.str}
              min={0} max={19}
              onChange={setFormInt}
              transparent
            />
            <Form.Input
              size='small'
              label='Dexterity'
              name='base_stats.dex'
              value={formData.base_stats.dex}
              min={0} max={19}
              onChange={setFormInt}
              transparent
            />
            <Form.Input
              size='small'
              label='Constitution'
              name='base_stats.con'
              value={formData.base_stats.con}
              min={0} max={19}
              onChange={setFormInt}
              transparent
            />
            <Form.Input
              size='small'
              label='Inteligence'
              name='base_stats.int'
              value={formData.base_stats.int}
              min={0} max={19}
              onChange={setFormInt}
              transparent
            />
            <Form.Input
              size='small'
              label='Wisdom'
              name='base_stats.wis'
              value={formData.base_stats.wis}
              min={0} max={19}
              onChange={setFormInt}
              transparent
            />
            <Form.Input
              size='small'
              label='Charisma'
              name='base_stats.cha'
              value={formData.base_stats.cha}
              min={0} max={19}
              onChange={setFormInt}
              transparent
            />
            <Button icon onClick={rollStatsForMe}>
              <Icon name='star'/>
              &nbsp;Roll
            </Button>
          </Form.Group>
          <Form.Group onKeyPress={disableEnterKey}>
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
          <Form.Group widths='equal' onKeyPress={disableEnterKey}>
            <Form.Field onChange={setFormInt}>
              <label>Weight</label>
              <Input fluid
                label={{ basic: true, content: 'lbs' }}
                labelPosition='right'
                placeholder="Max 400 lbs."
                value={formData.weight}
                max={200}
                name='weight'
              />
            </Form.Field>
            <Form.Field onChange={setFormInt}>
              <label>Height</label>
              <Input fluid
                label={{ basic: true, content: 'ft' }}
                placeholder="Max 400 lbs."
                labelPosition='right'
                max={7}
                name='height.ft'
                value={formData.height.ft}
              />
            </Form.Field>
            <Form.Field onChange={setFormInt}>
              <label>&nbsp;</label>
              <Input fluid
                width={3}
                label={{ basic: true, content: 'in' }}
                max={11}
                labelPosition='right'
                name='height.in'
                value={formData.height.in}
              />
            </Form.Field>
            <Form.Field>
              <label style={{color: '#d9dadb'}}>&nbsp;{`"${sizeDesc}"`}</label>
              <Button icon onClick={rollSizeForMe} style={{marginRight: '0'}}>
                <Icon name='star'/>
                &nbsp;Roll
              </Button>
            </Form.Field>
            <Form.Field onChange={setFormInt}>
              <label>Start Age</label>
              <Input fluid
                width={8}
                label={{ basic: true, content: 'years' }}
                max={1200}
                labelPosition='right'
                name='age'
                value={formData.age}
              />
            </Form.Field>
            <Form.Field>
              <label>&nbsp;</label>
              <Button icon onClick={rollAgeForMe}>
                <Icon name='star'/>
                &nbsp;Roll
              </Button>
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field onChange={setForm}>
              <label>Starting Gold</label>
              <Input
                size='small'
                name='gold'
                value={formData.gold}
              />
            </Form.Field>
            <Form.Field>
              <label>&nbsp;</label>
              <Button size='small' icon onClick={rollGoldForMe}>
                <Icon name='star'/>
                &nbsp;Roll
              </Button>
            </Form.Field>
          </Form.Group>
        </Form>
      </Container>
      {/*</div>*/}
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <Button onClick={previous}>Previous</Button>
        <Button onClick={next}>Review</Button>
      </div>
    </Segment>
  )
}

export default PersonalData