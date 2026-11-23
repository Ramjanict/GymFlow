const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<{
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: string;
}> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('gymflow_token') : null;
  const activeOrgId = typeof window !== 'undefined' ? localStorage.getItem('gymflow_org_id') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (activeOrgId) {
    headers['X-Organization-Id'] = activeOrgId;
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.message || 'An error occurred during request',
      };
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network error occurred',
    };
  }
}
