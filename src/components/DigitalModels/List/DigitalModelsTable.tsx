import React, {useEffect, useState, useCallback} from 'react';
import {Col, Row, Space, TablePaginationConfig, Tooltip, Button} from 'antd';
import {DeleteFilled, StopFilled, CaretRightFilled} from "@ant-design/icons";
import {BasicTableRow, getBasicTableData, Pagination, Tag} from 'api/table.api';
import {Table} from 'components/common/Table/Table';
import {ColumnsType} from 'antd/es/table';
import {useTranslation} from 'react-i18next';
import {defineColorByPriority, getLocaleStringDateTime} from '@app/utils/utils';
import {notificationController} from 'controllers/notificationController';
import {Status} from '@app/components/profile/profileCard/profileFormNav/nav/payments/paymentHistory/Status/Status';
import {useMounted} from '@app/hooks/useMounted';
import {
    deleteDigitalModelApi,
    getAllDigitalModelsApi, newDigitalModelApi,
    startDigitalModelApi,
    stopDigitalModelApi
} from "@app/api/digitalModels/digitalModels.api";
import {getIpComponent, getParamDataByName, getStatusComponent} from "@app/utils/utilsDigitalModels";
import {NewDigitalModelButton} from "@app/components/DigitalModels/List/NewDigitalModelButton";
import {Link} from "react-router-dom";

const initialPagination: Pagination = {
    defaultCurrent: 1,
    defaultPageSize: 20,
};

export const DigitalModelsTable: React.FC = () => {
    const [pagination, setPagination] = useState(initialPagination);
    const [digitalModels, setDigitalModes] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const {t} = useTranslation();
    const {isMounted} = useMounted();

    const retrieveData = () => {
        getAllDigitalModelsApi()
            .then((response) => {
                if (response.data?.digital_models) {
                    setDigitalModes(response.data?.digital_models);
                } else {
                    notificationController.error({message: t("dm.errorData")});
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
        }, 5000)
        return () => clearInterval(interval)
    }, []);

    const startDigitalModel = (idDigitalModel: string) => {
        notificationController.info({message: t("dm.starting")});
        startDigitalModelApi(idDigitalModel)
            .then((response) => {
                if (response.data) {
                    notificationController.success({message: t("dm.successData")});
                } else {
                    notificationController.error({message: t("dm.errorData")});
                }
            })
            .catch((error) => {
                notificationController.error({message: t("dm.errorData")});
            })
    }

    const stopDigitalModel = (idDigitalModel: string) => {
        notificationController.info({message: t("dm.stopping")});
        stopDigitalModelApi(idDigitalModel)
            .then((response) => {
                if (response.data) {
                    notificationController.success({message: t("dm.successData")});
                } else {
                    notificationController.error({message: t("dm.errorData")});
                }
            })
            .catch((error) => {
                notificationController.error({message: t("dm.errorData")});
            })
    }

    const deleteDigitalModel = (idDigitalModel: string) => {
        notificationController.info({message: t("dm.deleting")});
        deleteDigitalModelApi(idDigitalModel)
            .then((response) => {
                if (response.data) {
                    notificationController.success({message: t("dm.successData")});
                } else {
                    notificationController.error({message: t("dm.errorData")});
                }
            })
            .catch((error) => {
                notificationController.error({message: t("dm.errorData")});
            })
    }

    const newDigitalModel = () => {
        notificationController.info({message: t("dm.creating")});
        newDigitalModelApi()
            .then((response) => {
                if (response.data) {
                    notificationController.success({message: t("dm.successData")});
                } else {
                    notificationController.error({message: t("dm.errorData")});
                }
            })
            .catch((error) => {
                notificationController.error({message: t("dm.errorData")});
            })
    }

    const getColumnActions = (status, id) => {
        return <Row gutter={[10, 10]} wrap={false}>
            {(status == "running" || status == "created") &&
                <Col>
                    <Tooltip title={t("dm.stop")}>
                        <Button onClick={() => stopDigitalModel(id)} style={{background: "red"}} shape="circle"
                                icon={<StopFilled/>}/>
                    </Tooltip>
                </Col>}
            {(status == "stopped" || status == "exited") &&
                <Col>
                    <Tooltip title={t("dm.start")}>
                        <Button onClick={() => startDigitalModel(id)} style={{background: "green"}} shape="circle"
                                icon={<CaretRightFilled/>}/>
                    </Tooltip>
                </Col>}
            {(status == "stopped" || status == "exited") &&
            <Col>
                <Tooltip title={t("dm.delete")}>
                    <Button onClick={() => deleteDigitalModel(id)} style={{background: "gray"}} shape="circle"
                            icon={<DeleteFilled/>}/>
                </Tooltip>
            </Col>}
        </Row>
    }

    const columns: ColumnsType<BasicTableRow> = [
        // {
        //     title: t('dm.id'),
        //     dataIndex: 'short_id',
        //     render: (text: string) => <span>{text}</span>,
        //     width: "20%"
        // },
        {
            title: t('dm.name'),
            dataIndex: 'name',
            render: (text: string, record) => <span><Link to={"/digital-model/" + record?.id}>{text}</Link></span>,
            width: "30%"
        },
        {
            title: t('dm.status'),
            dataIndex: 'status',
            render: (text: string) => <span>{getStatusComponent(text)}</span>,
            width: "10%"
        },
        {
            title: t('dm.ip'),
            dataIndex: 'ip',
            render: (text: string) => <span>{getIpComponent(text, t)}</span>,
            width: "10%"
        },
        {
            title: t('dm.username'),
            dataIndex: 'params',
            render: (params: string) => <span>{getParamDataByName("DIGITAL_MODEL_USERNAME_OWNER", params)}</span>,
            width: "10%"
        },
        {
            title: t('dm.createdAt'),
            dataIndex: 'created',
            render: (text: string) => <span>{getLocaleStringDateTime(text)}</span>,
            width: "10%"
        },
        {
            title: t('dm.startedAt'),
            dataIndex: 'state',
            render: (state: string) => <span>{state?.StartedAt ? getLocaleStringDateTime(state?.StartedAt) : null}</span>,
            width: "10%"
        },
        {
            title: t('dm.finishedAt'),
            dataIndex: 'state',
            render: (state: string) => <span>{state.Status !== "running" ? getLocaleStringDateTime(state?.FinishedAt) : null}</span>,
            width: "10%"
        },
        {
            title: t('dm.actions'),
            dataIndex: 'status',
            render: (status, record) => getColumnActions(status, record.id),
            width: "10%"
        },
    ];

    return (
        <>
            <Row gutter={[10, 10]}>
                <Col span={24}>
                    <Row justify={"end"}>
                        <Col span={3}>
                            <NewDigitalModelButton/>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Table
                        columns={columns}
                        dataSource={digitalModels}
                        key={"id"}
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
