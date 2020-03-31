import React, { ReactNode } from 'react';
import { isFunction } from './is-function';

export type MapChildrenType<T> = ReactNode | ((props: T) => ReactNode);

export type RenderComponent<R, T = {}> = React.FC<
  T & { children: MapChildrenType<R> }
>;

export default function functionOrMapChildren<T>(
  children: MapChildrenType<T>,
  withProps: T
): any {
  if (children && isFunction(children)) {
    return (
      children(withProps) || <div>Could not render children from function</div>
    );
  }

  return (
    React.Children.map(children, (child: any) => {
      return React.cloneElement(child, withProps);
    }) || <div>Could not clone children</div>
  );
}
