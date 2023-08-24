export const removeKey = <T>(key: string, { [key]: _, ...rest }) => rest as T;
