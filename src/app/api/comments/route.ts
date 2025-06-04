import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '../../../sanity/lib/client';

export async function POST(request: NextRequest) {
  try {
    const { authorName, content, postId } = await request.json();

    if (!authorName || !content || !postId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newCommentObj = {
      _type: 'comment',
      authorName,
      content,
      commentedAt: new Date().toISOString(),
      post: {
        _type: 'reference',
        _ref: postId,
      },
    };

    const createdComment = await writeClient.create(newCommentObj);

    return NextResponse.json({ message: 'Comment created', comment: createdComment }, { status: 201 });
  } catch (error) {
    console.error('Failed to create comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
