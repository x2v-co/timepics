import { NextRequest, NextResponse } from 'next/server';
import {
  generateParadoxTopic,
  generateTopicBatch,
  getRandomTemplate,
  getAllPredefinedTopics,
  getTopicsByCategory,
  type ParadoxTopic,
  type ParadoxCategory
} from '@/lib/paradoxEngine';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'random';
    const category = searchParams.get('category') as ParadoxCategory | null;
    const count = parseInt(searchParams.get('count') || '5');

    switch (action) {
      case 'random':
        const randomTopic = getRandomTemplate();
        return NextResponse.json(randomTopic);

      case 'all':
        const allTopics = getAllPredefinedTopics();
        return NextResponse.json({ topics: allTopics, count: allTopics.length });

      case 'category':
        if (!category) {
          return NextResponse.json({ error: 'Category required' }, { status: 400 });
        }
        const categoryTopics = getTopicsByCategory(category);
        return NextResponse.json({ topics: categoryTopics, category, count: categoryTopics.length });

      case 'batch':
        const batchTopics = await generateTopicBatch(Math.min(count, 10), category ? [category] : undefined);
        return NextResponse.json({ topics: batchTopics, count: batchTopics.length });

      case 'generate':
        // Use LLM to generate a new topic
        const newTopic = await generateParadoxTopic(category || undefined);
        return NextResponse.json(newTopic);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Paradox API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate paradox topic' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, count = 3 } = body;

    const topics = await generateTopicBatch(Math.min(count, 10), category);
    return NextResponse.json({ topics, count: topics.length });
  } catch (error) {
    console.error('Paradox batch error:', error);
    return NextResponse.json(
      { error: 'Failed to generate topics batch' },
      { status: 500 }
    );
  }
}
