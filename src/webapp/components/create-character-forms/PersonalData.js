import React from 'react'

import { Form, Segment, Header, Button } from 'semantic-ui-react'

const genderOptions = [
  { key: 'male', text: 'Male', value: 'male', icon: 'man', },
  { key: 'female', text: 'Female', value: 'female', icon: 'woman', },
]

const PersonalData = ({ setForm, formData, navigation }) => {
  const { name, gender, race } = formData

  const updateGender = (event, data) => {
    // react-hooks-helper `useForm()` only deconstructs the `target` property from an
    // event. For Dropdowns/selections/etc, the event AND data objects are sent to the callback function.
    let updateData = { target: { name: data.name, value: data.value } }
    setForm(updateData)
  }

  const { next, previous } = navigation

  return (
    <Segment>
      <Header as='h1' content='Personal Info' style={{textAlign: 'center'}}/>
      <Form>
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
      </Form>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <Button onClick={previous}>Previous</Button>
        <Button onClick={next}>Next</Button>
      </div>
    </Segment>
  )
}

export default PersonalData