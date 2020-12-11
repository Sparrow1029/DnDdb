import React, { useEffect, useState, createContext } from 'react'
import { request } from '../utils/requests'

export const StoreContext = createContext([{}, () => {}])

const StoreProvider = ({ children }) => {
  const [data, setData] = useState("IM A THING FUCK")

  useEffect(() => {
    request.get(`/store/equipment`)
     .then(res => {
      setData(res.data.data)
    })
    .catch(err => console.dir(err))
  }, [])

  return (
      <StoreContext.Provider value={[data, setData]}>
          {children}
      </StoreContext.Provider>
  )
}

export default StoreProvider