import { NextResponse } from 'next/server';
import { db } from '@/db';
import { systemReadings } from '@/db/schema';
import { gte, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hours = parseInt(searchParams.get('hours') || '24');

    const timeAgo = new Date(Date.now() - hours * 60 * 60 * 1000);

    const readings = await db
      .select()
      .from(systemReadings)
      .where(gte(systemReadings.timestamp, timeAgo))
      .orderBy(desc(systemReadings.timestamp));

    // Generate CSV
    const headers = [
      'Timestamp',
      'CPU (%)',
      'RAM (%)',
      'RAM Used (GB)',
      'RAM Total (GB)',
      'Disk (%)',
      'Disk Used (GB)',
      'Disk Total (GB)',
      'Network Down (MB/s)',
      'Network Up (MB/s)',
      'CPU Temp (°C)',
    ];

    const rows = readings.map(r => [
      new Date(r.timestamp).toISOString(),
      r.cpuPercent,
      r.ramPercent,
      r.ramUsed,
      r.ramTotal,
      r.diskPercent,
      r.diskUsed,
      r.diskTotal,
      r.networkDown,
      r.networkUp,
      r.cpuTemp || 'N/A',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="systempulse-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
