const getTotal = ({ items }) => {
  let total = 0
  for (let obj of items) {
    total += obj.amt
  }
  return total
}
const cartReducer = ({ items, total }, { type, payload: { item: { name, id } } }) => {
  switch (type) {
    case 'add':
      if (!Object.keys(items).includes(id)) {
        items[id] = { name, amt: 1 }
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