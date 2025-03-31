import React from "react";
import MainLayout from "@/components/MainLayout";
import { Github, Facebook, Instagram } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <MainLayout>
      <section className="section-sm">
        <div className="container">
          <div className="row">
            <div className="lg:w-8/12 mx-auto text-center pt-4">
              <h4 className="widget-title text-center mx-auto mb-8">關於我</h4>

              <div className="flex justify-center mb-8">
                {/* <img
                  src="https://ext.same-assets.com/281259435/4230116617.png"
                  alt=""
                  className="rounded-full w-48 h-48 object-cover"
                /> */}
              </div>

              <div className="content mb-12" id="introduction">
                <p className="mb-4">
                  {/* 我是古君葳（古古），畢業於台大資工所，曾在 Garmin 擔任資深軟體工程師，目前是自由工作者。已在 Hahow 開設 3 堂線上課程，累積 5000+ 位同學一起學習成長💪 */}
                </p>
              </div>

              <h4 className="widget-title text-center mx-auto mb-8">Experience</h4>

              <ul className="timeline mb-12">
                <li className="timeline-item mb-12">
                  <div className="timeline-badge bg-primary text-white px-4 py-2 rounded">
                    <span className="time">2023.3 ~ Now</span>
                  </div>
                  <div className="mt-4">
                    <div className="text-xl font-medium">自由工作者</div>
                  </div>
                </li>

                <li className="timeline-item mb-12">
                  <div className="timeline-badge bg-primary text-white px-4 py-2 rounded">
                    <span className="time">2019.5 ~ 2022.7</span>
                  </div>
                  <div className="mt-4">
                    <div className="text-xl font-medium">資深軟體工程師（Java 後端）</div>
                  </div>
                  <div className="mt-2 text-gray-600">
                    <div className="pb-2">任職於：Garmin</div>
                    <div>工作地點：台灣新北市</div>
                  </div>
                </li>

                <li className="timeline-item mb-12">
                  <div className="timeline-badge bg-primary text-white px-4 py-2 rounded">
                    <span className="time">2018.3 ~ 2019.3</span>
                  </div>
                  <div className="mt-4">
                    <div className="text-xl font-medium">軟體工程師（Java 後端）</div>
                  </div>
                  <div className="mt-2 text-gray-600">
                    <div className="pb-2">任職於：去哪兒網</div>
                    <div>工作地點：中國北京市</div>
                  </div>
                </li>

                <li className="timeline-item mb-12">
                  <div className="timeline-badge bg-primary text-white px-4 py-2 rounded">
                    <span className="time">2015.9 ~ 2018.2</span>
                  </div>
                  <div className="mt-4">
                    <div className="text-xl font-medium">資訊工程研究所</div>
                  </div>
                  <div className="mt-2 text-gray-600">
                    <div className="pb-2">台灣大學</div>
                  </div>
                </li>

                <li className="timeline-item mb-12">
                  <div className="timeline-badge bg-primary text-white px-4 py-2 rounded">
                    <span className="time">2015.7 ~ 2015.8</span>
                  </div>
                  <div className="mt-4">
                    <div className="text-xl font-medium">暑期實習生（軟韌體開發）</div>
                  </div>
                  <div className="mt-2 text-gray-600">
                    <div className="pb-2">任職於：聯發科技</div>
                    <div>工作地點：台灣新竹市</div>
                  </div>
                </li>

                <li className="timeline-item mb-12">
                  <div className="timeline-badge bg-primary text-white px-4 py-2 rounded">
                    <span className="time">2011.9 ~ 2015.6</span>
                  </div>
                  <div className="mt-4">
                    <div className="text-xl font-medium">資訊工程學系</div>
                  </div>
                  <div className="mt-2 text-gray-600">
                    <div className="pb-2">陽明交通大學</div>
                  </div>
                </li>
              </ul>

              <h4 className="widget-title text-center mx-auto mb-8">Skills</h4>

              <div className="skill-progress-bar mb-12">
                <div className="grid gap-4">
                  <div className="mx-auto w-full max-w-md">
                    <div className="progress-title mb-2">Java</div>
                    <div className="h-2 w-full bg-gray-200 rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{ width: "90%" }}></div>
                    </div>
                  </div>

                  <div className="mx-auto w-full max-w-md">
                    <div className="progress-title mb-2">Spring Boot, Spring Security</div>
                    <div className="h-2 w-full bg-gray-200 rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>

                  <div className="mx-auto w-full max-w-md">
                    <div className="progress-title mb-2">Git</div>
                    <div className="h-2 w-full bg-gray-200 rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{ width: "80%" }}></div>
                    </div>
                  </div>

                  <div className="mx-auto w-full max-w-md">
                    <div className="progress-title mb-2">Elastic Search</div>
                    <div className="h-2 w-full bg-gray-200 rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{ width: "75%" }}></div>
                    </div>
                  </div>

                  <div className="mx-auto w-full max-w-md">
                    <div className="progress-title mb-2">Linux, Docker</div>
                    <div className="h-2 w-full bg-gray-200 rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{ width: "70%" }}></div>
                    </div>
                  </div>

                  <div className="mx-auto w-full max-w-md">
                    <div className="progress-title mb-2">Html, Css, Javascript</div>
                    <div className="h-2 w-full bg-gray-200 rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="widget-title text-center mx-auto mb-8">Course</h4>

              <div className="course-list mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="course">
                    <a
                      href="https://bit.ly/3sBlnz5"
                      target="_blank"
                      rel="noreferrer"
                      className="block hover:opacity-90 transition-opacity"
                    >
                      <img
                        className="w-full rounded-lg"
                        src="https://ext.same-assets.com/281259435/112196817.png"
                        alt="Github 免費架站術！輕鬆打造個人品牌"
                      />
                      <div className="course-title mt-2 font-medium">Github 免費架站術！輕鬆打造個人品牌</div>
                    </a>
                  </div>

                  <div className="course">
                    <a
                      href="https://bit.ly/3MDSadK"
                      target="_blank"
                      rel="noreferrer"
                      className="block hover:opacity-90 transition-opacity"
                    >
                      <img
                        className="w-full rounded-lg"
                        src="https://ext.same-assets.com/281259435/916363767.png"
                        alt="Java 工程師必備！Spring Boot 零基礎入門"
                      />
                      <div className="course-title mt-2 font-medium">Java 工程師必備！Spring Boot 零基礎入門</div>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="course">
                    <a
                      href="https://bit.ly/3MKnhV0"
                      target="_blank"
                      rel="noreferrer"
                      className="block hover:opacity-90 transition-opacity"
                    >
                      <img
                        className="w-full rounded-lg"
                        src="https://ext.same-assets.com/281259435/476091749.jpeg"
                        alt="資安一把罩！Spring Security 零基礎入門"
                      />
                      <div className="course-title mt-2 font-medium">資安一把罩！Spring Security 零基礎入門</div>
                    </a>
                  </div>
                </div>
              </div>

              <div className="social-links flex justify-center space-x-4 mb-8">
                <Link href="https://github.com/pizza6inch" target="_blank" rel="noreferrer">
                  <Github className="w-6 h-6 text-gray-600 hover:text-primary transition-colors" />
                </Link>
                <Link href="https://www.facebook.com" target="_blank" rel="noreferrer">
                  <Facebook className="w-6 h-6 text-gray-600 hover:text-primary transition-colors" />
                </Link>
                <Link href="https://www.instagram.com" target="_blank" rel="noreferrer">
                  <Instagram className="w-6 h-6 text-gray-600 hover:text-primary transition-colors" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
