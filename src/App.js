import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

const initialState = {
  byId: {
    1: { id: 1, name: 'Item 1' },
    2: { id: 2, name: 'Item 2' },
    3: { id: 3, name: 'Item 3' },
    4: { id: 4, name: 'Item 4' },
    5: { id: 5, name: 'Item 5' },
  },
  allIds: [1, 2, 3, 4, 5]
};

const byId = (state = initialState.byId, { action, type }) => state;

const moveDown = payload => ({ payload, type: 'MOVE_DOWN' });

const moveUp = payload => ({ payload, type: 'MOVE_UP' });

const allIds = (state = initialState.allIds, { payload, type }) => {
  switch (type) {
    case 'MOVE_DOWN': {
      const id = payload;
      const index = state.indexOf(id);

      if (index === state.length - 1) {
        return state;
      }

      const nextIndex = index + 1;
      const nextId = state[nextIndex];
      const beforeIds = state.slice(0, index);
      const afterIds = state.slice(nextIndex + 1);

      return [
        ...beforeIds,
        nextId,
        id,
        ...afterIds,
      ];
    }
    case 'MOVE_UP': {
      const id = payload;
      const index = state.indexOf(id);

      if (index === 0) {
        return state;
      }

      const previousIndex = index - 1;
      const previousId = state[previousIndex];
      const beforeIds = state.slice(0, previousIndex);
      const afterIds = state.slice(index + 1);

      return [
        ...beforeIds,
        id,
        previousId,
        ...afterIds,
      ];
    }
    default:
      return state;
  }
}

const reducer = combineReducers({ allIds, byId });

const store = createStore(reducer);

class ListItem extends Component {
  onClickMoveUp = () => this.props.moveUp(this.props.item.id)

  onClickMoveDown = () => this.props.moveDown(this.props.item.id)

  render() {
    const { item: { name } } = this.props;

    return (
      <div>
        <h2>{name}</h2>
        <button onClick={this.onClickMoveUp}>Move Up</button>
        <button onClick={this.onClickMoveDown}>Move Down</button>
        <p>Rendered at {new Date().toString()}</p>
      </div>
    );
  }
}

const ListItemContainer = connect(
  ({ byId }, { itemId }) => ({ item: byId[itemId] }),
  { moveDown, moveUp },
)(ListItem);

const List = ({ listItemIds }) => (
  <div>
    {listItemIds.map(id => (
      <ListItemContainer key={id} itemId={id} />
    ))}
  </div>
);

const ListContainer = connect(
  ({ allIds: listItemIds }) => ({ listItemIds }),
)(List);

export default () => (
  <Provider store={store}>
    <ListContainer />
  </Provider>
);
