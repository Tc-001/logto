import type {
  GetAuthorizationUri,
  GetUserInfo,
  SocialConnector,
  CreateConnector,
  GetConnectorConfig,
} from '@logto/connector-kit';
import {
  ConnectorError,
  ConnectorErrorCodes,
  validateConfig,
  ConnectorType,
} from '@logto/connector-kit';
import * as jose from 'jose';

import { authorizationEndpoint, defaultMetadata } from './constant.js';
import { authorizationCallbackErrorGuard, githubConfigGuard, authResponseGuard } from './types.js';

type User = {
  name: string;
  email: string;
  forum: string;
  host: string;
  ip: string;
  adm: boolean;
  exp: number;
};

const getAuthorizationUri =
  (getConfig: GetConnectorConfig): GetAuthorizationUri =>
  async ({ state, redirectUri }) => {
    const config = await getConfig(defaultMetadata.id);
    validateConfig(config, githubConfigGuard);
    const queryParameters = new URLSearchParams({
      logto: '1',
      redirect_uri: redirectUri,
      state,
    });

    return `${authorizationEndpoint}?${queryParameters.toString()}`;
  };

const authorizationCallbackHandler = async (parameterObject: unknown) => {
  const result = authResponseGuard.safeParse(parameterObject);

  console.log('CALLBACK OK', result);

  if (result.success) {
    console.log('CALLBACK DATA', result.data);
    return result.data;
  }

  const parsedError = authorizationCallbackErrorGuard.safeParse(parameterObject);

  if (!parsedError.success) {
    throw new ConnectorError(ConnectorErrorCodes.General, JSON.stringify(parameterObject));
  }

  const { error, error_description, error_uri } = parsedError.data;

  if (error === 'access_denied') {
    throw new ConnectorError(ConnectorErrorCodes.AuthorizationFailed, error_description);
  }

  throw new ConnectorError(ConnectorErrorCodes.General, {
    error,
    errorDescription: error_description,
    error_uri,
  });
};

const getUserInfo =
  (getConfig: GetConnectorConfig): GetUserInfo =>
  async (data) => {
    const { code } = await authorizationCallbackHandler(data);

    console.log('USERINFO CODE', code);

    const config = await getConfig(defaultMetadata.id);
    validateConfig(config, githubConfigGuard);

    const { clientSecret: client_secret } = config;
    const secret = jose.base64url.decode(client_secret);

    try {
      const resp = await jose.jwtVerify<User>(code, secret);
      const { payload } = resp;

      console.log('DECODE OK', payload);

      return {
        id: payload.forum,
        name: payload.name,
        email: payload.forum + '@forum.ohkaspace.com',
        username: payload.forum,
      };
    } catch (error: unknown) {
      console.error(error);
      throw new ConnectorError(ConnectorErrorCodes.InvalidResponse);
    }
  };

const createOhkaConnector: CreateConnector<SocialConnector> = async ({ getConfig }) => {
  return {
    metadata: defaultMetadata,
    type: ConnectorType.Social,
    configGuard: githubConfigGuard,
    getAuthorizationUri: getAuthorizationUri(getConfig),
    getUserInfo: getUserInfo(getConfig),
  };
};

export default createOhkaConnector;
