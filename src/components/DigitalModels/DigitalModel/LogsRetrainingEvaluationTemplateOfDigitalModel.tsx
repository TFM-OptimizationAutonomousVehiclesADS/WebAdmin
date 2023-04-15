import React, {useEffect, useState, useCallback} from 'react';
import {
    Col,
    Modal,
    Row,
    DatePicker,
    Space,
    TablePaginationConfig,
    Tooltip,
    Button,
    Image,
    Checkbox,
    Tabs, TabsProps
} from "antd";
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
import { DigitalModelInfo } from "@app/components/DigitalModels/DigitalModel/DigitalModelInfo";
import { DigitalModelActualModel } from "@app/components/DigitalModels/DigitalModel/DigitalModelActualModel";
import {
    LogsSamplesTableOfDigitalModel
} from "@app/components/DigitalModels/DigitalModel/LogsSamplesTableOfDigitalModel";
import {
    LogsAnomaliesTableOfDigitalModel
} from "@app/components/DigitalModels/DigitalModel/LogsAnomaliesTableOfDigitalModel";
import {
    LogsRetrainingEvaluationTableOfDigitalModel
} from "@app/components/DigitalModels/DigitalModel/LogsRetrainingEvaluationTableOfDigitalModel";
import {
    DigitalModelManualPredictionTabs
} from "@app/components/DigitalModels/DigitalModel/DigitalModelManualPredictionTabs";
import {
    LogsRetrainingEvaluationPreviewsOfDigitalModel
} from "@app/components/DigitalModels/DigitalModel/LogsRetrainingEvaluationPreviewsOfDigitalModel";

dayjs.extend(customParseFormat);

const dateFormat = 'DD/MM/YYYY HH:mm:ss';
const startDatetime = dayjs().subtract(1, "day");
const endDatetime = dayjs();
const { RangePicker } = DatePicker;

const initialPagination: Pagination = {
    defaultCurrent: 1,
    defaultPageSize: 10,
};



export const LogsRetrainingEvaluationTemplateOfDigitalModel: React.FC = ({idDigitalModel}) => {
    const [logsRetraining, setLogsRetraining] = useState([]);
    const [rangeDatetime, setRangeDatetime] = useState([startDatetime, endDatetime]);
    const [loading, setLoading] = useState<boolean>(true);
    const {t} = useTranslation();

    const retrieveData = () => {
        getLogsRetrainingEvaluationByIdDigitalModelApiAndRange(idDigitalModel, rangeDatetime)
            .then((response) => {
                if (response.data?.data?.logs) {
                    setLogsRetraining(JSON.parse(response.data?.data.logs));
                    console.log(JSON.parse(response.data?.data.logs))
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

    const items: TabsProps['items'] = [
        {
            key: 'table',
            label: t("dm.tableView"),
            children: <LogsRetrainingEvaluationTableOfDigitalModel logsRetraining={logsRetraining} loading={loading}/>,
        },
        {
            key: 'preview',
            label: t("dm.preview"),
            children: <LogsRetrainingEvaluationPreviewsOfDigitalModel logsRetraining={logsRetraining} loading={loading}/>,
        },
    ];

    const onChangeRangePicker = (datesObjects, datesStrings) => {
        setRangeDatetime(datesObjects);
    }

    return (
        <Row gutter={[10, 10]}>
            <Col span={24}>
                <Row justify={"end"}>
                    <Col>
                        <RangePicker allowClear showTime format={dateFormat} value={rangeDatetime} onChange={onChangeRangePicker}/>
                    </Col>
                    <Col>
                        <Button onClick={retrieveData} block type={"ghost"}>{t("common.search")}</Button>
                    </Col>
                </Row>
            </Col>
            <Col span={24}>
                <Tabs defaultActiveKey="info" type={"card"} items={items} destroyInactiveTabPane/>
            </Col>
        </Row>

    );
};
