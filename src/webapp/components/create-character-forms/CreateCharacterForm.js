import React from 'react'
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
  class_: 'fighter',
  alignment: 'neutral_neutral',
  base_stats: {
    str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0
  },
  gold: 0,
  max_hp: 0,
}

function getRandInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}

const roll = (num_dice, sides, bonus=0) => {
  let result = 0
  for (let i = 0; i < num_dice; i++) {
    result += getRandInt(1, sides)
  }
  result += bonus
  return result
}

const CreateCharacterForm = () => {
  const [formData, setForm] = useForm(defaultData)
  const { step, navigation } = useStep({ initialStep: 0, steps })
  const { id } = step

  const props = { formData, setForm, navigation }

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