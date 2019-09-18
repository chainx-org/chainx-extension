import React from 'react';
// @ts-ignore
import warningIcon from '../../assets/warning.png';
import './index.scss';

function StaticWarning(props) {
  const {
    title = '',
    desc = '不要将您的助记词存储在电脑上，或者网上某处。任何拥有您助记词的人都能取用您的资金'
  } = props;

  return (
    <div className="static-warning">
      <img className="warning-icon" src={warningIcon} alt="warning" />
      <span className="warning-title">{title}</span>
      <div className="warning-desc">{desc}</div>
    </div>
  );
}

export default StaticWarning;
