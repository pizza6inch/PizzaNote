import type { Locale } from "./config";

export interface Dictionary {
  site: { name: string; tagline: string; description: string };
  nav: { home: string; allPosts: string; about: string; overview: string; search: string; menu: string; language: string; skip: string; theme: string };
  home: { title: string; latest: string; special: string; menu: string; read: string; topics: string };
  posts: { title: string; description: string; empty: string; count: (n: number) => string; countUnit: (n: number) => string };
  topic: { posts: string; categories: string };
  category: { posts: string; title: string; description: (name: string) => string };
  tag: { title: (name: string) => string; description: (name: string, count: number) => string };
  post: {
    toc: string;
    overview: string;
    prev: string;
    next: string;
    updated: string;
    published: string;
    comments: string;
    views: string;
    minRead: (n: number) => string;
    minShort: (n: number) => string;
    minUnit: string;
    table: string;
    by: string;
    aboutAuthor: string;
    authorBio: string;
    moreAboutAuthor: string;
  };
  about: { title: string; seoTitle: string; description: string; intro: string; experience: string; services: string };
  experience: { date: string; title: string; description: string }[];
  services: { title: string; items: string[] }[];
  footer: { follow: string; rights: string; alive: (days: number) => string };
  search: { title: string; placeholder: string; loading: string; empty: string; hint: string; close: string };
  notFound: { title: string; body: string; home: string };
  breadcrumb: { home: string };
}

const zhTw: Dictionary = {
  site: {
    name: "披薩筆記",
    tagline: "Ewan（Pizza）的學習筆記",
    description: "披薩筆記是 Ewan（Pizza）的學習紀錄，整理前端、JavaScript、SEO 與開發工具的實作心得。",
  },
  nav: {
    home: "首頁",
    allPosts: "所有文章",
    about: "關於我",
    overview: "總覽",
    search: "搜尋",
    menu: "選單",
    language: "語言",
    skip: "跳到主要內容",
    theme: "切換深淺色主題",
  },
  home: { title: "披薩筆記", latest: "最新文章", special: "本日推薦", menu: "文章菜單", read: "開始閱讀", topics: "依主題挑選" },
  posts: {
    title: "所有文章",
    description: "披薩筆記中所有文章的列表，涵蓋前端、JavaScript、SEO 等主題，助你持續學習與成長。",
    empty: "目前還沒有文章。",
    count: (n) => `${n} 篇`,
    countUnit: () => "篇",
  },
  topic: { posts: "最新文章", categories: "分類" },
  category: {
    posts: "文章",
    title: "分類",
    description: (name) => `「${name}」分類下的所有文章。`,
  },
  tag: {
    title: (name) => `標籤：${name}`,
    description: (name, count) => `標籤「${name}」下共有 ${count} 篇文章。`,
  },
  post: {
    toc: "目錄",
    overview: "總覽",
    prev: "上一篇",
    next: "下一篇",
    updated: "最後更新",
    published: "發佈於",
    comments: "留言",
    views: "瀏覽次數",
    minRead: (n) => `約 ${n} 分鐘`,
    minShort: (n) => `${n} 分鐘`,
    minUnit: "分鐘",
    table: "表格",
    by: "作者",
    aboutAuthor: "關於作者",
    authorBio: "網站與 SEO 工程師，替台灣與美國客戶開發網站、優化搜尋表現，也導入 AI 自動化。",
    moreAboutAuthor: "更多關於我",
  },
  about: {
    title: "關於我",
    seoTitle: "關於我｜網站與 SEO 工程師 Ewan",
    description: "網站與 SEO 工程師 Ewan（Pizza），替台灣與美國客戶開發 WordPress、HubSpot 與客製化網站，也負責 Core Web Vitals、GA4 等 SEO 工程與 AI 自動化。",
    intro:
      "我是 Ewan（Pizza），網站與 SEO 工程師。目前在博媒網路科技（BMG）擔任軟體工程師，替台灣與美國客戶開發和維護網站，包含 WordPress、HubSpot 與客製化全端系統，也負責 Core Web Vitals、GA4、GSC 等 SEO 工程。平常會用 MCP、Skills 和 AI Agent 自動化重複的工作。有網站、SEO 或自動化需求，歡迎來信。",
    experience: "社畜歷史",
    services: "吃飯工具",
  },
  experience: [
    {
      date: "2026.2 ~ Now",
      title: "軟體工程師 · 博媒網路科技（BMG）",
      description:
        "為台灣與美國客戶開發與維護 CMS 網站（WordPress、HubSpot CMS 模組與行銷 workflow），負責 SEO 工程（Core Web Vitals、關鍵字、GA4、GSC），以及客製化 B2B dashboard 與網站的全端開發。打造 Slack AI Agent，讓同事下指令就能修 bug、更新內容、開發簡單功能；也帶同事導入 MCP 與 Skills，直接從後台取得資料、簡化工作流程。",
    },
    {
      date: "2025.8 ~ 2025.9",
      title: "全端工程師 · 璽樂科技（i-Daka）",
      description: "負責物聯網資料流串接、人臉辨識資料處理與雲端儲存，使用 AWS（S3、Lambda）與 GCP（Cloud Run、Cloud Build）建置與部署。",
    },
    {
      date: "2024.7 ~ 2025.7",
      title: "前端實習生 · 易遊網",
      description: "協助開發易遊網的前端功能，包括商品分類、訂單詳情、訂購驗證、靜態SEO頁面等。",
    },
    {
      date: "2025.1 ~ 2025.3",
      title: "學生計算機年會開發組志工",
      description: "協助開發年會官方網站及大地遊戲系統。",
    },
    { date: "2021.8 ~ 2025.6", title: "國立台北科技大學", description: "資訊工程學系" },
  ],
  services: [
    {
      title: "網站開發",
      items: ["UI/UX 設計", "Next.js / React", "WordPress", "HubSpot CMS", "客製化 B2B dashboard", "API 整合"],
    },
    {
      title: "後端與雲端",
      items: ["Node.js", "Python", "PHP", "PostgreSQL", "MySQL", "AWS", "GCP", "Vercel", "系統監控", "流量分析"],
    },
    {
      title: "SEO / AIO",
      items: ["技術 SEO", "Core Web Vitals", "結構化資料", "關鍵字研究", "Google Search Console", "AI 搜尋最佳化"],
    },
    {
      title: "廣告與行銷追蹤",
      items: ["Google Ads 轉換設定（搜尋、多媒體、成效最大化）", "Meta 廣告追蹤（Facebook / Instagram）", "GTM 埋碼", "GA4 轉換追蹤", "HubSpot 行銷 workflow"],
    },
    { title: "AI 自動化與 Agent 串接", items: ["Claude API", "Agent SDK", "MCP", "Skills", "Slack AI Agent", "工作流程自動化"] },
  ],
  footer: { follow: "追蹤", rights: "All Rights Reserved.", alive: (days) => `本站已營業 ${days} 天` },
  search: {
    title: "搜尋文章",
    placeholder: "輸入關鍵字",
    loading: "載入中...",
    empty: "找不到相關文章",
    hint: "請輸入關鍵字進行搜尋",
    close: "關閉",
  },
  notFound: {
    title: "找不到頁面",
    body: "你所尋找的頁面不存在或已經被移除。請回到首頁，或瀏覽其他文章。",
    home: "回到首頁",
  },
  breadcrumb: { home: "首頁" },
};

const en: Dictionary = {
  site: {
    name: "PizzaNote",
    tagline: "Ewan (Pizza)'s learning notes",
    description:
      "PizzaNote is Ewan (Pizza)'s learning journal: practical notes on front-end development, JavaScript, SEO and developer tooling.",
  },
  nav: {
    home: "Home",
    allPosts: "All posts",
    about: "About",
    overview: "Overview",
    search: "Search",
    menu: "Menu",
    language: "Language",
    skip: "Skip to content",
    theme: "Toggle light/dark theme",
  },
  home: { title: "PizzaNote", latest: "Latest posts", special: "Today's special", menu: "The menu", read: "Read the note", topics: "Pick a topic" },
  posts: {
    title: "All posts",
    description:
      "Every post on PizzaNote, covering front-end development, JavaScript and SEO, to keep you learning and growing.",
    empty: "There are no posts yet.",
    count: (n) => `${n} ${n === 1 ? "note" : "notes"}`,
    countUnit: (n) => (n === 1 ? "note" : "notes"),
  },
  topic: { posts: "Latest posts", categories: "Categories" },
  category: {
    posts: "Posts",
    title: "Category",
    description: (name) => `All posts in the "${name}" category.`,
  },
  tag: {
    title: (name) => `Tag: ${name}`,
    description: (name, count) => `${count} posts tagged "${name}".`,
  },
  post: {
    toc: "Contents",
    overview: "Overview",
    prev: "Previous",
    next: "Next",
    updated: "Last updated",
    published: "Published",
    comments: "Comments",
    views: "Views",
    minRead: (n) => `${n} min read`,
    minShort: (n) => `${n} min`,
    minUnit: "min",
    table: "Table",
    by: "By",
    aboutAuthor: "About the author",
    authorBio:
      "A web and SEO engineer who builds websites and improves search performance for clients in Taiwan and the US, and brings AI automation into the workflow.",
    moreAboutAuthor: "More about me",
  },
  about: {
    title: "About me",
    seoTitle: "About Ewan, Web & SEO Engineer",
    description:
      "Ewan (Pizza) is a web and SEO engineer building WordPress, HubSpot and custom full-stack sites for clients in Taiwan and the US, plus SEO and AI automation.",
    intro:
      "I'm Ewan (Pizza), a web and SEO engineer. I work as a software engineer at BMG (博媒網路科技), building and maintaining websites for clients in Taiwan and the US with WordPress, HubSpot and custom full-stack code, and handling SEO work such as Core Web Vitals, GA4 and Search Console. I also use MCP, Skills and AI agents to automate repetitive work. If you need help with a website, SEO or automation, feel free to email me.",
    experience: "The daily grind",
    services: "Tools of the trade",
  },
  experience: [
    {
      date: "2026.2 ~ Now",
      title: "Software Engineer, BMG (博媒網路科技)",
      description:
        "Building and maintaining CMS websites for clients in Taiwan and the US (WordPress, HubSpot CMS modules and marketing workflows), handling SEO engineering (Core Web Vitals, keywords, GA4, Search Console), and full-stack development of custom B2B dashboards and websites. Built a Slack AI agent that lets colleagues fix bugs, update content and ship small features from a chat command, and helped the team adopt MCP and Skills to pull data from back-office tools and simplify their workflows.",
    },
    {
      date: "2025.8 ~ 2025.9",
      title: "Full-stack Engineer, i-Daka (璽樂科技)",
      description:
        "Worked on IoT data pipelines, facial-recognition data processing and cloud storage, building and deploying on AWS (S3, Lambda) and GCP (Cloud Run, Cloud Build).",
    },
    {
      date: "2024.7 ~ 2025.7",
      title: "Front-end intern, ezTravel (易遊網)",
      description:
        "Helped build front-end features including product categories, order details, order validation and static SEO pages.",
    },
    {
      date: "2025.1 ~ 2025.3",
      title: "Volunteer developer, SITCON (Students' Information Technology Conference)",
      description: "Helped build the conference's official website and its campus-wide game system.",
    },
    {
      date: "2021.8 ~ 2025.6",
      title: "National Taipei University of Technology",
      description: "B.S. in Computer Science and Information Engineering",
    },
  ],
  services: [
    {
      title: "Web development",
      items: ["UI/UX design", "Next.js / React", "WordPress", "HubSpot CMS", "Custom B2B dashboards", "API integration"],
    },
    {
      title: "Back end & cloud",
      items: ["Node.js", "Python", "PHP", "PostgreSQL", "MySQL", "AWS", "GCP", "Vercel", "System monitoring", "Traffic analytics"],
    },
    {
      title: "SEO / AIO",
      items: ["Technical SEO", "Core Web Vitals", "Structured data", "Keyword research", "Google Search Console", "AI search optimization"],
    },
    {
      title: "Ad tracking & marketing tech",
      items: [
        "Google Ads conversion setup (Search, Display, Performance Max)",
        "Meta ads tracking (Facebook / Instagram)",
        "Google Tag Manager",
        "GA4 conversion tracking",
        "HubSpot marketing workflows",
      ],
    },
    { title: "AI automation & agents", items: ["Claude API", "Agent SDK", "MCP", "Skills", "Slack AI agent", "Workflow automation"] },
  ],
  footer: { follow: "Follow", rights: "All Rights Reserved.", alive: (days) => `Open for ${days} days` },
  search: {
    title: "Search posts",
    placeholder: "Type a keyword",
    loading: "Loading...",
    empty: "No matching posts",
    hint: "Type a keyword to search",
    close: "Close",
  },
  notFound: {
    title: "Page not found",
    body: "The page you are looking for does not exist or has been removed. Head back home or browse other posts.",
    home: "Back to home",
  },
  breadcrumb: { home: "Home" },
};

const dictionaries: Record<Locale, Dictionary> = { "zh-tw": zhTw, en };

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];
