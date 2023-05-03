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
import { Button, Col, Card, Modal, Row } from "antd";
import { LogSampleResultsPreview } from "@app/components/DigitalModels/DigitalModel/LogSampleResultsPreview";
import { DigitalModelPreview } from "@app/components/DigitalModels/DigitalModel/DigitalModelPreview";
import { Loading } from "@app/components/common/Loading";
import {ArrowUpOutlined} from "@ant-design/icons"
import { HealthIndicatorRealSystemChart } from "@app/components/Dashboards/Alerts/HealthIndicatorRealSystemChart";
export const HealthIndicatorRealSystem: React.FC = ({rangeDatetime}) => {
  const [totalLogsSamples, setTotalLogsSamples] = useState(0);
  const [totalLogsSamplesLast, setTotalLogsSamplesLast] = useState(0);
  const [totalLogsAnomalies, setTotalLogsAnomalies] = useState(0);
  const [totalLogsAnomaliesLast, setTotalLogsAnomaliesLast] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const {t} = useTranslation();
  const [thresholdAnomalySelected, setThresholdAnomalySelected] = useState(0.5);
  const theme = useAppSelector((state) => state.theme.theme);

  useEffect(() => {
      retrieveAllDataLogsSamples();
      retrieveAllDataLogsSamplesLast();
      retrieveAllDataLogsAnomalies();
      retrieveAllDataLogsAnomaliesLast();
  }, [rangeDatetime]);

  const retrieveAllDataLogsSamplesLast = () => {
    getLogsSamplesByRealSystemApiAndRange(rangeDatetime)
      .then((response) => {
        if (response.data?.data?.logs) {
          const logs = JSON.parse(response.data?.data?.logs);
          setTotalLogsSamplesLast(logs.length);
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

  const retrieveAllDataLogsSamples = () => {
    getLogsSamplesByRealSystemApiAndRange(null)
      .then((response) => {
        if (response.data?.data?.logs) {
          const logs = JSON.parse(response.data?.data?.logs);
          setTotalLogsSamples(logs.length);
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

  const retrieveAllDataLogsAnomaliesLast = () => {
    getLogsAnomaliesByRealSystemApiAndRange(rangeDatetime)
      .then((response) => {
        if (response.data?.data?.anomalies) {
          const logs = JSON.parse(response.data?.data?.anomalies);
          setTotalLogsAnomaliesLast(logs.length);
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

  const retrieveAllDataLogsAnomalies = () => {
    getLogsAnomaliesByRealSystemApiAndRange(null)
      .then((response) => {
        if (response.data?.data?.anomalies) {
          const logs = JSON.parse(response.data?.data?.anomalies);
          setTotalLogsAnomalies(logs.length);
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



  return (
    <Row gutter={[10,10]}>
      <Col span={12}>
        <Card title={"Nº Predicciones"} bodyStyle={{ display: "flex", alignItems: "center", justifyContent: "center"}}>
          <span style={{fontSize: "5vh", color: "lightgreen"}}>
            {totalLogsSamples}
          </span>
          <span style={{fontSize: "1vh", background: "rgba(50,185,50,0.3)",
          border: "1px solid darkgreen", padding: "0.5vh", marginLeft: "1vh"}}>
            <ArrowUpOutlined /> {totalLogsSamplesLast} (últimas horas)
          </span>
        </Card>
      </Col>
      <Col span={12}>
        <Card title={"Nº Alertas"} bodyStyle={{ display: "flex", alignItems: "center", justifyContent: "center"}}>
          <span style={{fontSize: "5vh", color: "indianred"}}>
            {totalLogsAnomalies}
          </span>
          <span style={{fontSize: "1vh", background: "rgba(185,50,50,0.3)",
            border: "1px solid darkred", padding: "0.5vh", marginLeft: "1vh"}}>
            <ArrowUpOutlined /> {totalLogsAnomaliesLast} (últimas horas)
          </span>
        </Card>
      </Col>
      <Col span={24}>
          <HealthIndicatorRealSystemChart height={"22vh"} loading={loading} totalLogsAnomalies={totalLogsAnomalies} totalLogsSamples={totalLogsSamples}/>
      </Col>
    </Row>
  )

}