import React from "react";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { Route } from "react-router-dom";
import { InMemoryCache } from "apollo-cache-inmemory/lib";
import { BrowserRouter } from "react-router-dom";
import RootContainer from "../RootContainer";

const cache = new InMemoryCache({
  dataIdFromObject: o => o.id
});

const httpLink = new HttpLink({
  uri: "/graphql",
  credentials: "same-origin"
});

const client = new ApolloClient({
  link: httpLink,
  cache,
  connectToDevTools: true
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Route path="/" component={RootContainer} />
      </BrowserRouter>
    </ApolloProvider>
  );
};

export default App;
