import { NextResponse } from 'next/server';
import { db } from '@/db';
import { alertSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// GET - Fetch all alert settings
export async function GET() {
  try {
    const alerts = await db.select().from(alertSettings);

    // If no alerts exist, create defaults
    if (alerts.length === 0) {
      const defaults = [
        { name: 'cpu', enabled: true, threshold: 90 },
        { name: 'ram', enabled: true, threshold: 85 },
        { name: 'disk', enabled: true, threshold: 90 },
      ];

      for (const alert of defaults) {
        await db.insert(alertSettings).values(alert);
      }

      const newAlerts = await db.select().from(alertSettings);
      return NextResponse.json(newAlerts);
    }

    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

// PUT - Update alert setting
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { name, enabled, threshold } = body;

    await db
      .update(alertSettings)
      .set({ enabled, threshold })
      .where(eq(alertSettings.name, name));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating alert:', error);
    return NextResponse.json(
      { error: 'Failed to update alert' },
      { status: 500 }
    );
  }
}
