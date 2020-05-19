import React from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useLocalStore, useObserver } from 'mobx-react-lite';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 }
};

export default props => {
  const { formData } = useLocalStore(() => (
    <MobxFormData>
      <MobxFieldData name="note" required />
      <MobxFieldData name="gender" required />
      <MobxFieldData name="customizeGender" required />
    </MobxFormData>
  ));

  const onGenderChange = value => {
    switch (value) {
      case 'male':
        formData.note = 'Hi, man!';
        return;
      case 'female':
        formData.note = 'Hi, lady!';
        return;
      case 'other':
        formData.note = 'Hi there!';
        return;
    }
  };

  const onSubmit = () =>
    formData
      .validate()
      .then(values => {
        console.log(values);
      })
      .catch(errorInfo => {
        console.log(errorInfo);
      });

  const onReset = () => {
    formData.reset();
  };

  const onFill = () => {
    formData.note = 'Hello world!';
    formData.gender = 'male';
  };

  return useObserver(() => (
    <Form {...layout} n-style="max-width:600">
      <Form.Item n-mobxField={formData.note} label="Note">
        <Input />
      </Form.Item>

      <Form.Item n-mobxField={formData.gender} label="Gender">
        <Select placeholder="Select a option and change input text above" onChange={onGenderChange} allowClear>
          <Option value="male">male</Option>
          <Option value="female">female</Option>
          <Option value="other">other</Option>
        </Select>
      </Form.Item>

      <if condition={formData.gender === 'other'}>
        <Form.Item n-mobxField={formData.customizeGender} label="Customize Gender">
          <Input />
        </Form.Item>
      </if>

      <Form.Item {...tailLayout}>
        <Button type="primary" onClick={onSubmit} n-style="margin-right:8">
          Submit
        </Button>
        <Button htmlType="button" onClick={onReset}>
          Reset
        </Button>
        <Button type="link" htmlType="button" onClick={onFill}>
          Fill form
        </Button>
      </Form.Item>
    </Form>
  ));
};
