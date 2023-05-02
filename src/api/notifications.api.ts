import { httpBackApi } from "@app/api/http.api";

export interface Message {
  id: number;
  description: string;
}

export interface Mention extends Message {
  userName: string;
  userIcon: string;
  place: string;
  href: string;
}

export type Notification = Mention | Message;

export const notifications = [
  {
    id: 2,
    description: 'header.notifications.loginAttempt',
  },
  {
    id: 1,
    description: 'header.notifications.successPayment',
  },
  {
    id: 3,
    description: 'header.notifications.serverError',
  },
  {
    id: 4,
    description: 'header.notifications.mention',
    userName: 'Steve Manson',
    userIcon:
      'https://res.cloudinary.com/lapkinthegod/image/upload/v1629187274/young-male-doctor-white-uniform_x7dcrs.jpg',
    place: 'medical-dashboard.latestScreenings.title',
    href: `/#latest-screenings`,
  },
];

export const converTypeMessageToId = (typeMessage: str): number => {
  if (typeMessage === "success") {
    return 1
  }
  if (typeMessage === "error") {
    return 3
  }
  return 2;
}

export const convertAlertsMessagesToNotifications = (alertsMessages: any): Notification[] => {
  const notifications = [];
  if (alertsMessages) {
    alertsMessages.forEach((alertMessage) => {
      const notification = {
        id: converTypeMessageToId(alertMessage?.["typeMessage"]),
        description: alertMessage?.["message"]
      }
      notifications.push(notification);
    })
  }
  return notifications;
}

export const getNotDeliveredAllAlertsMessagesApi = (): Promise<any> => {
  return httpBackApi.get('/alerts/messages/all');
};

export const postDeliveredAllAlertsMessagesApi = (): Promise<any> => {
  return httpBackApi.post('/alerts/delivered/all');
};
