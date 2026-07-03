import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const body = await req.json();
	const { name, description, muscle_group, category, type, difficulty, equipment, locale } = body;

	if (!name?.trim()) {
		return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
	}

	const supabase = await createClient();

	if (!supabase) {
		return NextResponse.json({ error: 'Servicio no disponible' }, { status: 503 });
	}

	const { data: { user } } = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: 'Autenticación requerida' }, { status: 401 });
	}

	const { error } = await supabase.from('exercise_requests').insert({
		name: name.trim(),
		description: description?.trim() || null,
		muscle_group: muscle_group ?? [],
		category: category || null,
		type: type || null,
		difficulty: difficulty != null ? Number(difficulty) : null,
		equipment: equipment ?? [],
		locale: locale ?? null,
		user_id: user?.id ?? null,
	});

	if (error) {
		console.error('[exercise_requests] insert error:', error);
		return NextResponse.json({ error: 'Error al guardar la solicitud' }, { status: 500 });
	}

	return NextResponse.json({ ok: true }, { status: 201 });
}
