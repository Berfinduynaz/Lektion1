import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/schema';

export async function POST({ request }) {
	try {
		const data = await request.json();

		if (!data.username || !data.password) {
			return json({ success: false, message: 'Manglende data' });
		}

		await db.insert(users).values({
			username: data.username,
			password: data.password
		});

		return json({ success: true });

	} catch (error) {
		console.error(error);
		return json({ success: false, message: 'Server fejl' });
	}
}