import { React, useState, useEffect, useContext } from 'react'
import { UserContext } from '../contexts/user'

import { request, logout } from '../utils/requests'
import Cookies from 'js-cookie'
import { Container, Grid, Header, Item, Loader, Button } from 'semantic-ui-react'
import CharacterCard from '../components/CharacterCard'
import NavSidebar from '../components/sidenav'

const getUserData = (id) => request.get(`/users/${id}`)

const UserHomePage = () => {
  const [userData, setUserData] = useContext(UserContext)
  const [thisData, setThisData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserData(Cookies.get('dnd_user_id'))
    .then(res => {
      setThisData(res.data)
      setUserData(res.data)
    })
    .then(setLoading(false))
    console.log("USER DATA")
    console.log(userData)
  }, [])

  const getCharArray = (characters) => {
    let charArray = []
    for (let char of characters) {
      charArray.push(
        <CharacterCard character={char} />
      )
    }
    return charArray;
  }

  return (
      <Container>
        {(!thisData || loading)
        ? <Loader inverted content="Loading..." />
        : <Grid>
          <Grid.Row centered>
            <Grid.Column width={10}>
              <Header as='h1' style={{padding: '25px', textAlign: 'center'}}>Welcome {thisData.username}</Header>
              <Item.Group divided>
                {getCharArray(thisData.characters)}
              </Item.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        }
        <Button onClick={logout}>Logout</Button>
      </Container>
  )
}

UserHomePage.Layout = NavSidebar;

export default UserHomePage;