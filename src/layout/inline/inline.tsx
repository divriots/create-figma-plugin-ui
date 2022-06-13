/** @jsx h */
import { ComponentChild, ComponentChildren, h, JSX, toChildArray } from 'preact'

import { Props } from '../../types/types'
import styles from './inline.module.css'

export type InlineProps = {
  children: ComponentChildren
  space?: InlineSpace
}
export type InlineSpace =
  | 'extraSmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'extraLarge'

export function Inline({
  children,
  space,
  ...rest
}: Props<HTMLDivElement, InlineProps>): JSX.Element {
  return (
    <div
      {...rest}
      class={typeof space === 'undefined' ? undefined : styles[space]}
    >
      {toChildArray(children).map(function (
        child: ComponentChild,
        index: number
      ): JSX.Element {
        return (
          <div key={index} class={styles.child}>
            {child}
          </div>
        )
      })}
    </div>
  )
}
