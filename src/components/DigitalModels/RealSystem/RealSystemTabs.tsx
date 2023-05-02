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
import {
    LogsRetrainingEvaluationTemplateOfDigitalModel
} from "@app/components/DigitalModels/DigitalModel/LogsRetrainingEvaluationTemplateOfDigitalModel";
import { RealSystemInfo } from "@app/components/DigitalModels/RealSystem/RealSystemInfo";
import { RealSystemActualModel } from "@app/components/DigitalModels/RealSystem/RealSystemActualModel";
import {
    LogsAnomaliesTableOfRealSystem
} from "@app/components/DigitalModels/RealSystem/LogsAnomaliesTableOfRealSystem";
import { LogsSamplesTableOfRealSystem } from "@app/components/DigitalModels/RealSystem/LogsSamplesTableOfRealSystem";
import {
    RealSystemManualPredictionTabs
} from "@app/components/DigitalModels/RealSystem/RealSystemManualPredictionTabs";

export const RealSystemTabs: React.FC = ({info}) => {
    const {t} = useTranslation();

    const items: TabsProps['items'] = [
        {
            key: 'info',
            label: t("dm.info"),
            children: <RealSystemInfo/>,
        },
        {
            key: 'actualModel',
            label: t("dm.actualModel"),
            children: <RealSystemActualModel />,
        },
        {
            key: 'predictionLogs',
            label: t("dm.predictionLogs"),
            children: <LogsSamplesTableOfRealSystem thresholdAnomaly={parseFloat(getParamDataByName("DIGITAL_MODEL_THRESHOLD_ANOMALY", info?.params)) || 0.5}/>,
        },
        {
            key: 'anomaliesLogs',
            label: t("dm.alerts"),
            children: <LogsAnomaliesTableOfRealSystem thresholdAnomaly={parseFloat(getParamDataByName("DIGITAL_MODEL_THRESHOLD_ANOMALY", info?.params)) || 0.5}/>,
        },
        {
            key: 'manualPrediction',
            label: t("dm.manualPrediction"),
            children: <RealSystemManualPredictionTabs thresholdAnomaly={parseFloat(getParamDataByName("DIGITAL_MODEL_THRESHOLD_ANOMALY", info?.params)) || 0.5}/>,
        },
    ];

    return (
        <>
            <Tabs defaultActiveKey="info" items={items} destroyInactiveTabPane/>
        </>
    );
};
