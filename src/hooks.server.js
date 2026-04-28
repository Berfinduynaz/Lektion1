import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';

export async function handle({ event, resolve }) {
	const path = event.url.pathname;

	// Offentlige routes (kræver ikke login)
	const publicRoutes = [
		'/',
		'/login',
		'/admin',
		'/api/login',
		'/api/register'
	];

	if (publicRoutes.includes(path)) {
		return resolve(event);
	}

	// Hent token fra cookie
	const token = event.cookies.get('token');

	// Hvis ingen token → send til login
	if (!token) {
		return new Response(null, {
			status: 302,
			headers: {
				location: '/'
			}
		});
	}

	try {
		// Verificer token
		const decoded = jwt.verify(token, env.JWT_SECRET);

		// Gem bruger i locals
		event.locals.user = decoded;

	} catch (err) {
		// Hvis token er ugyldig → send til login
		return new Response(null, {
			status: 302,
			headers: {
				location: '/'
			}
		});
	}

	// Fortsæt hvis alt er ok
	return resolve(event);
}