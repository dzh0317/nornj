import React from 'react';
import { Form, DatePicker, TimePicker, Button } from 'antd';
import { useLocalStore, useObserver } from 'mobx-react-lite';
import { RuleItem } from 'async-validator';

const { YearPicker, MonthPicker, RangePicker, WeekPicker } = DatePicker;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};

interface Rules {
  rules: RuleItem[];
}
const config: Rules = {
  rules: [{ type: 'object', required: true, message: 'Please select time!' }]
};
const rangeConfig: Rules = {
  rules: [{ type: 'array', required: true, message: 'Please select time!' }]
};

const TimeRelatedForm = () => {
  const { formData } = useLocalStore(() => (
    <MobxFormData>
      <MobxFieldData name="date-picker" {...config} />
      <MobxFieldData name="date-time-picker" {...config} />
      <MobxFieldData name="year-picker" {...config} />
      <MobxFieldData name="quarter-picker" {...config} />
      <MobxFieldData name="month-picker" {...config} />
      <MobxFieldData name="week-picker" {...config} />
      <MobxFieldData name="range-picker" {...rangeConfig} />
      <MobxFieldData name="range-time-picker" {...rangeConfig} />
      <MobxFieldData name="time-picker" {...config} />
    </MobxFormData>
  ));

  const onSubmit = () =>
    formData
      .validate()
      .then(fieldsValue => {
        // Should format date value before submit.
        const rangeValue = fieldsValue['range-picker'];
        const rangeTimeValue = fieldsValue['range-time-picker'];
        const values = {
          ...fieldsValue,
          'date-picker': fieldsValue['date-picker'].format('YYYY-MM-DD'),
          'date-time-picker': fieldsValue['date-time-picker'].format('YYYY-MM-DD HH:mm:ss'),
          'month-picker': fieldsValue['month-picker'].format('YYYY-MM'),
          'range-picker': [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')],
          'range-time-picker': [
            rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
            rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss')
          ],
          'time-picker': fieldsValue['time-picker'].format('HH:mm:ss')
        };
        console.log('Received values of form: ', values);
      })
      .catch(errorInfo => {
        console.log(errorInfo);
      });

  return (
    <Form {...formItemLayout}>
      <Form.Item label="DatePicker" n-mobxField={`formData['date-picker']`}>
        <DatePicker />
      </Form.Item>
      <Form.Item label="DatePicker[showTime]" n-mobxField={`formData['date-time-picker']`}>
        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
      </Form.Item>
      <Form.Item label="YearPicker" n-mobxField={`formData['year-picker']`}>
        <YearPicker />
      </Form.Item>
      <Form.Item label="QuarterPicker" n-mobxField={`formData['quarter-picker']`}>
        <DatePicker picker="quarter" />
      </Form.Item>
      <Form.Item label="MonthPicker" n-mobxField={`formData['month-picker']`}>
        <MonthPicker />
      </Form.Item>
      <Form.Item label="WeekPicker" n-mobxField={`formData['week-picker']`}>
        <WeekPicker />
      </Form.Item>
      <Form.Item label="RangePicker" n-mobxField={`formData['range-picker']`}>
        <RangePicker />
      </Form.Item>
      <Form.Item label="RangePicker[showTime]" n-mobxField={`formData['range-time-picker']`}>
        <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
      </Form.Item>
      <Form.Item label="TimePicker" n-mobxField={`formData['time-picker']`}>
        <TimePicker />
      </Form.Item>
      <Form.Item
        wrapperCol={{
          xs: { span: 24, offset: 0 },
          sm: { span: 16, offset: 8 }
        }}>
        <Button type="primary" onClick={onSubmit}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TimeRelatedForm;
