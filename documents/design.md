# 設計

### 1. 業務フロー
![Image](https://github.com/user-attachments/assets/e0d2cf3f-75d9-4e8c-8394-25fc9bd265d3)

### 2. 画面遷移図
![Image](https://github.com/user-attachments/assets/d9148a13-2472-4871-b24b-c4dbc583f408)

### 3. ワイヤーフレーム
![Image](https://github.com/user-attachments/assets/6363095d-0766-4fbe-bdc3-48de8d01f623)

### 4. テーブル定義書
テーブル：users
| カラム名 | データ型    | NULL | キー    | 初期値 | AUTO INCREMENT | 
| -------- | ----------- | ---- | ------- | ------ | -------------- | 
| id       | INT         |      | PRIMARY |        | YES            | 
| name     | VARCHAR(30) |      |         |        |                | 
| email    | VARCHAR(100) |      | UNIQUE  |        |                | 
| password | VARCHAR(50) |      |         |        |                | 

<br>

テーブル：cards
| カラム名    | データ型     | NULL | キー    | 初期値 | AUTO INCREMENT | 
| ----------- | ------------ | ---- | ------- | ------ | -------------- | 
| id          | INT          |      | PRIMARY |        | YES            | 
| name        | VARCHAR(30)  |      |         |        |                | 
| image_path  | VARCHAR(100) |      |         |        |                | 

<br>

テーブル：categories
| カラム名     | データ型     | NULL | キー    | 初期値 | AUTO INCREMENT | 
| ------------ | ------------ | ---- | ------- | ------ | -------------- | 
| id           | INT          |      | PRIMARY |        | YES            | 
| name         | VARCHAR(30)  |      |         |        |                | 
| image_path   | VARCHAR(100) | YES  |         |        |                | 
| card_id      | FOREIGN      | YES  |         |        |                | 

<br>

テーブル：checklists
| カラム名       | データ型     | NULL | キー    | 初期値 | AUTO INCREMENT | 
| -------------- | ------------ | ---- | ------- | ------ | -------------- | 
| id             | INT          |      | PRIMARY |        | YES            | 
| name           | VARCHAR(30)  |      |         |        |                | 
| image_path     | VARCHAR(100) | YES  |         |        |                | 
| card_id        | FOREIGN      | YES  |         |        |                | 
| category_id    | FOREIGN      | YES  |         |        |                | 

<br>

### 5. システム構成図
![Image](https://github.com/user-attachments/assets/e1068fda-52d0-4dc8-8053-b2f82d64024c)
