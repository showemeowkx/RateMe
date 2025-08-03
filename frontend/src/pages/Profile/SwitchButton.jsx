import React from 'react';
import styles from './SwitchButton.module.css';
const Switch = ({ isOn, handleToggle }) => {
  return (
    <>
      <input
        checked={isOn}
        onChange={handleToggle}
        className={styles.toggleCheckbox}
        id='toggle'
        type='checkbox'
      />
      <label for='toggle' className={styles.toggleContainer}>
        <div>Створені товари</div>
        <div>Створені відгуки</div>
      </label>
    </>
  );
};

export default Switch;
