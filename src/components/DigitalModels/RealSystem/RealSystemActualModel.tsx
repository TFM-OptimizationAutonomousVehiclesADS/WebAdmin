import React, { useEffect, useState } from "react";
import { Col, Divider, Row, Card, Checkbox, Tooltip, Button, Image } from "antd";
import { useTranslation } from "react-i18next";
import {
  deleteDigitalModelApi,
  getAllDigitalModelsApi, getDigitalModelActualModelByIdApi,
  getDigitalModelByIdApi,
  startDigitalModelApi, stopDigitalModelApi
} from "@app/api/digitalModels/digitalModels.api";
import { notificationController } from "@app/controllers/notificationController";
import { getIpComponent, getMetricTag, getParamDataByName, getStatusComponent } from "@app/utils/utilsDigitalModels";
import { getLocaleStringDateTime } from "@app/utils/utils";
import { DigitalModelTabs } from "@app/components/DigitalModels/DigitalModel/DigitalModelTabs";
import { useParams } from "react-router-dom";
import { CaretRightFilled, DeleteFilled, StopFilled } from "@ant-design/icons";
import { RadarMetricsChart } from "@app/components/RadarMetricsChart/RadarMetricsChart";
import { ConfusionMatrix } from "@app/components/ConfusionMatrix/ConfusionMatrix";
import { DigitalModelPreview } from "@app/components/DigitalModels/DigitalModel/DigitalModelPreview";
import { getRealSystemActualModelApi } from "@app/api/realSystem/realSystemService";
import { Loading } from "@app/components/common/Loading";
import {
  RealSystemLastFederativeListDashboard
} from "@app/components/Dashboards/Alerts/RealSystemLastFederativeListDashboard";


export const RealSystemActualModel: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [info, setInfo] = useState(null);
  const { t } = useTranslation();

  const retrieveData = () => {
    getRealSystemActualModelApi()
      .then((response) => {
        if (response.data?.data?.evaluation_dict) {
          setInfo(response.data?.data?.evaluation_dict);
        } else {
          console.log(response)
          // notificationController.error({message: t("dm.errorData")});
        }
      })
      .catch((error) => {
        notificationController.error({ message: t("dm.errorData") });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    retrieveData();
    const interval = setInterval(() => {
      retrieveData()
    }, 10000)
    return () => clearInterval(interval)
  }, []);

  if (!info) {
    return <Loading />
  } else {
    return (
      <>
        <DigitalModelPreview info={info} />
        <Divider/>
        <RealSystemLastFederativeListDashboard/>
      </>
    );
  }
};
