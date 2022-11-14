export interface AppConfig {
  env: string;
  port: number;

  cache_ttl?: number;
  cache_max?: number;

  redis_enabled: boolean;
  redis_url?: string;
}
