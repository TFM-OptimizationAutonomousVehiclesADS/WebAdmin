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
import { Button, Modal } from "antd";
import { LogSampleResultsPreview } from "@app/components/DigitalModels/DigitalModel/LogSampleResultsPreview";

export const LogsAnomaliesOverTimelineChartRealSystem: React.FC = ({rangeDatetime}) => {
  const [realSystemLogsSamples, setRealSystemLogsSamples] = useState([]);
  const [option, setOption] = useState({});
  const [loading, setLoading] = useState<boolean>(true);
  const {t} = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logSampleSelected, setLogSampleSelected] = useState(null);
  const [thresholdAnomalySelected, setThresholdAnomalySelected] = useState(0.5);
  const theme = useAppSelector((state) => state.theme.theme);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setOption(getOption(realSystemLogsSamples));
  }, [realSystemLogsSamples]);

  useEffect(() => {
      retrieveAllDataLogsSamples();
  }, [rangeDatetime]);

  const retrieveAllDataLogsSamples = () => {
    getLogsAnomaliesByRealSystemApiAndRange(rangeDatetime)
      .then((response) => {
        if (response.data?.data?.anomalies) {
          setRealSystemLogsSamples(JSON.parse(response.data?.data?.anomalies));
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

  const getListNamesModels = (realSystemLogsSamples) => {
    const names = ["real-system"];
    return names;
  }

  const handleDataClickSeries = (params) => {
    setThresholdAnomalySelected(params.data.thresholdAnomaly)
    setLogSampleSelected(params.data.logInfo);
    showModal();
  }

  const getSeries = (realSystemLogsSamples) => {
    const series = [];

    if (realSystemLogsSamples) {
        const seriesItem = {
            name: "real-system",
            type: 'line',
            data: [],
            smooth: true,
            lineStyle: {
              opacity: 0.5
            },
          };
        const dataSeries = [];
        realSystemLogsSamples.forEach((logInfo) => {
          const value = logInfo?.["prediction"];
          const timestamp = logInfo?.timestamp;
          const date = moment(timestamp, 'YYYY-MM-DD HH:mm:ss.SSSSSS').toDate();
          dataSeries.push({
            name: date.toLocaleString(),
            value: [date.toISOString(), value],
            logInfo: logInfo,
            thresholdAnomaly: 0.5
          })
        })
        seriesItem["data"] = dataSeries;
        series.push(seriesItem);
    }
    return series;
  }

  const getOption = (realSystemLogsSamples) => {
    const option = {
      textStyle: {
        color: themeObject[theme].textMain
      },
      title: {
        text: 'Timeline Anomalies',
        left: 0,
        textStyle: {
          color: themeObject[theme].textMain
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: getListNamesModels(realSystemLogsSamples),
        textStyle: {
          color: themeObject[theme].textMain
        }
      },
      color: ["red"],
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
      },
      xAxis: {
        type: 'time',
        // data: getCategories(digitalModelsLogsSamples),
        // boundaryGap: false,
        // axisLine: { onZero: false },
        // splitLine: { show: false },
        // min: 'dataMin',
        // max: 'dataMax'
      },
      yAxis: {
        scale: true,
        splitArea: {
          show: true
        }
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          show: true,
          type: 'slider',
          top: '90%',
          start: 0,
          end: 100
        }
      ],
      series: getSeries(realSystemLogsSamples)
    };
    return option;
  }

  return (
    <>
      <BaseChart option={option} height={"30vh"} onEvents={{
        click: handleDataClickSeries
      }}/>
      <Modal open={isModalOpen} centered width={2000} onOk={handleOk} onCancel={handleCancel}>
        <LogSampleResultsPreview logSampleInfo={logSampleSelected} thresholdAnomaly={thresholdAnomalySelected}/>
      </Modal>
    </>
  )

}