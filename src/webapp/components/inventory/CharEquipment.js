import React, { useContext, useState } from 'react'
import { CharacterContext } from '../../contexts/CharacterContext'
import uuid from 'react-uuid'

import { Container, Segment, Header, Table, Button, Modal } from 'semantic-ui-react'

const CharEquipment = () => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [equipSection, setEquipSection] = useState('')
  const { character: char, dispatch } = useContext(CharacterContext)

  const equip = (e, { value }) => {
    dispatch({
      type: 'EQUIP', item: selected,
      section: equipSection, location: value
    })
    setEquipSection('')
    setOpen(false)
  }

  const inventoryTable = () => {
    let { inventory: { equipment: { armor, items, weapons } } } = char
    let itemTable = items.map(item => {
      return (
        <Table.Row key={uuid()}>
          <Table.Cell>{item.name.capitalFirstChar()}</Table.Cell>
          <Table.Cell>{item.amt}</Table.Cell>
        </Table.Row>
      )
    })
    let armorTable = armor.map(armor => {
      return (
        <Table.Row key={uuid()}
          onClick={() => {
            setEquipSection('equipped_armor');
            setSelected(armor);
            setOpen(true)
          }}
        >
          <Table.Cell>{armor.name.capitalFirstChar()}</Table.Cell>
          <Table.Cell>{armor.amt}</Table.Cell>
        </Table.Row>
      )
    })
    let weaponTable = weapons.map(weapon => {
      return (
        <Table.Row key={uuid()}
          onClick={() => {
            setEquipSection('equipped_weapons');
            setSelected(weapon);
            console.log(weapons);
            console.log(selected)
            setOpen(true)
          }}>
          <Table.Cell>{weapon.name.capitalFirstChar()}</Table.Cell>
          <Table.Cell>{weapon.amt}</Table.Cell>
        </Table.Row>
      )
    })
    return (
      <Table unstackable selectable>
        <Table.Header>
          <Table.Row key={uuid()}>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {itemTable}
          {armorTable}
          {weaponTable}
        </Table.Body>
      </Table>
    )
  }

  return (
      <Segment>
        <Header as='h2'>
          Character Equipment
          <Header.Subheader>All your <strong><em>STUFF</em></strong></Header.Subheader>
        </Header>
        <Container style={{height: '200px', overflowY: 'scroll'}}>
          {inventoryTable()}
        </Container>
        { selected !== null &&
        <Modal
          open={open}
          closeOnDimmerClick
          onClose={() => setOpen(false)}
          size='mini'
        >
          <Segment padded='very'>
            <Header as='h3' textAlign='center'>Equip this item?</Header>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
              {selected == null
              ? FUCK
              : selected.equip_slots.map(slot => {
                  return <Button value={slot} onClick={equip}>{slot.toTitleCase()}</Button>
                }
              )}
            </div>
          </Segment>
        </Modal>
        }
      </Segment>
  )
}

export default CharEquipment