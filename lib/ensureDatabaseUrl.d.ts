export type EnsureDatabaseUrlOptions = {
  preferDirectConnection?: boolean;
  setShadowDatabaseUrl?: boolean;
};

export declare const ensureDatabaseUrl: (
  options?: EnsureDatabaseUrlOptions
) => string | null;
