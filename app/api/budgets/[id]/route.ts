import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Budget from '@/models/Budget';

function getIdFromRequest(request: NextRequest) {
  return request.nextUrl.pathname.split('/').pop();
}

export async function GET(request: NextRequest) {
  const id = getIdFromRequest(request);
  try {
    await dbConnect();
    const budget = await Budget.findById(id);
    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    return NextResponse.json(budget);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch budget' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const id = getIdFromRequest(request);
  try {
    await dbConnect();
    const body = await request.json();
    if (body.month) {
      const monthMatch = body.month.match(/^\d{4}-\d{2}$/);
      if (!monthMatch) {
        return NextResponse.json(
          { error: 'Invalid month format. Use YYYY-MM format' },
          { status: 400 }
        );
      }
      const year = parseInt(body.month.split('-')[0]);
      body.year = year;
    }
    const budget = await Budget.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    return NextResponse.json(budget);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const id = getIdFromRequest(request);
  try {
    await dbConnect();
    const budget = await Budget.findByIdAndDelete(id);
    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 });
  }
} 