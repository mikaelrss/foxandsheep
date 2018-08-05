// @flow

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Version from './version/Version';
import Game from './game/Game';

import style from './RootContainer.css';

const RootContainer = () => {
  return (
    <div className={style.container}>
      <div className={style.content}>
        <Switch>
          <Route path="/version" component={Version} />
          <Route path="/" render={props => <Game rowNumber={10} cellNumber={10} {...props} />} />
        </Switch>
      </div>
    </div>
  );
};

export default RootContainer;
