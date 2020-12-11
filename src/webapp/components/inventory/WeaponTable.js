import React from 'react'
import uuid from 'react-uuid'
import coinReducer from '../../reducers/coinReducer'
import { Tab, Table } from 'semantic-ui-react'

const WeaponTable = (collection) => {
  const rows = () => {
    cells = []
  }

  return (
    <>
      <Table compact='very'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Dmg vs Small Medium</Table.HeaderCell>
            <Table.HeaderCell>Dmg vs Large</Table.HeaderCell>
            <Table.HeaderCell>Encumbrance</Table.HeaderCell>
            <Table.HeaderCell>Cost</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell></Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </>
  )
}

export default WeaponTable