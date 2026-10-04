---
title: "用 Namecheap 快速為 Vercel 架站設定自訂網域"
description: "在 Namecheap 購買網域並接到 Vercel 的完整步驟：查價與續約價、購買注意事項、A 與 CNAME 紀錄怎麼填、改用 Vercel DNS 的做法，以及 Invalid Configuration 的排錯方式。"
publishedAt: "2025-06-18T07:54:20.096Z"
updatedAt: "2026-10-04T00:00:00.000Z"
category: "seo"
series: "域名建置"
---

**重點整理**：在 Namecheap 買好網域後，到 Vercel 專案的 Settings → Domains 加入網域，照 Vercel 顯示的值在 Namecheap 的 Advanced DNS 新增紀錄，等幾分鐘讓 Vercel 驗證，HTTPS 憑證會自動簽發。

1. 在 Namecheap 搜尋並購買網域（注意續約價）
2. 在 Vercel 專案的 **Settings → Domains** 加入網域
3. 回 Namecheap：**Domain List → Manage → Advanced DNS**
4. 新增 Vercel 要求的紀錄（根網域用 A 紀錄，`www` 用 CNAME）
5. 回 Vercel 按 Refresh，顯示 Valid Configuration 就完成了

## Namecheap

在眾多管理網域（Domain）的供應商中，有兩個供應商是比較知名的：

- [Namecheap](https://www.namecheap.com/)
- [GoDaddy](https://tw.godaddy.com/)

選擇 Namecheap 來購買網域有一個很大原因~~就是他的 name 很 cheap~~，便宜又大碗對學生來說很重要 XD
但除了相較便宜外，這個平台還有**免費隱私保護**（WHOIS 查不到你的個資）。比較可惜的是它沒有中文服務，網站介面都是英文的，不過我相信這對各位工程師不是什麼大難題，整個過程就像去蝦皮買東西一樣輕鬆。

## 查詢網域價格

如果有心儀的網域可以直接在首頁查詢。

假設今天很喜歡吃鳳梨：

![在 Namecheap 首頁搜尋 pineapple 網域的結果與各個副檔名的價格](/images/posts/namecheap/01.png)

可以看到網域都是以一年為單位計費。一開始比較意外的是網域的價格其實普遍都差不多，只有象徵意義很明顯的網域才會特別貴。當然網域的價格也會因為很多因素暴漲，例如：

- 名字長短（越短越貴）：x.com
- 上次租出去的價格（轉售價）
- 象徵意義（越直觀簡潔越貴）：apple.com
- 頂級網域（.com、.ai）
- 科技趨勢（提前低買高賣）：ai.com

說白了就是品牌價值居多，有興趣的可以上網查查那些網域花了多少錢被買下。

**要特別注意每個商品下都有 Retail 的價格**，意思是租滿一年後續租要花多少錢。想要長期持有的人最好把這個考慮進去，畢竟首購優惠真的很多，續約價可能是兩三倍。

> 小提醒：`.dev`、`.app` 這類網域強制使用 HTTPS（瀏覽器一律用 https 連線），部署在 Vercel 上不用擔心，憑證會自動處理。

## 購買 & 註冊帳號

看到喜歡的網域就可以加到購物車，按下後會看到很多選項問你要不要加購，除非你知道加購的具體用途，不然都不用加。其中 SSL 憑證要不要買取決於你架站的平台和需求，以我來說，**用 Vercel 部署會幫你搞定 SSL 憑證**，所以不需要在這裡加購。

有了 SSL 憑證，你的網站才能用 HTTPS 連線。**若沒有 HTTPS**，瀏覽器（如 Chrome）會顯示「不安全」警告，使用者會流失，進而降低停留時間與互動率，間接影響 SEO。

結帳時會要你註冊帳號、填寫個人資料。雖然填寫過程很枯燥，但最好還是**認真填寫真實資料**！網域商對註冊者的認證很嚴格，網域對公司來說是非常重要的資產（Property / Assets），資料不實可能會被停用。

[如果不知道 first / last name 怎麼寫，點我查外交部的護照英文姓名！](https://www.boca.gov.tw/sp-natr-singleform-1.html)

登入後繼續完成付款，Namecheap 提供三種付款方式，沒有 PayPal 的人可以用信用卡付款。這邊會問你要不要自動續約，如果怕服務突然中斷、網域還要重買，可以打勾。付款前請再三確認網域名稱，省得到時候要退費。

## 設定 DNS 紀錄

有兩種方法可以把網域接到 Vercel，選一種就好：

| | 方法一：在 Namecheap 新增紀錄（本篇用這個） | 方法二：把 nameserver 換成 Vercel DNS |
| --- | --- | --- |
| 在哪裡設定 | Namecheap 的 Advanced DNS | Namecheap 的 Domain → Nameservers 選 Custom DNS |
| 要填什麼 | A 紀錄、CNAME 紀錄 | `ns1.vercel-dns.com`、`ns2.vercel-dns.com` |
| 之後的 DNS 紀錄 | 繼續在 Namecheap 管理 | 全部改到 Vercel 管理 |
| 適合 | 還要在 Namecheap 加其他紀錄（例如 email、Search Console 驗證） | 網域只給這個 Vercel 專案用 |

### 方法一：新增 A 與 CNAME 紀錄

先到 Vercel 專案的 **Settings → Domains** 按 Add Domain，輸入你的網域，Vercel 會列出需要的 DNS 紀錄：

![Vercel 的網域設定畫面，列出要新增的 A 紀錄（@ 指向 216.198.79.193）和 TXT 驗證紀錄](/images/posts/namecheap/02.png)

把值**複製**下來，回到 Namecheap 點 **Account → Dashboard** 查看已購買的網域，點 **Manage**，到 **Advanced DNS** 新增紀錄：

![Namecheap 網域管理頁面上方的 Advanced DNS 分頁](/images/posts/namecheap/03.png)

![Namecheap Advanced DNS 的 Host Records，已新增指向 Vercel 的 A 紀錄與 Search Console 驗證用的 TXT 紀錄](/images/posts/namecheap/04.png)

我的設定長這樣（數值以 Vercel 畫面顯示的為準，不同時間、不同專案可能不一樣）：

| Type | Host | Value | 用途 |
| --- | --- | --- | --- |
| A Record | `@` | `216.198.79.193` | 根網域（pizzanote.dev）指到 Vercel |
| CNAME Record | `www` | Vercel 顯示的值，例如 `cname.vercel-dns.com.` | www.pizzanote.dev 指到 Vercel |
| TXT Record | `_vercel` | `vc-domain-verify=...` | 只有 Vercel 要求驗證擁有權時才需要 |
| TXT Record | `@` | `google-site-verification=...` | Google Search Console 驗證（之後要用再加） |

- Host 欄位填 `@` 代表根網域本身，**不要**填完整的網域名稱
- TTL 用 Automatic 就好

設定完之後過一陣子回到 Vercel 按 Refresh，讓它驗證有沒有抓到網域，我體感大概 2～3 分鐘就驗證成功了。之後 Vercel 會自動簽發 HTTPS 憑證。

### 方法二：改用 Vercel DNS

在 Namecheap 的 **Domain** 分頁找到 **Nameservers**，從 Namecheap BasicDNS 改成 **Custom DNS**，填入 `ns1.vercel-dns.com` 和 `ns2.vercel-dns.com`。之後所有 DNS 紀錄都在 Vercel 的 Domains 頁面管理。換 nameserver 生效比較慢，可能要幾小時。

## www 還是不加 www？

兩個都要設定，但只選一個當正式網址，另一個轉址過去。在 Vercel 的 Domains 頁面把兩個網域都加進去，其中一個設成 Redirect 到另一個（308）。這樣搜尋引擎只會收錄一個版本，不會被當成重複內容。本站用的是不加 www 的 `pizzanote.dev`。

## 排錯：Invalid Configuration 一直沒消失

- **Namecheap 預設紀錄沒刪**：剛買的網域通常會有指到停車頁的 `CNAME www → parkingpage.namecheap.com` 和 URL Redirect Record，要先刪掉，不然會和 Vercel 的紀錄衝突
- **Host 填錯**：根網域要填 `@`，`www` 就填 `www`，不要寫成 `pizzanote.dev` 或 `www.pizzanote.dev`
- **還沒生效**：DNS 更新需要時間，可以用指令確認目前查到的值：

```bash
nslookup pizzanote.dev
nslookup www.pizzanote.dev
```

查到的 IP 和 Vercel 要求的一樣，再回 Vercel 按 Refresh。

- **出現「This domain is linked to another Vercel account」**：照畫面新增 `_vercel` 的 TXT 紀錄驗證擁有權，驗證完就可以刪掉
- **HTTPS 憑證一直在 pending**：通常是 DNS 還沒指對。紀錄正確後 Vercel 會在幾分鐘內自動簽發

筆記到這結束～
網域接好之後，就可以把網站加到 Google Search Console 了，SEO 的部分我寫在[Next.js SEO 實作筆記](/zh-tw/front-end/seo-in-nextjs/)。
