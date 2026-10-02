---
title: "Set Up a Custom Domain for Your Vercel Site with Namecheap"
description: "How to buy a domain on Namecheap and point it at your Vercel deployment with DNS records, so people can find your site on Google."
publishedAt: "2025-06-18T07:54:20.096Z"
updatedAt: "2025-06-18T07:54:20.096Z"
category: "seo"
series: "Domain Setup"
---

## Namecheap

Of the many registrars that sell and manage domains, two are particularly well known:
- [Namecheap](https://www.namecheap.com/)
- [GoDaddy](https://www.godaddy.com/)

A big reason I chose Namecheap is ~~that its name literally says cheap~~ the price. Cheap and generous matters a lot when you're a student.
Beyond the lower price, the platform also includes **free privacy protection**. The one downside is that there is no Chinese-language service and the whole interface is in English, but I'm sure that's no problem for an engineer. The whole process is about as easy as shopping on an online marketplace.


## Checking domain prices

If you already have a domain in mind, you can search for it right on the home page.

Say you really like pineapples:

![Searching for a domain on the Namecheap home page](/images/posts/namecheap/01.png)

Domains are billed per year. What surprised me at first is that prices are fairly similar across the board; only domains with an obvious symbolic value get really expensive. Of course, price can climb steeply for a number of reasons, for example:

- Name length (shorter is pricier): x.com
- The price it last sold for (resale value)
- Symbolic meaning (the more direct and concise, the pricier): apple.com
- The extension (.com, .ai)
- Tech trends (buy early, sell high): ai.com

In plain terms, it's mostly brand value. If you're curious, look up what some of those domains were sold for.

**Pay attention to the Retail price shown under each product.** That is what you'll pay to renew after the first year. If you plan to hold the domain long term, factor it in, because first-year promotions are very generous and the retail price can be two or three times higher.

## Buying & creating an account

When you find a domain you like, add it to the cart. You'll then see a number of add-ons offered. Unless you know exactly what an add-on is for, skip them. Whether you need to buy an SSL certificate depends on the platform and your needs. In my case, **Vercel takes care of the SSL certificate when you deploy**, so there's no need to buy one here.

With an SSL certificate your site can be served over HTTPS. **Without HTTPS**, browsers such as Chrome show a "Not secure" warning. That drives visitors away, lowers time on site and engagement, and indirectly hurts SEO.

After checkout you'll be asked to create an account and enter personal details. The form is tedious, but please **fill in real information**. Registrars verify registrants strictly, because a domain is an important asset (property) for any company.

[Not sure how to write your first and last name in English? Click here (Taiwan passport romanization).](https://www.boca.gov.tw/sp-natr-singleform-1.html)

After logging in, continue to payment. Namecheap offers three payment methods; if you don't have PayPal you can pay with a credit card. You'll probably be asked whether to enable auto-renew. Tick it if you don't want to risk the service being cut off and having to buy the domain again. Double-check the domain name before paying, so you don't end up needing a refund.

## Configuring DNS records

First go to your deployment platform, use Add Domain to enter your domain name, and look at the DNS records it asks for. Vercel is used as the example here:

![Vercel's Add Domain screen showing the DNS records to create](/images/posts/namecheap/02.png)


**Copy** them, go back to Namecheap, open Account / Dashboard to see your purchased domains, and click Manage.
Go to Advanced DNS to set the DNS records.

![Namecheap Advanced DNS page](/images/posts/namecheap/03.png)

![DNS records entered in Namecheap](/images/posts/namecheap/04.png)

After saving, wait a little while and then go back to the deployment platform and let it verify that it can see your domain. In my experience it took about 2 to 3 minutes.

That's the end of these notes.
Maybe some day I'll try setting up the SSL certificate and the HTTPS connection myself (X
