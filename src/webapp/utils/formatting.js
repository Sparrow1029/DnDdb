import React from 'react'
import uuid from 'react-uuid'

import { List, Icon } from 'semantic-ui-react'
import { coinsFromFloat } from '../reducers/coinReducer'

export const getStartingHP = (className, hitDie) => {
  let number = Number(hitDie.replace(/d/g, ''))
  let startHP = (className === 'ranger') ? number * 2 : number
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

export const disableEnterKey = (e) => {
  e.key === 'Enter' && e.preventDefault()
}

export const fmtCost = ({gp, sp, cp, ep, pp, amtPer}) => {
  // let { gp, sp, cp } = coinsFromFloat(coin)

  // let gold = (coins.gp !== 0) ? `${coins.gp} gp` : ''
  // let silver = (coins.sp !== 0) ? `${coins.sp} sp` : ''
  // let copper = (coins.cp !== 0) ? `${coins.cp} cp` : ''

  if (gp == 0 && sp == 0 && cp == 0) return <p>Free</p>

  return (
    <div style={{ display: 'inline-block' }}>
      {gp !== 0
        // ? <>{gp}&nbsp;GP&nbsp;<Icon name='circle thin' size='small' color='yellow'/>{amtPer > 1 ? ` (per ${amtPer})` : ''}</>
        ? <><Icon name='circle thin' size='small' color='yellow'/>{gp}&nbsp;gp&nbsp;{amtPer > 1 ? ` (per ${amtPer})` : ''}</>
        : <></>
      }
      {sp !== 0
        // ? <>{sp}&nbsp;SP&nbsp;<Icon name='circle thin' size='small' style={{color: '#b0b1b2'}} />{amtPer > 1 ? ` (per ${amtPer})` : ''}</>
        ? <><Icon name='circle thin' size='small' style={{color: '#b0b1b2'}} />{sp}&nbsp;sp&nbsp;{amtPer > 1 ? ` (per ${amtPer})` : ''}</>
        : <></>
      }
      {cp !== 0
        // ? <>{cp}&nbsp;CP&nbsp;<Icon name='circle thin' size='small' color='brown'/>{amtPer > 1 ? ` (per ${amtPer})` : ''}</>
        ? <><Icon name='circle thin' size='small' color='brown'/>{cp}&nbsp;cp&nbsp;{amtPer > 1 ? ` (per ${amtPer})` : ''}</>
        : <></>
      }
    </div>
  )

  // return gold + `${(silver !== '' && gold !== '') ? ', ' : ''}` + silver + `${(copper !== '') ? ', ' : ''}` + copper
}