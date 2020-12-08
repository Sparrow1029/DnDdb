import React, { createContext, useState } from 'react'

export const ClassesContext = createContext([{}, () => {}])

const ClassesContextProvider = (props) => {
  const [classes, setClasses] = useState({})

  return (
    <ClassesContext.Provider value={[classes, setClasses]}>
        {props.children}
    </ClassesContext.Provider>
  )
}

export default ClassesContextProvider;