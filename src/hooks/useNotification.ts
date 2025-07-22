import { useEffect, useState } from 'react';
import { getDeviceToken } from '../firebase/firebase';
import axios from '../Api/axios';

export const useNotification = () => {
    const [deviceToken, setDeviceToken] = useState<string | null>(null);

    useEffect(() => {
        const initializeToken = async () => {
            try {
                // Request notification permission
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    // Get the FCM token
                    const token = await getDeviceToken();
                    if (token) {
                        setDeviceToken(token);
                        // Send token to backend
                        await axios.post('/device-tokens', {
                            device_token: token,
                            device_type: 'web'
                        });
                    }
                }
            } catch (error) {
                console.error('Error initializing notifications:', error);
            }
        };

        initializeToken();
    }, []);

    return { deviceToken };
}; 