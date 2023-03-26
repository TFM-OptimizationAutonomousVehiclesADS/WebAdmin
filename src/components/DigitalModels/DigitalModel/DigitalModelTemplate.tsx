import React, {useEffect, useState} from 'react';
import {Col, Row, Card, Checkbox, Tag} from 'antd';
import {useTranslation} from 'react-i18next';
import {getAllDigitalModelsApi, getDigitalModelByIdApi} from "@app/api/digitalModels/digitalModels.api";
import {notificationController} from "@app/controllers/notificationController";
import {getIpComponent, getParamDataByName, getStatusComponent} from "@app/utils/utilsDigitalModels";
import {getLocaleStringDateTime} from "@app/utils/utils";
import {DigitalModelTabs} from "@app/components/DigitalModels/DigitalModel/DigitalModelTabs";


export const DigitalModelTemplate: React.FC = ({idDigitalModel}) => {
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

    return (
        <Row gutter={[10, 10]}>
            <Col span={24} style={{textAlign: "center"}}>
                {/*<Card type={"inside"} style={{fontSize: "2vh", textAlign: "center"}}>*/}
                    <span style={{fontSize: "2.5vh"}}>{info?.name}</span>
                {/*</Card>*/}
            </Col>
            <Col span={24}>
                <DigitalModelTabs info={info}/>
            </Col>
        </Row>

    );
};
