import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import { cx } from '@/shared/lib';

import styles from './Surface.module.css';

type SurfacePadding = 'none' | 'sm' | 'md' | 'lg';

type SurfaceProps<T extends ElementType> = {
  as?: T;
  padding?: SurfacePadding;
  interactive?: boolean;
  className?: string | undefined;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>;

const PADDING_CLASS: Record<SurfacePadding, string | undefined> = {
  none: undefined,
  sm: styles.paddingSm,
  md: styles.paddingMd,
  lg: styles.paddingLg,
};

/** The one card container every page and widget builds on. */
export function Surface<T extends ElementType = 'div'>({
  as,
  padding = 'md',
  interactive = false,
  className,
  children,
  ...rest
}: SurfaceProps<T>) {
  const Component: ElementType = as ?? 'div';
  const classes = cx(
    styles.surface,
    PADDING_CLASS[padding],
    interactive && styles.interactive,
    className,
  );

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
}

type SurfaceSectionProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
};

/** A titled Surface for settings-style and detail panels. */
export function SurfaceSection({ title, description, actions, children }: SurfaceSectionProps) {
  return (
    <Surface as="section" padding="lg" className={styles.section}>
      <header className={styles.sectionHeader}>
        <div className={styles.sectionCopy}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          {description ? <p className={styles.sectionDescription}>{description}</p> : null}
        </div>
        {actions ? <div className={styles.sectionActions}>{actions}</div> : null}
      </header>
      {children ?? null}
    </Surface>
  );
}
