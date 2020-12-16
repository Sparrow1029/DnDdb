import React, { useState, useContext, useEffect } from 'react';
import { CharacterContext } from '../../contexts/CharacterContext'
import { coinsToFloat, coinsFromFloat } from '../../reducers/coinReducer'
import { fmtCost } from '../../utils/formatting'

import { Loader, Container, Header, Form, Button } from 'semantic-ui-react'
import { Slider } from 'react-semantic-ui-range'

const BuyModal = ({ obj, objCategory, max, step, closeFromInside }) => {
  const { character, dispatch } = useContext(CharacterContext)
  const [value, setValue] = useState(1)
  const [coinDelta, setCoinDelta] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!character) {
      setLoading(true)
    } else {
      setLoading(false)
      changeCoin(value)
    }
  }, [])

  const changeCoin = (val) => {
    let newDelta = coinsToFloat(character.money) - (coinsToFloat(obj.cost) * Math.floor(val / obj.cost.amtPer))
    setCoinDelta(fmtCost(coinsFromFloat(newDelta)))
  }

  const settings = {
    start: 1,
    min: 0,
    max,
    step: (step !== undefined) ? step : 1,
    onChange: value => {
      setValue(value)
      changeCoin(value)
    }
  }

  const submitPurchase = (e) => {
    e.preventDefault()
    let totalCost = coinsToFloat(obj.cost) * Math.floor(value / obj.cost.amtPer)
    let submitObj = {
      type: 'ADD_INVENTORY', item: obj, amt: value, totalCost, location: objCategory
    }
    console.log(submitObj)
    dispatch(submitObj)
    closeFromInside()
  }

  return (
    <Container style={{padding: '25px'}}>
      {loading
      ? <Loader size='massive' />
      : <>
        <Header as='h2'>
          {obj.name.toTitleCase()}
          <Header.Subheader>Gold after purchase: {coinDelta}</Header.Subheader>
        </Header>
        <Form>
          <Form.Group inline>
            <Form.Field width={16}>
              <label>How many?</label>
              <Slider value={value} settings={settings} color='blue' style={{width: '500px'}}/>
              {value}
            </Form.Field>
          </Form.Group>
          <Button onClick={submitPurchase}>Buy</Button>
        </Form>
        </>
      }
    </Container>
  )
}

export default BuyModal