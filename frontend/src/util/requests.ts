import axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';
import history from './history';
import jwtDecode  from 'jwt-decode';
export const BASE_URL=process.env.REACT_APP_BACKEND_URL ?? 'http://localhost:8080';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID ?? 'dscatalog';
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET ?? 'dscatalog123';

const basicheader  = ()  =>  'Basic ' + window.btoa(CLIENT_ID + ':' + CLIENT_SECRET);

type Role = 'ROLE_OPERATOR' | 'ROLE_ADMIN';

export type TokenData = {
    exp: number;
    user_name:string;
    authorities: Role[];
}
type LoginResponse = {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
    userFirstName: string;
    userId: number
}
type LoginData = {
    username: string;
    password: string;
}
const tokenKey = 'authData';

export const requestBackendLogin = ( loginData: LoginData ) =>{
    const headers ={
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: basicheader()
    }
    const data = qs.stringify({
        ...loginData,
        grant_type: 'password'
    })
    return axios( { method: 'POST', baseURL: BASE_URL, url: '/oauth/token' , data, headers });
}
export const requestBackend = ( config: AxiosRequestConfig) =>{
    const headers = config.withCredentials ? {
            ...config.headers,
            Authorization: "Bearer " + getAuthData().access_token
    } : config.headers;
    return axios( {...config, baseURL: BASE_URL, headers});
}

export const saveAuthData= ( obj: LoginResponse) =>{

    localStorage.setItem( tokenKey, JSON.stringify( obj ));
}
export const getAuthData= () =>{

    const str = localStorage.getItem( tokenKey) ?? "{}";
    // A função JSON.parse converte um strng em um objeto.
    return ( JSON.parse( str) as LoginResponse) ;
}
//// intercepstors  : https://github.com/axios/axios#interceptors
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    console.log( 'interceptors antes da requisição');
    return config;
  }, function (error) {
    // Do something with request error
    console.log( 'ERROR !!!! interceptors antes da requisição');
    return Promise.reject(error);
  });

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log( 'interceptors COM SUCESSO.');

    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log( 'interceptors COM FALHA!!!');
    if( error.response.status === 401 || error.response.status === 403){
        console.log( error.response.status);
        history.push('/admin/auth/login');
    }
    return Promise.reject(error);
  });
  export const getTokenData = () : TokenData | undefined => {
      const LoginResponse = getAuthData();
      try {
        return jwtDecode ( LoginResponse.access_token) as TokenData;
      }
      catch ( error ) {
          return undefined;
      }
  }
export const removeAuthData = () => {
    localStorage.removeItem(tokenKey);
}
  export const isAuthenticated = () : boolean =>{

    const tokenData = getTokenData();
    return (tokenData && tokenData.exp * 1000 > Date.now() ? true : false);
  }

  // essa era a antiga com for, a nova ficou com roles.some. Fica como exemplo. 
  export const hasAnyRolesOld = ( roles: Role[]) : boolean => {
      if(roles.length === 0){
          return true;
      }
      const tokenData = getTokenData();
      if ( tokenData !== undefined){
          for( var i = 0 ; i < roles.length; i++){
              if ( tokenData.authorities.includes( roles[i])){
                  return true;
            }
          }
      }
      return false;
  }

  export const hasAnyRoles = ( roles: Role[]) : boolean => {
    if(roles.length === 0){
        return true;
    }
    const tokenData = getTokenData();
    if ( tokenData !== undefined){
        return (roles.some( role =>tokenData.authorities.includes( role)));
    }
    return false;
 
}