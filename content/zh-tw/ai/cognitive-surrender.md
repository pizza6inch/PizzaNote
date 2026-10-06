---
title: "邊跑 Agent 邊滑 IG？聊聊 AI 時代的認知投降"
description: "把需求丟給 Claude Code 就去滑手機，最後連 AI 在做什麼都不知道？用同事做 SEO 稽核報告的例子，聊認知投降和認知卸載差在哪，還有怎麼把方向盤拿回來。"
publishedAt: "2026-10-06T00:00:00.000Z"
updatedAt: "2026-10-06T00:00:00.000Z"
category: "ai"
---

在現在的軟體圈當中，不看 code 開發好像已經是業界常態了。在模型還沒那麼成熟的時候，可能還很強調要自己確認，現在 model 越來越強，腦袋直接放飛自我🫠。

我之前常常把客戶的需求整段複製貼上到 Claude Code，讓它自己搞定。它在那邊產 plan、產 spec，我完全沒在看，人在旁邊滑 IG。有一次還滑到一支短片，畫面是一個工程師坐在椅子上低頭滑手機，他面前的 terminal 正在跑 agent。

諷刺的是，我和他一樣，都一味地按著繼續，就像 PR 裡面不看改動就直接留言「LGTM」的人一樣。不知道這是多少開發者的共鳴 XD

最近看到「認知投降」這個概念，有感而發，所以想用身邊的例子聊聊。

## 這個詞從哪來

華頓商學院的 Steven Shaw 和 Gideon Nave 今年發了一篇研究，叫〈Thinking—Fast, Slow, and Artificial〉。他們找了 1,372 個人，總共做了 9,593 次題目，作答時可以問 AI，但 AI 的答案有一部分是故意給錯的。

AI 答對的時候，大家的正確率比不用 AI 高了 25 個百分點，這很合理。AI 答錯的時候，正確率反而比完全不用 AI 還低 15 個百分點。更妙的是，就算 AI 錯了快一半，大家對自己的答案還更有信心。

研究把這種狀況叫做認知投降（cognitive surrender）：自己不想了，直接拿 AI 的答案當成自己的，而且本人沒發現。另一種叫認知卸載（cognitive offloading），就像用計算機，算是它在算，答案合不合理還是你在看。

Addy Osmani 寫過一篇〈[Cognitive Surrender](https://addyosmani.com/blog/cognitive-surrender/)〉，把這兩個概念套到軟體開發上，有興趣可以去看。但我認為這是所有 AI 使用者都會經歷的過程。

## 你的報告不是你的報告

同事 S 有次要做一份 SEO 稽核報告。報告要給誰看、要查整站還是幾個頁面、客戶比較在意流量還是收錄，他都沒先問清楚，網址丟給 AI 就開工了。

AI 很認真，爬網站、跑檢測，每做完一步就回來問：發現這個問題了，要不要順便查一下那個？S 就一路說好。幾十回合之後，他已經不知道 AI 正在忙什麼，也忘了自己一開始要做的是什麼。

報告是交出來了。內容對不對，他不知道；就算對，是不是客戶要的那份，他也不知道。整件事早就不在他手上，AI 在自己的世界裡優游，執行著一堆他不知道的任務。

## AI 天馬行空，我們制定框架

AI 看到資料，會補很多資訊、想很多點子，但這些其實都不太重要，重要的是人怎麼決定。拿 SEO 稽核來說，AI 很可能丟出這些：

| AI 丟出來的 | 人要想的 |
|---|---|
| 120 張圖片沒有 alt 文字 | 數量最多，但最急嗎？如果商品頁被誤設成 noindex，那可比 120 張圖嚴重多了 |
| 建議加上 hreflang | 網站只有一種語言的話，跟你沒關係 |
| 行動版速度分數太低，建議改架構 | 這是實驗室測的還是真實使用者的數據？改架構的錢，客戶願意出嗎？ |
| 建議每篇文章都加 FAQ 結構化資料 | Google 從 [2023 年起](https://developers.google.com/search/blog/2023/08/howto-faq-changes)只對少數政府和醫療網站顯示 FAQ 複合式結果，AI 的知識可能過期了 |
| 「網站有 300 個問題，總分 54 分」 | 客戶要的是分數，還是下個月先修哪三件事？ |

左邊那欄 AI 一下就列完了，右邊才是報告真正值錢的地方。這個網站靠什麼賺錢、客戶在意什麼，AI 不知道，出事了也不是它負責，所以右邊只能人來寫。S 的報告就是只有左邊那欄。

## 所謂認知卸載

我覺得人跟 AI 比較像決策者跟執行者，一主一從。我們掌舵，AI 做事。

![同一份稽核報告的兩種做法：認知投降是網址丟給 AI 直接開工、一路按繼續、AI 做完直接交出去，結果不知道對不對；認知卸載是先講清楚範圍、完成標準和限制，AI 回報問題由人決定，人驗證測試後再交出去](/images/posts/cognitive-surrender/flow-zh-tw.svg)

開工前先想清楚要什麼：範圍、要交給誰、做到哪裡算完成，還有限制是什麼，例如要驗證數據、減少廢話、不要過度敘述等等。在有限的 context 中，給予必要的資訊。

做的過程中讓 AI 主動找問題回報，我一個一個決定要不要做。

> 推薦一個我覺得很好用的 skill：Matt Pocock 做的 [grill-me](https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md)。它會反過來一直追問你，把要做的決定一題一題列出來，每題附上它建議的答案，等你回答完再問下一輪，直到沒有任何地方是它自己偷偷假設的才算結束。查得到的事實它自己去查，只有需要你拍板的決定才會丟給你。

最後交出去之前，我自己就是最後一關，AI 給的東西要親自驗證、測過。這是用 AI 的人該有的素養，人要為自己的產出負責。

常常跟同事講幹話，說誰誰誰只是一個 email router，客戶的需求都不經過他大腦，直接複製貼上到我們的 ticket 內容裡。而不帶腦袋、只是一味地 always allow，你又何嘗不是一種 router 呢？

這樣分工下來，寫程式、查資料、做 mockup 這些花時間的事都可以交給 AI，不用盯的細節也讓它整理成重點給我看就好。時間省下來了，決定還是我在做，這才是認知卸載。

## 終於可以抬頭看路了

以前沒有 AI 的時候，實作本身就很花時間，一堆細節都要自己顧。腦袋光處理這些就滿了，很難退一步想整體要往哪走。

現在實作可以交出去了，AI 就像一個隨時待命的夥伴。省下來的力氣，應該拿回那 20% 真正重要的事情上：決定方向、做取捨、為結果負責，去當那個真正在思考、做決定的人。

你還是可以邊滑手機邊讓 AI 做事，當一個很 chill 的 vibe coder。但是，從你的 agent 那裡抓回一點主控權，好嗎？

## 參考資料

- Steven D. Shaw、Gideon Nave，〈[Thinking—Fast, Slow, and Artificial: How AI is Reshaping Human Reasoning and the Rise of Cognitive Surrender](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6097646)〉，華頓商學院工作論文，2026
- Wharton Executive Education，〈[Thinking Fast, Slow, Artificially: AI and Your Brain](https://executiveeducation.wharton.upenn.edu/thought-leadership/wharton-at-work/2026/05/thinking-fast-slow-and-artificially/)〉
- Addy Osmani，〈[Cognitive Surrender](https://addyosmani.com/blog/cognitive-surrender/)〉
