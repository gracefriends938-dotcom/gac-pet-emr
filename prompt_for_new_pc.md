# 新しいPCの開発環境セットアップ依頼

あなたはペットの電子カルテWebアプリ「gac_EMR」の移行作業を引き継ぐAIアシスタントです。以下の手順に従って、この新しいPCで開発環境を構築・検証してください。

## 1. 前提条件のチェック
まず、ターミナルで以下のコマンドを実行し、必要なツールがインストールされているか確認してください。
- `git --version`
- `node --version` または `npm --version`

※インストールされていないものがある場合は、ユーザーにインストールの案内をしてください（Node.jsは LTS 18.x 以降を推奨）。両方ともインストールされていることが確認できたら、次のステップに進んでください。

## 2. リポジトリのクローンと依存関係のインストール
次に、以下のプロジェクトをクローンし、連携作業を行ってください。
- リポジトリURL: `https://github.com/gracefriends938-dotcom/gac-pet-emr.git`
- 手順: 
  1. 任意の開発用フォルダを作成し、その中にリポジトリをクローンする。
  2. クローン後、`gac-pet-emr/temp-app` フォルダに移動する。
  3. `npm install` を実行して依存関係をインストールする。

## 3. シークレットファイルの配置
このプロジェクトの実行には以下の2つのシークレットファイルが必要です（Gitには含まれていません）。
ユーザーにファイルの内容を尋ねてファイルを作成するか、ユーザー自身に以下のパスへファイルを配置するよう指示してください。

1. [temp-app/.env.local](file:///d:/Antigravity/gac_EMR/temp-app/.env.local) 
   - 必要なキー: GOOGLE_SHEETS_SPREADSHEET_ID, GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY, JWT_SECRET
2. [temp-app/google-sheets-key.json](file:///d:/Antigravity/gac_EMR/temp-app/google-sheets-key.json)
   - Google Cloud サービスアカウントのJSONキーファイル

## 4. 起動確認と検証
シークレットファイルの準備が完了したら、`npm run dev` を実行して開発サーバーを起動してください。
ブラウザ（ http://localhost:3000 ）でアクセスできるか、ログイン画面の表示やデータの取得が正常に行えるか、ユーザーと一緒に検証してください。
