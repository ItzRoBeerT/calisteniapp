import { EXERCISES_VERSION } from '@/lib/exercises-version';

export async function GET() {
	return Response.json({ version: EXERCISES_VERSION });
}
