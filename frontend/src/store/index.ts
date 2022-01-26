import { configureStore } from '@reduxjs/toolkit'
import { searchSlice } from 'store/slices/search'
import { sidebarSlice } from 'store/slices/sidebar'
import { uiSlice } from 'store/slices/ui'

const store = configureStore({
  reducer: {
    sidebar: sidebarSlice.reducer,
    search: searchSlice.reducer,
    ui: uiSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export { store }
