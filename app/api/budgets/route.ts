import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Budget from '@/models/Budget';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    let query: any = {};
    if (month && year) {
      query.month = `${year}-${month.padStart(2, '0')}`;
    } else if (year) {
      query.year = parseInt(year);
    }

    const budgets = await Budget.find(query).sort({ category: 1 });
    return NextResponse.json(budgets);
  } catch (error) {
    console.error('Error in GET /api/budgets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budgets', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Validate month format
    const monthMatch = body.month.match(/^\d{4}-\d{2}$/);
    if (!monthMatch) {
      return NextResponse.json(
        { error: 'Invalid month format. Use YYYY-MM format' },
        { status: 400 }
      );
    }

    // Extract year from month
    const year = parseInt(body.month.split('-')[0]);
    
    const budget = await Budget.create({
      ...body,
      year
    });
    
    return NextResponse.json(budget, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/budgets:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Budget already exists for this category and month' },
        { status: 409 }
      );
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create budget', details: error.message },
      { status: 500 }
    );
  }
} 