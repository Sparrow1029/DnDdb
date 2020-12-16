import React from 'react'
import {
  Segment, Table, Header
} from 'semantic-ui-react'

const CharEquipment = ({ inventory }) => {
  console.log(inventory)
  return (
    <Segment>
      <Header as='h2'>
        Character Equipment
        <Header.Subheader>Stuff n things</Header.Subheader>
      </Header>
    </Segment>
  )
}

export default CharEquipment