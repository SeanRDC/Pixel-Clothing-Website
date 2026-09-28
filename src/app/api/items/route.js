import { NextResponse } from 'next/server';
import connectMongo from '../../../lib/mongodb';
import Item from '../../../models/Item';

export async function GET() {
  try {
    await connectMongo();
    const items = await Item.find({});
    return NextResponse.json(items);
  } catch (error) {
    console.error("CRITICAL MONGODB ERROR:", error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}