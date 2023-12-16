import React from 'react';
import styles from './AvatarList.module.css';
import { useSelector } from 'react-redux';
import { avatarListSelector } from '../../store/selectors/userSelectors';
import { BACKEND_URL } from '../../utils/constants';


function AvatarList(props) {
  const avatarList = useSelector(avatarListSelector);

  const handleClick = (avatar) => {
    props.setSelectedAvatar(avatar);
    props.setVisible(false);
  }

  return (
    <ul className={styles.list}>
      {avatarList.map((avatar, index) => (
        <li key={index}>
          <img alt={`Аватар ${avatar}`} className={styles.avatar}
            src={`${BACKEND_URL}/user/avatars/${avatar}`}
            onClick={() => handleClick(avatar)}
          />
        </li>
      ))}
    </ul>
  );
}

export default AvatarList;
