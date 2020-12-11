import React, { useEffect, useState, useContext } from 'react'
import {
  Container, Segment, Table, Button, Header, Icon, Form, Input
} from 'semantic-ui-react'
import uuid from 'react-uuid'

import WeaponTable from './inventory/WeaponTable'
import { StoreContext } from '../contexts/StoreContext'

function EquipmentStore ({ character: char }) {
  const [store, _] = useContext(StoreContext)
  const [filtered, setFiltered] = useState([])

  useEffect(() => {
    console.log(store)
    console.log(char)
  }, [])

  const createTable = (collection) => {
    let headerCells = []
    for (let key of Object.keys(collection[0])) {
      if (key === 'id') continue
      headerCells.push(
        <React.Fragment key={uuid()}>
          <Table.HeaderCell>
            {key.toTitleCase()}
          </Table.HeaderCell>
        </React.Fragment>
      )
    }
    let header = <Table.Row key={uuid()}>{headerCells}</Table.Row>
    let rows = []
    for (let obj of collection) {
      let cells = []
      for (let key of Object.keys(obj)) {
        if (key === 'id') continue
        cells.push(
          <React.Fragment key={uuid()}>
            <Table.Cell>{obj[key].toTitleCase()}</Table.Cell>
          </React.Fragment>
        )
      }
      rows.push(<Table.Row key={uuid()}>{cells}</Table.Row>)
    }
    return (
      <Table>
        <Table.Header>{header}</Table.Header>
        <Table.Body>{rows}</Table.Body>
      </Table>
    )
  }

  const filterData = ({ target }) => {
    console.log(target)
  }

  return (
    <Container>
      <Header as='h2'>Equipment</Header>
      {createTable(store.armor)}
      <WeaponTable />
    </Container>
  )
}

export default EquipmentStore