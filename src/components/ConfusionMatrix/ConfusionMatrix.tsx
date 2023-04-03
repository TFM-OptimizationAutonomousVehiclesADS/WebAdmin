import React from 'react';
import {Row, Col} from "antd";

export const ConfusionMatrix: React.FC = ({tp, tn, fp, fn}) => {
  const total = tp + tn + fp + fn;

  return (
    <Row gutter={[0, 0]} style={{height: "100%"}}>
      <Col span={12}>
        <span>TP</span>
        {tn}
      </Col>
      <Col span={12}>
        <span>FP</span>
        {fp}
      </Col>
      <Col span={12}>
        <span>FN</span>
        {fn}
      </Col>
      <Col span={12}>
        <span>TP</span>
        {tp}
      </Col>
    </Row>
  )
}