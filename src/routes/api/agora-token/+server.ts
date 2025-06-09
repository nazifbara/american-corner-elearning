import { json } from '@sveltejs/kit';
import { PUBLIC_AGORA_APP_ID } from '$env/static/public';
import { AGORA_APP_CERTIFICATE } from '$env/static/private';
import pkg from 'agora-token';
const { RtcTokenBuilder, RtcRole } = pkg;

export async function POST({ request }) {
	try {
		const { channelName, uid } = await request.json();

		if (!PUBLIC_AGORA_APP_ID || !AGORA_APP_CERTIFICATE) {
			throw new Error('Agora credentials not configured');
		}

		// Set token expire time in seconds (24 hours)
		const expirationTimeInSeconds = 24 * 3600;
		const currentTimestamp = Math.floor(Date.now() / 1000);
		const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

		// Build token with user account
		const token = RtcTokenBuilder.buildTokenWithUid(
			PUBLIC_AGORA_APP_ID,
			AGORA_APP_CERTIFICATE,
			channelName,
			uid,
			RtcRole.PUBLISHER,
			privilegeExpiredTs,
			500
		);

		return json({ token });
	} catch (error) {
		console.error('Error generating token:', error);
		return new Response('Error generating token', { status: 500 });
	}
}
