import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as userActions from 'app/auth/store/actions';
import {bindActionCreators} from 'redux';
import * as Actions from 'app/store/actions';
import jwtService from 'app/services/jwtService';
import FadakAPIService from 'app/services/fadakAPIService';

class Auth extends Component {
    /*eslint-disable-next-line no-useless-constructor*/
    constructor(props)
    {
        super(props);
        /**
         * The custom authentication service which is written
         * specially for fadak project
         */
        this.fadakAPIAuth();
    }

    fadakAPIAuth = () => {
        FadakAPIService.on('autoLogin', () => {
            if(this.props.user.data.dataLoaded)
                return;
            FadakAPIService.getUserData().then(data => {
                this.props.setUserData(data);
            }).catch(error => {
                console.error(error);
            });
        });
        FadakAPIService.init();
    }

    jwtCheck = () => {
        jwtService.on('onAutoLogin', () => {

            this.props.showMessage({message: 'Logging in with JWT'});

            /**
             * Sign in and retrieve user data from Api
             */
            jwtService.signInWithToken()
                .then(user => {
                    this.props.setUserData(user);

                    this.props.showMessage({message: 'Logged in with JWT'});
                })
                .catch(error => {
                    this.props.showMessage({message: error});
                })
        });

        jwtService.on('onAutoLogout', (message) => {
            if ( message )
            {
                this.props.showMessage({message});
            }
            this.props.logout();
        });

        jwtService.init();
    };

    render()
    {
        const {children} = this.props;

        return (
            <React.Fragment>
                {children}
            </React.Fragment>
        );
    }
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
            logout             : userActions.logoutUser,
            setUserData        : userActions.setUserData,
            setUserDataAuth0   : userActions.setUserDataAuth0,
            setUserDataFirebase: userActions.setUserDataFirebase,
            showMessage        : Actions.setAlertContent,
        },
        dispatch);
}

function mapStateToProps(state) {
    return {
        user: state.auth.user
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
