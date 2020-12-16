import React, { useReducer, useContext, useState } from 'react'
import uuid from 'react-uuid'
import { CharacterContext } from '../../contexts/CharacterContext'

import { getMaxPurchase, available } from '../../utils/characterSheet'
import { fmtCost } from '../../utils/formatting'
import { equipmentStoreReducer } from '../../reducers/sortReducers'

import BuyModal from './BuyModal'
import { Table, Container, Modal } from 'semantic-ui-react'

const WeaponTable = ({ coll, permitted }) => {
  const [selObj, setSelObj] = useState(null)
  const [curMax, setCurMax] = useState(1)
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [state, dispatch] = useReducer(equipmentStoreReducer, {
    column: null,
    data: coll,
    direction: null
  })
  const { column, data, direction } = state
  const { character } =  useContext(CharacterContext)

  const rows = () => {
    let rows=[]
    for (let obj of data) {
      let { name, dmg_sm_md, dmg_lg, encumbrance, cost, rate_of_fire, range, sub_category } = obj
      let maxValue = getMaxPurchase(obj, character)

      rows.push(
        <Table.Row key={uuid()}
          disabled={!available(obj, character)}
          negative={!available(obj, character)}
          onClick={() => {
            setSelObj(obj);
            setCurMax(maxValue);
            setOpen(true)
            setStep(cost.amtPer || 1)
          }}>
          <Table.Cell>{name.toTitleCase()}</Table.Cell>
          <Table.Cell>{sub_category.toTitleCase()}</Table.Cell>
          <Table.Cell>{dmg_sm_md}</Table.Cell>
          <Table.Cell>{dmg_lg}</Table.Cell>
          <Table.Cell>{rate_of_fire || '-'}</Table.Cell>
          <Table.Cell>{range ? range + ' ft.' : '-'}</Table.Cell>
          <Table.Cell>{`${encumbrance} lbs.`}{cost.amtPer > 1 ? ` (per ${cost.amtPer})` : ''}</Table.Cell>
          <Table.Cell>{fmtCost(cost)}</Table.Cell>
        </Table.Row>
      )
    }
    return rows
  }

  return (
    <Container>
      <div style={{height: '75vh', overflow: 'scroll'}}>
        <Table compact='very' fixed unstackable sortable selectable>
          <Table.Header>
            <Table.Row key={uuid()}>
              <Table.HeaderCell
                sorted={column === 'name' ? direction : null}
                onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'name' })}
              >
                Name
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'sub_category' ? direction : null}
                onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'sub_category' })}
              >
                Category
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'dmg_sm_md' ? direction : null}
                onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'dmg_sm_md' })}
              >
                Dmg vs Sm-Md
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'dmg_lg' ? direction : null}
                onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'dmg_lg' })}
              >
                Dmg vs Lg
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'rate_of_fire' ? direction : null}
                onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'rate_of_fire' })}
              >
                Rate of Fire
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'range' ? direction : null}
                onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'range' })}
              >
                Range
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'encumbrance' ? direction : null}
                onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'encumbrance' })}
              >
                Encumbrance
              </Table.HeaderCell>
              <Table.HeaderCell
                textAlign='center'
                sorted={column === 'cost' ? direction : null}
                onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'cost' })}
              >
                Cost
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {rows()}
          </Table.Body>
        </Table>
      </div>
      <Modal open={open} closeOnDimmerClick={true} closeIcon onClose={() => setOpen(false)}>
        <BuyModal obj={selObj} objCategory={'weapons'} max={curMax} step={step} closeFromInside={() => setOpen(false)}/>
      </Modal>

    </Container>
  )
}

export default WeaponTable