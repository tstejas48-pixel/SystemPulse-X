import { NextResponse } from 'next/server';
import si from 'systeminformation';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'mem'; // 'cpu' or 'mem'

    const processes = await si.processes();
    
    // Sort and limit processes
    const sorted = processes.list
      .sort((a, b) => {
        if (sortBy === 'cpu') {
          return (b.cpu || 0) - (a.cpu || 0);
        }
        return (b.mem || 0) - (a.mem || 0);
      })
      .slice(0, limit)
      .map(p => ({
        pid: p.pid,
        name: p.name,
        cpu: Math.round((p.cpu || 0) * 10) / 10,
        mem: Math.round((p.mem || 0) * 10) / 10,
        memUsage: Math.round((p.memRss || 0) / 1024 / 1024 * 10) / 10, // MB
      }));

    return NextResponse.json({
      processes: sorted,
      total: processes.all,
      running: processes.running,
      blocked: processes.blocked,
    });
  } catch (error) {
    console.error('Error fetching processes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch processes' },
      { status: 500 }
    );
  }
}
