import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Version from './version/Version';
import Game from './game/Game';

import style from './RootContainer.css';

const RootContainer = () => {
  return (
    <div className={style.container}>
      <Switch>
        <Route path="/version" component={Version} />
        <Route path="/game" component={Game} />
      </Switch>
    </div>
  );
};

export default RootContainer;
