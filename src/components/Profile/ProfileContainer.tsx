import React from 'react';
import Profile from './Profile';
import { connect } from 'react-redux';
import { getStatus, getUserProfile, savePhoto, saveProfile, updateStatus } from '../../redux/profile-reducer';
import { NavigateFunction, useLocation, useNavigate, useParams } from "react-router-dom";
import { withAuthRedirect } from '../../hoc/withAuthRedirect';
import { compose } from 'redux';
import { AppStateType } from '../../redux/redux-store';
import { ProfileType } from '../../types/types';

type MapPropsType = ReturnType<typeof mapStateToProps>

type DispatchPropsType = {
  getUserProfile: (userId: number) => void
  getStatus: (userId: number) => void
  updateStatus: (status: string) => void
  savePhoto: (file: File) => void
  saveProfile: (profile: ProfileType) => Promise<any>
}

type withRouterProps = {
  router: {
    location: Location;
    navigate: NavigateFunction;
    params: Record<"userId", string | undefined>;
  };
}

// export function withRouter(Children) {
//   return (props) => {

//     const match = { params: useParams() };
//     return <Children {...props} match={match} />
//   }
// }

export function withRouter<WCP extends object>(Component: React.ComponentType<WCP>) {
  return (props: WCP) => {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return (
      <Component {...props} router={{ location, navigate, params }} />
    );
  }
}

type PropsType = MapPropsType & DispatchPropsType & withRouterProps;

class ProfileContainer extends React.Component<PropsType> {

  refreshProfile() {
    let userId: string | number | null | undefined = this.props.router.params.userId;
    if (!userId) {
      userId = this.props.authorizedUserId;
      if (!userId) {
        this.props.router.navigate("/login");
        return;
      }
    }
    if (!userId) {
      throw new Error("UserId should exist in URI params or in state ('authorizedUserId')");
    } else {
      this.props.getUserProfile(Number(userId));
      this.props.getStatus(Number(userId));
    }
  }

  componentDidMount() {
    this.refreshProfile();
  }

  componentDidUpdate(prevProps: PropsType) {
    if (this.props.router.params.userId !== prevProps.router.params.userId) {
      this.refreshProfile();
    }
  }

  render() {
    return <div>
      <Profile {...this.props}
        isOwner={!this.props.router.params.userId}
        profile={this.props.profile}
        status={this.props.status}
        updateStatus={this.props.updateStatus}
        savePhoto={this.props.savePhoto}
        saveProfile={this.props.saveProfile}
      />
    </div>
  }
}

const mapStateToProps = (state: AppStateType) => ({
  profile: state.profilePage.profile,
  status: state.profilePage.status,
  authorizedUserId: state.auth.userId,
  isAuth: state.auth.isAuth
});

export default compose<React.ComponentType>(
  connect(mapStateToProps, { getUserProfile, getStatus, updateStatus, savePhoto, saveProfile }),
  withRouter,
  withAuthRedirect
)(ProfileContainer);