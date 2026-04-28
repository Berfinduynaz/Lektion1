import { db } from '$lib/server/db';
import { diaryPost } from '$lib/schema';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function GET({ locals }) {
	const userId = locals.user.id;

	const posts = await db
		.select()
		.from(diaryPost)
		.where(eq(diaryPost.userId, userId));

	return json(posts);
}

export async function POST({ request, locals }) {
	const userId = locals.user.id;

	const { title, content } = await request.json();

	const newPost = await db
		.insert(diaryPost)
		.values({
			userId,
			title,
			content
		})
		.returning();

	return json(newPost[0], { status: 201 });
}