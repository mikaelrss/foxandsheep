// @flow

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Version from './version/Version';

import style from './RootContainer.css';
import Lobby from './lobby/Lobby';

const RootContainer = () => {
  return (
    <div className={style.container}>
      <div className={style.content}>
        <Switch>
          <Route path="/version" component={Version} />
          <Route path="/" component={Lobby} />
        </Switch>
      </div>
    </div>
  );
};

export default RootContainer;
