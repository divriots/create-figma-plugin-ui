/** @jsx h */
/* eslint-disable no-console */
import { h } from 'preact';
import { useState } from 'preact/hooks';

import { IconLayerFrame16 } from '../../../icons/icon-16/icon-layer-frame-16';
import { Dropdown } from '../dropdown';

export default {
  parameters: {
    fixedWidth: true,
    order: 2,
  },
  title: 'Components/Dropdown/Border',
  component: Dropdown,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['border', 'underline'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    placeholder: {
      control: { type: 'boolean' },
    },
    icon: {
      control: { type: 'select' },
      options: ['X', 'LayerFrame', 'None'],
    },
  },
  render: ({ icon: iconCtrl, placeholder: placeholderCtrl, ...args }) => {
    const [value, setValue] = useState<null | string>(null);
    const icon = {
      X: 'X',
      LayerFrame: <IconLayerFrame16 />,
    }[iconCtrl];
    const placeholder = placeholderCtrl ? 'placeholder' : undefined;
    return (
      <Dropdown
        onChange={(e) => setValue(e.currentTarget.value)}
        value={value}
        {...args}
        {...{ icon, placeholder }}
      />
    );
  },
};

export const Properties = {
  args: {
    options: [
      { value: 'foo' },
      { value: 'bar' },
      { value: 'baz' },
      { separator: true },
      { header: 'Header' },
      { value: 'qux' },
    ],
    icon: 'None',
  },
};
