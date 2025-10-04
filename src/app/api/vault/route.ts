// src/app/api/vault/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import VaultItem from '@/models/VaultItem';

// GET all vault items for the logged-in user
export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  await dbConnect();
  const items = await VaultItem.find({ userId });
  return NextResponse.json(items);
}

// POST a new vault item for the logged-in user
export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  const body = await request.json();
  await dbConnect();
  const newItem = new VaultItem({ ...body, userId });
  await newItem.save();
  return NextResponse.json(newItem, { status: 201 });
}