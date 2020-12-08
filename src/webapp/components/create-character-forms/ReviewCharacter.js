import React from 'react'
import { Segment, Container, Grid, List, Header, Icon, Item, Button, GridColumn } from 'semantic-ui-react'

import { formatRaceName, getListFromKeys } from '../../utils/formatting'

const ReviewCharacter = ({ setForm, formData, navigation }) => {
  const {
    name, gender, race, class_, alignment, base_stats,
    height, weight, age, gold, max_hp, ac
  } = formData
  const { go } = navigation
  console.log(formData)

  return (
    <Segment raised>
      <div style={{display: 'flex', flexDirection: 'row'}}>
      <Header as='h1'>
        Review Details for "{`${name}`}"
      </Header>
      <Icon size='big' style={{color: '#d9dadb'}} name={(gender === 'male') ? 'man' : 'woman'}/>
      </div>
      <hr/>
      <Container fluid>
        <Grid stackable>
          <Grid.Row columns={3}>
            <Grid.Column width={5}>
              <Item.Group relaxed>
                <Item>
                  <Item.Image fluid src={`/race-images/${race}.png`} />
                  <Item.Content verticalAlign='middle'>
                    <Item.Header>
                      Race&nbsp;
                      </Item.Header>
                      <p>{formatRaceName(race)}</p>
                      <Button basic size='mini' onClick={() => {go("race")}}>
                        <Icon name='edit'/>
                        Edit
                      </Button>
                  </Item.Content>
                </Item>
              </Item.Group>
            </Grid.Column>
            <Grid.Column width={5}>
              <Item.Group relaxed>
                <Item>
                  <Item.Image src={`/class-images/${class_}.jpg`} />
                  <Item.Content verticalAlign='middle'>
                    <Item.Header>
                      Class
                      </Item.Header>
                      <p>{formatRaceName(class_)}</p>
                      <Button basic size='mini' onClick={() => {go("class_")}}>
                        <Icon name='edit'/>
                        Edit
                      </Button>
                  </Item.Content>
                </Item>
              </Item.Group>
            </Grid.Column>
            <Grid.Column width={6}>
              <Grid stackable doubling>
                <Grid.Row>
                  <Header as='h3' style={{padding: "15px 30px 0px 15px"}} >
                  Attributes&nbsp;&nbsp;&nbsp;
                  <Button size='mini' icon='edit' content='Edit' basic
                    onClick={() => { go("personal") }}
                  />
                </Header>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                      {getListFromKeys(base_stats, ['str', 'dex', 'con', 'int', 'wis', 'cha'], {size:'small', horizontal: true, style:{display: 'flex', justifyContent: 'space-around'}})}
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <List horizontal relaxed style={{display: 'flex', justifyContent: 'space-around'}}>
                      <List.Item>
                        <List.Content>
                          <List.Header>Height</List.Header>
                          <List.Description>{`${height.ft}' ${height.in}"`}</List.Description>
                        </List.Content>
                      </List.Item>
                      <List.Item>
                        <List.Content>
                          <List.Header>Weight</List.Header>
                          <List.Description>{`${weight} lbs.`}</List.Description>
                        </List.Content>
                      </List.Item>
                      <List.Item>
                        <List.Content>
                          <List.Header>Age</List.Header>
                          <List.Description>{`${age} yrs`}</List.Description>
                        </List.Content>
                      </List.Item>
                      <List.Item>
                        <List.Content>
                          <List.Header>Gold</List.Header>
                          <List.Description>{`${gold}`}</List.Description>
                        </List.Content>
                      </List.Item>
                      <List.Item>
                        <List.Content>
                          <List.Header>AC</List.Header>
                          <List.Description>{`${ac}`}</List.Description>
                        </List.Content>
                      </List.Item>
                    </List>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'right', marginTop: '20px'}}>
          <Button primary onClick={() => {go("submit")}}>
            Create&nbsp;{`${name}`}!
          </Button>
        </div>
      </Container>
    </Segment>
  )
}

export default ReviewCharacter