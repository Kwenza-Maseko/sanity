'use server';

import { currentUser } from '@clerk/nextjs/server';
import { StreamClient } from '@stream-io/node-sdk';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
    const user = await currentUser();

    if (!user) {
        console.error('Error: User is not logged in.');
        throw new Error('User is not logged in');
    }

    if (!apiKey || !apiSecret) {
        console.error('API Key or Secret is missing:', { apiKey, apiSecret });
        throw new Error('API Key or Secret is missing');
    }

    // Log API key, secret, and user ID for debugging (remove in production)
    console.log('API Key:', apiKey);
    console.log('API Secret:', apiSecret);
    console.log('User ID:', user.id);

    // Initialize StreamClient with the correct API Key and Secret
    const client = new StreamClient(apiKey, apiSecret);

    try {
        // Generate a user token
        const token = client.createToken(user.id); // Preferred method
        console.log('Generated Token:', token);
        return token;
    } catch (error) {
        console.error('Error generating Stream token:', error);
        throw new Error('Failed to generate token');
    }
};
