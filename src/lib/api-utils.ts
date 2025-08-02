import { NextResponse } from 'next/server';

/**
 * Standardized API error responses
 */
export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: unknown, context?: string): NextResponse {
  console.error(`API Error${context ? ` in ${context}` : ''}:`, error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}

/**
 * Validate required fields
 */
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): void {
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    throw new ApiError(
      `Missing required fields: ${missingFields.join(', ')}`,
      400,
      'MISSING_FIELDS'
    );
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Create success response
 */
export function createSuccessResponse(
  data: any,
  message?: string,
  status: number = 200
): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    message
  }, { status });
}

/**
 * Create error response
 */
export function createErrorResponse(
  message: string,
  status: number = 400,
  code?: string
): NextResponse {
  return NextResponse.json({
    success: false,
    error: message,
    code
  }, { status });
}

/**
 * Async wrapper for API routes to handle errors
 */
export function withErrorHandling(
  handler: (request: Request, context?: any) => Promise<NextResponse>
) {
  return async (request: Request, context?: any): Promise<NextResponse> => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleApiError(error, handler.name);
    }
  };
}