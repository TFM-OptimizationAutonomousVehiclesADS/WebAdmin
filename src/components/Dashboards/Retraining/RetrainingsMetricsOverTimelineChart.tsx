import React, { useEffect, useState } from "react";
import {
  getAllDigitalModelsApi,
  getLogsRetrainingEvaluationByIdDigitalModelApiAndRange
} from "@app/api/digitalModels/digitalModels.api";
import { notificationController } from "@app/controllers/notificationController";
import { useTranslation } from "react-i18next";
import { useMounted } from "@app/hooks/useMounted";
import { RadarMetricsChart } from "@app/components/RadarMetricsChart/RadarMetricsChart";
import { BaseChart } from "@app/components/common/charts/BaseChart";
import * as trace_events from "trace_events";
import { themeObject } from "@app/styles/themes/themeVariables";
import { useAppSelector } from "@app/hooks/reduxHooks";
import { Modal } from "antd";
import { LogSampleResultsPreview } from "@app/components/DigitalModels/DigitalModel/LogSampleResultsPreview";
import { DigitalModelPreview } from "@app/components/DigitalModels/DigitalModel/DigitalModelPreview";

export const RetrainingsMetricsOverTimelineChart: React.FC = ({rangeDatetime, metric}) => {
  const [digitalModels, setDigitalModes] = useState([]);
  const [digitalModelsRetrainings, setDigitalModelsRetrainings] = useState({});
  const [option, setOption] = useState({});
  const [loading, setLoading] = useState<boolean>(true);
  const {t} = useTranslation();
  const theme = useAppSelector((state) => state.theme.theme);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [retrainingSelected, setRetrainingSelected] = useState(null);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDataClickSeries = (params) => {
    console.log(params);
    setRetrainingSelected(params.data.retrainingInfo)
    showModal();
  }

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
    setOption(getOption(digitalModelsRetrainings));
  }, [digitalModelsRetrainings]);

  useEffect(() => {
    if (digitalModels) {
      retrieveAllDataLogsRetraining();
    }
  }, [digitalModels, rangeDatetime]);

  const retrieveAllDataLogsRetraining = async () => {
    const dictDigitalModelsLogsRetrainings = {};
    const promises = digitalModels.map(async (digital_model) => {
      // dictDigitalModelsLogsRetrainings[digital_model.id] = {};
      const logsRetraining = await retrieveDataLogsRetraining(digital_model.id);
      if (logsRetraining) {
        dictDigitalModelsLogsRetrainings[digital_model.id] = {logsRetraining: logsRetraining, ...digital_model};
      }
    });
    await Promise.all(promises);
    setDigitalModelsRetrainings(dictDigitalModelsLogsRetrainings);
  };

  const retrieveDataLogsRetraining = async (idDigitalModel) => {
    try {
      const response = await getLogsRetrainingEvaluationByIdDigitalModelApiAndRange(idDigitalModel, rangeDatetime)
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

  const getCategories = (digitalModelsRetrainings) => {
    const categories = [];

    if (digitalModelsRetrainings) {
      const categoriesDate = [];
      Object.values(digitalModelsRetrainings).forEach((digitalModelsRetrainingsOfAnDigitalModel) => {
        digitalModelsRetrainingsOfAnDigitalModel?.logsRetraining?.forEach((retrainingInfo) => {
          const timestamp = retrainingInfo?.timestamp * 1000;
          const date = new Date(timestamp);
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
      // console.log(categories);
    }
    return categories;
  }

  const getSeries = (digitalModelsRetrainings) => {
    const series = [];

    if (digitalModelsRetrainings) {
      Object.values(digitalModelsRetrainings).forEach((digitalModelsRetrainingsOfAnDigitalModel) => {
        const seriesItem = {
            name: digitalModelsRetrainingsOfAnDigitalModel?.name,
            type: 'line',
            data: [],
            smooth: true,
            lineStyle: {
              opacity: 0.5
            }
          };
        const dataSeries = [];
        digitalModelsRetrainingsOfAnDigitalModel?.logsRetraining?.forEach((retrainingInfo) => {
          const value = retrainingInfo?.[metric];
          const timestamp = retrainingInfo?.timestamp * 1000;
          const date = new Date(timestamp);
          const datestring = date.toLocaleString();
          dataSeries.push({
            name: datestring,
            value: [date.toISOString(), value],
            retrainingInfo: retrainingInfo
          })
        })
        seriesItem["data"] = dataSeries;
        series.push(seriesItem);
      })
    }
    console.log(series);
    return series;
  }

  const getOption = (digitalModelsRetrainings) => {
    const option = {
      textStyle: {
        color: themeObject[theme].textMain
      },
      title: {
        text: 'Timeline Retraining - ' + metric,
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
        data: getListNamesModels(digitalModelsRetrainings),
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
        // data: getCategories(digitalModelsRetrainings),
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
      series: getSeries(digitalModelsRetrainings)
    };
    return option;
  }

  return (
    <>
      <BaseChart option={option} height={"30vh"} onEvents={{
        click: handleDataClickSeries
      }}/>
      <Modal open={isModalOpen} centered width={2000} onOk={handleOk} onCancel={handleCancel}>
        <DigitalModelPreview info={retrainingSelected}/>
      </Modal>
    </>
  )

}