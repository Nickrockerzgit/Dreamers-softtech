import { useState, useEffect } from "react";
import { statsApi } from "../api/dashboardApi";

export interface SiteStats {
  projectsCompleted: number;
  happyClients: number;
  yearsExperience: number;
  satisfactionRate: number;
  teamMembersCount: number;
  technologiesCount: number;
}

const DEFAULT_STATS: SiteStats = {
  projectsCompleted: 0,
  happyClients: 0,
  yearsExperience: 1,
  satisfactionRate: 98,
  teamMembersCount: 0,
  technologiesCount: 0,
};

// Module-level cache so multiple components share one fetch
let cachedStats: SiteStats | null = null;
let fetchPromise: Promise<SiteStats> | null = null;

const fetchStats = (): Promise<SiteStats> => {
  if (cachedStats) return Promise.resolve(cachedStats);
  if (fetchPromise) return fetchPromise;

  fetchPromise = statsApi
    .getPublicStats()
    .then((res) => {
      cachedStats = res.data.data as SiteStats;
      return cachedStats;
    })
    .catch(() => DEFAULT_STATS)
    .finally(() => {
      fetchPromise = null;
    });

  return fetchPromise;
};

export const usePublicStats = () => {
  const [stats, setStats] = useState<SiteStats>(cachedStats ?? DEFAULT_STATS);
  const [loading, setLoading] = useState(!cachedStats);

  useEffect(() => {
    if (cachedStats) {
      setStats(cachedStats);
      setLoading(false);
      return;
    }
    fetchStats().then((s) => {
      setStats(s);
      setLoading(false);
    });
  }, []);

  return { stats, loading };
};
