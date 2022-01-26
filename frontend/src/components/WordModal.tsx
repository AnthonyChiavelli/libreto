import ExpandMore from '@mui/icons-material/ExpandMore'
import {
  Box,
  Button,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
  TextField,
  Typography,
} from '@mui/material'
import Api from 'api'
import { useAppDispatch, useAppSelector } from 'hooks'
import * as React from 'react'
import { selectors, setShowAddToBankModal } from 'store/slices/search'
import { prependWordbankWord } from 'store/slices/sidebar'
import { setCurrentToast } from 'store/slices/ui'
import { WordResult } from 'types/spanishdict'
import WordDefinition from './WordDefinition'

export default function (): JSX.Element {
  const dispatch = useAppDispatch()
  const showAddModal = useAppSelector(selectors.selectShowAddToBankModal)
  const word = useAppSelector(selectors.selectSearchWord)
  const selectedResults = useAppSelector(selectors.selectFullSelectedSearchResults)

  const [notes, setNotes] = React.useState<string>('')
  const handleChangeNotes = React.useCallback((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setNotes(event.target.value)
  }, [])

  const handleAddNote = React.useCallback(() => {
    Api.addWord(word, selectedResults, notes).then((res) => {
      dispatch(prependWordbankWord(res.data))
      dispatch(setCurrentToast({ severity: 'success', message: 'Word added to bank' }))
      dispatch(setShowAddToBankModal(false))
    })
  }, [word, selectedResults, notes])

  return (
    <Modal open={showAddModal} onClose={() => dispatch(setShowAddToBankModal(false))}>
      <>
        <Box sx={style}>
          <Typography variant="h4" textAlign="center">
            {word}
          </Typography>
          <Box>
            <form>
              <List dense>
                {selectedResults.map((r, i) => (
                  <WordListItem word={r} rank={i + 1} />
                ))}
              </List>
              <Box mt={5}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  maxRows={4}
                  value={notes}
                  onChange={handleChangeNotes}
                  rows={4}
                />
              </Box>
            </form>
          </Box>
          <Box>
            <Button color="primary" variant="outlined" onClick={handleAddNote}>
              Add To Bank
            </Button>
          </Box>
        </Box>
      </>
    </Modal>
  )
}

function WordListItem(props: { word: WordResult; rank: number }) {
  const [expanded, setExpanded] = React.useState<boolean>(false)
  return (
    <>
      <ListItemButton disableGutters onClick={() => setExpanded((prev) => !prev)}>
        <ListItemText
          primary={
            <Typography variant="h6">
              {props.rank}. {props.word.meaning}{' '}
            </Typography>
          }
        />
        <ListItemIcon>
          <ExpandMore />
        </ListItemIcon>
      </ListItemButton>
      <Collapse in={expanded}>
        <WordDefinition word={props.word} hideWordName />
      </Collapse>
    </>
  )
}

const style = {
  position: 'absolute',
  top: '25%',
  left: '50%',
  transform: 'translate(-50%, -25%)',
  width: '60%',
  bgcolor: 'white',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
}
