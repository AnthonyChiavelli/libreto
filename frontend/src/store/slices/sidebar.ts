import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { SavedWord } from 'types/types'

interface ISidebarSlice {
  selectedWord: SavedWord | null
  loading: boolean
  wordbankWords: SavedWord[]
}

const initialState: ISidebarSlice = {
  selectedWord: null,
  loading: false,
  wordbankWords: [],
}

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setSelectedWord: (state, action: PayloadAction<SavedWord>) => {
      state.selectedWord = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setWordbankWords: (state, action: PayloadAction<SavedWord[]>) => {
      state.wordbankWords = action.payload
    },
    prependWordbankWord: (state, action: PayloadAction<SavedWord>) => {
      state.wordbankWords = [action.payload, ...state.wordbankWords]
    },
  },
})

export const selectors = {
  selectSelectedWord: (state: RootState): SavedWord => state.sidebar.selectedWord,
  selectLoading: (state: RootState): boolean => state.sidebar.loading,
  selectWordbankWords: (state: RootState): SavedWord[] => state.sidebar.wordbankWords,
}

export const { setSelectedWord, setLoading, setWordbankWords, prependWordbankWord } = sidebarSlice.actions
