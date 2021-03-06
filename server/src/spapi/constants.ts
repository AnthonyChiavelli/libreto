enum Gender {
  Masculine = 'm',
  Femeline = 'f',
  Neutral = 'n',
}

enum Language {
  English = 'en',
  Spanish = 'es',
}

enum Person {
  First = '1st',
  Second = '2nd',
  Third = '3rd',
}

enum CNumber {
  Singular = 'sig',
  Plural = 'plr',
}

enum Tense {
  Present = 'present',
  Preterite = 'preterite',
  Imperfect = 'imperfect',
  Conditional = 'conditional',
  Imperfect2 = 'imperfect2',
  Future = 'future',
  Affirmative = 'affirmative',
  Negative = 'negative',
  Past = 'past',
}

enum Mood {
  Indicative = 'ind',
  Subjunctive = 'sub',
  Imperative = 'imp',
}

enum Form {
  Simple = 'simp',
  Progressive = 'prog',
  Perfect = 'perf',
}

export { CNumber, Form, Gender, Language, Mood, Person, Tense }
