import React, {useEffect, useState, useCallback} from 'react';
import {Button, Divider, List, Modal, Steps, message, Form, Input, Row, Col, Select, Checkbox} from 'antd';
import {notificationController} from 'controllers/notificationController';
import {
    newCombinatedDigitalModelApi,
    newDigitalModelApi, shareDataBetweenDigitalModelsApi
} from "@app/api/digitalModels/digitalModels.api";
import {useTranslation} from "react-i18next";
import {useAppSelector} from "@app/hooks/reduxHooks";
import {themeObject} from '@app/styles/themes/themeVariables';
import {NumericInput} from "@app/components/DigitalModels/List/NumericInput";

export const CombinationNewDigitalModelButton: React.FC = ({digitalModels}) => {
    const user = useAppSelector((state) => state.user.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [resultBy, setResultBy] = useState('mean');
    const [modelVersion, setModelVersion] = useState('MULTIPLE');
    const [containerName, setContainerName] = useState(null);
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
        const idsDigitalModelsSelected = digitalModels?.map((dm) => dm["id"]);
        newCombinatedDigitalModelApi(idsDigitalModelsSelected, modelVersion, resultBy, containerName, user)
          .then((response) => {
              if (response.data) {
                  notificationController.success({message: t("dm.successData")});
              } else {
                  notificationController.error({message: t("dm.errorData")});
              }
          })
          .catch((error) => {
              notificationController.error({message: t("dm.errorData")});
          })
        setIsModalOpen(false);
    }

    return (
        <>
            <Button style={{background: "darkblue"}} block onClick={showModal}>{t("dm.combineDigitalModels")}</Button>
            <Modal centered width={1000}
                   title={t("dm.combineDigitalModels")} open={isModalOpen} onOk={combineDigitalModelsClick} onCancel={handleCancel}>
                <>
                    {t("dm.combineModelsQuestionModal")}
                    <Divider>Modelos Seleccionados</Divider>
                    <List
                      bordered
                      dataSource={digitalModels || []}
                      renderItem={(item) => (
                        <List.Item>
                            {item.name}
                        </List.Item>
                      )}
                    />
                  <Divider>Tipo de Combinación</Divider>
                  <Row gutter={[10, 10]}>
                    <Col span={24}>
                      <Form.Item label={t("dm.modelDigitalname")} required>
                        <Input value={containerName} onChange={(e) => setContainerName(e.target.value)}
                               placeholder={t("dm.modelDigitalNamePlaceholder")}/>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label={t("dm.typeCombinedModel")} required>
                        <Select
                          value={modelVersion}
                          onChange={setModelVersion}
                          options={[
                            {value: 'MULTIPLE', label: t('dm.multiple')},
                            {value: 'COMBINATED', label: t("dm.combinated")}
                          ]}
                        />
                      </Form.Item>
                    </Col>
                    {modelVersion === "MULTIPLE" &&
                    <Col span={12}>
                      <Form.Item label={t("dm.resultBy")} required>
                        <Select
                          value={resultBy}
                          onChange={setResultBy}
                          options={[
                            {value: 'mean', label: t('mean')},
                            {value: 'max', label: t("max")},
                            {value: 'min', label: t("min")},
                          ]}
                        />
                      </Form.Item>
                    </Col>}
                  </Row>
                </>
            </Modal>
        </>

    );
};
