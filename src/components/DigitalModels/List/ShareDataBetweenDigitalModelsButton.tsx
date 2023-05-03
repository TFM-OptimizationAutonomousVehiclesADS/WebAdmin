import React, {useEffect, useState, useCallback} from 'react';
import { Button, Modal, Steps, message, Form, Input, Row, Col, Select, Checkbox, List } from "antd";
import {notificationController} from 'controllers/notificationController';
import {
  newDigitalModelApi, shareDataBetweenDigitalModelsApi
} from "@app/api/digitalModels/digitalModels.api";
import {useTranslation} from "react-i18next";
import {useAppSelector} from "@app/hooks/reduxHooks";
import {themeObject} from '@app/styles/themes/themeVariables';
import {NumericInput} from "@app/components/DigitalModels/List/NumericInput";

export const ShareDataBetweenDigitalModelsButton: React.FC = ({digitalModels}) => {
    const user = useAppSelector((state) => state.user.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const theme = useAppSelector((state) => state.theme.theme);
    const {t} = useTranslation();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const shareDataBetweenDigitalModelsClick = () => {
        notificationController.info({message: t("dm.creating")});
        const idsDigitalModelsSelected = digitalModels?.map((dm) => dm["id"]);
        shareDataBetweenDigitalModelsApi(idsDigitalModelsSelected)
          .then((response) => {
              if (response.data) {
                  notificationController.success({message: t("dm.successData")});
              } else {
                  notificationController.success({message: t("dm.successData")});
              }
          })
          .catch((error) => {
              notificationController.success({message: t("dm.successData")});
          })
        setIsModalOpen(false);
    }

    return (
        <>
            <Button style={{background: "darkcyan"}} block onClick={showModal}>{t("dm.shareDataDigitalModels")}</Button>
            <Modal centered width={1000}
                   title={t("dm.shareDataDigitalModels")} open={isModalOpen} onOk={shareDataBetweenDigitalModelsClick} onCancel={handleCancel}>
                <>
                    {t("dm.shareDataQuestionModal")}

                    <List
                      bordered
                      dataSource={digitalModels || []}
                      renderItem={(item) => (
                        <List.Item>
                          {item.name}
                        </List.Item>
                      )}
                    />
                </>
            </Modal>
        </>

    );
};
