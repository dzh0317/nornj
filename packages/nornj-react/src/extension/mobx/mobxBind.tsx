import nj, { registerExtension, ExtensionDelegateOption, Component } from 'nornj';
import React, { useRef } from 'react';
import { toJS } from 'mobx';
import extensionConfigs from '../../../mobx/extensionConfig';
import { debounce } from '../../utils';

interface IProps extends React.InputHTMLAttributes<any> {
  mobxBindDirectiveOptions: ExtensionDelegateOption;
  MobxBindTag: Component;
  _mobxBindValue: any;
  innerRef: React.Ref<any>;
}

const MobxBindWrap = React.forwardRef<any, IProps>(
  (
    {
      MobxBindTag,
      mobxBindDirectiveOptions: {
        tagName,
        context: { $this },
        props: directiveProps
      },
      _mobxBindValue: value,
      ...props
    },
    ref
  ) => {
    let valuePropName = 'value',
      changeEventName = 'onChange';
    const componentConfig = nj.getComponentConfig(tagName) || {};
    const args = directiveProps && directiveProps.arguments;
    const debounceArg = _hasArg(args, 'debounce');

    if (componentConfig.valuePropName != null) {
      valuePropName = componentConfig.valuePropName;
    }
    if (componentConfig.changeEventName != null) {
      changeEventName = componentConfig.changeEventName;
    }

    let _value = value.value;
    const isMultipleSelect = tagName === 'select' && props.multiple;
    if (componentConfig.needToJS || isMultipleSelect) {
      _value = toJS(_value);
    }

    const changeEvent = props[changeEventName];
    let emitChangeDebounced;
    if (debounceArg) {
      const { modifiers } = debounceArg;
      emitChangeDebounced = useRef(
        debounce(args => {
          changeEvent && changeEvent.apply($this, args);
        }, (modifiers && +modifiers[0]) || 100)
      );
    }

    const compProps: React.InputHTMLAttributes<any> = {};
    if (componentConfig.hasEventObject) {
      const targetPropName = componentConfig.targetPropName || 'value';
      const isRadio = tagName === 'input' && props.type === 'radio';
      const isCheckbox = tagName === 'input' && props.type === 'checkbox';
      if (isRadio) {
        compProps.checked = props.value === _value;
      } else if (isCheckbox) {
        compProps.checked = _value != null && (nj.isArrayLike(_value) ? _value.indexOf(props.value) >= 0 : _value);
      } else {
        compProps[valuePropName] = _value;
      }

      compProps[changeEventName] = function(e: React.BaseSyntheticEvent) {
        e && e.persist && e.persist();

        _setValue(
          e.target[targetPropName],
          {
            target: e.target,
            value,
            args: arguments,
            changeEventName,
            changeEvent,
            valuePropName,
            emitChangeDebounced,
            isMultipleSelect,
            isCheckbox
          },
          $this
        );
      };
    } else {
      const getValueFromEvent = componentConfig.getValueFromEvent;
      compProps[valuePropName] = _value;
      compProps[changeEventName] = function(...args: any[]) {
        _setValue(
          getValueFromEvent ? getValueFromEvent(...args) : args[0],
          {
            value,
            args,
            changeEventName,
            changeEvent,
            valuePropName,
            emitChangeDebounced
          },
          $this
        );
      };
    }

    _formDataTrigger(value, changeEventName, true, props, compProps, $this);

    return <MobxBindTag {...props} {...compProps} ref={ref} />;
  }
);

function _formDataTrigger(value, changeEventName, notDirect?, props?, compProps?, $this?) {
  if (value.source && value.source._njMobxFormData) {
    const trigger = value.source.fieldDatas.get(value.prop).trigger;
    if (trigger !== changeEventName) {
      const triggerEvent = props[trigger];
      compProps[trigger] = function(e: React.BaseSyntheticEvent) {
        e && e.persist && e.persist();

        value.source.validate(value.prop).catch(nj.noop);
        triggerEvent && triggerEvent.apply($this, arguments);
      };
    } else if (!notDirect) {
      value.source.validate(value.prop).catch(nj.noop);
    }
  }
}

function _setValue(value, params, $this) {
  let _value = value;
  if (params.isMultipleSelect) {
    _value = nj
      .arraySlice(params.target.options)
      .filter(option => option.selected)
      .map(option => option.value);
  } else if (params.isCheckbox) {
    const checkboxValue = params.value.value;
    if (nj.isArrayLike(checkboxValue)) {
      if (params.target.checked) {
        checkboxValue.push(value);
      } else {
        checkboxValue.splice(checkboxValue.indexOf(value), 1);
      }
      _value = checkboxValue;
    } else {
      _value = params.target.checked;
    }
  }

  const setter = params.value.source[`set${nj.upperFirst(params.value.prop)}`];
  if (setter) {
    setter(_value, params.args);
  } else {
    params.value.source[params.value.prop] = _value;
  }

  _formDataTrigger(params.value, params.changeEventName);

  if (params.emitChangeDebounced) {
    params.emitChangeDebounced.current(params.args);
  } else if (params.changeEvent) {
    params.changeEvent.apply($this, params.args);
  }
}

function _hasArg(args, name) {
  let ret;
  args &&
    args.every(arg => {
      if (arg.name == name) {
        ret = arg;
        return false;
      }
      return true;
    });

  return ret;
}

registerExtension(
  'mobxBind',
  options => {
    const ret = options.value();
    if (ret == null) {
      return ret;
    }

    const { tagName, setTagName, tagProps, props } = options;

    setTagName(MobxBindWrap);
    tagProps.MobxBindTag = tagName;
    tagProps.mobxBindDirectiveOptions = options;
    tagProps._mobxBindValue = ret;
  },
  extensionConfigs.mobxBind
);

nj.extensions.mstBind = nj.extensions.mobxBind;
