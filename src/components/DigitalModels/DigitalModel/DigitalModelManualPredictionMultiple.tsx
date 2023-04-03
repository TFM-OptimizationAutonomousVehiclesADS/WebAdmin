import React, { useEffect, useState } from "react";
import { Col, Row, Card, Checkbox, Tooltip, Button, Form, Select } from "antd";
import { useTranslation } from "react-i18next";
import { DropzoneImage } from "@app/components/Dropzone/DropzoneImage";
import { NumericInput } from "@app/components/DigitalModels/List/NumericInput";
import { notificationController } from "@app/controllers/notificationController";
import {
  predictSampleDigitalModelMultipleApi,
  predictSampleDigitalModelSingleApi
} from "@app/api/digitalModels/digitalModels.api";
import { DropzoneCSV } from "@app/components/Dropzone/DropzoneCSV";


export const DigitalModelManualPredictionMultiple: React.FC = ({ idDigitalModel }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState(null);
  const { t } = useTranslation();

  const predictSample = () => {
    const formData = new FormData();
    setLoading(true);
    if (!file) {
      notificationController.error({ message: t("common.requiredField") });
      return;
    }
    formData.append("fileCSV", file);

    predictSampleDigitalModelMultipleApi(idDigitalModel, formData)
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
          <Card>
            <DropzoneCSV file={file} setFile={setFile}/>
          </Card>
        </Col>
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
