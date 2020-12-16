import { createContext, useReducer, useEffect, useContext } from 'react';
import characterReducer from '../reducers/characterReducer'

export const CharacterContext = createContext();

// export const useCharacterContext = () => useContext(CharacterContext)

const CharacterContextProvider = (props) => {
  const [character, dispatch] = useReducer(characterReducer, null)
    // try {
    //   const localData = localStorage.getItem('char_info')
    //   return localData ? JSON.parse(localData) : {}
    // }
    // catch (err) {
    //   console.log(`Error in CharContext Provider: ${err}`)
    //   return {}
    // }
    //})

  // useEffect(() => {
  //   console.log('SETTING CHARACTER')
  //   localStorage.setItem('char_info', JSON.stringify(character))
  // }, [])

  return (
    <CharacterContext.Provider value={{character, dispatch}}>
        {props.children}
    </CharacterContext.Provider>
  )
}

export default CharacterContextProvider;