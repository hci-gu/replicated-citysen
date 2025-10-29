export type EnsureDatabaseUrlOptions = {
  preferDirectConnection?: boolean;
  setShadowDatabaseUrl?: boolean;
};

export type ResolvedDatabaseUrlInfo = {
  key: string;
  value: string;
};

export declare const ensureDatabaseUrl: (
  options?: EnsureDatabaseUrlOptions
) => string | null;

export declare const getResolvedDatabaseUrlInfo: () => ResolvedDatabaseUrlInfo | null;

export declare const isLikelyPooledDatabaseUrl: (
  databaseUrl: string,
  info?: ResolvedDatabaseUrlInfo | null
) => boolean;
