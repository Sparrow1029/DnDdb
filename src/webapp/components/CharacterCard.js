import { React, useState, useContext } from 'react'
import { CharacterContext } from '../contexts/character'
import Link from 'next/link'

import { Item, Grid, Segment } from 'semantic-ui-react'

const CharacterCard = ({ character: char }) => {
  const [loading, setLoading] = useState(true)
  const [curCharacter, setCurCharacter] = useContext(CharacterContext)

  const setChar = () => {
    setCurCharacter(char)
  }

  return (
    <Item>
      <Item.Image src={`/icons/${char.class}.svg`} size='tiny' />
      <Item.Content>
        <Item.Header onClick={setChar}><Link href={`/characters/${char.id}`}>{char.name}</Link></Item.Header>
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
              <Item.Description><strong>HP&nbsp;</strong>{char.cur_hp}/{char.max_hp}&nbsp;&nbsp;<progress id='hp' value={char.cur_hp} max={char.max_hp}></progress></Item.Description>
            </Grid.Column>
          </Grid.Row>

        </Grid>
      </Item.Content>
    </Item>
  )
}

export default CharacterCard