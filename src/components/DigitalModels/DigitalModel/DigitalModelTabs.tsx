import React from 'react';
import {useTranslation} from 'react-i18next';
import {Tabs, TabsProps } from "antd";
import {useParams} from 'react-router-dom'
import {DigitalModelInfo} from "@app/components/DigitalModels/DigitalModel/DigitalModelInfo";
import {
    LogsSamplesTableOfDigitalModel
} from "@app/components/DigitalModels/DigitalModel/LogsSamplesTableOfDigitalModel";
import {
    LogsAnomaliesTableOfDigitalModel
} from "@app/components/DigitalModels/DigitalModel/LogsAnomaliesTableOfDigitalModel";
import {
    LogsRetrainingEvaluationTableOfDigitalModel
} from "@app/components/DigitalModels/DigitalModel/LogsRetrainingEvaluationTableOfDigitalModel";
import {getParamDataByName} from "@app/utils/utilsDigitalModels";
import {DigitalModelActualModel} from "@app/components/DigitalModels/DigitalModel/DigitalModelActualModel";
import { DigitalModelManualPredictionSingle } from "@app/components/DigitalModels/DigitalModel/DigitalModelManualPredictionSingle";
import {
    DigitalModelManualPredictionTabs
} from "@app/components/DigitalModels/DigitalModel/DigitalModelManualPredictionTabs";

export const DigitalModelTabs: React.FC = ({info}) => {
    const {t} = useTranslation();
    const {idDigitalModel} = useParams();

    const items: TabsProps['items'] = [
        {
            key: 'info',
            label: t("dm.info"),
            children: <DigitalModelInfo idDigitalModel={idDigitalModel}/>,
        },
        {
            key: 'actualModel',
            label: t("dm.actualModel"),
            children: <DigitalModelActualModel idDigitalModel={idDigitalModel}/>,
        },
        {
            key: 'predictionLogs',
            label: t("dm.predictionLogs"),
            children: <LogsSamplesTableOfDigitalModel idDigitalModel={idDigitalModel} thresholdAnomaly={parseFloat(getParamDataByName("DIGITAL_MODEL_THRESHOLD_ANOMALY", info?.params)) || 0.5}/>,
        },
        {
            key: 'anomaliesLogs',
            label: t("dm.anomaliesLogs"),
            children: <LogsAnomaliesTableOfDigitalModel idDigitalModel={idDigitalModel} thresholdAnomaly={parseFloat(getParamDataByName("DIGITAL_MODEL_THRESHOLD_ANOMALY", info?.params)) || 0.5}/>,
        },
        {
            key: 'retrainingLogs',
            label: t("dm.retrainingLogs"),
            children: <LogsRetrainingEvaluationTableOfDigitalModel idDigitalModel={idDigitalModel}/>,
        },
        {
            key: 'manualPrediction',
            label: t("dm.manualPrediction"),
            children: <DigitalModelManualPredictionTabs idDigitalModel={idDigitalModel} thresholdAnomaly={parseFloat(getParamDataByName("DIGITAL_MODEL_THRESHOLD_ANOMALY", info?.params)) || 0.5}/>,
        },
    ];

    return (
        <>
            <Tabs defaultActiveKey="info" items={items} destroyInactiveTabPane/>
        </>
    );
};
