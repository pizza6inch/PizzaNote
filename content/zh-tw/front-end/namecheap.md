---
title: "用 Namecheap 快速為 Vercel 架站設定自訂網域"
description: "教你如何在 Namecheap 上購買網域，並透過 Vercel 設定 DNS 記錄，快速部署你的網站，讓人從 google 找到你！"
publishedAt: "2025-06-18T07:54:20.096Z"
updatedAt: "2025-06-18T07:54:20.096Z"
category: "seo"
series: "域名建置"
---

## Namecheap

在眾多管理網域(Domain)的供應商中，有兩個供應商是比較知名的
- [Namecheap](https://www.namecheap.com/)
- [GoDaddy](https://tw.godaddy.com/)

選擇namecheap來購買域名有一個很大原因~~就是他的name很cheap~~，便宜又大碗對於北科大學生來說很重要XD
但除了相較便宜外，此平台還有做**免費隱私保護**，比較可惜的點是他沒有做中文服務，網站介面也都是英文的，不過我相信這對於各位工程師肯定不是什麼大難題，畢竟整個過程就像去蝦皮買東西一樣輕鬆


## 查詢域名價格

如果有心儀的域名可以直接在首頁查詢

假設今天很喜歡吃鳳梨

![image](/images/posts/namecheap/01.png)

可以看到域名都是以一年租售計費的，一開始令我比較意外的是其實域名的價格普遍都差不多，除非象徵意義很明顯的域名才會開到特別貴的價格，當然域名的價格也會因為很多因素而指數上升，例如:

- 名子長短(越短越貴) x.com 
- 上次租出去的價格(轉售價)
- 象徵意義(越直觀簡潔越貴) apple.com
- 副域名(.com .ai) 
- 科技趨勢(提前低買高賣) ai.com

其實說白了就是品牌價值居多，有興趣的可以上網查查那些域名花了多少錢被買下。

**要特別注意每個商品下都有Retail的價格**，意思是當你租滿一年後就需要花多少錢續租，想要長期持有的人最好也把這個考慮進去，畢竟首購優惠真的有夠多，retail可能要兩三倍價錢。

## 購買 & 註冊帳號

看到喜歡的域名就可以加到購物車，按下後會看到很多選項問你要不要加購，除非你知道加購具體是什麼用途不然都不加。其中SSL憑證要不要購買取決於你架站的平台環境和需求，以我個人來說，**使用vercel部署會幫你搞定SSL憑證**所以就不需要在這裡加購。

有了SSL憑證，你的網站才能使用HTTPS協定存取到，**若沒有 HTTPS**，瀏覽器（如 Chrome）會顯示「不安全」警告，這會讓使用者流失，進而降低停留時間與互動率，間接影響 SEO。

checkout後會讓你註冊帳號寫個人資料，這邊提一嘴，雖然填寫過程常枯燥但最好還是**認真填寫 真實資料**! 因為記得，因為網域商對註冊者的認證很嚴格，網域是公司非常重要的資產 (Property / Assets)。

[如果不知道fisrt/last name點我!](https://www.boca.gov.tw/sp-natr-singleform-1.html)

登入後繼續完成付款，namecheap提供三種付款方式，沒有paypal的人可以使用金融信用卡付款，這邊應該會問你要不要自動續費，如果怕服務被突然中斷域名還要重買可以打勾。付款前請再三確認域名，省的到時候要退費

## 設定DNS Record

可以先去部屬平台Add Domain 設定domain name，查看該平台的DNS Record，這邊以vercel為例:

![image](/images/posts/namecheap/02.png)


**複製**後回到namecheap點擊Account/dashboard 查看已購買域名，點選manage
到Advanced DNS設定DNS Record

![image](/images/posts/namecheap/03.png)

![image](/images/posts/namecheap/04.png)

設定完之後過一陣子就可以回到部署平台讓他verify看看有沒有抓到域名，我體感大概2~3分鐘就可以驗證了

筆記到這結束~
也許改天可以自己實做看看SSL憑證搞一下https連線 (X
