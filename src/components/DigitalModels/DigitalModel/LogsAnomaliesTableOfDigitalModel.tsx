import React, {useEffect, useState, useCallback} from 'react';
import { Col, Row, DatePicker, Space, TablePaginationConfig, Tooltip, Button, Image, Modal } from "antd";
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
    getAllDigitalModelsApi,
    getLogsAnomaliesByIdDigitalModelApi,
    getLogsAnomaliesByIdDigitalModelApiAndRange,
    getLogsSamplesByIdDigitalModelApi,
    newDigitalModelApi,
    startDigitalModelApi,
    stopDigitalModelApi
} from "@app/api/digitalModels/digitalModels.api";
import {
    getCameraNameByCameraValue,
    getIpComponent,
    getParamDataByName, getPredictionTag,
    getStatusComponent
} from "@app/utils/utilsDigitalModels";
import {NewDigitalModelButton} from "@app/components/DigitalModels/List/NewDigitalModelButton";
import {Link} from "react-router-dom";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DigitalModelPreview } from "@app/components/DigitalModels/DigitalModel/DigitalModelPreview";
import { LogSampleResultsPreview } from "@app/components/DigitalModels/DigitalModel/LogSampleResultsPreview";
import moment from "moment/moment";

dayjs.extend(customParseFormat);

const dateFormat = 'DD/MM/YYYY HH:mm:ss';
// const startDatetime = dayjs().subtract(1, "day");
// const endDatetime = dayjs();
const startDatetime = moment().subtract(8, "hour");
const endDatetime = moment();
const { RangePicker } = DatePicker;

const initialPagination: Pagination = {
    defaultCurrent: 1,
    defaultPageSize: 20,
};

export const LogsAnomaliesTableOfDigitalModel: React.FC = ({idDigitalModel, thresholdAnomaly}) => {
    const [pagination, setPagination] = useState(initialPagination);
    const [logsSamples, setLogsSamples] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [rangeDatetime, setRangeDatetime] = useState([startDatetime, endDatetime]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [logSampleIndexSelected, setLogSampleIndexSelected] = useState(0);
    const {t} = useTranslation();

    const retrieveData = () => {
        getLogsAnomaliesByIdDigitalModelApiAndRange(idDigitalModel, rangeDatetime)
            .then((response) => {
                if (response.data?.data?.anomalies) {
                    setLogsSamples(JSON.parse(response.data?.data.anomalies));
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
        // const interval = setInterval(() => {
        //     retrieveData()
        // }, 10000)
        // return () => clearInterval(interval)
    }, []);

    const columns: ColumnsType<BasicTableRow> = [
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
            render: (resizedImage) => <Image preview={false} width={50} src={"data:image/png;base64," + resizedImage}/>,
            width: "10%"
        },
        {
            title: t('dm.objectImage'),
            dataIndex: 'object_resized_base64',
            render: (objectImage) => <Image preview={false} width={50} src={"data:image/png;base64," + objectImage}/>,
            width: "10%"
        },
        {
            title: t('dm.surfaceImage'),
            dataIndex: 'surface_resized_base64',
            render: (surfaceImage) => <Image preview={false} width={50} src={"data:image/png;base64," + surfaceImage}/>,
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
            title: t('dm.date'),
            dataIndex: 'timestamp',
            render: (timestamp) => <span>{getLocaleStringDateTime(timestamp)}</span>,
            width: "10%",
            sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
        },
    ];

    const onChangeRangePicker = (datesObjects, datesStrings) => {
        setRangeDatetime(datesObjects);
    }

    const handleRowClick = (record, index) => {
        const foundIndex = logsSamples.findIndex(item => (
          item["_id"] === record["_id"]
        ));
        setLogSampleIndexSelected(foundIndex);
        showModal();
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handlePrevClick = () => {
        if (logSampleIndexSelected > 0) {
            setLogSampleIndexSelected(logSampleIndexSelected - 1);
        }
    };

    const handleNextClick = () => {
        if (logSampleIndexSelected < (logsSamples?.length-1)) {
            setLogSampleIndexSelected(logSampleIndexSelected + 1);
        }
    };

    return (
        <>
            <Row gutter={[10, 10]}>
                <Col span={24}>
                    <Row justify={"end"}>
                        <Col>
                            <RangePicker showTime format={dateFormat} value={rangeDatetime} onChange={onChangeRangePicker}/>
                        </Col>
                        <Col>
                            <Button onClick={retrieveData} block type={"ghost"}>{t("common.search")}</Button>
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
                        onRow={(record, index) => {
                            return {
                                onClick: () => handleRowClick(record, index),
                            };
                        }}
                        bordered
                    />
                </Col>
            </Row>
            <Modal open={isModalOpen} centered width={2000} onOk={handleOk} onCancel={handleCancel}>
                <LogSampleResultsPreview logSampleInfo={logsSamples[logSampleIndexSelected]} thresholdAnomaly={thresholdAnomaly}/>
                {logSampleIndexSelected > 0 &&
                  <div style={{ position: 'absolute', left: "-10vh", top: "50vh"}}>
                      <Button onClick={handlePrevClick} block style={{fontSize: "5vh", height: "100%"}}>
                          {'<'}
                      </Button>
                  </div>}
                {logSampleIndexSelected < (logsSamples?.length-1) &&
                  <div style={{ position: 'absolute', right: "-10vh", top: "50vh"}}>
                      <Button onClick={handleNextClick} block style={{fontSize: "5vh", height: "100%"}}>
                          {'>'}
                      </Button>
                  </div>}
            </Modal>
        </>

    );
};
