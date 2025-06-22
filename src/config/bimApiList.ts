import { BimApiItem } from '../types';

export const bimApiList: BimApiItem[] = [
  {
    name: 'Carport API Endpoint Health Check',
    url: '/',
    method: 'GET'
  },
  {
    name: 'Save Unencrypted Carport Model',
    url: '/savemodel_unenc',
    method: 'POST',
    requestBody: 'carport_save_unenc.json'
  },
  {
    name: 'Shed API Endpoint Health Check',
    url: '/shed',
    method: 'GET'
  },
  {
    name: 'Save Unencrypted Shed Model',
    url: '/shed/saveshed_unenc',
    method: 'POST',
    requestBody: 'shed_save_unenc.json'
  }
  // ... other APIs
];

export default bimApiList;