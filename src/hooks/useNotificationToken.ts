import { useEffect, useState } from 'react';
import { getFCMToken } from '../firebase/firebase';
import axios from '../Api/axios';

export const useNotificationToken = () => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const getAndSendToken = async () => {
            try {
                // Get token from Firebase
                const fcmToken = await getFCMToken();
                
                if (fcmToken) {
                    // Save token to state
                    setToken(fcmToken);
                    
                    // Send token to backend
                    await axios.post('/update-device-token', {
                        device_token: fcmToken,
                        device_type: 'web'
                    });
                }
            } catch (error) {
                console.error('Error handling notification token:', error);
            }
        };

        getAndSendToken();
    }, []);

    return token;
}; 