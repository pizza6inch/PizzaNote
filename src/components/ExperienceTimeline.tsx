"use client";

import React from "react";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { useTheme } from "./ThemeProvider";
import { Briefcase, Users, Book } from "lucide-react";

const icons = [Briefcase, Users, Book];

export interface ExperienceItem {
  date: string;
  title: string;
  description: string;
}

export default function ExperienceTimeline({ items }: { items: ExperienceItem[] }) {
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
      {items.map((item, index) => {
        const IconComponent = icons[index % icons.length];
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
