const getTotal = (items) => {
  console.log(items)
  let total = 0
  for (let key of Object.keys(items)) {
    total += (items[key].cost * items[key].amt)
  }
  return total
}
const cartReducer = ({ items, total }, { type, item: { value: { name, id, cost } }}) => {
  // console.log(items, total)
  // console.log(type, name, id)
  switch (type) {
    case 'add':
      if (!Object.keys(items).includes(id)) {
        items[id] = { name, cost, amt: 1 }
      }
      return { items, total: getTotal(items) }
    case 'remove':
      if (!Object.keys(items).includes(id)) {
        delete items[id]
      }
      return { items, total: getTotal(items) }
    case 'increment':
      if (Object.keys(items).includes(id)) {
        items[id].amt += 1
      }
      return { items, total: getTotal(items) }
    case 'decrement':
      if (Object.keys(items).includes(id)) {
        items[id].amt -= 1
      }
      if (items[id].amt == 0) {
        delete items[id]
      }
      return { items, total: getTotal(items) }
    default:
      console.log(`Error updating state`)
      return { items, total }
  }
}

export default cartReducer