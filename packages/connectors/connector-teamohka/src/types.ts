import { z } from 'zod';

export const githubConfigGuard = z.object({
  clientSecret: z.string(),
});

export type GithubConfig = z.infer<typeof githubConfigGuard>;

export const accessTokenResponseGuard = z.object({
  access_token: z.string(),
  scope: z.string(),
  token_type: z.string(),
});

export const authorizationCallbackErrorGuard = z.object({
  error: z.string(),
  error_description: z.string(),
  error_uri: z.string(),
});

export const authResponseGuard = z.object({ code: z.string() });
