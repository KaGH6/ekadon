# 要件定義

### 目次
1. [一言サービスコンセプト](#anchor1)
2. [誰のどんな課題を解決するのか？](#anchor2)
3. [なぜそれを解決したいのか？](#anchor3)
4. [どうやって解決するのか？](#anchor4)<br>
4.1. [絵カードとは](#anchor4-1)<br>
4.2. [療育者にとっての使いやすさ](#anchor4-2)
5. [機能要件](#anchor5)
6. [非機能要件](#anchor6)
7. [参考文献](#anchor7)

<a id="anchor1"></a>
## 1. 一言サービスコンセプト
療育者（通常学級及び支援級、特別支援級の教員・保護者）にとって使いやすい絵カードアプリ

<a id="anchor2"></a>
## 2. 誰のどんな課題を解決するのか？
療育者が抱える、発達障害児に対して適切な方法で指示を出せないという課題

<a id="anchor3"></a>
## 3. なぜそれを解決したいのか？
発達障害児への指導に苦労した経験があるため解決したいです。

現在、日本には発達障害と診断を受けた患者が87万人以上います。そのなかでも、通常学級に在籍する小中学生の8.8%が発達障害の可能性があると言われています[¹⁾](https://www.mhlw.go.jp/toukei/list/dl/seikatsu_chousa_b_r04_01.pdf) [²⁾](https://www.nikkei.com/article/DGXZQOUE0891U0Y2A201C2000000/) [³⁾](https://www.mext.go.jp/content/20230524-mext-tokubetu01-000026255_01.pdf)。
ここ数年で発達障害についての研究や理解が進んできたためか、発達障害児に対する国や地域をあげた支援が広がりを見せつつあります。その一方で、支援者数の不足や、支援者の負担に対する注目が少ないという現状があります[⁴⁾](https://www.jstage.jst.go.jp/article/kenkouigaku/32/1/32_18/_pdf/-char/ja) [⁵⁾](https://www.jstage.jst.go.jp/article/tokkyou/53/1/53_35/_pdf/-char/ja)。

実際に自分が英会話講師として小学生に集団レッスンをしていた際、定型発達（通常の子ども）の生徒の中に１人でも発達障害が疑われる生徒がいると、指導が困難でした。
その保護者と話していても、他の保護者よりも子育てに苦労していたり、子どもだけでなく保護者に対しても周囲の理解が得られにくかったりする様子が窺われました。

そこで今回は、療育者の負担を少しでも減らせるよう、療育の現場で使用されている「絵カード」という教材のアプリを作ることにしました。


<a id="anchor4"></a>
## 4. どうやって解決するのか？
<a id="anchor4-1"></a>
### 4.1. 絵カードとは
絵カードとは、身の回りの物や人の行動などを、絵で簡単に表したカードです。自閉症児や発達障害児とのコミュニケーションを補助する教材として用いられています[⁶⁾](https://yotsuyagakuin-ryoiku.com/blogs/picturecard/) [⁷⁾](https://www.jstage.jst.go.jp/article/kyozai/26/0/26_165/_pdf/-char/ja) [⁸⁾](https://www.jstage.jst.go.jp/article/jusokenronbunjisen/44/0/44_1607/_pdf/-char/ja) [⁹⁾](https://www.jstage.jst.go.jp/article/tokkyou/56/1/56_1/_pdf/-char/ja) [¹⁰⁾](https://www.jstage.jst.go.jp/article/japanacademyofas/15/2/15_51/_pdf/-char/ja)。

発達障害児の多くに「視覚優位」という特徴がみられます。耳から言葉を聞いただけでは理解が難しいため、目で見てわかる手がかりがあれば理解しやすいという特性です。この特性を持つ子どもに対して、絵カードを見せながら指示することで、指示内容が伝わりやすくなります[⁶⁾](https://yotsuyagakuin-ryoiku.com/blogs/picturecard/) [⁷⁾](https://www.jstage.jst.go.jp/article/kyozai/26/0/26_165/_pdf/-char/ja) [¹¹⁾](https://www.jstage.jst.go.jp/article/jorthoptic/52/0/52_159/_pdf/-char/ja)。

今回の最終目的は療育者の負担軽減なので、療育者にとって使いやすい絵カードアプリの制作によって、この問題の解決の一端を担いたいと考えました。

<a id="anchor4-2"></a>
### 4.2. 療育者にとっての使いやすさ
療育者にとっての使いやすさとして、以下の点があげられます。

- カードの絵がシンプル
- 作ったカードのカテゴリー分けができる
- カードのお気に入り登録ができる
- カードやデッキの表示の大きさが調整できる
- デッキやカードの表示数を増減できる
- スマホ＆タブレットのレスポンシブ対応
- 音量と読み上げ速度を調節できる
- 複数デバイスで共有可能
- 見通し表が作れる[¹¹⁾](https://www.jstage.jst.go.jp/article/jorthoptic/52/0/52_159/_pdf/-char/ja)

上記の点は以下の <b>(1)</b> と <b>(2)</b> を参照しています。

#### (1) 絵カード使用方法の研究結果に基づく案 [⁷⁾](https://www.jstage.jst.go.jp/article/kyozai/26/0/26_165/_pdf/-char/ja)
絵カード利用時に療育者が陥りがちな失敗や困難を研究した論文をもとに、このアプリで考えられる解決策をまとめました。
<details open><summary>表1</summary>

![Image](https://github.com/user-attachments/assets/3d458957-2e56-4820-8b3d-0894a52fbe21)

</details>

#### (2) 既存アプリの問題点とそれに基づく解決案 [¹²⁾](https://apps.apple.com/jp/app/%E3%81%88%E3%81%93%E3%81%BF%E3%82%85/id1219854974) [¹³⁾](https://play.google.com/store/apps/details?id=jp.co.litalico.cardtalk&hl=ja)
「えこみゅ」のレビューで指摘されていた問題点を洗い出し、今回制作するアプリで考えられる解決策をまとめました。
<details open><summary>表2</summary>

![Image](https://github.com/user-attachments/assets/ed9c4299-7c01-47b1-822f-aa4c3ae51f7a)

</details>

#### (補足) 表2にある解決案の件数表
表2で同じ解決案を何回述べたかまとめました。
<details open><summary>補足</summary>

![Image](https://github.com/user-attachments/assets/e974a0e5-3772-4f35-8d85-92bc221e7ac1)

</details>

以上をもとに、このアプリを設計することにしました。

<a id="anchor5"></a>
## 5. 機能要件
<details><summary><b>認証機能</b></summary>
  
1. 新規登録画面でユーザー名、メールアドレス、パスワードを登録する
2. 登録完了後、ログイン画面に遷移する
3. メールアドレス、パスワードを入力
4. ログインし、ホーム画面に遷移する
</details>

<details><summary><b>絵カードを選択・表示（コア機能）</b></summary>

1. トップ画面でカードカテゴリーを一覧を選択
2. カードカテゴリー一覧からカテゴリーを選択
2. 選択したカテゴリーから絵カードを選択
3. 選択したカードが画面上部のデッキに表示される
4. 上記の要領で複数選択可能。カードを組み合わせてメッセージを作成
</details>

<details><summary><b>音声を流す</b></summary>

1. 絵カードがある状態でデッキの音声ボタンを押下
2. 音声が流れる
</details>

<details><summary><b>カード作成</b></summary>

1. カード作成ボタンを押下し、カード作成画面に遷移
2. タイトルと画像を登録
3. 任意で音声も登録。もしくは、自動読み上げ機能を付ける
4. 任意でカテゴリーも選択
5. 完了ボタン押下で登録完了
</details>

<details><summary><b>カード編集</b></summary>

1. カード編集ボタンを押下し、カード編集画面に遷移
2. カード名、画像、音声、カテゴリーの編集ができる
3. 完了ボタン押下で編集完了
</details>

<details><summary><b>カード削除</b></summary>

1. カード編集ボタンを押下し、カード編集画面に遷移
2. 画面右上の削除ボタンを押下
3. ポップアップの削除を選択し削除完了
</details>

<details><summary><b>見通し表の作成</b></summary>

1. チェックリスト作成ボタンを押下
2. デッキの下のカード一覧からカードを選択
3. 次へボタンを押下
4. リスト名と画像を選択
5. 完成ボタン押下で作成完了
</details>

<details><summary><b>見通し表の編集</b></summary>

1. チェックリスト編集ボタンを押下し、チェックリスト編集画面に遷移
2. リスト名と画像の編集ができる
3. 完了ボタン押下で編集完了
</details>

<details><summary><b>見通し表の削除</b></summary>

1. チェックリスト編集ボタンを押下し、チェックリスト編集画面に遷移
2. 画面右上の削除ボタンを押下
3. ポップアップの削除を選択し削除完了
</details>

<details><summary><b>カテゴリーの作成</b></summary>

1. カテゴリー作成ボタンを押下し、カテゴリー作成画面に遷移
2. タイトルと画像を登録
3. 完了ボタン押下で登録完了
</details>

<details><summary><b>カテゴリーの編集</b></summary>

1. カテゴリー編集ボタンを押下し、カテゴリー編集画面に遷移
2. カテゴリー名、画像、カードの編集ができる
3. 完了ボタン押下で編集完了
</details>

<details><summary><b>カテゴリーの削除</b></summary>

1. カテゴリー編集ボタンを押下し、カテゴリー編集画面に遷移
2. 画面右上の削除ボタンを押下
3. ポップアップの削除を選択し削除完了
</details>

<a id="anchor6"></a>
## 6. 非機能要件
- 画面は1秒以内に表示される
- システム障害時は3時間以内に復旧できる
- スマホとタブレットに対応している
- カードの絵をシンプルにする

<a id="anchor7"></a>
## 7. 参考文献
<details open><summary><b>文献一覧</b></summary>

[1)](https://www.mhlw.go.jp/toukei/list/dl/seikatsu_chousa_b_r04_01.pdf) 厚生労働省 社会・援護局障害保健福祉部 企画課(2024)「令和４年生活のしづらさなどに関する調査（全国在宅障害児・者等実態調査）結果の概要」厚生労働省, 1-11.

[2)](https://www.nikkei.com/article/DGXZQOUE0891U0Y2A201C2000000/) 日本経済新聞(2022)「小中学生の8.8%に発達障害の可能性 文科省調査」https://www.nikkei.com/article/DGXZQOUE0891U0Y2A201C2000000/, (2025年4月8日アクセス).

[3)](https://www.mext.go.jp/content/20230524-mext-tokubetu01-000026255_01.pdf) 文部科学省 初等中等教育局 特別支援教育課(2022)「通常の学級に在籍する特別な教育的支援を必要とする児童生徒に関する調査結果について」文部科学省, 1-36.

[4)](https://www.jstage.jst.go.jp/article/kenkouigaku/32/1/32_18/_pdf/-char/ja) 大堀美樹, 鈴木英子, 髙山裕子(2023)「文献から見た発達障害児の支援者が直面する困難の分類」日本健康医学会雑誌, 32(1), 18-27.

[5)](https://www.jstage.jst.go.jp/article/tokkyou/53/1/53_35/_pdf/-char/ja) 岡村章司(2015)「特別支援学校における自閉症児に対する保護者支援：母親の主体性を促す支援方略の検討」特殊教育学研究, 53(1), 35-45.

[6)](https://yotsuyagakuin-ryoiku.com/blogs/picturecard/) 四谷学院 発達支援チーム(2024)「絵カードの効果的な使い方は？自作できる？【療育のヒント】」自閉症･発達障害の療育_四谷学院発達支援ブログ, https://yotsuyagakuin-ryoiku.com/blogs/picturecard/, (2025年4月8日アクセス).

[7)](https://www.jstage.jst.go.jp/article/kyozai/26/0/26_165/_pdf/-char/ja) 水野智美(2015)「保育者が行う絵カード作成の誤りおよび不適切な使用方法の分類」教材学研究, 26, 165-172.

[8)](https://www.jstage.jst.go.jp/article/jusokenronbunjisen/44/0/44_1607/_pdf/-char/ja) 徳田克己, 水野智美, 西館有沙, 西村実穂(2018)「発達障がい児が安全で快適にすごすことができる住環境の提案：家庭内事故の防止及び二次障害防止の視点から」住総研研究論文集・実践研究報告集, 44, 61-71.

[9)](https://www.jstage.jst.go.jp/article/tokkyou/56/1/56_1/_pdf/-char/ja) 平野礼子, 佐々木銀河, 野呂文行(2018)「自閉スペクトラム症幼児における物の名称理解の獲得：音声-動作-絵カードの刺激間関係の学習」特殊教育学研究, 56, 1-9.

[10)](https://www.jstage.jst.go.jp/article/japanacademyofas/15/2/15_51/_pdf/-char/ja) 加藤健生, 今本繁(2018)「待つ場面で行動問題を示す自閉スペクトラム症者への支援：「待ってに応じる」指導プログラムを福祉事業所で活用した取り組み」自閉症スペクトラム研究, 15(2), 51-60.

[11)](https://www.jstage.jst.go.jp/article/jorthoptic/52/0/52_159/_pdf/-char/ja) 碇菜々恵, 切上幸希, 谷口めぐみ, 永沼加代子, 石井祐子, 南雲幹, 大井田紀和, 永野雅子, 小口芳久, 井上賢治(2022)「発達障害が疑われる児に対し「絵カード」や「見通し表」を用いた効果の評価法の検討」日本視能訓練士協会誌, 52, 159-166.

[12)](https://apps.apple.com/jp/app/%E3%81%88%E3%81%93%E3%81%BF%E3%82%85/id1219854974) 株式会社LITALICO「えこみゅ：評価とレビュー」App Store,  https://apps.apple.com/jp/app/%E3%81%88%E3%81%93%E3%81%BF%E3%82%85/id1219854974, (2025年4月12日 iphoneからアクセス, 全169件).

[13)](https://play.google.com/store/apps/details?id=jp.co.litalico.cardtalk&hl=ja) 株式会社LITALICO「えこみゅ：評価とレビュー」Google Play,  https://play.google.com/store/apps/details?id=jp.co.litalico.cardtalk&hl=ja, (2025年4月12日アクセス, 全55件).
</details>

<details><summary><b>その他文献</b></summary>

- 山崎智仁, 水内豊和(2020)「ICT を活用した自閉スペクトラム症児へのコミュニケーション指導」日本教育工学会論文誌, 43(Suppl), 13-16.
- 切上幸希, 碇菜々恵, 谷口めぐみ, 池田有里, 永沼加代子, 石井祐子, 南雲幹, 大井田紀和, 永野雅子, 井上賢治(2022)「発達障害児の視覚特性を生かし「絵カード」と「見通し表」を使用した2症例」日本視能訓練士協会誌, 52, 177-181.
- 楯誠(2012)「自閉症と診断された男児のリメディアルトレーニングと通常学級参加の検討」自閉症スペクトラム研究, 10(2), 43-56.
- 大伴潔(1998)「絵カード配列とサインによる2語文形成効果の検討」聴能言語学研究, 15(1), 4-12.
- 日野雅子, 岡崎雅, 北澤拓哉, 末吉彩香, 烏雲畢力格, 柘植雅義(2018)「発達障害がある子の保護者が我が子の小学校期に持った支援ニーズに関する面接調査」障害科学研究, 42(1), 197-205.
- 山本理絵, 工藤英美, 神田直子(2015)「発達障害をもつ子どもの乳幼児期から思春期までの縦断的変化: 母親の子育て困難・不安・支援ニーズを中心に」人間発達学研究第, 6, 99‒110.
- ピラミッド教育コンサルタントオブジャパン株式会社「PECS®（絵カード交換式コミュニケーションシステム）」ピラミッド教育コンサルタントオブジャパン株式会社ホームページ, https://pecs-japan.com/絵カード交換式コミュニケーションシステム/, (2025年4月8日アクセス).
- 日本マカトン協会「マカトン法とは」日本マカトン協会ホームページ, https://makaton.jp/about, (2025年4月8日アクセス).
</details>




