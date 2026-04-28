import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/schema';
import { and, eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';

export async function POST({ request,cookies }) {
	const data = await request.json();

	const user = await db
		.select()
		.from(users)
		.where(and(eq(users.username, data.username), eq(users.password, data.password)));

	if (user.length === 0) {
		return json({ success: false, message: 'Forkert brugernavn eller adgangskode' });
	}

const token = jwt.sign(
	{ id: user[0].id, username: user[0].username },
	env.JWT_SECRET,
	{ expiresIn: '1h' }
);

cookies.set('token', token, {
	path: '/',
	httpOnly: true,
	maxAge: 60 * 60
});

return json({
	success: true,
	userId: user[0].username
});
}