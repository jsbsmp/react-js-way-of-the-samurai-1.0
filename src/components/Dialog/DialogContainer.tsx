import { compose } from 'redux';
import { withAuthRedirect } from '../../hoc/withAuthRedirect';
import Dialog from './Dialog';
import { connect } from 'react-redux';
import { actions } from '../../redux/dialog-reducer';
import { AppStateType } from '../../redux/redux-store';

let mapStateToProps = (state: AppStateType) => {
  return {
    dialogPage: state.dialogPage
  }
};

export default compose<React.ComponentType>(
  connect(mapStateToProps, { ...actions }),
  withAuthRedirect
)(Dialog);