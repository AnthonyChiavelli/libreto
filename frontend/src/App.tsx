import { Alert, Box, CssBaseline, Snackbar, Stack } from '@mui/material'
import Sidebar from 'components/Sidebar'
import WordLookup from 'components/WordLookup'
import WordModal from 'components/WordModal'
import WordResult from 'components/WordResult'
import { useAppDispatch, useAppSelector } from 'hooks'
import * as React from 'react'
import { selectors as searchSelectors } from 'store/slices/search'
import { selectors as uiSelectors, setCurrentToast } from 'store/slices/ui'

export default function (): React.ReactElement {
  const dispatch = useAppDispatch()
  const searchResults = useAppSelector(searchSelectors.selectSearchResults)
  const currentToast = useAppSelector(uiSelectors.currentToast)

  return (
    <Box sx={{ backgroundColor: '#83C9F4', display: 'flex', height: '100%' }}>
      <Snackbar open={currentToast !== null} autoHideDuration={3000} onClose={() => dispatch(setCurrentToast(null))}>
        <Alert severity="success">{currentToast?.message}</Alert>
      </Snackbar>
      <WordModal />
      <CssBaseline />

      <Sidebar />
      <Box component="main" sx={{ p: 2, flexGrow: 1, height: '100%', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pb: 2 }}>
          <WordLookup />
        </Box>
        <Stack
          spacing={2}
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            overflowY: 'auto',
            pr: 2,
            pb: 10,
          }}
        >
          {searchResults.map((r) => (
            <WordResult key={r.id} word={r} />
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
