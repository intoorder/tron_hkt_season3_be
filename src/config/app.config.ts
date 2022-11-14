const _env = process.env;

const appConfig = () => ({
  env: _env.ENV ?? "test",
  port: Number(_env.PORT ?? 8000),

  cache_ttl: Number(_env.CACHE_TTL), // in seconds, e.g. ~1h
  cache_max: Number(_env.CACHE_MAX), // max of items, e.g. 1000

  redis_enabled: Boolean(_env.REDIS_ENABLED),
  redis_url: _env.REDIS_URL,
  jwt_secret: _env.JWT_SECRET!,
  jwt_expires_in: _env.JWT_EXPIRES_IN!,
  jwt_issuer: _env.JWT_ISSUER!,
  pk_secret: _env.PK_SECRET ?? "",
});

export default appConfig;
