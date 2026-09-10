'use client';

import { useEffect, useState } from 'react';
import { MetricCard } from '@/components/MetricCard';
import { SystemChart } from '@/components/SystemChart';
import { ProcessTable } from '@/components/ProcessTable';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AlertBadge } from '@/components/AlertBadge';
import { 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Network, 
  Activity,
  Download,
  Settings as SettingsIcon,
  RefreshCw,
  Thermometer,
  Info,
} from 'lucide-react';
import Link from 'next/link';

interface SystemData {
  cpu: {
    percent: number;
    cores: number;
    model: string;
    speed: number;
  };
  memory: {
    percent: number;
    used: number;
    total: number;
    available: number;
  };
  disk: {
    percent: number;
    used: number;
    total: number;
  };
  network: {
    download: number;
    upload: number;
  };
  temperature: number | null;
  timestamp: string;
}

interface Process {
  pid: number;
  name: string;
  cpu: number;
  mem: number;
  memUsage: number;
}

interface Alert {
  id: number;
  name: string;
  enabled: boolean;
  threshold: number;
}

export default function Dashboard() {
  const [systemData, setSystemData] = useState<SystemData | null>(null);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<string[]>([]);
  const [refreshRate, setRefreshRate] = useState(2000);
  const [isRecording, setIsRecording] = useState(false);

  // Fetch current system data
  const fetchSystemData = async () => {
    try {
      const res = await fetch('/api/system/current');
      const data = await res.json();
      setSystemData(data);
      checkAlerts(data);
    } catch (error) {
      console.error('Error fetching system data:', error);
    }
  };

  // Fetch processes
  const fetchProcesses = async () => {
    try {
      const res = await fetch('/api/system/processes?limit=10&sortBy=mem');
      const data = await res.json();
      setProcesses(data.processes || []);
    } catch (error) {
      console.error('Error fetching processes:', error);
    }
  };

  // Fetch historical data
  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/system/history?minutes=5');
      const data = await res.json();
      setHistory(data.readings || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  // Fetch alert settings
  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/alerts');
      const data = await res.json();
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  // Save current reading to database
  const saveReading = async () => {
    try {
      await fetch('/api/system/history', { method: 'POST' });
    } catch (error) {
      console.error('Error saving reading:', error);
    }
  };

  // Export data
  const exportData = async () => {
    try {
      const res = await fetch('/api/export?hours=24');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `systempulse-${Date.now()}.csv`;
      a.click();
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  // Check for alerts
  const checkAlerts = (data: SystemData) => {
    const triggered: string[] = [];
    
    alerts.forEach(alert => {
      if (!alert.enabled) return;

      if (alert.name === 'cpu' && data.cpu.percent > alert.threshold) {
        triggered.push(`CPU usage at ${data.cpu.percent.toFixed(1)}%`);
      }
      if (alert.name === 'ram' && data.memory.percent > alert.threshold) {
        triggered.push(`RAM usage at ${data.memory.percent.toFixed(1)}%`);
      }
      if (alert.name === 'disk' && data.disk.percent > alert.threshold) {
        triggered.push(`Disk usage at ${data.disk.percent.toFixed(1)}%`);
      }
    });

    setActiveAlerts(triggered);
  };

  // Get color based on percentage
  const getColor = (percent: number): 'green' | 'yellow' | 'red' => {
    if (percent < 70) return 'green';
    if (percent < 85) return 'yellow';
    return 'red';
  };

  useEffect(() => {
    fetchSystemData();
    fetchProcesses();
    fetchHistory();
    fetchAlerts();

    const interval = setInterval(() => {
      fetchSystemData();
      fetchProcesses();
      if (isRecording) {
        saveReading();
      }
    }, refreshRate);

    const historyInterval = setInterval(() => {
      fetchHistory();
    }, 10000); // Update history every 10 seconds

    return () => {
      clearInterval(interval);
      clearInterval(historyInterval);
    };
  }, [refreshRate, isRecording]);

  if (!systemData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          <span className="text-xl font-semibold text-gray-900 dark:text-white">Loading SystemPulse...</span>
        </div>
      </div>
    );
  }

  const cpuHistory = history.map(r => ({ timestamp: r.timestamp, value: r.cpuPercent }));
  const ramHistory = history.map(r => ({ timestamp: r.timestamp, value: r.ramPercent }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-700 dark:bg-gray-800/80">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SystemPulse</h1>
              <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                Live
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={refreshRate}
                onChange={(e) => setRefreshRate(Number(e.target.value))}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value={500}>0.5s</option>
                <option value={1000}>1s</option>
                <option value={2000}>2s</option>
                <option value={5000}>5s</option>
              </select>

              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  isRecording
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isRecording ? '⏹ Stop Recording' : '⏺ Start Recording'}
              </button>

              <button
                onClick={exportData}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>

              <Link
                href="/settings"
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              >
                <SettingsIcon className="h-4 w-4" />
                Settings
              </Link>

              <Link
                href="/about"
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              >
                <Info className="h-4 w-4" />
                About
              </Link>

              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-6 py-3">
            <div className="flex flex-wrap gap-2">
              {activeAlerts.map((alert, i) => (
                <AlertBadge key={i} message={alert} type={alert.includes('90') ? 'critical' : 'warning'} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* System Info */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">System Information</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">{systemData.cpu.model}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {systemData.cpu.cores} Cores @ {systemData.cpu.speed} GHz
          </p>
        </div>

        {/* Metric Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="CPU Usage"
            value={`${systemData.cpu.percent.toFixed(1)}%`}
            subtitle={`${systemData.cpu.cores} cores`}
            icon={<Cpu className="h-6 w-6 text-blue-500" />}
            color={getColor(systemData.cpu.percent)}
            progress={systemData.cpu.percent}
          />

          <MetricCard
            title="RAM Usage"
            value={`${systemData.memory.percent.toFixed(1)}%`}
            subtitle={`${systemData.memory.used.toFixed(1)} / ${systemData.memory.total.toFixed(1)} GB`}
            icon={<MemoryStick className="h-6 w-6 text-purple-500" />}
            color={getColor(systemData.memory.percent)}
            progress={systemData.memory.percent}
          />

          <MetricCard
            title="Disk Usage"
            value={`${systemData.disk.percent.toFixed(1)}%`}
            subtitle={`${systemData.disk.used.toFixed(1)} / ${systemData.disk.total.toFixed(1)} GB`}
            icon={<HardDrive className="h-6 w-6 text-orange-500" />}
            color={getColor(systemData.disk.percent)}
            progress={systemData.disk.percent}
          />

          <MetricCard
            title="Network"
            value={`↓ ${systemData.network.download.toFixed(2)} MB/s`}
            subtitle={`↑ ${systemData.network.upload.toFixed(2)} MB/s`}
            icon={<Network className="h-6 w-6 text-green-500" />}
            color="blue"
          />
        </div>

        {/* Temperature */}
        {systemData.temperature && (
          <div className="mb-8">
            <MetricCard
              title="CPU Temperature"
              value={`${systemData.temperature.toFixed(1)}°C`}
              icon={<Thermometer className="h-6 w-6 text-red-500" />}
              color={systemData.temperature > 80 ? 'red' : systemData.temperature > 70 ? 'yellow' : 'green'}
              progress={(systemData.temperature / 100) * 100}
            />
          </div>
        )}

        {/* Charts */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">CPU History (5 min)</h3>
            <div className="h-64">
              <SystemChart data={cpuHistory} label="CPU" color="#3b82f6" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">RAM History (5 min)</h3>
            <div className="h-64">
              <SystemChart data={ramHistory} label="RAM" color="#a855f7" />
            </div>
          </div>
        </div>

        {/* Process Table */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Top Processes by Memory</h3>
          <ProcessTable processes={processes} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-700 dark:bg-gray-800/80">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            SystemPulse © 2024 • Real-time System Monitoring Dashboard
          </p>
        </div>
      </footer>
    </div>
  );
}
