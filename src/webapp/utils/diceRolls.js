export function getRandInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}

export const rollStat = () => {
  let rolls = []
  for (let i = 0; i < 4; i++) {
    rolls.push(getRandInt(1, 7))
  }
  rolls.sort((a, b) => { return a > b })
  return rolls.slice(1, 4).reduce((a, b) => a + b, 0)
}

export const rollHP = (num_dice, sides, bonus=0) => {
  let result = 0
  for (let i = 0; i < num_dice; i++) {
    result += getRandInt(1, sides)
  }
  result += bonus
  return result
}