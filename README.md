# えかどん

[絵カードアプリ『えかどん』](https://ekadon.com/)

<img width="1536" height="1024" alt="Image" src="https://github.com/user-attachments/assets/f6457314-10e3-4eaa-925b-e5d30524fe42" />

## 1. 概要
発達障害のお子様やその保護者、療育に携わる教員・指導員の方々にとって使いやすい絵カードアプリを目指しました。

カードを並べてお子様とのコミュニケーションをサポートします。
また、オリジナルのカードやカテゴリーを作成することもできます。

<img width="1794" height="1186" alt="アセット 5-8-2" src="https://github.com/user-attachments/assets/7f87a543-ec94-4af8-bc87-035685e67511" />

✅ 要件定義は[こちら](https://github.com/KaGH6/ekadon/blob/main/documents/requirements.md)です。<br>

✅ ペルソナは[こちら](https://github.com/KaGH6/ekadon/blob/main/documents/persona.md)です。

<br>

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

### CI/CD
* Vercel
* GitHub Actions

### その他
* Web Speech API
* OpenAI Images API (DALL·E 3)

## 3. ER 図
<img width="731" height="540" alt="eka-ER" src="https://github.com/user-attachments/assets/dbf533fe-5c8c-456e-93cf-af81d1036b0c" />

## 4. インフラ構成図
<img width="1121" height="1155" alt="aws drawio (1)" src="https://github.com/user-attachments/assets/316a8224-e01f-4727-9637-b711d3008584" />

## 5. 画面遷移図
<img width="1000" height="1333" alt="Frame 12" src="https://github.com/user-attachments/assets/8122dc7d-8288-491f-b3fe-8db7d7bf6825" />


## 6. 機能一覧
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

## 7. アプリの基本操作
| アカウント登録、ログインページ | トップページ |
| --- | --- |
|<img width="574" height="512" alt="Group 111" src="https://github.com/user-attachments/assets/06b72327-7251-4f53-b7dc-3a91f06079de" />|<img width="574" height="512" alt="Group 116" src="https://github.com/user-attachments/assets/cd2f5f34-4172-45ca-9ab5-ddadaf0a56db" />|
|・メールアドレス、ユーザー名、パスワードで新規登録・ログインすることができます。|・『えかどん』の主な機能の一覧と、使い方ガイドへのボタンが表示されています。　　　　　　　 |

| カテゴリー一覧 | カード一覧 |
| --- | --- |
|<img width="574" height="512" alt="Group 124" src="https://github.com/user-attachments/assets/bf2134f8-5bba-4320-9a85-160ced179e41" />|<img width="574" height="512" alt="Group 126" src="https://github.com/user-attachments/assets/93666f64-4c36-41b0-8aae-96bd341b17dc" />|
|・カテゴリー一覧画面から、好きなカテゴリーを選択します。<br>・カテゴリーの編集・削除もできます。<br>※デフォルトのカテゴリーは編集・削除できません。　　　　　　　　　　　　　　　 　　　|・好きなカテゴリーを選択後、そのカテゴリーの中から好きなカードを選択し、画面上部のデッキにカードを表示させることができます。<br>・デッキに表示したカードは、音声ボタン押下で音声出力することができます。<br>・カードの編集・削除もできます。<br>※デフォルトのカードは編集・削除できません。|

| カード作成 | カテゴリー作成 |
| --- | --- |
|<img width="574" height="512" alt="Group 119" src="https://github.com/user-attachments/assets/9388405a-c7e0-4d0f-9125-5d1238603456" />|<img width="574" height="512" alt="Group 120" src="https://github.com/user-attachments/assets/2da62211-b3b5-49af-babe-07f8191b5840" />|
|・カード作成ボタンから、カードを作成することができます。<br>・画像とカード名を登録し、カテゴリーを選択すると、カードが作成できます。|・カテゴリー作成ボタンから、カテゴリーを作成することができます。<br>・カテゴリー名と画像を登録し、カテゴリーが作成できます。　　　　　　　　　　 |

| デッキ上のカード削除 | デッキ保存 |
| --- | --- |
|<img width="574" height="512" alt="Group 121" src="https://github.com/user-attachments/assets/8a83c6d7-ec1e-466c-8ceb-7e446c2799f7" />|<img width="574" height="512" alt="Group 122" src="https://github.com/user-attachments/assets/41bcd5af-062b-4adf-9694-4af994ac1eef" />|
|・カードの✕ボタンで、個別のカードを削除することができます。<br>・もしくは、デッキのゴミ箱ボタンでデッキ上のカード全てを削除することができます。　　　　　|・デッキ上にカードが並んだ状態でデッキ保存ボタンを押下すると、デッキ上のカードとその並び順が保存されます。<br>・保存されたデッキは、デッキ一覧で確認することができます。<br>・保存したデッキを編集・削除することも可能です。 |


