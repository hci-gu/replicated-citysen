let lastResolution = null;

const recordResolution = (entry) => {
  lastResolution = entry ?? null;
};

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
    recordResolution({ key: "DATABASE_URL", value: existing });

    if (preferDirectConnection && directFallback && directFallback.value !== existing) {
      const pooledUrl = process.env.POSTGRES_URL;

      if (!pooledUrl || pooledUrl === existing) {
        process.env.DATABASE_URL = directFallback.value;

        recordResolution(directFallback);

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
    recordResolution(null);
    return null;
  }

  process.env.DATABASE_URL = fallbackResult.value;

  recordResolution(fallbackResult);

  if (setShadowDatabaseUrl) {
    assignShadowDatabaseUrl();
  }

  return fallbackResult.value;
};

const pooledSourceKeys = new Set(["POSTGRES_URL"]);

const normalizeProtocol = (databaseUrl) =>
  databaseUrl.replace(/^postgresql:/i, "postgres:");

export const getResolvedDatabaseUrlInfo = () => lastResolution;

export const isLikelyPooledDatabaseUrl = (databaseUrl, info = lastResolution) => {
  if (!databaseUrl) {
    return false;
  }

  if (info && pooledSourceKeys.has(info.key)) {
    return true;
  }

  try {
    const parsed = new URL(normalizeProtocol(databaseUrl));
    const hostname = parsed.hostname.toLowerCase();
    const port = parsed.port;
    const pgbouncerParam = parsed.searchParams.get("pgbouncer");

    if (hostname.includes("pooler") || hostname.includes("pgbouncer")) {
      return true;
    }

    if (pgbouncerParam && ["1", "true", "yes", "on"].includes(pgbouncerParam.toLowerCase())) {
      return true;
    }

    if (port && ["6543", "6432"].includes(port)) {
      return true;
    }
  } catch (error) {
    // Ignore URL parsing errors and fall back to substring detection below.
  }

  const lower = databaseUrl.toLowerCase();
  return lower.includes("pooler") || lower.includes("pgbouncer");
};
