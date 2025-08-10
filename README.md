# えかどん

[絵カードアプリ『えかどん』](https://ekadon.com/)

<img width="1536" height="1024" alt="Image" src="https://github.com/user-attachments/assets/f6457314-10e3-4eaa-925b-e5d30524fe42" />

## 1. 概要
発達障害のお子様やその保護者、療育に携わる教員・指導員の方々にとって使いやすい絵カードアプリを目指しました。

カードを並べてお子様とのコミュニケーションをサポートします。
また、オリジナルのカードやカテゴリーを作成することもできます。

<img width="1157" height="648" alt="Image" src="https://github.com/user-attachments/assets/5febe22b-4f10-4563-bb9a-4327940c11d7" />


## 2. 使用技術
### フロントエンド
* React 19.0.0
* Next.js 15.4.3
* TypeScript 5.8.3

フロントエンドライブラリ
* axios 1.9.0
* zustand　5.0.6

### バックエンド
* PHP 8.2
* Laravel Framework 12.0

バックエンドライブラリ
* Laravel Sanctum 4.0
* Laravel Tinker 2.10.1
* Flysystem AWS S3 v3 3.0
* JWT Auth (tymon/jwt-auth) 2.2

### データベース
* MySQL

### インフラ
* Vercel （フロントエンド）
* AWS （バックエンド）

AWSで利用したサービス
* EC2
* S3
* Route53
* Aurora and RDS
* VPC

### バージョン管理
* Git/GitHub

### その他
* Web Speech API

## 3. ER 図
<img width="731" height="540" alt="eka-ER" src="https://github.com/user-attachments/assets/dbf533fe-5c8c-456e-93cf-af81d1036b0c" />

## 4. インフラ構成図
<img width="1121" height="1155" alt="aws drawio" src="https://github.com/user-attachments/assets/a7f225f5-7f31-46d5-ab5d-2a503aeca7f1" />

## 5. 画面遷移図
<img width="1000" height="1284" alt="Frame 9" src="https://github.com/user-attachments/assets/08b10651-e4e2-40a4-aae4-75a60ef85b85" />

## 機能一覧
### カード関連
* カード選択・デッキ上に表示
* カード作成
* カード編集
* カード削除
* カード読み上げ機能

### カテゴリー関連
* カテゴリー選択・カード一覧を表示
* カテゴリー作成
* カテゴリー編集
* カテゴリー削除

### デッキ関連
* デッキ保存
* デッキ編集
* デッキ削除
* デッキ上の全カード読み上げ機能
* デッキ上の全カード削除機能
* デッキ上の任意のカード削除機能
* デッキ拡大表示

### アカウント関連
* アカウント登録
* ログイン・ログアウト機能
* 作成したカード・カテゴリー・デッキの管理

