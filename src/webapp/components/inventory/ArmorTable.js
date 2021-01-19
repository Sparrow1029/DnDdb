import React, { useReducer, useContext, useState } from 'react'
import uuid from 'react-uuid'
import { CharacterContext } from '../../contexts/CharacterContext'

import { getMaxPurchase, available } from '../../utils/characterSheet'
import { fmtCost } from '../../utils/formatting'
import { equipmentStoreReducer } from '../../reducers/sortReducers'

import BuyModal from './BuyModal'
import { Table, Container, Modal } from 'semantic-ui-react'

const ArmorTable = ({ coll, permitted }) => {
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
      let { name, encumbrance, max_move, ac, cost } = obj
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
          <Table.Cell width={4}>{name.toTitleCase()}</Table.Cell>
          <Table.Cell width={3}>{`${encumbrance} lbs.`}</Table.Cell>
          <Table.Cell width={3}>{`${max_move} ft.`}</Table.Cell>
          <Table.Cell width={2}>{ac}</Table.Cell>
          <Table.Cell width={4}>{fmtCost(cost)}</Table.Cell>
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
                width={4}
                sorted={column === 'name' ? direction : null}
                onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'name' })}
              >
                Name
              </Table.HeaderCell>
              <Table.HeaderCell
                width={3}
                sorted={column === 'encumbrance' ? direction : null}
                onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'encumbrance' })}
              >
                Encumbrance
              </Table.HeaderCell>
              <Table.HeaderCell
                width={3}
                sorted={column === 'max_move' ? direction : null}
                onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'max_move' })}
              >
                Max Move Rate
              </Table.HeaderCell>
              <Table.HeaderCell
                width={2}
                sorted={column === 'ac' ? direction : null}
                onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'ac' })}
              >
                AC Adjustment
              </Table.HeaderCell>
              <Table.HeaderCell
                width={4}
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
        <BuyModal obj={selObj} objCategory={'armor'} max={curMax} step={step} closeFromInside={() => setOpen(false)}/>
      </Modal>
    </Container>
  )
}

export default ArmorTable