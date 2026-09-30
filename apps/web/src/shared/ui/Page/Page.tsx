import type { ReactNode } from 'react';

import { cx } from '@/shared/lib';

import styles from './Page.module.css';

type PageWidth = 'narrow' | 'default' | 'wide';

type PageProps = {
  width?: PageWidth;
  children: ReactNode;
};

const WIDTH_CLASS: Record<PageWidth, string | undefined> = {
  narrow: styles.narrow,
  default: styles.default,
  wide: styles.wide,
};

/** Page frame: consistent max-width, vertical rhythm and entry motion. */
export function Page({ width = 'default', children }: PageProps) {
  return <section className={cx(styles.page, WIDTH_CLASS[width])}>{children}</section>;
}
