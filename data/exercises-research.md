# Base de Datos Completa de Ejercicios de Calistenia

## Estructura de Datos por Ejercicio

```typescript
interface Exercise {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  instructions: string[];
  category: 'push' | 'pull' | 'core' | 'legs' | 'skill';
  type: 'dynamic' | 'isometric' | 'plyometric';
  difficulty: 0 | 1 | 2 | 3 | 4 | 5; // 0=Principiante, 5=Elite
  muscleGroups: {
    primary: string[];
    secondary: string[];
  };
  equipment: string[];
  prerequisites: number[];
  progressions: number[];
  variations: number[];
  tips: string[];
}
```

---

## CORE - Ejercicios Imprescindibles

### 1. Dead Bug (ID: 48)
- **Nombre ES:** Dead Bug
- **Nombre EN:** Dead Bug
- **Categoría:** Core
- **Tipo:** Dinámico
- **Dificultad:** 0 (Principiante)
- **Músculos Principales:** Core, Transverso abdominal
- **Músculos Secundarios:** Flexores de cadera, Erectores espinales
- **Equipamiento:** Ninguno (suelo)
- **Instrucciones:**
  1. Acuéstate boca arriba con brazos extendidos hacia el techo
  2. Eleva las piernas con rodillas dobladas a 90 grados
  3. Mantén la espalda baja pegada al suelo
  4. Extiende brazo derecho y pierna izquierda simultáneamente
  5. Vuelve al inicio y alterna lados
- **Tips:**
  - Nunca dejes que la espalda baja se despegue del suelo
  - Exhala al extender, inhala al volver
  - Movimiento lento y controlado

### 2. Hollow Body Hold (ID: 49)
- **Nombre ES:** Hollow Body Hold
- **Nombre EN:** Hollow Body Hold
- **Categoría:** Core
- **Tipo:** Isométrico
- **Dificultad:** 2 (Intermedio)
- **Músculos Principales:** Recto abdominal, Transverso abdominal
- **Músculos Secundarios:** Flexores de cadera, Cuádriceps
- **Equipamiento:** Ninguno (suelo)
- **Prerrequisitos:** Dead Bug
- **Instrucciones:**
  1. Acuéstate boca arriba
  2. Presiona la espalda baja contra el suelo
  3. Eleva hombros y piernas del suelo
  4. Brazos extendidos junto a las orejas
  5. Cuerpo forma una "banana" o media luna
  6. Mantén la posición
- **Progresiones:**
  - Tuck Hollow (rodillas al pecho) → Straddle Hollow → One Leg → Full Hollow
- **Tips:**
  - La espalda baja NUNCA debe despegarse del suelo
  - Si es muy difícil, dobla las rodillas
  - Fundamental para gimnasia y skills avanzados

### 3. Plancha Frontal (ID: 5)
- **Nombre ES:** Plancha / Plank
- **Nombre EN:** Plank / Front Plank
- **Categoría:** Core
- **Tipo:** Isométrico
- **Dificultad:** 1 (Fácil)
- **Músculos Principales:** Recto abdominal, Transverso abdominal
- **Músculos Secundarios:** Oblicuos, Hombros, Glúteos
- **Equipamiento:** Ninguno (suelo)
- **Instrucciones:**
  1. Apóyate sobre antebrazos y puntas de los pies
  2. Codos directamente debajo de los hombros
  3. Cuerpo en línea recta de cabeza a talones
  4. Activa abdomen y glúteos
  5. Mantén la posición sin dejar caer las caderas
- **Variaciones:**
  - Plancha Inclinada (manos elevadas) - más fácil
  - RKC Plank (máxima tensión) - más difícil
  - Body Saw (movimiento dinámico)
  - Plancha con elevación de pierna
- **Tips:**
  - No dejes que las caderas suban o bajen
  - Mira al suelo, cuello neutral
  - Aprieta glúteos para proteger la espalda baja

### 4. Plancha Lateral (ID: 39)
- **Nombre ES:** Plancha Lateral
- **Nombre EN:** Side Plank
- **Categoría:** Core
- **Tipo:** Isométrico
- **Dificultad:** 2 (Intermedio)
- **Músculos Principales:** Oblicuos, Cuadrado lumbar
- **Músculos Secundarios:** Glúteo medio, Hombros
- **Equipamiento:** Ninguno (suelo)
- **Prerrequisitos:** Plancha frontal
- **Instrucciones:**
  1. Acuéstate de lado apoyado en un antebrazo
  2. Codo directamente debajo del hombro
  3. Pies apilados o escalonados
  4. Eleva las caderas formando línea recta
  5. Brazo libre hacia el techo o en la cadera
- **Variaciones:**
  - Side Plank con rodilla apoyada - más fácil
  - Side Plank con elevación de pierna - más difícil
  - Copenhagen Plank (pierna elevada en banco)
- **Tips:**
  - No dejes que la cadera caiga hacia el suelo
  - Empuja el suelo con el antebrazo

### 5. Elevación de Rodillas Colgado (ID: 50)
- **Nombre ES:** Elevación de Rodillas Colgado
- **Nombre EN:** Hanging Knee Raise
- **Categoría:** Core
- **Tipo:** Dinámico
- **Dificultad:** 1 (Fácil)
- **Músculos Principales:** Recto abdominal inferior, Flexores de cadera
- **Músculos Secundarios:** Oblicuos, Antebrazos (agarre)
- **Equipamiento:** Barra de dominadas
- **Instrucciones:**
  1. Cuélgate de una barra con agarre prono
  2. Brazos completamente extendidos
  3. Eleva las rodillas hacia el pecho
  4. Controla el descenso
  5. Evita balanceo excesivo
- **Tips:**
  - Inicia el movimiento desde el abdomen, no las piernas
  - Exhala al subir las rodillas
  - Mantén los hombros activos (no cuelgues pasivamente)

### 6. Elevación de Piernas Colgado (ID: 20)
- **Nombre ES:** Elevación de Piernas Colgado
- **Nombre EN:** Hanging Leg Raise
- **Categoría:** Core
- **Tipo:** Dinámico
- **Dificultad:** 2 (Intermedio)
- **Músculos Principales:** Recto abdominal, Flexores de cadera
- **Músculos Secundarios:** Oblicuos, Antebrazos
- **Equipamiento:** Barra de dominadas
- **Prerrequisitos:** Elevación de rodillas colgado
- **Instrucciones:**
  1. Cuélgate de una barra con agarre prono
  2. Piernas completamente extendidas
  3. Eleva las piernas rectas hasta 90 grados (L)
  4. Baja con control
- **Progresiones:** Knee Raise → Leg Raise → Toes to Bar → Windshield Wipers
- **Tips:**
  - Mantén las piernas lo más rectas posible
  - Evita usar impulso
  - Activa los hombros durante todo el movimiento

### 7. Toes to Bar (ID: 51)
- **Nombre ES:** Toes to Bar / Pies a la Barra
- **Nombre EN:** Toes to Bar
- **Categoría:** Core
- **Tipo:** Dinámico
- **Dificultad:** 3 (Difícil)
- **Músculos Principales:** Recto abdominal, Flexores de cadera
- **Músculos Secundarios:** Dorsales, Antebrazos, Oblicuos
- **Equipamiento:** Barra de dominadas
- **Prerrequisitos:** Elevación de piernas colgado
- **Instrucciones:**
  1. Cuélgate de la barra con agarre prono
  2. Piernas extendidas
  3. Eleva las piernas hasta tocar la barra con los pies
  4. Baja con control
- **Tips:**
  - Requiere buena flexibilidad de isquiotibiales
  - Usa ligero kipping al principio si es necesario
  - Progresa desde V-raises (piernas a 90°+)

### 8. L-Sit (ID: 9)
- **Nombre ES:** L-Sit
- **Nombre EN:** L-Sit
- **Categoría:** Core
- **Tipo:** Isométrico
- **Dificultad:** 3 (Difícil)
- **Músculos Principales:** Recto abdominal, Flexores de cadera, Tríceps
- **Músculos Secundarios:** Cuádriceps, Hombros
- **Equipamiento:** Paralelas, suelo, o anillas
- **Prerrequisitos:** Hollow body hold, Fuerza de tríceps
- **Instrucciones:**
  1. Siéntate con piernas extendidas
  2. Coloca las manos junto a las caderas
  3. Presiona hacia abajo y eleva todo el cuerpo
  4. Mantén las piernas paralelas al suelo formando una "L"
  5. Hombros deprimidos, brazos bloqueados
- **Progresiones:**
  - Foot Supported L-Sit → Tuck L-Sit → One Leg L-Sit → Full L-Sit → V-Sit → Manna
- **Tips:**
  - Trabaja la compresión de cadera por separado
  - Usa paralelas al principio (más fácil que suelo)
  - Deprime los hombros activamente

### 9. L-Sit Recogido / Tuck L-Sit (ID: 43)
- **Nombre ES:** L-Sit Recogido
- **Nombre EN:** Tuck L-Sit
- **Categoría:** Core
- **Tipo:** Isométrico
- **Dificultad:** 2 (Intermedio)
- **Músculos Principales:** Tríceps, Core
- **Músculos Secundarios:** Hombros, Flexores de cadera
- **Equipamiento:** Paralelas, suelo, o anillas
- **Instrucciones:**
  1. Coloca las manos en paralelas o suelo
  2. Eleva el cuerpo con brazos bloqueados
  3. Recoge las rodillas hacia el pecho
  4. Mantén la posición
- **Tips:**
  - Primera progresión real hacia el L-Sit
  - Trabaja hasta 30 segundos antes de avanzar

### 10. V-Sit (ID: 44)
- **Nombre ES:** V-Sit
- **Nombre EN:** V-Sit
- **Categoría:** Core
- **Tipo:** Isométrico
- **Dificultad:** 4 (Muy Difícil)
- **Músculos Principales:** Core, Flexores de cadera, Tríceps
- **Músculos Secundarios:** Cuádriceps, Hombros
- **Equipamiento:** Paralelas o suelo
- **Prerrequisitos:** L-Sit completo
- **Instrucciones:**
  1. Desde L-Sit, eleva las piernas por encima de 90°
  2. El cuerpo forma una "V"
  3. Mantén los brazos bloqueados
  4. Hombros deprimidos
- **Progresiones:** V-Sit 45° → V-Sit 90° → V-Sit 135° → Manna
- **Tips:**
  - Requiere excelente flexibilidad de isquiotibiales
  - Trabajo de compresión es esencial

### 11. Dragon Flag (ID: 19)
- **Nombre ES:** Dragon Flag
- **Nombre EN:** Dragon Flag
- **Categoría:** Core
- **Tipo:** Dinámico/Isométrico
- **Dificultad:** 4 (Muy Difícil)
- **Músculos Principales:** Recto abdominal, Oblicuos
- **Músculos Secundarios:** Dorsales, Glúteos, Erectores
- **Equipamiento:** Banco, poste, o superficie para agarrarse
- **Prerrequisitos:** Hollow body hold, Leg raises
- **Instrucciones:**
  1. Acuéstate en un banco, agarra detrás de la cabeza
  2. Eleva todo el cuerpo manteniendo solo hombros en contacto
  3. Cuerpo recto como una tabla
  4. Baja lentamente manteniendo la línea
- **Progresiones:**
  - Tuck Dragon Flag → Advanced Tuck → Single Leg → Straddle → Full
- **Tips:**
  - Popularizado por Bruce Lee
  - Nunca arquees la espalda baja
  - Los negativos son excelentes para progresar

### 12. Windshield Wipers
- **Nombre ES:** Limpiaparabrisas
- **Nombre EN:** Windshield Wipers
- **Categoría:** Core
- **Tipo:** Dinámico
- **Dificultad:** 4 (Muy Difícil)
- **Músculos Principales:** Oblicuos, Recto abdominal
- **Músculos Secundarios:** Flexores de cadera, Antebrazos
- **Equipamiento:** Barra de dominadas o suelo
- **Prerrequisitos:** Toes to Bar, Hanging Leg Raises
- **Instrucciones:**
  1. Cuélgate de la barra con piernas elevadas (posición L o Toes to Bar)
  2. Rota las piernas de lado a lado como un limpiaparabrisas
  3. Mantén el torso lo más estable posible
  4. Controla el movimiento en ambas direcciones
- **Variaciones:**
  - Floor Windshield Wipers (en suelo) - más fácil
  - Knee Wipers - más fácil
  - Hanging Windshield Wipers - más difícil
- **Tips:**
  - Empieza con rango de movimiento pequeño
  - Mantén las piernas juntas

---

## CORE - Front Lever y Progresiones

### 13. Tuck Front Lever (ID: 52)
- **Nombre ES:** Front Lever Recogido
- **Nombre EN:** Tuck Front Lever
- **Categoría:** Core/Pull/Skill
- **Tipo:** Isométrico
- **Dificultad:** 3 (Difícil)
- **Músculos Principales:** Dorsales, Core, Recto abdominal
- **Músculos Secundarios:** Bíceps, Hombros posteriores
- **Equipamiento:** Barra de dominadas o anillas
- **Prerrequisitos:** 10+ dominadas, Hollow body hold
- **Instrucciones:**
  1. Cuélgate de la barra con agarre prono
  2. Recoge las rodillas hacia el pecho
  3. Rota hacia atrás hasta que la espalda esté horizontal
  4. Mantén las caderas a la altura de los hombros
  5. Brazos rectos, hombros deprimidos
- **Tips:**
  - Aprieta las rodillas al pecho
  - Mantén tensión en dorsales todo el tiempo
  - Objetivo: 30 segundos antes de avanzar

### 14. Advanced Tuck Front Lever (ID: 53)
- **Nombre ES:** Front Lever Recogido Avanzado
- **Nombre EN:** Advanced Tuck Front Lever
- **Categoría:** Core/Pull/Skill
- **Tipo:** Isométrico
- **Dificultad:** 3 (Difícil)
- **Músculos Principales:** Dorsales, Core
- **Músculos Secundarios:** Bíceps, Hombros posteriores
- **Equipamiento:** Barra o anillas
- **Prerrequisitos:** Tuck Front Lever 30s
- **Instrucciones:**
  1. Desde Tuck Front Lever
  2. Extiende ligeramente las caderas
  3. Rodillas dobladas a 90° pero muslos verticales
  4. Espalda paralela al suelo
- **Tips:**
  - Transición clave entre tuck y straddle
  - Aumenta significativamente la dificultad

### 15. One Leg Front Lever
- **Nombre ES:** Front Lever a Una Pierna
- **Nombre EN:** One Leg Front Lever
- **Categoría:** Core/Pull/Skill
- **Tipo:** Isométrico
- **Dificultad:** 4 (Muy Difícil)
- **Músculos Principales:** Dorsales, Core
- **Músculos Secundarios:** Bíceps, Glúteos
- **Equipamiento:** Barra o anillas
- **Prerrequisitos:** Advanced Tuck Front Lever
- **Instrucciones:**
  1. Desde advanced tuck, extiende una pierna completamente
  2. Mantén la otra rodilla recogida
  3. Cuerpo horizontal
  4. Alterna piernas en el entrenamiento
- **Tips:**
  - Buena progresión intermedia
  - Trabaja ambos lados por igual

### 16. Straddle Front Lever (ID: 54)
- **Nombre ES:** Front Lever en Straddle
- **Nombre EN:** Straddle Front Lever
- **Categoría:** Core/Pull/Skill
- **Tipo:** Isométrico
- **Dificultad:** 4 (Muy Difícil)
- **Músculos Principales:** Dorsales, Core
- **Músculos Secundarios:** Bíceps, Aductores
- **Equipamiento:** Barra o anillas
- **Prerrequisitos:** One Leg Front Lever
- **Instrucciones:**
  1. Ambas piernas extendidas y abiertas en straddle
  2. Cuerpo completamente horizontal
  3. Caderas abiertas, piernas separadas
  4. Mientras más ancho el straddle, más fácil
- **Tips:**
  - Última progresión antes del full
  - Cierra gradualmente las piernas

### 17. Front Lever (ID: 14)
- **Nombre ES:** Front Lever
- **Nombre EN:** Front Lever
- **Categoría:** Core/Pull/Skill
- **Tipo:** Isométrico
- **Dificultad:** 5 (Elite)
- **Músculos Principales:** Dorsales, Core, Recto abdominal
- **Músculos Secundarios:** Bíceps, Hombros posteriores, Glúteos
- **Equipamiento:** Barra de dominadas o anillas
- **Prerrequisitos:** Straddle Front Lever
- **Instrucciones:**
  1. Cuélgate de la barra
  2. Cuerpo completamente horizontal, mirando hacia arriba
  3. Piernas juntas y extendidas
  4. Brazos rectos, hombros deprimidos
  5. Línea recta de manos a pies
- **Tips:**
  - Skill icónico de calistenia
  - Requiere excelente fuerza de dorsales y core
  - Entrena Front Lever Raises para fuerza dinámica

### 18. Front Lever Raises
- **Nombre ES:** Elevaciones de Front Lever
- **Nombre EN:** Front Lever Raises
- **Categoría:** Core/Pull
- **Tipo:** Dinámico
- **Dificultad:** 5 (Elite)
- **Músculos Principales:** Dorsales, Core
- **Músculos Secundarios:** Bíceps
- **Equipamiento:** Barra o anillas
- **Prerrequisitos:** Front Lever hold
- **Instrucciones:**
  1. Desde colgado, eleva el cuerpo hasta front lever
  2. Mantén brazos rectos todo el tiempo
  3. Baja con control
  4. Usa la progresión que domines (tuck, straddle, full)
- **Tips:**
  - Excelente para construir fuerza de front lever
  - Los negativos son muy efectivos

---

## PUSH - Ejercicios de Empuje

### 19. Flexión en Pared (ID: 21)
- **Nombre ES:** Flexión en Pared
- **Nombre EN:** Wall Push Up
- **Categoría:** Push
- **Tipo:** Dinámico
- **Dificultad:** 0 (Principiante)
- **Músculos Principales:** Pecho, Hombros anteriores, Tríceps
- **Músculos Secundarios:** Core
- **Equipamiento:** Pared
- **Instrucciones:**
  1. Párate frente a una pared a un brazo de distancia
  2. Coloca las manos en la pared a la altura de los hombros
  3. Inclínate hacia la pared flexionando los codos
  4. Empuja para volver a la posición inicial
- **Tips:**
  - Perfecto para principiantes absolutos
  - Mantén el cuerpo recto

### 20. Flexión Inclinada (ID: 22)
- **Nombre ES:** Flexión Inclinada
- **Nombre EN:** Incline Push Up
- **Categoría:** Push
- **Tipo:** Dinámico
- **Dificultad:** 0 (Principiante)
- **Músculos Principales:** Pecho, Hombros, Tríceps
- **Músculos Secundarios:** Core
- **Equipamiento:** Banco, escalón, o superficie elevada
- **Instrucciones:**
  1. Coloca las manos en una superficie elevada
  2. Cuerpo en línea recta
  3. Baja el pecho hacia la superficie
  4. Empuja para volver
- **Tips:**
  - Cuanto más alta la superficie, más fácil
  - Progresa bajando gradualmente la altura

### 21. Flexión de Rodillas (ID: 23)
- **Nombre ES:** Flexión de Rodillas
- **Nombre EN:** Knee Push Up
- **Categoría:** Push
- **Tipo:** Dinámico
- **Dificultad:** 1 (Fácil)
- **Músculos Principales:** Pecho, Hombros, Tríceps
- **Músculos Secundarios:** Core
- **Equipamiento:** Ninguno (suelo)
- **Instrucciones:**
  1. Posición de flexión con rodillas apoyadas
  2. Manos a la anchura de los hombros
  3. Cuerpo recto de rodillas a cabeza
  4. Baja el pecho al suelo y empuja
- **Tips:**
  - Reduce aproximadamente 50% del peso corporal
  - No dejes que las caderas caigan

### 22. Flexiones / Push Up (ID: 1)
- **Nombre ES:** Flexiones
- **Nombre EN:** Push Up
- **Categoría:** Push
- **Tipo:** Dinámico
- **Dificultad:** 1 (Fácil)
- **Músculos Principales:** Pecho, Deltoides anterior, Tríceps
- **Músculos Secundarios:** Core, Serrato anterior
- **Equipamiento:** Ninguno (suelo)
- **Instrucciones:**
  1. Posición de plancha alta, manos bajo los hombros
  2. Cuerpo en línea recta de cabeza a talones
  3. Baja el cuerpo hasta que el pecho casi toque el suelo
  4. Codos a 45° del cuerpo (no pegados ni muy abiertos)
  5. Empuja hasta bloquear los brazos
- **Tips:**
  - Ejercicio fundamental de empuje
  - Aprieta glúteos y core
  - Protrae las escápulas arriba (no hundas el pecho)

### 23. Flexión Abierta (ID: 24)
- **Nombre ES:** Flexión Abierta
- **Nombre EN:** Wide Push Up
- **Categoría:** Push
- **Tipo:** Dinámico
- **Dificultad:** 1 (Fácil)
- **Músculos Principales:** Pecho (énfasis)
- **Músculos Secundarios:** Hombros, Tríceps
- **Equipamiento:** Ninguno
- **Instrucciones:**
  1. Manos más separadas que el ancho de hombros
  2. Dedos apuntando ligeramente hacia afuera
  3. Baja y empuja manteniendo codos hacia afuera
- **Tips:**
  - Mayor énfasis en pecho
  - Menor rango de movimiento

### 24. Flexión Diamante (ID: 11)
- **Nombre ES:** Flexión Diamante
- **Nombre EN:** Diamond Push Up
- **Categoría:** Push
- **Tipo:** Dinámico
- **Dificultad:** 2 (Intermedio)
- **Músculos Principales:** Tríceps, Pecho interno
- **Músculos Secundarios:** Hombros
- **Equipamiento:** Ninguno
- **Prerrequisitos:** 15+ flexiones regulares
- **Instrucciones:**
  1. Junta las manos formando un diamante (índices y pulgares se tocan)
  2. Manos debajo del pecho
  3. Baja hasta que el pecho toque las manos
  4. Codos cerca del cuerpo
- **Tips:**
  - Excelente para desarrollar tríceps
  - Mantén los codos pegados al cuerpo

### 25. Flexión Arquero (ID: 17)
- **Nombre ES:** Flexión Arquero
- **Nombre EN:** Archer Push Up
- **Categoría:** Push
- **Tipo:** Dinámico
- **Dificultad:** 3 (Difícil)
- **Músculos Principales:** Pecho, Tríceps
- **Músculos Secundarios:** Hombros, Core
- **Equipamiento:** Ninguno
- **Prerrequisitos:** Diamond push ups, 20+ push ups
- **Instrucciones:**
  1. Posición muy amplia, brazos extendidos
  2. Desplázate hacia un lado, doblando ese codo
  3. El brazo opuesto queda extendido
  4. Empuja y alterna lados
- **Tips:**
  - Progresión hacia flexión a una mano
  - Mantén el brazo extendido recto

### 26. Flexión a Una Mano (ID: 25)
- **Nombre ES:** Flexión a Una Mano
- **Nombre EN:** One Arm Push Up
- **Categoría:** Push
- **Tipo:** Dinámico
- **Dificultad:** 5 (Elite)
- **Músculos Principales:** Pecho, Tríceps, Core
- **Músculos Secundarios:** Hombros, Oblicuos
- **Equipamiento:** Ninguno
- **Prerrequisitos:** Archer push ups, excelente fuerza de core
- **Instrucciones:**
  1. Posición de flexión con pies separados
  2. Una mano en el suelo, centrada bajo el pecho
  3. Otra mano detrás de la espalda
  4. Baja con control y empuja
- **Tips:**
  - Requiere mucha estabilidad de core
  - Pies más separados = más fácil
  - Trabaja anti-rotación

### 27. Flexión Explosiva / Clap Push Up
- **Nombre ES:** Flexión con Palmada
- **Nombre EN:** Clap Push Up
- **Categoría:** Push
- **Tipo:** Pliométrico
- **Dificultad:** 3 (Difícil)
- **Músculos Principales:** Pecho, Tríceps, Hombros
- **Músculos Secundarios:** Core
- **Equipamiento:** Ninguno
- **Prerrequisitos:** 20+ flexiones con buena forma
- **Instrucciones:**
  1. Desde posición de flexión, baja normalmente
  2. Empuja explosivamente para despegar las manos del suelo
  3. Aplaude en el aire
  4. Aterriza con los codos ligeramente flexionados
- **Tips:**
  - Desarrolla potencia explosiva
  - Aterriza suavemente para proteger las muñecas

### 28. Fondos en Banco (ID: 34)
- **Nombre ES:** Fondos en Banco
- **Nombre EN:** Bench Dips
- **Categoría:** Push
- **Tipo:** Dinámico
- **Dificultad:** 1 (Fácil)
- **Músculos Principales:** Tríceps
- **Músculos Secundarios:** Pecho, Hombros anteriores
- **Equipamiento:** Banco, silla o superficie elevada
- **Instrucciones:**
  1. Siéntate en el borde del banco, manos junto a las caderas
  2. Desliza el cuerpo hacia adelante, pies en el suelo
  3. Baja el cuerpo flexionando los codos
  4. Empuja hasta extender los brazos
- **Variaciones:**
  - Piernas dobladas - más fácil
  - Piernas extendidas - más difícil
  - Pies elevados - aún más difícil
- **Tips:**
  - No bajes demasiado para proteger los hombros
  - Mantén la espalda cerca del banco

### 29. Fondos Asistidos (ID: 35)
- **Nombre ES:** Fondos Asistidos
- **Nombre EN:** Assisted Dips
- **Categoría:** Push
- **Tipo:** Dinámico
- **Dificultad:** 1 (Fácil)
- **Músculos Principales:** Tríceps, Pecho
- **Músculos Secundarios:** Hombros
- **Equipamiento:** Paralelas + banda elástica o máquina
- **Instrucciones:**
  1. Coloca una banda en las paralelas
  2. Apoya las rodillas o pies en la banda
  3. Realiza el fondo con la asistencia de la banda
- **Tips:**
  - Reduce progresivamente la resistencia de la banda
  - Excelente para construir fuerza

### 30. Fondos / Dips (ID: 4)
- **Nombre ES:** Fondos en Paralelas
- **Nombre EN:** Parallel Bar Dips
- **Categoría:** Push
- **Tipo:** Dinámico
- **Dificultad:** 2 (Intermedio)
- **Músculos Principales:** Tríceps, Pecho inferior, Hombros anteriores
- **Músculos Secundarios:** Core
- **Equipamiento:** Barras paralelas
- **Prerrequisitos:** Bench dips, Push ups
- **Instrucciones:**
  1. Sujétate en las paralelas con brazos extendidos
  2. Inclina ligeramente el torso hacia adelante
  3. Baja hasta que los codos formen 90°
  4. Empuja hasta bloquear los brazos
- **Variaciones:**
  - Torso vertical: más tríceps
  - Torso inclinado: más pecho
- **Tips:**
  - No bajes más de 90° al principio
  - Hombros hacia atrás y abajo

### 31. Fondos en Anillas (ID: 36)
- **Nombre ES:** Fondos en Anillas
- **Nombre EN:** Ring Dips
- **Categoría:** Push
- **Tipo:** Dinámico
- **Dificultad:** 3 (Difícil)
- **Músculos Principales:** Tríceps, Pecho, Hombros
- **Músculos Secundarios:** Core, Estabilizadores
- **Equipamiento:** Anillas de gimnasia
- **Prerrequisitos:** 10+ fondos en paralelas
- **Instrucciones:**
  1. Ring support hold estable primero
  2. Anillas pegadas al cuerpo (RTO para avanzados)
  3. Baja controladamente
  4. Empuja manteniendo las anillas estables
- **Tips:**
  - Mucho más difícil por la inestabilidad
  - Trabaja ring support antes de intentar dips
  - RTO (Rings Turned Out) aumenta dificultad

### 32. Fondos con Peso (ID: 37)
- **Nombre ES:** Fondos con Peso
- **Nombre EN:** Weighted Dips
- **Categoría:** Push
- **Tipo:** Dinámico
- **Dificultad:** 3 (Difícil)
- **Músculos Principales:** Tríceps, Pecho, Hombros
- **Músculos Secundarios:** Core
- **Equipamiento:** Paralelas + cinturón de lastre o chaleco
- **Prerrequisitos:** 15+ fondos limpios
- **Instrucciones:**
  1. Añade peso con cinturón o chaleco
  2. Realiza fondos con técnica perfecta
  3. Progresa gradualmente el peso
- **Tips:**
  - Excelente para ganar fuerza
  - No sacrifiques rango de movimiento por peso

### 33. Korean Dips
- **Nombre ES:** Fondos Coreanos
- **Nombre EN:** Korean Dips
- **Categoría:** Push
- **Tipo:** Dinámico
- **Dificultad:** 4 (Muy Difícil)
- **Músculos Principales:** Tríceps, Hombros, Core
- **Músculos Secundarios:** Pecho
- **Equipamiento:** Barra baja o paralelas
- **Prerrequisitos:** Fondos regulares dominados
- **Instrucciones:**
  1. Agarra la barra detrás de ti
  2. Cuerpo hacia adelante, barra en la espalda baja
  3. Baja y sube usando tríceps y hombros
- **Tips:**
  - Requiere buena movilidad de hombros
  - Excelente para fuerza de empuje posterior

### 34. Flexión Pike (ID: 45)
- **Nombre ES:** Flexión Pike
- **Nombre EN:** Pike Push Up
- **Categoría:** Push
- **Tipo:** Dinámico
- **Dificultad:** 2 (Intermedio)
- **Músculos Principales:** Hombros (deltoides), Tríceps
- **Músculos Secundarios:** Pecho superior, Core
- **Equipamiento:** Ninguno
- **Prerrequisitos:** Push ups regulares
- **Instrucciones:**
  1. Posición de V invertida (caderas altas)
  2. Manos ligeramente más anchas que hombros
  3. Baja la cabeza hacia el suelo entre las manos
  4. Empuja hasta extender los brazos
- **Tips:**
  - Simula el movimiento del HSPU
  - Cuanto más vertical el torso, más difícil

### 35. Flexión Pike Elevada (ID: 46)
- **Nombre ES:** Flexión Pike Elevada
- **Nombre EN:** Elevated Pike Push Up
- **Categoría:** Push
- **Tipo:** Dinámico
- **Dificultad:** 3 (Difícil)
- **Músculos Principales:** Hombros, Tríceps
- **Músculos Secundarios:** Pecho superior, Core
- **Equipamiento:** Caja, banco o superficie elevada
- **Prerrequisitos:** Pike push ups
- **Instrucciones:**
  1. Pies elevados en una caja o banco
  2. Caderas altas, torso más vertical
  3. Baja la cabeza hacia el suelo
  4. Empuja hasta arriba
- **Progresiones:** Cuanto más alta la superficie, más difícil
- **Tips:**
  - Progresión clave hacia HSPU
  - Aumenta gradualmente la altura

### 36. Flexión en Pino contra Pared (ID: 47)
- **Nombre ES:** Flexión en Pino contra Pared
- **Nombre EN:** Wall Handstand Push Up
- **Categoría:** Push
- **Tipo:** Dinámico
- **Dificultad:** 4 (Muy Difícil)
- **Músculos Principales:** Hombros, Tríceps
- **Músculos Secundarios:** Trapecios, Core
- **Equipamiento:** Pared
- **Prerrequisitos:** Pike elevado, Handstand hold 30s+
- **Instrucciones:**
  1. Haz pino contra la pared (pecho o espalda hacia la pared)
  2. Baja la cabeza hacia el suelo controladamente
  3. Empuja hasta extender los brazos
- **Variaciones:**
  - Negativas (solo bajar)
  - Rango parcial
  - Con déficit (manos en paralelas)
- **Tips:**
  - Pecho a la pared es más difícil pero mejor técnica
  - Usa un cojín para la cabeza al principio

### 37. Flexión en Pino / HSPU (ID: 8)
- **Nombre ES:** Flexión en Pino
- **Nombre EN:** Handstand Push Up (HSPU)
- **Categoría:** Push
- **Tipo:** Dinámico
- **Dificultad:** 5 (Elite)
- **Músculos Principales:** Hombros, Tríceps, Trapecios
- **Músculos Secundarios:** Core, Antebrazos
- **Equipamiento:** Ninguno (o paralelas para déficit)
- **Prerrequisitos:** Wall HSPU, Freestanding handstand
- **Instrucciones:**
  1. Pino libre en equilibrio
  2. Baja controladamente hasta tocar la cabeza
  3. Empuja hasta extender
  4. Mantén el equilibrio durante todo el movimiento
- **Tips:**
  - Requiere dominio del pino libre
  - El equilibrio es tan importante como la fuerza

### 38. Pseudo Planche Push Up
- **Nombre ES:** Flexión Pseudo Planche
- **Nombre EN:** Pseudo Planche Push Up
- **Categoría:** Push
- **Tipo:** Dinámico
- **Dificultad:** 3 (Difícil)
- **Músculos Principales:** Hombros anteriores, Pecho, Tríceps
- **Músculos Secundarios:** Core, Bíceps (estabilización)
- **Equipamiento:** Ninguno (o paralelas)
- **Prerrequisitos:** Push ups sólidos
- **Instrucciones:**
  1. Posición de flexión con manos rotadas (dedos hacia los pies o lados)
  2. Inclínate hacia adelante para que los hombros pasen las muñecas
  3. Mantén el lean mientras haces la flexión
  4. Codos cerca del cuerpo
- **Progresiones:** Aumenta el lean gradualmente
- **Tips:**
  - Excelente preparación para planche
  - Trabaja fuerza de hombro anterior
  - Protrae las escápulas arriba

### 39. Planche Lean (ID: 57)
- **Nombre ES:** Inclinación de Planche
- **Nombre EN:** Planche Lean
- **Categoría:** Push/Skill
- **Tipo:** Isométrico
- **Dificultad:** 2 (Intermedio)
- **Músculos Principales:** Hombros anteriores, Pecho
- **Músculos Secundarios:** Core, Bíceps
- **Equipamiento:** Suelo o paralelas
- **Instrucciones:**
  1. Posición de plancha alta
  2. Rota las manos hacia afuera o atrás
  3. Inclínate hacia adelante lo más posible
  4. Brazos rectos, escápulas protraídas
  5. Mantén la posición
- **Tips:**
  - Fundamento para todas las progresiones de planche
  - Objetivo: hombros muy por delante de las muñecas

### 40. Tuck Planche (ID: 18)
- **Nombre ES:** Planche Recogida
- **Nombre EN:** Tuck Planche
- **Categoría:** Push/Skill
- **Tipo:** Isométrico
- **Dificultad:** 4 (Muy Difícil)
- **Músculos Principales:** Hombros anteriores, Pecho, Core
- **Músculos Secundarios:** Tríceps, Bíceps
- **Equipamiento:** Suelo o paralelas (paralelas más fácil)
- **Prerrequisitos:** Planche lean sólido, Pseudo planche push ups
- **Instrucciones:**
  1. Desde planche lean, eleva los pies del suelo
  2. Rodillas recogidas al pecho
  3. Espalda redondeada, caderas altas
  4. Solo las manos tocan el suelo
- **Tips:**
  - Paralelas facilitan la posición de muñeca
  - Mantén las rodillas lo más pegadas posible al pecho

### 41. Advanced Tuck Planche
- **Nombre ES:** Planche Recogida Avanzada
- **Nombre EN:** Advanced Tuck Planche
- **Categoría:** Push/Skill
- **Tipo:** Isométrico
- **Dificultad:** 4 (Muy Difícil)
- **Músculos Principales:** Hombros, Pecho, Core
- **Músculos Secundarios:** Tríceps
- **Equipamiento:** Suelo o paralelas
- **Prerrequisitos:** Tuck Planche 10-15s
- **Instrucciones:**
  1. Desde tuck planche
  2. Extiende las caderas manteniendo rodillas dobladas
  3. Espalda más horizontal/plana
- **Tips:**
  - Gran salto de dificultad desde tuck
  - Trabaja hasta 10s antes de avanzar

### 42. Straddle Planche (ID: 58)
- **Nombre ES:** Planche en Straddle
- **Nombre EN:** Straddle Planche
- **Categoría:** Push/Skill
- **Tipo:** Isométrico
- **Dificultad:** 5 (Elite)
- **Músculos Principales:** Hombros, Pecho, Core
- **Músculos Secundarios:** Tríceps, Glúteos
- **Equipamiento:** Suelo o paralelas
- **Prerrequisitos:** Advanced Tuck Planche
- **Instrucciones:**
  1. Cuerpo horizontal
  2. Piernas extendidas y abiertas en straddle
  3. Solo manos en contacto con el suelo
  4. Brazos rectos
- **Tips:**
  - Straddle más ancho = más fácil
  - Cierra gradualmente las piernas

### 43. Full Planche (ID: 59)
- **Nombre ES:** Planche Completa
- **Nombre EN:** Full Planche
- **Categoría:** Push/Skill
- **Tipo:** Isométrico
- **Dificultad:** 5 (Elite)
- **Músculos Principales:** Hombros, Pecho, Core, Todo el cuerpo
- **Músculos Secundarios:** Todos los músculos del tren superior
- **Equipamiento:** Suelo o paralelas
- **Prerrequisitos:** Straddle Planche
- **Instrucciones:**
  1. Cuerpo completamente horizontal
  2. Piernas juntas y extendidas
  3. Solo las manos tocan el suelo
  4. Brazos completamente rectos
- **Tips:**
  - Uno de los ejercicios más difíciles de calistenia
  - Puede tomar años dominar
  - Requiere dedicación extrema

---

## PULL - Ejercicios de Tracción

### 44. Dominada Escapular (ID: 26)
- **Nombre ES:** Dominada Escapular
- **Nombre EN:** Scapular Pull Up
- **Categoría:** Pull
- **Tipo:** Dinámico
- **Dificultad:** 0 (Principiante)
- **Músculos Principales:** Dorsales, Trapecios inferiores
- **Músculos Secundarios:** Romboides
- **Equipamiento:** Barra de dominadas
- **Instrucciones:**
  1. Cuélgate de la barra con brazos extendidos
  2. Sin doblar los codos, deprime las escápulas
  3. "Jala" los hombros hacia abajo y atrás
  4. Vuelve al hang pasivo
- **Tips:**
  - Primer paso para activación escapular
  - Fundamental para todas las dominadas
  - Trabaja 15-20 reps antes de avanzar

### 45. Remo Australiano (ID: 10)
- **Nombre ES:** Remo Australiano
- **Nombre EN:** Australian Pull Up / Inverted Row
- **Categoría:** Pull
- **Tipo:** Dinámico
- **Dificultad:** 1 (Fácil)
- **Músculos Principales:** Dorsales, Romboides, Trapecios
- **Músculos Secundarios:** Bíceps, Core
- **Equipamiento:** Barra baja, anillas, o TRX
- **Instrucciones:**
  1. Barra a la altura de la cadera aproximadamente
  2. Cuélgate debajo con cuerpo recto
  3. Pies en el suelo, cuerpo inclinado
  4. Jala el pecho hacia la barra
  5. Baja con control
- **Progresiones:**
  - Pies doblados / barra alta: más fácil
  - Pies elevados / barra baja: más difícil
  - Archer rows: unilateral
  - Front lever rows: muy difícil
- **Tips:**
  - Excelente para principiantes
  - Ajusta el ángulo para cambiar dificultad

### 46. Dominada Negativa (ID: 27)
- **Nombre ES:** Dominada Negativa
- **Nombre EN:** Negative Pull Up
- **Categoría:** Pull
- **Tipo:** Dinámico (excéntrico)
- **Dificultad:** 1 (Fácil)
- **Músculos Principales:** Dorsales, Bíceps
- **Músculos Secundarios:** Trapecios, Antebrazos
- **Equipamiento:** Barra de dominadas
- **Instrucciones:**
  1. Usa una caja o salta para llegar arriba
  2. Barbilla sobre la barra
  3. Baja lo más lento posible (5-10 segundos)
  4. Repite
- **Tips:**
  - Excelente para construir fuerza
  - Objetivo: 10 segundos de bajada
  - Progresión clave hacia la primera dominada

### 47. Dominada con Banda (ID: 28)
- **Nombre ES:** Dominada con Banda
- **Nombre EN:** Band Assisted Pull Up
- **Categoría:** Pull
- **Tipo:** Dinámico
- **Dificultad:** 1 (Fácil)
- **Músculos Principales:** Dorsales, Bíceps
- **Músculos Secundarios:** Trapecios, Romboides
- **Equipamiento:** Barra + banda elástica
- **Instrucciones:**
  1. Engancha la banda en la barra
  2. Coloca el pie o rodilla en la banda
  3. Realiza dominadas con asistencia
  4. Reduce gradualmente la resistencia de la banda
- **Tips:**
  - Usa bandas progresivamente más ligeras
  - Combina con negativas para progresar más rápido

### 48. Dominadas / Pull Up (ID: 2)
- **Nombre ES:** Dominadas
- **Nombre EN:** Pull Up
- **Categoría:** Pull
- **Tipo:** Dinámico
- **Dificultad:** 2 (Intermedio)
- **Músculos Principales:** Dorsales, Bíceps, Trapecios
- **Músculos Secundarios:** Romboides, Antebrazos, Core
- **Equipamiento:** Barra de dominadas
- **Prerrequisitos:** Negativas controladas, Australian pull ups
- **Instrucciones:**
  1. Agarre prono (palmas hacia afuera), ancho de hombros o más
  2. Cuelga con brazos extendidos (dead hang)
  3. Inicia con retracción escapular
  4. Jala hasta que la barbilla supere la barra
  5. Baja con control
- **Tips:**
  - Ejercicio fundamental de tracción
  - No uses kipping hasta dominar estrictas
  - Codos hacia abajo y atrás

### 49. Dominadas Supinas / Chin Up (ID: 12)
- **Nombre ES:** Dominadas Supinas
- **Nombre EN:** Chin Up
- **Categoría:** Pull
- **Tipo:** Dinámico
- **Dificultad:** 2 (Intermedio)
- **Músculos Principales:** Bíceps, Dorsales
- **Músculos Secundarios:** Pecho, Trapecios
- **Equipamiento:** Barra de dominadas
- **Instrucciones:**
  1. Agarre supino (palmas hacia ti), ancho de hombros
  2. Jala hasta que la barbilla supere la barra
  3. Mayor activación de bíceps que pull up
- **Tips:**
  - Generalmente más fácil que pull up
  - Excelente para desarrollo de bíceps
  - Complementa con pull ups para balance

### 50. Dominada Agarre Neutro
- **Nombre ES:** Dominada Agarre Neutro
- **Nombre EN:** Neutral Grip Pull Up
- **Categoría:** Pull
- **Tipo:** Dinámico
- **Dificultad:** 2 (Intermedio)
- **Músculos Principales:** Dorsales, Bíceps
- **Músculos Secundarios:** Braquial, Deltoides posterior
- **Equipamiento:** Barra con agarres paralelos
- **Instrucciones:**
  1. Palmas enfrentadas entre sí
  2. Jala hasta que la barbilla supere las manos
- **Tips:**
  - Más amigable para muñecas y hombros
  - Buen punto intermedio entre chin up y pull up

### 51. Dominada con Peso (ID: 29)
- **Nombre ES:** Dominada con Peso
- **Nombre EN:** Weighted Pull Up
- **Categoría:** Pull
- **Tipo:** Dinámico
- **Dificultad:** 3 (Difícil)
- **Músculos Principales:** Dorsales, Bíceps, Trapecios
- **Músculos Secundarios:** Antebrazos, Core
- **Equipamiento:** Barra + cinturón de lastre o chaleco
- **Prerrequisitos:** 10-12 dominadas limpias
- **Instrucciones:**
  1. Añade peso con cinturón o chaleco
  2. Realiza dominadas con técnica perfecta
  3. Progresa gradualmente
- **Tips:**
  - Excelente para ganar fuerza máxima
  - No sacrifiques rango de movimiento

### 52. Dominada Alta (ID: 41)
- **Nombre ES:** Dominada Alta
- **Nombre EN:** High Pull Up
- **Categoría:** Pull
- **Tipo:** Dinámico
- **Dificultad:** 3 (Difícil)
- **Músculos Principales:** Dorsales, Bíceps
- **Músculos Secundarios:** Core, Trapecios
- **Equipamiento:** Barra de dominadas
- **Prerrequisitos:** 8-10 dominadas estrictas
- **Instrucciones:**
  1. Realiza una dominada
  2. Continúa jalando hasta que el pecho o abdomen toque la barra
  3. Baja con control
- **Tips:**
  - Preparación esencial para muscle up
  - Trabaja el rango completo de tracción

### 53. Dominada Explosiva (ID: 42)
- **Nombre ES:** Dominada Explosiva
- **Nombre EN:** Explosive Pull Up
- **Categoría:** Pull
- **Tipo:** Pliométrico
- **Dificultad:** 3 (Difícil)
- **Músculos Principales:** Dorsales, Bíceps
- **Músculos Secundarios:** Core, Trapecios
- **Equipamiento:** Barra de dominadas
- **Prerrequisitos:** High pull ups
- **Instrucciones:**
  1. Desde dead hang, jala explosivamente
  2. Genera suficiente velocidad para soltar la barra
  3. Fase de vuelo momentánea
  4. Atrapa la barra y baja con control
- **Tips:**
  - Desarrolla potencia para muscle up
  - Variación: clap pull up

### 54. Dominada Arquero
- **Nombre ES:** Dominada Arquero
- **Nombre EN:** Archer Pull Up
- **Categoría:** Pull
- **Tipo:** Dinámico
- **Dificultad:** 4 (Muy Difícil)
- **Músculos Principales:** Dorsales, Bíceps
- **Músculos Secundarios:** Core
- **Equipamiento:** Barra ancha
- **Prerrequisitos:** 12+ dominadas estrictas
- **Instrucciones:**
  1. Agarre muy ancho
  2. Jala hacia un lado
  3. El brazo contrario queda casi extendido
  4. Alterna lados
- **Tips:**
  - Progresión hacia one arm pull up
  - Mantén tensión en ambos brazos

### 55. Dominada a Una Mano (Progresiones)
- **Nombre ES:** Dominada a Una Mano
- **Nombre EN:** One Arm Pull Up
- **Categoría:** Pull
- **Tipo:** Dinámico
- **Dificultad:** 5 (Elite)
- **Músculos Principales:** Dorsales, Bíceps, Core
- **Músculos Secundarios:** Antebrazos, Oblicuos
- **Equipamiento:** Barra de dominadas
- **Prerrequisitos:** Archer pull ups, Weighted pull ups (+50% BW)
- **Instrucciones:**
  1. Agarra la barra con una mano
  2. Otra mano libre o agarrando la muñeca (asistida)
  3. Jala hasta que la barbilla supere la barra
- **Progresiones:**
  - Assisted OAP (agarrar muñeca o toalla)
  - Negative OAP (solo bajada)
  - Band assisted OAP
  - Full OAP
- **Tips:**
  - Puede tomar años dominar
  - Trabaja fuerza de agarre por separado
  - Progresiones unilaterales son clave

### 56. Muscle Up (ID: 6)
- **Nombre ES:** Muscle Up
- **Nombre EN:** Muscle Up
- **Categoría:** Pull/Push
- **Tipo:** Dinámico
- **Dificultad:** 5 (Elite)
- **Músculos Principales:** Dorsales, Pecho, Tríceps
- **Músculos Secundarios:** Bíceps, Core, Hombros
- **Equipamiento:** Barra de dominadas o anillas
- **Prerrequisitos:** 10+ dominadas, 10+ fondos, High pull ups
- **Instrucciones:**
  1. Desde dead hang, jala explosivamente
  2. Lleva el pecho sobre la barra (transición)
  3. Gira las muñecas y empuja hacia arriba
  4. Termina en posición de fondo sobre la barra
  5. Baja con control
- **Variaciones:**
  - Bar Muscle Up (barra)
  - Ring Muscle Up (anillas) - más difícil
  - Strict Muscle Up vs Kipping
- **Tips:**
  - La transición es la parte más técnica
  - False grip facilita en anillas
  - Practica la transición por separado

---

## LEGS - Ejercicios de Piernas

### 57. Sentadilla Asistida (ID: 30)
- **Nombre ES:** Sentadilla Asistida
- **Nombre EN:** Assisted Squat
- **Categoría:** Legs
- **Tipo:** Dinámico
- **Dificultad:** 0 (Principiante)
- **Músculos Principales:** Cuádriceps, Glúteos
- **Músculos Secundarios:** Isquiotibiales, Core
- **Equipamiento:** Poste, TRX, o superficie para sujetarse
- **Instrucciones:**
  1. Sujétate de algo para balance
  2. Baja en sentadilla profunda
  3. Usa mínima asistencia de los brazos
  4. Sube controladamente
- **Tips:**
  - Perfecto para aprender técnica
  - Reduce asistencia progresivamente

### 58. Sentadilla en Caja (ID: 31)
- **Nombre ES:** Sentadilla en Caja
- **Nombre EN:** Box Squat
- **Categoría:** Legs
- **Tipo:** Dinámico
- **Dificultad:** 0 (Principiante)
- **Músculos Principales:** Cuádriceps, Glúteos
- **Músculos Secundarios:** Isquiotibiales
- **Equipamiento:** Caja, banco o silla
- **Instrucciones:**
  1. Caja detrás de ti a la altura deseada
  2. Baja hasta sentarte en la caja
  3. Pausa breve
  4. Levántate sin impulso
- **Tips:**
  - Ayuda a controlar profundidad
  - Baja la altura de la caja para progresar

### 59. Sentadilla / Squat (ID: 3)
- **Nombre ES:** Sentadilla
- **Nombre EN:** Squat / Air Squat
- **Categoría:** Legs
- **Tipo:** Dinámico
- **Dificultad:** 1 (Fácil)
- **Músculos Principales:** Cuádriceps, Glúteos
- **Músculos Secundarios:** Isquiotibiales, Core, Aductores
- **Equipamiento:** Ninguno
- **Instrucciones:**
  1. Pies a la anchura de hombros o ligeramente más
  2. Puntas ligeramente hacia afuera
  3. Baja las caderas como si fueras a sentarte
  4. Rodillas en línea con los pies
  5. Profundidad: muslos paralelos o más
  6. Espalda recta, pecho arriba
- **Tips:**
  - Mantén los talones en el suelo
  - Rodillas hacia afuera, no hacia adentro
  - Core activo durante todo el movimiento

### 60. Sentadilla Bulgara (ID: 32)
- **Nombre ES:** Sentadilla Búlgara
- **Nombre EN:** Bulgarian Split Squat
- **Categoría:** Legs
- **Tipo:** Dinámico
- **Dificultad:** 2 (Intermedio)
- **Músculos Principales:** Cuádriceps, Glúteos
- **Músculos Secundarios:** Isquiotibiales, Core
- **Equipamiento:** Banco o superficie elevada
- **Prerrequisitos:** Sentadilla regular
- **Instrucciones:**
  1. Pie trasero elevado en banco
  2. Pie delantero adelantado
  3. Baja la rodilla trasera hacia el suelo
  4. Rodilla delantera no pasa mucho la punta del pie
  5. Sube con la pierna delantera
- **Tips:**
  - Excelente para fuerza unilateral
  - Trabaja ambas piernas por igual

### 61. Sentadilla Camarón (ID: 33)
- **Nombre ES:** Sentadilla Camarón
- **Nombre EN:** Shrimp Squat
- **Categoría:** Legs
- **Tipo:** Dinámico
- **Dificultad:** 4 (Muy Difícil)
- **Músculos Principales:** Cuádriceps, Glúteos
- **Músculos Secundarios:** Core, Flexores de cadera
- **Equipamiento:** Ninguno
- **Prerrequisitos:** Bulgarian split squat
- **Instrucciones:**
  1. Parado en una pierna
  2. Agarra el pie trasero detrás de ti
  3. Baja hasta que la rodilla trasera toque el suelo
  4. Sube manteniendo el equilibrio
- **Progresiones:**
  - Assisted (con soporte)
  - Beginner (rodilla no toca suelo)
  - Full Shrimp
  - Advanced (mano atrás)
- **Tips:**
  - Diferente patrón de movimiento que pistol
  - Requiere buena movilidad de cadera

### 62. Sentadilla Pistola (ID: 7)
- **Nombre ES:** Sentadilla Pistola
- **Nombre EN:** Pistol Squat
- **Categoría:** Legs
- **Tipo:** Dinámico
- **Dificultad:** 4 (Muy Difícil)
- **Músculos Principales:** Cuádriceps, Glúteos
- **Músculos Secundarios:** Core, Flexores de cadera, Isquiotibiales
- **Equipamiento:** Ninguno
- **Prerrequisitos:** Sentadilla profunda, Bulgarian split squats
- **Instrucciones:**
  1. Parado en una pierna
  2. Extiende la otra pierna al frente
  3. Baja completamente (profundo)
  4. Sube sin tocar el suelo con la otra pierna
- **Progresiones:**
  - Assisted (TRX, poste)
  - Box Pistol (sentarse en caja)
  - Negative Pistol
  - Full Pistol
- **Tips:**
  - Requiere flexibilidad de tobillo y cadera
  - Practica elevación de pierna por separado
  - Contrapeso (brazos adelante) ayuda el balance

### 63. Nordic Curl
- **Nombre ES:** Curl Nórdico
- **Nombre EN:** Nordic Curl
- **Categoría:** Legs
- **Tipo:** Dinámico
- **Dificultad:** 4 (Muy Difícil)
- **Músculos Principales:** Isquiotibiales
- **Músculos Secundarios:** Glúteos, Core
- **Equipamiento:** Algo para anclar los pies
- **Instrucciones:**
  1. Arrodíllate con los pies anclados
  2. Cuerpo recto de rodillas a cabeza
  3. Baja el torso hacia adelante lentamente
  4. Usa los isquiotibiales para frenar
  5. Empuja ligeramente con manos al final si es necesario
  6. Vuelve usando los isquiotibiales
- **Progresiones:**
  - Negative only (solo bajada)
  - Assisted (con banda)
  - Partial range
  - Full Nordic
- **Tips:**
  - Excelente para prevención de lesiones
  - Uno de los mejores ejercicios para isquios
  - Progresa el rango gradualmente

### 64. Elevación de Talones / Calf Raises
- **Nombre ES:** Elevación de Talones
- **Nombre EN:** Calf Raises
- **Categoría:** Legs
- **Tipo:** Dinámico
- **Dificultad:** 0 (Principiante)
- **Músculos Principales:** Gastrocnemios, Sóleo
- **Músculos Secundarios:** Tibial anterior (estabilización)
- **Equipamiento:** Escalón (opcional)
- **Instrucciones:**
  1. Parado en el borde de un escalón (talones colgando)
  2. Baja los talones por debajo del escalón (estiramiento)
  3. Elévate sobre las puntas de los pies
  4. Pausa arriba, baja con control
- **Variaciones:**
  - Double leg (dos piernas)
  - Single leg (una pierna) - más difícil
  - Seated (sentado, trabaja sóleo)
  - Donkey calf raise
- **Tips:**
  - Rango completo es importante
  - Pausa arriba para máxima contracción

---

## SKILLS - Ejercicios Estáticos Avanzados

### 65. German Hang
- **Nombre ES:** Colgado Alemán
- **Nombre EN:** German Hang
- **Categoría:** Skill/Mobility
- **Tipo:** Isométrico
- **Dificultad:** 2 (Intermedio)
- **Músculos Principales:** Hombros, Pecho
- **Músculos Secundarios:** Bíceps, Core
- **Equipamiento:** Anillas o barra baja
- **Instrucciones:**
  1. Desde soporte en anillas
  2. Gira el cuerpo hacia atrás pasando por inversión
  3. Termina colgado boca abajo con brazos detrás
  4. Mantén la posición (estiramiento de hombros)
- **Tips:**
  - Prerrequisito para back lever
  - Excelente movilidad de hombros
  - Ve despacio, no fuerces el rango

### 66. Tuck Back Lever (ID: 55)
- **Nombre ES:** Back Lever Recogido
- **Nombre EN:** Tuck Back Lever
- **Categoría:** Skill
- **Tipo:** Isométrico
- **Dificultad:** 3 (Difícil)
- **Músculos Principales:** Deltoides anterior, Pecho, Bíceps
- **Músculos Secundarios:** Core, Dorsales
- **Equipamiento:** Anillas o barra
- **Prerrequisitos:** German hang cómodo
- **Instrucciones:**
  1. Desde german hang o inversión
  2. Baja hasta posición horizontal
  3. Rodillas recogidas al pecho
  4. Brazos rectos, cuerpo mirando al suelo
- **Tips:**
  - Espalda horizontal, no arqueada
  - Aprieta core y glúteos

### 67. Straddle Back Lever (ID: 56)
- **Nombre ES:** Back Lever en Straddle
- **Nombre EN:** Straddle Back Lever
- **Categoría:** Skill
- **Tipo:** Isométrico
- **Dificultad:** 4 (Muy Difícil)
- **Músculos Principales:** Deltoides anterior, Pecho, Bíceps
- **Músculos Secundarios:** Core, Dorsales
- **Equipamiento:** Anillas o barra
- **Prerrequisitos:** Tuck Back Lever
- **Instrucciones:**
  1. Posición de back lever
  2. Piernas extendidas y abiertas en straddle
  3. Cuerpo horizontal
- **Tips:**
  - Más fácil que front lever para la mayoría
  - Buena progresión intermedia

### 68. Back Lever (ID: 15)
- **Nombre ES:** Back Lever
- **Nombre EN:** Back Lever
- **Categoría:** Skill
- **Tipo:** Isométrico
- **Dificultad:** 4 (Muy Difícil)
- **Músculos Principales:** Deltoides anterior, Pecho, Bíceps
- **Músculos Secundarios:** Core, Dorsales, Glúteos
- **Equipamiento:** Anillas o barra
- **Prerrequisitos:** Straddle Back Lever
- **Instrucciones:**
  1. Cuerpo completamente horizontal mirando al suelo
  2. Piernas juntas y extendidas
  3. Brazos rectos
  4. Línea recta de manos a pies
- **Tips:**
  - Más accesible que front lever o planche
  - Excelente para fuerza de hombro anterior

### 69. Bandera Humana / Human Flag (ID: 16)
- **Nombre ES:** Bandera Humana
- **Nombre EN:** Human Flag
- **Categoría:** Skill
- **Tipo:** Isométrico
- **Dificultad:** 5 (Elite)
- **Músculos Principales:** Oblicuos, Dorsales, Hombros
- **Músculos Secundarios:** Core completo, Pecho
- **Equipamiento:** Poste vertical, espaldera, o estructura adecuada
- **Prerrequisitos:** Dominadas, Side plank, Fuerza de empuje
- **Instrucciones:**
  1. Agarra un poste vertical con ambas manos
  2. Mano superior jala, mano inferior empuja
  3. Eleva el cuerpo hasta horizontal
  4. Mantén el cuerpo recto como una bandera
- **Progresiones:**
  - Vertical Flag (cuerpo vertical)
  - Tuck Human Flag
  - Straddle Human Flag
  - Full Human Flag
- **Tips:**
  - Requiere fuerza de empuje Y tracción
  - Práctica en espaldera es más fácil que poste
  - Trabajo de oblicuos es esencial

### 70. Handstand / Pino (Equilibrio)
- **Nombre ES:** Pino / Equilibrio en Manos
- **Nombre EN:** Handstand
- **Categoría:** Skill
- **Tipo:** Isométrico
- **Dificultad:** 3 (Difícil)
- **Músculos Principales:** Hombros, Trapecios, Core
- **Músculos Secundarios:** Antebrazos, Tríceps
- **Equipamiento:** Ninguno (pared para aprender)
- **Instrucciones:**
  1. Manos en el suelo, ancho de hombros
  2. Dedos abiertos, peso distribuido
  3. Patea o presiona hasta vertical
  4. Cuerpo en línea recta
  5. Mira entre las manos
- **Progresiones:**
  - Chest-to-wall handstand
  - Back-to-wall handstand
  - Kick ups
  - Freestanding hold
  - Handstand walking
- **Tips:**
  - Balance con los dedos (si caes hacia atrás, presiona dedos)
  - Hombros abiertos y activos
  - Core y glúteos apretados

### 71. Burpee (ID: 13)
- **Nombre ES:** Burpee
- **Nombre EN:** Burpee
- **Categoría:** Full Body
- **Tipo:** Dinámico/Pliométrico
- **Dificultad:** 2 (Intermedio)
- **Músculos Principales:** Todo el cuerpo
- **Músculos Secundarios:** Sistema cardiovascular
- **Equipamiento:** Ninguno
- **Instrucciones:**
  1. Desde parado, baja a sentadilla
  2. Coloca manos en el suelo
  3. Salta los pies atrás a posición de plancha
  4. Realiza una flexión (opcional)
  5. Salta los pies hacia las manos
  6. Salta verticalmente con brazos arriba
- **Variaciones:**
  - Burpee sin flexión
  - Burpee con flexión
  - Burpee con pull up (bar burpee)
  - Devil press (con mancuernas)
- **Tips:**
  - Excelente para cardio y acondicionamiento
  - Mantén ritmo constante

---

## TABLA RESUMEN DE EJERCICIOS

| ID | Nombre | Categoría | Dificultad | Músculos Principales |
|----|--------|-----------|------------|---------------------|
| 1 | Push Up | Push | 1 | Pecho, Hombros, Tríceps |
| 2 | Pull Up | Pull | 2 | Dorsales, Bíceps |
| 3 | Squat | Legs | 1 | Cuádriceps, Glúteos |
| 4 | Dips | Push | 2 | Tríceps, Pecho |
| 5 | Plank | Core | 1 | Core |
| 6 | Muscle Up | Pull/Push | 5 | Dorsales, Pecho, Tríceps |
| 7 | Pistol Squat | Legs | 4 | Cuádriceps, Glúteos |
| 8 | HSPU | Push | 5 | Hombros, Tríceps |
| 9 | L-Sit | Core | 3 | Core, Flexores cadera |
| 10 | Australian Pull Up | Pull | 1 | Dorsales, Romboides |
| 11 | Diamond Push Up | Push | 2 | Tríceps |
| 12 | Chin Up | Pull | 2 | Bíceps, Dorsales |
| 13 | Burpee | Full Body | 2 | Todo el cuerpo |
| 14 | Front Lever | Core/Skill | 5 | Dorsales, Core |
| 15 | Back Lever | Skill | 4 | Hombros, Pecho |
| 16 | Human Flag | Skill | 5 | Oblicuos, Dorsales |
| 17 | Archer Push Up | Push | 3 | Pecho, Tríceps |
| 18 | Tuck Planche | Push/Skill | 4 | Hombros, Core |
| 19 | Dragon Flag | Core | 4 | Core |
| 20 | Hanging Leg Raise | Core | 2 | Core, Flexores |
| 21 | Wall Push Up | Push | 0 | Pecho |
| 22 | Incline Push Up | Push | 0 | Pecho |
| 23 | Knee Push Up | Push | 1 | Pecho |
| 24 | Wide Push Up | Push | 1 | Pecho |
| 25 | One Arm Push Up | Push | 5 | Pecho, Core |
| 26 | Scapular Pull Up | Pull | 0 | Dorsales |
| 27 | Negative Pull Up | Pull | 1 | Dorsales |
| 28 | Band Assisted Pull Up | Pull | 1 | Dorsales |
| 29 | Weighted Pull Up | Pull | 3 | Dorsales |
| 30 | Assisted Squat | Legs | 0 | Cuádriceps |
| 31 | Box Squat | Legs | 0 | Cuádriceps |
| 32 | Bulgarian Split Squat | Legs | 2 | Cuádriceps |
| 33 | Shrimp Squat | Legs | 4 | Cuádriceps |
| 34 | Bench Dips | Push | 1 | Tríceps |
| 35 | Assisted Dips | Push | 1 | Tríceps |
| 36 | Ring Dips | Push | 3 | Tríceps, Pecho |
| 37 | Weighted Dips | Push | 3 | Tríceps, Pecho |
| 38 | Incline Plank | Core | 0 | Core |
| 39 | Side Plank | Core | 2 | Oblicuos |
| 40 | Plank Leg Lift | Core | 2 | Core |
| 41 | High Pull Up | Pull | 3 | Dorsales |
| 42 | Explosive Pull Up | Pull | 3 | Dorsales |
| 43 | Tuck L-Sit | Core | 2 | Core |
| 44 | V-Sit | Core | 4 | Core, Flexores |
| 45 | Pike Push Up | Push | 2 | Hombros |
| 46 | Elevated Pike PU | Push | 3 | Hombros |
| 47 | Wall HSPU | Push | 4 | Hombros |
| 48 | Dead Bug | Core | 0 | Core |
| 49 | Hollow Body Hold | Core | 2 | Core |
| 50 | Knee Raise | Core | 1 | Core |
| 51 | Toes to Bar | Core | 3 | Core |
| 52 | Tuck Front Lever | Core/Skill | 3 | Dorsales, Core |
| 53 | Adv Tuck Front Lever | Core/Skill | 3 | Dorsales, Core |
| 54 | Straddle Front Lever | Core/Skill | 4 | Dorsales, Core |
| 55 | Tuck Back Lever | Skill | 3 | Hombros, Pecho |
| 56 | Straddle Back Lever | Skill | 4 | Hombros, Pecho |
| 57 | Planche Lean | Push/Skill | 2 | Hombros |
| 58 | Straddle Planche | Push/Skill | 5 | Hombros, Pecho |
| 59 | Full Planche | Push/Skill | 5 | Hombros, Pecho |

---

## EQUIPAMIENTO NECESARIO POR EJERCICIO

### Sin Equipamiento (Suelo)
- Push ups y variaciones
- Squats y variaciones (excepto Bulgarian)
- Planks
- Hollow body hold
- Dead bug
- Handstand (libre)
- L-sit (en suelo)
- Burpees

### Barra de Dominadas
- Pull ups y todas las variaciones
- Chin ups
- Muscle ups
- Hanging leg raises
- Toes to bar
- Front lever
- Windshield wipers

### Barras Paralelas
- Dips y variaciones
- L-sit (más fácil que suelo)
- Korean dips
- Planche (más fácil que suelo)

### Anillas de Gimnasia
- Ring dips
- Ring muscle up
- Front lever
- Back lever
- German hang
- False grip training

### Poste Vertical / Espaldera
- Human flag

### Banco / Caja
- Bench dips
- Box squats
- Bulgarian split squats
- Step ups
- Elevated pike push ups

### Banda Elástica
- Assisted pull ups
- Assisted dips
- Assisted Nordic curls

---

## ESCALA DE DIFICULTAD

| Nivel | Nombre | Descripción |
|-------|--------|-------------|
| 0 | Principiante Absoluto | Sin experiencia previa, cualquiera puede hacerlo |
| 1 | Fácil | Principiantes con algo de práctica |
| 2 | Intermedio | Requiere semanas/meses de entrenamiento |
| 3 | Difícil | Requiere meses de entrenamiento dedicado |
| 4 | Muy Difícil | Requiere 6-12+ meses de entrenamiento |
| 5 | Elite | Puede requerir años de práctica |

---

## GRUPOS MUSCULARES

```typescript
const muscleGroups = [
  'chest',      // Pecho (pectorales)
  'back',       // Espalda (dorsales, trapecios, romboides)
  'shoulders',  // Hombros (deltoides)
  'triceps',    // Tríceps
  'biceps',     // Bíceps
  'core',       // Core (abdominales, oblicuos, transverso)
  'legs',       // Piernas (cuádriceps, isquiotibiales)
  'glutes',     // Glúteos
  'forearms',   // Antebrazos
];
```

---

## FUENTES DE INVESTIGACIÓN

- [Calisthenics.com](https://calisthenics.com)
- [GMB Fitness](https://gmb.io)
- [Calisthenics Worldwide](https://calisthenicsworldwide.com)
- [Berg Movement](https://bergmovement.com)
- [Bodyweight Training Arena](https://bodyweighttrainingarena.com)
- [Antranik.org](https://antranik.org)
- [The Movement Athlete](https://themovementathlete.com)
- [Heavyweight Calisthenics](https://heavyweightcali.com)
- [Start Bodyweight](https://startbodyweight.com)
- [Gymless](https://gymless.org)

