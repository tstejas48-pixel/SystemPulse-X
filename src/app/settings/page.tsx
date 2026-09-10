'use client';

import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Activity, ArrowLeft, Bell, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Alert {
  id: number;
  name: string;
  enabled: boolean;
  threshold: number;
}

export default function SettingsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/alerts');
      const data = await res.json();
      setAlerts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setLoading(false);
    }
  };

  const updateAlert = async (name: string, enabled: boolean, threshold: number) => {
    try {
      await fetch('/api/alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, enabled, threshold }),
      });
      fetchAlerts();
    } catch (error) {
      console.error('Error updating alert:', error);
    }
  };

  const cleanOldData = async (days: number) => {
    if (!confirm(`Delete data older than ${days} days?`)) return;
    
    try {
      await fetch(`/api/system/history?days=${days}`, {
        method: 'DELETE',
      });
      alert('Old data cleaned successfully!');
    } catch (error) {
      console.error('Error cleaning data:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-700 dark:bg-gray-800/80">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="rounded-lg border border-gray-300 bg-white p-2 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </Link>
              <Activity className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* Alert Settings */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-6 flex items-center gap-3">
            <Bell className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Alert Thresholds</h2>
          </div>

          <div className="space-y-6">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div className="flex-1">
                  <h3 className="font-medium capitalize text-gray-900 dark:text-white">{alert.name} Usage</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Alert when {alert.name} exceeds threshold
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">Threshold:</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={alert.threshold}
                      onChange={(e) => updateAlert(alert.name, alert.enabled, Number(e.target.value))}
                      className="w-20 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">%</span>
                  </div>

                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={alert.enabled}
                      onChange={(e) => updateAlert(alert.name, e.target.checked, alert.threshold)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-500 peer-checked:after:translate-x-full dark:bg-gray-700"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Management */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-6 flex items-center gap-3">
            <Trash2 className="h-6 w-6 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Data Management</h2>
          </div>

          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Clean up old historical data to save database space.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => cleanOldData(7)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
            >
              Delete data older than 7 days
            </button>
            <button
              onClick={() => cleanOldData(30)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
            >
              Delete data older than 30 days
            </button>
            <button
              onClick={() => cleanOldData(90)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
            >
              Delete data older than 90 days
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
