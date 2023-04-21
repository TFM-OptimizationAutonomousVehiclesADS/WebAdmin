import React, { useEffect, useState } from "react";
import {
  getAllDigitalModelsApi, getLogsAnomaliesByIdDigitalModelApiAndRange,
  getLogsRetrainingEvaluationByIdDigitalModelApiAndRange, getLogsSamplesByIdDigitalModelApiAndRange
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

export const LogsSamplesOverTimelineChart: React.FC = ({rangeDatetime}) => {
  const [digitalModels, setDigitalModes] = useState([]);
  const [digitalModelsLogsSamples, setDigitalModelsLogsSamples] = useState({});
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
  }, []);

  useEffect(() => {
    setOption(getOption(digitalModelsLogsSamples));
  }, [digitalModelsLogsSamples]);

  useEffect(() => {
    if (digitalModels) {
      retrieveAllDataLogsSamples();
    }
  }, [digitalModels, rangeDatetime]);

  const retrieveAllDataLogsSamples = async () => {
    const dictDigitalModelsLogsSamples = {};
    const promises = digitalModels.map(async (digital_model) => {
      // dictDigitalModelsLogsSamples[digital_model.id] = {};
      const logs = await retrieveDataLogsSamples(digital_model.id);
      if (logs) {
        dictDigitalModelsLogsSamples[digital_model.id] = {logs: logs, ...digital_model};
      }
    });
    await Promise.all(promises);
    setDigitalModelsLogsSamples(dictDigitalModelsLogsSamples);
  };

  const retrieveDataLogsSamples = async (idDigitalModel) => {
    try {
      const response = await getLogsSamplesByIdDigitalModelApiAndRange(idDigitalModel, rangeDatetime)
      if (response.data?.data?.logs) {
        return JSON.parse(response.data?.data.logs);
      }
    } catch (exception) {
      console.error(exception)
    }
    return null;
  }

  const getListNamesModels = (digitalModelsRetrainings) => {
    const names = [];
    if (digitalModelsRetrainings) {
      Object.values(digitalModelsRetrainings).forEach((digitalModelsRetrainingsOfAnDigitalModel) => {
        names.push(digitalModelsRetrainingsOfAnDigitalModel?.name);
      })
    }
    return names;
  }

  const getCategories = (digitalModelsLogsSamples) => {
    const categories = [];

    if (digitalModelsLogsSamples) {
      const categoriesDate = [];
      Object.values(digitalModelsLogsSamples).forEach((digitalModelsLogsSamplesOfAnDigitalModel) => {
        digitalModelsLogsSamplesOfAnDigitalModel?.logs?.forEach((logInfo) => {
          const timestamp = logInfo?.timestamp;
          const date = moment(timestamp, 'YYYY-MM-DD HH:mm:ss.SSSSSS').toDate();
          const datestring = date.toLocaleString();
          if (!categoriesDate.includes(date)) {
            categoriesDate.push(date);
          }
        })
      })
      categoriesDate.sort((a,b) => a-b);
      categoriesDate.forEach((categoryDate) => {
        categories.push(categoryDate.toLocaleString())
      })
    }
    return categories;
  }

  const getAnomaliesSeriesColorData = (params, threshold) => {
    if (params.value >= threshold) {
      return {color: "red"}
    }
    return null;
  }

  const handleDataClickSeries = (params) => {
    console.log(params);
    setThresholdAnomalySelected(params.data.thresholdAnomaly)
    setLogSampleSelected(params.data.logInfo);
    showModal();
  }

  const getSeries = (digitalModelsLogsSamples) => {
    const series = [];

    if (digitalModelsLogsSamples) {
      Object.values(digitalModelsLogsSamples).forEach((digitalModelsLogsSamplesOfAnDigitalModel) => {
        const seriesItem = {
            name: digitalModelsLogsSamplesOfAnDigitalModel?.name,
            type: 'line',
            data: [],
            smooth: true,
            lineStyle: {
              opacity: 0.5
            },
          };
        const dataSeries = [];
        digitalModelsLogsSamplesOfAnDigitalModel?.logs?.forEach((logInfo) => {
          const value = logInfo?.["prediction"];
          const timestamp = logInfo?.timestamp;
          const date = moment(timestamp, 'YYYY-MM-DD HH:mm:ss.SSSSSS').toDate();
          dataSeries.push({
            name: date.toLocaleString(),
            value: [date.toISOString(), value],
            logInfo: logInfo,
            thresholdAnomaly: parseFloat(getParamDataByName("DIGITAL_MODEL_THRESHOLD_ANOMALY", digitalModelsLogsSamplesOfAnDigitalModel?.params)) || 0.5
          })
        })
        seriesItem["data"] = dataSeries;
        series.push(seriesItem);
      })
    }
    return series;
  }

  const getOption = (digitalModelsLogsSamples) => {
    const option = {
      textStyle: {
        color: themeObject[theme].textMain
      },
      title: {
        text: 'Timeline Predictions',
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
        data: getListNamesModels(digitalModelsLogsSamples),
        textStyle: {
          color: themeObject[theme].textMain
        }
      },
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
          start: 50,
          end: 100
        },
        {
          show: true,
          type: 'slider',
          top: '90%',
          start: 50,
          end: 100
        }
      ],
      series: getSeries(digitalModelsLogsSamples)
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