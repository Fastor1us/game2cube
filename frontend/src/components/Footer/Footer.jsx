import React from 'react';
import packageJson from '../../../../package.json';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';


export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>v{packageJson.version}</p>
      <p>
        {`© ${new Date().getFullYear()} `}
        <Link to='/?about' className={styles.link}>
          {packageJson.author}
        </Link>
      </p>
    </footer>
  );
}
