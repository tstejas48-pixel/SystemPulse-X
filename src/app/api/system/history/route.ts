import { NextResponse } from 'next/server';
import { db } from '@/db';
import { systemReadings } from '@/db/schema';
import { desc, gte, sql } from 'drizzle-orm';
import si from 'systeminformation';

export const dynamic = 'force-dynamic';

// GET - Fetch historical data
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const minutes = parseInt(searchParams.get('minutes') || '60');

    const timeAgo = new Date(Date.now() - minutes * 60 * 1000);

    const readings = await db
      .select()
      .from(systemReadings)
      .where(gte(systemReadings.timestamp, timeAgo))
      .orderBy(desc(systemReadings.timestamp))
      .limit(1000);

    return NextResponse.json({
      readings: readings.reverse(), // Oldest first for charts
      count: readings.length,
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}

// POST - Save current reading
export async function POST() {
  try {
    const [cpu, mem, disk, network, currentLoad, cpuTemp] = await Promise.all([
      si.cpu(),
      si.mem(),
      si.fsSize(),
      si.networkStats(),
      si.currentLoad(),
      si.cpuTemperature(),
    ]);

    const networkSpeed = network[0] || { rx_sec: 0, tx_sec: 0 };
    const primaryDisk = disk.find(d => d.mount === '/' || d.mount === 'C:') || disk[0] || {
      size: 0,
      used: 0,
      use: 0,
    };

    const reading = {
      cpuPercent: Math.round(currentLoad.currentLoad * 10) / 10,
      ramPercent: Math.round((mem.used / mem.total) * 1000) / 10,
      ramUsed: Math.round(mem.used / 1024 / 1024 / 1024 * 10) / 10,
      ramTotal: Math.round(mem.total / 1024 / 1024 / 1024 * 10) / 10,
      diskPercent: Math.round(primaryDisk.use * 10) / 10,
      diskUsed: Math.round(primaryDisk.used / 1024 / 1024 / 1024 * 10) / 10,
      diskTotal: Math.round(primaryDisk.size / 1024 / 1024 / 1024 * 10) / 10,
      networkDown: Math.round(networkSpeed.rx_sec / 1024 / 1024 * 10) / 10,
      networkUp: Math.round(networkSpeed.tx_sec / 1024 / 1024 * 10) / 10,
      cpuTemp: cpuTemp.main || null,
    };

    await db.insert(systemReadings).values(reading);

    return NextResponse.json({ success: true, reading });
  } catch (error) {
    console.error('Error saving reading:', error);
    return NextResponse.json(
      { error: 'Failed to save reading' },
      { status: 500 }
    );
  }
}

// DELETE - Clean old readings (older than X days)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');

    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const result = await db
      .delete(systemReadings)
      .where(sql`${systemReadings.timestamp} < ${cutoffDate}`);

    return NextResponse.json({ success: true, deleted: result.rowCount || 0 });
  } catch (error) {
    console.error('Error deleting old readings:', error);
    return NextResponse.json(
      { error: 'Failed to delete old readings' },
      { status: 500 }
    );
  }
}
