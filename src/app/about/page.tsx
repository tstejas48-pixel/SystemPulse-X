'use client';

import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Activity, ArrowLeft, Info, Server, Cpu, HardDrive, Monitor } from 'lucide-react';
import Link from 'next/link';

interface SystemInfo {
  system: {
    manufacturer: string;
    model: string;
    version: string;
    serial: string;
  };
  os: {
    platform: string;
    distro: string;
    release: string;
    arch: string;
    hostname: string;
  };
  cpu: {
    manufacturer: string;
    brand: string;
    speed: number;
    cores: number;
    physicalCores: number;
    processors: number;
  };
  memory: {
    total: number;
  };
  disk: {
    fs: string;
    type: string;
    mount: string;
    total: number;
  };
}

export default function AboutPage() {
  const [info, setInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemInfo();
  }, []);

  const fetchSystemInfo = async () => {
    try {
      const res = await fetch('/api/system/info');
      const data = await res.json();
      setInfo(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching system info:', error);
      setLoading(false);
    }
  };

  if (loading || !info) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Loading system information...</p>
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">About</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* Application Info */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-6 flex items-center gap-3">
            <Info className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">SystemPulse</h2>
          </div>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            A professional real-time system monitoring dashboard built with Next.js, PostgreSQL, and modern web technologies.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Version:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">1.0.0</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Framework:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">Next.js 16.2</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Database:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">PostgreSQL</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">License:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">MIT</span>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-6 flex items-center gap-3">
            <Server className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">System Information</h2>
          </div>
          <div className="space-y-4">
            <InfoRow label="Manufacturer" value={info.system.manufacturer} />
            <InfoRow label="Model" value={info.system.model} />
            <InfoRow label="Hostname" value={info.os.hostname} />
            <InfoRow label="Platform" value={`${info.os.distro} ${info.os.release}`} />
            <InfoRow label="Architecture" value={info.os.arch} />
          </div>
        </div>

        {/* CPU Information */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-6 flex items-center gap-3">
            <Cpu className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">CPU</h2>
          </div>
          <div className="space-y-4">
            <InfoRow label="Manufacturer" value={info.cpu.manufacturer} />
            <InfoRow label="Brand" value={info.cpu.brand} />
            <InfoRow label="Speed" value={`${info.cpu.speed} GHz`} />
            <InfoRow label="Cores" value={`${info.cpu.cores} (${info.cpu.physicalCores} physical)`} />
            <InfoRow label="Processors" value={info.cpu.processors.toString()} />
          </div>
        </div>

        {/* Memory & Storage */}
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center gap-3">
              <Monitor className="h-6 w-6 text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Memory</h2>
            </div>
            <InfoRow label="Total RAM" value={`${info.memory.total} GB`} />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center gap-3">
              <HardDrive className="h-6 w-6 text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Storage</h2>
            </div>
            <div className="space-y-4">
              <InfoRow label="Filesystem" value={info.disk.fs} />
              <InfoRow label="Mount" value={info.disk.mount} />
              <InfoRow label="Total" value={`${info.disk.total} GB`} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
      <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <span className="text-gray-600 dark:text-gray-400">{value}</span>
    </div>
  );
}
