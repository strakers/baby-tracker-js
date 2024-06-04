import React from 'react';
import './window.component.scss';
export function WindowLayout({ children }: React.PropsWithChildren<any>) {
  return <section className="window">{children}</section>;
}
