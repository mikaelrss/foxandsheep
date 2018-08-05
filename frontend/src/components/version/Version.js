import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

const GET_VERSION = gql`
  {
    version
  }
`;

const Version = (props: Props) => {
  return (
    <Query query={GET_VERSION}>
      {({ loading, error, data }) => {
        console.log(loading, error, data);
        if (loading) {
          return <span>loading...</span>;
        }
        console.log(data);
        return <div>version {data.version}</div>;
      }}
    </Query>
  );
};

export default Version;
