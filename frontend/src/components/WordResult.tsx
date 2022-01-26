import '@fontsource/roboto/300.css'
import { Box, Card, CardContent, Checkbox, Divider, FormControlLabel } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'hooks'
import React from 'react'
import { selectors, toggleSelectedSearchResult } from 'store/slices/search'
import { WordResult } from 'types/spanishdict'
import WordDefinition from './WordDefinition'

interface IWordDefinitionProps {
  word: WordResult
}

export default function (props: IWordDefinitionProps): JSX.Element {
  const dispatch = useAppDispatch()
  const selectedResults = useAppSelector(selectors.selectSelectedSearchResults)

  const handleSelect = React.useCallback((e) => {
    dispatch(toggleSelectedSearchResult(e.currentTarget.id))
  }, [])

  return (
    <Card sx={{ width: '100%', flexShrink: 0, borderRadius: '12px' }}>
      <CardContent>
        <WordDefinition word={props.word} />
        <Divider sx={{ my: 2 }} />
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                color="secondary"
                id={props.word.id}
                checked={selectedResults.includes(props.word.id)}
                onChange={handleSelect}
              />
            }
            label="Add To Bank"
          />
        </Box>
      </CardContent>
    </Card>
  )
}
