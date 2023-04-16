import React, {useEffect, useState} from 'react';
import {Col, Row, Card, Checkbox, Tag} from 'antd';
import {useTranslation} from 'react-i18next';
import { RealSystemTabs } from './RealSystemTabs';
import { getDigitalModelByIdApi } from "@app/api/digitalModels/digitalModels.api";
import { notificationController } from "@app/controllers/notificationController";


export const RealSystemTemplate: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
  const [info, setInfo] = useState(null);
    const {t} = useTranslation();

  const retrieveData = () => {
    // getRealSystemByIdApi()
    //   .then((response) => {
    //     if (response.data?.real_system) {
    //       setInfo(response.data?.real_system);
    //     } else {
    //       notificationController.error({message: t("dm.errorData")});
    //     }
    //   })
    //   .catch((error) => {
    //     notificationController.error({message: t("dm.errorData")});
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
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
                <RealSystemTabs info={info}/>
            </Col>
        </Row>

    );
};
