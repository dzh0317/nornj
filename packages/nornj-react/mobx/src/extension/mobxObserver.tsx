import { registerExtension } from 'nornj';
import React from 'react';
import { Observer } from 'mobx-react-lite';
import extensionConfigs from '../../extensionConfig';

registerExtension(
  'mobxObserver',
  options => {
    return <Observer>{() => options.children() as JSX.Element}</Observer>;
  },
  extensionConfigs.mobxObserver
);