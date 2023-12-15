import React, { useEffect, useState } from 'react';
import styles from './AvatarList.module.css';


function AvatarList() {
  const [avatars, setAvatars] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/user/avatars')
      .then(response => response.json())
      .then(data => {
        // console.log('data:', data);
        setAvatars(data);
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }, []);

  // TODO
  // заменить div на ul
  // и все img упаковать в li
  return (
    <ul className={styles.list}>
      {avatars.map((avatar, index) => (
        <li>
          <img key={index} alt={`Аватар ${index}`}
            src={`http://localhost:3001/user/avatars/${avatar}`}
            className={styles.avatar}
          />
        </li>
      ))}
    </ul>
  );
}

export default AvatarList;
