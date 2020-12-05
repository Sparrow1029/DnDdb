import React, { useState, useContext, useEffect } from 'react'
import { useForm, useStep } from 'react-hooks-helper'

import RaceData from './RaceData'
import ClassData from './ClassData'
import PersonalData from './PersonalData'

const steps = [
  { id: "race" },
  { id: "class_" },
  { id: "personal" },
  { id: "stats" },
]

const defaultData = {
  name: 'Anonymous',
  gender: 'male',
  race: 'dwarf',
  class_: 'assassin',
  alignment: 'lawful_evil',
  base_stats: {
    str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0
  },
  height: { ft: 0, in: 0 },
  weight: 0,
  age: 0,
  gold: 0,
  max_hp: 6,
  ac: 0,
}

const CreateCharacterForm = ({ clss, rcs }) => {
  const [formData, setForm] = useForm(defaultData)
  const { step, navigation } = useStep({ initialStep: 0, steps })
  const { id } = step
  const [classObj, setClassObj] = useState(clss['assassin'])
  const [raceObj, setRaceObj] = useState(rcs['dwarf'])
  const [alignState, setAlignState] = useState('lawful_evil')

  useEffect(() => {
    setClassObj(clss['assassin'])
    setRaceObj(rcs['dwarf'])
  }, [])


  const props = {
     formData, setForm, navigation, clss, rcs,
     classObj, setClassObj, raceObj, setRaceObj, alignState, setAlignState
  }

  switch (id) {
    case 'race':
      return <RaceData {...props} />
    case 'class_':
      return <ClassData {...props} />
    case 'personal':
      return <PersonalData {...props} />
    // case 'stats':
    //   return <Stats {...props} />
    default:
      return null
  }
}

export default CreateCharacterForm;