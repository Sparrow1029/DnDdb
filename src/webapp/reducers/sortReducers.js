import { Icon } from 'semantic-ui-react'

export const coinsToFloat = ({ gp, sp, cp }) => {
  return gp + (sp/10) + (cp/100)
}

const sortByCost = (a, b) => {
  let aCoin = coinsToFloat(a)
  let bCoin = coinsToFloat(b)
  return bCoin - aCoin
}

const sortByDmg = (a, b) => {
  let [ dmg, extra ] = a.split('+')
  let aDmg = dmg.split('d').map(val => Number(val)).reduce((x, y) => x * y, 1)
  let aBonus = (extra !== undefined) ? Number(extra.split(' ')[0]) : 0

  let [ dmg2, extra2 ] = b.split('+')
  let bDmg = dmg2.split('d').map(val => Number(val)).reduce((x, y) => x * y, 1)
  let bBonus = (extra2 !== undefined) ? Number(extra2.split(' ')[0]) : 0

  return (bDmg + bBonus) - (aDmg + aBonus)
}

export function equipmentStoreReducer(state, action) {
  const nameSorter = item => item.name.toLowerCase()[0]
  const encSorter = item => Number(item.encumbrance)
  const maxMoveSorter = item => Number(item.max_move)

  switch (action.type) {
    case 'CHANGE_SORT':
      if (state.column === action.column) {
        return {
          ...state,
          data: state.data.reverse(),
          direction:
            state.direction === 'ascending' ? 'descending' : 'ascending',
        }
      }

      if (action.column.slice(0, 3) === 'dmg') {
        return {
          column: action.column,
          data: state.data.sort((a, b) => sortByDmg(a[action.column], b[action.column])),
          direction: 'ascending',
        }
      }

      switch (action.column){
        case 'name':
          return {
            column: 'name',
            data: _.sortBy(state.data, [nameSorter]),
            direction: 'ascending',
          }
        case 'cost':
          return {
            column: 'cost',
            data: state.data.sort((a, b) => sortByCost(a.cost, b.cost)),
            direction: 'ascending',
          }
        case 'max_move':
          return {
            column: 'max_move',
            data: _.sortBy(state.data, [maxMoveSorter]),
            direction: 'ascending',
          }
        case 'encumbrance':
          return {
            column: 'encumbrance',
            data: _.sortBy(state.data, [encSorter]),
            direction: 'ascending',
          }
        case 'ac':
        case 'rate_of_fire':
        case 'range':
          return {
            column: action.column,
            data: _.orderBy(state.data, [action.column], ['desc']),
            direction: 'descending',
          }
        default:
          return {
            column: action.column,
            data: _.sortBy(state.data, [action.column]),
            direction: 'ascending',
          }
      }


    default:
      throw new Error()
  }
}
export const getIcon = (state, name) => {
  if (state.column === name) {
    return (<>
    {state.direction === 'ascending'
      ? <Icon name='caret up'/>
      : <Icon name='caret down'/>
    }
    </>)
  }
  return <></>
}