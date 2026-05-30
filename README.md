# NumPlace - ナンプレ（数独）Webアプリ

ブラウザで遊べる本格ナンプレ（数独）アプリです。
シングルプレイ・AI NPC対戦・最大4人のマルチプレイに対応し、登録不要で完全無料で遊べます。

## 機能

- **シングルプレイ** — 4段階の難易度（かんたん / ふつう / むずかしい / 鬼）
- **AI NPC対戦** — 本物のアルゴリズム（Naked Single・Hidden Single・バックトラックなど）で動くAIと対戦
- **マルチプレイ（最大4人）** — オンライン対戦（リアルタイム）/ ローカル対戦（同一端末）
- **スコア保存** — ゲストはブラウザに保存、登録ユーザーはサーバーに保存
- **ランキング** — 難易度別・期間別のグローバルランキング
- **ゲストプレイ可** — 登録不要でそのまま遊べる

## 技術スタック

| 分類 | 技術 |
|------|------|
| フロントエンド | Next.js 14 (App Router) + TypeScript |
| スタイリング | Tailwind CSS |
| 状態管理 | Zustand |
| アニメーション | Framer Motion |
| リアルタイム通信 | Socket.io |
| 認証 | NextAuth.js |
| ORM | Prisma |
| データベース | PostgreSQL |
| キャッシュ | Redis |

## ローカルでの起動方法

### 必要なもの

- Node.js 18以上
- npm

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/akki-secure/Numplase.git
cd Numplase

# 依存パッケージをインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## ブランチ運用ルール

このリポジトリは **`main` ブランチへの直接pushを禁止** しています。

```
main           ← 本番用。直接pushは禁止（pre-pushフックでブロック）
  └── feature/xxx   ← 機能追加はここで開発 → Pull Request → main
  └── fix/xxx       ← バグ修正はここで開発 → Pull Request → main
```

作業手順:
1. `git checkout -b feature/作業名` でブランチを作成
2. 開発・コミット
3. `git push origin feature/作業名`
4. GitHub上でPull Requestを作成してレビュー後にmainへマージ

## 開発フェーズ

| フェーズ | 内容 | 状態 |
|----------|------|------|
| Phase 1 | パズル生成・AI NPC・スコア保存 | ✅ 完了 |
| Phase 2 | 認証・DBスコア保存・ランキング | 開発中 |
| Phase 3 | オンラインマルチプレイ | 未着手 |
| Phase 4 | ローカルマルチプレイ | 未着手 |
| Phase 5 | UI仕上げ・PWA対応 | 未着手 |

## ライセンス

MIT
