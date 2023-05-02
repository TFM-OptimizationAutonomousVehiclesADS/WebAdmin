import React, { useEffect, useState } from "react";
import { Col, Row, Card, Checkbox, Tooltip, Button, Form, Select } from "antd";
import { useTranslation } from "react-i18next";
import { DropzoneImage } from "@app/components/Dropzone/DropzoneImage";
import { NumericInput } from "@app/components/DigitalModels/List/NumericInput";
import { notificationController } from "@app/controllers/notificationController";
import {
  predictSampleDigitalModelMultipleApi,
  predictSampleDigitalModelSingleApi, predictSampleRealSystemMultipleApi
} from "@app/api/digitalModels/digitalModels.api";
import { DropzoneCSV } from "@app/components/Dropzone/DropzoneCSV";
import { RadarMetricsChart } from "@app/components/RadarMetricsChart/RadarMetricsChart";
import { ConfusionMatrix } from "@app/components/ConfusionMatrix/ConfusionMatrix";
import { getAccuracy, getF1Score, getPrecision, getRecall } from "@app/utils/utilsDigitalModels";


export const RealSystemManualPredictionMultiple: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [evaluationDict, setEvaluationDict] = useState(null);
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
    setEvaluationDict(null);
    predictSampleRealSystemMultipleApi(formData)
      .then((response) => {
        if (response.data) {
          if (response.data?.evaluation_dict?.evaluation_dict) {
            setEvaluationDict(response.data?.evaluation_dict?.evaluation_dict);
          }
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
        {evaluationDict && (
          <Col span={24}>
            <Card title={t("dm.prediction")}>
              <Row gutter={[10, 10]}>
                <Col span={12}>
                  <RadarMetricsChart evaluationsListData={[{
                    ...evaluationDict,
                    model_name: "model",
                    // accuracy: getAccuracy(evaluationDict.tp, evaluationDict.tn, evaluationDict.fp, evaluationDict.fn),
                    // precision: getPrecision(evaluationDict.tp, evaluationDict.tn, evaluationDict.fp, evaluationDict.fn),
                    // recall: getRecall(evaluationDict.tp, evaluationDict.tn, evaluationDict.fp, evaluationDict.fn),
                    // f1_score: getF1Score(evaluationDict.tp, evaluationDict.tn, evaluationDict.fp, evaluationDict.fn),
                  }]}/>
                </Col>
                <Col span={12}>
                  <ConfusionMatrix tp={evaluationDict?.tp || 0} tn={evaluationDict?.tn || 0} fp={evaluationDict?.fp || 0} fn={evaluationDict?.fn || 0}/>
                </Col>
              </Row>
            </Card>
          </Col>
        )}
      </Row>
    </>

  );
};
