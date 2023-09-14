export function createSuccesResponse(data: any, message?: string) {
  return {
    success: true,
    data,
    message,
  };
}
