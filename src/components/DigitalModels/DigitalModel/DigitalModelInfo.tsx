import React, {useEffect, useState} from 'react';
import {Col, Row, Card, Checkbox, Tooltip, Button} from 'antd';
import {useTranslation} from 'react-i18next';
import {
    deleteDigitalModelApi,
    getAllDigitalModelsApi,
    getDigitalModelByIdApi,
    startDigitalModelApi, stopDigitalModelApi
} from "@app/api/digitalModels/digitalModels.api";
import {notificationController} from "@app/controllers/notificationController";
import {getIpComponent, getParamDataByName, getStatusComponent} from "@app/utils/utilsDigitalModels";
import {getLocaleStringDateTime} from "@app/utils/utils";
import {DigitalModelTabs} from "@app/components/DigitalModels/DigitalModel/DigitalModelTabs";
import {useParams} from "react-router-dom";
import {CaretRightFilled, DeleteFilled, StopFilled} from "@ant-design/icons";


export const DigitalModelInfo: React.FC = ({idDigitalModel}) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [info, setInfo] = useState(null);
    const {t} = useTranslation();

    const retrieveData = () => {
        getDigitalModelByIdApi(idDigitalModel)
            .then((response) => {
                if (response.data?.digital_model) {
                    setInfo(response.data?.digital_model);
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


    const startDigitalModel = (idDigitalModel: string) => {
        notificationController.info({message: t("dm.starting")});
        startDigitalModelApi(idDigitalModel)
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
    }

    const stopDigitalModel = (idDigitalModel: string) => {
        notificationController.info({message: t("dm.stopping")});
        stopDigitalModelApi(idDigitalModel)
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
    }

    const deleteDigitalModel = (idDigitalModel: string) => {
        notificationController.info({message: t("dm.deleting")});
        deleteDigitalModelApi(idDigitalModel)
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
    }


    return (
        <>
            <Row gutter={[10, 10]}>
                <Col span={12}>
                    <Card title={t("dm.basicInfo")}>
                        <Row gutter={[10, 10]}>
                            <Col flex={"auto"}>
                                <Card type={"inside"} title={t("dm.name")}>
                                    {info?.name}
                                </Card>
                            </Col>
                            <Col flex={"auto"}>
                                <Card type={"inside"} title={t("dm.username")}>
                                    {getParamDataByName("DIGITAL_MODEL_USERNAME_OWNER", info?.params)}
                                </Card>
                            </Col>
                            <Col flex={"auto"}>
                                <Card type={"inside"} title={t("dm.status")}>
                                    {getStatusComponent(info?.status)}
                                </Card>
                            </Col>
                            <Col flex={"auto"}>
                                <Card type={"inside"} title={t("dm.ip")}>
                                    {getIpComponent(info?.ip, t)}
                                </Card>
                            </Col>
                            <Col flex={"auto"}>
                                <Card type={"inside"} title={t("dm.createdAt")}>
                                    {getLocaleStringDateTime(info?.created)}
                                </Card>
                            </Col>
                            <Col flex={"auto"}>
                                <Card type={"inside"} title={t("dm.startedAt")}>
                                    {getLocaleStringDateTime(info?.state?.StartedAt)}
                                </Card>
                            </Col>
                            {info?.status !== "running" &&
                                <Col flex={"auto"}>
                                    <Card type={"inside"} title={t("dm.finishedAt")}>
                                        {getLocaleStringDateTime(info?.state?.FinishedAt)}
                                    </Card>
                                </Col>}
                            {(info?.status == "running" || info?.status == "created") &&
                                <Col>
                                    <Card type={"inside"} title={t("dm.stop")}>
                                        <Tooltip title={t("dm.stop")}>
                                            <Button onClick={() => stopDigitalModel(info?.id)}
                                                    style={{background: "red"}}
                                                    shape="circle"
                                                    icon={<StopFilled/>}/>
                                        </Tooltip>
                                    </Card>
                                </Col>}
                            {(info?.status == "stopped" || info?.status == "exited") &&
                                <Col>
                                    <Card type={"inside"} title={t("dm.start")}>
                                        <Tooltip title={t("dm.start")}>
                                            <Button onClick={() => startDigitalModel(info?.id)}
                                                    style={{background: "green"}}
                                                    shape="circle"
                                                    icon={<CaretRightFilled/>}/>
                                        </Tooltip>
                                    </Card>
                                </Col>}
                            {(info?.status == "stopped" || info?.status == "exited") &&
                                <Col>
                                    <Card type={"inside"} title={t("dm.delete")}>
                                        <Tooltip title={t("dm.delete")}>
                                            <Button onClick={() => deleteDigitalModel(info?.id)}
                                                    style={{background: "gray"}}
                                                    shape="circle"
                                                    icon={<DeleteFilled/>}/>
                                        </Tooltip>
                                    </Card>
                                </Col>}
                        </Row>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title={t("dm.features")}>
                        <Row gutter={[10, 10]}>
                            <Col flex={"auto"}>
                                <Card type={"inside"} title={t("dm.sizeImageWidth")}>
                                    {getParamDataByName("DIGITAL_MODEL_SIZE_IMAGES_WIDTH", info?.params)}
                                </Card>
                            </Col>
                            <Col flex={"auto"}>
                                <Card type={"inside"} title={t("dm.sizeImageHeight")}>
                                    {getParamDataByName("DIGITAL_MODEL_SIZE_IMAGES_HEIGHT", info?.params)}
                                </Card>
                            </Col>
                            <Col flex={"auto"}>
                                <Card type={"inside"} title={t("dm.thresholdAnomaly")}>
                                    {getParamDataByName("DIGITAL_MODEL_THRESHOLD_ANOMALY", info?.params)}
                                </Card>
                            </Col>
                            <Col flex={"auto"}>
                                <Card type={"inside"} title={t("dm.metricObjective")}>
                                    {getParamDataByName("DIGITAL_MODEL_SIZE_IMAGES_METRIC_OBJECTIVE", info?.params)}
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col span={24}>
                    <Card title={t("dm.retrainingFeatures")}>
                        <Row gutter={[10, 10]}>
                            <Col span={4}>
                                <Card type={"inside"} title={t("dm.testSize")}>
                                    {getParamDataByName("DIGITAL_MODEL_RETRAINING_TEST_SIZE", info?.params)}
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card type={"inside"} title={t("dm.minSplit")}>
                                    {getParamDataByName("DIGITAL_MODEL_RETRAINING_MIN_SPLIT", info?.params)}
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card type={"inside"} title={t("dm.maxSplit")}>
                                    {getParamDataByName("DIGITAL_MODEL_RETRAINING_MAX_SPLIT", info?.params)}
                                </Card>
                            </Col>
                            <Col span={4}>
                                <Card type={"inside"} title={t("dm.minEpochs")}>
                                    {getParamDataByName("DIGITAL_MODEL_RETRAINING_MIN_EPOCHS", info?.params)}
                                </Card>
                            </Col>
                            <Col span={4}>
                                <Card type={"inside"} title={t("dm.maxEpochs")}>
                                    {getParamDataByName("DIGITAL_MODEL_RETRAINING_MAX_EPOCHS", info?.params)}
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card type={"inside"} title={t("dm.bestEpoch")}>
                                    <Checkbox
                                        checked={Boolean(parseInt(getParamDataByName("DIGITAL_MODEL_RETRAINING_BEST_EPOCH", info?.params)) || 0)}/>
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card type={"inside"} title={t("dm.retrainWeights")}>
                                    <Checkbox
                                        checked={Boolean(parseInt(getParamDataByName("DIGITAL_MODEL_RETRAINING_RETRAIN_WEIGHTS", info?.params)) || 0)}/>
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card type={"inside"} title={t("dm.randomSamples")}>
                                    <Checkbox
                                        checked={Boolean(parseInt(getParamDataByName("DIGITAL_MODEL_RETRAINING_RANDOM_SAMPLES", info?.params)) || 0)}/>
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card type={"inside"} title={t("dm.tunning")}>
                                    <Checkbox
                                        checked={Boolean(parseInt(getParamDataByName("DIGITAL_MODEL_RETRAINING_TUNNING", info?.params)) || 0)}/>
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </>

    );
};
