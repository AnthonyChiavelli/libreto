enum Gender {
  Masculine = 'm',
  Femeline = 'f',
  Neutral = 'n',
}

enum Language {
  English = 'en',
  Spanish = 'es',
}

export interface Example {
  original: string
  translated: string
}

export interface WordResult {
  id: string
  lang: Language
  word: string
  gender?: Gender
  pronunciation?: string
  context: string
  meaning: string
  part: string
  examples: Array<Example>
  regions: Array<string>
}
