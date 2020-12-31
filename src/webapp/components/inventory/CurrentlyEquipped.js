import React, { useContext } from 'react'
import { CharacterContext } from '../../contexts/CharacterContext'
import uuid from 'react-uuid'

import { Container, Segment, Header, Table, Button } from 'semantic-ui-react'

const CurrentlyEquipped = () => {
  const { character: char, dispatch: charDispatch } = useContext(CharacterContext)

  const weaponsTable = () => {
    if (char.inventory == null) {
      return <Header as='h3'>Buy some equipment!</Header>
    }

    let { inventory: { equipped_weapons: ew } } = char
    let rows = []

    for (let key of Object.keys(ew)) {
      rows.push(
        <Table.Row key={uuid()}>
          <Table.Cell>{key.toTitleCase()}</Table.Cell>
          <Table.Cell>{ew[key].name ? ew[key].name.toTitleCase() : ''}</Table.Cell>
          <Table.Cell>{ew[key].dmg_sm_md || ''}</Table.Cell>
          <Table.Cell>{ew[key].dmg_lg || ''}</Table.Cell>
          <Table.Cell>{ew[key].range || ''}</Table.Cell>
          <Table.Cell>{ew[key].rate_of_fire || ''}</Table.Cell>
        </Table.Row>
      )
    }
    return (
      <Table definition>
        <Table.Header>
          <Table.Row key={uuid()}>
            <Table.HeaderCell />
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Dmg Sm-Md</Table.HeaderCell>
            <Table.HeaderCell>Dmg Lg</Table.HeaderCell>
            <Table.HeaderCell>Range</Table.HeaderCell>
            <Table.HeaderCell>Rate of Fire</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows}
        </Table.Body>
      </Table>
    )
  }

  return (
    <Container fluid>
      <Segment>
        {weaponsTable()}
      </Segment>
    </Container>
  )
}

export default CurrentlyEquipped