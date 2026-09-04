import type { Mail, Project, Talent } from '../types'

/**
 * 仮データ：受信メール。
 * classified: true = AI 分類済み（Gmail ラベル付与済み）→ 次回読み込みの対象外
 * classified: false = 未分類。トップページの「メールを読み込む」で分類される
 */
export const mails: Mail[] = [
  {
    id: 'm01',
    subject: '【急募】React/TypeScript フロントエンド開発（渋谷・週2リモート可）',
    fromName: '株式会社テックブリッジ 営業部',
    fromAddress: 'sales@techbridge.example.co.jp',
    receivedAt: '2026-09-01T09:12:00',
    excerpt: 'お世話になっております。下記案件についてご要員のご提案をお願いいたします。',
    body: `お世話になっております。
株式会社テックブリッジ 営業部の佐藤です。

下記案件についてご要員のご提案をお願いいたします。

■案件名
React/TypeScript フロントエンド開発

■背景
自社 SaaS のフロントエンドリニューアルです。
既存 SPA の React 化と、コンポーネント基盤の整備をお願いします。

■募集要件
・React 3年以上（必須）
・TypeScript 2年以上（必須）
・Next.js の実務経験（尚可）
・基本設計からの参画（尚可）
・AWS の知見（不問）

■条件
勤務地：東京（渋谷）※週2リモート可
単価　：65〜80万円/月（スキル見合い）
開始　：2026/09/15
期間　：長期（3ヶ月更新）
最寄駅：渋谷駅
人数　：2名
時間　：9:30〜18:30（休憩60分）
精算　：140〜180h
商流　：プライム
面談　：1回（オンライン）
年齢　：45歳まで
国籍　：日本国籍の方に限ります

ご提案いただける方がいらっしゃいましたら、
スキルシートを添付のうえご返信ください。

--------------------------------------
株式会社テックブリッジ 営業部
sales@techbridge.example.co.jp
--------------------------------------`,
    label: 'project',
    classified: true,
    confidence: 0.96,
  },
  {
    id: 'm02',
    subject: '【案件】Java/Spring 業務システム改修 PL候補募集（大手町常駐）',
    fromName: 'ネクストシステムズ 佐々木',
    fromAddress: 'sasaki@next-systems.example.jp',
    receivedAt: '2026-09-01T10:34:00',
    excerpt: '9月開始、長期案件です。要件定義から入っていただける方を探しております。',
    body: `お世話になっております。ネクストシステムズの佐々木です。

9月開始、長期案件です。要件定義から入っていただける方を探しております。

【案件】Java/Spring 業務システム改修 PL候補
【概要】大手金融向け業務システムの改修案件です。
　　　　チーム8名の取りまとめをお願いします。
【場所】東京（大手町）常駐
【単価】80〜95万円/月
【期間】2026/09 〜 2027/03（延長あり）
【駅】大手町駅
【人数】1名
【時間】9:00〜18:00（休憩60分）
【精算】140〜180h
【商流】2次請け
【面談】2回
【年齢】50歳まで
【国籍】日本国籍のみ

【必須】
　Java 5年以上
　Spring Boot 3年以上
　PL/PM 経験 2年以上
【尚可】
　要件定義の経験
　Oracle
【不問】
　応用情報技術者

面談は1回（オンライン可）を予定しております。
ご検討のほどよろしくお願いいたします。

ネクストシステムズ株式会社
佐々木 / sasaki@next-systems.example.jp`,
    label: 'project',
    classified: true,
    confidence: 0.94,
  },
  {
    id: 'm03',
    subject: 'AWSインフラ/SRE 募集のご案内（フルリモート・関西可）',
    fromName: 'クラウドリンク株式会社',
    fromAddress: 'info@cloudlink.example.com',
    receivedAt: '2026-09-01T11:02:00',
    excerpt: 'Terraform による IaC 化を進めているプロジェクトです。',
    body: `クラウドリンク株式会社です。
いつもお世話になっております。

Terraform による IaC 化を進めているプロジェクトです。
フルリモートのため、関西以外の方もご相談いただけます。

────────────────────
案件名：AWSインフラ / SRE（IaC推進）
────────────────────
既存インフラの Terraform 化と EKS 移行が主なミッションです。
移行後は監視・SLO 設計まで含めて SRE として関わっていただきます。

・勤務地：大阪（フルリモート可）
・単価：70〜90万円/月
・開始：2026/09/15 〜 長期
・最寄駅：本町駅（出社時のみ）
・募集人数：1名
・勤務時間：9:00〜18:00（休憩60分）
・精算幅：140〜180h
・商流：エンド直
・面談回数：1回（オンライン）
・年齢制限：なし
・外国籍：日本語ビジネスレベル（N1相当）であれば可

＜必須＞
　AWS 4年以上
　Terraform 2年以上
＜尚可＞
　Kubernetes（EKS）
　Python での運用自動化
＜不問＞
　AWS認定ソリューションアーキテクト

ご提案お待ちしております。

クラウドリンク株式会社
info@cloudlink.example.com`,
    label: 'project',
    classified: true,
    confidence: 0.91,
  },
  {
    id: 'm04',
    subject: '【人材】PHP/Laravel 3年 20代後半 即日 65万〜',
    fromName: 'ワンステップ株式会社 人材部',
    fromAddress: 'jinzai@onestep.example.jp',
    receivedAt: '2026-09-01T11:40:00',
    excerpt: '弊社所属メンバーのご紹介です。ご検討よろしくお願いいたします。',
    label: 'talent',
    classified: true,
    confidence: 0.93,
  },
  {
    id: 'm05',
    subject: 'Go/マイクロサービス 決済系バックエンド募集',
    fromName: 'ペイテックソリューションズ',
    fromAddress: 'recruit@paytech.example.co.jp',
    receivedAt: '2026-09-01T13:20:00',
    excerpt: '決済基盤のリプレイス案件です。単価応相談（〜100万）。',
    body: `お世話になっております。
ペイテックソリューションズの採用担当です。

決済基盤のリプレイス案件です。単価応相談（〜100万）。

■ Go / マイクロサービス 決済系バックエンド

決済基盤のマイクロサービス化に伴い、
gRPC ベースの新規サービスの設計・実装をお願いします。

必須：Go 3年以上
尚可：gRPC / Kubernetes / PostgreSQL
不問：基本設計の経験

勤務地：東京（一部リモート可）
単価　：85〜100万円/月
稼働　：2026/10/01 〜 長期
最寄駅：五反田駅
人数　：3名
時間　：10:00〜19:00（休憩60分）
精算　：150〜190h
商流　：プライム
面談　：2回
年齢　：45歳まで
国籍　：日本国籍の方に限ります

決済ドメインの経験は問いませんが、
可用性を意識した設計ができる方を希望しております。

ペイテックソリューションズ株式会社
recruit@paytech.example.co.jp`,
    label: 'project',
    classified: true,
    confidence: 0.89,
  },
  {
    id: 'm06',
    subject: '【ご紹介】インフラエンジニア AWS/Terraform 8年 30代',
    fromName: 'サンライズテック 営業',
    fromAddress: 'eigyo@sunrise-tech.example.jp',
    receivedAt: '2026-09-01T14:05:00',
    excerpt: '10月から稼働可能なインフラエンジニアをご紹介いたします。',
    label: 'talent',
    classified: true,
    confidence: 0.9,
  },
  {
    id: 'm07',
    subject: '請求書送付のご案内（2026年8月分）',
    fromName: '経理部',
    fromAddress: 'keiri@partner.example.jp',
    receivedAt: '2026-09-01T15:11:00',
    excerpt: '8月分の請求書を添付にてお送りいたします。',
    label: 'other',
    classified: true,
    confidence: 0.98,
  },
  {
    id: 'm08',
    subject: 'Vue/Nuxt ECサイトリニューアル フロントエンド（フルリモート）',
    fromName: 'デジタルコマース株式会社',
    fromAddress: 'partner@digital-commerce.example.com',
    receivedAt: '2026-09-01T16:22:00',
    excerpt: '既存 EC サイトの Nuxt3 リニューアル案件です。',
    body: `デジタルコマース株式会社でございます。

既存 EC サイトの Nuxt3 リニューアル案件です。
フルリモートでの参画が可能です。

▼案件概要
　既存 EC サイトの Nuxt3 リプレイスです。
　デザインシステムの構築も並行して進めます。

▼スキル
　必須：Vue.js 3年以上 / Nuxt.js 1年以上
　尚可：TypeScript / Figma でのデザイン連携
　不問：詳細設計からの参画

▼条件
　勤務地：東京（フルリモート）
　単価　：60〜75万円/月
　期間　：2026/09/15 〜 2027/02
　最寄駅：新宿駅
　人数　：2名
　時間　：9:30〜18:30（休憩60分）
　精算　：140〜180h
　商流　：2次請け
　面談　：1回
　年齢　：40歳まで
　国籍　：不問

ご検討よろしくお願いいたします。

デジタルコマース株式会社
partner@digital-commerce.example.com`,
    label: 'project',
    classified: true,
    confidence: 0.95,
  },
  {
    id: 'm09',
    subject: '【人材紹介】テスト設計・QA 7年 女性 30代前半',
    fromName: 'クオリティパートナーズ',
    fromAddress: 'sales@quality-partners.example.jp',
    receivedAt: '2026-09-01T17:03:00',
    excerpt: 'QA エンジニアのご提案です。E2E 自動化の経験もございます。',
    label: 'talent',
    classified: true,
    confidence: 0.88,
  },
  {
    id: 'm10',
    subject: '【定期】9月度 協力会社様向け勉強会のご案内',
    fromName: 'パートナー事務局',
    fromAddress: 'event@partner-office.example.jp',
    receivedAt: '2026-09-01T18:00:00',
    excerpt: '今月の勉強会テーマは「生成AIの業務活用」です。',
    label: 'other',
    classified: true,
    confidence: 0.97,
  },

  // --- ここから未分類（読み込み対象） ---
  {
    id: 'm11',
    subject: 'Python/Django データ基盤構築のご相談',
    fromName: 'データフォージ株式会社',
    fromAddress: 'contact@dataforge.example.com',
    receivedAt: '2026-09-02T08:15:00',
    excerpt: 'BigQuery を用いたデータ基盤の構築メンバーを募集しております。',
    body: `お世話になっております。データフォージ株式会社です。

BigQuery を用いたデータ基盤の構築メンバーを募集しております。

■Python/Django データ基盤構築
BigQuery を中心としたデータ基盤の構築と、
社内向け API の提供をお願いします。分析チームとの協業があります。

■必須スキル
・Python 4年以上
・Django 2年以上

■尚可
・BigQuery / GCP
・SQL でのパフォーマンスチューニング

■条件
東京（フルリモート）／ 65〜80万円/月
2026/10/01 〜 長期
最寄駅：品川駅／2名／9:00〜18:00（休憩60分）
精算 140〜180h ／ 商流：プライム ／ 面談1回
年齢不問／外国籍は日本語N1以上であれば可

まずはスキルシートのみでも構いませんので、
ご連絡いただけますと幸いです。

データフォージ株式会社
contact@dataforge.example.com`,
    label: null,
    classified: false,
  },
  {
    id: 'm12',
    subject: '【新規】モバイルアプリ（React Native）改修案件',
    fromName: 'モバイルワークス 高橋',
    fromAddress: 'takahashi@mobileworks.example.jp',
    receivedAt: '2026-09-02T08:41:00',
    excerpt: '既存アプリの機能追加・改修をお願いできる方を探しています。',
    body: `モバイルワークスの高橋です。
お世話になっております。

既存アプリの機能追加・改修をお願いできる方を探しています。

＜案件＞モバイルアプリ（React Native）改修
　既存 React Native アプリの機能追加と改修です。
　iOS / Android の両対応をお願いします。

＜必須＞
　React Native 2年以上
　TypeScript 2年以上
＜尚可＞
　Firebase（Analytics / Crashlytics）
＜不問＞
　Swift でのネイティブモジュール実装

＜条件＞
　フルリモート（東京）
　65〜78万円/月
　2026/09/15 〜 2027/03
　最寄駅：恵比寿駅（出社時のみ）
　募集人数：1名
　勤務時間：10:00〜19:00（休憩60分）
　精算幅：140〜180h
　商流：エンド直
　面談：1回
　年齢：45歳まで
　外国籍：可

ご提案お待ちしております。

モバイルワークス株式会社 高橋
takahashi@mobileworks.example.jp`,
    label: null,
    classified: false,
  },
  {
    id: 'm13',
    subject: 'ご紹介：C#/.NET 業務システム 10年 フルリモート希望',
    fromName: 'ノースブリッジ株式会社',
    fromAddress: 'sales@northbridge.example.jp',
    receivedAt: '2026-09-02T09:05:00',
    excerpt: '10月中旬から稼働可能な .NET エンジニアのご紹介です。',
    label: null,
    classified: false,
  },
  {
    id: 'm14',
    subject: '【案件】データ分析基盤 BIダッシュボード構築（週1出社）',
    fromName: 'アナリティクスラボ',
    fromAddress: 'info@analytics-lab.example.co.jp',
    receivedAt: '2026-09-02T09:33:00',
    excerpt: 'Snowflake / dbt での DWH 構築と可視化をお願いします。',
    body: `アナリティクスラボです。いつもお世話になっております。

Snowflake / dbt での DWH 構築と可視化をお願いします。

【案件名】データ分析基盤 / BIダッシュボード構築
【内容】
　Snowflake + dbt による DWH 構築と、
　BI ダッシュボードの設計・実装をお任せします。
　事業部門へのヒアリングも発生します。

【必須】SQL 5年以上 / Snowflake 1年以上
【尚可】Airflow でのワークフロー構築 / Python
【不問】Tableau

【勤務地】東京（週2〜3出社）
【単価】70〜85万円/月
【開始】2026/09/15 〜 長期
【最寄駅】田町駅
【人数】2名
【時間】9:00〜18:00（休憩60分）
【精算】150〜190h
【商流】プライム
【面談】2回
【年齢】50歳まで
【国籍】日本国籍のみ

ご不明点がありましたらお気軽にお問い合わせください。

アナリティクスラボ株式会社
info@analytics-lab.example.co.jp`,
    label: null,
    classified: false,
  },
  {
    id: 'm15',
    subject: 'サーバーメンテナンス実施のお知らせ',
    fromName: 'システム管理課',
    fromAddress: 'sysadmin@partner.example.jp',
    receivedAt: '2026-09-02T09:50:00',
    excerpt: '9/5（土）深夜にメンテナンスを実施いたします。',
    label: null,
    classified: false,
  },
]

/** 仮データ：メールから抽出された案件情報 */
export const projects: Project[] = [
  {
    mailId: 'm01',
    id: 'p01',
    title: 'React/TypeScript フロントエンド開発',
    client: '株式会社テックブリッジ',
    location: '東京',
    workStyle: 'hybrid',
    rateMin: 65,
    rateMax: 80,
    startFrom: '2026-09-15',
    period: '2026/09 〜 長期（3ヶ月更新）',
    headcount: 2,
    nearestStation: '渋谷駅',
    settlementMin: 140,
    settlementMax: 180,
    interviewCount: 1,
    contractTier: 'prime',
    ageLimit: 45,
    foreignerPolicy: 'denied',
    workHours: '9:30〜18:30（休憩60分）',
    summary: '自社 SaaS のフロントエンドリニューアル。既存 SPA の React 化とコンポーネント基盤整備。',
    requirements: [
      { id: 'p01r1', label: 'React', category: 'framework', importance: 'must', minYears: 3 },
      { id: 'p01r2', label: 'TypeScript', category: 'language', importance: 'must', minYears: 2 },
      { id: 'p01r3', label: 'Next.js', category: 'framework', importance: 'want' },
      { id: 'p01r4', label: '基本設計', category: 'process', importance: 'want' },
      { id: 'p01r5', label: 'AWS', category: 'infra', importance: 'any' },
    ],
  },
  {
    mailId: 'm02',
    id: 'p02',
    title: 'Java/Spring 業務システム改修 PL候補',
    client: 'ネクストシステムズ株式会社',
    location: '東京',
    workStyle: 'onsite',
    rateMin: 80,
    rateMax: 95,
    startFrom: '2026-09-01',
    period: '2026/09 〜 2027/03（延長あり）',
    headcount: 1,
    nearestStation: '大手町駅',
    settlementMin: 140,
    settlementMax: 180,
    interviewCount: 2,
    contractTier: 'secondary',
    ageLimit: 50,
    foreignerPolicy: 'denied',
    workHours: '9:00〜18:00（休憩60分）',
    summary: '大手金融向け業務システムの改修。要件定義からの参画で、チーム 8 名の取りまとめ。',
    requirements: [
      { id: 'p02r1', label: 'Java', category: 'language', importance: 'must', minYears: 5 },
      { id: 'p02r2', label: 'Spring Boot', category: 'framework', importance: 'must', minYears: 3 },
      { id: 'p02r3', label: 'PL/PM', category: 'process', importance: 'must', minYears: 2 },
      { id: 'p02r4', label: '要件定義', category: 'process', importance: 'want' },
      { id: 'p02r5', label: 'Oracle', category: 'database', importance: 'want' },
      { id: 'p02r6', label: '応用情報技術者', category: 'certification', importance: 'any' },
    ],
  },
  {
    mailId: 'm03',
    id: 'p03',
    title: 'AWSインフラ / SRE（IaC推進）',
    client: 'クラウドリンク株式会社',
    location: '大阪',
    workStyle: 'remote',
    rateMin: 70,
    rateMax: 90,
    startFrom: '2026-09-15',
    period: '2026/09 〜 長期',
    headcount: 1,
    nearestStation: '本町駅',
    settlementMin: 140,
    settlementMax: 180,
    interviewCount: 1,
    contractTier: 'end',
    foreignerPolicy: 'conditional',
    workHours: '9:00〜18:00（休憩60分）',
    summary: '既存インフラの Terraform 化と EKS 移行。監視・SLO 設計まで含めた SRE ポジション。',
    requirements: [
      { id: 'p03r1', label: 'AWS', category: 'infra', importance: 'must', minYears: 4 },
      { id: 'p03r2', label: 'Terraform', category: 'infra', importance: 'must', minYears: 2 },
      { id: 'p03r3', label: 'Kubernetes', category: 'infra', importance: 'want' },
      { id: 'p03r4', label: 'Python', category: 'language', importance: 'want' },
      { id: 'p03r5', label: 'AWS認定ソリューションアーキテクト', category: 'certification', importance: 'any' },
    ],
  },
  {
    mailId: 'm05',
    id: 'p04',
    title: 'Go / マイクロサービス 決済系バックエンド',
    client: 'ペイテックソリューションズ株式会社',
    location: '東京',
    workStyle: 'hybrid',
    rateMin: 85,
    rateMax: 100,
    startFrom: '2026-10-01',
    period: '2026/10 〜 長期',
    headcount: 3,
    nearestStation: '五反田駅',
    settlementMin: 150,
    settlementMax: 190,
    interviewCount: 2,
    contractTier: 'prime',
    ageLimit: 45,
    foreignerPolicy: 'denied',
    workHours: '10:00〜19:00（休憩60分）',
    summary: '決済基盤のマイクロサービス化。gRPC ベースの新規サービス設計・実装。',
    requirements: [
      { id: 'p04r1', label: 'Go', category: 'language', importance: 'must', minYears: 3 },
      { id: 'p04r2', label: 'gRPC', category: 'framework', importance: 'want' },
      { id: 'p04r3', label: 'Kubernetes', category: 'infra', importance: 'want' },
      { id: 'p04r4', label: 'PostgreSQL', category: 'database', importance: 'want' },
      { id: 'p04r5', label: '基本設計', category: 'process', importance: 'any' },
    ],
  },
  {
    mailId: 'm08',
    id: 'p05',
    title: 'Vue/Nuxt ECサイトリニューアル',
    client: 'デジタルコマース株式会社',
    location: '東京',
    workStyle: 'remote',
    rateMin: 60,
    rateMax: 75,
    startFrom: '2026-09-15',
    period: '2026/09 〜 2027/02',
    headcount: 2,
    nearestStation: '新宿駅',
    settlementMin: 140,
    settlementMax: 180,
    interviewCount: 1,
    contractTier: 'secondary',
    ageLimit: 40,
    foreignerPolicy: 'allowed',
    workHours: '9:30〜18:30（休憩60分）',
    summary: '既存 EC サイトの Nuxt3 リプレイス。デザインシステムの構築も並行して実施。',
    requirements: [
      { id: 'p05r1', label: 'Vue.js', category: 'framework', importance: 'must', minYears: 3 },
      { id: 'p05r2', label: 'Nuxt.js', category: 'framework', importance: 'must', minYears: 1 },
      { id: 'p05r3', label: 'TypeScript', category: 'language', importance: 'want' },
      { id: 'p05r4', label: 'Figma', category: 'other', importance: 'want' },
      { id: 'p05r5', label: '詳細設計', category: 'process', importance: 'any' },
    ],
  },
  {
    mailId: 'm11',
    id: 'p06',
    title: 'Python/Django データ基盤構築',
    client: 'データフォージ株式会社',
    location: '東京',
    workStyle: 'remote',
    rateMin: 65,
    rateMax: 80,
    startFrom: '2026-10-01',
    period: '2026/10 〜 長期',
    headcount: 2,
    nearestStation: '品川駅',
    settlementMin: 140,
    settlementMax: 180,
    interviewCount: 1,
    contractTier: 'prime',
    foreignerPolicy: 'conditional',
    workHours: '9:00〜18:00（休憩60分）',
    summary: 'BigQuery を中心としたデータ基盤の構築と API 提供。分析チームとの協業あり。',
    requirements: [
      { id: 'p06r1', label: 'Python', category: 'language', importance: 'must', minYears: 4 },
      { id: 'p06r2', label: 'Django', category: 'framework', importance: 'must', minYears: 2 },
      { id: 'p06r3', label: 'BigQuery', category: 'database', importance: 'want' },
      { id: 'p06r4', label: 'GCP', category: 'infra', importance: 'want' },
      { id: 'p06r5', label: 'SQL', category: 'database', importance: 'any' },
    ],
  },
  {
    mailId: 'm12',
    id: 'p07',
    title: 'モバイルアプリ（React Native）改修',
    client: 'モバイルワークス株式会社',
    location: '東京',
    workStyle: 'remote',
    rateMin: 65,
    rateMax: 78,
    startFrom: '2026-09-15',
    period: '2026/09 〜 2027/03',
    headcount: 1,
    nearestStation: '恵比寿駅',
    settlementMin: 140,
    settlementMax: 180,
    interviewCount: 1,
    contractTier: 'end',
    ageLimit: 45,
    foreignerPolicy: 'allowed',
    workHours: '10:00〜19:00（休憩60分）',
    summary: '既存 React Native アプリの機能追加と改修。iOS/Android 両対応。',
    requirements: [
      { id: 'p07r1', label: 'React Native', category: 'framework', importance: 'must', minYears: 2 },
      { id: 'p07r2', label: 'TypeScript', category: 'language', importance: 'must', minYears: 2 },
      { id: 'p07r3', label: 'Firebase', category: 'infra', importance: 'want' },
      { id: 'p07r4', label: 'Swift', category: 'language', importance: 'any' },
    ],
  },
  {
    mailId: 'm14',
    id: 'p08',
    title: 'データ分析基盤 / BIダッシュボード構築',
    client: 'アナリティクスラボ株式会社',
    location: '東京',
    workStyle: 'hybrid',
    rateMin: 70,
    rateMax: 85,
    startFrom: '2026-09-15',
    period: '2026/09 〜 長期',
    headcount: 2,
    nearestStation: '田町駅',
    settlementMin: 150,
    settlementMax: 190,
    interviewCount: 2,
    contractTier: 'prime',
    ageLimit: 50,
    foreignerPolicy: 'denied',
    workHours: '9:00〜18:00（休憩60分）',
    summary: 'Snowflake + dbt による DWH 構築と、BI ダッシュボードの設計・実装。',
    requirements: [
      { id: 'p08r1', label: 'SQL', category: 'database', importance: 'must', minYears: 5 },
      { id: 'p08r2', label: 'Snowflake', category: 'database', importance: 'must', minYears: 1 },
      { id: 'p08r3', label: 'Airflow', category: 'framework', importance: 'want' },
      { id: 'p08r4', label: 'Python', category: 'language', importance: 'want' },
      { id: 'p08r5', label: 'Tableau', category: 'other', importance: 'any' },
    ],
  },
]

/** 仮データ：メールから抽出された人材情報（他社からの提案） */
export const talents: Talent[] = [
  {
    mailId: 'm04',
    id: 't01',
    name: 'K.M（ワンステップ株式会社）',
    company: 'ワンステップ株式会社',
    age: 27,
    location: '東京都',
    workAreas: ['東京', 'リモート'],
    workStyle: 'hybrid',
    desiredRate: 65,
    availableFrom: '2026-09-01',
    summary: 'PHP/Laravel での自社サービス開発 3 年。管理画面の Vue 実装も対応可。',
    skills: [
      { name: 'PHP', category: 'language', years: 3 },
      { name: 'Laravel', category: 'framework', years: 3 },
      { name: 'MySQL', category: 'database', years: 3 },
      { name: 'Vue.js', category: 'framework', years: 2 },
    ],
    conditions: [
      { key: 'area', importance: 'want' },
      { key: 'workStyle', importance: 'want' },
      { key: 'rate', importance: 'must' },
      { key: 'timing', importance: 'any' },
    ],
  },
  {
    mailId: 'm06',
    id: 't02',
    name: 'S.T（サンライズテック）',
    company: 'サンライズテック株式会社',
    age: 34,
    location: '兵庫県',
    workAreas: ['大阪', 'リモート'],
    workStyle: 'remote',
    desiredRate: 80,
    availableFrom: '2026-10-01',
    summary: 'AWS / Terraform を中心としたインフラ構築 8 年。EKS 運用経験あり。',
    skills: [
      { name: 'AWS', category: 'infra', years: 8 },
      { name: 'Terraform', category: 'infra', years: 4 },
      { name: 'Kubernetes', category: 'infra', years: 3 },
      { name: 'Python', category: 'language', years: 4 },
      { name: 'AWS認定ソリューションアーキテクト', category: 'certification', years: 2 },
    ],
    conditions: [
      { key: 'area', importance: 'must' },
      { key: 'workStyle', importance: 'must' },
      { key: 'rate', importance: 'want' },
      { key: 'timing', importance: 'want' },
    ],
  },
  {
    mailId: 'm09',
    id: 't03',
    name: 'A.N（クオリティパートナーズ）',
    company: 'クオリティパートナーズ株式会社',
    age: 32,
    location: '千葉県',
    workAreas: ['東京', '千葉', 'リモート'],
    workStyle: 'hybrid',
    desiredRate: 58,
    availableFrom: '2026-09-01',
    summary: 'テスト設計・QA 7 年。Playwright による E2E 自動化の導入経験。',
    skills: [
      { name: 'テスト設計', category: 'process', years: 7 },
      { name: 'Playwright', category: 'framework', years: 2 },
      { name: 'Selenium', category: 'framework', years: 3 },
      { name: 'JSTQB Foundation Level', category: 'certification', years: 4 },
    ],
    conditions: [
      { key: 'area', importance: 'want' },
      { key: 'workStyle', importance: 'want' },
      { key: 'rate', importance: 'any' },
      { key: 'timing', importance: 'any' },
    ],
  },
  {
    mailId: 'm13',
    id: 't04',
    name: 'Y.K（ノースブリッジ）',
    company: 'ノースブリッジ株式会社',
    age: 37,
    location: '北海道',
    workAreas: ['北海道', 'リモート'],
    workStyle: 'remote',
    desiredRate: 62,
    availableFrom: '2026-10-15',
    summary: 'C#/.NET の業務システム開発 10 年。Azure への移行対応も可能。',
    skills: [
      { name: 'C#', category: 'language', years: 10 },
      { name: '.NET', category: 'framework', years: 9 },
      { name: 'SQL Server', category: 'database', years: 8 },
      { name: 'Azure', category: 'infra', years: 3 },
    ],
    conditions: [
      { key: 'area', importance: 'must' },
      { key: 'workStyle', importance: 'must' },
      { key: 'rate', importance: 'any' },
      { key: 'timing', importance: 'want' },
    ],
  },
]
