import React from 'react'
import uuid from 'react-uuid'

import { List, Icon } from 'semantic-ui-react'
import { getRandInt } from './diceRolls'

export const getStartingHP = (className, hitDie) => {
  let number = Number(hitDie.replace(/d/g, ''))
  let startHP = (className === 'ranger') ? number*2 : number
  return startHP
}

export const getListFromKeys = (obj, keyArr, props) => {
  let list = []
  for (let k of keyArr) {
    list.push(
      <List.Item key={uuid()}>
        {(props && props.icon) && <Icon name={props.icon} />}
        <List.Content>
          <List.Header>{k.replace(/_/g, ' ').toTitleCase()}</List.Header>
          <List.Description>{obj[k]}</List.Description>
        </List.Content>
      </List.Item>
    )
  }
  return <List key={uuid()} {...props}>{list}</List>
}

export const formatRaceName = (raceStr) => {
  return raceStr.split('_').map(word => {
    return word.toTitleCase()
  }).join('-')
}

export const getPurse = (gold) => {
  return gold
}

export const disableEnterKey = (e) => {
  e.key === 'Enter' && e.preventDefault()
}