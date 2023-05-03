import React, { useState } from "react";
import { Col, DatePicker, Row } from "antd";
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { ScreeningsCard } from '@app/components/medical-dashboard/screeningsCard/ScreeningsCard/ScreeningsCard';
import { ActivityCard } from '@app/components/medical-dashboard/activityCard/ActivityCard';
import { TreatmentCard } from '@app/components/medical-dashboard/treatmentCard/TreatmentCard';
import { CovidCard } from '@app/components/medical-dashboard/covidCard/CovidCard';
import { HealthCard } from '@app/components/medical-dashboard/HealthCard/HealthCard';
import { FavoritesDoctorsCard } from '@app/components/medical-dashboard/favoriteDoctors/FavoriteDoctorsCard/FavoritesDoctorsCard';
import { PatientResultsCard } from '@app/components/medical-dashboard/PatientResultsCard/PatientResultsCard';
import { StatisticsCards } from '@app/components/medical-dashboard/statisticsCards/StatisticsCards';
import { BloodScreeningCard } from '@app/components/medical-dashboard/bloodScreeningCard/BloodScreeningCard/BloodScreeningCard';
import { NewsCard } from '@app/components/medical-dashboard/NewsCard/NewsCard';
import { References } from '@app/components/common/References/References';
import { useResponsive } from '@app/hooks/useResponsive';
import * as S from './DashboardPage.styles';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment/moment";
import {
  PieChartTotalAnomaliesComparation
} from "@app/components/Dashboards/Anomalies/PieChartTotalAnomaliesComparation";
import {
  PieChartTotalPredictionsComparation
} from "@app/components/Dashboards/Anomalies/PieChartTotalPredictionsComparation";
import { LogsSamplesOverTimelineChart } from "@app/components/Dashboards/Anomalies/LogsSamplesOverTimelineChart";
import { LogsAnomaliesOverTimelineChart } from "@app/components/Dashboards/Anomalies/LogsAnomaliesOverTimelineChart";

dayjs.extend(customParseFormat);

const dateFormat = 'DD/MM/YYYY HH:mm:ss';
// const startDatetime = dayjs().subtract(1, "day");
// const endDatetime = dayjs();
const startDatetime = moment().subtract(8, "hour");
const endDatetime = moment();
const { RangePicker } = DatePicker;

const AnomaliesDashboardPage: React.FC = () => {
  const [rangeDatetime, setRangeDatetime] = useState([startDatetime, endDatetime]);
  const { t } = useTranslation();

  const onChangeRangePicker = (datesObjects, datesStrings) => {
    setRangeDatetime(datesObjects);
  }

  return (
    <>
      <PageTitle>{t('common.anomalies-dashboard')}</PageTitle>
      <Row>
        <S.LeftSideCol xl={16} xxl={17}>
          <Row gutter={[30, 30]}>
            <Col span={24}>
              <LogsSamplesOverTimelineChart rangeDatetime={rangeDatetime} />
            </Col>
            <Col span={24}>
              <LogsAnomaliesOverTimelineChart rangeDatetime={rangeDatetime} />
            </Col>
          </Row>
        </S.LeftSideCol>

        <S.RightSideCol xl={8} xxl={7}>
          <Row gutter={[30, 30]}>
            <Col span={24}>
              <RangePicker showTime format={dateFormat} value={rangeDatetime} onChange={onChangeRangePicker}/>
            </Col>
            <Col span={24}>
              <PieChartTotalPredictionsComparation height={"30vh"} rangeDatetime={rangeDatetime}/>
            </Col>
            <Col span={24}>
              <PieChartTotalAnomaliesComparation height={"30vh"} rangeDatetime={rangeDatetime}/>
            </Col>
          </Row>
        </S.RightSideCol>
      </Row>
    </>
  );
};

export default AnomaliesDashboardPage;
