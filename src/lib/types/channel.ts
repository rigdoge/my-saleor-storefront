export interface Channel {
  id: string
  slug: string
  name: string
  currencyCode: string
  languageCode: string
  isActive: boolean
  defaultCountry: {
    code: string
    country: string
  }
}

export interface ChannelContext {
  currentChannel: Channel
  availableChannels: Channel[]
  setCurrentChannel: (channel: Channel) => void
}

export type SupportedLanguage = 'en-US' | 'zh-CN' | 'ja-JP'
export type SupportedCurrency = 'USD' | 'CNY' | 'JPY'

export interface LocaleSettings {
  language: SupportedLanguage
  currency: SupportedCurrency
  country: string
} 