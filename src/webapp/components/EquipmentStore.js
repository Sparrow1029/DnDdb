import React, { useEffect, useState, useContext } from 'react'
import {
  Container, Loader, Segment, Table, Button, Header, Menu, Icon, Form, Input
} from 'semantic-ui-react'
import uuid from 'react-uuid'

import WeaponTable from './inventory/WeaponTable'
import ItemTable from './inventory/ItemTable'
import ArmorTable from './inventory/ArmorTable'
import { StoreContext } from '../contexts/StoreContext'
import { CharacterContext } from '../contexts/CharacterContext'
import { CartContext } from '../contexts/CartContext'
import { fmtCost } from '../utils/formatting'

function EquipmentStore() {
  const [store, _] = useContext(StoreContext)
  const { character: char, dispatch: charDispatch } = useContext(CharacterContext)
  const { dispatch } = useContext(CartContext)
  // const [filtered, setFiltered] = useState([])
  const [currentMenu, setCurrentMenu] = useState('equipment')
  const [selectedRows, updateSelected] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    if (char !== undefined) {
      setLoading(false)
    }
  }, [currentMenu])

  const menuSelect = (e, { name }) => {
    setCurrentMenu(name)
  }

  const addToCart = (e, item) => {
    e.preventDefault()
    // console.log(item.value)
    dispatch({ type: 'add', item })
  }

  const filterData = ({ target }) => {
    // TODO: Create a search filter for items
    console.log(target)
  }

  return (
    <>{(loading && !char)
    ? <Loader size='massive' />
    :<Container fluid>
      <Menu pointing secondary>
        <Menu.Item
          name='equipment'
          active={currentMenu === 'equipment'}
          onClick={menuSelect}
        />
        <Menu.Item
          name='weapons'
          active={currentMenu === 'weapons'}
          onClick={menuSelect}
        />
        <Menu.Item
          name='armor'
          active={currentMenu === 'armor'}
          onClick={menuSelect}
        />
        <Menu.Item
          name='gold'
          position='right'
          style={{paddingRight: '50px'}}
        // >Current gold:&nbsp;&nbsp;{fmtCost(char.money)}</Menu.Item>
        >Current gold:&nbsp;&nbsp;{fmtCost(char.money)}</Menu.Item>
      </Menu>
      {currentMenu === 'equipment' &&
      <Container>
        <Header as='h2'>Equipment</Header>
        <ItemTable coll={store.items}/>
      </Container>
      }
      {currentMenu === 'weapons' &&
      <Container>
        <Header as='h2'>Weapons</Header>
        <WeaponTable coll={store.weapons} permitted={true} />
      </Container>
      }
      {currentMenu === 'armor' &&
      <Container>
        <Header as='h2'>Armor</Header>
        <ArmorTable coll={store.armor} permitted={true} />
      </Container>
      }
    </Container>
    }</>
  )
}

export default EquipmentStore