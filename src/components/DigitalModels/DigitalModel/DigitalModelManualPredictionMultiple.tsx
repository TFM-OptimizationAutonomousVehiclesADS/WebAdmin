import React, { useEffect, useState } from "react";
import { Col, Row, Card, Checkbox, Tooltip, Button, Form, Select } from "antd";
import { useTranslation } from "react-i18next";
import { DropzoneImage } from "@app/components/Dropzone";
import { NumericInput } from "@app/components/DigitalModels/List/NumericInput";
import { notificationController } from "@app/controllers/notificationController";
import { newDigitalModelApi, predictSampleDigitalModelApi } from "@app/api/digitalModels/digitalModels.api";


export const DigitalModelManualPredictionMultiple: React.FC = ({ idDigitalModel }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [resizedImage, setResizedImage] = useState(null);
  const [objectImage, setObjectImage] = useState(null);
  const [surfaceImage, setSurfaceImage] = useState(null);
  const [speed, setSpeed] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [camera, setCamera] = useState<string>("CAM_FRONT");
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

    predictSampleDigitalModelApi(formData)
      .then((response) => {
        if (response.data) {
          notificationController.success({ message: t("dm.successData") });
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
