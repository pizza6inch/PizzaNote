import type { Locale } from "./config";

export interface Dictionary {
  site: { name: string; tagline: string; description: string };
  nav: { home: string; allPosts: string; about: string; overview: string; search: string; menu: string; language: string; theme: string };
  home: { title: string; latest: string };
  posts: { title: string; description: string; empty: string };
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
  };
  about: { title: string; intro: string; experience: string };
  experience: { date: string; title: string; description: string }[];
  sidebar: { about: string; more: string; heart: string; alive: (days: number) => string; categories: string; follow: string };
  footer: { follow: string; rights: string };
  search: { title: string; placeholder: string; loading: string; empty: string; hint: string; close: string };
  notFound: { title: string; body: string; home: string };
  breadcrumb: { home: string };
}

const zhTw: Dictionary = {
  site: {
    name: "披薩筆記",
    tagline: "Ewan（Pizza）的前端學習筆記",
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
    theme: "切換深淺色主題",
  },
  home: { title: "披薩筆記", latest: "最新文章" },
  posts: {
    title: "所有文章",
    description: "披薩筆記中所有文章的列表，涵蓋前端、JavaScript、SEO 等主題，助你持續學習與成長。",
    empty: "目前還沒有文章。",
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
  },
  about: {
    title: "關於我",
    intro:
      "我是 Ewan（Pizza），北科資工大四生，目前在易遊網實習。這個部落格紀錄的不只是技術，更是成長的足跡。我想把學習中的困惑與突破、實作中的靈感與反思，真實分享給正在努力的你。希望這裡的內容能陪你一起前進，一起成長，為未來點亮更多可能！",
    experience: "經歷",
  },
  experience: [
    {
      date: "2024.7 ~ Now",
      title: "易遊網實習生",
      description: "協助開發易遊網的前端功能，包括商品分類、訂單詳情、訂購驗證、靜態SEO頁面等。",
    },
    {
      date: "2025.1 ~ 2025.3",
      title: "學生計算機年會開發組志工",
      description: "協助開發年會官方網站及大地遊戲系統。",
    },
    { date: "2021.8 ~ 2025.6", title: "國立台北科技大學", description: "資訊工程學系" },
  ],
  sidebar: {
    about: "關於我",
    more: "了解更多",
    heart: "披薩心臟！",
    alive: (days) => `本站已存活:${days}天!`,
    categories: "文章分類",
    follow: "追蹤",
  },
  footer: { follow: "追蹤", rights: "All Rights Reserved." },
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
    tagline: "Ewan (Pizza)'s front-end learning notes",
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
    theme: "Toggle light/dark theme",
  },
  home: { title: "PizzaNote", latest: "Latest posts" },
  posts: {
    title: "All posts",
    description:
      "Every post on PizzaNote, covering front-end development, JavaScript and SEO, to keep you learning and growing.",
    empty: "There are no posts yet.",
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
  },
  about: {
    title: "About me",
    intro:
      "I'm Ewan (Pizza), a senior in Computer Science at National Taipei University of Technology, currently interning at ezTravel (易遊網). This blog records more than technology; it is a trail of growth. I want to share the confusion and breakthroughs of learning, and the ideas and reflections of building things, with anyone who is working hard. I hope what you find here helps you move forward, grow together, and light up more possibilities for the future.",
    experience: "Experience",
  },
  experience: [
    {
      date: "2024.7 ~ Now",
      title: "Front-end intern, ezTravel (易遊網)",
      description:
        "Helping build front-end features including product categories, order details, order validation and static SEO pages.",
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
  sidebar: {
    about: "About me",
    more: "Learn more",
    heart: "Pizza heart!",
    alive: (days) => `This site has been alive for ${days} days!`,
    categories: "Categories",
    follow: "Follow",
  },
  footer: { follow: "Follow", rights: "All Rights Reserved." },
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
