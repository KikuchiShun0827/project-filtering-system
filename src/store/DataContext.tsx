import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { engineers as seedEngineers } from '../data/engineers'
import { mails as seedMails, projects as seedProjects, talents as seedTalents } from '../data/mails'
import {
  hasUnreadReply,
  type Application,
  type ApplicationDraft,
  type ApplicationStatus,
  type Assignment,
  type Engineer,
  type Importance,
  type Mail,
  type MailLabel,
  type Project,
  type Talent,
} from '../types'

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
  /** 案件へ応募（提案）した要員の進捗 */
  applications: Application[]
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
  /** 参画を一覧から削除する */
  deleteAssignment: (assignmentId: string) => void
  /** 応募を登録する（選択した要員ぶんの行をまとめて作る） */
  addApplications: (draft: ApplicationDraft) => void
  /** 応募のステータスを進める（更新日も今日に更新する） */
  setApplicationStatus: (applicationId: string, status: ApplicationStatus) => void
  /** 受信した返信を確認済みにする（通知マークを消す） */
  markReplyRead: (applicationId: string) => void
  /** 未確認の返信を受け取っている応募の件数 */
  unreadReplyCount: number
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

/**
 * モック用に返信が届いた状態を作る。
 * 本来は Gmail API（users.watch + Pub/Sub、または users.history.list のポーリング）で
 * 提案メールのスレッドに付いた新着メッセージを拾って repliedAt を立てる想定だが、
 * 画面モックでは送信自体を行わないため「提案済」にした時点で返信済みとして扱う。
 */
const withMockReply = (a: Application): Application =>
  a.status === 'proposed' && !a.repliedAt
    ? { ...a, repliedAt: new Date().toISOString(), replyRead: false }
    : a

/** iso が「days 日前〜現在」の範囲に入っているか */
export const withinDays = (iso: string, days: number) => new Date(iso).getTime() >= Date.now() - days * 86_400_000

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [mails, setMails] = useState<Mail[]>(seedMails)
  const [engineers, setEngineers] = useState<Engineer[]>(seedEngineers)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [classifying, setClassifying] = useState(false)
  const [lastResult, setLastResult] = useState<DataContextValue['lastResult']>(null)

  const projectByMail = useMemo(() => new Map(seedProjects.map((p) => [p.mailId, p])), [])
  const projectById = useMemo(() => new Map(seedProjects.map((p) => [p.id, p])), [])
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

  const deleteAssignment = useCallback((assignmentId: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== assignmentId))
  }, [])

  /**
   * 成約した応募を参画案件として登録する。
   * 同じ案件の参画が既にあれば、新しい参画を作らずに要員だけ足す。
   */
  const addWonAssignment = useCallback(
    (a: Pick<Application, 'projectId' | 'projectTitle' | 'company' | 'engineerId' | 'engineerName' | 'matchScore'>) => {
      const project = projectById.get(a.projectId)
      const member = { engineerId: a.engineerId, engineerName: a.engineerName, matchScore: a.matchScore }
      setAssignments((prev) => {
        const existing = prev.find((as) => as.projectId === a.projectId)
        if (existing) {
          if (existing.members.some((m) => m.engineerId === member.engineerId)) return prev
          return prev.map((as) =>
            as.id === existing.id ? { ...as, members: [...as.members, member] } : as,
          )
        }
        return [
          ...prev,
          {
            id: `as${String(prev.length + 1).padStart(3, '0')}`,
            projectId: a.projectId,
            projectTitle: a.projectTitle,
            // 元メールが消えていると案件を引けないので、その場合は送信元会社を充てる
            client: project?.client ?? a.company,
            members: [member],
            startDate: project?.startFrom ?? new Date().toISOString().slice(0, 10),
            rate: project?.rateMin,
            createdAt: new Date().toISOString(),
          },
        ]
      })
    },
    [projectById],
  )

  const addApplications = useCallback((draft: ApplicationDraft) => {
    setApplications((prev) => {
      const maxNumber = prev.reduce((max, a) => {
        const n = Number(a.id.slice(2))
        return Number.isFinite(n) ? Math.max(max, n) : max
      }, 0)
      const created = draft.members.map((m, i) =>
        withMockReply({
          id: `ap${String(maxNumber + 1 + i).padStart(3, '0')}`,
          projectId: draft.projectId,
          projectTitle: draft.projectTitle,
          company: draft.company,
          engineerId: m.engineerId,
          engineerName: m.engineerName,
          matchScore: m.matchScore,
          status: draft.status,
          appliedAt: draft.appliedAt,
          updatedAt: draft.appliedAt,
          note: draft.note,
        }),
      )
      return [...prev, ...created]
    })
    // 最初から成約で登録された応募も参画案件一覧へ載せる
    if (draft.status === 'won') {
      draft.members.forEach((m) => addWonAssignment({ ...draft, ...m }))
    }
  }, [addWonAssignment])

  const setApplicationStatus = useCallback(
    (applicationId: string, status: ApplicationStatus) => {
      const today = new Date().toISOString().slice(0, 10)
      const target = applications.find((a) => a.id === applicationId)
      // 成約になった時点で参画案件一覧へ載せる
      if (target && status === 'won' && target.status !== 'won') addWonAssignment(target)
      setApplications((prev) =>
        prev.map((a) => (a.id === applicationId ? withMockReply({ ...a, status, updatedAt: today }) : a)),
      )
    },
    [applications, addWonAssignment],
  )

  const markReplyRead = useCallback((applicationId: string) => {
    setApplications((prev) => prev.map((a) => (a.id === applicationId ? { ...a, replyRead: true } : a)))
  }, [])

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
      applications,
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
      deleteAssignment,
      addApplications,
      setApplicationStatus,
      markReplyRead,
      unreadReplyCount: applications.filter(hasUnreadReply).length,
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
    deleteAssignment,
    applications,
    addApplications,
    setApplicationStatus,
    markReplyRead,
    addWonAssignment,
  ])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = () => {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
