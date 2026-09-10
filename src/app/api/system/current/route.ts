import { NextResponse } from 'next/server';
import si from 'systeminformation';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get current system stats
    const [cpu, mem, disk, network, currentLoad, cpuTemp] = await Promise.all([
      si.cpu(),
      si.mem(),
      si.fsSize(),
      si.networkStats(),
      si.currentLoad(),
      si.cpuTemperature(),
    ]);

    // Calculate network speeds (convert to MB/s)
    const networkSpeed = network[0] || { rx_sec: 0, tx_sec: 0 };
    
    // Get primary disk (first disk or C: drive)
    const primaryDisk = disk.find(d => d.mount === '/' || d.mount === 'C:') || disk[0] || {
      size: 0,
      used: 0,
      use: 0,
    };

    const data = {
      cpu: {
        percent: Math.round(currentLoad.currentLoad * 10) / 10,
        cores: cpu.cores,
        model: cpu.manufacturer + ' ' + cpu.brand,
        speed: cpu.speed,
      },
      memory: {
        percent: Math.round((mem.used / mem.total) * 1000) / 10,
        used: Math.round(mem.used / 1024 / 1024 / 1024 * 10) / 10, // GB
        total: Math.round(mem.total / 1024 / 1024 / 1024 * 10) / 10, // GB
        available: Math.round(mem.available / 1024 / 1024 / 1024 * 10) / 10, // GB
      },
      disk: {
        percent: Math.round(primaryDisk.use * 10) / 10,
        used: Math.round(primaryDisk.used / 1024 / 1024 / 1024 * 10) / 10, // GB
        total: Math.round(primaryDisk.size / 1024 / 1024 / 1024 * 10) / 10, // GB
      },
      network: {
        download: Math.round(networkSpeed.rx_sec / 1024 / 1024 * 10) / 10, // MB/s
        upload: Math.round(networkSpeed.tx_sec / 1024 / 1024 * 10) / 10, // MB/s
      },
      temperature: cpuTemp.main || null,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching system stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system stats' },
      { status: 500 }
    );
  }
}
