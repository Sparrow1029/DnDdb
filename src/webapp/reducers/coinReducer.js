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
      console.log('credit')
      newAmt = coinsToFloat(purse) - coinsToFloat(action.payload)
      if (newAmt < 0) {  // don't go into debt yo
        return purse
      }
      return coinsFromFloat(newAmt)
    case 'debit':
      console.log('debit')
      newAmt = coinsToFloat(purse) + coinsToFloat(action.payload)
      return coinsFromFloat(newAmt)
    default:
      console.log("DEFAULTED")
      return purse
  }
}

export default coinReducer