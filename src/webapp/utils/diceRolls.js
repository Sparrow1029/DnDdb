// These are helper functions that vanilla JS should have...
export function getRandInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}

export function range(start, end) {
    if(start === end) return [start];
    return [start, ...range(start + 1, end)];
}

// DnDdb-specific functions
export function rollMultiple (dieVal, numDice, bonus=0) {
  let res = 0
  for (let i = 0; i < numDice+1; i++) {
    res += getRandInt(1, dieVal+1)
  }
  return res + bonus
}

export const rollStat = () => {
  let rolls = []
  for (let i = 0; i < 4; i++) {
    rolls.push(getRandInt(1, 7))
  }
  rolls.sort((a, b) => { return a > b })
  return rolls.slice(1, 4).reduce((a, b) => a + b, 0)
}

export const rollHPForMe = (hitDie, className) => {
  hitDie = Number( hitDie.replace(/d/g, '') )
  let numDice = className === 'ranger' ? 2 : 1
  let HP = rollHP(numDice, hitDie)
  return HP
}

export const rollStartingGold = (className) => {
  let gold = 0
  switch (className) {
    case 'cleric':
    case 'druid':
      gold = rollMultiple(6, 3)*10
    case 'fighter':
    case 'ranger':
    case 'paladin':
      gold = rollMultiple(6, 3, 2)*10
    case 'magic_user':
    case 'illusionist':
      gold = rollMultiple(4, 2)*10
    case 'thief':
    case 'assassin':
      gold = rollMultiple(6, 2)*10
  }
  return gold
}

export const rollStartingAge = (age, hitDie) => {
  let [numDice, value] = hitDie.split('d').map(n => Number(n))
  return age + rollMultiple(value, numDice)
}

export const getSize = (sizeObj, gender, roll=null) => {
  let sizeChart = sizeObj[gender]
  let chance = (roll === null) ? getRandInt(1, 101) : roll
  for (let rng of Object.keys(sizeChart)) {
    let [start, stop] = rng.split('-').map(n => Number(n))
    if (range(start, stop+1).includes(chance)) {
      return sizeChart[rng]
    }
  }
  return sizeChart[Object.keys(sizeChart)[2]]  // 'Normal' size
}