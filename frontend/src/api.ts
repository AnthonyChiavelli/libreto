import axios, { AxiosResponse } from 'axios'
import { WordResult } from 'types/spanishdict'
import { SavedWord } from 'types/types'

export default {
  lookupWord(word: string): Promise<AxiosResponse<WordResult[]>> {
    return axios.post('/api/lookup-word', { word })
  },
  fetchWordbank(): Promise<AxiosResponse<SavedWord[]>> {
    return axios.get('/api/wordbank')
  },
  addWord(word: string, definitions: WordResult[], notes: string): Promise<AxiosResponse> {
    return axios.post('/api/wordbank', { word, definitions, notes })
  },
}
