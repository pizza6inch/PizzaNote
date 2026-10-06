---
title: "Running an Agent, Scrolling Instagram: On Cognitive Surrender"
seoTitle: "Cognitive Surrender vs. Offloading in AI Coding"
description: "Pressing continue while an AI agent runs and you scroll your phone? An SEO audit story on cognitive surrender vs. offloading, and keeping the decisions yours."
publishedAt: "2026-10-06T00:00:00.000Z"
updatedAt: "2026-10-06T00:00:00.000Z"
category: "ai"
---

## Intro

In the software world today, building without reading the code seems to have become the norm. Back when models were less mature, people still stressed checking things yourself. Now that models keep getting stronger, our brains have gone on vacation🫠.

I used to often paste a client's requirements straight into Claude Code and let it figure things out. It writes a plan, writes a spec, and I don't read either. I'm next to it scrolling Instagram. Once I even scrolled past a short video of an engineer doing exactly that: sitting in his chair, head down on his phone, with a terminal running an agent in front of him.

The ironic part is that I was just like him, blindly pressing yes/continue button, like someone who comments "LGTM" on a PR without looking at the changes. I wonder how many developers can relate XD

I recently came across the idea of "cognitive surrender," and it struck a chord, so I want to talk about it using examples from people around me.

## Where the term comes from

Steven Shaw and Gideon Nave at the Wharton School published a study this year called "Thinking—Fast, Slow, and Artificial." They had 1,372 people answer questions across 9,593 trials. Participants could ask an AI, and some of its answers were wrong on purpose.

When the AI was right, accuracy went up 25 percentage points over the no-AI baseline. No surprise there. When it was wrong, accuracy dropped 15 points below people who didn't use AI at all. Better still, even with the AI wrong nearly half the time, people felt more confident in their answers.

The researchers call this cognitive surrender: you stop thinking and take the AI's answer as your own, without noticing. The other mode is cognitive offloading, like using a calculator. It does the arithmetic; you still check whether the answer makes sense.

Addy Osmani wrote "[Cognitive Surrender](https://addyosmani.com/blog/cognitive-surrender/)", which applies both ideas to software development and is worth a read. But I think this is something every AI user goes through.

## Your report isn't your report

A coworker, S, once had to write an SEO audit report. Who it was for, whether it covered the whole site or a few pages, whether the client cared more about traffic or indexing: he asked none of it. He handed the URL to an AI and got going.

The AI was diligent. It crawled the site, ran checks, and after every step came back asking: found this issue, want me to check that one too? S kept saying yes. A few dozen rounds later he no longer knew what the AI was busy with, and he'd forgotten what he set out to do.

The report did get delivered. Was it correct? He didn't know. Even if it was, was it the report the client wanted? He didn't know that either. The whole thing had slipped out of his hands long before. The AI was swimming happily in its own world, running tasks he knew nothing about.

## AI runs wild; we set the frame

Given data, AI adds a lot of information and comes up with a lot of ideas. Most of it doesn't matter much. What matters is what a person decides. In an SEO audit, the AI might come back with things like these:

| What the AI comes back with | What a person has to think about |
|---|---|
| 120 images missing alt text | It's the biggest number, but is it the most urgent? If product pages are accidentally set to noindex, that's far worse than 120 images |
| Add hreflang tags | If the site has only one language, this has nothing to do with you |
| Mobile speed score too low, suggests a rebuild | Is that lab data or real-user data? Will the client pay for a rebuild? |
| Add FAQ structured data to every post | Since [2023](https://developers.google.com/search/blog/2023/08/howto-faq-changes), Google shows FAQ rich results only for a small set of government and health sites. The AI's knowledge may be out of date |
| "300 issues found, overall score 54" | Does the client want a score, or the three things to fix next month? |

The AI fills in the left column in no time. The right column is where the report earns its money. The AI doesn't know how the site makes money or what the client cares about, and it isn't the one on the hook if things go wrong, so only a person can write the right column. S's report had only the left one.

## Cognitive offloading, then

I think of people and AI as decision-maker and executor, with a clear lead. We steer, the AI does the work.

![Two ways to run the same audit: with cognitive surrender you hand the URL to AI, keep pressing continue, and ship whatever it finishes without knowing if it's right; with cognitive offloading you set scope, done criteria and constraints, decide on each issue the AI reports, and verify and test before shipping](/images/posts/cognitive-surrender/flow-en.svg)

Before starting, be clear about what you want: the scope, who it's for, what counts as done, and what the constraints are, such as verifying the data, cutting the fluff, not over-explaining. Context is limited, so give it the information it actually needs.

While it works, let the AI find problems and report back, and decide on each one yourself.

> A skill I find really useful for this: [grill-me](https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md) by Matt Pocock. It turns things around and keeps questioning you: it lays out the decisions to make one by one, each with its recommended answer, waits for your replies before the next round, and only stops when nothing is left quietly assumed. Facts it can look up, it looks up itself; only the calls that need your say come to you.

Before anything ships, you're the last checkpoint: verify and test what the AI hands over. That's part of being a responsible AI user: people have to own what they put out.

I often joke with coworkers that so-and-so is just an email router: client requests go straight into our tickets, copy-pasted, without passing through his brain. But if you leave your brain at the door and just keep hitting "always allow," how are you any different from a router?

Split the work this way and the time-consuming parts, coding, research, mockups, can go to the AI. The details I don't need to watch, it can boil down to key points for me. I save the time and keep the decisions. That's cognitive offloading.

## Finally, eyes on the road

Before AI, implementation itself ate up a lot of time, and plenty of details needed your personal attention. With your head full of those, it was hard to step back and think about where the whole thing should go.

Now implementation can be handed off, and AI works like a partner on call. The energy that frees up belongs on the 20% that really matters: setting direction, making trade-offs, owning the result. Be the person who's actually thinking and deciding.

You can still scroll your phone while the AI works and be a very chill vibe coder. But take a little control back from your agent, okay?

## References

- Steven D. Shaw and Gideon Nave, "[Thinking—Fast, Slow, and Artificial: How AI is Reshaping Human Reasoning and the Rise of Cognitive Surrender](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6097646)," Wharton School working paper, 2026
- Wharton Executive Education, "[Thinking Fast, Slow, Artificially: AI and Your Brain](https://executiveeducation.wharton.upenn.edu/thought-leadership/wharton-at-work/2026/05/thinking-fast-slow-and-artificially/)"
- Addy Osmani, "[Cognitive Surrender](https://addyosmani.com/blog/cognitive-surrender/)"
