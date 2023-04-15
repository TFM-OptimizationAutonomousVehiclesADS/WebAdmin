import React, {useEffect, useState, useCallback} from 'react';
import {Col, Modal, Row, DatePicker, Space, TablePaginationConfig, Tooltip, Button, Image, Checkbox} from 'antd';
import {DeleteFilled, StopFilled, CaretRightFilled} from "@ant-design/icons";
import {BasicTableRow, getBasicTableData, Pagination, Tag} from 'api/table.api';
import {Table} from 'components/common/Table/Table';
import {ColumnsType} from 'antd/es/table';
import {useTranslation} from 'react-i18next';
import {defineColorByPriority, getLocaleStringDateTime} from '@app/utils/utils';
import {notificationController} from 'controllers/notificationController';
import {
    getLogsRetrainingEvaluationByIdDigitalModelApi, getLogsRetrainingEvaluationByIdDigitalModelApiAndRange
} from "@app/api/digitalModels/digitalModels.api";
import {
    getCameraNameByCameraValue,
    getIpComponent, getMetricTag,
    getParamDataByName,
    getStatusComponent
} from "@app/utils/utilsDigitalModels";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ConfusionMatrix } from "@app/components/ConfusionMatrix/ConfusionMatrix";
import { DigitalModelPreview } from "@app/components/DigitalModels/DigitalModel/DigitalModelPreview";

dayjs.extend(customParseFormat);

const dateFormat = 'DD/MM/YYYY HH:mm:ss';
const startDatetime = dayjs().subtract(1, "day");
const endDatetime = dayjs();
const { RangePicker } = DatePicker;

const initialPagination: Pagination = {
    defaultCurrent: 1,
    defaultPageSize: 10,
};



export const LogsRetrainingEvaluationTableOfDigitalModel: React.FC = ({logsRetraining, loading}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [evaluationIndexSelected, setEvaluationIndexSelected] = useState(0);
    const {t} = useTranslation();

    const columns: ColumnsType<BasicTableRow> = [
        {
            title: t('dm.modelImage'),
            dataIndex: 'model_image_base64',
            render: (model_image_base64) => <Image width={100} src={"data:image/png;base64," + model_image_base64}/>,
            width: "10%"
        },
        {
            title: t('dm.retraining'),
            dataIndex: 'retraining',
            render: (retraining) => <Checkbox checked={retraining}/>,
            width: "5%",
            filters: [
                {
                    text: t('dm.retraining'),
                    value: true,
                },
                {
                    text: t('dm.noRetraining'),
                    value: false,
                },
            ],
            onFilter: (value, record) => value ? record.retraining : !record.retraining,
        },
        {
            title: t('dm.retrainWeights'),
            dataIndex: 'retrain_weights',
            render: (retrain_weights) => <Checkbox checked={retrain_weights}/>,
            width: "5%",
            filters: [
                {
                    text: t('dm.retrainWeights'),
                    value: true,
                },
                {
                    text: t('dm.noRetrainWeights'),
                    value: false,
                },
            ],
            onFilter: (value, record) => value ? record.retrain_weights : !record.retrain_weights,
        },
        {
            title: t('dm.bestEpoch'),
            dataIndex: 'best_epoch',
            render: (best_epoch) => <Checkbox checked={best_epoch}/>,
            width: "5%",
            filters: [
                {
                    text: t('dm.bestEpoch'),
                    value: true,
                },
                {
                    text: t('dm.noBestEpoch'),
                    value: true,
                },
            ],
            onFilter: (value, record) => value ? record.best_epoch : !record.best_epoch,
        },
        {
            title: t('dm.randomSplit'),
            dataIndex: 'random',
            render: (random) => <Checkbox checked={random}/>,
            width: "5%",
            filters: [
                {
                    text: t('dm.randomSplit'),
                    value: true,
                },
                {
                    text: t('dm.noRandomSplit'),
                    value: false,
                },
            ],
            onFilter: (value, record) => value ? record.random : !record.random,
        },
        {
            title: t('dm.tunning'),
            dataIndex: 'tunning',
            render: (tunning) => <Checkbox checked={tunning}/>,
            width: "5%",
            filters: [
                {
                    text: t('dm.tunning'),
                    value: true,
                },
                {
                    text: t('dm.noTunning'),
                    value: false,
                },
            ],
            onFilter: (value, record) => value ? record.tunning : !record.tunning,
        },
        {
            title: t('dm.testSize'),
            dataIndex: 'test_size',
            width: "5%",
            sorter: (a, b) => a.test_size - b.test_size,
        },
        {
            title: t('dm.sizeSplit'),
            dataIndex: 'size_split',
            width: "5%",
            sorter: (a, b) => a.size_split - b.size_split,
        },
        {
            title: t('dm.epochs'),
            dataIndex: 'epochs',
            width: "5%",
            sorter: (a, b) => a.epochs - b.epochs,
        },
        {
            title: t('dm.accuracy'),
            dataIndex: 'accuracy',
            render: (accuracy) => <span>{getMetricTag(accuracy)}</span>,
            width: "10%",
            sorter: (a, b) => a.accuracy - b.accuracy,
        },
        {
            title: t('dm.precision'),
            dataIndex: 'precision',
            render: (precision) => <span>{getMetricTag(precision)}</span>,
            width: "10%",
            sorter: (a, b) => a.precision - b.precision,
        },
        {
            title: t('dm.recall'),
            dataIndex: 'recall',
            render: (recall) => <span>{getMetricTag(recall)}</span>,
            width: "10%",
            sorter: (a, b) => a.recall - b.recall,
        },
        {
            title: t('dm.f1-score'),
            dataIndex: 'f1_score',
            render: (f1_score) => <span>{getMetricTag(f1_score)}</span>,
            width: "10%",
            sorter: (a, b) => a.f1_score - b.f1_score,
        },
        {
            title: t('dm.confusionMatrix'),
            dataIndex: 'confusionMatrix',
            render: (confusionMatrix, record) => <ConfusionMatrix tp={record.tp || 0} tn={record.tn || 0} fp={record.fp || 0} fn={record.fn || 0}/>,
            width: "10%",
        },
        {
            title: t('dm.date'),
            dataIndex: 'timestamp',
            render: (timestamp) => <span>{getLocaleStringDateTime(timestamp * 1000)}</span>,
            width: "10%",
            sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
        },
    ];

    const handleRowClick = (record, index) => {
        const foundIndex = logsRetraining.findIndex(item => (
          item["_id"] === record["_id"]
        ));
        setEvaluationIndexSelected(foundIndex);
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
        if (evaluationIndexSelected > 0) {
            setEvaluationIndexSelected(evaluationIndexSelected - 1);
        }
    };

    const handleNextClick = () => {
        if (evaluationIndexSelected < (logsRetraining?.length-1)) {
            setEvaluationIndexSelected(evaluationIndexSelected + 1);
        }
    };

    return (
        <>
                    <Table
                        columns={columns}
                        dataSource={logsRetraining}
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
            <Modal open={isModalOpen} centered width={2000} onOk={handleOk} onCancel={handleCancel}>
                <DigitalModelPreview info={logsRetraining[evaluationIndexSelected]}/>
                {evaluationIndexSelected > 0 &&
                <div style={{ position: 'absolute', left: "-10vh", top: "50vh"}}>
                    <Button onClick={handlePrevClick} block style={{fontSize: "5vh", height: "100%"}}>
                        {'<'}
                    </Button>
                </div>}
                {evaluationIndexSelected < (logsRetraining?.length-1) &&
                <div style={{ position: 'absolute', right: "-10vh", top: "50vh"}}>
                    <Button onClick={handleNextClick} block style={{fontSize: "5vh", height: "100%"}}>
                        {'>'}
                    </Button>
                </div>}
            </Modal>
        </>

    );
};
