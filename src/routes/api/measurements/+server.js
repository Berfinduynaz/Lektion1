import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { measurements } from '$lib/schema';
import { and, eq, gte } from 'drizzle-orm';

export async function GET({ locals, url }) {
	if (!locals.user) {
		return json({ error: 'Ikke logget ind' }, { status: 401 });
	}

	const userId = locals.user.id;
	const days = Number(url.searchParams.get('days')) || 14;

	const cutoff = new Date();
	cutoff.setDate(cutoff.getDate() - days);

	const data = await db
		.select()
		.from(measurements)
		.where(and(eq(measurements.userId, userId), gte(measurements.createdAt, cutoff)))
		.orderBy(measurements.createdAt);

	return json(data);
}

export async function POST({ request, locals }) {
	if (!locals.user) {
		return json({ error: 'Ikke logget ind' }, { status: 401 });
	}

	const userId = locals.user.id;
	const data = await request.json();

	await db.insert(measurements).values({
		userId,
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