import { React, useContext, useEffect, useState } from 'react';
import { CharacterContext } from '../../contexts/character'
import CartContextProvider from '../../contexts/CartContext'
import { useRouter } from 'next/router'
import { request } from '../../utils/requests'

import CharacterSheet from '../../components/CharacterSheet'
import styles from '../../styles/Global.module.css';
import {
  Container, Header, Icon, Grid, Segment, Loader
} from 'semantic-ui-react';
import NavSidebar from '../../components/sidenav'

export default function CharacterPage () {
  const [loading, setLoading] = useState(true)
  const [char, setChar] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if (char === null) {
      // console.log(router.query)
      request.get(`/characters/${router.query.character}`)
      .then(resp => {
        setChar(resp.data)
        setLoading(false)
      })
      .catch(err => console.log(err))
    }
  }, [])

  return (
    <CartContextProvider>
      <Container style={{padding: '50px 0px'}}>
        {loading
          ? <Loader active={loading} size='massive' content='Loading...' />
          : <CharacterSheet character={char} />
        }
      </Container>
    </CartContextProvider>
  )
}

CharacterPage.Layout = NavSidebar;
