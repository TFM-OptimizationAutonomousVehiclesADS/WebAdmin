import React, { useState } from "react";
import { Col, Row, Card, DatePicker } from "antd";
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useResponsive } from '@app/hooks/useResponsive';
import * as S from './DashboardPage.styles';
import { RadarMetricsComparationChart } from "@app/components/Dashboards/Retraining/RadarMetricsComparationChart";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  RetrainingsMetricsOverTimelineChart
} from "@app/components/Dashboards/Retraining/RetrainingsMetricsOverTimelineChart";
import moment from "moment";
import {
  BarChartBestMetricsComparationChart
} from "@app/components/Dashboards/Retraining/BarChartBestMetricsComparationChart";

dayjs.extend(customParseFormat);

const dateFormat = 'DD/MM/YYYY HH:mm:ss';
// const startDatetime = dayjs().subtract(1, "day");
// const endDatetime = dayjs();
const startDatetime = moment().subtract(8, "hour");
const endDatetime = moment();
const { RangePicker } = DatePicker;

const RetrainingDashboardPage: React.FC = () => {
  const { isTablet, isDesktop } = useResponsive();
  const [rangeDatetime, setRangeDatetime] = useState([startDatetime, endDatetime]);
  const { t } = useTranslation();

  const onChangeRangePicker = (datesObjects, datesStrings) => {
    setRangeDatetime(datesObjects);
  }

  return (
    <>
      <PageTitle>{t('common.retraining-dashboard')}</PageTitle>
      <Row>
        <S.LeftSideCol xl={16} xxl={17}>
          <Row gutter={[30, 30]}>
            <Col span={24}>
              <RetrainingsMetricsOverTimelineChart rangeDatetime={rangeDatetime} metric={"accuracy"}/>
            </Col>
            <Col span={24}>
              <RetrainingsMetricsOverTimelineChart rangeDatetime={rangeDatetime} metric={"precision"}/>
            </Col>
            <Col span={24}>
              <RetrainingsMetricsOverTimelineChart rangeDatetime={rangeDatetime} metric={"recall"}/>
            </Col>
            <Col span={24}>
              <RetrainingsMetricsOverTimelineChart rangeDatetime={rangeDatetime} metric={"f1_score"}/>
            </Col>
          </Row>
        </S.LeftSideCol>

        <S.RightSideCol xl={8} xxl={7}>
          <Row gutter={[30, 30]}>
            <Col span={24}>
                  <RangePicker showTime format={dateFormat} value={rangeDatetime} onChange={onChangeRangePicker}/>
            </Col>
            <Col span={24}>
              <RadarMetricsComparationChart height={"30vh"}/>
            </Col>
            <Col span={24}>
              <BarChartBestMetricsComparationChart metricObjective={"f1_score"} height={"30vh"}/>
            </Col>
            <Col span={24}>
              <BarChartBestMetricsComparationChart metricObjective={"accuracy"} height={"30vh"}/>
            </Col>
          </Row>
        </S.RightSideCol>
      </Row>
    </>
  );
};

export default RetrainingDashboardPage;
