import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'

interface IToast {
  severity: 'success' | 'warning' | 'info' | 'error'
  message: string
}

interface IUISlice {
  currentToast: IToast | null
}

const initialState: IUISlice = {
  currentToast: null,
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentToast: (state, action: PayloadAction<IToast>) => {
      state.currentToast = action.payload
    },
  },
})

export const selectors = {
  currentToast: (state: RootState): IToast => state.ui.currentToast,
}

export const { setCurrentToast } = uiSlice.actions
