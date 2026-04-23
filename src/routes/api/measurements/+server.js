import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { measurements } from '$lib/schema';
import { eq, gte } from 'drizzle-orm';

export async function GET({ url }) {
	const userId = url.searchParams.get('userId');
	const days = Number(url.searchParams.get('days')) || 14;

	const cutoff = new Date();
	cutoff.setDate(cutoff.getDate() - days);

	const data = await db
		.select()
		.from(measurements)
		.where(eq(measurements.userId, userId))
		.where(gte(measurements.createdAt, cutoff))
		.orderBy(measurements.createdAt);

	return json(data);
}

export async function POST({ request }) {
	const data = await request.json();

	await db.insert(measurements).values({
		userId: data.userId,
		shortnessOfBreath: data.shortnessOfBreath,
		cough: data.cough,
		phlegmAmount: data.phlegmAmount,
		phlegmColor: data.phlegmColor,
		temperature: data.temperature,
		pulse: data.pulse,
		oxygen: data.oxygen
	});

	return json({ success: true });
}