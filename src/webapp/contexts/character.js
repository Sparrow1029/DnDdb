import { useState, createContext } from 'react';

export const CharacterContext = createContext([{}, () => {}]);

const CharacterContextProvider = (props) => {
  const [characterData, setCharacterData] = useState(null)

  return (
    <CharacterContext.Provider value={[characterData, setCharacterData]}>
        {props.children}
    </CharacterContext.Provider>
  )
}

export default CharacterContextProvider;