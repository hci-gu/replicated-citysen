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

  const directFallback = resolveFromKeys(["POSTGRES_PRISMA_URL", "POSTGRES_URL_NON_POOLING"]);
  const generalFallback = resolveFromKeys([
    "POSTGRES_PRISMA_URL",
    "POSTGRES_URL",
    "POSTGRES_URL_NON_POOLING"
  ]);

  if (existing && existing.length > 0) {
    if (preferDirectConnection && directFallback && directFallback.value !== existing) {
      const pooledUrl = process.env.POSTGRES_URL;

      if (!pooledUrl || pooledUrl === existing) {
        process.env.DATABASE_URL = directFallback.value;

        if (setShadowDatabaseUrl) {
          assignShadowDatabaseUrl();
        }

        return directFallback.value;
      }
    }

    if (setShadowDatabaseUrl) {
      assignShadowDatabaseUrl();
    }

    return existing;
  }

  const fallbackResult = preferDirectConnection && directFallback ? directFallback : generalFallback;

  if (!fallbackResult) {
    return null;
  }

  process.env.DATABASE_URL = fallbackResult.value;

  if (setShadowDatabaseUrl) {
    assignShadowDatabaseUrl();
  }

  return fallbackResult.value;
};
