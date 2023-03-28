import React from 'react';
import {DashboardOutlined, DeploymentUnitOutlined, ClusterOutlined, AlertOutlined, BugOutlined, FundProjectionScreenOutlined} from '@ant-design/icons';
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
        title: 'common.alerts-dashboard',
        key: 'alerts-dashboard',
        url: '/',
        icon: <AlertOutlined/>,
    },
    {
        title: 'common.anomalies-dashboard',
        key: 'anomalies-dashboard',
        url: '/anomalies-dashboard',
        icon: <BugOutlined />,
    },
    {
        title: 'common.retraining-dashboard',
        key: 'retraining-dashboard',
        url: '/retraining-dashboard',
        icon: <FundProjectionScreenOutlined />,
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
