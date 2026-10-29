/**
 * Global Type Declarations for Vercel Serverless Functions
 * Menyediakan deklarasi modul '@vercel/node' secara global
 * sehingga IDE / TypeScript tidak akan pernah error "Cannot find module '@vercel/node'"
 */

declare module '@vercel/node' {
  export interface VercelRequest {
    method?: string;
    body?: any;
    query?: Record<string, string | string[]>;
    headers?: Record<string, string | string[] | undefined>;
    cookies?: Record<string, string>;
    url?: string;
  }

  export interface VercelResponse {
    status: (statusCode: number) => VercelResponse;
    json: (jsonBody: any) => VercelResponse;
    send: (body: any) => VercelResponse;
    setHeader: (name: string, value: string | string[]) => VercelResponse;
    end: (chunk?: any) => void;
  }

  export type VercelApiHandler = (
    req: VercelRequest,
    res: VercelResponse
  ) => void | Promise<void>;
}

