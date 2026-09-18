import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { MAX_MATCH_RESULTS } from '../lib/match'

export interface MailAccount {
  id: string
  address: string
  provider: 'Gmail'
  /** 取り込み対象のラベル／フォルダ */
  targetLabel: string
  enabled: boolean
  lastSyncedAt: string
}

export type ClassifierModel = 'gpt-5-mini' | 'gpt-5-nano'

export const CLASSIFIER_MODELS: ClassifierModel[] = ['gpt-5-mini', 'gpt-5-nano']

/**
 * OpenAI の接続状態。
 * モック版のため実際の API キーは保存せず、表示用にマスクした文字列だけを持つ。
 */
export interface OpenAIConnection {
  connected: boolean
  /** 表示用にマスクしたキー（例: sk-proj…a1b2）。実キーは保持しない */
  maskedKey: string
  /** 接続した日時。未接続なら空文字 */
  connectedAt: string
}

/** 表示期間（何日前まで）の上限 */
export const MAX_DISPLAY_DAYS = 365

export interface Settings {
  /** マッチ率の表示件数 */
  matchCount: number
  darkMode: boolean
  /** 分類に使う AI モデル（モックのため未接続） */
  classifier: ClassifierModel
  /** OpenAI の接続状態（モックのため未接続） */
  openai: OpenAIConnection
  /** 分類後に Gmail 側へ自動でラベルを付与するか */
  autoLabel: boolean
  /** 一覧に表示するメールの期間（何日前まで遡るか） */
  displayDays: number
  accounts: MailAccount[]
}

const DEFAULT_SETTINGS: Settings = {
  matchCount: 5,
  darkMode: false,
  classifier: 'gpt-5-mini',
  openai: { connected: false, maskedKey: '', connectedAt: '' },
  autoLabel: true,
  displayDays: 30,
  accounts: [
    {
      id: 'a1',
      address: 'ses-info@example.co.jp',
      provider: 'Gmail',
      targetLabel: 'INBOX',
      enabled: true,
      lastSyncedAt: '2026-09-02 09:55',
    },
    {
      id: 'a2',
      address: 'partner@example.co.jp',
      provider: 'Gmail',
      targetLabel: '協力会社',
      enabled: true,
      lastSyncedAt: '2026-09-02 09:55',
    },
    {
      id: 'a3',
      address: 'recruit@example.co.jp',
      provider: 'Gmail',
      targetLabel: 'INBOX',
      enabled: false,
      lastSyncedAt: '2026-08-28 18:20',
    },
  ],
}

const STORAGE_KEY = 'pfs.settings'

interface SettingsContextValue {
  settings: Settings
  update: (patch: Partial<Settings>) => void
  updateAccount: (id: string, patch: Partial<MailAccount>) => void
  addAccount: (address: string) => void
  removeAccount: (id: string) => void
  connectOpenAI: (apiKey: string) => void
  disconnectOpenAI: () => void
  reset: () => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

/** 先頭 7 文字と末尾 4 文字だけ残す。実キーは保存しないので表示専用 */
const maskKey = (apiKey: string) => `${apiKey.slice(0, 7)}…${apiKey.slice(-4)}`

const load = (): Settings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const stored = { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) }
    // 上限を下げる前に保存された値が残っていることがあるので丸める
    return {
      ...stored,
      matchCount: Math.min(MAX_MATCH_RESULTS, Math.max(1, stored.matchCount)),
      displayDays: Math.min(MAX_DISPLAY_DAYS, Math.max(1, stored.displayDays)),
      // 選択肢から外したモデル名が残っているとプルダウンが空表示になる
      classifier: CLASSIFIER_MODELS.includes(stored.classifier) ? stored.classifier : DEFAULT_SETTINGS.classifier,
      // openai を持たない時期に保存された値が残っていることがある（浅いマージでは埋まらない）
      openai: { ...DEFAULT_SETTINGS.openai, ...stored.openai },
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      /* 保存できなくても動作は継続 */
    }
    document.documentElement.dataset.theme = settings.darkMode ? 'dark' : 'light'
  }, [settings])

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      update: (patch) => setSettings((prev) => ({ ...prev, ...patch })),
      updateAccount: (id, patch) =>
        setSettings((prev) => ({
          ...prev,
          accounts: prev.accounts.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),
      addAccount: (address) =>
        setSettings((prev) => ({
          ...prev,
          accounts: [
            ...prev.accounts,
            {
              id: `a${Date.now()}`,
              address,
              provider: 'Gmail',
              targetLabel: 'INBOX',
              enabled: true,
              lastSyncedAt: '未同期',
            },
          ],
        })),
      removeAccount: (id) =>
        setSettings((prev) => ({ ...prev, accounts: prev.accounts.filter((a) => a.id !== id) })),
      // 受け取ったキーはマスクしてから保存し、実キーはこの関数を抜けた時点で破棄する
      connectOpenAI: (apiKey) =>
        setSettings((prev) => ({
          ...prev,
          openai: {
            connected: true,
            maskedKey: maskKey(apiKey),
            connectedAt: new Date().toLocaleString('ja-JP', { dateStyle: 'medium', timeStyle: 'short' }),
          },
        })),
      disconnectOpenAI: () => setSettings((prev) => ({ ...prev, openai: DEFAULT_SETTINGS.openai })),
      reset: () => setSettings(DEFAULT_SETTINGS),
    }),
    [settings],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export const useSettings = () => {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
