import React, { useEffect, useState } from "react";
import {
  getAllDigitalModelsApi, getLogsAnomaliesByIdDigitalModelApiAndRange,
  getLogsRetrainingEvaluationByIdDigitalModelApiAndRange, getLogsSamplesByIdDigitalModelApiAndRange
} from "@app/api/digitalModels/digitalModels.api";
import { notificationController } from "@app/controllers/notificationController";
import { useTranslation } from "react-i18next";
import { useMounted } from "@app/hooks/useMounted";
import { RadarMetricsChart } from "@app/components/RadarMetricsChart/RadarMetricsChart";
import { themeObject } from "@app/styles/themes/themeVariables";
import { BaseChart } from "@app/components/common/charts/BaseChart";
import { useAppSelector } from "@app/hooks/reduxHooks";
import { getAccuracy, getF1Score } from "@app/utils/utilsDigitalModels";

export const PieChartTotalPredictionsComparation: React.FC = ({height, rangeDatetime}) => {
  const [digitalModels, setDigitalModes] = useState([]);
  const [totalSamplesListData, setTotalSamplesListData] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const {t} = useTranslation();
  const {isMounted} = useMounted();
  const theme = useAppSelector((state) => state.theme.theme);

  useEffect(() => {
    retrieveData();
  }, []);

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
    if (digitalModels) {
      retrieveAllDataLogsSamples();
    }
  }, [digitalModels, rangeDatetime]);


  const retrieveAllDataLogsSamples = async () => {
    const dictDigitalModelsLogsSamples = {};
    const promises = digitalModels.map(async (digital_model) => {
      // dictDigitalModelsLogsSamples[digital_model.id] = {};
      const logsSamples = await retrieveDataLogsSamples(digital_model.id);
      if (logsSamples) {
        dictDigitalModelsLogsSamples[digital_model.id] = {total: logsSamples?.length || 0, name: digital_model?.name};
      }
    });
    await Promise.all(promises);
    setTotalSamplesListData(Object.values(dictDigitalModelsLogsSamples));
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

  const getDataSeries = () => {
    const seriesData = [];
    if (totalSamplesListData) {
      totalSamplesListData.forEach((totalData) => {
        let item = {
            value: totalData.total,
            name: totalData.name
        };
        seriesData.push(item);
      })
    }
    return seriesData;
  }

  const getDataOption = () => {
    const colors = ['#6084c5', '#a970cc', '#c9b566', '#64d5b2', '#FF5A09', '#aF2A0f'];
    const option = {
      color: colors,
      textStyle: {
        color: themeObject[theme].textMain
      },
      title: {
        text: 'Total predicciones por modelo digital',
        left: 0,
        textStyle: {
          color: themeObject[theme].textMain
        }
      },
      legend: {
        top: '10%',
        left: 'center',
        // doesn't perfectly work with our tricks, disable it
        selectedMode: false,
        textStyle: {
          color: themeObject[theme].textMain
        },
      },
      tooltip: {
        trigger: 'item'
      },
      series: [{
        name: 'Total Predictions',
        type: 'pie',
        data: [...getDataSeries(), {
          value: getDataSeries().reduce((total, item) => total + Number(item.value), 0),
          itemStyle: {
            // stop the chart from rendering this piece
            color: 'none',
            decal: {
              symbol: 'none'
            }
          },
          label: {
            show: false
          }
        }],
        radius: ['40%', '70%'],
        center: ['50%', '70%'],
        startAngle: 180,
        label: {
          show: true,
          formatter(param) {
            // correct the percentage
            return param.name + ' (' + param.value + ') (' + param.percent * 2 + '%)';
          },
          textStyle: {
            color: themeObject[theme].textMain
          },
        }
      }]
    };
    return option;
  }

  return <BaseChart option={getDataOption()} height={height}/>

}