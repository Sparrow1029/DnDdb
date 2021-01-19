import React, { useReducer, useContext, useState } from 'react'
import uuid from 'react-uuid'
import { CharacterContext } from '../../contexts/CharacterContext'

import { getMaxPurchase, available } from '../../utils/characterSheet'
import { fmtCost } from '../../utils/formatting'
import { equipmentStoreReducer } from '../../reducers/sortReducers'

import BuyModal from './BuyModal'
import { Table, Container, Modal } from 'semantic-ui-react'

const ItemTable = ({ coll }) => {
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
  const { character } = useContext(CharacterContext)

  const rows = () => {
    let rows=[]
    for (let obj of data) {
      let { name, encumbrance, cost } = obj
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
          <Table.Cell width={6}>{name.toTitleCase()}</Table.Cell>
          <Table.Cell width={5}>{(encumbrance > 0) ? `${encumbrance} lbs.` : '-'}{cost.amtPer > 1 ? ` (per ${cost.amtPer})` : ''}</Table.Cell>
          <Table.Cell width={5}>{fmtCost(cost)}</Table.Cell>
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
                width={6}
                sorted={column === 'name' ? direction : null}
                onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'name' })}
              >
                Name
              </Table.HeaderCell>
              <Table.HeaderCell
                width={5}
                sorted={column === 'encumbrance' ? direction : null}
                onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'encumbrance' })}
              >
                Encumbrance
              </Table.HeaderCell>
              <Table.HeaderCell
                width={5}
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
        <BuyModal obj={selObj} objCategory={'items'} max={curMax} step={step} closeFromInside={() => setOpen(false)}/>
      </Modal>
    </Container>
  )
}

export default ItemTable