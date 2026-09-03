/** 要件・条件の重要度（案件側=募集条件 / 要員側=就業希望条件） */
export type Importance = 'must' | 'want' | 'any'

export const IMPORTANCE_LABEL: Record<Importance, string> = {
  must: '必須',
  want: '尚可',
  any: '不問',
}

/** マッチ率計算時の重み */
export const IMPORTANCE_WEIGHT: Record<Importance, number> = {
  must: 5,
  want: 2,
  any: 0.5,
}

/** 稼働形態 */
export type WorkStyle = 'remote' | 'hybrid' | 'onsite'

export const WORK_STYLE_LABEL: Record<WorkStyle, string> = {
  remote: 'フルリモート',
  hybrid: '一部リモート',
  onsite: '常駐',
}

export type SkillCategory = 'language' | 'framework' | 'infra' | 'database' | 'process' | 'certification' | 'other'

export const SKILL_CATEGORY_LABEL: Record<SkillCategory, string> = {
  language: '言語',
  framework: 'FW/ライブラリ',
  infra: 'クラウド/インフラ',
  database: 'DB',
  process: '工程/役割',
  certification: '資格',
  other: 'その他',
}

/** 要員が持っている技術 */
export interface Skill {
  name: string
  category: SkillCategory
  /** 経験年数 */
  years: number
  note?: string
}

/** 案件側の要件 */
export interface Requirement {
  id: string
  label: string
  category: SkillCategory
  importance: Importance
  /** 要求される経験年数（任意） */
  minYears?: number
}

/** 就業希望条件（要員が項目ごとに重要度を指定する） */
export type ConditionKey = 'area' | 'workStyle' | 'rate' | 'timing'

export const CONDITION_LABEL: Record<ConditionKey, string> = {
  area: '勤務地',
  workStyle: '稼働形態',
  rate: '単価',
  timing: '参画時期',
}

export interface ProfileCondition {
  key: ConditionKey
  importance: Importance
  note?: string
}

/** マッチ判定に使う共通プロフィール（自社要員／メール経由の外部人材で共通） */
export interface MatchProfile {
  id: string
  name: string
  skills: Skill[]
  /** 対応可能エリア（都道府県・エリア名） */
  workAreas: string[]
  workStyle: WorkStyle
  /** 希望単価下限（万円/月） */
  desiredRate: number
  /** 稼働可能日 YYYY-MM-DD */
  availableFrom: string
  conditions: ProfileCondition[]
}

export type AssignmentStatus = 'assigned' | 'waiting' | 'upcoming'

export const ASSIGNMENT_LABEL: Record<AssignmentStatus, string> = {
  assigned: '稼働中',
  waiting: '待機中',
  upcoming: '参画予定',
}

/** 自社エンジニア */
export interface Engineer extends MatchProfile {
  age: number
  gender: '男性' | '女性' | '回答なし'
  /** 居住地 */
  location: string
  status: AssignmentStatus
  /** 稼働中の案件名 */
  currentProject?: string
  /** 待機開始日 YYYY-MM-DD */
  waitingSince?: string
  summary: string
  /** 技術の補足メモ（詳細画面用） */
  highlights: string[]
}

/** メールから抽出した外部人材（人材タブ） */
export interface Talent extends MatchProfile {
  mailId: string
  /** 所属会社 */
  company: string
  age: number
  location: string
  summary: string
}

/** メールから抽出した案件 */
export interface Project {
  mailId: string
  id: string
  title: string
  client: string
  location: string
  workStyle: WorkStyle
  /** 提示単価（万円/月） */
  rateMin: number
  rateMax: number
  /** 開始時期 YYYY-MM-DD */
  startFrom: string
  period: string
  requirements: Requirement[]
  summary: string
}

export type MailLabel = 'project' | 'talent' | 'other'

export const MAIL_LABEL: Record<MailLabel, string> = {
  project: '案件情報',
  talent: '人材情報',
  other: 'その他',
}

/** Gmail 側に付与するラベル名（モック） */
export const GMAIL_LABEL: Record<MailLabel, string> = {
  project: 'SES/案件',
  talent: 'SES/人材',
  other: 'SES/その他',
}

export interface Mail {
  id: string
  subject: string
  fromName: string
  fromAddress: string
  receivedAt: string
  excerpt: string
  /** メール本文の全文（無加工）。案件詳細の「元メール」欄で表示する */
  body?: string
  /** AI 分類結果（未分類は null） */
  label: MailLabel | null
  /** 分類済み＝Gmail にラベル付与済み。未分類のものだけ次回読み込み対象になる */
  classified: boolean
  /** AI 分類の確信度 0-1 */
  confidence?: number
  /** 手動でラベルを変更したか */
  manualOverride?: boolean
}

/** 参画する要員（登録時点のマッチ率を残す） */
export interface AssignmentMember {
  engineerId: string
  engineerName: string
  /** 登録時点のマッチ率 0-100 */
  matchScore: number
}

/** 案件への参画（自社要員のアサイン確定） */
export interface Assignment {
  id: string
  projectId: string
  /** 案件は元メール由来で消えることがあるので表示用の値も持たせる */
  projectTitle: string
  client: string
  /** 参画する要員（複数可） */
  members: AssignmentMember[]
  /** 参画開始日 YYYY-MM-DD */
  startDate: string
  /** 参画終了日 YYYY-MM-DD（未定なら未設定） */
  endDate?: string
  /** 契約単価（万円/月） */
  rate?: number
  note?: string
  /** 登録日時 ISO */
  createdAt: string
}
