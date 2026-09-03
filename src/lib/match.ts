import {
  CONDITION_LABEL,
  IMPORTANCE_WEIGHT,
  type ConditionKey,
  type Importance,
  type MatchProfile,
  type Project,
  type Requirement,
  type Skill,
  type WorkStyle,
} from '../types'

export interface RequirementResult {
  requirement: Requirement
  matchedSkill?: Skill
  /** 0-1 */
  score: number
  status: 'hit' | 'partial' | 'miss'
}

export interface ConditionResult {
  key: ConditionKey
  label: string
  importance: Importance
  /** 0-1 */
  score: number
  detail: string
}

export interface MatchResult {
  /** 0-100 */
  score: number
  requirements: RequirementResult[]
  conditions: ConditionResult[]
  mustHit: number
  mustTotal: number
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

const normalize = (v: string) =>
  v.toLowerCase().replace(/[\s._/-]/g, '').replace(/[（）()]/g, '')

const ALIASES: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  golang: 'go',
  rn: 'reactnative',
  k8s: 'kubernetes',
  psql: 'postgresql',
  postgres: 'postgresql',
  'aspnet': 'net',
}

const key = (v: string) => {
  const n = normalize(v)
  return ALIASES[n] ?? n
}

/** 要件名と保有スキル名の突き合わせ */
const findSkill = (profile: MatchProfile, requirement: Requirement): Skill | undefined => {
  const target = key(requirement.label)
  return profile.skills.find((s) => {
    const k = key(s.name)
    return k === target || k.includes(target) || target.includes(k)
  })
}

const evaluateRequirement = (profile: MatchProfile, requirement: Requirement): RequirementResult => {
  const matchedSkill = findSkill(profile, requirement)
  if (!matchedSkill) {
    return { requirement, score: 0, status: 'miss' }
  }
  const needYears = requirement.minYears ?? 3
  const yearsFactor = clamp01(matchedSkill.years / needYears)
  const score = 0.5 + 0.5 * yearsFactor
  const short = requirement.minYears !== undefined && matchedSkill.years < requirement.minYears
  return { requirement, matchedSkill, score, status: short ? 'partial' : 'hit' }
}

const WORK_STYLE_RANK: Record<WorkStyle, number> = { remote: 2, hybrid: 1, onsite: 0 }

const daysBetween = (from: string, to: string) =>
  Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86_400_000)

const evaluateConditions = (profile: MatchProfile, project: Project): ConditionResult[] => {
  const byKey = new Map(profile.conditions.map((c) => [c.key, c.importance]))
  const importanceOf = (k: ConditionKey): Importance => byKey.get(k) ?? 'want'

  // 勤務地
  let areaScore: number
  let areaDetail: string
  if (project.workStyle === 'remote') {
    areaScore = 1
    areaDetail = 'フルリモートのため勤務地の制約なし'
  } else if (profile.workAreas.some((a) => key(a) === key(project.location))) {
    areaScore = 1
    areaDetail = `${project.location}は対応可能エリア`
  } else if (project.workStyle === 'hybrid' && profile.workAreas.includes('リモート')) {
    areaScore = 0.4
    areaDetail = `${project.location}は対応エリア外（一部リモートで要相談）`
  } else {
    areaScore = 0
    areaDetail = `${project.location}は対応エリア外`
  }

  // 稼働形態
  const diff = WORK_STYLE_RANK[project.workStyle] - WORK_STYLE_RANK[profile.workStyle]
  const styleScore = diff >= 0 ? 1 : diff === -1 ? 0.5 : 0
  const styleDetail =
    diff >= 0 ? '希望する稼働形態を満たす' : diff === -1 ? '出社頻度が希望より多い' : '常駐必須のため希望と乖離'

  // 単価
  const rateScore = clamp01((project.rateMax / profile.desiredRate - 0.85) / 0.15)
  const rateDetail =
    project.rateMax >= profile.desiredRate
      ? `提示上限 ${project.rateMax}万 ≧ 希望 ${profile.desiredRate}万`
      : `提示上限 ${project.rateMax}万 < 希望 ${profile.desiredRate}万`

  // 参画時期
  const gap = daysBetween(project.startFrom, profile.availableFrom)
  const timingScore = gap <= 0 ? 1 : gap <= 30 ? 0.6 : gap <= 60 ? 0.3 : 0
  const timingDetail =
    gap <= 0
      ? `開始日（${project.startFrom}）に稼働可能`
      : `稼働可能日が開始日より${gap}日遅い`

  const rows: Array<{ key: ConditionKey; score: number; detail: string }> = [
    { key: 'area', score: areaScore, detail: areaDetail },
    { key: 'workStyle', score: styleScore, detail: styleDetail },
    { key: 'rate', score: rateScore, detail: rateDetail },
    { key: 'timing', score: timingScore, detail: timingDetail },
  ]

  return rows.map((r) => ({
    key: r.key,
    label: CONDITION_LABEL[r.key],
    importance: importanceOf(r.key),
    score: r.score,
    detail: r.detail,
  }))
}

/** 案件要件 × プロフィールのマッチ率を算出する */
export const calcMatch = (profile: MatchProfile, project: Project): MatchResult => {
  const requirements = project.requirements.map((r) => evaluateRequirement(profile, r))
  const conditions = evaluateConditions(profile, project)

  let weighted = 0
  let total = 0

  for (const r of requirements) {
    const w = IMPORTANCE_WEIGHT[r.requirement.importance]
    weighted += w * r.score
    total += w
  }
  for (const c of conditions) {
    const w = IMPORTANCE_WEIGHT[c.importance]
    weighted += w * c.score
    total += w
  }

  const musts = requirements.filter((r) => r.requirement.importance === 'must')
  return {
    score: total === 0 ? 0 : Math.round((weighted / total) * 100),
    requirements,
    conditions,
    mustHit: musts.filter((r) => r.status !== 'miss').length,
    mustTotal: musts.length,
  }
}

/** マッチ候補として算出する最大件数（一覧・詳細とも共通） */
export const MAX_MATCH_RESULTS = 10

export interface RankedProfile<T extends MatchProfile> {
  profile: T
  match: MatchResult
}

/** 案件に対してマッチ率上位のプロフィールを返す。limit 省略時は全件 */
export const rankProfiles = <T extends MatchProfile>(
  profiles: T[],
  project: Project,
  limit?: number,
): RankedProfile<T>[] =>
  profiles
    .map((profile) => ({ profile, match: calcMatch(profile, project) }))
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, limit)

export interface RankedProject {
  project: Project
  match: MatchResult
}

/** プロフィールに対してマッチ率上位の案件を返す。limit 省略時は全件 */
export const rankProjects = (
  profile: MatchProfile,
  projects: Project[],
  limit?: number,
): RankedProject[] =>
  projects
    .map((project) => ({ project, match: calcMatch(profile, project) }))
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, limit)

/** マッチ率の評価ランク（バッジ色分け用） */
export const matchRank = (score: number): 'high' | 'mid' | 'low' =>
  score >= 80 ? 'high' : score >= 60 ? 'mid' : 'low'
