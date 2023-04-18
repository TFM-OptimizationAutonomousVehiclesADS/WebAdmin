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


export const DigitalModelPreview: React.FC = ({ info }) => {
  const { t } = useTranslation();

  return (
    <>
      <Row gutter={[10, 10]}>
        <Col span={24}>
          <Card title={t("dm.neuronalNetworkModel")} style={{height: "100%"}} bodyStyle={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            <Image src={"data:image/png;base64," + info?.model_image_base64} style={{maxHeight: "30vh"}}/>
          </Card>
        </Col>
        <Col span={24}>
          <Card title={t("dm.metrics")} style={{height: "100%"}}>
            <Row gutter={[10, 10]}>
              <Col span={8}>
                <Row gutter={[10, 10]}>
                  <Col span={12}>
                    <Card type={"inside"}>
                      <b>{t("dm.accuracy")}: </b> {getMetricTag(getAccuracy(info?.tp, info?.tn, info?.fp, info?.fn))}
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card type={"inside"}>
                      <b>{t("dm.precision")}: </b> {getMetricTag(getPrecision(info?.tp, info?.tn, info?.fp, info?.fn))}
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card type={"inside"}>
                      <b>{t("dm.recall")}: </b> {getMetricTag(getRecall(info?.tp, info?.tn, info?.fp, info?.fn))}
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card type={"inside"}>
                      <b>{t("dm.f1-score")}: </b> {getMetricTag(getF1Score(info?.tp, info?.tn, info?.fp, info?.fn))}
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card type={"inside"}>
                      <b>{t("dm.loss")}: </b> {info?.loss.toFixed(6)}
                    </Card>
                  </Col>
                </Row>
              </Col>
              <Col span={16}>
                <Row gutter={[10, 10]}>
                  <Col span={12}>
                    <RadarMetricsChart evaluationsListData={[{
                      model_name: info?.model_config?.name,
                      ...info
                    }]}/>
                  </Col>
                  <Col span={12}>
                    <ConfusionMatrix tp={info?.tp || 0} tn={info?.tn || 0} fp={info?.fp || 0} fn={info?.fn || 0}/>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24}>
          <Card title={t("dm.retrainingFeatures")} style={{height: "100%"}}>
            <Row gutter={[10, 10]}>
              <Col flex={"auto"}>
                <Card type={"inside"} title={t("dm.testSize")}>
                  {info?.test_size}
                </Card>
              </Col>
              <Col flex={"auto"}>
                <Card type={"inside"} title={t("dm.sizeSplit")}>
                  {info?.size_split}
                </Card>
              </Col>
              <Col flex={"auto"}>
                <Card type={"inside"} title={t("dm.epochs")}>
                  {info?.epochs}
                </Card>
              </Col>
              <Col flex={"auto"}>
                <Card type={"inside"} title={t("dm.bestEpoch")}>
                  <Checkbox
                    checked={Boolean(info?.best_epoch || 0)} />
                </Card>
              </Col>
              <Col flex={"auto"}>
                <Card type={"inside"} title={t("dm.retrainWeights")}>
                  <Checkbox
                    checked={Boolean(info?.retrain_weights || 0)} />
                </Card>
              </Col>
              <Col flex={"auto"}>
                <Card type={"inside"} title={t("dm.randomSamples")}>
                  <Checkbox
                    checked={Boolean(info?.random || 0)} />
                </Card>
              </Col>
              <Col flex={"auto"}>
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
