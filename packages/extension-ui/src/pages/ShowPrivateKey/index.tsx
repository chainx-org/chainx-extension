import React from 'react'
import './showPrivateKey.scss'
import StaticWarning from '../../components/StaticWarning/index';

function ShowPrivateKey(props: any) {
  return (
    <div className="show-private-key">
      <span className="title">您的私钥</span>
      <StaticWarning desc='不要将您的私钥存储在电脑上，或者网上某处。任何拥有您私钥的人都能取用您的资金。' />
      <div className="pk">
        <span className="span-center-wrap">{props.location.query.pk}</span>
      </div>
    </div>
  )
}

export default ShowPrivateKey