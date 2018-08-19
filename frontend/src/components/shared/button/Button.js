// @flow
import React from 'react';
import classNames from 'classnames';

import css from './Button.css';

type Props = {
  onClick: Function,
  text: string,
  className?: ?string,
  style?: ?string,
};

const Button = ({ onClick, className, style, text }: Props) => (
  <button className={classNames(css.button, className)} onClick={onClick}>
    {text}
  </button>
);

export default Button;
