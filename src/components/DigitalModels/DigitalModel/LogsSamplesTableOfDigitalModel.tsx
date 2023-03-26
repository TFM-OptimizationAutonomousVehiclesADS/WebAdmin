import React, {useEffect, useState, useCallback} from 'react';
import {Col, Row, Space, TablePaginationConfig, Tooltip, Button, Image, Checkbox} from 'antd';
import {DeleteFilled, StopFilled, CaretRightFilled} from "@ant-design/icons";
import {BasicTableRow, getBasicTableData, Pagination, Tag} from 'api/table.api';
import {Table} from 'components/common/Table/Table';
import {ColumnsType} from 'antd/es/table';
import {useTranslation} from 'react-i18next';
import {getLocaleStringDateTime} from '@app/utils/utils';
import {notificationController} from 'controllers/notificationController';
import {
    getDigitalModelByIdApi,
    getLogsSamplesByIdDigitalModelApi, newDigitalModelApi,
} from "@app/api/digitalModels/digitalModels.api";
import {
    getCameraNameByCameraValue, getParamDataByName, getPredictionTag,
} from "@app/utils/utilsDigitalModels";

const initialPagination: Pagination = {
    defaultCurrent: 1,
    defaultPageSize: 20,
};

export const LogsSamplesTableOfDigitalModel: React.FC = ({idDigitalModel, thresholdAnomaly}) => {
    const [pagination, setPagination] = useState(initialPagination);
    const [logsSamples, setLogsSamples] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const {t} = useTranslation();

    const retrieveData = () => {
        getLogsSamplesByIdDigitalModelApi(idDigitalModel)
            .then((response) => {
                if (response.data?.data?.logs) {
                    setLogsSamples(JSON.parse(response.data?.data.logs));
                }
            })
            .catch((error) => {
                notificationController.error({message: t("dm.errorData")});
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        retrieveData();
        const interval = setInterval(() => {
            retrieveData()
        }, 10000)
        return () => clearInterval(interval)
    }, []);

    const columns: ColumnsType<BasicTableRow> = [
        // {
        //     title: t('dm.token'),
        //     dataIndex: 'key_camera_token',
        //     width: "10%"
        // },
        {
            title: t('dm.camera'),
            dataIndex: 'channel_camera',
            render: (channel_camera) => <span>{channel_camera}</span>,
            width: "10%",
            filters: [
                {
                    text: 'CAM_BACK',
                    value: 'CAM_BACK',
                },
                {
                    text: 'CAM_FRONT',
                    value: 'CAM_FRONT',
                },
            ],
            onFilter: (value: string, record) => record.channel_camera === value,
        },
        {
            title: t('dm.speed'),
            dataIndex: 'speed',
            render: (speed) => <span>{parseFloat(speed).toFixed(2)}</span>,
            width: "10%",
            sorter: (a, b) => a.speed - b.speed,
        },
        {
            title: t('dm.rotation'),
            dataIndex: 'rotation_rate_z',
            render: (rotation) => <span>{parseFloat(rotation).toFixed(2)}</span>,
            width: "10%",
            sorter: (a, b) => a.rotation_rate_z - b.rotation_rate_z,
        },
        {
            title: t('dm.resizedImage'),
            dataIndex: 'image_resized_base64',
            render: (resizedImage) => <Image width={50} src={"data:image/png;base64," + resizedImage}/>,
            width: "10%"
        },
        {
            title: t('dm.objectImage'),
            dataIndex: 'object_resized_base64',
            render: (objectImage) => <Image width={50} src={"data:image/png;base64," + objectImage}/>,
            width: "10%"
        },
        {
            title: t('dm.surfaceImage'),
            dataIndex: 'surface_resized_base64',
            render: (surfaceImage) => <Image width={50} src={"data:image/png;base64," + surfaceImage}/>,
            width: "10%"
        },
        {
            title: t('dm.prediction'),
            dataIndex: 'prediction',
            render: (prediction) =>
                <span>{getPredictionTag(parseFloat(prediction).toFixed(2), thresholdAnomaly)}</span>,
            width: "10%",
            sorter: (a, b) => a.prediction - b.prediction,
        },
        {
            title: t('dm.anomaly'),
            dataIndex: 'prediction',
            render: (prediction) => <span><Checkbox checked={prediction >= thresholdAnomaly}/></span>,
            width: "10%",
            filters: [
                {
                    text: 'anomaly',
                    value: 'anomaly',
                },
            ],
            onFilter: (value, record) => record.prediction >= thresholdAnomaly,
        },
        {
            title: t('dm.date'),
            dataIndex: 'timestamp',
            render: (timestamp) => <span>{getLocaleStringDateTime(timestamp)}</span>,
            width: "10%",
            sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
        },
    ];

    return (
        <>
            <Row gutter={[10, 10]}>
                <Col span={24}>
                    <Row justify={"end"}>
                        <Col span={3}>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Table
                        columns={columns}
                        dataSource={logsSamples}
                        key={"_id"}
                        // pagination={pagination}
                        loading={loading}
                        // onChange={handleTableChange}
                        scroll={{x: 800}}
                        bordered
                    />
                </Col>
            </Row>
        </>

    );
};
