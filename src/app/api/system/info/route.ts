import { NextResponse } from 'next/server';
import si from 'systeminformation';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [system, os, cpu, mem, disk] = await Promise.all([
      si.system(),
      si.osInfo(),
      si.cpu(),
      si.mem(),
      si.fsSize(),
    ]);

    const primaryDisk = disk.find(d => d.mount === '/' || d.mount === 'C:') || disk[0];

    const info = {
      system: {
        manufacturer: system.manufacturer,
        model: system.model,
        version: system.version,
        serial: system.serial || 'N/A',
      },
      os: {
        platform: os.platform,
        distro: os.distro,
        release: os.release,
        arch: os.arch,
        hostname: os.hostname,
      },
      cpu: {
        manufacturer: cpu.manufacturer,
        brand: cpu.brand,
        speed: cpu.speed,
        cores: cpu.cores,
        physicalCores: cpu.physicalCores,
        processors: cpu.processors,
      },
      memory: {
        total: Math.round(mem.total / 1024 / 1024 / 1024 * 10) / 10, // GB
      },
      disk: {
        fs: primaryDisk?.fs || 'N/A',
        type: primaryDisk?.type || 'N/A',
        mount: primaryDisk?.mount || 'N/A',
        total: Math.round((primaryDisk?.size || 0) / 1024 / 1024 / 1024 * 10) / 10, // GB
      },
    };

    return NextResponse.json(info);
  } catch (error) {
    console.error('Error fetching system info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system info' },
      { status: 500 }
    );
  }
}
