import { React, useEffect, useState, useContext } from 'react';
import CharacterContextProvider, { CharacterContext } from '../../contexts/CharacterContext'
import CartContextProvider from '../../contexts/CartContext'
import { useRouter } from 'next/router'
import { request } from '../../utils/requests'

import CharacterSheet from '../../components/CharacterSheet'
import { Container, Loader } from 'semantic-ui-react';
import NavSidebar from '../../components/sidenav'

export default function CharacterPage() {
  const [loading, setLoading] = useState(true)
  // const [char, setChar] = useState(null)
  const { character: char, dispatch } = useContext(CharacterContext)
  const router = useRouter()

  useEffect(() => {
    setLoading(true)
    if (!char) {
      if (!localStorage.getItem(router.query.character)) {
        // console.log("NOCHAR")
        request.get(`/characters/${router.query.character}`)
          .then(resp => {
            // setChar(resp.data)
            dispatch({ type: 'SET_CHARACTER', payload: resp.data })
            setLoading(false)
            // console.log("LOADING FALSE")
          })
          .catch(err => console.log(err))

      } else {
        dispatch({ type: 'SET_CHARACTER', payload: JSON.parse(localStorage.getItem(router.query.character)) })
        setLoading(false)
      }
    }
    setLoading(false)
  }, [])

  return (
    <Container style={{ padding: '50px 0px' }}>
      {loading || !char
        ? <Loader active={loading} size='massive' content='Loading...' />
        : (
          <CartContextProvider>
            <CharacterSheet character={char} />
          </CartContextProvider>)
      }
    </Container>
  )
}

CharacterPage.Layout = NavSidebar;
