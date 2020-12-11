import { React, useState, useEffect, useContext } from 'react'
import { UserContext } from '../contexts/user'
import { StoreContext } from '../contexts/StoreContext'

import { request } from '../utils/requests'
import Cookies from 'js-cookie'
import { Container, Grid, Header, Item, Icon, Button, Loader, } from 'semantic-ui-react'
import CharacterCard from '../components/CharacterCard'
import NavSidebar from '../components/sidenav'
import { useRouter } from 'next/router'
import Link from 'next/link'

const UserHomePage = () => {
  const [userData, setUserData] = useContext(UserContext)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!Cookies.get('access_token') || !Cookies.get('dnd_user_id')) {
      router.push('/')
    } else {
      setLoading(true)
      request.get(`/users/${Cookies.get('dnd_user_id')}`)
      .then(res => {
        setUserData(res.data)
        setLoading(false)
      })
      .catch(err => console.dir(err))
    }
  }, [])

  const getCharArray = (characters) => {
    let charArray = []
    for (let char of characters) {
      if (!char) {
        continue
      }
      charArray.push(
        <CharacterCard character={char} key={char.id} />
      )
    }
    if (charArray.length === 0) {
      return <></>
    }
    return charArray;
  }

  // if (thisData && loading) return <Container></Container>

  return (
      <Container>
        {!userData || loading
          ? <div style={{ position: 'relative', top: '200px' }}>
            <Loader size='massive' active={loading} content='Loading...' />
          </div>
          : <Grid>
            <Grid.Row centered>
              <Grid.Column width={12}>
                <Header as='h1' style={{ padding: '25px', textAlign: 'center' }}>Welcome {userData.username}</Header>
                {(userData.characters.length !== 0) &&
                  <Item.Group divided>
                    {getCharArray(userData.characters)}
                  </Item.Group>
                }
                <div style={{ textAlign: 'center' }}>
                  <Link href='/characters/create'>
                    <Button primary>
                      <Icon name='user plus' />Create Character
                  </Button>
                  </Link>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        }
    </Container>
  )
}

UserHomePage.Layout = NavSidebar;

export default UserHomePage;