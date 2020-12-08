export function attrReducer (state, action) {
  switch (action.attr) {
    case 'hp':
      return {cur_hp: state.cur_hp + action.value, ...state};
    case 'alive':
      return {alive: action.value, ...state}
    case 'exp':
      return {exp: state.exp + action.value, ...state}
    case 'name':
      return {name: action.value, ...state}
    case 'alignment':
      return {alignment: action.value, ...state}
    default:
      throw new Error()
  }
}

export function inventoryReducer (state, action) {
  switch (action.attr) {
    case 'gold':
      return {...state, gold: state.gold + action.value}
  }
}