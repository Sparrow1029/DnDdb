import _ from 'lodash';
import save from '../utils/save'

export const coinsToFloat = ({ gp, sp, cp }) => {
  return gp + (sp/10) + (cp/100)
}

export const coinsFromFloat = (gold) => {
  let coins = { gp: 0, sp: 0, cp: 0 }
  let arr = String(gold).split('.')
  coins.gp = Number(arr[0])
  if (arr.length === 1) return coins
  coins.sp = Number(arr[1][0])
  coins.cp = (arr[1][1] !== undefined) ? Number(arr[1][1]) : 0
  return coins
}

const coinReducer = (purse, action) => {
  let newAmt
  switch (action.type) {
    case 'credit':
      newAmt = coinsToFloat(purse) - action.payload
      if (newAmt < 0) {  // don't go into debt yo
        return purse
      }
      return coinsFromFloat(newAmt)
    case 'debit':
      newAmt = coinsToFloat(purse) + action.payload
      return coinsFromFloat(newAmt)
    default:
      return purse
  }
}

const initialInventory = {
  equipment: { weapons: [], items: [], armor: [] },
  equipped_weapons: {
    main_hand: {}, off_hand: {}, ranged: {}, other: []
  },
  equipped_armor: {
    armor: {}, shield: {}, gloves_rings: [], boots_footwear: {}, bracers: {}, capes_cloaks: [], other: []
  }
}

const characterReducer = (char, action) => {
  switch (action.type) {
    case 'SET_CHARACTER':
      save(action.payload)
      return action.payload
    case 'ADD_INVENTORY':
    case 'BUY_ITEM':
      var { item, totalCost, amt, location } = action
      var inventory = (char.inventory !== null) ? char.inventory : initialInventory
      if (amt === 0) {
        return {...char}
      }
      var { item, totalCost, amt, location } = action
      var inventory = (char.inventory !== null) ? char.inventory : initialInventory

      let newMoney = coinReducer(char.money, { type: 'credit', payload: totalCost })
      let index = _.findIndex(inventory.equipment[location], function (o) { return o.id == item.id })
      if (index !== -1) {
        let { amt: oldAmt } = inventory.equipment[location][index]
        let newAmt = oldAmt + amt
        inventory.equipment[location].splice(index, 1, {...item, amt: newAmt })
      } else {
        inventory.equipment[location].push({...item, amt})
      }

      let newChar = {...char, money: newMoney, inventory}
      save(newChar)
      return newChar
    case 'SELL_ITEM':
    case 'REMOVE_INVENTORY':
      break;
    case 'EQUIP_WEAPON':
      inventory = char.inventory
      inventory.equipped_weapons[location] = item
      newChar = {...char, inventory}
      save(newChar)
      return newChar
    case 'UNEQUIP_ITEM':
      break;
    case 'USE_SPELL':
      break
    default:
      return new Error('Error updating character')
  }
}
export default characterReducer