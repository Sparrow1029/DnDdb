import React, { useEffect, createContext, useState } from 'react'

export const RacesContext = createContext([{}, () => {}])

const RacesContextProvider = (props) => {
  const [races, setRaces] = useState({})

  return (
    <RacesContext.Provider value={[races, setRaces]}>
        {props.children}
    </RacesContext.Provider>
  )
}

export default RacesContextProvider;