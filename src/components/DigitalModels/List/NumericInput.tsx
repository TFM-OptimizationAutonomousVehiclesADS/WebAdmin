import React, {useState} from 'react';
import {Input, Tooltip} from 'antd';

interface NumericInputProps {
    value: string | number;
    onChange: (value: string | number) => void;
}

const formatNumber = (value: number) => new Intl.NumberFormat().format(value);

export const NumericInput = (props: NumericInputProps) => {
    const {value, onChange} = props;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value: inputValue} = e.target;
        const reg = /^-?\d*(\.\d*)?$/;
        if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
            onChange(inputValue);
        }
    };

    // '.' at the end or only '-' in the input box.
    const handleBlur = () => {
        let valueTemp = value;
        if (value.toString().charAt(value.length - 1) === '.' || value === '-') {
            valueTemp = value.toString().slice(0, -1);
        }
        onChange(valueTemp.toString().replace(/0*(\d+)/, '$1'));
    };

    const title = value ? (
        <span className="numeric-input-title">{value !== '-' ? formatNumber(Number(value)) : '-'}</span>
    ) : (
        'Input a number'
    );

    return (
        // <Tooltip trigger={['focus']} title={title} placement="topLeft" overlayClassName="numeric-input">
            <Input
                {...props}
                onChange={handleChange}
                onBlur={handleBlur}
                // placeholder="Input a number"
                // maxLength={16}
            />
        // </Tooltip>
    );
};