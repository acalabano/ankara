import React from 'react';
import BoardContainer from './Board/BoardContainer';
import FooterContainer from './Footer/FooterContainer';
import { connect } from 'react-redux'
import {
  firebaseConnect,
  isLoaded,
  isEmpty,
  dataToJS
} from 'react-redux-firebase'
import { fbDB, fbAuth } from '../firebase';
import { settingUser } from '../redux/action-creators/user';
import ModalRootContainer from './Modal/ModalRootContainer';
import { connectToSession } from '../routes/lobby';

// PLUGIN required for Material-UI. Provides an onTouchTap() event handler.
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class AppContainer extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const gamesRef = this.props.gamesRef;
    console.log('gamesRef is', gamesRef);
    const currentUserId = this.props.user.uid;

    return (
      gamesRef ?
      <MuiThemeProvider>
        <div id="app-container">
          <h3>Constantinople</h3>
          <BoardContainer />
          <FooterContainer />
          <ModalRootContainer />
        </div>
      </MuiThemeProvider>
      :
      <h3>Loading...</h3>
    );
  }
}

const fbGameWrappedContainer = firebaseConnect(({ gameId }) => {
  return [`games/${gameId}`];
})(AppContainer);

const mapStateToProps = (state) => ({
  user: state.user.user,
  gameId: state.game.id,
  firebase: state.firebase,
  gamesRef: dataToJS(state.firebase, 'games')
})

export default connect(mapStateToProps)(fbGameWrappedContainer)
