import React, { useEffect, useState } from "react";
import { BellOutlined } from '@ant-design/icons';
import { Button } from '@app/components/common/buttons/Button/Button';
import { Badge } from '@app/components/common/Badge/Badge';
import { NotificationsOverlay } from '@app/components/header/components/notificationsDropdown/NotificationsOverlay/NotificationsOverlay';
import {
  notifications as fetchedNotifications,
  Notification,
  getNotDeliveredAllAlertsMessagesApi, convertAlertsMessagesToNotifications
} from "@app/api/notifications.api";
import { HeaderActionWrapper } from '@app/components/header/Header.styles';
import { Popover } from '@app/components/common/Popover/Popover';

export const NotificationsDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpened, setOpened] = useState(false);

  const retrieveData = () => {
    getNotDeliveredAllAlertsMessagesApi()
      .then((response) => {
        if (response.data?.alerts) {
          setNotifications(convertAlertsMessagesToNotifications(response.data?.alerts));
        }
      })
  }

  useEffect(() => {
    retrieveData();
    const interval = setInterval(() => {
      retrieveData()
    }, 60000)
    return () => clearInterval(interval)
  }, []);

  return (
    <Popover
      trigger="click"
      content={<NotificationsOverlay notifications={notifications.slice(0, 7)} setNotifications={setNotifications} />}
      onOpenChange={setOpened}
    >
      <HeaderActionWrapper>
        <Button
          type={isOpened ? 'ghost' : 'text'}
          icon={
            <Badge dot>
              <BellOutlined />
            </Badge>
          }
        />
      </HeaderActionWrapper>
    </Popover>
  );
};
