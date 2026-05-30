import { NextRequest, NextResponse } from 'next/server';
import { createPuzzle } from '@/lib/sudoku/generator';
import { Difficulty } from '@/types/sudoku';

const VALID_DIFFICULTIES: Difficulty[] = ['easy', 'normal', 'hard', 'expert'];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const diff = searchParams.get('difficulty') as Difficulty | null;

  if (!diff || !VALID_DIFFICULTIES.includes(diff)) {
    return NextResponse.json(
      { error: 'difficulty must be one of: easy, normal, hard, expert' },
      { status: 400 }
    );
  }

  const puzzle = createPuzzle(diff);
  return NextResponse.json(puzzle);
}
