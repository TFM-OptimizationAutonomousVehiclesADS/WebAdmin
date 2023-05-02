import React, { useEffect, useState } from "react";
import { List, Col, Row, Card, Checkbox, Tooltip, Button, Image } from "antd";
import { useTranslation } from "react-i18next";
import {
  deleteDigitalModelApi,
  getAllDigitalModelsApi, getDigitalModelActualModelByIdApi,
  getDigitalModelByIdApi,
  startDigitalModelApi, stopDigitalModelApi
} from "@app/api/digitalModels/digitalModels.api";
import { notificationController } from "@app/controllers/notificationController";
import {
  getAccuracy, getF1Score,
  getIpComponent,
  getMetricTag,
  getParamDataByName, getPrecision, getRecall,
  getStatusComponent
} from "@app/utils/utilsDigitalModels";
import { getLocaleStringDateTime } from "@app/utils/utils";
import { DigitalModelTabs } from "@app/components/DigitalModels/DigitalModel/DigitalModelTabs";
import { useParams } from "react-router-dom";
import { CaretRightFilled, DeleteFilled, StopFilled } from "@ant-design/icons";
import { RadarMetricsChart } from "@app/components/RadarMetricsChart/RadarMetricsChart";
import { ConfusionMatrix } from "@app/components/ConfusionMatrix/ConfusionMatrix";
import { DigitalModelPreview } from "@app/components/DigitalModels/DigitalModel/DigitalModelPreview";
import {
  getRealSystemActualModelApi,
  getRealSystemAllFederativeAlertsApi
} from "@app/api/realSystem/realSystemService";
import { Loading } from "@app/components/common/Loading";


export const RealSystemLastFederativeListDashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [lastAlerts, setLastAlerts] = useState([]);
  const { t } = useTranslation();

  const retrieveData = () => {
    getRealSystemAllFederativeAlertsApi()
      .then((response) => {
        if (response.data?.alerts) {
          setLastAlerts(response.data?.alerts);
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
  }, []);

  if (loading) {
    return <Loading />
  } else {
    return (
      <List
        bordered
        dataSource={lastAlerts || []}
        header={<h3><b>Últimas actualizaciones</b></h3>}
        rowKey={"timestamp"}
        pagination={{defaultPageSize: 5}}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item["message"]}
              description={getLocaleStringDateTime(item["timestamp"])}
            />
          </List.Item>
        )}
      />
    );
  }
};
