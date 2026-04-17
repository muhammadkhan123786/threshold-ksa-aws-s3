import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage, getToken, Messaging } from 'firebase/messaging';
import { store } from 'store';
import { addNotification } from 'store/notificationsSlice';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const messaging: Messaging = getMessaging(app);

export const getTokenApp = async () => {
    try {
        const token = await getToken(messaging, {
            vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
        });
        return token;
    } catch (error) {
        console.error('Error subscribing to token:', error);
    }
};

onMessage(messaging, (payload) => {
    const notification = {
        id: new Date().toISOString(),
        message: payload.notification?.body || 'New notification',
        timestamp: Date.now(),
    };

    store.dispatch(addNotification(notification));
});

export { messaging };
