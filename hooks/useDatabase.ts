'use client';

import { useMemo } from 'react';
import { useSql } from '@/components/providers/SqlProvider';

export function useDatabase() {
  const { db } = useSql();

  const exec = (sql: string, params?: any[]) => {
    if (!db) return [];
    return db.exec(sql, params);
  };

  const query = <T = any>(sql: string, params?: any[]): T[] => {
    if (!db) return [] as T[];
    const res = db.exec(sql, params);
    if (!res || res.length === 0) return [] as T[];
    const { columns, values } = res[0];
    return values.map((row: any[]) => Object.fromEntries(row.map((v, i) => [columns[i], v])) as T);
  };

  return useMemo(() => ({ db, exec, query }), [db]);
}


