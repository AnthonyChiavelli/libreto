import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { WordResult } from 'types/spanishdict'

interface ISearchSlice {
  searchWord: string | null
  searchResults: WordResult[]
  selectedSearchResults: string[]
  showAddToBankModal: boolean
  searchLoading: boolean
}

const initialState: ISearchSlice = {
  searchWord: null,
  searchResults: [],
  selectedSearchResults: [],
  showAddToBankModal: false,
  searchLoading: false,
}

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchResults: (state, action: PayloadAction<{ word: string; results: WordResult[] }>): void => {
      state.searchWord = action.payload.word
      state.searchResults = action.payload.results
    },
    toggleSelectedSearchResult: (state, action: PayloadAction<string>): void => {
      if (state.selectedSearchResults.includes(action.payload)) {
        state.selectedSearchResults = state.selectedSearchResults.filter((r) => r !== action.payload)
      } else {
        state.selectedSearchResults = [...state.selectedSearchResults, action.payload]
      }
    },
    setShowAddToBankModal: (state, action: PayloadAction<boolean>): void => {
      state.showAddToBankModal = action.payload
    },
    setSearchLoading: (state, action: PayloadAction<boolean>): void => {
      state.searchLoading = action.payload
    },
  },
})

export const selectors = {
  selectSearchResults: (state: RootState): WordResult[] => state.search.searchResults,
  selectSearchWord: (state: RootState): string => state.search.searchWord,
  selectSelectedSearchResults: (state: RootState): string[] => state.search.selectedSearchResults,
  selectFullSelectedSearchResults: (state: RootState): WordResult[] =>
    state.search.selectedSearchResults.length
      ? state.search.searchResults.filter((r) => state.search.selectedSearchResults.includes(r.id))
      : state.search.searchResults,
  selectShowAddToBankModal: (state: RootState): boolean => state.search.showAddToBankModal,
  selectSearchLoading: (state: RootState): boolean => state.search.searchLoading,
}

export const { setSearchResults, toggleSelectedSearchResult, setShowAddToBankModal, setSearchLoading } =
  searchSlice.actions
