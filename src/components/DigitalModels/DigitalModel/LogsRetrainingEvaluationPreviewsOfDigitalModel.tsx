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



export const LogsRetrainingEvaluationPreviewsOfDigitalModel: React.FC = ({logsRetraining, loading}) => {
    const [evaluationIndexSelected, setEvaluationIndexSelected] = useState(0);
    const {t} = useTranslation();

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
        <Row gutter={[10, 10]}>
            <Col span={2}>
                <Button onClick={handlePrevClick} block style={{fontSize: "5vh", height: "100%"}} disabled={evaluationIndexSelected<=0}>
                    {'<'}
                </Button>
            </Col>
            <Col span={20}>
                <DigitalModelPreview info={logsRetraining[evaluationIndexSelected]}/>
            </Col>
            <Col span={2}>
                <Button onClick={handleNextClick} block style={{fontSize: "5vh", height: "100%"}} disabled={evaluationIndexSelected>=(logsRetraining?.length-1)}>
                    {'>'}
                </Button>
            </Col>

        </Row>

    );
};
