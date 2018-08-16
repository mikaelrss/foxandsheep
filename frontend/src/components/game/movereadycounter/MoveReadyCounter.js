// @flow

import React, { Component } from 'react';

type Props = {};

type State = {
  secondsToStart: number,
};

class MoveReadyCounter extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      secondsToStart: 3,
    };
  }

  timerInterval = setInterval(() => {
    this.setState({
      secondsToStart: this.state.secondsToStart - 1,
    });
    console.log("UHTUH", this.state);
  }, 1000);

  componentWillUnmount() {
    clearInterval(this.timerInterval)
  }

  render() {
    return <div />;
  }
}

export default MoveReadyCounter;
