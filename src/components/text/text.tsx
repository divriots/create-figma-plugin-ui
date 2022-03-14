/** @jsx h */
import { ComponentChildren, h, JSX } from 'preact';

import { Props } from '../../types/types';
import { createClassName } from '../../utilities/create-class-name';
import styles from './text.module.css';
import { IconCircleHelp16 } from '../icon/icon-16/icon-circle-help-16';

export type TextProps = {
  children: ComponentChildren;
  align?: TextAlignment;
  bold?: boolean;
  muted?: boolean;
  numeric?: boolean;
  helplink?: string;
};
export type TextAlignment = 'left' | 'center' | 'right';

export function Text({
  align = 'left',
  bold = false,
  children,
  muted = false,
  numeric = false,
  helplink = undefined,
  ...rest
}: Props<HTMLDivElement, TextProps>): JSX.Element {
  return (
    <div
      {...rest}
      class={createClassName([
        styles.text,
        styles[align],
        bold === true ? styles.bold : null,
        muted === true ? styles.muted : null,
        numeric === true ? styles.numeric : null,
      ])}
    >
      {children}
      {helplink && (
        <a href={helplink} target="_blank">
          <IconCircleHelp16 color="black-30" />
        </a>
      )}
    </div>
  );
}
