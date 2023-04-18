import React, { useEffect, useState } from "react";
import { getAllDigitalModelsApi } from "@app/api/digitalModels/digitalModels.api";
import { notificationController } from "@app/controllers/notificationController";
import { useTranslation } from "react-i18next";
import { useMounted } from "@app/hooks/useMounted";
import { RadarMetricsChart } from "@app/components/RadarMetricsChart/RadarMetricsChart";

export const RadarMetricsComparationChart: React.FC = ({height}) => {
  const [digitalModels, setDigitalModes] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const {t} = useTranslation();
  const {isMounted} = useMounted();

  const retrieveData = () => {
    getAllDigitalModelsApi()
      .then((response) => {
        if (response.data?.digital_models) {
          setDigitalModes(response.data?.digital_models);
        } else {
          notificationController.error({message: t("dm.errorData")});
        }
      })
      .catch((error) => {
        notificationController.error({message: t("dm.errorData")});
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    retrieveData();
  }, []);

  const getEvaluationsListData = () => {
    const evaluationsListData = [];
    if (digitalModels) {
      digitalModels.forEach((digitalModelInfo) => {
        if (digitalModelInfo?.mongo) {
          const evaluationDict = digitalModelInfo?.mongo.evaluation_dict;
          const nameModel = digitalModelInfo?.name;
          if (evaluationDict && nameModel) {
            evaluationsListData.push({
              model_name: nameModel,
              ...evaluationDict
            })
          }
        }
      })
    }
    return evaluationsListData;
  }

  return (
    <RadarMetricsChart evaluationsListData={getEvaluationsListData()} height={height}/>
  )

}