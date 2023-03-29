import React, { useEffect, useState } from "react";
import { Col, Row, Card, Checkbox, Tooltip, Button, Form, Select, Tabs, TabsProps } from "antd";
import { useTranslation } from "react-i18next";
import { DropzoneImage } from "@app/components/Dropzone/DropzoneImage";
import { NumericInput } from "@app/components/DigitalModels/List/NumericInput";
import { notificationController } from "@app/controllers/notificationController";
import { newDigitalModelApi, predictSampleDigitalModelApi } from "@app/api/digitalModels/digitalModels.api";
import { DigitalModelInfo } from "@app/components/DigitalModels/DigitalModel/DigitalModelInfo";
import { DigitalModelActualModel } from "@app/components/DigitalModels/DigitalModel/DigitalModelActualModel";
import {
  DigitalModelManualPredictionSingle
} from "@app/components/DigitalModels/DigitalModel/DigitalModelManualPredictionSingle";
import {
  DigitalModelManualPredictionMultiple
} from "@app/components/DigitalModels/DigitalModel/DigitalModelManualPredictionMultiple";


export const DigitalModelManualPredictionTabs: React.FC = ({ idDigitalModel }) => {
  const { t } = useTranslation();

  const items: TabsProps["items"] = [
    {
      key: "single",
      label: t("dm.single"),
      children: <DigitalModelManualPredictionSingle idDigitalModel={idDigitalModel} />
    },
    {
      key: "multiple",
      label: t("dm.multiple"),
      children: <DigitalModelManualPredictionMultiple idDigitalModel={idDigitalModel} />
    }
  ];

  return (
    <>
      <Tabs defaultActiveKey="single" items={items} />
    </>

  );
};
