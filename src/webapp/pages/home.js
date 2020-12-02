import { React, useState, useEffect, useContext } from 'react'
import { UserContext } from '../contexts/user'

import { request, logout } from '../utils/requests'
import Cookies from 'js-cookie'
import { Container, Grid, Header, Item, Icon, Message, Button, Loader } from 'semantic-ui-react'
import CharacterCard from '../components/CharacterCard'
import NavSidebar from '../components/sidenav'
import {useRouter} from 'next/router'
import Link from 'next/link'

const UserHomePage = () => {
  const [userData, setUserData] = useContext(UserContext)
  // const [thisData, setThisData] = useState(userData || null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!Cookies.get('access_token') || !Cookies.get('dnd_user_id')) {
      router.push('/')
    } else if (!userData) {
      request.get(`/users/${Cookies.get('dnd_user_id')}`)
      .then(res => {
        setUserData(res.data)
      })
      .then(setLoading(false))
    }
  }, [])

  const getCharArray = (characters) => {
    let charArray = []
    for (let char of characters) {
      if (!char) {
        continue
      }
      charArray.push(
        <CharacterCard character={char} key={char.id}/>
      )
    }
    return charArray;
  }

  // if (thisData && loading) return <Container></Container>

  return (
      <Container>
        {!userData
        ? <div style={{position: 'relative', top: '200px'}}>
          {/*<Message icon negative>
            <Icon name='circle notched' loading />
            <Message.Content>
            <Message.Header>You are not logged in</Message.Header>
            Returning to log in screen
            </Message.Content>
          </Message>*/}
          <Loader inverted content='Loading...' />
          </div>
        : <Grid>
          <Grid.Row centered>
            <Grid.Column width={12}>
              <Header as='h1' style={{padding: '25px', textAlign: 'center'}}>Welcome {userData.username}</Header>
              {(!userData.characters.length)
              ? <div style={{textAlign: 'center'}}>
                  <Link href='/characters/create'><Button primary><Icon name='user plus'/ >Create Character</Button></Link>
                </div>
              : <Item.Group divided>
                  {getCharArray(thisData.characters)}
                </Item.Group>
              }
            </Grid.Column>
          </Grid.Row>
          </Grid>
        }
      </Container>
  )
}

UserHomePage.Layout = NavSidebar;

export default UserHomePage;