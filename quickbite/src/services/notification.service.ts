import axios from "axios";

export interface NotificationData {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

const API_URL = "/api";

export const notificationApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const notificationService = {
  async getNotifications(): Promise<NotificationData[]> {
    const response = await notificationApi.get(`/notifications`);
    return response.data;
  },

  async markAllAsRead(): Promise<void> {
    const response = await notificationApi.patch(`/notifications/read-all`);
    return response.data;
  },

  async deleteNotification(id: string): Promise<void> {
    const response = await notificationApi.delete(`/notifications/${id}`);
    return response.data;
  },
  
};