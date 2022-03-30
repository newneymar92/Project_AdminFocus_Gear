import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import { ILoginParams } from '../../../models/auth';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../../../redux/reducer';
import { Action } from 'redux';
import { fetchThunk } from '../../common/redux/thunk';
import { API_PATHS } from '../../../configs/api';
import { RESPONSE_STATUS_SUCCESS } from '../../../utils/httpResponseCode';
import { setUserInfo } from '../redux/authReducer';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN_KEY } from '../../../utils/constants';
import { ROUTES } from '../../../configs/routes';
import { replace } from 'connected-react-router';


const LoginPage = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const onLogin = React.useCallback(
    async (values: ILoginParams) => {
      const json = await dispatch(
        fetchThunk(API_PATHS.signIn, 'post', { email: values.email, password: values.password }),
      );
      if (json?.success === true) {
        // dispatch(setUserInfo(json.data));
        Cookies.set(ACCESS_TOKEN_KEY, json.user_cookie, { expires: values.rememberMe ? 7 : undefined });
        dispatch(replace(ROUTES.productPage));
        return;
      }
    },
    [dispatch],
  );

  return (
     <LoginForm onLogin={onLogin}/>
  );
};

export default LoginPage;
