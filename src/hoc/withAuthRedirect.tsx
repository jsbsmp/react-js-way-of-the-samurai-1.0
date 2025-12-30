import React from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { AppStateType } from "../redux/redux-store";

const mapStateToPropsForRedirect = (state: AppStateType) => ({
    isAuth: state.auth.isAuth
});

type MapPropsType = {
    isAuth: boolean
}

type DispatchPropsType = {
}

export function withAuthRedirect<WCP extends {}>(WrappedComponent: React.ComponentType<WCP>) {

    const RedirectComponent: React.FC<WCP & MapPropsType> = (props) => {
        let { isAuth, ...restProps } = props
        if (!props.isAuth) return <Navigate to={'/login'} />
        return <WrappedComponent  {...restProps as unknown as WCP} />
    }

    let ConnectedAuthRedirectComponent = connect<MapPropsType, DispatchPropsType, WCP, AppStateType>(mapStateToPropsForRedirect, {})(RedirectComponent as React.ComponentType<any>)
   
    return ConnectedAuthRedirectComponent;
}