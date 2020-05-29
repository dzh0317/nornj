import React from 'react';
import { Form, Input, InputNumber, Button } from 'antd';
import { useLocalStore, useObserver } from 'mobx-react-lite';
import { ValidateMessages } from 'nornj-react';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

const validateMessages: ValidateMessages = ({ label }) => ({
  required: name => `请输入${label}`,
  types: {
    email: name => `${label}格式不正确`,
    number: name => `${label}请输入数字`
  },
  number: {
    range: (name, min, max) => `${label}必须在${min}和${max}之间`
  }
});

export default props => {
  const { formData } = useLocalStore(() => (
    <MobxFormData validateMessages={validateMessages}>
      <MobxFieldData name="name" label="Name" required />
      <MobxFieldData name="email" label="Email" type="email" />
      <MobxFieldData name="age" label="Age" type="number" min={0} max={99} />
      <MobxFieldData name="website" label="Website" />
      <MobxFieldData name="introduction" label="Introduction" />
    </MobxFormData>
  ));

  const onSubmit = () =>
    formData
      .validate()
      .then(values => {
        console.log(values);
      })
      .catch(errorInfo => {
        console.log(errorInfo);
      });

  return useObserver(() => (
    <Form {...layout} n-style="max-width:600">
      <Form.Item n-mobxField={formData.name}>
        <Input />
      </Form.Item>

      <Form.Item n-mobxField={formData.email}>
        <Input />
      </Form.Item>

      <Form.Item n-mobxField={formData.age}>
        <InputNumber />
      </Form.Item>

      <Form.Item n-mobxField={formData.website}>
        <Input />
      </Form.Item>

      <Form.Item n-mobxField={formData.introduction}>
        <Input.TextArea />
      </Form.Item>

      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" onClick={onSubmit}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  ));
};
