import React, { useEffect, useState } from "react";
import { Col, Row, Card, Checkbox, Tooltip, Button, Image } from "antd";
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


export const DigitalModelActualModel: React.FC = ({ idDigitalModel }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [info, setInfo] = useState(null);
  const { t } = useTranslation();

  const retrieveData = () => {
    getDigitalModelActualModelByIdApi(idDigitalModel)
      .then((response) => {
        if (response.data?.data?.evaluation_dict) {
          setInfo(response.data?.data?.evaluation_dict);
        } else {
          notificationController.error({ message: t("dm.errorData") });
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

  return (
    <>
      <Row gutter={[10, 10]}>
        <Col span={8}>
          <Card title={t("dm.neuronalNetworkModel")} style={{height: "100%"}}>
            <Image src={"data:image/png;base64," + info?.model_image_base64} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title={t("dm.metrics")} style={{height: "100%"}}>
            <Row gutter={[10, 10]}>
              <Col span={12}>
                <Card type={"inside"}>
                  <b>{t("dm.accuracy")}: </b> {getMetricTag(info?.accuracy)}
                </Card>
              </Col>
              <Col span={12}>
                <Card type={"inside"}>
                  <b>{t("dm.precision")}: </b> {getMetricTag(info?.precision)}
                </Card>
              </Col>
              <Col span={12}>
                <Card type={"inside"}>
                  <b>{t("dm.recall")}: </b> {getMetricTag(info?.recall)}
                </Card>
              </Col>
              <Col span={12}>
                <Card type={"inside"}>
                  <b>{t("dm.f1-score")}: </b> {getMetricTag(info?.f1_score)}
                </Card>
              </Col>
              <Col span={24}>
                <Card type={"inside"}>
                  <b>{t("dm.loss")}: </b> {info?.loss.toFixed(6)}
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card title={t("dm.retrainingFeatures")} style={{height: "100%"}}>
            <Row gutter={[10, 10]}>
              <Col span={4}>
                <Card type={"inside"} title={t("dm.testSize")}>
                  {info?.test_size}
                </Card>
              </Col>
              <Col span={6}>
                <Card type={"inside"} title={t("dm.sizeSplit")}>
                  {info?.size_split}
                </Card>
              </Col>
              <Col span={4}>
                <Card type={"inside"} title={t("dm.epochs")}>
                  {info?.epochs}
                </Card>
              </Col>
              <Col span={6}>
                <Card type={"inside"} title={t("dm.bestEpoch")}>
                  <Checkbox
                    checked={Boolean(info?.best_epoch || 0)} />
                </Card>
              </Col>
              <Col span={6}>
                <Card type={"inside"} title={t("dm.retrainWeights")}>
                  <Checkbox
                    checked={Boolean(info?.retrain_weights || 0)} />
                </Card>
              </Col>
              <Col span={6}>
                <Card type={"inside"} title={t("dm.randomSamples")}>
                  <Checkbox
                    checked={Boolean(info?.random || 0)} />
                </Card>
              </Col>
              <Col span={6}>
                <Card type={"inside"} title={t("dm.tunning")}>
                  <Checkbox
                    checked={Boolean(info?.tunning || 0)} />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>

  );
};
