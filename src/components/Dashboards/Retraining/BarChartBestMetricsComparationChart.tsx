import React, { useEffect, useState } from "react";
import { getAllDigitalModelsApi } from "@app/api/digitalModels/digitalModels.api";
import { notificationController } from "@app/controllers/notificationController";
import { useTranslation } from "react-i18next";
import { useMounted } from "@app/hooks/useMounted";
import { RadarMetricsChart } from "@app/components/RadarMetricsChart/RadarMetricsChart";
import { themeObject } from "@app/styles/themes/themeVariables";
import { BaseChart } from "@app/components/common/charts/BaseChart";
import { useAppSelector } from "@app/hooks/reduxHooks";
import { getAccuracy, getF1Score } from "@app/utils/utilsDigitalModels";

export const BarChartBestMetricsComparationChart: React.FC = ({metricObjective, height}) => {
  const [evaluationsListData, setEvaluationsListData] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const {t} = useTranslation();
  const {isMounted} = useMounted();
  const theme = useAppSelector((state) => state.theme.theme);

  const retrieveData = () => {
    getAllDigitalModelsApi()
      .then((response) => {
        if (response.data?.digital_models) {
          getEvaluationsListData(response.data?.digital_models);
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

  const getEvaluationsListData = (digitalModels) => {
    const evaluationsListData = [];
    if (digitalModels) {
      digitalModels.forEach((digitalModelInfo) => {
        if (digitalModelInfo?.mongo) {
          const evaluationDict = digitalModelInfo?.mongo.evaluation_dict;
          const nameModel = digitalModelInfo?.name;
          if (evaluationDict && nameModel) {
            evaluationsListData.push({
              model_name: nameModel,
              ...evaluationDict
            })
          }
        }
      })
    }
    setEvaluationsListData(evaluationsListData)
    return evaluationsListData;
  }

  const sortDataDescending = (data) => {
    return data.sort((a, b) => b.value - a.value);
  }

  const getTopN = (data, n) => {
    return sortDataDescending(data).slice(0, n);
  }

  const getDataSeries = () => {
    const seriesData = [];
    if (evaluationsListData) {
      evaluationsListData.forEach((evaluationData) => {
        const nameModel = evaluationData["model_name"];
        const tp = evaluationData["tp"];
        const tn = evaluationData["tn"];
        const fp = evaluationData["fp"];
        const fn = evaluationData["fn"];
        let value = 0.0;
        if (metricObjective == "f1_score") {
          value = parseFloat(getF1Score(tp, tn, fp, fn).toFixed(4))
        } else if (metricObjective == "accuracy") {
          value = parseFloat(getAccuracy(tp, tn, fp, fn).toFixed(4))
        } else {
          value = parseFloat(evaluationData[metricObjective]).toFixed(4);
        }
        let item = {
            value: value,
            name: nameModel
        };
        seriesData.push(item);
      })
    }
    return seriesData;
  }

  const getDataOption = () => {
    const colors = ['#0652DD', '#8F33CC', '#ffdd59', '#24ce99', '#FF5A09', '#aF2A0f'];

    const option = {
      textStyle: {
        color: themeObject[theme].textMain
      },
      title: {
        text: 'Ranking digital model by - ' + metricObjective,
        left: 0,
        textStyle: {
          color: themeObject[theme].textMain
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
      },
      xAxis: {
        type: 'value',
        // show: false,
        max: 1
      },
      yAxis: {
        type: 'category',
        data: getTopN(getDataSeries(), 3).map(item => item.name),
        axisTick: {
          show: false
        },
        max: 2, // only the largest 3 bars will be displayed
        inverse: true,
      },
      colorBy: "data",
      series: [{
        type: 'bar',
        data: getTopN(getDataSeries(), 3),
        // barWidth: 16,
        label: {
          show: true,
          position: 'right',
          formatter: '{c}',
          color: '#333',
          textStyle: {
            color: themeObject[theme].textMain
          },
        },
        emphasis: {
          itemStyle: {
            color: '#FFA500'
          }
        }
      }]
    };
    return option;
  }

  return <BaseChart option={getDataOption()} height={height}/>

}