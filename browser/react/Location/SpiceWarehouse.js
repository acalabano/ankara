/* eslint react/prop-types: 0 */

import React from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import { dataToJS } from 'react-redux-firebase';

import Modal from '../Modal/Modal';

import { loadModal, hideModal } from '../../redux/action-creators/modals';
import { actionMaxGood } from '../../routes/location';
import { endTurn } from '../../routes/move';
import { whichDialog, merchantOnLocation, mapCoordToLocation, merchantCount } from '../../utils';

class SpiceWarehouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMaxGoodEndTurn = this.handleMaxGoodEndTurn.bind(this);
    this.whichDialog = whichDialog.bind(this);
    this.handleAssistant = this.handleAssistant.bind(this);
    this.handleMerchant = this.handleMerchant.bind(this);
    this.handleEndTurn = this.handleEndTurn.bind(this);
  }

  // Assistant dialogs
  handleAssistant() {
    const { playerId, currentPosition, merchants } = this.props;
    // handle assistant here

    this.props.closeModal();

    if (merchantOnLocation(playerId, currentPosition, merchants)) {
      let numMerchants = merchantCount(playerId, currentPosition, merchants);
      this.props.openModal(
        mapCoordToLocation(currentPosition),
        {
          currentPosition: currentPosition,
          dialog: 'merchant_encounter' // sends to handleMerchant() below
        }
      );
    } else {
      this.props.openModal(mapCoordToLocation(this.props.currentPosition), { currentPosition: this.props.currentPosition, dialog: 'action' });
    }
  }

  // Merchant dialogs
  handleMerchant() {
    const { currentPosition } = this.props;
    // handle merchant encounter here

    this.props.closeModal();
    this.props.openModal(
      mapCoordToLocation(currentPosition),
      {
        currentPosition: currentPosition, dialog: 'action' // sends to renderAction() below
      }
    );
  }

  // Ends Turn
  handleEndTurn() {
    endTurn(this.props.gameId, this.props.playerId)
      .then(() => this.props.closeModal())
      .catch(console.error);
  }

  handleMaxGoodEndTurn(){
    actionMaxGood(this.props.gameId, this.props.playerId, this.props.goodType)
      .then(() => endTurn(this.props.gameId, this.props.playerId))
      .then(() => this.props.closeModal())
  }

  render() {
    const onClose = this.props.payload.zoom ? this.props.closeModal : null;

    return (
      <Modal onClose={onClose}>
        <div id="location-modal-container">
          <img src={`images/locations/spice_warehouse.jpg`} id="img-location" />
          { this.whichDialog(this.props.payload) }
        </div>
      </Modal>
    );
  }

  renderAction() {
    const style = { margin: 12 };
    return (
      <div id="turn-dialog-half">
        <div id="text-box">
          <p>Look at all the spices! <br /><br />Your wheelbarrow is now fully loaded with spices.<br />Come back later if you need more! <br /></p>
        </div>
        <div>
          <RaisedButton label="Max spice and end turn" style={style} primary={true} onTouchTap={this.handleMaxGoodEndTurn}  />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  gameId: state.game.id,
  playerId: state.user.user.uid,
  payload: state.modal.payload,
  goodType: 'spice',
  currentPosition: state.modal.payload.currentPosition,
  merchants: dataToJS(state.firebase, `games/${state.game.id}/merchants`)
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(hideModal()),
  openModal: (modalType, payload) => dispatch(loadModal(modalType, payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(SpiceWarehouse);
