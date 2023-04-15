import React, { useEffect, useState } from "react";
import { Col, Row, Card, Checkbox, Tooltip, Button, Form, Select, Tag } from "antd";
import { useTranslation } from "react-i18next";
import { DropzoneImage } from "@app/components/Dropzone/DropzoneImage";
import { NumericInput } from "@app/components/DigitalModels/List/NumericInput";
import { notificationController } from "@app/controllers/notificationController";
import {
  predictSampleDigitalModelSingleApi
} from "@app/api/digitalModels/digitalModels.api";
import { getColorDirectionBySpeed, getIconDirectionByFeatures, getPredictionTag } from "@app/utils/utilsDigitalModels";
import Icon, {UpCircleOutlined, DownCircleOutlined} from "@ant-design/icons";


export const DigitalModelManualPredictionSingle: React.FC = ({ idDigitalModel, thresholdAnomaly }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [resizedImage, setResizedImage] = useState(null);
  const [objectImage, setObjectImage] = useState(null);
  const [surfaceImage, setSurfaceImage] = useState(null);
  const [speed, setSpeed] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [camera, setCamera] = useState<string>("CAM_FRONT");
  const [prediction, setPrediction] = useState<number>(null);
  const { t } = useTranslation();

  const predictSample = () => {
    const formData = new FormData();
    setLoading(true);
    if (!resizedImage || !objectImage || !surfaceImage) {
      notificationController.error({ message: t("common.requiredField") });
      return;
    }
    formData.append("resizedImage", resizedImage);
    formData.append("objectImage", objectImage);
    formData.append("surfaceImage", surfaceImage);
    formData.append("speed", speed);
    formData.append("rotation_rate_z", rotation);
    formData.append("channel_camera", camera);

    predictSampleDigitalModelSingleApi(idDigitalModel, formData)
      .then((response) => {
        if (response.data) {
          notificationController.success({ message: t("dm.successData") });
          if (response.data?.sample) {
            setPrediction(response.data.sample["prediction"])
          }
        } else {
          notificationController.error({ message: t("dm.errorData") });
        }
      })
      .catch((error) => {
        notificationController.error({ message: t("dm.errorData") });
      })
      .finally(() => {
        setLoading(false);
      })
  };

  return (
    <>
      <Row gutter={[10, 10]}>
        <Col span={8}>
          <Card title={t("dm.speed")}>
            <Form.Item label={t("dm.speed")} required>
              <NumericInput value={speed} onChange={setSpeed} />
            </Form.Item>
          </Card>
        </Col>
        <Col span={8}>
          <Card title={t("dm.rotation")}>
            <Form.Item label={t("dm.rotation")} required>
              <NumericInput value={rotation} onChange={setRotation} />
            </Form.Item>
          </Card>
        </Col>
        <Col span={8}>
          <Card title={t("dm.camera")}>
            <Form.Item label={t("dm.camera")} required>
              <Select
                value={camera}
                onChange={setCamera}
                options={[
                  { value: "CAM_FRONT", label: "CAM_FRONT" },
                  { value: "CAM_BACK", label: "CAM_BACK" }
                ]}
              />
            </Form.Item>
          </Card>
        </Col>
        <Col span={24}>
          <Card type={"inside"} style={{height: "100%"}} bodyStyle={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
            <Icon style={{fontSize: "5vh", color: getColorDirectionBySpeed(speed)}}
                  component={getIconDirectionByFeatures(camera, rotation)}/>
          </Card>
        </Col>
        <Col span={8}>
          <Card title={t("dm.resizeImage")}>
            <DropzoneImage image={resizedImage} setImage={setResizedImage} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title={t("dm.objectImage")}>
            <DropzoneImage image={objectImage} setImage={setObjectImage} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title={t("dm.surfaceImage")}>
            <DropzoneImage image={surfaceImage} setImage={setSurfaceImage} />
          </Card>
        </Col>
        {prediction !== null &&
        <Col span={24}>
          <Card title={t("dm.prediction")}>
            <Form.Item label={t("dm.prediction")} required>
              <span>{getPredictionTag(parseFloat(prediction).toFixed(2), thresholdAnomaly)}</span>
              <Button ghost><Tag color={"green"}><UpCircleOutlined />  {t("dm.good")}?</Tag></Button>
              <Button ghost><Tag color={"red"}><DownCircleOutlined />  {t("dm.bad")}?</Tag></Button>
            </Form.Item>
          </Card>
        </Col>}
        <Col span={24}>
          {/*<Card>*/}
          <Button loading={loading} block type={"primary"} onClick={predictSample}>
            {t("dm.predict")}
          </Button>
          {/*</Card>*/}
        </Col>
      </Row>
    </>

  );
};
