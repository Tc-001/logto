import type { ConnectorMetadata } from '@logto/connector-kit';
import { ConnectorPlatform, ConnectorConfigFormItemType } from '@logto/connector-kit';

export const authorizationEndpoint = 'https://ohkaspace.com/ohkabots/api/v2/api3login.php';
export const scope = 'read:user';
export const accessTokenEndpoint = 'https://example.com';
export const userInfoEndpoint = 'https://example.com';

export const defaultMetadata: ConnectorMetadata = {
  id: 'teamohka',
  target: 'phpbb',
  platform: ConnectorPlatform.Universal,
  name: {
    en: 'Ohkaspace',
    'zh-CN': 'Ohkaspace',
    'tr-TR': 'Ohkaspace',
    ko: 'Ohkaspace',
  },
  logo: './logo.svg',
  logoDark: './logo-dark.svg',
  description: {
    en: 'Custom login for the PHPBB-based forum.',
  },
  readme: './README.md',
  formItems: [
    {
      key: 'clientSecret',
      type: ConnectorConfigFormItemType.Text,
      label: 'Client Secret',
      required: true,
      placeholder: '<client-secret>',
    },
  ],
};

export const defaultTimeout = 5000;
