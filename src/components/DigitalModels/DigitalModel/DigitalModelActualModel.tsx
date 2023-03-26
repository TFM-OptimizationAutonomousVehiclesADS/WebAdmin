import React, {useEffect, useState} from 'react';
import {Col, Row, Card, Checkbox, Tooltip, Button} from 'antd';
import {useTranslation} from 'react-i18next';
import {
    deleteDigitalModelApi,
    getAllDigitalModelsApi, getDigitalModelActualModelByIdApi,
    getDigitalModelByIdApi,
    startDigitalModelApi, stopDigitalModelApi
} from "@app/api/digitalModels/digitalModels.api";
import {notificationController} from "@app/controllers/notificationController";
import {getIpComponent, getParamDataByName, getStatusComponent} from "@app/utils/utilsDigitalModels";
import {getLocaleStringDateTime} from "@app/utils/utils";
import {DigitalModelTabs} from "@app/components/DigitalModels/DigitalModel/DigitalModelTabs";
import {useParams} from "react-router-dom";
import {CaretRightFilled, DeleteFilled, StopFilled} from "@ant-design/icons";


export const DigitalModelActualModel: React.FC = ({idDigitalModel}) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [info, setInfo] = useState(null);
    const {t} = useTranslation();

    const retrieveData = () => {
        getDigitalModelActualModelByIdApi(idDigitalModel)
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

    return (
        <>
        </>

    );
};
