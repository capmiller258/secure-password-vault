// src/app/api/vault/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import VaultItem from '@/models/VaultItem';

// PUT (Update) a specific vault item
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = request.headers.get('x-user-id');
  const { id } = params;
  const body = await request.json();
  await dbConnect();

  const updatedItem = await VaultItem.findOneAndUpdate(
    { _id: id, userId }, // Ensure the item belongs to the user
    body,
    { new: true }
  );

  if (!updatedItem) {
    return NextResponse.json({ message: 'Item not found or user unauthorized' }, { status: 404 });
  }
  return NextResponse.json(updatedItem);
}

// DELETE a specific vault item
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = request.headers.get('x-user-id');
  const { id } = params;
  await dbConnect();

  const deletedItem = await VaultItem.findOneAndDelete({ _id: id, userId });

  if (!deletedItem) {
    return NextResponse.json({ message: 'Item not found or user unauthorized' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Item deleted successfully' });
}