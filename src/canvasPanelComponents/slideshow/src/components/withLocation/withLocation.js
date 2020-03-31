import React from 'react';
import { Location } from '@reach/router';
import queryString from 'query-string';

const withLocation = ComponentToWrap => props => (
  <Location>
    {({ location }) => {
      return (
        <ComponentToWrap
          {...props}
          search={location.search ? queryString.parse(location.search) : {}}
          hash={location.hash ? queryString.parse(location.hash) : ''}
        />
      );
    }}
  </Location>
);

export default withLocation;
