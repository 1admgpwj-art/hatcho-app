# 帳票くん

見積書・納品書・請求書をワンクリックで連携管理できる、中小企業・個人事業主向けの帳票管理SaaSです。

**公開URL**: https://hatcho-app.vercel.app

---

## 概要

「見積書を作ったら、そのまま納品書・請求書に変換したい」という業務ニーズに応えたWebアプリです。  
インボイス制度にも対応しており、A4 PDFをその場で出力してメール送信まで完結できます。

---

## 主な機能

| 機能 | 概要 |
|---|---|
| 帳票CRUD | 見積書・納品書・請求書の作成・編集・削除 |
| ワンクリック変換 | 見積書→納品書→請求書を自動生成（入力不要） |
| PDF出力 | A4レイアウト・日本語フォント対応 |
| メール送信 | PDF添付メールをアプリ内から送信（Resend） |
| ダッシュボード | 月次売上グラフ・未入金一覧（Recharts） |
| 取引先マスター | 取引先情報の一元管理 |
| 自社情報設定 | インボイス登録番号対応 |
| マルチテナント | 会社ごとの完全なデータ分離 |
| モバイル対応 | ハンバーガーメニュー・レスポンシブレイアウト |

---

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| フレームワーク | Next.js 14 (App Router) + TypeScript |
| DB / ORM | Turso（本番） / SQLite（開発） + Prisma 7 |
| 認証 | NextAuth.js v5（Credentials認証） |
| PDF生成 | @react-pdf/renderer（日本語フォント対応） |
| メール | Resend |
| グラフ | Recharts |
| UI | Tailwind CSS + shadcn/ui（Radix UIベース） |
| デプロイ | Vercel |

---

## アーキテクチャ

```
ブラウザ
  └── Next.js (Vercel)
        ├── App Router（サーバーコンポーネント + Server Actions）
        ├── NextAuth.js（セッション管理）
        └── Prisma ORM
              └── Turso（libSQL / エッジDB）
```

---

## ローカル開発

### 前提
- Node.js 18以上
- npm

### セットアップ

```bash
git clone https://github.com/1admgpwj-art/hatcho-app.git
cd hatcho-app
npm install
```

`.env` ファイルを作成し、以下を設定してください：

```env
DATABASE_URL="file:./prisma/dev.db"
TURSO_AUTH_TOKEN=""        # ローカル開発時は不要
AUTH_SECRET="your-secret"  # 任意の文字列
RESEND_API_KEY=""          # メール送信機能を使う場合
```

### DB初期化 & 起動

```bash
npx prisma migrate dev
npm run dev
```

http://localhost:3000 で起動します。

---

## 画面構成

```
/ ...................... ランディングページ
/login ................. ログイン
/register .............. 新規登録
/dashboard ............. ダッシュボード（売上グラフ・未入金）
/quotes ................ 見積書一覧・作成
/deliveries ............ 納品書一覧
/invoices .............. 請求書一覧
/clients ............... 取引先マスター
/settings .............. 自社情報設定
```

---

## 工夫した点

- **ワンクリック変換フロー**: 見積→納品→請求の各ステージを、データをコピーして自動生成することで二重入力をゼロにしました
- **マルチテナント設計**: 全クエリにユーザーIDを必ず付与し、他社データへのアクセスをORM層で遮断
- **エッジDB採用**: Turso（libSQL）を採用することで、Vercel Edgeと親和性の高い低レイテンシ構成を実現
- **インボイス対応**: 登録番号の設定・PDF印字に対応し、実務で使える品質を目指しました

---

## ライセンス

MIT
