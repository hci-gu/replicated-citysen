const resolveFromKeys = (keys) => {
  for (const key of keys) {
    const value = process.env[key];
    if (value && value.length > 0) {
      return { key, value };
    }
  }

  return null;
};

const assignShadowDatabaseUrl = () => {
  const shadow = resolveFromKeys([
    "POSTGRES_SHADOW_URL",
    "POSTGRES_URL_NON_POOLING",
    "POSTGRES_PRISMA_URL"
  ]);

  if (shadow && !process.env.SHADOW_DATABASE_URL) {
    process.env.SHADOW_DATABASE_URL = shadow.value;
  }
};

export const ensureDatabaseUrl = (options = {}) => {
  const { preferDirectConnection = false, setShadowDatabaseUrl = false } = options;

  const existing = process.env.DATABASE_URL;
  if (existing && existing.length > 0) {
    if (setShadowDatabaseUrl) {
      assignShadowDatabaseUrl();
    }

    return existing;
  }

  const fallbackResult = resolveFromKeys(
    preferDirectConnection
      ? ["POSTGRES_PRISMA_URL", "POSTGRES_URL_NON_POOLING"]
      : ["POSTGRES_PRISMA_URL", "POSTGRES_URL", "POSTGRES_URL_NON_POOLING"]
  );

  if (!fallbackResult) {
    return null;
  }

  process.env.DATABASE_URL = fallbackResult.value;

  if (setShadowDatabaseUrl) {
    assignShadowDatabaseUrl();
  }

  return fallbackResult.value;
};
