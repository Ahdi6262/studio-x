
import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import type { Collection } from 'mongodb';

interface ActivityLog {
  _id?: string; // Optional because MongoDB driver adds it
  user_uid: string;
  event_type: string;
  event_data: Record<string, any>;
  timestamp: Date;
}

export async function GET() {
  try {
    const activityLogsCollection: Collection<ActivityLog> = await getCollection('user_activity_logs');
    
    // Example: Add a new log
    await activityLogsCollection.insertOne({
      user_uid: 'test_user_123',
      event_type: 'api_mongo_example_access',
      event_data: { message: 'MongoDB API example accessed' },
      timestamp: new Date(),
    });

    // Example: Fetch last 5 logs for a user
    const logs = await activityLogsCollection
      .find({ user_uid: 'test_user_123' })
      .sort({ timestamp: -1 })
      .limit(5)
      .toArray();

    return NextResponse.json({ message: 'MongoDB example executed successfully', logs }, { status: 200 });
  } catch (error: any) {
    console.error('MongoDB API example error:', error);
    return NextResponse.json({ message: 'Failed to interact with MongoDB', error: error.message }, { status: 500 });
  }
}
