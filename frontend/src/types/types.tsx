import { WordResult } from 'types/spanishdict'

export interface SavedWordResult extends WordResult {
  notes?: string
  imageUrl?: string
}

export interface SavedWord {
  word: string
  createdAt: Date
  definitions: SavedWordResult[]
}
