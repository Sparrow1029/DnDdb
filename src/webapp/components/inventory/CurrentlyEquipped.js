import React, { useContext, useState } from 'react'
import { CharacterContext } from '../../contexts/CharacterContext'
import uuid from 'react-uuid'

import { Container, Segment, Header, Table, Popup } from 'semantic-ui-react'

const CurrentlyEquipped = () => {
  const { character: char, dispatch } = useContext(CharacterContext)

  const unequip = (section, location) => {
    dispatch({ type: 'UNEQUIP', section, location })
  }

  const weaponsTable = () => {
    if (char.inventory == null) {
      return <Header as='h3'>Buy some equipment!</Header>
    }

    let { inventory: { equipped_weapons: ew } } = char
    let rows = []

    for (let key of Object.keys(ew)) {
      rows.push(
        <Popup key={uuid()} content='Click to unequip' trigger={
        <Table.Row onClick={() => {unequip('equipped_weapons', key)}}>
          <Table.Cell>{key.toTitleCase()}</Table.Cell>
          <Table.Cell>{(ew[key] != null && ew[key].name != undefined) ? ew[key].name.toTitleCase() : ''}</Table.Cell>
          <Table.Cell>{(ew[key] != null && ew[key].dmg_sm_md != undefined) ? ew[key].dmg_sm_md : ''}</Table.Cell>
          <Table.Cell>{(ew[key] != null && ew[key].dmg_lg != undefined) ? ew[key].dmg_lg : ''}</Table.Cell>
          <Table.Cell>{(ew[key] != null && ew[key].range) ? `${ew[key].range} ft.` : '-'}</Table.Cell>
          <Table.Cell>{(ew[key] != null && ew[key].rate_of_fire) ? `${ew[key].rate_of_fire} per round` : '-'}</Table.Cell>
        </Table.Row>
        }
        />
      )
    }
    return (
      <Table definition selectable>
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