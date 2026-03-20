import { create } from "zustand";

export type NotificationType = "success" | "error" | "info" | "confirm"; // ← add confirm

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  onConfirm?: () => void; // ← callback for yes
  onCancel?: () => void;  // ← callback for no
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (message: string, type?: NotificationType) => void;
  addConfirmation: (               // ← NEW
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
  ) => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  addNotification: (message, type = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      notifications: [...state.notifications, { id, message, type }],
    }));
    // Auto-remove after 3 seconds
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 3000);
  },

  // ← NEW: Confirmation stays until user clicks Yes or No
  addConfirmation: (message, onConfirm, onCancel) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id,
          message,
          type: 'confirm',
          onConfirm: () => {
            onConfirm();
            set((state) => ({
              notifications: state.notifications.filter((n) => n.id !== id),
            }));
          },
          onCancel: () => {
            onCancel?.();
            set((state) => ({
              notifications: state.notifications.filter((n) => n.id !== id),
            }));
          },
        },
      ],
    }));
    // ← No auto-remove for confirmations
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));