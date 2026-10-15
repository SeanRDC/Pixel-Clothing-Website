import { NextResponse } from 'next/server';
import connectMongo from '../../../lib/mongodb';
import Item from '../../../models/Item';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectMongo();
    // lean() skips Mongoose document hydration; only send the fields the shop uses.
    const items = await Item.find({}, { _id: 0, __v: 0 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    console.error("CRITICAL MONGODB ERROR:", error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}
