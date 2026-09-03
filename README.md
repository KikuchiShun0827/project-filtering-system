# projects filtering system

SES のメール振り分けシステム。**画面構成モック**（仮データ）です。

- AI API による分類は未接続。件名・本文のキーワードで擬似的に分類しています（実装方針は「バックエンド実装方針」を参照）
- Gmail API も未接続。ラベル付与は画面上の表示のみ
- ログインは認証なし。任意の値でログインできます

## 起動

```bash
npm install
npm run dev
```

## 公開（GitHub Pages）

`main` への push で [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) が走り、`https://kikuchishun0827.github.io/project-filtering-system/` に自動デプロイされます（初回のみリポジトリの Settings → Pages → Source を「GitHub Actions」にする必要があります）。

- [`vite.config.ts`](vite.config.ts) の `base` はリポジトリ名に合わせています。リポジトリ名を変えたら合わせて変更してください
- ルーティングは `HashRouter`（URL は `.../#/assignments` の形）。GitHub Pages はパスごとのファイルしか返せず、`BrowserRouter` だとリロードで 404 になるためです
- 認証はモックなので、公開した時点で誰でも閲覧できます。実データを仮データに入れないこと

## 画面

| 画面 | パス | 内容 |
| --- | --- | --- |
| ログイン | `/login` | 認証なし（モック） |
| 案件・人材一覧 | `/` | タブで案件 / 人材 / その他を切り替え。デフォルトは案件一覧。「メールを読み込む」はモーダルで読み込み期間を指定（既定 7 日） |
| 案件詳細 | `/projects/:projectId` | 募集要件とマッチ要員 TOP N（内訳つき）。「参画」から要員をアサイン |
| 参画案件一覧 | `/assignments` | 参画が確定した案件と要員。行右端の「編集」で修正 |
| 要員管理 | `/engineers` | 自社エンジニア一覧 |
| 要員詳細 | `/engineers/:engineerId` | 所持技術・希望条件の重要度設定・マッチ案件 TOP N |
| 設定 | `/settings` | 連携メール / 表示期間 / マッチ率表示件数 / ダークモード / 分類モデル |

## マッチ率のしくみ

[`src/lib/match.ts`](src/lib/match.ts) の `calcMatch()` が算出します。

**重み付き加重平均**（0〜100%）で、重みは重要度から決まります。

| 重要度 | 重み |
| --- | --- |
| 必須 | 5 |
| 尚可 | 2 |
| 不問 | 0.5 |

評価対象は 2 種類です。

1. **案件の募集要件**（`Project.requirements`）… 要員の保有スキルと突き合わせ。
   スコア = `0.5 + 0.5 × min(1, 経験年数 / 要求年数)`（要求年数の既定は 3 年）。該当スキルなしは 0。
2. **要員の就業希望条件**（`MatchProfile.conditions`）… 勤務地 / 稼働形態 / 単価 / 参画時期の 4 項目。
   重要度は要員詳細画面から「必須 / 尚可 / 不問」で変更でき、マッチ率に即座に反映されます。

表示件数は設定画面の「マッチ率の表示件数」（1〜20 件、既定 5 件）で変更します。

一覧に出すメールの範囲は設定画面の「表示期間」（既定 30 日）で決まります。これは表示のフィルタで、読み込み済みのデータは消えません。読み込み時の期間（既定 7 日）とは別の設定です。

## 参画（アサイン）

案件詳細の「参画」ボタンでモーダルを開き、要員・開始日・終了日・単価・備考を入力して確定すると、参画案件一覧に追加されます。

- 要員は**複数選択可**。プルダウンはマッチ率の高い順で、`氏名（ステータス・マッチ率%）` を表示します
- 登録時点のマッチ率を `Assignment.members[].matchScore` に残すので、後から要員のスキルを更新しても登録時の値が残ります
- 案件詳細には「参画メンバー」、要員詳細には「参画案件」の欄が、該当があるときだけ表示されます
- 参画案件一覧の「編集」は登録時と同じモーダルを再利用します（[`src/components/AssignmentModal.tsx`](src/components/AssignmentModal.tsx)）
- 元メールが削除・再分類されて案件が引けない場合は、`Assignment` に控えた案件名・クライアント名を表示します

「メール作成」ボタンは配置のみで未実装です。

## バックエンド実装方針

現状はフロントのみ（[`src/store/DataContext.tsx`](src/store/DataContext.tsx) の `useState` に仮データ）で完結しています。実装時は次の構成を想定しています。

```
Gmail API ──▶ バックエンド ──▶ Claude API ──▶ DB ──▶ フロント（このリポジトリ）
   受信       未処理メール抽出   分類 + JSON 化   永続化    表示・マッチング
```

1. Gmail API で未処理メールを取得（`Mail.classified` 相当のフラグ、または Gmail のラベル有無で判定）
2. 件名・本文を AI API に渡し、**カテゴリ分け**と**JSON への変換**を 1 リクエストで実行
3. 返ってきた JSON を検証して DB に保存し、Gmail 側にラベルを付与
4. フロントは DB から取得した JSON をそのまま表示・マッチング計算に使う

### AI API にやらせること / やらせないこと

| | 内容 |
| --- | --- |
| **やらせる** | ① メールのカテゴリ分け（案件 / 人材 / その他）<br>② 本文（自然文）から案件・人材情報を JSON 形式へ変換 |
| やらせない | マッチ率の算出（[`src/lib/match.ts`](src/lib/match.ts) の決定的なロジックで計算する）、重複メールの判定、DB への保存 |

マッチ率を AI に出させないのは、同じ入力に対して常に同じ結果が出ること・重要度の変更が即座に反映されることを担保するためです。AI の役割は「非構造データを構造化するところまで」に閉じます。

コスト面でも成立しません。マッチ率は **要員数 × 案件数** の総当たりで、要員 30 名 × 案件 200 件なら 6,000 通り。1 ペアの判定に要員プロフィールと募集要件を渡すと案件あたり 2 万トークン前後になり、全件の再計算だけで数百万トークン（`claude-opus-5` の入力 $5/1M で 1 回十数ドル）かかります。しかも決定的な計算なので、同じ入力を毎回課金して投げ直すことになります。要員詳細の重要度トグルは 1 クリックで全案件のマッチ率が変わる操作ですが、これは同期関数だからこそ即時・無料で成立しています。

### JSON の構成

1 通のメールにつき、次の 1 オブジェクトを返させます。`label` 以外は該当しなければ `null`（その他メール、または本文から読み取れない場合）。

```jsonc
{
  "label": "project",        // "project" | "talent" | "other"
  "confidence": 0.94,        // 0〜1。分類の確信度
  "project": { /* 下記 */ }, // label が "project" のときのみ
  "talent": null             // label が "talent" のときのみ
}
```

**`project`**（フロントの `Project` 型に対応 / [`src/types.ts`](src/types.ts)）

| キー | 型 | 補足 |
| --- | --- | --- |
| `title` | string | 案件名 |
| `client` | string | 発注元・エンドクライアント |
| `location` | string | 勤務地 |
| `workStyle` | `"remote" \| "hybrid" \| "onsite"` | 記載なしは `"onsite"` に寄せず `null` を許容 |
| `rateMin` / `rateMax` | number | 単価（万円/月）。「〜100万」のような片側のみの記載は両方に同値を入れない |
| `startFrom` | string | `YYYY-MM-DD`。「即日」は受信日で解決 |
| `period` | string | 「2026/09 〜 長期（3ヶ月更新）」など原文寄りの自由記述 |
| `summary` | string | 2〜3 文の要約 |
| `requirements` | array | 募集要件（下記） |

`requirements[]` の 1 要素：

| キー | 型 | 補足 |
| --- | --- | --- |
| `label` | string | 「React」「要件定義」など要件名 |
| `category` | `"language" \| "framework" \| "infra" \| "database" \| "process" \| "certification" \| "other"` | |
| `importance` | `"must" \| "want" \| "any"` | 「必須」「尚可」「不問」に対応。マッチ率の重みになる |
| `minYears` | number \| null | 要求年数。記載がなければ `null`（既定 3 年として計算される） |

**`talent`**（`Talent` 型に対応）

| キー | 型 | 補足 |
| --- | --- | --- |
| `name` | string | 匿名の場合は「A 氏」等をそのまま |
| `company` | string | 所属会社 |
| `age` | number | |
| `location` | string | 居住地 |
| `workAreas` | string[] | 対応可能エリア |
| `workStyle` | `"remote" \| "hybrid" \| "onsite"` | |
| `desiredRate` | number | 希望単価下限（万円/月） |
| `availableFrom` | string | `YYYY-MM-DD` |
| `summary` | string | 経歴の要約 |
| `skills` | array | `{ name, category, years, note }`。`category` は `requirements` と同じ 7 種 |

`id` / `mailId` はバックエンド側で採番・付与します（AI には出させない）。

<details>
<summary>返却例</summary>

```json
{
  "label": "project",
  "confidence": 0.94,
  "project": {
    "title": "React/TypeScript フロントエンド開発",
    "client": "株式会社テックブリッジ",
    "location": "東京",
    "workStyle": "hybrid",
    "rateMin": 65,
    "rateMax": 80,
    "startFrom": "2026-09-15",
    "period": "2026/09 〜 長期（3ヶ月更新）",
    "summary": "自社 SaaS のフロントエンドリニューアル。既存 SPA の React 化とコンポーネント基盤整備。",
    "requirements": [
      { "label": "React", "category": "framework", "importance": "must", "minYears": 3 },
      { "label": "TypeScript", "category": "language", "importance": "must", "minYears": 2 },
      { "label": "Next.js", "category": "framework", "importance": "want", "minYears": null }
    ]
  },
  "talent": null
}
```

</details>

### メール原文（`body`）の扱い

案件詳細でメールをそのまま読めるようにするため、**本文の全文を `body` として保持します**。ただし AI の出力には含めません。本文はバックエンドが Gmail API から取得した時点で手元にあるので、AI に丸ごと書き戻させると出力トークンが本文ぶんそのまま二重にかかるうえ、要約・整形されて原文でなくなるリスクがあります。

- AI に渡すのは入力だけ。出力は上記の抽出結果（`label` / `confidence` / `project` / `talent`）のみ
- `body` は Gmail の本文（`text/plain` を優先、なければ HTML からタグを落としたもの）を**無加工で** DB に保存する
- フロントへは `Mail` の一部として返す。既存の `excerpt` は一覧のプレビュー用に残し、`body` は詳細表示用

保存する `Mail`（[`src/types.ts`](src/types.ts) の `Mail` 型 + `body`）：

```jsonc
{
  "id": "m01",                                  // Gmail のメッセージ ID
  "subject": "【急募】React/TypeScript フロントエンド開発（渋谷・週2リモート可）",
  "fromName": "株式会社テックブリッジ 営業部",
  "fromAddress": "sales@techbridge.example.co.jp",
  "receivedAt": "2026-09-01T09:12:00",
  "excerpt": "お世話になっております。下記案件についてご要員のご提案をお願いいたします。",
  "body": "お世話になっております。\n株式会社テックブリッジの佐藤です。\n\n下記案件についてご要員のご提案をお願いいたします。\n\n■案件名：React/TypeScript フロントエンド開発\n■勤務地：東京（渋谷）／週2リモート可\n...",  // 本文全文（無加工）
  "label": "project",                           // AI の出力
  "confidence": 0.96,                           // AI の出力
  "classified": true,
  "manualOverride": false
}
```


### 呼び出し方（TypeScript / Anthropic SDK）

**Structured Outputs**（`output_config.format`）でスキーマを渡すと、JSON 形式が保証されパースの失敗を気にせず済みます。Zod スキーマをそのまま渡せる `messages.parse()` を使います。

```bash
npm install @anthropic-ai/sdk zod
```

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { z } from 'zod'

const SKILL_CATEGORY = z.enum([
  'language', 'framework', 'infra', 'database', 'process', 'certification', 'other',
])
const WORK_STYLE = z.enum(['remote', 'hybrid', 'onsite'])

const ProjectSchema = z.object({
  title: z.string(),
  client: z.string(),
  location: z.string(),
  workStyle: WORK_STYLE.nullable(),
  rateMin: z.number().nullable(),
  rateMax: z.number().nullable(),
  startFrom: z.string().nullable(),
  period: z.string().nullable(),
  summary: z.string(),
  requirements: z.array(
    z.object({
      label: z.string(),
      category: SKILL_CATEGORY,
      importance: z.enum(['must', 'want', 'any']),
      minYears: z.number().nullable(),
    }),
  ),
})

const MailExtraction = z.object({
  label: z.enum(['project', 'talent', 'other']),
  confidence: z.number(),
  project: ProjectSchema.nullable(),
  talent: TalentSchema.nullable(), // 同様に定義
})

const client = new Anthropic() // ANTHROPIC_API_KEY を環境変数から読む

const response = await client.messages.parse({
  model: 'claude-opus-5',
  max_tokens: 16000,
  system: [
    {
      type: 'text',
      // 分類基準・各項目の解釈ルールを書く。全メールで共通なのでキャッシュが効く
      text: EXTRACTION_RULES,
      cache_control: { type: 'ephemeral' },
    },
  ],
  messages: [
    { role: 'user', content: `件名: ${mail.subject}\n差出人: ${mail.fromAddress}\n\n${mail.body}` },
  ],
  output_config: { format: zodOutputFormat(MailExtraction) },
})

const extracted = response.parsed_output // パースに失敗すると null
```

- **モデル**は `claude-opus-5`（入力 $5 / 出力 $25 per 1M tokens）を既定に。コスト優先なら `claude-haiku-4-5`（$1 / $5）に落として精度を比較する
- **プロンプトキャッシュ**：抽出ルールを書いた system プロンプトは全メール共通なので `cache_control` を付ける。キャッシュヒットは `usage.cache_read_input_tokens` で確認できる
- **まとめて処理する場合**は Message Batches API（`client.messages.batches.create`）を使うと 50% のコストで非同期実行できる。受信メールの定期バッチ処理向き
- 本文が長いメールは切り詰めず、そのまま渡す（コンテキストは 1M トークン）

### API エンドポイント案

| メソッド | パス | 内容 |
| --- | --- | --- |
| `POST` | `/api/mails/sync` | Gmail から取得 → 分類・JSON 化 → 保存。トップの「メールを読み込む」に対応。読み込み期間は `{ days }` で受け取り、Gmail 側の検索条件（`after:`）に反映する |
| `GET` | `/api/mails` | 分類済みメール一覧（`label` で絞り込み） |
| `PATCH` | `/api/mails/:id/label` | ラベルの手動変更。`manualOverride` を立て、Gmail 側も付け替える |
| `DELETE` | `/api/mails/:id` | メールの削除 |
| `GET` | `/api/engineers` ほか | 自社要員の CRUD |
| `GET` / `POST` / `PATCH` | `/api/assignments` | 参画の一覧・登録・更新 |

### 実装上の注意

- **冪等性**：分類済みメールは再処理しない（`Mail.classified`）。Gmail のメッセージ ID を主キーにして二重登録を防ぐ
- **抽出失敗を許容する**：本文から案件情報が読み取れないケースはフロントも想定済み（`ProjectItem.project` が `null` でもカードは表示される）。必須項目が欠けても保存し、画面で「情報なし」を出す
- **`confidence` の活用**：閾値（例: 0.8）を下回るものは「要確認」として人の目でラベルを確定させる運用にする
- **プロンプトと出力の版管理**：抽出ルールを変更したら再抽出が必要になるため、保存レコードにプロンプトのバージョンを持たせておく

## 実装時に差し替える箇所

| 内容 | 場所 |
| --- | --- |
| AI によるメール分類 | [`src/store/DataContext.tsx`](src/store/DataContext.tsx) の `mockClassify()` / `classify()` |
| Gmail のメール取得・ラベル付与 | 同上 `classify()`。分類済み判定は `Mail.classified` |
| 要員データの永続化 | [`src/data/engineers.ts`](src/data/engineers.ts)（現在は静的な仮データ） |
| メール・案件・人材の仮データ | [`src/data/mails.ts`](src/data/mails.ts) |
| 参画データの永続化 | [`src/store/DataContext.tsx`](src/store/DataContext.tsx) の `assignments` / `addAssignment()` / `updateAssignment()` |

分類済みメールは `classified: true` になり、「メールを読み込む」の対象から除外されます（二重読み込みの防止）。
手動でラベルを変更した場合は `manualOverride: true` が付きます。

## 構成

```
src/
├─ components/   Layout, マッチ率表示, 共通 UI
├─ data/         仮データ（要員 / メール・案件・人材）
├─ lib/match.ts  マッチ率の算出ロジック
├─ pages/        各画面
├─ store/        Auth / Settings / Data の Context
└─ types.ts      ドメイン型と表示ラベル
```

設定とログイン状態は `localStorage` に保存されます（キー: `pfs.settings`, `pfs.user`）。
それ以外（メールの分類結果・要員の追加編集・参画）はメモリ上のみで、リロードすると仮データに戻ります。
