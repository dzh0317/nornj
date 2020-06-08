import { registerComponent } from 'nornj';
import { Input } from 'antd';

registerComponent({
  'ant-Input': {
    component: Input,
    options: {
      hasEventObject: true
    }
  },
  'ant-InputPassword': {
    component: Input.Password,
    options: {
      hasEventObject: true
    }
  },
  'ant-InputGroup': Input.Group,
  'ant-TextArea': {
    component: Input.TextArea,
    options: {
      hasEventObject: true
    }
  },
  'ant-Search': Input.Search
});

export default Input;
