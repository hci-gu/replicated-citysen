export const ensureDatabaseUrl = () => {
  const existing = process.env.DATABASE_URL;
  if (existing && existing.length > 0) {
    return existing;
  }

  const fallback =
    process.env.POSTGRES_PRISMA_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_URL_NON_POOLING ??
    null;

  if (fallback) {
    process.env.DATABASE_URL = fallback;
    return fallback;
  }

  return null;
};
