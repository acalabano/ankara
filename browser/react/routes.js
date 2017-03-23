import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { fbAuth, googleProvider, facebookProvider } from '../firebase';
import { firebaseConnect, dataToJS } from 'react-redux-firebase';

/** Importing components and containers */
import AppContainer from './AppContainer';
import LobbyContainer from './Lobby/LobbyContainer';

/** Importing action-creators */
import { loadBoard } from '../redux/action-creators/board';

/** onEnter handlers */
const onLobbyEnter = () => {

}


/** Routes */
const Root = ({ loadGameBoard }) => {
  return (
      <Router history={hashHistory}>
        <Route path="/" component={LobbyContainer} onEnter={onLobbyEnter}/>
        <Route path="/game" component={AppContainer} onEnter={loadGameBoard}/>
      </Router>
  );
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadGameBoard: () => dispatch(loadBoard())
});

export default connect(null, mapDispatchToProps)(Root);
