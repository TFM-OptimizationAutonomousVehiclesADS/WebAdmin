import React, { useEffect, useState } from "react";
import {
  getAllDigitalModelsApi,
  getLogsAnomaliesByIdDigitalModelApiAndRange, getLogsAnomaliesByRealSystemApiAndRange,
  getLogsRetrainingEvaluationByIdDigitalModelApiAndRange,
  getLogsSamplesByIdDigitalModelApiAndRange,
  getLogsSamplesByRealSystemApiAndRange
} from "@app/api/digitalModels/digitalModels.api";
import { notificationController } from "@app/controllers/notificationController";
import { useTranslation } from "react-i18next";
import { useMounted } from "@app/hooks/useMounted";
import { RadarMetricsChart } from "@app/components/RadarMetricsChart/RadarMetricsChart";
import { BaseChart } from "@app/components/common/charts/BaseChart";
import * as trace_events from "trace_events";
import { themeObject } from "@app/styles/themes/themeVariables";
import { useAppSelector } from "@app/hooks/reduxHooks";
import moment from "moment/moment";
import { getParamDataByName } from "@app/utils/utilsDigitalModels";
import { Button, Col, Modal, Row } from "antd";
import { LogSampleResultsPreview } from "@app/components/DigitalModels/DigitalModel/LogSampleResultsPreview";
import { DigitalModelPreview } from "@app/components/DigitalModels/DigitalModel/DigitalModelPreview";
import { Loading } from "@app/components/common/Loading";

export const SortedPanelAnomaliesRealSystem: React.FC = ({rangeDatetime}) => {
  const [realSystemLogsSamples, setRealSystemLogsSamples] = useState([]);
  const [logIndexSelected, setLogIndexSelected] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const {t} = useTranslation();
  const [thresholdAnomalySelected, setThresholdAnomalySelected] = useState(0.5);
  const theme = useAppSelector((state) => state.theme.theme);

  useEffect(() => {
      retrieveAllDataLogsSamples();
  }, [rangeDatetime]);

  const retrieveAllDataLogsSamples = () => {
    getLogsAnomaliesByRealSystemApiAndRange(rangeDatetime)
      .then((response) => {
        if (response.data?.data?.anomalies) {
          const logs = JSON.parse(response.data?.data?.anomalies);
          logs.sort((a, b) => b["prediction"] - a["prediction"])
          setRealSystemLogsSamples(logs);
        } else {
          console.log(response)
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
      setLoading(false);
    });
  };

  const handlePrevClick = () => {
    if (logIndexSelected > 0) {
      setLogIndexSelected(logIndexSelected - 1);
    }
  };

  const handleNextClick = () => {
    if (logIndexSelected < (realSystemLogsSamples?.length-1)) {
      setLogIndexSelected(logIndexSelected + 1);
    }
  };

  return (
    <Row gutter={[10,10]}>
      <Col span={2}>
        <Button onClick={handlePrevClick} block style={{fontSize: "5vh", height: "100%"}} disabled={logIndexSelected<=0}>
          {'<'}
        </Button>
      </Col>
      <Col span={20}>
        {loading && <Loading />}
        {!loading && realSystemLogsSamples.length > 0 &&
        <LogSampleResultsPreview logSampleInfo={realSystemLogsSamples[logIndexSelected]} thresholdAnomaly={thresholdAnomalySelected}/>
        }
      </Col>
      <Col span={2}>
        <Button onClick={handleNextClick} block style={{fontSize: "5vh", height: "100%"}} disabled={logIndexSelected>=(realSystemLogsSamples?.length-1)}>
          {'>'}
        </Button>
      </Col>
    </Row>
  )

}