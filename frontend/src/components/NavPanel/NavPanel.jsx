import React, { useEffect, useState } from 'react';
import styles from './NavPanel.module.css';


export default function NavPanel(props) {
  const { data, callback, disabled } = props;
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleClick = (item, index) => {
    setActiveTabIndex(index);
    callback(item);
  }

  useEffect(() => {
    props.activeTabIndex && setActiveTabIndex(props.activeTabIndex);
  }, [props.activeTabIndex]);

  return (
    <ul className={styles.list}>
      {data.map((item, index) => (
        <li
          key={index}
          onClick={() => handleClick(item, index)}
          className={`
            ${activeTabIndex === index ? styles.listItemActive : ''}
            ${[
              styles.listItem,
              disabled && styles.listItemDisabled
            ].filter(Boolean).join(' ')}
          `}
        >
          {item[0]}
        </li>
      ))}
    </ul>
  );
}
