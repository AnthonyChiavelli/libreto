import ArrowBackIos from '@mui/icons-material/ArrowBackIos'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import Api from 'api'
import { AxiosResponse } from 'axios'
import { useAppDispatch, useAppSelector } from 'hooks'
import * as React from 'react'
import { selectors, setLoading, setSelectedWord, setWordbankWords } from 'store/slices/sidebar'
import { SavedWord } from 'types/types'
import WordDefinition from './WordDefinition'
const drawerWidth = 400

export default function (): JSX.Element {
  const loading = useAppSelector(selectors.selectLoading)
  const words = useAppSelector(selectors.selectWordbankWords)
  const selectedWord = useAppSelector(selectors.selectSelectedWord)
  const dispatch = useAppDispatch()

  const handleSelectWord = React.useCallback((w: SavedWord) => {
    dispatch(setSelectedWord(w))
  }, [])

  React.useEffect(() => {
    dispatch(setLoading(true))
    Api.fetchWordbank().then((r: AxiosResponse<SavedWord[]>) => {
      dispatch(setWordbankWords(r.data))
      dispatch(setLoading(false))
    })
  }, [])

  return (
    <Box sx={{ backgroundColor: '#7681B3', overflow: 'none' }}>
      <Drawer
        anchor="left"
        variant="permanent"
        sx={{
          backgroundColor: '#ADA8B6',
          overflow: 'hidden',
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Typography variant="h5" align="center" sx={{ my: 1 }}>
          Word Bank
        </Typography>
        <Divider />
        <List sx={{overflowY: "auto"}}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            words.map((w) => (
              <ListItemButton onClick={() => handleSelectWord(w)}>
                <ListItemIcon>
                  <BookmarkBorderIcon />
                </ListItemIcon>
                <ListItemText>{w.word}</ListItemText>
              </ListItemButton>
            ))
          )}
        </List>
      </Drawer>
      <Drawer
        anchor="left"
        variant="temporary"
        open={Boolean(selectedWord)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {selectedWord && (
          <Box>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Button>
                <ArrowBackIos sx={{ mx: 2 }} onClick={() => dispatch(setSelectedWord(null))} />
              </Button>
              <Typography display="flex" flexGrow="1" variant="h5" align="center" sx={{ my: 1 }}>
                {selectedWord.word}
              </Typography>
            </Box>
            <Stack p={3}>
              {selectedWord.definitions.map((d) => (
                <WordDefinition word={d} />
              ))}
            </Stack>
            <Divider />
          </Box>
        )}
      </Drawer>
    </Box>
  )
}
