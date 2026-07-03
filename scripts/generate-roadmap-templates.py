# Genera los INSERT de las plantillas oficiales de roadmaps (issue #28)
# y los añade a supabase/seed.sql. Ejecutar desde la raíz del repo:
#   python3 scripts/generate-roadmap-templates.py
import json

PRIMARY = '#BB86FC'
SOFT = '#9A64D6'

def build_graph(title, steps):
    nodes, edges = [], []
    nodes.append({
        'id': 'title',
        'type': 'title',
        'position': {'x': 40, 'y': -140},
        'style': {'width': 360, 'height': 60},
        'data': {
            'nodeType': 'title', 'label': title, 'fontSize': 30, 'fontWeight': 700,
            'textAlign': 'center',
            'handles': {'top': False, 'bottom': True, 'left': False, 'right': False},
        },
    })
    y = 0
    prev = None
    for i, step in enumerate(steps):
        tid = f'step-{i + 1}'
        nodes.append({
            'id': tid,
            'type': 'topic',
            'position': {'x': 100, 'y': y},
            'style': {'width': 240, 'height': 64},
            'data': {
                'nodeType': 'topic', 'label': step['label'], 'color': PRIMARY,
                'icon': 'none',
                'description': step.get('desc', ''),
                'tips': step.get('tips', ''),
                'handles': {'top': True, 'bottom': True, 'left': True, 'right': True},
            },
        })
        if prev:
            edges.append({
                'id': f'e-{prev}-{tid}', 'source': prev, 'target': tid,
                'type': 'default', 'animated': False,
                'style': {'stroke': PRIMARY, 'strokeWidth': 2},
                'markerEnd': {'type': 'arrowclosed', 'color': PRIMARY},
                'data': {'lineStyle': 'solid', 'arrowStyle': 'forward', 'pathStyle': 'bezier'},
            })
        sy = y - 10
        for j, sub in enumerate(step.get('subs', [])):
            sid = f'{tid}-sub-{j + 1}'
            nodes.append({
                'id': sid,
                'type': 'subtopic',
                'position': {'x': 460, 'y': sy},
                'style': {'width': 200, 'height': 52},
                'data': {
                    'nodeType': 'subtopic', 'label': sub['label'], 'color': SOFT,
                    'icon': 'none',
                    'description': sub.get('desc', ''),
                    'tips': sub.get('tips', ''),
                    'handles': {'top': True, 'bottom': True, 'left': True, 'right': True},
                },
            })
            edges.append({
                'id': f'e-{tid}-{sid}', 'source': tid, 'target': sid,
                'type': 'default', 'animated': False,
                'style': {'stroke': SOFT, 'strokeWidth': 2, 'strokeDasharray': '8 4'},
                'markerEnd': {'type': 'arrowclosed', 'color': SOFT},
                'data': {'lineStyle': 'dashed', 'arrowStyle': 'forward', 'pathStyle': 'bezier'},
            })
            sy += 70
        y += max(170, 40 + 70 * len(step.get('subs', [])) + 60)
        prev = tid
    return nodes, edges


TEMPLATES = [
    {
        'slug': 'progresion-dominadas',
        'title': 'Progresión de Dominadas',
        'description': 'De cero a tus primeras dominadas estrictas: la progresión completa paso a paso, con criterios claros para avanzar de nivel.',
        'category': 'pull',
        'steps': [
            {'label': 'Dead Hang', 'desc': 'Cuélgate de la barra con agarre prono, brazos estirados y cuerpo relajado. Objetivo: aguantar 30-45 segundos con buen agarre.', 'tips': 'Aprieta la barra con toda la mano, no solo con los dedos. Hombros alejados de las orejas.'},
            {'label': 'Retracciones escapulares', 'desc': 'Desde el dead hang, sube y baja el cuerpo unos centímetros moviendo solo las escápulas, con los codos estirados. Objetivo: 3 series de 8.', 'tips': 'Es el movimiento que inicia toda dominada: piensa en "meter los hombros en los bolsillos traseros".'},
            {'label': 'Remo invertido', 'desc': 'Con barra baja o anillas, cuerpo en tabla e inclinado, tira del pecho hacia la barra. Objetivo: 3 series de 10 con el cuerpo recto.', 'tips': 'Cuanto más horizontal el cuerpo, más difícil. Aprieta glúteos y abdomen todo el rato.', 'subs': [
                {'label': 'Remo con pies elevados', 'desc': 'Versión más difícil del remo: pies sobre un cajón para acercarte a la horizontal.'},
            ]},
            {'label': 'Dominadas negativas', 'desc': 'Salta hasta la posición alta (barbilla sobre la barra) y baja lo más lento posible. Objetivo: 5 negativas de 5 segundos.', 'tips': 'Controla especialmente el tramo final: no te "dejes caer" al llegar a brazos estirados.'},
            {'label': 'Dominadas asistidas', 'desc': 'Con banda elástica o pies en apoyo, haz dominadas completas quitando cada semana un poco de ayuda. Objetivo: 3 series de 6 con banda fina.', 'tips': 'Rango completo siempre: de brazos estirados a barbilla sobre la barra.'},
            {'label': 'Primera dominada', 'desc': 'Dominada estricta desde dead hang, sin balanceo ni impulso. ¡El hito!', 'tips': 'Inicia con las escápulas, dirige los codos hacia las costillas y no estires el cuello para "llegar".'},
            {'label': '5 dominadas estrictas', 'desc': 'Consolida la técnica hasta lograr 3 series de 5 dominadas limpias con descansos de 2-3 minutos.', 'tips': 'La técnica primero: mejor 4 perfectas que 6 a medias.', 'subs': [
                {'label': 'Chin-ups', 'desc': 'Agarre supino, algo más fácil y con más bíceps: úsalo para acumular volumen.'},
                {'label': 'Agarre ancho', 'desc': 'Más énfasis en dorsal: introdúcelo cuando domines el agarre normal.'},
            ]},
            {'label': 'Dominadas lastradas', 'desc': 'Añade peso progresivamente (mochila o cinturón) cuando superes 10-12 estrictas. Abre la puerta al muscle-up.', 'tips': 'Sube el lastre de 2,5 en 2,5 kg. El rango completo no se negocia.'},
        ],
    },
    {
        'slug': 'progresion-muscle-up',
        'title': 'Progresión de Muscle-up',
        'description': 'El camino desde dominadas sólidas hasta el muscle-up estricto en barra: fuerza explosiva, transición y fondos.',
        'category': 'pull',
        'steps': [
            {'label': 'Base: 8 dominadas estrictas', 'desc': 'Prerrequisito. Necesitas al menos 8 dominadas estrictas y 8 fondos en paralelas antes de empezar.', 'tips': 'Sin esta base, entrenar el muscle-up solo enseña malos hábitos de kipping.'},
            {'label': 'Dominadas al pecho', 'desc': 'Dominadas explosivas llevando la barra al pecho (chest-to-bar). Objetivo: 3 series de 5.', 'tips': 'Piensa en tirar de la barra "hacia abajo y atrás", no solo hacia ti.'},
            {'label': 'Dominadas altas', 'desc': 'Tira hasta que la barra quede a la altura del esternón o más abajo. Objetivo: 3-5 repeticiones llegando a la cintura.', 'tips': 'Graba tus repeticiones: la altura real siempre es menor de la que sientes.'},
            {'label': 'Transición', 'desc': 'La fase clave: pasar de tirar a empujar. Trabaja negativas de muscle-up (desde arriba, baja atravesando la transición muy lento).', 'tips': 'Muñecas por encima de la barra (falso agarre ayuda). Codos pegados al cuerpo al pasar.', 'subs': [
                {'label': 'Muscle-up en banda', 'desc': 'Con banda gruesa bajo los pies para practicar el movimiento completo con menos carga.'},
                {'label': 'Falso agarre', 'desc': 'Agarre con la muñeca sobre la barra: acorta la transición. Entrénalo en dead hangs y dominadas.'},
            ]},
            {'label': 'Fondos en barra', 'desc': 'Desde la posición alta de la barra, baja al pecho y empuja hasta bloquear los codos. Objetivo: 3 series de 8.', 'tips': 'Es la mitad olvidada del muscle-up: no la saltes.'},
            {'label': 'Primer muscle-up', 'desc': 'Une todo: tirón explosivo, transición y fondo. Un ligero impulso de cadera es aceptable al principio.', 'tips': 'Hazlo con la barra libre de obstáculos y las manos con magnesio si resbala.'},
            {'label': 'Muscle-up estricto', 'desc': 'Elimina el impulso: muscle-up desde dead hang con el cuerpo en línea. Objetivo final: 3-5 estrictos.', 'tips': 'Si te atascas en la transición, vuelve a las negativas lentas 2-3 semanas.'},
        ],
    },
    {
        'slug': 'progresion-handstand',
        'title': 'Progresión de Handstand',
        'description': 'Del hollow body al pino libre y las flexiones de pino: equilibrio, línea y fuerza de empuje vertical.',
        'category': 'skill',
        'steps': [
            {'label': 'Hollow body', 'desc': 'Tumbado, brazos y piernas estiradas, lumbar pegada al suelo. La forma del pino se aprende en el suelo. Objetivo: 3x30 segundos.', 'tips': 'Costillas cerradas y abdomen apretado: es la misma tensión que usarás boca abajo.'},
            {'label': 'Pino contra pared', 'desc': 'Sube de espaldas a la pared (belly-to-wall) andando con los pies. Objetivo: 3 series de 45-60 segundos con cuerpo alineado.', 'tips': 'Empuja el suelo "alejándolo" de ti: hombros elevados siempre.', 'subs': [
                {'label': 'Cara a la pared', 'desc': 'Versión chest-to-wall: mejor línea corporal, solo la punta de los pies toca la pared.'},
            ]},
            {'label': 'Toques de hombro', 'desc': 'En pino contra la pared, pasa el peso a una mano y toca el hombro contrario. Objetivo: 3 series de 10 toques.', 'tips': 'Separa un poco más las manos al principio. Muy útil para aprender a trasladar peso.'},
            {'label': 'Despegues de pared', 'desc': 'Desde el pino en pared, separa los pies y busca segundos de equilibrio libre. Trabaja también la caída controlada (rueda o giro).', 'tips': 'Aprender a salir del pino sin miedo es lo que desbloquea el equilibrio.'},
            {'label': 'Handstand libre 30s', 'desc': 'Pino libre consistente: entradas con patada controlada y 30 segundos de equilibrio. Balance con los dedos, no con los hombros.', 'tips': 'Practica en sesiones cortas y frecuentes (5-10 min diarios funcionan mejor que 1h semanal).'},
            {'label': 'HSPU negativas', 'desc': 'Contra la pared, baja lentamente hasta apoyar la cabeza (3-5 segundos). Objetivo: 5 negativas controladas.', 'tips': 'Coloca un cojín plano bajo la cabeza. Codos a unos 45 grados, no abiertos en cruz.'},
            {'label': 'HSPU en pared', 'desc': 'Flexión de pino completa contra la pared. Objetivo: 3 series de 5.', 'tips': 'Rango completo: la cabeza toca y los codos se bloquean arriba.', 'subs': [
                {'label': 'HSPU con déficit', 'desc': 'Manos sobre paralelas o bloques para aumentar el rango de recorrido.'},
            ]},
            {'label': 'HSPU libre', 'desc': 'La cima: flexión de pino sin pared, combinando el equilibrio del handstand libre con la fuerza del HSPU.', 'tips': 'Vuelve a la pared siempre que la línea se rompa: la calidad manda.'},
        ],
    },
    {
        'slug': 'progresion-planche',
        'title': 'Progresión de Planche',
        'description': 'La progresión más exigente de empuje: del lean a la full planche, con los accesorios que construyen hombros y bíceps a prueba de palanca.',
        'category': 'push',
        'steps': [
            {'label': 'Plancha + hollow sólidos', 'desc': 'Prerrequisito: plancha de 60s, hollow body de 45s y 15 fondos. La planche es tensión de todo el cuerpo.', 'tips': 'Protracción escapular siempre: espalda alta "redondeada" empujando el suelo.'},
            {'label': 'Planche lean', 'desc': 'En posición de plancha con brazos estirados, desplaza los hombros por delante de las manos. Objetivo: 3x20 segundos con buena protracción.', 'tips': 'Gira las manos ligeramente hacia fuera para proteger las muñecas. Calienta muñecas SIEMPRE.', 'subs': [
                {'label': 'Pseudo planche push-ups', 'desc': 'Flexiones con las manos a la altura de la cadera y cuerpo inclinado: el constructor de fuerza principal.'},
            ]},
            {'label': 'Tuck planche', 'desc': 'Despega los pies con las rodillas al pecho y la espalda redondeada. Objetivo: 3x15 segundos.', 'tips': 'Codos bloqueados. Si se doblan, vuelve al lean una temporada.'},
            {'label': 'Advanced tuck', 'desc': 'Igual pero con la espalda plana y la cadera a la altura de los hombros. Objetivo: 3x12 segundos.', 'tips': 'La diferencia con el tuck es la extensión de cadera, no las piernas. Grábate de lado.'},
            {'label': 'Straddle planche', 'desc': 'Piernas estiradas y muy abiertas. El salto grande de palanca. Objetivo: acumular 15-20 segundos totales por sesión.', 'tips': 'Bandas elásticas o suelo elevado (paralelas) ayudan a acumular tiempo de calidad.', 'subs': [
                {'label': 'Planche presses en banda', 'desc': 'Con banda a la cintura, practica entrar y salir de la posición para ganar control.'},
            ]},
            {'label': 'Half lay planche', 'desc': 'Piernas juntas con rodillas dobladas 90 grados. Puente entre straddle y full.', 'tips': 'Aprieta glúteos fuerte para mantener la cadera arriba.'},
            {'label': 'Full planche', 'desc': 'Cuerpo completamente recto y paralelo al suelo, brazos estirados. Años de trabajo: disfrútalo.', 'tips': 'Mantén las series cortas y frescas. La planche se entrena, no se sufre: fatiga = técnica rota.'},
        ],
    },
    {
        'slug': 'progresion-front-lever',
        'title': 'Progresión de Front Lever',
        'description': 'De la dominada al front lever completo: la progresión de tracción isométrica más icónica de la calistenia.',
        'category': 'pull',
        'steps': [
            {'label': 'Base de tracción', 'desc': 'Prerrequisito: 8 dominadas estrictas y dead hang de 45 segundos con escápulas activas.', 'tips': 'El front lever es retracción y depresión escapular con brazos estirados: actívalas en cada cuelgue.'},
            {'label': 'Tuck front lever', 'desc': 'Colgado, sube la cadera con las rodillas al pecho hasta que la espalda quede paralela al suelo. Objetivo: 3x15 segundos.', 'tips': 'Brazos completamente estirados y barra "empujada" hacia las caderas.', 'subs': [
                {'label': 'Skin the cat', 'desc': 'Rotaciones colgado en barra o anillas: movilidad y fuerza de hombro en rangos profundos.'},
            ]},
            {'label': 'Advanced tuck', 'desc': 'Espalda plana y cadera extendida, rodillas aún dobladas. Objetivo: 3x12 segundos.', 'tips': 'Punto clave: que la cadera no caiga. Piensa en llevar los talones lejos.'},
            {'label': 'Single leg', 'desc': 'Una pierna estirada y otra recogida, alternando. Objetivo: 3x10 segundos por pierna.', 'tips': 'La pierna estirada debe seguir la línea del cuerpo, no apuntar al techo.', 'subs': [
                {'label': 'FL raises en tuck', 'desc': 'Subidas y bajadas de la posición: fuerza dinámica que acelera la progresión.'},
            ]},
            {'label': 'Straddle front lever', 'desc': 'Piernas estiradas y abiertas. Objetivo: acumular 15-20 segundos totales por sesión.', 'tips': 'Cuanto más abras las piernas, más corta la palanca: empieza muy abierto y ve cerrando.'},
            {'label': 'Full front lever', 'desc': 'Cuerpo recto y paralelo al suelo, colgado con brazos estirados. Objetivo: 10 segundos limpios.', 'tips': 'Consolida con touches, raises y pulls una vez tengas la isometría.', 'subs': [
                {'label': 'Front lever pulls', 'desc': 'Desde dead hang, sube a front lever con brazos estirados: el siguiente nivel de fuerza.'},
            ]},
        ],
    },
]


def sql_str(s):
    return "'" + s.replace("'", "''") + "'"


BEGIN_MARKER = '-- BEGIN roadmap-templates (generado por scripts/generate-roadmap-templates.py — no editar a mano)'


def main():
    inserts = []
    for tpl in TEMPLATES:
        nodes, edges = build_graph(tpl['title'], tpl['steps'])
        nodes_json = json.dumps(nodes, ensure_ascii=False)
        edges_json = json.dumps(edges, ensure_ascii=False)
        inserts.append(
            'INSERT INTO roadmaps (slug, title, description, category, locale, user_id, author, is_public, is_template, nodes, edges, total_nodes)\n'
            f"VALUES ({sql_str(tpl['slug'])}, {sql_str(tpl['title'])}, {sql_str(tpl['description'])}, {sql_str(tpl['category'])}, 'es', NULL, 'OpenCalisthenics', true, true,\n"
            f"$roadmap_nodes${nodes_json}$roadmap_nodes$::jsonb,\n"
            f"$roadmap_edges${edges_json}$roadmap_edges$::jsonb,\n"
            f"{len(nodes)})\n"
            'ON CONFLICT (slug) DO UPDATE SET\n'
            '    title = EXCLUDED.title, description = EXCLUDED.description,\n'
            '    category = EXCLUDED.category, nodes = EXCLUDED.nodes,\n'
            '    edges = EXCLUDED.edges, total_nodes = EXCLUDED.total_nodes;'
        )

    block = (
        '\n' + BEGIN_MARKER + '\n'
        '-- =============================================\n'
        '-- OFFICIAL ROADMAP TEMPLATES (issue #28)\n'
        '-- =============================================\n\n'
        + '\n\n'.join(inserts) + '\n'
    )

    seed_path = 'supabase/seed.sql'
    seed = open(seed_path).read()
    if BEGIN_MARKER in seed:
        seed = seed[: seed.index(BEGIN_MARKER)].rstrip('\n') + '\n'
    open(seed_path, 'w').write(seed.rstrip('\n') + '\n' + block)
    print(f'seed.sql actualizado con {len(TEMPLATES)} plantillas')


if __name__ == '__main__':
    main()
