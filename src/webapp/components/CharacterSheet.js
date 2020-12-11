import React, { useState, useReducer, useEffect, useContext } from 'react';
import { attrReducer, inventoryReducer } from '../utils/characterSheet'
import {
  Container, Segment, Grid, Form, Input, Divider, Loader, Header, Button, Table, Icon, Progress
} from 'semantic-ui-react'
import { range } from '../utils/diceRolls'
import uuid from 'react-uuid'
import NavSideBar from './sidenav'
import EquipmentStore from './EquipmentStore'

const genderOptions = [
  { key: 'male', text: 'Male', value: 'male' },
  { key: 'female', text: 'Female', value: 'female' },
]


const CharacterSheet = ({ character: char }) => {
  const [loading, setLoading] = useState(true)
  const [editingPI, setEditingPI] = useState(false)
  const [state, dispatch] = useReducer(attrReducer, char)

  useEffect(() => {
    console.log(char)
    if (char !== undefined) {
      setLoading(false)
      // console.log(state)
    }
  }, [])

  const createACtoHitTbl = () => {
    let headerCells = []
    let cells = []
    let adjAC = (char.ac > 10) ? 10 : char.ac
    for (let ac of range(-10, 11).map(num => { return String(num) })) {
      headerCells.push(
        <React.Fragment key={uuid()}>
          {ac == adjAC
            ? <Table.HeaderCell style={{ backgroundColor: 'grey' }}>{ac}</Table.HeaderCell>
            : <Table.HeaderCell >{ac}</Table.HeaderCell>
          }
        </React.Fragment>
      )
      cells.push(
        <React.Fragment key={uuid()}>
          {ac == adjAC
            ? <Table.Cell style={{ color: 'white', backgroundColor: 'black' }}>{char.ac_to_hit[ac]}</Table.Cell>
            : <Table.Cell>{char.ac_to_hit[ac]}</Table.Cell>
          }
        </React.Fragment>
      )
    }
    return (
      <Table celled structured>
        <Table.Header>
          <Table.Row textAlign='center'>
            <Table.HeaderCell colSpan={21}>Roll required to hit Armor Class</Table.HeaderCell>
          </Table.Row>
          <Table.Row textAlign='center'>
            {headerCells}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row textAlign='center'>{cells}</Table.Row>
        </Table.Body>
      </Table>
    )
  }

  return (
    <Segment.Group raised>
      {loading
        ? <Loader active size='massive'>Loading</Loader>
        : <>
          <Segment inverted color='black'><Header textAlign='center' as='h2'>Character Sheet</Header></Segment>

          <Segment.Group style={{ marginTop: '12px' }}>
            <Segment color='green'>
              <Divider horizontal style={{ paddingBottom: '15px' }}>
                <h4>
                  {!editingPI
                    ? <Icon name='edit outline' color='grey' onClick={() => { setEditingPI(true) }} />
                    : <Icon name='edit outline' color='green' onClick={() => { setEditingPI(false) }} />
                  }
                  PERSONAL ATTRIBUTES
                </h4>
              </Divider>
              <Grid stackable>
                <Grid.Row columns={2} divided style={{ padding: '5px 0' }}>
                  <Grid.Column>
                    <Container>
                      <Form>
                        <Form.Group widths='equal'>
                          <Form.Input readOnly={!editingPI} fluid label='Name' transparent={!editingPI} value={char.name} />
                          <Form.Input fluid label='Level' transparent value={char.level} />
                          <Form.Input readOnly fluid label='Class' transparent value={char.class.toTitleCase()} />
                          <Form.Input readOnly fluid label='Sex' transparent value={char.gender.toTitleCase()} />
                        </Form.Group>
                        <Form.Group widths='equal'>
                          <Form.Input readOnly fluid label='Race' transparent value={char.race.toTitleCase()} />
                          <Form.Input readOnly fluid label='Alignment' transparent value={char.alignment.toTitleCase()} />
                          <Form.Input readOnly fluid label='AC' transparent value={char.ac} />
                        </Form.Group>
                        <Divider />
                        <Form.Group inline>
                          <Form.Field width={3}>
                            <label>Age</label>
                            <Input transparent value={char.age} />
                          </Form.Field>
                          <Form.Field width={7}>
                            <label>Height</label>
                            <Input readOnly size='small' transparent value={char.height.ft} labelPosition='right' label={<label>ft.</label>} style={{ width: '50px', paddingRight: '10px' }} />
                            <Input readOnly size='small' transparent value={char.height.in} labelPosition='right' label={<label>in.</label>} style={{ width: '50px', paddingLeft: '10px' }} />
                          </Form.Field>
                          <Form.Field inline width={6}>
                            <label>Weight</label>
                            <Input readOnly size='small' transparent value={char.weight} labelPosition='right' label={<label>lbs.</label>} style={{ width: '50px' }} />
                          </Form.Field>
                        </Form.Group>
                      </Form>
                    </Container>
                  </Grid.Column>
                  <Grid.Column verticalAlign='middle'>
                    <Progress progress='value' value={char.exp} total={char.exp_next_lvl} color='yellow'>
                      <p style={{ textAlign: 'left', fontWeight: 'lighter' }}>XP:&nbsp;{`${char.exp}/${char.exp_next_lvl}`}</p>
                    </Progress>
                    <Progress progress='value' value={char.cur_hp} total={char.max_hp} color='green'>
                      <p style={{ textAlign: 'left', fontWeight: 'lighter' }}>HP:&nbsp;{`${char.cur_hp}/${char.max_hp}`}</p>
                    </Progress>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          </Segment.Group>

          <Segment.Group>
            <Segment color='blue'>
              <Divider horizontal>
                <h4>
                  {/* <Icon name='graduation cap' color='grey'/> */}
                  Abilities
                </h4>
              </Divider>
              <Table size='small' verticalAlign='middle' textAlign='left' striped columns={9}>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell width={1}><h4>Str</h4></Table.Cell>
                    <Table.Cell width={1}>{`${char.base_stats.str}`}</Table.Cell>
                    <Table.Cell colSpan='1'><p><strong>To Hit:&nbsp;&nbsp;</strong>{`${(char.base_mods.str_mods.hit_bonus >= 0) ? '+' : ''}${char.base_mods.str_mods.hit_bonus}`}</p></Table.Cell>
                    <Table.Cell colSpan='1'><p><strong>Damage Bonus:&nbsp;</strong>{`${(char.base_mods.str_mods.dmg_bonus >= 0) ? '+' : ''}${char.base_mods.str_mods.dmg_bonus}`}</p></Table.Cell>
                    <Table.Cell colSpan='1'><p><strong>Encumbrance:&nbsp;</strong>{`${(char.base_mods.str_mods.encumb_adj >= 0) ? '+' : ''}${char.base_mods.str_mods.encumb_adj}`}</p></Table.Cell>
                    <Table.Cell colSpan='2'><p><strong>Minor Tests:&nbsp;</strong>{`${(char.base_mods.str_mods.minor_tests >= 0) ? '+' : ''}${char.base_mods.str_mods.minor_tests}`}</p></Table.Cell>
                    <Table.Cell colSpan='2'><p><strong>Major Tests:&nbsp;</strong>{`${(char.base_mods.str_mods.major_tests >= 0) ? '+' : ''}${char.base_mods.str_mods.major_tests}`}</p></Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={1}><h4>Dex</h4></Table.Cell>
                    <Table.Cell width={1}>{`${char.base_stats.dex}`}</Table.Cell>
                    <Table.Cell colSpan='1'><p><strong>Surprise:&nbsp;&nbsp;</strong>{`${(char.base_mods.dex_mods.surprise >= 0) ? '+' : ''}${char.base_mods.dex_mods.surprise}`}</p></Table.Cell>
                    <Table.Cell colSpan='1'><p><strong>Missile to hit:&nbsp;</strong>{`${(char.base_mods.dex_mods.to_hit >= 0) ? '+' : ''}${char.base_mods.dex_mods.to_hit}`}</p></Table.Cell>
                    <Table.Cell colSpan='5'><p><strong>AC:&nbsp;</strong>{`${(char.base_mods.dex_mods.ac >= 0) ? '+' : ''}${char.base_mods.dex_mods.ac}`}</p></Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={1}><h4>Con</h4></Table.Cell>
                    <Table.Cell width={1}>{`${char.base_stats.con}`}</Table.Cell>
                    <Table.Cell colSpan='1'> <p><strong>HP Bonus per die:&nbsp;</strong>{`${(char.base_mods.con_mods.hp_bonus_per_die >= 0) ? '+' : ''}${char.base_mods.con_mods.hp_bonus_per_die}`}</p></Table.Cell>
                    <Table.Cell colSpan='2'><p><strong>Survive Resurrection/Raise Dead:&nbsp;</strong>{`${char.base_mods.con_mods.survive_dead}%`}</p></Table.Cell>
                    <Table.Cell colSpan='4'><p><strong>Survive System Shock (Minor Test):&nbsp;</strong>{`${char.base_mods.con_mods.survive_sys_shock}%`}</p></Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={1}><h4>Int</h4></Table.Cell>
                    <Table.Cell width={1}>{`${char.base_stats.int}`}</Table.Cell>
                    <Table.Cell colSpan='3'><p><strong>Languages:&nbsp;</strong>{`${(char.languages) ? char.languages.map(lang => { return lang.toTitleCase() }).join(', ') : 'None'}`}</p></Table.Cell>
                    <Table.Cell colSpan='4'><p><strong>Max Addl. Languages:&nbsp;</strong>{char.max_addl_langs}</p></Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={1}><h4>Wis</h4></Table.Cell>
                    <Table.Cell width={1}>{`${char.base_stats.wis}`}</Table.Cell>
                    <Table.Cell colSpan='7'><p><strong>Mental save:&nbsp;</strong>{`${(char.base_mods.wis_mods.mental_save >= 0) ? '+' : ''}${char.base_mods.wis_mods.mental_save}`}</p></Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={1}><h4>Cha</h4></Table.Cell>
                    <Table.Cell width={1}>{`${char.base_stats.cha}`}</Table.Cell>
                    <Table.Cell colSpan='1'><p><strong>Max Henchmen:&nbsp;</strong>{char.base_mods.cha_mods.max_henchmen}</p></Table.Cell>
                    <Table.Cell colSpan='1'><p><strong>Loyalty bonus:&nbsp;</strong>{`${(char.base_mods.cha_mods.loyalty_bonus >= 0) ? '+' : ''}${char.base_mods.cha_mods.loyalty_bonus}`}</p></Table.Cell>
                    <Table.Cell colSpan='5'><p><strong>Reaction bonus:&nbsp;</strong>{`${(char.base_mods.cha_mods.reaction_bonus >= 0) ? '+' : ''}${char.base_mods.cha_mods.reaction_bonus}`}</p></Table.Cell>
                  </Table.Row>
                </Table.Body>
                </Table>
            </Segment>
          </Segment.Group>

          <Segment.Group>
            <Segment color='red'>
              <Divider horizontal>
                <h4>
                  {/* <Icon name='save outline' color='grey'/> */}
                  Saving Throws
                </h4>
              </Divider>
              <Table celled textAlign='center'>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Aimed Magic Items</Table.HeaderCell>
                    <Table.HeaderCell>Breath Weapons</Table.HeaderCell>
                    <Table.HeaderCell>Death, Paralysis, Poison</Table.HeaderCell>
                    <Table.HeaderCell>Petrifaction, Polymorph</Table.HeaderCell>
                    <Table.HeaderCell>Unlisted Spells</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>{char.saving_throws.aimed_magic_items}</Table.Cell>
                    <Table.Cell>{char.saving_throws.breath_weapons}</Table.Cell>
                    <Table.Cell>{char.saving_throws.death_paralysis_poison}</Table.Cell>
                    <Table.Cell>{char.saving_throws.petrifaction_polymorph}</Table.Cell>
                    <Table.Cell>{char.saving_throws.unlisted_spells}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Segment>
          </Segment.Group>

          <Segment.Group>
            <Segment color='purple'>
              <Divider horizontal>
                <h4>
                  {/* <Icon name='shield' color='grey'/> */}
                  Weapons & Armor
                </h4>
              </Divider>
              <Table definition compact textAlign='center'>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Equip Slot</Table.HeaderCell>
                    <Table.HeaderCell>Weapon</Table.HeaderCell>
                    <Table.HeaderCell>Dmg vs S-M</Table.HeaderCell>
                    <Table.HeaderCell>Dmg vs L</Table.HeaderCell>
                    <Table.HeaderCell>Rate of Fire</Table.HeaderCell>
                    <Table.HeaderCell>Range (-2 to hit per)</Table.HeaderCell>
                    <Table.HeaderCell>Encumbrance</Table.HeaderCell>
                    <Table.HeaderCell>Ammo</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  <Table.Row>
                    <Table.Cell>Weapon in hand</Table.Cell>
                    <Table.Cell>Sword, Short</Table.Cell>
                    <Table.Cell>1d6</Table.Cell>
                    <Table.Cell>1d8</Table.Cell>
                    <Table.Cell>-</Table.Cell>
                    <Table.Cell>-</Table.Cell>
                    <Table.Cell>25 lbs</Table.Cell>
                    <Table.Cell>-</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Secondary</Table.Cell>
                    <Table.Cell>Dagger</Table.Cell>
                    <Table.Cell>1d4</Table.Cell>
                    <Table.Cell>1d3</Table.Cell>
                    <Table.Cell>-</Table.Cell>
                    <Table.Cell>-</Table.Cell>
                    <Table.Cell>1 lbs</Table.Cell>
                    <Table.Cell>-</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Ranged</Table.Cell>
                    <Table.Cell>Bow, Short</Table.Cell>
                    <Table.Cell>1d6</Table.Cell>
                    <Table.Cell>1d6</Table.Cell>
                    <Table.Cell>2</Table.Cell>
                    <Table.Cell>50 ft</Table.Cell>
                    <Table.Cell>12 lbs</Table.Cell>
                    <Table.Cell>
                      <Button
                        style={{ background: 'none', border: 'none', width: '25px' }}>
                        <Icon name='triangle left' />
                      </Button>
                      25
                      <Button
                        style={{ background: 'none', border: 'none', width: '25px', paddingLeft: '5px'}}>
                        <Icon name='triangle right' />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Other</Table.Cell>
                    <Table.Cell>-</Table.Cell>
                    <Table.Cell>-</Table.Cell>
                    <Table.Cell>-</Table.Cell>
                    <Table.Cell>-</Table.Cell>
                    <Table.Cell>-</Table.Cell>
                    <Table.Cell>-</Table.Cell>
                    <Table.Cell>-</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
              {/* AC_TO_HIT_TABLE */}
              {createACtoHitTbl()}
              <EquipmentStore character={char}/>
            </Segment>
          </Segment.Group>
        </>
      }
    </Segment.Group>
  )
}

CharacterSheet.Layout = NavSideBar

export default CharacterSheet