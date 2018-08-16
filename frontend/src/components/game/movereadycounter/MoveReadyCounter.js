// @flow

import React, { Component } from 'react';
import { Spring } from 'react-spring';
import classNames from 'classnames';

import style from './MoveReadyCounter.css';

type Props = {};

type State = {
  secondsToStart: number,
  startAnimationState: boolean,
};

class MoveReadyCounter extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      secondsToStart: 3,
      startAnimationState: true,
    };
  }

  counterInterval = setInterval(() => {
    this.setState({
      secondsToStart: this.state.secondsToStart - 1,
    });
  }, 1000);

  animationInterval = setInterval(() => {
    this.setState({
      startAnimationState: !this.state.startAnimationState,
    });
  }, 500);

  componentWillUnmount() {
    clearInterval(this.counterInterval);
    clearInterval(this.animationInterval);
  }

  render() {
    const { secondsToStart, startAnimationState } = this.state;

    return (
      <Spring
        from={{
          opacity: startAnimationState ? 0 : 1,
        }}
        to={{
          opacity: startAnimationState ? 1 : 0,
        }}
      >
        {({ opacity }) => {
          return (
            <div
              className={classNames(style.secondsPopup)}
              style={{
                opacity,
              }}
            >
              {secondsToStart}
            </div>
          );
        }}
      </Spring>
    );
  }
}

export default MoveReadyCounter;
