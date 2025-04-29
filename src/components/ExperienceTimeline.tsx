"use client";

import React from "react";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { useTheme } from "./ThemeProvider";
import { Briefcase, Users, Book } from "lucide-react";

const experienceData = [
  {
    date: "2024.7 ~ Now",
    title: "易遊網實習生",
    description: "負責開發易遊網的前端和後端功能，包括用戶登錄、註冊、文章分類、文章詳細頁面等。",
    icon: Briefcase,
  },
  {
    date: "2025.1 ~ 2025.3",
    title: "學生計算機年會開發組志工",
    description: "協助開發年會官方網站及大地遊戲。",
    icon: Users,
  },
  {
    date: "2021.8 ~ 2025.6",
    title: "國立台北科技大學",
    description: "資訊工程學系",
    icon: Book,
  },
];

export default function ExperienceTimeline() {
  const { theme } = useTheme();

  const isDark =
    theme === "dark" ||
    (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const lineColor = isDark ? "#fff" : "#000";

  const contentStyle = {
    background: isDark ? "#1f2937" : "#fff", // gray-800 or white
    color: isDark ? "#d1d5db" : "#000", // gray-300 or black
    borderRadius: "8px",
    boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.7)" : "0 2px 8px rgba(0,0,0,0.1)", // stronger shadow in dark mode
  };

  const contentArrowStyle = {
    borderRight: `7px solid ${isDark ? "#1f2937" : "#fff"}`,
  };

  const iconStyle = {
    background: "#dc2626", // same red-600 for both modes
    color: "#fff",
    boxShadow: `0 0 0 4px #dc2626`,
  };

  return (
    <VerticalTimeline lineColor={lineColor} layout="2-columns">
      {experienceData.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <VerticalTimelineElement
            key={index}
            date={item.date}
            contentStyle={contentStyle}
            contentArrowStyle={contentArrowStyle}
            iconStyle={iconStyle}
            icon={<IconComponent size={24} />}
          >
            <h3 className="vertical-timeline-element-title font-semibold text-lg">{item.title}</h3>
            <p className="whitespace-pre-line">{item.description}</p>
          </VerticalTimelineElement>
        );
      })}
    </VerticalTimeline>
  );
}
