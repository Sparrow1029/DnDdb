import React from 'react'
import { Container, Popup, Table } from 'semantic-ui-react'
import styles from '../styles/Responsive.module.css'

// Alignment aliases
const lg = 'lawful_good'
    , ng = 'neutral_good'
    , cg = 'chaotic_good'
    , ln = 'lawful_neutral'
    , nn = 'neutral_neutral'
    , cn = 'chaotic_neutral'
    , le = 'lawful_evil'
    , ne = 'neutral_evil'
    , ce = 'chaotic_evil'

const alignmentData = {
  'lawful_good': (<><strong>"Crusader":&nbsp;</strong>A lawful good character acts as a good person is expected or required to act. He or she combines a commitment to oppose evil with the discipline to fight relentlessly. He or she normally tells the truth, keeps his or her word, helps those in need, and speaks out against injustice. A lawful good character hates to see the guilty go unpunished. Generally, lawful good characters seek to combine the values of both honour and compassion.</>),
  'neutral_good': (<><strong>"Benefactor":&nbsp;</strong>A neutral good character does the best that a good person can do. He or she is devoted to helping others. He or she might work with or on behalf of kings and magistrates, but does not feel beholden to them if he or she feels that they are not serving the cause of good. Neutral good characters value doing what is good without a particular bias for or against order (or laws).</>),
  'chaotic_good': (<><p><strong>"Rebel":&nbsp;</strong> A chaotic good character acts as his or her conscience directs, with little regard for what others might expect. He or she makes his or her own way, but is generally kind and benevolent. He or she believes in goodness and personal honour, but has little use for laws and regulations.</p><p>Such a character disdains those who seek to intimidate others and tell them what to do. He or she follows his or her own moral compass, which, although good, may not agree with that of society. Chaotic good characters value the combination of a good heart with a free spirit.</p></>),
  'lawful_neutral': (<><strong>"Judge":&nbsp;</strong>A lawful neutral character acts as law, tradition, or a personal code directs him. Order and organisation are paramount. He or she may believe in personal order and live by a code or standard, or might believe in order for all, favouring a strong, organised government. Lawful neutral characters value reliability and honour, and some can be quite zealous about forcing these attributes onto society or other individuals.</>),
  'neutral_neutral': (<><p><strong>"True neutral":&nbsp;</strong> A neutral character has no allegiance to either good vs evil or law vs chaos. Most neutral characters exhibit a lack of conviction or bias rather than a commitment to neutrality. These normally think of good as preferable to evil—after all, they would rather have good neighbours and rulers than evil ones.</p><p> Still, such characters are not personally committed to upholding good in any abstract or universal way, especially when there is treasure to be had. Some neutral characters, on the other hand, are morally committed to neutrality. They see good, evil, law, and chaos as prejudices and dangerous extremes, advocating and supporting neutrality as the best, most balanced road in the long run.</p></>),
  'chaotic_neutral': (<><p><strong>"Free Spirit":&nbsp;</strong>A chaotic neutral character follows his or her whims. He or she is an individualist first and last. He or she values his or her own liberty but does not strive to protect others’ freedom. He or she avoids authority, resents restrictions, and challenges traditions.</p><p>A chaotic neutral character does not normally intentionally disrupt organisations as part of a campaign of anarchy. To do so, he or she would have to be motivated either by good (and a desire to liberate others) or evil (and a desire to make those different from him- or herself suffer). A chaotic neutral character may be unpredictable, but his or her behaviour is not normally totally random.</p></>),
  'lawful_evil': (<><p><strong>"Dominator":&nbsp;</strong>A lawful evil villain methodically takes what he or she wants within the limits of his or her code of conduct without regard for whom it hurts. He or she cares about tradition, loyalty, and order but not about freedom, dignity, or life. He or she plays by the rules but without mercy or compassion. He or she is comfortable in a hierarchy and would like to rule, but is willing to serve. He or she condemns others not according to their actions but according to race, religion, homeland, or social rank. He or she is loath to break laws or promises.</p><p>This reluctance comes partly from his or her nature and partly because he or she depends on order to protect him- or herself from those who oppose him or her on moral grounds. Some lawful evil characters have particular taboos, such as not killing in cold blood (but having underlings do it) or not letting children come to harm (if it can be helped). They imagine that these compunctions put them above unprincipled villains. Some lawful evil people and creatures commit themselves to evil with a zeal like that of a crusader committed to good.</p><p>Beyond being willing to hurt others for their own ends, they take pleasure in spreading evil as an end unto itself. They may also see doing evil as part of a duty to an evil deity or master. Lawful evil is sometimes called “diabolical,” because devils are the epitome of lawful evil.</p></>),
  'neutral_evil': (<><strong>"Malefactor":&nbsp;</strong>A neutral evil villain does whatever he or she can get away with. He or she is out for him- or herself, pure and simple. He or she sheds no tears for those he or she kills, whether for profit, sport, or convenience. He or she has no love of order and holds no illusion that following laws, traditions, or codes would make him or her any better or more noble. On the other hand, he or she doesn’t have the restless nature or love of conflict that a chaotic evil villain has. Some neutral evil villains hold up evil as an ideal, committing evil for its own sake. Most often, such villains are devoted to evil deities or secret societies.</>),
  'chaotic_evil': (<><p><strong>"Destroyer":&nbsp;</strong>A chaotic evil character does whatever his or her greed, hatred, and lust for destruction drive him to do. He or she is hot-tempered, vicious, arbitrarily violent, and unpredictable. If he or she is simply out for whatever he or she can get, he or she is ruthless and brutal. If he or she is committed to the spread of evil and chaos, he or she is even worse. His or her plans may be worked out well in advance, but their implementation will often be haphazard, and any group he or she forms is likely to be poorly organised.</p><p>Typically, chaotic evil creatures can be made to work together only by force, and their leader lasts only as long as he or she can thwart attempts to topple or assassinate him or her. Chaotic evil is sometimes called “demonic” because demons are the epitome of chaotic evil. Chaotic evil represents the destruction not only of beauty and life but also of the order on which beauty and life depend.</p></>)
}

const AlignmentPopup = ({ alignment, children }) => {
  return (
    <Popup
      trigger={children}
      content={alignmentData[alignment]}
      size='small'
      wide='very'
    />
  )
}

const AlignmentTable = ({ selected, permitted, handleClick }) => {
  return (
      <Table textAlign='center' className={styles.table} unstackable celled>
        <Table.Body>
          <Table.Row>
            <AlignmentPopup alignment={lg}>
              <Table.Cell disabled={!permitted.includes(lg)} active={selected === lg} onClick={handleClick} id={lg} >Lawful Good</Table.Cell>
            </AlignmentPopup>
            <AlignmentPopup alignment={ng}>
              <Table.Cell disabled={!permitted.includes(ng)} active={selected === ng} onClick={handleClick} id={ng} >Neutral Good</Table.Cell>
            </AlignmentPopup>
            <AlignmentPopup alignment={cg}>
              <Table.Cell disabled={!permitted.includes(cg)} active={selected === cg} onClick={handleClick} id={cg} >Chaotic Good</Table.Cell>
            </AlignmentPopup>
          </Table.Row>
          <Table.Row>
            <AlignmentPopup alignment={ln}>
              <Table.Cell disabled={!permitted.includes(ln)} active={selected === ln} onClick={handleClick} id={ln} >Lawful Neutral</Table.Cell>
            </AlignmentPopup>
            <AlignmentPopup alignment={nn}>
              <Table.Cell disabled={!permitted.includes(nn)} active={selected === nn} onClick={handleClick} id={nn} >True Neutral</Table.Cell>
            </AlignmentPopup>
            <AlignmentPopup alignment={cn}>
              <Table.Cell disabled={!permitted.includes(cn)} active={selected === cn} onClick={handleClick} id={cn} >Chaotic Neutral</Table.Cell>
            </AlignmentPopup>
          </Table.Row>
          <Table.Row>
            <AlignmentPopup alignment={le}>
              <Table.Cell disabled={!permitted.includes(le)} active={selected === le} onClick={handleClick} id={le} >Lawful Evil</Table.Cell>
            </AlignmentPopup>
            <AlignmentPopup alignment={ne}>
              <Table.Cell disabled={!permitted.includes(ne)} active={selected === ne} onClick={handleClick} id={ne} >Neutral Evil</Table.Cell>
            </AlignmentPopup>
            <AlignmentPopup alignment={ce}>
              <Table.Cell disabled={!permitted.includes(ce)} active={selected === ce} onClick={handleClick} id={ce} >Chaotic Evil</Table.Cell>
            </AlignmentPopup>
          </Table.Row>
        </Table.Body>
      </Table>
  )
}

export default AlignmentTable