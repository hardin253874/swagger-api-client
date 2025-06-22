// API Request/Response types
export interface ApiRequest {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: string;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  data: any;
  headers: Record<string, string>;
  duration: number;
}

// Common types
export interface HttpMethod {
  value: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  label: string;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  method: HttpMethod['value'];
  path: string;
  description?: string;
}

// BIM API Configuration
export interface BimApiItem {
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  requestBody?: string; // JSON file path under assets/request
}