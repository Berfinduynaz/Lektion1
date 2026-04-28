import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';

export async function handle({ event, resolve }) {
	const path = event.url.pathname;

	if (['/', '/login', '/admin', '/api/login', '/api/register'].includes(path)) {
		return resolve(event);
	}

	const token = event.cookies.get('token');

	if (!token) {
		return new Response('Unauthorized', { status: 401 });
	}

	try {
		const decoded = jwt.verify(token, env.JWT_SECRET);
		event.locals.user = decoded;
	} catch (err) {
		return new Response('Invalid token', { status: 401 });
	}

	return resolve(event);
}