import { createContext, useReducer, useEffect, useContext } from 'react';
import characterReducer from '../reducers/characterReducer'

export const CharacterContext = createContext();

const CharacterContextProvider = (props) => {
  const [character, dispatch] = useReducer(characterReducer, null)

  return (
    <CharacterContext.Provider value={{character, dispatch}}>
        {props.children}
    </CharacterContext.Provider>
  )
}

export default CharacterContextProvider;