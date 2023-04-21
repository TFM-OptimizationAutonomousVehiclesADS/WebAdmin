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

export const CombinationNewDigitalModelButton: React.FC = ({digitalModels}) => {
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

    const combineDigitalModelsClick = () => {
        notificationController.info({message: t("dm.creating")});
        handleCancel();
    }

    return (
        <>
            <Button style={{background: "darkblue"}} block onClick={showModal}>{t("dm.combineDigitalModels")}</Button>
            <Modal centered width={1000}
                   title={t("dm.combineDigitalModels")} open={isModalOpen} onOk={combineDigitalModelsClick} onCancel={handleCancel}>

            </Modal>
        </>

    );
};
