export type Language = 'en' | 'pt'

export type Localized<T> = Record<Language, T>
