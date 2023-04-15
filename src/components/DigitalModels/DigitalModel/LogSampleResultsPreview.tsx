import React, { useEffect, useState } from "react";
import { Col, Row, Card, Image } from "antd";
import { useTranslation } from "react-i18next";
import {
  getColorDirectionBySpeed,
  getIconDirectionByFeatures, getPredictionTagFlexBlock
} from "@app/utils/utilsDigitalModels";
import Icon from '@ant-design/icons';


export const LogSampleResultsPreview: React.FC = ({ logSampleInfo, thresholdAnomaly }) => {
  const { t } = useTranslation();

  return (
    <>
      <Row gutter={[10, 10]}>
        <Col span={24}>
          <Card title={t("dm.features")} style={{height: "100%"}}>
            <Row gutter={[10, 10]}>
                  <Col span={8}>
                    <Card type={"inside"}>
                      <b>{t("dm.camera")}: </b> {logSampleInfo?.channel_camera}<br/>
                    </Card>
                  </Col>
              <Col span={8}>
                    <Card type={"inside"}>
                      <b>{t("dm.rotation")}: </b> {parseFloat(logSampleInfo?.rotation_rate_z || 0).toFixed(2)}<br/>
                    </Card>
              </Col>
              <Col span={8}>
                      <Card type={"inside"}>
                      <b>{t("dm.speed")}: </b> {parseFloat(logSampleInfo?.speed || 0).toFixed(2)}
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card type={"inside"} style={{height: "100%"}} bodyStyle={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
                        <Icon style={{fontSize: "5vh", color: getColorDirectionBySpeed(logSampleInfo?.speed)}}
                              component={getIconDirectionByFeatures(logSampleInfo?.channel_camera, logSampleInfo?.rotation_rate_z)}/>
                    </Card>
                  </Col>
              <Col span={8}>
                <Card type={"inside"} title={t("dm.resizedImage")}>
                  <Image width={"100%"} src={"data:image/png;base64," + logSampleInfo?.image_resized_base64}/>
                </Card>
              </Col>
              <Col span={8}>
                <Card type={"inside"} title={t("dm.objectImage")}>
                  <Image width={"100%"} src={"data:image/png;base64," + logSampleInfo?.object_resized_base64}/>
                </Card>
              </Col>
              <Col span={8}>
                <Card type={"inside"} title={t("dm.surfaceImage")}>
                  <Image width={"100%"} src={"data:image/png;base64," + logSampleInfo?.surface_resized_base64}/>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24}>
          <Card title={t("dm.prediction")} style={{height: "100%"}}>
            {getPredictionTagFlexBlock(parseFloat(logSampleInfo?.prediction || 0).toFixed(2), thresholdAnomaly, "5vh")}
          </Card>
        </Col>
      </Row>
    </>

  );
};
