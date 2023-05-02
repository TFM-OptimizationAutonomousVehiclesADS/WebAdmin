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

export const NewDigitalModelButton: React.FC = () => {
    const user = useAppSelector((state) => state.user.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const theme = useAppSelector((state) => state.theme.theme);
    const {t} = useTranslation();

    const [containerName, setContainerName] = useState(null);
    const [sizeImageWidth, setSizeImageWidth] = useState(160);
    const [sizeImageHeight, setSizeImageHeight] = useState(90);
    const [thresholdAnomaly, setThresholdAnomaly] = useState(0.5);
    const [objectiveMetric, setObjectiveMetric] = useState('f1_score');
    const [testSize, setTestSize] = useState(0.25);
    const [minSplit, setMinSplit] = useState(2000);
    const [maxSplit, setMaxSplit] = useState(5000);
    const [minEpochs, setMinEpochs] = useState(10);
    const [maxEpochs, setMaxEpochs] = useState(100);
    const [bestEpoch, setBestEpoch] = useState(false);
    const [retrainWeights, setRetrainWeights] = useState(true);
    const [randomSamples, setRandomSamples] = useState(true);
    const [tunning, setTunning] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const newDigitalModel = () => {
        let formData = new FormData();    //formdata object
        formData.append('container_name', containerName);
        formData.append('DIGITAL_MODEL_USERNAME_OWNER', user);
        formData.append('DIGITAL_MODEL_RETRAINING_TEST_SIZE', testSize);
        formData.append('DIGITAL_MODEL_RETRAINING_TUNNING', tunning);
        formData.append('DIGITAL_MODEL_RETRAINING_MIN_SPLIT', minSplit);
        formData.append('DIGITAL_MODEL_RETRAINING_MAX_SPLIT', maxSplit);
        formData.append('DIGITAL_MODEL_RETRAINING_MIN_EPOCHS', minEpochs);
        formData.append('DIGITAL_MODEL_RETRAINING_MAX_EPOCHS', maxEpochs);
        formData.append('DIGITAL_MODEL_RETRAINING_BEST_EPOCH', bestEpoch);
        formData.append('DIGITAL_MODEL_RETRAINING_RETRAIN_WEIGHTS', retrainWeights);
        formData.append('DIGITAL_MODEL_RETRAINING_RANDOM_SAMPLES', randomSamples);
        formData.append('DIGITAL_MODEL_SIZE_IMAGES_WIDTH', sizeImageWidth);
        formData.append('DIGITAL_MODEL_SIZE_IMAGES_HEIGHT', sizeImageHeight);
        formData.append('DIGITAL_MODEL_THRESHOLD_ANOMALY', thresholdAnomaly);
        formData.append('DIGITAL_MODEL_SIZE_IMAGES_METRIC_OBJECTIVE', objectiveMetric)

        notificationController.info({message: t("dm.creating")});
        newDigitalModelApi(formData)
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

    const steps = [
            {
                key: 'name',
                title: t("dm.modelDigitalName"),
                content: <Form
                    layout="vertical"
                >
                    <Form.Item label={t("dm.modelDigitalname")} required>
                        <Input value={containerName} onChange={(e) => setContainerName(e.target.value)}
                               placeholder={t("dm.modelDigitalNamePlaceholder")}/>
                    </Form.Item>
                </Form>,
            },
            {
                key: "features",
                title: t("dm.features"),
                content: <><Form
                    layout="vertical"
                >
                    <Row gutter={[10, 10]}>
                        <Col span={12}>
                            <Form.Item label={t("dm.sizeImageHeight")} required>
                                <NumericInput value={sizeImageHeight} onChange={setSizeImageHeight}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={t("dm.sizeImageWidth")} required>
                                <NumericInput value={sizeImageWidth} onChange={setSizeImageWidth}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label={t("dm.thresholdAnomaly")} required>
                        <NumericInput value={thresholdAnomaly} onChange={setThresholdAnomaly}/>
                    </Form.Item>
                    <Form.Item label={t("dm.objectiveMetric")} required>
                        <Select
                            value={objectiveMetric}
                            onChange={setObjectiveMetric}
                            options={[
                                {value: 'f1_score', label: t('dm.f1-score')},
                                {value: 'accuracy', label: t("dm.accuracy")},
                                {value: 'precision', label: t("dm.precision")},
                                {value: 'recall', label: t("dm.recall")},
                            ]}
                        />
                    </Form.Item>
                </Form></>,
            },
            {
                key: 'retrainingParams',
                title: t("dm.retrainingParams"),
                content: <Form
                    layout="vertical"
                >
                    <Form.Item label={t("dm.testSize")} required>
                        <NumericInput value={testSize} onChange={setTestSize}/>
                    </Form.Item>
                    <Row gutter={[10, 10]}>
                        <Col span={12}>
                            <Form.Item label={t("dm.minSplit")} required>
                                <NumericInput value={minSplit} onChange={setMinSplit}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={t("dm.maxSplit")} required>
                                <NumericInput value={maxSplit} onChange={setMaxSplit}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[10, 10]}>
                        <Col span={12}>
                            <Form.Item label={t("dm.minEpochs")} required>
                                <NumericInput value={minEpochs} onChange={setMinEpochs}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={t("dm.maxEpochs")} required>
                                <NumericInput value={maxEpochs} onChange={setMaxEpochs}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[10, 10]} wrap={"false"}>
                        <Col flex={"auto"}>
                            <Form.Item label={t("dm.bestEpoch")} required>
                                <Checkbox checked={bestEpoch}
                                          onChange={(e) => setBestEpoch(e.target.checked)}>{t("dm.bestEpoch")}</Checkbox>
                            </Form.Item>
                        </Col>
                        <Col flex={"auto"}>
                            <Form.Item label={t("dm.retrainWeights")} required>
                                <Checkbox checked={retrainWeights}
                                          onChange={(e) => setRetrainWeights(e.target.checked)}>{t("dm.retrainWeights")}</Checkbox>
                            </Form.Item>
                        </Col>
                        <Col flex={"auto"}>
                            <Form.Item label={t("dm.randomSamples")} required>
                                <Checkbox checked={randomSamples}
                                          onChange={(e) => setRandomSamples(e.target.checked)}>{t("dm.randomSamples")}</Checkbox>
                            </Form.Item>
                        </Col>
                        <Col flex={"auto"}>
                            <Form.Item label={t("dm.tunning")} required>
                                <Checkbox checked={tunning}
                                          onChange={(e) => setTunning(e.target.checked)}>{t("dm.tunning")}</Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>,
            },
        ]
    ;

    const next = () => {
            setCurrentStep(currentStep + 1);
        }
    ;

    const prev = () => {
            setCurrentStep(currentStep - 1);
        }
    ;

    const contentStyle: React.CSSProperties =
        {
            lineHeight: '260px',
            textAlign: 'center',
            color: themeObject[theme].textMain,
            borderRadius: themeObject[theme].background,
            border: `1px dashed ${themeObject[theme].background}`,
            marginTop: 16,
        };

    return (
        <>
            <Button style={{background: "darkgreen"}} block onClick={showModal}>{t("dm.newDigitalModel")}</Button>
            <Modal centered width={1000}
                   title={t("dm.newDigitalModel")} open={isModalOpen} onOk={newDigitalModel} onCancel={handleCancel}>
                <Steps current={currentStep} items={steps}/>
                <div style={contentStyle}>
                    {steps[currentStep].content}
                </div>
                <div style={{marginTop: 24}}>
                    {currentStep < steps.length - 1 && (
                        <Button type={"primary"} onClick={() => next()}>
                            {t("dm.next")}
                        </Button>
                    )}
                    {currentStep > 0 && (
                        <Button type={"default"} style={{margin: '0 8px'}} onClick={() => prev()}>
                            {t("dm.previous")}
                        </Button>
                    )}
                </div>
            </Modal>
        </>

    );
};
