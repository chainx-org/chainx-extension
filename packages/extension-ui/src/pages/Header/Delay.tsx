import { getDelayClass } from './utils';
import React from 'react';

export default function({ delay }) {
  let text = '';
  if (delay === 'timeout') {
    text = delay;
  } else if (delay) {
    text = `${delay} ms`;
  }

  return <span className={'delay ' + getDelayClass(delay)}>{text}</span>;
}
