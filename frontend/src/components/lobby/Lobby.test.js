import React from 'react';
import { shallow } from 'enzyme';

import Lobby from './Lobby';

describe('', () => {
  it('shall match snapshot', () => {
    const wrapper = shallow(<Lobby />);

    expect(wrapper).toMatchSnapshot();
  });

  it('shall fail', () => {
    expect(false).toBe(true);
  });
});
