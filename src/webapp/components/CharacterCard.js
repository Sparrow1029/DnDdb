import { React, useState, useContext } from 'react'
import { CharacterContext } from '../contexts/character'
import { deleteCharacter } from '../utils/requests'
import Link from 'next/link'
import Cookies, { set } from 'js-cookie'
import { useRouter } from 'next/router'

import { Item, Grid, Button, Popup, Modal, Form, Input, Container } from 'semantic-ui-react'

const CharacterCard = ({ character: char }) => {
  const [loading, setLoading] = useState(true)
  const [curCharacter, setCurCharacter] = useContext(CharacterContext)
  const [delCharStr, setDelCharStr] = useState('')
  const [popup, setPopup] = useState(false)
  const [open, setOpen] = useState(false)
  const token = Cookies.get('access_token')
  const router = useRouter()

  const setChar = () => {
    setCurCharacter(char)
  }

  const deleteCharForReal = (e) => {
    if (delCharStr === char.name) {
      deleteCharacter(char.id, token)
      .then(res => {
        console.log(res)
        alert("Character successfully deleted.")
        setOpen(false)
        router.push('/home')
      })
      .catch(err => {
        if (err.response.data.detail) {
          console.log(err.response.data.detail)
        } else {
          console.dir(err)
        }
      })
    } else {
      alert(`${char.name} is spared due to illiteracy...`)
    }
  }

  const deleteModal = () => {
    return (
      <Modal
        closeIcon
        onClose={() => {setOpen(false); setDelCharStr('')}}
        onOpen={() => {setOpen(true)}}
        open={open}
        size='small'
        trigger={<Button negative icon='x' floated='right' size='mini'/>}
      >
        <Modal.Content style={{textAlign: 'center'}}>
          <Modal.Header>Delete Character</Modal.Header>
          <Container>
          <Form onSubmit={deleteCharForReal}>
            <label>{`Type "${char.name}" if you are sure...`}</label>
            <Form.Field control='input' style={{textAlign: 'center', border: 'none', borderBottom: 'solid 1px'}}
              onChange={(e, d) => { setDelCharStr(e.target.value) }}
              value={delCharStr}
            />
          </Form>
          </Container>
          </Modal.Content>
      </Modal>
    )
  }

  return (
    <Item>
      <Item.Image src={`/icons/${char.class}.svg`} size='tiny' />
      <Item.Content>
        <Item.Header onClick={setChar}><Link href={`/characters/${char.id}`}>{char.name}</Link></Item.Header>
        {/*
        <Popup
          trigger={<Button negative icon='x' size='mini' floated='right'/>}
          on='click'
          content={deleteModal()}
        />
        */}
        {deleteModal()}
        <Item.Meta>
          {`Level ${char.level} ${char.class.toTitleCase()}`}&nbsp;&nbsp;&nbsp;&nbsp;
          |&nbsp;&nbsp;&nbsp;&nbsp;<strong>Campaign:</strong> {` COVID 2020`}
        </Item.Meta>
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column>
              <Item.Description>
                <strong>{char.race.toTitleCase()}</strong> {` (${char.gender.toTitleCase()})`}
              </Item.Description>
            </Grid.Column>
            <Grid.Column>
              <Item.Description>
                <strong>HP&nbsp;</strong>{char.cur_hp}/{char.max_hp}&nbsp;&nbsp;
                <progress id='hp' value={char.cur_hp} max={char.max_hp}></progress>
              </Item.Description>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Item.Content>
    </Item>
  )
}

export default CharacterCard