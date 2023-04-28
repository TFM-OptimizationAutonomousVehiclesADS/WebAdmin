import React, {useEffect, useState, useCallback} from 'react';
import {Button, Modal, Steps, message, Form, Input, Row, Col, Select, Checkbox} from 'antd';
import {notificationController} from 'controllers/notificationController';
import {
    newDigitalModelApi,
} from "@app/api/digitalModels/digitalModels.api";
import {useTranslation} from "react-i18next";
import {useAppSelector} from "@app/hooks/reduxHooks";
import {themeObject} from '@app/styles/themes/themeVariables';
import {NumericInput} from "@app/components/DigitalModels/List/NumericInput";
import { postReplaceModelRealSystem } from "@app/api/realSystem/realSystemService";

export const ReplaceRealSystemModelButton: React.FC = ({digitalModel}) => {
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

    const replaceRealSystemClick = () => {
        notificationController.info({message: t("dm.replacing")});
        postReplaceModelRealSystem(digitalModel["id"])
          .then((response) => {
              if (response.success) {
                  notificationController.success({message: t("dm.successData")});
              } else {
                  notificationController.error({message: t("dm.errorData")});
              }
          })
          .catch((error) => {
              notificationController.error({message: t("dm.errorData")});
          })
        handleCancel();
    }

    return (
        <>
            <Button style={{background: "rebeccapurple"}} block onClick={showModal}>{t("dm.replaceRealSystem")}</Button>
            <Modal centered width={1000}
                   title={t("dm.replaceRealSystem")} open={isModalOpen} onOk={replaceRealSystemClick} onCancel={handleCancel}>

            </Modal>
        </>

    );
};
