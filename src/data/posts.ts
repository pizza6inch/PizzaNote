export type Category = {
  name: string;
  slug: string;
};

export type Post = {
  id: number;
  title: string;
  slug: string;
  author: string;
  date: string;
  category?: Category;
  description: string;
  isColumnPost?: boolean;
};

export const blogPosts: Post[] = [
  {
    id: 1,
    title: "CDN 是什麼？一次搞懂 CDN 的用途和三大好處",
    slug: "cdn",
    author: "古古",
    date: "2025/03/18",
    category: {
      name: "其他技術分享",
      slug: "其他技術分享",
    },
    description: "介紹了 CDN 的用途和原理，並且列舉了使用 CDN 的三大好處",
  },
  {
    id: 2,
    title: "Cron 是什麼？定時任務的語法怎麼寫？",
    slug: "cron",
    author: "古古",
    date: "2025/03/11",
    category: {
      name: "其他技術分享",
      slug: "其他技術分享",
    },
    description: "介紹 Cron 表達式的寫法，以及補充 Spring Boot 中的 Cron 的寫法",
  },
  {
    id: 3,
    title: "軟體工程師的自媒體之路 - 2025.2 月報",
    slug: "as-a-content-creator/monthly-report-202502",
    author: "古古",
    date: "2025/03/04",
    category: {
      name: "自媒體經營",
      slug: "自媒體經營",
    },
    description: "記錄 2025.2 月的粉絲成長數、經營自媒體的幕後秘辛",
    isColumnPost: true,
  },
  {
    id: 4,
    title: "Http 中的 GET 和 POST 的差別在哪裡？",
    slug: "http-get-post",
    author: "古古",
    date: "2025/02/25",
    category: {
      name: "其他技術分享",
      slug: "其他技術分享",
    },
    description: "介紹 GET 和 POST 的用法，並且比較他們之間的差別",
  },
  {
    id: 5,
    title: "Polling 和 Webhook 是什麼？如何更有效的串接第三方系統？",
    slug: "polling-webhook",
    author: "古古",
    date: "2025/02/18",
    category: {
      name: "其他技術分享",
      slug: "其他技術分享",
    },
    description: "介紹 Polling 和 Webhook 的概念，以及比較他們之間的差別",
  },
  {
    id: 6,
    title: "DNS 是什麼？在瀏覽器中輸入 URL 會發生什麼事？",
    slug: "dns",
    author: "古古",
    date: "2025/02/04",
    category: {
      name: "其他技術分享",
      slug: "其他技術分享",
    },
    description: "介紹 DNS 是什麼，以及介紹「在瀏覽器中輸入 URL 時」的運作流程",
  },
  {
    id: 7,
    title: "Spring Boot @Scheduled 定時任務設定教學",
    slug: "springboot-scheduled",
    author: "古古",
    date: "2025/01/28",
    category: {
      name: "Spring Boot",
      slug: "spring-boot",
    },
    description: "介紹如何在 Spring Boot 中使用 @Scheduled 註解來設定定時任務",
  },
  {
    id: 8,
    title: "軟體工程師的自媒體之路 - 2025.1 月報",
    slug: "as-a-content-creator/monthly-report-202501",
    author: "古古",
    date: "2025/01/15",
    category: {
      name: "自媒體經營",
      slug: "自媒體經營",
    },
    description: "記錄 2025.1 月的粉絲成長數、收入分析與心得分享",
    isColumnPost: true,
  },
  {
    id: 9,
    title: "MySQL 索引是什麼？如何優化查詢效能？",
    slug: "mysql-index",
    author: "古古",
    date: "2025/01/10",
    category: {
      name: "其他技術分享",
      slug: "其他技術分享",
    },
    description: "介紹 MySQL 索引的原理，以及如何透過索引優化查詢效能",
  },
  {
    id: 10,
    title: "Java Stream API 實用技巧總整理",
    slug: "java-stream-api",
    author: "古古",
    date: "2024/12/28",
    category: {
      name: "Java",
      slug: "java",
    },
    description: "整理 Java Stream API 的實用技巧，讓你寫出更簡潔有力的代碼",
  },
];
