import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the Notification interface
interface Notification {
    id: string;
    message: string;
    timestamp: number;
    seen?: boolean;
}

// Define the shape of the Notifications state
interface NotificationsState {
    notifications: Notification[];
}

// Define the initial state
const initialState: NotificationsState = {
    notifications: [],
};

// Create the notifications slice
export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Notification>) => {
            state.notifications.push({ ...action.payload, seen: false });
        },
        markNotificationAsSeen: (state, action: PayloadAction<string>) => {
            const notification = state.notifications.find(
                (notification) => notification.id === action.payload,
            );
            if (notification) {
                notification.seen = true;
            }
        },
        markAllAsSeen: (state) => {
            state.notifications.forEach((notification) => {
                notification.seen = true;
            });
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(
                (notification) => notification.id !== action.payload,
            );
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
    },
});

// Define the type for the RootState
interface RootState {
    notifications: NotificationsState;
}

// Selector to get notifications from the state
export const selectNotifications = (state: RootState) => state.notifications.notifications;

// Export actions and reducer
export const {
    addNotification,
    markNotificationAsSeen,
    markAllAsSeen,
    removeNotification,
    clearNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
