
import { NextResponse, type NextRequest } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import type { Collection } from 'mongodb';

interface ActivityLog {
  _id?: string;
  user_uid: string;
  event_type: string;
  event_data: Record<string, any>;
  timestamp: Date;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) : 10; // Default limit 10

  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    const activityLogsCollection: Collection<ActivityLog> = await getCollection('user_activity_logs');
    
    const logs = await activityLogsCollection
      .find({ user_uid: userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();

    // Map to the expected structure for dashboard recommendations flow
    const formattedLogs = logs.map(log => ({
        type: log.event_type,
        data: log.event_data,
        timestamp: log.timestamp.toISOString(), // Ensure ISO string format
    }));

    return NextResponse.json(formattedLogs, { status: 200 });
  } catch (error: any) {
    console.error(`API Error fetching activity events for user ${userId}:`, error);
    return NextResponse.json({ message: 'Failed to fetch activity events', error: error.message }, { status: 500 });
  }
}

// POST method to add activity events (example)
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
   if (!userId) {
    return NextResponse.json({ message: 'User ID is required in path' }, { status: 400 });
  }
  try {
    const body = await request.json();
    const { event_type, event_data } = body;

    if (!event_type || !event_data) {
      return NextResponse.json({ message: 'event_type and event_data are required' }, { status: 400 });
    }

    const activityLogsCollection: Collection<ActivityLog> = await getCollection('user_activity_logs');
    const newLog: ActivityLog = {
      user_uid: userId,
      event_type,
      event_data,
      timestamp: new Date(),
    };
    const result = await activityLogsCollection.insertOne(newLog);

    return NextResponse.json({ message: 'Activity event logged', insertedId: result.insertedId }, { status: 201 });
  } catch (error: any) {
    console.error(`API Error logging activity event for user ${userId}:`, error);
    return NextResponse.json({ message: 'Failed to log activity event', error: error.message }, { status: 500 });
  }
}
