import React, { ChangeEvent } from 'react';
import classes from './ProfileInfo.module.css';

type PropsType = {
  status: string
  updateStatus: (status: string) => void
}

type StateType = {
  editMode: boolean
  status: string
}

class ProfileStatus extends React.Component<PropsType, StateType> {
  state = {
    editMode: false,
    status: this.props.status
  }

  activateEditMode() {
    this.setState({ editMode: true });
  }

  deactivateEditMode() {
    this.setState({ editMode: false });
    this.props.updateStatus(this.state.status);
  }

  onStatusChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ status: e.currentTarget.value });
  }

  componentDidUpdate(prevProps: PropsType, prevState: StateType) {
    if (prevProps.status !== this.props.status) {
      this.setState({ status: this.props.status });
    }
  }

  render() {
    return <div>
      {!this.state.editMode &&
        <div className={classes.statusBlock}>
          <span onDoubleClick={this.activateEditMode.bind(this)}>{this.props.status || "No status"}</span>
        </div>
      }
      {this.state.editMode &&
        <div>
          <input autoFocus={true} onBlur={this.deactivateEditMode.bind(this)} value={this.state.status} onChange={this.onStatusChange.bind(this)} />
        </div>
      }
    </div>
  }
}

export default ProfileStatus;