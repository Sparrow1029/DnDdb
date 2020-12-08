import React, { useState, useReducer, useEffect } from 'react';
import { attrReducer, inventoryReducer } from '../utils/characterSheet'
import {
  Container, Segment, Grid, Form, Divider, Loader, Header, Button, Table, Icon, Progress, SegmentGroup
} from 'semantic-ui-react'

import NavSideBar from './sidenav'


const CharacterSheet = ({character: char}) => {
  const [loading, setLoading] = useState(true)
  const [state, dispatch] = useReducer(attrReducer, char)

  useEffect(() => {
    if (char !== undefined) {
      setLoading(false)
      console.log(state)
    }
  }, [])

  return (
    <Segment.Group raised>
    {loading
      ? <Loader active size='massive'>Loading</Loader>
      : <>
      <Segment inverted color='black'><Header textAlign='center' as='h2'>Character Sheet</Header></Segment>
      <Segment.Group style={{marginTop: '12px'}}>
        <Segment color='green'>
        <Divider horizontal style={{paddingBottom: '15px'}}>Personal Attributes</Divider>
        <Grid stackable>
          <Grid.Row columns={3} divided style={{padding: '5px 0'}}>
            <Grid.Column><strong>Name:&nbsp;</strong>{char.name}</Grid.Column>
            <Grid.Column>
              <Progress progress='value' value={char.exp} total={char.exp_next_lvl} color='yellow'>
              <p style={{textAlign: 'left', fontSize: '.8rem', fontWeight: 'lighter'}}>XP:&nbsp;{`${char.exp}/${char.exp_next_lvl}`}</p>
              </Progress>
            </Grid.Column>
            <Grid.Column><strong>Age:&nbsp;</strong>{char.age}</Grid.Column>
          </Grid.Row>
          <Grid.Row columns={3} divided style={{padding: '0'}}>
            <Grid.Column><strong>Class:&nbsp;</strong>{char.class.toTitleCase()}</Grid.Column>
            <Grid.Column>
              <Progress progress='value' value={char.cur_hp} total={char.max_hp} color='green'>
              <p style={{textAlign: 'left', fontSize: '.8rem', fontWeight: 'lighter'}}>HP:&nbsp;{`${char.cur_hp}/${char.max_hp}`}</p>
              </Progress>
            </Grid.Column>
            <Grid.Column><strong>Height:&nbsp;</strong>{`${char.height.ft}'${char.height.in}"`}</Grid.Column>
          </Grid.Row>
          <Grid.Row columns={3} divided style={{padding: '5px 0'}}>
            <Grid.Column><strong>Alignment:&nbsp;</strong>{char.alignment.toTitleCase()}</Grid.Column>
            <Grid.Column><strong>AC:&nbsp;</strong>{char.ac}</Grid.Column>
            <Grid.Column><strong>Weight:&nbsp;</strong>{`${char.weight} lbs.`}</Grid.Column>
          </Grid.Row>
          <Grid.Row columns={3} divided style={{padding: '5px 0'}}>
            <Grid.Column><strong>Race:&nbsp;</strong>{char.race.toTitleCase()}</Grid.Column>
            <Grid.Column><strong>Level:&nbsp;</strong>{char.level}</Grid.Column>
            <Grid.Column><strong>Sex:&nbsp;</strong>{char.gender}</Grid.Column>
          </Grid.Row>
        </Grid>
        </Segment>
      </Segment.Group>
      <Segment.Group>
        <Segment color='blue'>
        <Divider horizontal>Abilities</Divider>
        <Grid stackable columns="equal" verticalAlign='middle'>
          <Grid.Row>
            <Grid.Column width={2}>
              <h4><strong>Str:&nbsp;&nbsp;&nbsp;&nbsp;{`${char.base_stats.str}`}</strong></h4> </Grid.Column>
            <Grid.Column>
              <p><strong>To Hit:&nbsp;&nbsp;</strong>{`
              ${(char.base_mods.str_mods.hit_bonus >= 0) ? '+' : ''}
              ${char.base_mods.str_mods.hit_bonus}
              `}
              </p>
            </Grid.Column>
            <Grid.Column>
              <p><strong>Damage Bonus:&nbsp;</strong>{`
              ${(char.base_mods.str_mods.dmg_bonus >= 0) ? '+' : ''}
              ${char.base_mods.str_mods.dmg_bonus}
              `}
              </p>
            </Grid.Column>
            <Grid.Column>
              <p><strong>Encumbrance:&nbsp;</strong>{`
              ${(char.base_mods.str_mods.encumb_adj >= 0) ? '+' : ''}
              ${char.base_mods.str_mods.encumb_adj}
              `}
              </p>
            </Grid.Column>
            <Grid.Column>
              <p><strong>Minor Tests:&nbsp;</strong>{`
              ${(char.base_mods.str_mods.minor_tests >= 0) ? '+' : ''}
              ${char.base_mods.str_mods.minor_tests}
              `}
              </p>
            </Grid.Column>
            <Grid.Column>
              <p><strong>Major Tests:&nbsp;</strong>{`
              ${(char.base_mods.str_mods.major_tests >= 0) ? '+' : ''}
              ${char.base_mods.str_mods.major_tests}
              `}
              </p>
            </Grid.Column>
          </Grid.Row>
          <Divider/>
          <Grid.Row>
            <Grid.Column width={2}>
              <h4><strong>Dex:&nbsp;&nbsp;&nbsp;&nbsp;{`${char.base_stats.dex}`}</strong></h4>
            </Grid.Column>
            <Grid.Column>
              <p><strong>Surprise:&nbsp;&nbsp;</strong>{`
              ${(char.base_mods.dex_mods.surprise >= 0) ? '+' : ''}
              ${char.base_mods.dex_mods.surprise}
              `}
              </p>
            </Grid.Column>
            <Grid.Column>
              <p><strong>Missile to hit:&nbsp;</strong>{`
              ${(char.base_mods.dex_mods.to_hit >= 0) ? '+' : ''}
              ${char.base_mods.dex_mods.to_hit}
              `}
              </p>
            </Grid.Column>
            <Grid.Column>
              <p><strong>AC:&nbsp;</strong>{`
              ${(char.base_mods.dex_mods.ac >= 0) ? '+' : ''}
              ${char.base_mods.dex_mods.ac}
              `}
              </p>
            </Grid.Column>
            <Grid.Column />
            <Grid.Column />
          </Grid.Row>
          <Divider/>
          <Grid.Row>
            <Grid.Column width={2}>
              <h4><strong>Con:&nbsp;&nbsp;&nbsp;&nbsp;{`${char.base_stats.con}`}</strong></h4>
            </Grid.Column>
            <Grid.Column width={3}>
              <p><strong>HP Bonus per die:&nbsp;</strong>{`
              ${(char.base_mods.con_mods.hp_bonus_per_die >= 0) ? '+' : ''}
              ${char.base_mods.con_mods.hp_bonus_per_die}
              `}
              </p>
            </Grid.Column>
            <Grid.Column width={5}>
              <p><strong>Survive Resurrection/Raise Dead:&nbsp;</strong>{`${char.base_mods.con_mods.survive_dead}%`}</p>
            </Grid.Column>
            <Grid.Column width={5}>
              <p><strong>Survive System Shock (Minor Test):&nbsp;</strong>{`${char.base_mods.con_mods.survive_sys_shock}%`}</p>
            </Grid.Column>
          </Grid.Row>
          <Divider/>
          <Grid.Row>
            <Grid.Column width={2}>
              <h4><strong>Int:&nbsp;&nbsp;&nbsp;&nbsp;{`${char.base_stats.int}`}</strong></h4>
            </Grid.Column>
            <Grid.Column width={5}>
              <p><strong>Languages:&nbsp;</strong>{`${(char.languages)
               ? char.languages.map(lang => { return lang.toTitleCase() }).join(', ')
              : 'None'}`}</p>
            </Grid.Column>
            <Grid.Column width={5}>
              <p><strong>Max Addl. Languages:&nbsp;</strong>{char.max_addl_langs}</p>
            </Grid.Column>
          </Grid.Row>
          <Divider/>
          <Grid.Row>
            <Grid.Column width={2}>
              <h4><strong>Wis:&nbsp;&nbsp;&nbsp;&nbsp;{`${char.base_stats.wis}`}</strong></h4>
            </Grid.Column>
            <Grid.Column>
              <p><strong>Mental save:&nbsp;</strong>{`
              ${(char.base_mods.wis_mods.mental_save >= 0) ? '+' : ''}
              ${char.base_mods.wis_mods.mental_save}
              `}
              </p>
            </Grid.Column>
          </Grid.Row>
          <Divider/>
          <Grid.Row>
            <Grid.Column width={2}>
              <h4><strong>Cha:&nbsp;&nbsp;&nbsp;&nbsp;{`${char.base_stats.cha}`}</strong></h4>
            </Grid.Column>
            <Grid.Column>
              <p><strong>Max Henchmen:&nbsp;</strong>{char.base_mods.cha_mods.max_henchmen}</p>
            </Grid.Column>
            <Grid.Column>
              <p><strong>Loyalty bonus:&nbsp;</strong>{`
              ${(char.base_mods.cha_mods.loyalty_bonus >= 0) ? '+' : ''}
              ${char.base_mods.cha_mods.loyalty_bonus}
              `}
              </p>
            </Grid.Column>
            <Grid.Column>
              <p><strong>Reaction bonus:&nbsp;</strong>{`
              ${(char.base_mods.cha_mods.reaction_bonus >= 0) ? '+' : ''}
              ${char.base_mods.cha_mods.reaction_bonus}
              `}
              </p>
            </Grid.Column>
            <Grid.Column/>
            <Grid.Column/>
          </Grid.Row>
        </Grid>
        </Segment>
      </Segment.Group>
      <Segment.Group>
        <Segment color='red'>
          <Divider horizontal>Saving Throws</Divider>
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
      </>
    }
    </Segment.Group>
  )
}

CharacterSheet.Layout = NavSideBar

export default CharacterSheet