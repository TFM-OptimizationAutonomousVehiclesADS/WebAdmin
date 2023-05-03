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
import moment from "moment";
import {
  PieChartTotalPredictionsComparation
} from "@app/components/Dashboards/Anomalies/PieChartTotalPredictionsComparation";
import {
  PieChartTotalAnomaliesComparation
} from "@app/components/Dashboards/Anomalies/PieChartTotalAnomaliesComparation";
import { LogsSamplesOverTimelineChart } from "@app/components/Dashboards/Anomalies/LogsSamplesOverTimelineChart";
import {
  LogsSamplesOverTimelineChartRealSystem
} from "@app/components/Dashboards/Alerts/LogsSamplesOverTimelineChartRealSystem";
import {
  LogsAnomaliesOverTimelineChartRealSystem
} from "@app/components/Dashboards/Alerts/LogsAnomaliesOverTimelineChartRealSystem";
import { SortedPanelAnomaliesRealSystem } from "@app/components/Dashboards/Alerts/SortedPanelAnomaliesRealSystem";
import { RealSystemActualModelDashboard } from "@app/components/Dashboards/Alerts/RealSystemActualModelDashboard";
import {
  RealSystemLastFederativeListDashboard
} from "@app/components/Dashboards/Alerts/RealSystemLastFederativeListDashboard";
import { HealthIndicatorRealSystem } from "@app/components/Dashboards/Alerts/HealthIndicatorRealSystem";

dayjs.extend(customParseFormat);

const dateFormat = 'DD/MM/YYYY HH:mm:ss';
// const startDatetime = dayjs().subtract(1, "day");
// const endDatetime = dayjs();
const startDatetime = moment().subtract(8, "hour");
const endDatetime = moment();
const { RangePicker } = DatePicker;

const AlertsDashboardPage: React.FC = () => {
  const [rangeDatetime, setRangeDatetime] = useState([startDatetime, endDatetime]);
  const { t } = useTranslation();

  const onChangeRangePicker = (datesObjects, datesStrings) => {
    setRangeDatetime(datesObjects);
  }

  return (
    <>
      <PageTitle>{t('common.alerts-dashboard')}</PageTitle>
      <Row>
        <S.LeftSideCol xl={16} xxl={17}>
          <Row gutter={[30, 30]}>
            <Col span={24}>
              <HealthIndicatorRealSystem rangeDatetime={rangeDatetime}/>
            </Col>
            <Col span={24}>
              <LogsSamplesOverTimelineChartRealSystem rangeDatetime={rangeDatetime} />
            </Col>
            <Col span={24}>
              <LogsAnomaliesOverTimelineChartRealSystem rangeDatetime={rangeDatetime} />
            </Col>
            <Col span={24}>
              <h3><b>Top Anomalies</b></h3>
              <SortedPanelAnomaliesRealSystem rangeDatetime={rangeDatetime} />
            </Col>
          </Row>
        </S.LeftSideCol>

        <S.RightSideCol xl={8} xxl={7}>
          <Row gutter={[30, 30]}>
            <Col span={24}>
              <RangePicker showTime format={dateFormat} value={rangeDatetime} onChange={onChangeRangePicker}/>
            </Col>
            <Col span={24}>
              <RealSystemActualModelDashboard/>
            </Col>
            <Col span={24}>
              <RealSystemLastFederativeListDashboard/>
            </Col>
          </Row>
        </S.RightSideCol>
      </Row>
    </>
  );
};

export default AlertsDashboardPage;
