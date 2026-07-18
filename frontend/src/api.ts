const API_URL = 'http://localhost:3000';

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

export async function apiRequest<T>(
  path: string,
  accessToken: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorData = data as ApiErrorResponse | null;

    let message = 'No fue posible completar la solicitud.';

    if (Array.isArray(errorData?.message)) {
      message = errorData.message.join(' ');
    } else if (typeof errorData?.message === 'string') {
      message = errorData.message;
    }

    throw new Error(message);
  }

  return data as T;
}