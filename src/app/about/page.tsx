import React from "react";
import MainLayout from "@/components/MainLayout";
import Avatar from "@/components/Avatar";
import ExperienceTimeline from "@/components/ExperienceTimeline";

export const metadata = {
  title: "披薩筆記 - 關於我",
  description: "關於披薩筆記的作者 Ewan（Pizza）及其經歷。",
};

export default function AboutPage() {
  return (
    <MainLayout>
      <section className="py-6">
        <div className="container">
          <h4 className="widget-title text-center mx-auto mb-8">關於我</h4>

          <div className="flex justify-center mb-8">
            <Avatar />
          </div>

          <div className="content mb-12" id="introduction">
            <p className="mb-4">
              我是
              Ewan（Pizza），北科資工大四生，目前在易遊網實習。這個部落格紀錄的不只是技術，更是成長的足跡。我想把學習中的困惑與突破、實作中的靈感與反思，真實分享給正在努力的你。希望這裡的內容能陪你一起前進，一起成長，為未來點亮更多可能！
            </p>
          </div>

          <h4 className="widget-title text-center mx-auto mb-8">Experience</h4>

          <ExperienceTimeline />

          {/* Skills, Courses, Social Links remain unchanged */}
          {/* ... rest of your about page content ... */}
        </div>
      </section>
    </MainLayout>
  );
}
