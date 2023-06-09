import React from 'react';
import { Avatar, Col, Row } from 'antd';
import { H6 } from '@app/components/common/typography/H6/H6';
import { ProfileOverlay } from '../ProfileOverlay/ProfileOverlay';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { useResponsive } from '@app/hooks/useResponsive';
import * as S from './ProfileDropdown.styles';
import { Popover } from '@app/components/common/Popover/Popover';

export const ProfileDropdown: React.FC = () => {
  const { isTablet } = useResponsive();

  const user = useAppSelector((state) => state.user.user);

  return user ? (
    <Popover content={<ProfileOverlay />} trigger="click">
      <S.ProfileDropdownHeader as={Row} gutter={[10, 10]} align="middle">
        <Col>
          {/*<Avatar src={user.imgUrl} alt="User" shape="circle" size={40} />*/}
        </Col>
        {isTablet && (
          <Col>
            <H6>{user}</H6>
          </Col>
        )}
      </S.ProfileDropdownHeader>
    </Popover>
  ) : null;
};
