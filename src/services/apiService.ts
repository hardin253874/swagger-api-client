import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { ApiRequest, ApiResponse } from '../types';
import config from '../config';

export class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = config.apiHost) {
    this.baseUrl = baseUrl;
  }

  async makeRequest(request: ApiRequest): Promise<ApiResponse> {
    const startTime = Date.now();
    
    try {
      const config: AxiosRequestConfig = {
        method: request.method,
        url: `${this.baseUrl}${request.url}`,
        headers: {
          'Content-Type': 'application/json',
          ...request.headers,
        },
      };

      if (request.body && request.method !== 'GET') {
        config.data = request.body;
      }

      const response: AxiosResponse = await axios(config);
      const duration = Date.now() - startTime;

      return {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers as Record<string, string>,
        duration,
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      if (error.response) {
        // Server responded with error status
        return {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers as Record<string, string>,
          duration,
        };
      } else {
        // Network error or other issue
        return {
          status: 0,
          statusText: 'Network Error',
          data: { error: error.message },
          headers: {},
          duration,
        };
      }
    }
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }
}

const apiService = new ApiService();
export default apiService;