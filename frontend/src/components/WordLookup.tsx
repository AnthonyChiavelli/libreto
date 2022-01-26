import LoadingButton from '@mui/lab/LoadingButton'
import { Box, TextField } from '@mui/material'
import Api from 'api'
import { AxiosResponse } from 'axios'
import { useAppDispatch, useAppSelector } from 'hooks'
import * as React from 'react'
import { selectors, setSearchLoading, setSearchResults, setShowAddToBankModal } from 'store/slices/search'
import { WordResult } from 'types/spanishdict'

export default function (): JSX.Element {
  const inputBoxRef = React.useRef(null)
  const [searchBoxContent, setSearchBoxContent] = React.useState<string>('')

  const dispatch = useAppDispatch()
  const results = useAppSelector(selectors.selectSearchResults)
  const selectedResults = useAppSelector(selectors.selectSelectedSearchResults)
  const searchLoading = useAppSelector(selectors.selectSearchLoading)

  const handleWordChange = React.useCallback((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSearchBoxContent(event.currentTarget.value)
  }, [])
  const handleLookup = React.useCallback(
    (e) => {
      e.preventDefault()
      dispatch(setSearchLoading(true))
      Api.lookupWord(searchBoxContent).then((res: AxiosResponse<WordResult[]>) => {
        dispatch(setSearchResults({ word: searchBoxContent, results: res.data }))
        dispatch(setSearchLoading(false))
      })
      if (inputBoxRef.current) {
        inputBoxRef.current.select()
      }
    },
    [searchBoxContent]
  )
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={handleLookup}>
        <TextField
          id="lookup"
          placeholder="Lookup..."
          size="small"
          autoFocus
          inputRef={inputBoxRef}
          onChange={handleWordChange}
          value={searchBoxContent}
          sx={{ width: 400, backgroundColor: 'white' }}
        />
        <LoadingButton loading={searchLoading} type="submit" variant="contained" size="large" sx={{ ml: 2 }}>
          Search
        </LoadingButton>
        <LoadingButton
          onClick={() => dispatch(setShowAddToBankModal(true))}
          loading={searchLoading}
          disabled={results.length === 0}
          type="button"
          variant="contained"
          color="secondary"
          size="large"
          sx={{ ml: 2 }}
        >
          {selectedResults.length > 0 ? 'Add Selection' : 'Add To Bank'}
        </LoadingButton>
      </form>
    </Box>
  )
}
