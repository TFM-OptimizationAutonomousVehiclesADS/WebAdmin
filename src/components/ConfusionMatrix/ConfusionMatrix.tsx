import React from 'react';
import { Row, Col, Menu as AntMenu } from "antd";
import styled from "styled-components";

const SquareGreenNumber = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: rgba(97,176,97,0.67);
  border: 1px solid;
`

const SquareRedNumber = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: rgba(182,86,86,0.67);
  border: 1px solid;
`

const PercentageNumber = styled.div`
  font-size: 1.5vh;
  font-weight: bold;
`

const TotalNumber = styled.div`
  font-size: 1vh;
  font-weight: lighter;
`

export const ConfusionMatrix: React.FC = ({tp, tn, fp, fn}) => {
  const total = tp + tn + fp + fn;

  return (
    <Row gutter={[0, 0]} style={{height: "100%"}}>
      <Col span={12} >
        <SquareGreenNumber>
          <div>TP</div>
          <PercentageNumber>{((parseFloat(tp) / total) * 100).toFixed(2)}%</PercentageNumber>
          <TotalNumber>({tp})</TotalNumber>
        </SquareGreenNumber>
      </Col>
      <Col span={12}>
        <SquareRedNumber>
          <div>FP</div>
          <PercentageNumber>{((parseFloat(fp) / total) * 100).toFixed(2)}%</PercentageNumber>
          <TotalNumber>({fp})</TotalNumber>
        </SquareRedNumber>
      </Col>
      <Col span={12}>
        <SquareRedNumber>
        <div>FN</div>
          <PercentageNumber>{((parseFloat(fn) / total) * 100).toFixed(2)}%</PercentageNumber>
          <TotalNumber>({fn})</TotalNumber>
        </SquareRedNumber>
      </Col>
      <Col span={12}>
        <SquareGreenNumber>
        <div>TN</div>
          <PercentageNumber>{((parseFloat(tn) / total) * 100).toFixed(2)}%</PercentageNumber>
          <TotalNumber>({tn})</TotalNumber>
        </SquareGreenNumber>
      </Col>
    </Row>
  )
}