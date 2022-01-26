import { Box, Chip, Stack, Typography } from '@mui/material'
import React from 'react'
import Regions from 'Regions'
import { WordResult } from 'types/spanishdict'

export default function (props: { word: WordResult; hideWordName?: boolean }): JSX.Element {
  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="flex-end" sx={{ my: 2 }}>
        {!props.hideWordName && <Typography variant="h5">{props.word.meaning}</Typography>}
        <Box ml={1} mr={1}>
          {props.word.context}
        </Box>
        <Typography fontStyle="italic">({props.word.part})</Typography>
      </Box>
      <Box>
        <Typography fontStyle="italic">Examples:</Typography>
        <ol>
          {props.word.examples.map((e) => (
            <li>
              <span>{e.translated}</span>{' '}
              <Typography component="span" fontStyle="italic">
                {e.original}
              </Typography>
            </li>
          ))}
        </ol>
      </Box>
      <Stack direction="row" spacing="1">
        {props.word.regions.map((r) => (
          <Chip label={`${Regions(r)} ${r}`} />
        ))}
      </Stack>
    </>
  )
}
