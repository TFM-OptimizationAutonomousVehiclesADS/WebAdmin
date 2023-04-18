import React from 'react';
import { useTranslation } from "react-i18next";
import { BaseChart } from "@app/components/common/charts/BaseChart";
import { themeObject } from '@app/styles/themes/themeVariables';
import { useAppSelector } from "@app/hooks/reduxHooks";
import { getAccuracy, getF1Score, getPrecision, getRecall } from "@app/utils/utilsDigitalModels";


export const RadarMetricsChart: React.FC = ({evaluationsListData, height = "20vh"}) => {
  const {t} = useTranslation();
  const theme = useAppSelector((state) => state.theme.theme);

  const getDataSeries = () => {
    const series = [];
    if (evaluationsListData) {
      evaluationsListData.forEach((evaluationData) => {
        const nameModel = evaluationData["model_name"];
        // const f1Score = parseFloat(evaluationData["f1_score"]).toFixed(4);
        // const accuracy = parseFloat(evaluationData["accuracy"]).toFixed(4);
        // const precision = parseFloat(evaluationData["precision"]).toFixed(4);
        // const recall = parseFloat(evaluationData["recall"]).toFixed(4);
        const tp = evaluationData["tp"]
        const fp = evaluationData["fp"]
        const tn = evaluationData["tn"]
        const fn = evaluationData["fn"]
        const f1Score = parseFloat(getF1Score(tp, tn, fp, fn).toFixed(4));
        const accuracy = parseFloat(getAccuracy(tp, tn, fp, fn).toFixed(4));
        const precision = parseFloat(getPrecision(tp, tn, fp, fn).toFixed(4));
        const recall = parseFloat(getRecall(tp, tn, fp, fn).toFixed(4));
        let item = {
          type: 'radar',
          areaStyle: {
            opacity: 0.4,
          },
          emphasis: {
            areaStyle: {
              opacity: 0.8,
              shadowBlur: 10,
            },
          },
          label: {
            show: false,
            position: "inside",
            fontSize: 16
          },
          lineStyle: {
            shadowBlur: 20,
            opacity: 0.8,
          },
          data: [{
            value: [accuracy, precision, recall, f1Score],
            name: nameModel
          }]
        };
        series.push(item);
      })
    }
    return series;
  }

  const getDataOption = () => {
    const colors = ['#0652DD', '#8F33CC', '#ffdd59', '#24ce99', '#FF5A09', '#aF2A0f'];
    const option = {
      tooltip: {},
      legend: {
        borderRadius: 5,
        left: 0,
        textStyle: {
          color: themeObject[theme].textMain,
        },
        inactiveColor: "#485460",
        itemWidth: 25,
        itemHeight: 25,
        tooltip: {
          show: true
        },
        // data: getScoreNamesIconsDataList(),
      },
      radar: {
        radius: "50%",
        nameGap: 5,
        name: {
          textStyle: {
            color: themeObject[theme].textMain,
            backgroundColor: 'transparent',
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        textStyle: {
          fontSize: 16
        },
        indicator: [
          { name: t("accuracy"), min: 0, max: 1 },
          { name: t("precision"), min: 0, max: 1 },
          { name: t("recall"), min: 0, max: 1 },
          { name: t("f1-score"), min: 0, max: 1 },
        ]
      },
      color: colors,
      series: getDataSeries()
    };
    return option;
  }

  return <BaseChart option={getDataOption()} height={height}/>
}