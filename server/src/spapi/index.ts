import dict, { WordResult } from './dictionary'
import conju, { ConjugationResult } from './conjugation'
import request from './request'

export default {
  translate: async (word: string): Promise<WordResult[]> => dict(await request.translate(word)),
  conjugate: async (verb: string): Promise<ConjugationResult[]> => conju(await request.conjugate(verb)),
}
