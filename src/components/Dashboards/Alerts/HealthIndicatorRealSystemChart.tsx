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
export const HealthIndicatorRealSystemChart: React.FC = ({totalLogsSamples, totalLogsAnomalies, height, loading}) => {
  const {t} = useTranslation();
  const [thresholdAnomalySelected, setThresholdAnomalySelected] = useState(0.5);
  const theme = useAppSelector((state) => state.theme.theme);


  const getOption = (totalLogsSamples, totalLogsAnomalies) => {
    const option = {
      title: {
        text: 'Indicador de Salud',
        left: 0,
        textStyle: {
          color: themeObject[theme].textMain
        }
      },
      textStyle: {
        color: themeObject[theme].textMain
      },
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          center: ['50%', '75%'],
          radius: '90%',
          min: 0,
          max: 1,
          splitNumber: 8,
          axisLine: {
            lineStyle: {
              width: 6,
              color: [
                [0.25, '#7CFFB2'],
                [0.5, '#58D9F9'],
                [0.75, '#FDDD60'],
                [1, '#FF6E76'],
              ]
            }
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '12%',
            width: 20,
            offsetCenter: [0, '-60%'],
            itemStyle: {
              color: 'inherit'
            }
          },
          axisTick: {
            length: 12,
            lineStyle: {
              color: 'white',
              width: 2
            }
          },
          splitLine: {
            length: 20,
            lineStyle: {
              color: 'white',
              width: 5
            }
          },
          axisLabel: {
            color: 'white',
            fontSize: 20,
            distance: -60,
            rotate: 'tangential',
            formatter: function (value) {
              if (value === 0.875) {
                return 'Danger';
              } else if (value === 0.625) {
                return 'Warning';
              } else if (value === 0.375) {
                return 'Info';
              } else if (value === 0.125) {
                return 'Clean';
              }
              return '';
            }
          },
          title: {
            offsetCenter: [0, '-10%'],
            fontSize: 20
          },
          detail: {
            fontSize: 30,
            offsetCenter: [0, '-35%'],
            valueAnimation: true,
            formatter: function (value) {
              return Math.round(value * 100) + '';
            },
            color: 'inherit'
          },
          data: [
            {
              value: totalLogsSamples > 0 ? ((totalLogsAnomalies * 3) / totalLogsSamples) : 0,
            }
          ]
        }
      ]
    };
    return option
  }


  if (loading) {
    return <Loading/>
  } else {
    return (
      <BaseChart option={getOption(totalLogsSamples, totalLogsAnomalies)} height={height} width={"100%"}/>
    )
  }


}