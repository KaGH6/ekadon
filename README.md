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

## 7. 使い方
| トップページ | アカウント登録、ログインページ |
| --- | --- |
|<img width="250" height="447" alt="image 32" src="https://github.com/user-attachments/assets/e213fb68-6857-4c72-bdc8-a93f1c364947" />|<img width="250" height="445" alt="ekadon com_auth_signup(iPhone SE) 2" src="https://github.com/user-attachments/assets/67922729-81cf-4850-b489-4404bd9b2f98" />|
|・えかどんの主な機能の一覧と、使い方ガイドへのリンクが掲載されています。|・メールアドレス、ユーザー名、パスワードで新規登録・ログインすることができます。 |

| カテゴリー一覧 | カード一覧 |
| --- | --- |
|<img width="250" height="451" alt="image 34" src="https://github.com/user-attachments/assets/7a03b79f-7add-4b60-a5a2-59d79cb59559" />|<img width="250" height="443" alt="image 35" src="https://github.com/user-attachments/assets/f7adc166-8ccd-413a-9296-9a3f80e71a8e" />|
|・ログイン後、カテゴリー一覧画面に遷移します。　　　　　　　　　　　　　　　 　　　|・好きなカテゴリーを選択後、そのカテゴリーの中から好きなカードを選択し、画面上部のデッキにカードを表示させることができます。<br>・デッキに表示したカードは、音声ボタン押下で音声出力することができます。|

| カード作成 | カテゴリー作成 |
| --- | --- |
|<img width="250" height="549" alt="image 61" src="https://github.com/user-attachments/assets/05843832-2b60-419e-b1f1-3644598cab60" />|<img width="250" height="443" alt="image 38" src="https://github.com/user-attachments/assets/95d3422f-2445-4b26-ae4f-4fcc0cc6b62a" />|
|・カード作成ボタンから、カードを作成することができます。<br>・画像とカード名を登録し、カテゴリーを選択すると、カードが作成できます。|・カテゴリー作成ボタンから、カテゴリーを作成することができます。<br>・カテゴリー名と画像を登録し、カテゴリーが作成できます。　　　　　　　　　　 |

| デッキ上のカード削除 | デッキ保存 |
| --- | --- |
|<img width="250" height="438" alt="image 62" src="https://github.com/user-attachments/assets/5d4d0e7f-a569-49e5-bc63-34fbaede7da0" />|<img width="250" height="445" alt="image 36" src="https://github.com/user-attachments/assets/a889e12d-ac2a-42fd-96b0-fbb644e06718" />|
|・カードの✕ボタンで、個別のカードを削除することができます。<br>・もしくは、デッキのゴミ箱ボタンでデッキ上のカード全てを削除することができます。　　　　　|・デッキ上にカードが並んだ状態でデッキ保存ボタンを押下すると、デッキ上のカードとその並び順が保存されます。<br>・保存されたデッキは、デッキ一覧で確認することができます。 |


