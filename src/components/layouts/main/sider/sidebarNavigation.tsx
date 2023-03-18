import React from 'react';
import {DashboardOutlined, DeploymentUnitOutlined, ClusterOutlined} from '@ant-design/icons';
import {ReactComponent as NftIcon} from '@app/assets/icons/nft-icon.svg';

export interface SidebarNavigationItem {
    title: string;
    key: string;
    url?: string;
    children?: SidebarNavigationItem[];
    icon?: React.ReactNode;
}

export const sidebarNavigation: SidebarNavigationItem[] = [
    {
        title: 'common.nft-dashboard',
        key: 'nft-dashboard',
        url: '/',
        icon: <NftIcon/>,
    },
    {
        title: 'common.medical-dashboard',
        key: 'medical-dashboard',
        url: '/medical-dashboard',
        icon: <DashboardOutlined/>,
    },
    {
        title: 'rs.real-system',
        key: 'real-system',
        url: '/real-system',
        icon: <ClusterOutlined />,
    },
    {
        title: 'dm.digital-models',
        key: 'digital-models',
        url: '/digital-models',
        icon: <DeploymentUnitOutlined/>,
    },
];
