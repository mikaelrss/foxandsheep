import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { Route } from 'react-router-dom';
import { InMemoryCache } from 'apollo-cache-inmemory/lib';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { PersistGate } from 'redux-persist/es/integration/react';
import 'react-toastify/dist/ReactToastify.css';

import { persistStore } from 'redux-persist';

import rootReducer from '../../redux/Reducers';

import RootContainer from '../RootContainer';

const cache = new InMemoryCache({
  dataIdFromObject: o => o.id,
});

const httpLink = new HttpLink({
  uri: '/graphql',
  credentials: 'same-origin',
});

const client = new ApolloClient({
  link: httpLink,
  cache,
  connectToDevTools: true,
});

let composeEnhancers;

const development = process.env.NODE_ENV === 'development';
if (development) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line no-underscore-dangle
} else {
  composeEnhancers = compose;
}

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
if (module.hot && development) {
  module.hot.accept('../..//redux/Reducers.js', () => {
    const nextRootReducer = rootReducer.default;
    store.replaceReducer(nextRootReducer);
  });
}
const persistor = persistStore(store);

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <PersistGate loading={<span />} persistor={persistor}>
          <BrowserRouter>
            <Route path="/" component={RootContainer} />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </ApolloProvider>
  );
};

export default App;
