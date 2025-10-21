'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type SqlDatabase = any;

interface SqlContextValue {
  db: SqlDatabase | null;
}

const SqlContext = createContext<SqlContextValue>({ db: null });

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function SqlProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<SqlDatabase | null>(null);

  useEffect(() => {
    let disposed = false;
    (async () => {
      const initSqlJs = (await import('sql.js')).default;
      const SQL = await initSqlJs({ locateFile: () => `${basePath}/sql-wasm.wasm` });
      const res = await fetch(`${basePath}/sblgnt.db`);
      const buf = await res.arrayBuffer();
      if (disposed) return;
      const database = new SQL.Database(new Uint8Array(buf));
      setDb(database);
    })();
    return () => {
      disposed = true;
      try { (db as any)?.close?.(); } catch { /* noop */ }
    };
  }, []);

  const value = useMemo(() => ({ db }), [db]);
  return <SqlContext.Provider value={value}>{children}</SqlContext.Provider>;
}

export function useSql() {
  return useContext(SqlContext);
}


