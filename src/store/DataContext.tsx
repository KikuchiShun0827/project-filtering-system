import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { engineers as seedEngineers } from '../data/engineers'
import { mails as seedMails, projects as seedProjects, talents as seedTalents } from '../data/mails'
import type { Assignment, Engineer, Importance, Mail, MailLabel, Project, Talent } from '../types'

export interface ProjectItem {
  mail: Mail
  /** メール本文から抽出できた案件情報。手動でラベル変更した場合は null になりうる */
  project: Project | null
}

export interface TalentItem {
  mail: Mail
  talent: Talent | null
}

interface DataContextValue {
  mails: Mail[]
  engineers: Engineer[]
  projectItems: ProjectItem[]
  talentItems: TalentItem[]
  otherMails: Mail[]
  /** 参画が確定した案件 */
  assignments: Assignment[]
  /** 分類済み案件（マッチング計算用） */
  activeProjects: Project[]
  unclassifiedCount: number
  classifying: boolean
  /** 直近の読み込み結果 */
  lastResult: { project: number; talent: number; other: number; days: number } | null
  /** 指定日数以内に受信した未分類メールの件数 */
  countUnclassifiedWithin: (days: number) => number
  /** days 日前までに受信した未分類メールを分類する */
  classify: (days: number) => Promise<void>
  setLabel: (mailId: string, label: MailLabel) => void
  /** メールを一覧から削除する */
  deleteMail: (mailId: string) => void
  updateConditionImportance: (engineerId: string, key: string, importance: Importance) => void
  updateEngineer: (engineerId: string, patch: Partial<Engineer>) => void
  /** 要員を追加し、採番した id を返す */
  addEngineer: (engineer: Omit<Engineer, 'id'>) => string
  /** 参画を登録し、採番した id を返す */
  addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => string
  updateAssignment: (assignmentId: string, patch: Partial<Omit<Assignment, 'id' | 'createdAt'>>) => void
}

const DataContext = createContext<DataContextValue | null>(null)

/** 件名・本文から擬似的にラベルを推定する（本来は Gemini / Haiku を呼び出す箇所） */
const mockClassify = (mail: Mail): { label: MailLabel; confidence: number } => {
  const text = `${mail.subject} ${mail.excerpt}`
  if (/人材|ご紹介|要員|所属メンバー|稼働可能/.test(text)) {
    return { label: 'talent', confidence: 0.86 + Math.random() * 0.12 }
  }
  if (/案件|募集|開発|構築|改修|エンジニア|ご相談/.test(text)) {
    return { label: 'project', confidence: 0.84 + Math.random() * 0.14 }
  }
  return { label: 'other', confidence: 0.9 + Math.random() * 0.09 }
}

/** iso が「days 日前〜現在」の範囲に入っているか */
export const withinDays = (iso: string, days: number) => new Date(iso).getTime() >= Date.now() - days * 86_400_000

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [mails, setMails] = useState<Mail[]>(seedMails)
  const [engineers, setEngineers] = useState<Engineer[]>(seedEngineers)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [classifying, setClassifying] = useState(false)
  const [lastResult, setLastResult] = useState<DataContextValue['lastResult']>(null)

  const projectByMail = useMemo(() => new Map(seedProjects.map((p) => [p.mailId, p])), [])
  const talentByMail = useMemo(() => new Map(seedTalents.map((t) => [t.mailId, t])), [])

  const countUnclassifiedWithin = useCallback(
    (days: number) => mails.filter((m) => !m.classified && withinDays(m.receivedAt, days)).length,
    [mails],
  )

  const classify = useCallback(
    async (days: number) => {
      const isTarget = (m: Mail) => !m.classified && withinDays(m.receivedAt, days)
      if (!mails.some(isTarget)) return
      setClassifying(true)
      // AI API 呼び出しの代わりに待機（実装時は Gemini / Claude Haiku に置き換え）
      await new Promise((resolve) => setTimeout(resolve, 1200))

      const result = { project: 0, talent: 0, other: 0, days }
      setMails((prev) =>
        prev.map((m) => {
          // 期間外の未分類メールは次回の読み込み対象として残す
          if (!isTarget(m)) return m
          const { label, confidence } = mockClassify(m)
          result[label] += 1
          return { ...m, label, confidence: Number(confidence.toFixed(2)), classified: true }
        }),
      )
      setLastResult(result)
      setClassifying(false)
    },
    [mails],
  )

  const setLabel = useCallback((mailId: string, label: MailLabel) => {
    setMails((prev) =>
      prev.map((m) =>
        m.id === mailId ? { ...m, label, classified: true, manualOverride: true, confidence: 1 } : m,
      ),
    )
  }, [])

  const updateConditionImportance = useCallback((engineerId: string, key: string, importance: Importance) => {
    setEngineers((prev) =>
      prev.map((e) =>
        e.id === engineerId
          ? { ...e, conditions: e.conditions.map((c) => (c.key === key ? { ...c, importance } : c)) }
          : e,
      ),
    )
  }, [])

  const deleteMail = useCallback((mailId: string) => {
    setMails((prev) => prev.filter((m) => m.id !== mailId))
  }, [])

  const updateEngineer = useCallback((engineerId: string, patch: Partial<Engineer>) => {
    setEngineers((prev) => prev.map((e) => (e.id === engineerId ? { ...e, ...patch } : e)))
  }, [])

  const addEngineer = useCallback(
    (engineer: Omit<Engineer, 'id'>) => {
      const maxNumber = engineers.reduce((max, e) => {
        const n = Number(e.id.slice(1))
        return Number.isFinite(n) ? Math.max(max, n) : max
      }, 0)
      const id = `e${String(maxNumber + 1).padStart(2, '0')}`
      setEngineers((prev) => [...prev, { ...engineer, id }])
      return id
    },
    [engineers],
  )

  const addAssignment = useCallback(
    (assignment: Omit<Assignment, 'id' | 'createdAt'>) => {
      const id = `as${String(assignments.length + 1).padStart(3, '0')}`
      setAssignments((prev) => [...prev, { ...assignment, id, createdAt: new Date().toISOString() }])
      return id
    },
    [assignments],
  )

  const updateAssignment = useCallback(
    (assignmentId: string, patch: Partial<Omit<Assignment, 'id' | 'createdAt'>>) => {
      setAssignments((prev) => prev.map((a) => (a.id === assignmentId ? { ...a, ...patch } : a)))
    },
    [],
  )

  const value = useMemo<DataContextValue>(() => {
    const classified = mails.filter((m) => m.classified)
    const projectItems: ProjectItem[] = classified
      .filter((m) => m.label === 'project')
      .map((mail) => ({ mail, project: projectByMail.get(mail.id) ?? null }))
    const talentItems: TalentItem[] = classified
      .filter((m) => m.label === 'talent')
      .map((mail) => ({ mail, talent: talentByMail.get(mail.id) ?? null }))
    const otherMails = classified.filter((m) => m.label === 'other')

    return {
      mails,
      engineers,
      projectItems,
      talentItems,
      otherMails,
      assignments,
      activeProjects: projectItems.map((i) => i.project).filter((p): p is Project => p !== null),
      unclassifiedCount: mails.filter((m) => !m.classified).length,
      classifying,
      lastResult,
      countUnclassifiedWithin,
      classify,
      setLabel,
      deleteMail,
      updateConditionImportance,
      updateEngineer,
      addEngineer,
      addAssignment,
      updateAssignment,
    }
  }, [
    mails,
    engineers,
    assignments,
    projectByMail,
    talentByMail,
    classifying,
    lastResult,
    countUnclassifiedWithin,
    classify,
    setLabel,
    deleteMail,
    updateConditionImportance,
    updateEngineer,
    addEngineer,
    addAssignment,
    updateAssignment,
  ])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = () => {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
