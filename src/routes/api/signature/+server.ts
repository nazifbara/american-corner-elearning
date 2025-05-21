import { KJUR } from 'jsrsasign';
import { ZOOM_SDK_KEY, ZOOM_SDK_SECRET } from '$env/static/private';
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	const { slug } = await request.json();
	const JWT = generateSignature(slug, 1);

	return json({ JWT });
};

function generateSignature(sessionName: string, role: number) {
	const sdkKey = ZOOM_SDK_KEY;
	const sdkSecret = ZOOM_SDK_SECRET;
	if (!sdkKey || !sdkSecret) {
		throw new Error('Missing ZOOM_SDK_KEY or ZOOM_SDK_SECRET');
	}
	const iat = Math.round(new Date().getTime() / 1000) - 30;
	const exp = iat + 60 * 60 * 2;
	const oHeader = { alg: 'HS256', typ: 'JWT' };
	const oPayload = {
		app_key: sdkKey,
		tpc: sessionName,
		role_type: role,
		version: 1,
		iat: iat,
		exp: exp
	};
	const sHeader = JSON.stringify(oHeader);
	const sPayload = JSON.stringify(oPayload);
	const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, sdkSecret);
	return sdkJWT;
}
