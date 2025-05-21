import { ZOOM_ACCOUNT_ID, ZOOM_SS_OAUTH_ID, ZOOM_SS_OAUTH_SECRET } from '$env/static/private';
import axios from 'axios';
import qs from 'query-string';

export const POST = async ({ request }) => {
	const { topic } = await request.json();
	const token = await getToken();

	try {
		const response = await axios.post(
			'https://api.zoom.us/v2/users/me/meetings',
			{
				topic,
				type: 2,
				start_time: Date.now(),
				duration: 30,
				settings: {
					join_before_host: true
				}
			},
			{
				headers: {
					Authorization: `Bearer ${token.access_token}`,
					'Content-Type': 'application/json'
				}
			}
		);

		return new Response(JSON.stringify(response.data), { status: 200 });
	} catch (error: any) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}
};

const getToken = async () => {
	try {
		const request = await axios.post(
			'https://zoom.us/oauth/token',
			qs.stringify({ grant_type: 'account_credentials', account_id: ZOOM_ACCOUNT_ID }),
			{
				headers: {
					Authorization: `Basic ${Buffer.from(`${ZOOM_SS_OAUTH_ID}:${ZOOM_SS_OAUTH_SECRET}`).toString('base64')}`
				}
			}
		);

		return await request.data;
	} catch (e) {
		console.error(e?.message, e?.response?.data);
	}
};
