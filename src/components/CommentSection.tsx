"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { zhTW } from "date-fns/locale";
import { User } from "lucide-react";
import { COMMENT_BY_POST_SLUGResult } from "../../sanity.types";

// 基於字符串生成一致的顏色
const getColorFromString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }

  return color;
};

export default function CommentSection({
  comments,
  postId,
}: {
  comments: COMMENT_BY_POST_SLUGResult;
  postId: string | null | undefined;
}) {
  // const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !authorName.trim()) return;
    if (!postId) return;

    setLoading(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorName,
          content,
          postId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save comment");
      }

      const data = await response.json();
      console.log("New comment saved to Sanity:", data);

      setAuthorName("");
      setContent("");
    } catch (error) {
      console.error("Failed to save comment to Sanity:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">留言區</h1>

      {/* 顯示留言 */}
      <div className="space-y-4 mb-8">
        {comments.map((comment) => (
          <Card key={comment._id}>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: getColorFromString(comment.authorName || "test"),
                  }}
                >
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{comment.authorName}</h3>
                    <span className="text-sm text-muted-foreground">
                      {comment.commentedAt
                        ? formatDistanceToNow(new Date(comment.commentedAt), {
                            addSuffix: true,
                            locale: zhTW,
                          })
                        : "時間未知"}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 新增留言表單 */}
      <Card>
        <CardHeader>
          <CardTitle>發表留言</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Input
                placeholder="您的名稱"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="寫下您的留言..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            {loading ? <Button disabled>發表中...</Button> : <Button type="submit">發表留言</Button>}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
