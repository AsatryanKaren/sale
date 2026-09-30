import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { BrandMark } from '../BrandMark';
import styles from './AuthFrame.module.css';

type AuthFrameProps = {
  appName: string;
  title: string;
  description: string;
  footer: ReactNode;
  aside: ReactNode;
  children: ReactNode;
};

/** Two-column frame for sign-in and sign-up: the form on the left, the pitch on the right. */
export function AuthFrame({
  appName,
  title,
  description,
  footer,
  aside,
  children,
}: AuthFrameProps) {
  return (
    <div className={styles.frame}>
      <main className={styles.main}>
        <Link to="/" className={styles.brand}>
          <BrandMark size={30} />
          <span>{appName}</span>
        </Link>
        <div className={styles.panel}>
          <header className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.description}>{description}</p>
          </header>
          {children}
          <p className={styles.footer}>{footer}</p>
        </div>
      </main>
      <aside className={styles.aside}>{aside}</aside>
    </div>
  );
}
