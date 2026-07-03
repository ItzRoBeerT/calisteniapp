-- =============================================
-- Seed data for OpenCalisthenics
-- Run this AFTER schema.sql
-- =============================================

-- Insert exercises with Spanish translations and video resources
INSERT INTO "Exercise" (id, name, description, image, muscle_group, difficulty, resources) VALUES
(1, 'Flexiones', 'Ejercicio basico para pecho, hombros y triceps. Colocate en posicion de plancha con las manos a la altura de los hombros y baja el cuerpo hasta que el pecho casi toque el suelo.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_001.jpg?download=true', ARRAY['chest', 'shoulders', 'triceps'], 1, '[{"type": "video", "url": "https://www.youtube.com/watch?v=IODxDxX7oi4", "title": "Push Up Tutorial"}]'::jsonb),
(2, 'Dominadas', 'Ejercicio fundamental para espalda y biceps. Cuelgate de una barra con agarre prono y eleva tu cuerpo hasta que la barbilla supere la barra.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_002.jpg?download=true', ARRAY['back', 'biceps'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=30NjUye3y6Q", "title": "Pull Up Tutorial"}]'::jsonb),
(3, 'Sentadilla', 'Sentadilla basica para piernas. Baja las caderas como si fueras a sentarte manteniendo la espalda recta y las rodillas alineadas con los pies.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_003.jpg?download=true', ARRAY['legs', 'glutes'], 1, '[{"type": "video", "url": "https://www.youtube.com/watch?v=zJBLDJMJiDE", "title": "Full Squat Tutorial"}]'::jsonb),
(4, 'Fondos', 'Fondos en paralelas para triceps y pecho. Sujetate en barras paralelas y baja el cuerpo flexionando los codos hasta formar un angulo de 90 grados.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_004.jpg?download=true', ARRAY['triceps', 'chest', 'shoulders'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=2z8JmcrW-As", "title": "Dip Tutorial"}]'::jsonb),
(5, 'Plancha', 'Plancha isometrica para core. Manten el cuerpo recto apoyado sobre antebrazos y puntas de los pies, activando el abdomen.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_005.jpg?download=true', ARRAY['core', 'shoulders'], 1, '[{"type": "video", "url": "https://www.youtube.com/watch?v=44ScXWFaVBs&feature=youtu.be&t=10s", "title": "Plank Tutorial"}]'::jsonb),
(6, 'Muscle Up', 'Ejercicio avanzado que combina dominada y fondo. Realiza una dominada explosiva y transiciona sobre la barra para completar un fondo.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_006.jpg?download=true', ARRAY['back', 'chest', 'triceps', 'shoulders'], 5, '[{"type": "video", "url": "https://www.youtube.com/watch?v=2FZ9t2vl1kc", "title": "Muscle Up Tutorial"}]'::jsonb),
(7, 'Sentadilla Pistola', 'Sentadilla a una pierna. Baja completamente sobre una pierna mientras mantienes la otra extendida al frente.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_007.jpg?download=true', ARRAY['legs', 'glutes', 'core'], 4, '[{"type": "video", "url": "https://youtu.be/0SN8ZaxOBpA?t=30s", "title": "Pistol Squat Tutorial"}]'::jsonb),
(8, 'Flexion en Pino', 'Flexiones en posicion de pino. Realiza una flexion mientras estas en posicion invertida contra una pared o en equilibrio libre.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_008.jpg?download=true', ARRAY['shoulders', 'triceps', 'core'], 5, '[{"type": "video", "url": "https://youtu.be/CDCHdKDx0UY?t=69", "title": "Handstand Push Up Tutorial"}]'::jsonb),
(9, 'L-Sit', 'Posicion isometrica de L. Sientate con las piernas extendidas y eleva todo el cuerpo del suelo usando solo las manos.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_009.jpg?download=true', ARRAY['core', 'triceps', 'shoulders'], 3, '[{"type": "video", "url": "https://youtu.be/4bzLorsqBNc?t=17", "title": "L-Sit Tutorial"}]'::jsonb),
(10, 'Remo Australiano', 'Dominada horizontal para principiantes. Cuelgate de una barra baja con los pies en el suelo y tira del pecho hacia la barra.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_010.jpg?download=true', ARRAY['back', 'biceps'], 1, '[{"type": "video", "url": "https://www.youtube.com/watch?v=JkG2aQO7sF8", "title": "Row Tutorial"}]'::jsonb),
(11, 'Flexion Diamante', 'Flexiones con manos juntas formando un diamante. Mayor enfasis en triceps que las flexiones regulares.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_011.jpg?download=true', ARRAY['triceps', 'chest'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=_4EGPVJuqfA", "title": "Diamond Push Up Tutorial"}]'::jsonb),
(12, 'Dominadas Supinas', 'Dominada con agarre supino. Similar a la dominada pero con las palmas mirando hacia ti, mayor enfasis en biceps.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_012.jpg?download=true', ARRAY['biceps', 'back'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=30NjUye3y6Q", "title": "Chin Up Tutorial"}]'::jsonb),
(13, 'Burpee', 'Ejercicio de cuerpo completo. Combina una sentadilla, plancha, flexion y salto en un movimiento continuo.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_013.jpg?download=true', ARRAY['legs', 'chest', 'core', 'shoulders'], 2, '[]'::jsonb),
(14, 'Front Lever', 'Posicion horizontal colgado de la barra. Manten el cuerpo completamente horizontal mirando hacia arriba.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_014.jpg?download=true', ARRAY['back', 'core', 'shoulders'], 5, '[{"type": "video", "url": "https://youtu.be/ZqCLG0hiRco?t=8", "title": "Front Lever Tutorial"}]'::jsonb),
(15, 'Back Lever', 'Posicion horizontal invertida en la barra. Manten el cuerpo horizontal mirando hacia el suelo.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_015.jpg?download=true', ARRAY['shoulders', 'back', 'core'], 4, '[{"type": "video", "url": "https://www.youtube.com/watch?v=HXaG8mJmSnU", "title": "Back Lever Tutorial"}]'::jsonb),
(16, 'Bandera Humana', 'Bandera humana. Manten el cuerpo horizontal agarrado a un poste vertical.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_016.jpg?download=true', ARRAY['core', 'shoulders', 'back'], 5, '[{"type": "video", "url": "https://youtu.be/lczvDH9Fze4?t=204", "title": "Human Flag Tutorial"}]'::jsonb),
(17, 'Flexion Arquero', 'Flexion arquero. Una mano cerca del cuerpo mientras la otra se extiende lateralmente.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_017.jpg?download=true', ARRAY['chest', 'triceps', 'shoulders'], 3, '[{"type": "video", "url": "https://youtu.be/dyDBGkJWgZE?list=PLBF8536CA2AB746EC&t=19", "title": "Archer Push Up Tutorial"}]'::jsonb),
(18, 'Tuck Planche', 'Planche con rodillas recogidas. Equilibrio sobre las manos con el cuerpo elevado y rodillas al pecho.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_018.jpg?download=true', ARRAY['shoulders', 'chest', 'core'], 4, '[{"type": "video", "url": "https://www.youtube.com/watch?v=VFYZh24e0RI", "title": "Tuck Planche Tutorial"}]'::jsonb),
(19, 'Dragon Flag', 'Ejercicio avanzado de core. Acostado boca arriba, eleva las piernas y caderas manteniendo solo los hombros en contacto con el banco.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_019.jpg?download=true', ARRAY['core'], 4, '[{"type": "video", "url": "https://www.youtube.com/watch?v=moyFIvRrS0s", "title": "Dragon Flag Tutorial"}]'::jsonb),
(20, 'Elevacion de Piernas Colgado', 'Elevacion de piernas colgado. Cuelgate de una barra y eleva las piernas rectas hasta formar un angulo de 90 grados.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_020.jpg?download=true', ARRAY['core'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=at_A-H6JTGk", "title": "Hanging Leg Raise Tutorial"}]'::jsonb),
(21, 'Flexion en Pared', 'Flexion contra la pared. El ejercicio mas basico de la progresion de flexiones, ideal para principiantes absolutos.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_010.jpg?download=true', ARRAY['chest', 'shoulders', 'triceps'], 0, '[{"type": "video", "url": "https://youtu.be/6jm4R3K4sJA?t=34", "title": "Wall Plank Tutorial"}]'::jsonb),
(22, 'Flexion Inclinada', 'Flexion inclinada con manos en superficie elevada. Reduce la carga comparado con la flexion estandar.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_001.jpg?download=true', ARRAY['chest', 'shoulders', 'triceps'], 0, '[{"type": "video", "url": "https://youtu.be/4dF1DOWzf20?t=3m56s", "title": "Incline Push Up Tutorial"}]'::jsonb),
(23, 'Flexion de Rodillas', 'Flexion con rodillas apoyadas. Version modificada que reduce la carga corporal en aproximadamente un 50%.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_001.jpg?download=true', ARRAY['chest', 'shoulders', 'triceps'], 1, '[{"type": "video", "url": "https://www.youtube.com/watch?v=IODxDxX7oi4", "title": "Push Up Tutorial"}]'::jsonb),
(24, 'Flexion Abierta', 'Flexion con manos mas separadas que el ancho de hombros. Mayor enfasis en el pecho.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_001.jpg?download=true', ARRAY['chest', 'shoulders'], 1, '[{"type": "video", "url": "http://www.youtube.com/watch?v=1yMRvsuk9Xg", "title": "Wide Push Up Tutorial"}]'::jsonb),
(25, 'Flexion a Una Mano', 'Flexion a una mano. Ejercicio avanzado que requiere gran fuerza y estabilidad del core.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_001.jpg?download=true', ARRAY['chest', 'shoulders', 'triceps', 'core'], 5, '[{"type": "video", "url": "https://youtu.be/MlRCAJbwjMs?t=65", "title": "One Arm Push Up Tutorial"}]'::jsonb),
(26, 'Dominada Escapular', 'Activacion escapular colgado de la barra. Primer paso para construir fuerza de tiron.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_002.jpg?download=true', ARRAY['back', 'shoulders'], 0, '[{"type": "video", "url": "https://youtu.be/FgYoc4O-cio?t=1m21s", "title": "Scapular Pull Tutorial"}]'::jsonb),
(27, 'Dominada Negativa', 'Dominada negativa. Salta arriba y baja lentamente controlando el movimiento.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_002.jpg?download=true', ARRAY['back', 'biceps'], 1, '[{"type": "video", "url": "https://www.youtube.com/watch?v=gbPURTSxQLY", "title": "Pull Up Negative Tutorial"}]'::jsonb),
(28, 'Dominada con Banda', 'Dominada asistida con banda elastica. La banda reduce el peso corporal que debes levantar.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_002.jpg?download=true', ARRAY['back', 'biceps'], 1, '[{"type": "video", "url": "https://www.youtube.com/watch?v=30NjUye3y6Q", "title": "Pull Up Tutorial"}]'::jsonb),
(29, 'Dominada con Peso', 'Dominada con peso adicional. Progresion avanzada para aumentar la fuerza de tiron.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_002.jpg?download=true', ARRAY['back', 'biceps'], 3, '[{"type": "video", "url": "https://www.youtube.com/watch?v=30NjUye3y6Q", "title": "Weighted Pull Up Tutorial"}]'::jsonb),
(30, 'Sentadilla Asistida', 'Sentadilla asistida sujetandose de algo. Ideal para aprender la tecnica correcta.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_003.jpg?download=true', ARRAY['legs', 'glutes'], 0, '[{"type": "video", "url": "https://www.youtube.com/watch?v=OuR_Fp7AB0c", "title": "Assisted Squat Tutorial"}]'::jsonb),
(31, 'Sentadilla en Caja', 'Sentadilla a una caja o banco. Ayuda a controlar la profundidad y la tecnica.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_003.jpg?download=true', ARRAY['legs', 'glutes'], 0, '[{"type": "video", "url": "https://www.youtube.com/watch?v=zJBLDJMJiDE", "title": "Box Squat Tutorial"}]'::jsonb),
(32, 'Sentadilla Bulgara', 'Sentadilla bulgara con pie trasero elevado. Trabaja cada pierna de forma unilateral.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_003.jpg?download=true', ARRAY['legs', 'glutes', 'core'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=kkdmHTASZg8&feature=youtu.be&t=1m15s", "title": "Bulgarian Split Squat Tutorial"}]'::jsonb),
(33, 'Sentadilla Camaron', 'Sentadilla camaron. Variante avanzada de sentadilla a una pierna con la pierna trasera sujeta.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_003.jpg?download=true', ARRAY['legs', 'glutes', 'core'], 4, '[{"type": "video", "url": "https://www.youtube.com/watch?v=_FBuC-VPbRY", "title": "Shrimp Squat Tutorial"}]'::jsonb),
(34, 'Fondos en Banco', 'Fondos en banco. Version mas facil de los fondos usando un banco o silla.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_004.jpg?download=true', ARRAY['triceps', 'chest'], 1, '[{"type": "video", "url": "https://www.youtube.com/watch?v=jWHKAXYNKfw", "title": "Bench Dip Tutorial"}]'::jsonb),
(35, 'Fondos Asistidos', 'Fondos asistidos con banda o maquina. Reduce la carga corporal para construir fuerza.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_004.jpg?download=true', ARRAY['triceps', 'chest', 'shoulders'], 1, '[{"type": "video", "url": "https://www.youtube.com/watch?v=2z8JmcrW-As", "title": "Assisted Dip Tutorial"}]'::jsonb),
(36, 'Fondos en Anillas', 'Fondos en anillas. Requiere mayor estabilidad y fuerza que los fondos en paralelas.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_004.jpg?download=true', ARRAY['triceps', 'chest', 'shoulders', 'core'], 3, '[{"type": "video", "url": "https://www.youtube.com/watch?v=DaNedgnJjB0", "title": "Ring Dip Tutorial"}]'::jsonb),
(37, 'Fondos con Peso', 'Fondos con peso adicional. Progresion para aumentar la fuerza de empuje.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_004.jpg?download=true', ARRAY['triceps', 'chest', 'shoulders'], 3, '[{"type": "video", "url": "https://www.youtube.com/watch?v=2z8JmcrW-As", "title": "Weighted Dip Tutorial"}]'::jsonb),
(38, 'Plancha Inclinada', 'Plancha inclinada con manos en superficie elevada. Version mas facil de la plancha.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_005.jpg?download=true', ARRAY['core'], 0, '[{"type": "video", "url": "https://youtu.be/6jm4R3K4sJA?t=34", "title": "Incline Plank Tutorial"}]'::jsonb),
(39, 'Plancha Lateral', 'Plancha lateral. Trabaja los oblicuos y la estabilidad lateral del core.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_005.jpg?download=true', ARRAY['core', 'shoulders'], 2, '[{"type": "video", "url": "https://youtu.be/44ScXWFaVBs?t=74", "title": "Side Plank Tutorial"}]'::jsonb),
(40, 'Plancha con Elevacion de Pierna', 'Plancha con elevacion de pierna. Aumenta la demanda de estabilidad del core.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_005.jpg?download=true', ARRAY['core', 'shoulders', 'glutes'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=44ScXWFaVBs&feature=youtu.be&t=10s", "title": "Plank Leg Lift Tutorial"}]'::jsonb),
(41, 'Dominada Alta', 'Dominada alta llevando la barra al pecho o mas abajo. Prepara para el muscle up.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_006.jpg?download=true', ARRAY['back', 'biceps', 'shoulders'], 3, '[{"type": "video", "url": "https://www.youtube.com/watch?v=PmdNNN8nLGI", "title": "C2B Pull Up Tutorial"}]'::jsonb),
(42, 'Dominada Explosiva', 'Dominada explosiva con fase de vuelo. Desarrolla la potencia necesaria para el muscle up.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_006.jpg?download=true', ARRAY['back', 'biceps', 'shoulders'], 4, '[{"type": "video", "url": "https://www.youtube.com/watch?v=2FZ9t2vl1kc", "title": "Explosive Pull Up Tutorial"}]'::jsonb),
(43, 'L-Sit Recogido', 'L-Sit con rodillas recogidas. Primera progresion hacia el L-Sit completo.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_009.jpg?download=true', ARRAY['core', 'triceps'], 2, '[{"type": "video", "url": "https://youtu.be/IUZJoSP66HI?t=178", "title": "Tuck L-Sit Tutorial"}]'::jsonb),
(44, 'V-Sit', 'Posicion en V con piernas elevadas por encima de la horizontal. Progresion avanzada del L-Sit.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_009.jpg?download=true', ARRAY['core', 'triceps', 'shoulders'], 4, '[{"type": "video", "url": "https://www.youtube.com/watch?v=GbZeD4q_cSE", "title": "V-Sit Tutorial"}]'::jsonb),
(45, 'Flexion Pike', 'Flexion en pike. Simula el movimiento de la flexion en pino con menos carga.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_008.jpg?download=true', ARRAY['shoulders', 'triceps'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=1Jjjyp4uhks#t=26s", "title": "Pike Push Up Tutorial"}]'::jsonb),
(46, 'Flexion Pike Elevada', 'Flexion pike con pies elevados. Mayor carga en los hombros que el pike normal.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_008.jpg?download=true', ARRAY['shoulders', 'triceps', 'core'], 3, '[{"type": "video", "url": "https://www.youtube.com/watch?v=ZnsLpLhywgk&feature=youtu.be&t=50", "title": "Decline Pike Push Up Tutorial"}]'::jsonb),
(47, 'Flexion en Pino contra Pared', 'Flexion en pino contra la pared. Version asistida de la flexion en pino libre.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_008.jpg?download=true', ARRAY['shoulders', 'triceps', 'core'], 4, '[{"type": "video", "url": "https://www.youtube.com/watch?v=r-aiCMOOhNQ", "title": "Wall Handstand Push Up Tutorial"}]'::jsonb),
(48, 'Dead Bug', 'Ejercicio de core tumbado boca arriba moviendo brazos y piernas de forma alterna.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_005.jpg?download=true', ARRAY['core'], 1, '[{"type": "video", "url": "https://www.youtube.com/watch?v=44ScXWFaVBs&feature=youtu.be&t=10s", "title": "Dead Bug Tutorial"}]'::jsonb),
(49, 'Hollow Body Hold', 'Posicion hollow con espalda baja pegada al suelo. Fundamental para gimnasia.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_005.jpg?download=true', ARRAY['core'], 2, '[{"type": "video", "url": "https://youtu.be/XzQe1S91Fr0?t=11", "title": "Hollow Hold Tutorial"}]'::jsonb),
(50, 'Elevacion de Rodillas', 'Elevacion de rodillas colgado. Version mas facil de la elevacion de piernas.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_020.jpg?download=true', ARRAY['core'], 1, '[{"type": "video", "url": "https://www.youtube.com/watch?v=at_A-H6JTGk", "title": "Knee Raise Tutorial"}]'::jsonb),
(51, 'Toes to Bar', 'Llevar los pies a la barra colgado. Progresion avanzada de la elevacion de piernas.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_020.jpg?download=true', ARRAY['core', 'back'], 3, '[{"type": "video", "url": "https://www.youtube.com/watch?v=at_A-H6JTGk", "title": "Toes to Bar Tutorial"}]'::jsonb),
(52, 'Tuck Front Lever', 'Front lever con rodillas recogidas al pecho. Primera progresion del front lever.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_014.jpg?download=true', ARRAY['back', 'core'], 3, '[{"type": "video", "url": "https://www.youtube.com/watch?v=JxlKAuD9gkA", "title": "Tuck Front Lever Tutorial"}]'::jsonb),
(53, 'Advanced Tuck Front Lever', 'Front lever con rodillas ligeramente extendidas. Progresion intermedia.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_014.jpg?download=true', ARRAY['back', 'core', 'shoulders'], 4, '[{"type": "video", "url": "https://www.youtube.com/watch?v=NicnELGtOSE", "title": "Advanced Tuck Front Lever Tutorial"}]'::jsonb),
(54, 'Straddle Front Lever', 'Front lever con piernas abiertas. Progresion avanzada hacia el full front lever.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_014.jpg?download=true', ARRAY['back', 'core', 'shoulders'], 5, '[{"type": "video", "url": "https://www.youtube.com/watch?v=PR-mHqduhtQ", "title": "Straddle Front Lever Tutorial"}]'::jsonb),
(55, 'Tuck Back Lever', 'Back lever con rodillas recogidas. Primera progresion del back lever.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_015.jpg?download=true', ARRAY['shoulders', 'back', 'core'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=LfyGMZh-Bz4", "title": "Tuck Back Lever Tutorial"}]'::jsonb),
(56, 'Straddle Back Lever', 'Back lever con piernas abiertas. Progresion hacia el full back lever.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_015.jpg?download=true', ARRAY['shoulders', 'back', 'core'], 3, '[{"type": "video", "url": "https://youtu.be/HXaG8mJmSnU?t=215", "title": "Straddle Back Lever Tutorial"}]'::jsonb),
(57, 'Planche Lean', 'Inclinacion de planche en posicion de flexion. Desarrolla fuerza de empuje.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_018.jpg?download=true', ARRAY['shoulders', 'chest', 'core'], 2, '[{"type": "video", "url": "https://youtu.be/liXL9oE3KzE?t=23", "title": "Planche Lean Tutorial"}]'::jsonb),
(58, 'Straddle Planche', 'Planche con piernas abiertas. Progresion avanzada hacia el full planche.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_018.jpg?download=true', ARRAY['shoulders', 'chest', 'core'], 5, '[{"type": "video", "url": "https://youtu.be/dHLYwZV96zw?t=294", "title": "Straddle Planche Tutorial"}]'::jsonb),
(59, 'Full Planche', 'Planche completa con piernas juntas y extendidas. Uno de los ejercicios mas dificiles.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_018.jpg?download=true', ARRAY['shoulders', 'chest', 'core'], 5, '[{"type": "video", "url": "https://www.youtube.com/watch?v=acij_BzyXRg", "title": "Full Planche Tutorial"}]'::jsonb),
(60, 'Curl Nordico', 'Ejercicio avanzado para isquiotibiales. Arrodillate con los pies anclados y baja el cuerpo hacia el suelo controlando el movimiento con los isquiotibiales.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_007.jpg?download=true', ARRAY['legs'], 4, '[{"type": "video", "url": "https://www.youtube.com/watch?v=d8AAPcYxPo8", "title": "Nordic Curl Tutorial"}]'::jsonb),
(61, 'Elevacion de Talones', 'Ejercicio basico para pantorrillas. De pie, eleva los talones del suelo contrayendo los gemelos y baja de forma controlada.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_003.jpg?download=true', ARRAY['legs'], 0, '[{"type": "video", "url": "https://www.youtube.com/watch?v=487aR3A7HvM", "title": "Calf Raise Tutorial"}]'::jsonb),
(62, 'Limpiaparabrisas', 'Ejercicio avanzado de core rotacional. Colgado de la barra, eleva las piernas y rotalas de lado a lado manteniendo el control.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_020.jpg?download=true', ARRAY['core'], 4, '[{"type": "video", "url": "https://www.youtube.com/watch?v=moyFIvRrS0s", "title": "Windshield Wipers Tutorial"}]'::jsonb),
(63, 'Colgado Aleman', 'Posicion de movilidad en anillas o barra baja. Cuelgate con los brazos detras del cuerpo estirando hombros y pecho.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_015.jpg?download=true', ARRAY['shoulders', 'chest'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=5KaDOUeMY98", "title": "German Hang Tutorial"}]'::jsonb),
(64, 'Pino', 'Equilibrio invertido sobre las manos. Manten el cuerpo recto y alineado mientras te sostienes boca abajo.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_008.jpg?download=true', ARRAY['shoulders', 'core'], 3, '[{"type": "video", "url": "https://www.youtube.com/watch?v=N3K9SMNKL7Y", "title": "Handstand Tutorial"}]'::jsonb),
(65, 'Flexion Pseudo Planche', 'Flexion con manos a la altura de las caderas y cuerpo inclinado hacia adelante. Prepara para la planche.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_001.jpg?download=true', ARRAY['shoulders', 'chest', 'triceps', 'core'], 3, '[{"type": "video", "url": "http://www.youtube.com/watch?v=Cdmg0CfMZeo", "title": "Pseudo Planche Push Up Tutorial"}]'::jsonb),
(66, 'Dominada Arquero', 'Dominada unilateral con un brazo estirado lateralmente. Transfiere mas carga a un lado del cuerpo.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_002.jpg?download=true', ARRAY['back', 'biceps', 'core'], 4, '[{"type": "video", "url": "https://youtu.be/vdjWgw98EeI?t=1m52s", "title": "Archer Pull Up Tutorial"}]'::jsonb),
(67, 'Dominada a Una Mano', 'Dominada completa usando solo un brazo. Uno de los ejercicios de tiron mas avanzados de la calistenia.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_002.jpg?download=true', ARRAY['back', 'biceps', 'core'], 5, '[{"type": "video", "url": "https://www.youtube.com/watch?v=vdjWgw98EeI", "title": "One Arm Pull Up Tutorial"}]'::jsonb),
(68, 'Flexion con Palmada', 'Flexion pliometrica explosiva. Empuja con fuerza para elevar las manos del suelo y dar una palmada antes de aterrizar.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_001.jpg?download=true', ARRAY['chest', 'triceps', 'shoulders'], 3, '[{"type": "video", "url": "https://www.youtube.com/watch?v=IODxDxX7oi4", "title": "Clap Push Up Tutorial"}]'::jsonb),
(69, 'Fondos Coreanos', 'Fondos con las manos detras del cuerpo en una barra baja. Trabaja intensamente los triceps y hombros.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_004.jpg?download=true', ARRAY['triceps', 'shoulders', 'core'], 4, '[{"type": "video", "url": "https://www.youtube.com/watch?v=9mKyrPmmPt0", "title": "Korean Dip Tutorial"}]'::jsonb),
(70, 'Front Lever a Una Pierna', 'Front lever con una pierna extendida y la otra recogida. Progresion avanzada hacia el front lever completo.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_014.jpg?download=true', ARRAY['back', 'core'], 4, '[{"type": "video", "url": "https://www.youtube.com/watch?v=HzcWRdP78Wo", "title": "One Leg Front Lever Tutorial"}]'::jsonb),
(71, 'Planche Recogida Avanzada', 'Planche con caderas extendidas pero rodillas aun recogidas. Progresion entre el tuck planche y el straddle planche.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_018.jpg?download=true', ARRAY['shoulders', 'chest', 'core'], 4, '[{"type": "video", "url": "https://youtu.be/oLUHPdRF2vo?t=131", "title": "Advanced Tuck Planche Tutorial"}]'::jsonb),
(72, 'Bicicleta con Banda', 'Ejercicio de core con movimiento de bicicleta usando banda elastica. Fortalece los abdominales y los flexores de cadera.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_005.jpg?download=true', ARRAY['core'], 1, '[{"type": "video", "url": "https://www.youtube.com/watch?v=ikgByza4jHo", "title": "Bicycle with Band Tutorial"}]'::jsonb),
(73, 'Pull Over con Banda', 'Ejercicio de espalda y hombros con banda anclada arriba. Trabaja los dorsales en su rango de movimiento completo.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_002.jpg?download=true', ARRAY['back', 'shoulders'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=iyloF81IcnA", "title": "Pull Over with Band Tutorial"}]'::jsonb),
(74, 'Press de Pecho con Banda', 'Version del press de pecho con banda elastica. Activa el pecho, hombros y triceps con resistencia progresiva.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_001.jpg?download=true', ARRAY['chest', 'shoulders', 'triceps'], 1, '[{"type": "video", "url": "https://www.youtube.com/watch?v=bHDdxgvS6po", "title": "Chest Press with Band Tutorial"}]'::jsonb),
(75, 'Estocada con Apertura', 'Combina una estocada con una apertura de pecho usando banda elastica. Trabaja piernas y pecho simultaneamente.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_003.jpg?download=true', ARRAY['chest', 'legs'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=aRUL4Pd7nIo", "title": "Lunge Fly Tutorial"}]'::jsonb),
(76, 'Curl de Biceps con Anclaje Bajo', 'Curl de biceps con banda anclada abajo. Trabaja los biceps con resistencia constante durante todo el recorrido.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_010.jpg?download=true', ARRAY['biceps'], 1, '[{"type": "video", "url": "https://www.youtube.com/watch?v=N-mj10Pd_8s", "title": "Bicep Curl Low Anchor Tutorial"}]'::jsonb),
(77, 'Curl y Press con Banda', 'Combinacion de curl de biceps y press de hombros con banda. Ejercicio compuesto para brazos y hombros.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_010.jpg?download=true', ARRAY['biceps', 'shoulders'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=_-Eo2S5j0o8", "title": "Curl Press Tutorial"}]'::jsonb),
(78, 'Press de Hombros con Banda', 'Press de hombros con banda elastica. Trabaja los deltoides y triceps con resistencia ajustable.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_010.jpg?download=true', ARRAY['shoulders', 'triceps'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=UdZTcqJZUfc", "title": "Shoulder Press with Band Tutorial"}]'::jsonb),
(79, 'Elevacion de Talones con Banda', 'Elevacion de talones con resistencia de banda. Fortalece las pantorrillas con carga adicional.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_003.jpg?download=true', ARRAY['legs'], 1, '[{"type": "video", "url": "https://www.youtube.com/watch?v=W2oB4OPTVwQ", "title": "Calf Raise with Band Tutorial"}]'::jsonb),
(80, 'Giro Ruso con Banda', 'Giro ruso con resistencia de banda elastica. Trabaja los oblicuos y el core rotacional.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_005.jpg?download=true', ARRAY['core'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=jiQ12Hc-oCA", "title": "Russian Twist with Band Tutorial"}]'::jsonb),
(81, 'Jalon al Pecho con Banda', 'Jalon de dorsales con banda anclada arriba. Simula el ejercicio de jalon en maquina para trabajar la espalda.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_002.jpg?download=true', ARRAY['back', 'biceps'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=ybqelSZbR9k", "title": "Lat Pull with Band Tutorial"}]'::jsonb),
(82, 'Apertura de Pecho con Banda', 'Apertura de pecho con banda elastica. Trabaja el pecho en un rango de movimiento amplio con resistencia constante.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_001.jpg?download=true', ARRAY['chest'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=3qbXyq5JJn4", "title": "Chest Fly with Band Tutorial"}]'::jsonb),
(83, 'Jumping Jacks con Banda', 'Jumping jacks con banda elastica en los pies. Aumenta la resistencia y el reclutamiento muscular del ejercicio clasico.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_013.jpg?download=true', ARRAY['legs', 'shoulders'], 1, '[{"type": "video", "url": "https://www.youtube.com/watch?v=elSLN1haaZE", "title": "Jumping Jacks with Band Tutorial"}]'::jsonb),
(84, 'Extension de Triceps con Banda', 'Extension de triceps con banda anclada. Aisla el triceps con resistencia ajustable segun el nivel.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_010.jpg?download=true', ARRAY['triceps'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=GbOi03nCGQ8", "title": "Tricep Extension with Band Tutorial"}]'::jsonb),
(85, 'Estocada con Elevacion Frontal', 'Combina una estocada con elevacion frontal de brazos usando banda. Trabaja piernas y hombros a la vez.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_003.jpg?download=true', ARRAY['legs', 'shoulders'], 3, '[{"type": "video", "url": "https://www.youtube.com/watch?v=DIHf04L0byc", "title": "Lunge Front Raise Tutorial"}]'::jsonb),
(86, 'Remo al Menton con Banda', 'Remo al menton con banda elastica. Trabaja hombros y parte superior de la espalda.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_002.jpg?download=true', ARRAY['shoulders', 'back'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=ETndAAF3UQE", "title": "Upright Row with Band Tutorial"}]'::jsonb),
(87, 'Sentadilla Trasera con Banda', 'Sentadilla con banda elastica sobre los hombros. Añade resistencia a la sentadilla clasica para mayor activacion muscular.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_003.jpg?download=true', ARRAY['legs', 'glutes'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=uNk9S9--KFk", "title": "Back Squat with Band Tutorial"}]'::jsonb),
(88, 'Plancha en Cruz con Banda', 'Variante de plancha con banda elastica que trabaja la estabilidad antirotacional del core.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_005.jpg?download=true', ARRAY['core', 'shoulders'], 3, '[{"type": "video", "url": "https://www.youtube.com/watch?v=B6zRUYtmYr0", "title": "Cross Plank Tutorial"}]'::jsonb),
(89, 'Patada de Triceps con Banda', 'Patada de triceps con banda elastica. Extiende el codo contra la resistencia para trabajar el triceps.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_010.jpg?download=true', ARRAY['triceps'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=JJ8ouKzsNXM", "title": "Tricep Kickback with Band Tutorial"}]'::jsonb),
(90, 'Estocada y Press', 'Combinacion de estocada y press de hombros con banda. Ejercicio compuesto que trabaja todo el cuerpo.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_003.jpg?download=true', ARRAY['legs', 'shoulders', 'triceps'], 3, '[{"type": "video", "url": "https://www.youtube.com/watch?v=HA1LTcH3kTc", "title": "Lunge Press Tutorial"}]'::jsonb),
(91, 'Elevacion en L con Banda', 'Elevacion lateral y frontal en L usando banda elastica. Trabaja los tres fasciculos del deltoides.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_010.jpg?download=true', ARRAY['shoulders'], 3, '[{"type": "video", "url": "https://www.youtube.com/watch?v=XgVXPI5vh2U", "title": "L Raise Tutorial"}]'::jsonb),
(92, 'Estocada con Banda', 'Estocada clasica con banda elastica en los pies. Añade resistencia para mayor activacion de gluteos y cuadriceps.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_003.jpg?download=true', ARRAY['legs', 'glutes'], 1, '[{"type": "video", "url": "https://www.youtube.com/watch?v=PvYiSZ-vHbQ", "title": "Lunge with Band Tutorial"}]'::jsonb),
(93, 'Giro Oblicuo con Banda', 'Giro oblicuo con banda anclada. Trabaja los oblicuos con resistencia angular para fortalecer el core rotacional.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_005.jpg?download=true', ARRAY['core'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=8t-X9JlKO4E", "title": "Oblique Twist Tutorial"}]'::jsonb),
(94, 'Curl de Biceps con Anclaje Alto', 'Curl de biceps con banda anclada en alto. Cambia el angulo de resistencia para mayor activacion muscular.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_010.jpg?download=true', ARRAY['biceps'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=JvQDjpd6NcE", "title": "Bicep Curl High Anchor Tutorial"}]'::jsonb),
(95, 'Sentadilla Clean con Banda', 'Combinacion de sentadilla y clean con banda elastica. Ejercicio olimpico adaptado de alta intensidad.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_003.jpg?download=true', ARRAY['legs', 'glutes', 'shoulders', 'core'], 4, '[{"type": "video", "url": "https://www.youtube.com/watch?v=hJy-5YhjxRU", "title": "Squat Clean with Band Tutorial"}]'::jsonb),
(96, 'Circulos de Brazos con Banda', 'Circulos de brazos con banda elastica. Ejercicio de calentamiento y movilidad que activa los hombros.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_010.jpg?download=true', ARRAY['shoulders'], 1, '[{"type": "video", "url": "https://www.youtube.com/watch?v=LojwSM_xUy0", "title": "Arm Circles with Band Tutorial"}]'::jsonb),
(97, 'Curl de Isquiotibiales con Banda', 'Curl de isquiotibiales con banda elastica. Trabaja los isquiotibiales con resistencia ajustable.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_003.jpg?download=true', ARRAY['legs'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=Ljw3VE-uO7U", "title": "Hamstring Curl with Band Tutorial"}]'::jsonb),
(98, 'Abdominales con Banda', 'Crunch abdominal con resistencia de banda elastica. Aumenta la intensidad de los abdominales clasicos.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_005.jpg?download=true', ARRAY['core'], 1, '[{"type": "video", "url": "https://www.youtube.com/watch?v=RVDf_3OLnEA", "title": "Crunches with Band Tutorial"}]'::jsonb),
(99, 'Remo con Banda', 'Remo con banda elastica anclada al frente. Trabaja los musculos de la espalda media y los biceps.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_002.jpg?download=true', ARRAY['back', 'biceps'], 1, '[{"type": "video", "url": "https://www.youtube.com/watch?v=XQoyjX_ndaA", "title": "Band Row Tutorial"}]'::jsonb),
(100, 'Flexiones con Resistencia', 'Flexiones con banda elastica añadiendo resistencia. Aumenta la dificultad del push-up clasico significativamente.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_001.jpg?download=true', ARRAY['chest', 'triceps', 'shoulders'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=vu4RhVkxldw", "title": "Band Resisted Push Up Tutorial"}]'::jsonb),
(101, 'Rodillas Altas con Banda', 'Rodillas altas con banda elastica en los pies. Trabaja las piernas y el core con resistencia adicional.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_013.jpg?download=true', ARRAY['legs', 'core'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=Gi1RVvTQ6fQ", "title": "High Knees with Band Tutorial"}]'::jsonb),
(102, 'Flexion Diamante con Banda', 'Flexion diamante con banda elastica añadiendo resistencia extra. Mayor enfasis en triceps con carga adicional.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_001.jpg?download=true', ARRAY['triceps', 'chest'], 3, '[{"type": "video", "url": "https://www.youtube.com/watch?v=xdKLhwCtUx4", "title": "Diamond Push Up with Band Tutorial"}]'::jsonb),
(103, 'Thruster con Banda', 'Squat y press de hombros en un movimiento continuo con banda. Ejercicio de alta intensidad para todo el cuerpo.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_003.jpg?download=true', ARRAY['legs', 'shoulders', 'core'], 3, '[{"type": "video", "url": "https://www.youtube.com/watch?v=CJdwy1h6z2A", "title": "Thruster with Band Tutorial"}]'::jsonb),
(104, 'Apertura de Deltoides', 'Apertura lateral de deltoides con banda elastica. Trabaja el deltoides lateral de forma aislada.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_010.jpg?download=true', ARRAY['shoulders'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=9ZaJNPMpYGk", "title": "Deltoid Fly Tutorial"}]'::jsonb),
(105, 'Sentadilla Frontal con Banda', 'Sentadilla frontal con banda elastica. Mayor activacion de cuadriceps que la sentadilla trasera.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_003.jpg?download=true', ARRAY['legs', 'glutes', 'core'], 3, '[{"type": "video", "url": "https://www.youtube.com/watch?v=Om6bxjmTNdI", "title": "Front Squat with Band Tutorial"}]'::jsonb),
(106, 'Toque de Talones con Banda', 'Toque de talones con resistencia de banda. Trabaja los oblicuos y el abdomen lateral.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_005.jpg?download=true', ARRAY['core'], 1, '[{"type": "video", "url": "https://www.youtube.com/watch?v=QVLSUDe5MAE", "title": "Heel Touches Tutorial"}]'::jsonb),
(107, 'Peso Muerto Rumano con Banda', 'Peso muerto rumano con banda elastica. Trabaja los isquiotibiales y gluteos con resistencia progresiva.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_003.jpg?download=true', ARRAY['legs', 'glutes', 'back'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=eFBYZk91B54", "title": "Romanian Deadlift with Band Tutorial"}]'::jsonb),
(108, 'Flexion Spiderman con Banda', 'Flexion spiderman con banda elastica. Combina flexion con rotacion de cadera para trabajar pecho y core.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_001.jpg?download=true', ARRAY['chest', 'core'], 3, '[{"type": "video", "url": "https://www.youtube.com/watch?v=RZtNSZSBEUI", "title": "Spiderman Push Up Tutorial"}]'::jsonb),
(109, 'Estocada con Remo', 'Combinacion de estocada con remo de espalda usando banda. Ejercicio compuesto que trabaja piernas y espalda.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_003.jpg?download=true', ARRAY['back', 'legs'], 3, '[{"type": "video", "url": "https://www.youtube.com/watch?v=wl4iDmKlugs", "title": "Lunge Row Tutorial"}]'::jsonb),
(110, 'Sentadilla Lateral con Banda', 'Sentadilla lateral o sumo con banda elastica. Trabaja el interior de los muslos y los gluteos.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_003.jpg?download=true', ARRAY['legs', 'glutes'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=Ix_nABnN3CE", "title": "Side Squat with Band Tutorial"}]'::jsonb),
(111, 'Patada de Flutter con Banda', 'Flutter kick con banda elastica en los tobillos. Trabaja el core inferior con resistencia adicional.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_005.jpg?download=true', ARRAY['core'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=1np7snhyxRo", "title": "Flutter Kick Tutorial"}]'::jsonb),
(112, 'Remo Alto con Banda', 'Remo alto con banda hacia los hombros. Trabaja los trapecios y la parte superior de la espalda.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_002.jpg?download=true', ARRAY['back', 'shoulders'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=-izDZHGjM10", "title": "High Row Tutorial"}]'::jsonb),
(113, 'Flexion con Palmada con Banda', 'Flexion explosiva con palmada usando banda de resistencia. Combina pliometria con resistencia adicional.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_001.jpg?download=true', ARRAY['chest', 'triceps'], 4, '[{"type": "video", "url": "https://www.youtube.com/watch?v=1tuxC9sG5LQ", "title": "Clap Push Up with Band Tutorial"}]'::jsonb),
(114, 'Sentadilla y Remo', 'Combinacion de sentadilla y remo con banda elastica. Ejercicio compuesto para piernas y espalda.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_003.jpg?download=true', ARRAY['back', 'legs'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=X1-_BFAWQbw", "title": "Squat Row Tutorial"}]'::jsonb),
(115, 'Extension en X con Banda', 'Extension cruzada de brazos con banda. Trabaja pecho, espalda y hombros en un movimiento diagonal.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_001.jpg?download=true', ARRAY['chest', 'back', 'shoulders'], 3, '[{"type": "video", "url": "https://www.youtube.com/watch?v=tlMh7rhd2-U", "title": "X Arm Extension Tutorial"}]'::jsonb),
(116, 'Sentadilla con Giro', 'Sentadilla combinada con giro de tronco usando banda. Trabaja piernas y el core rotacional.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_003.jpg?download=true', ARRAY['legs', 'core'], 3, '[{"type": "video", "url": "https://www.youtube.com/watch?v=4bYlLToVYQE", "title": "Squat Twist Tutorial"}]'::jsonb),
(117, 'Flexion Pike con Banda', 'Flexion pike con banda elastica añadiendo resistencia. Mayor carga para los hombros en posicion invertida.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_001.jpg?download=true', ARRAY['shoulders', 'triceps'], 3, '[{"type": "video", "url": "https://www.youtube.com/watch?v=6qyJNW0AuBs", "title": "Pike Push Up with Band Tutorial"}]'::jsonb),
(118, 'Split Squat con Banda', 'Split squat con banda elastica bajo los pies. Trabaja cada pierna unilateralmente con resistencia adicional.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_003.jpg?download=true', ARRAY['legs', 'glutes'], 3, '[{"type": "video", "url": "https://www.youtube.com/watch?v=EWvAwC4FdQU", "title": "Split Squat with Band Tutorial"}]'::jsonb),
(119, 'Crunch Antirotacion con Banda', 'Crunch con resistencia antirotacional de banda. Trabaja la estabilidad del core ante fuerzas rotacionales.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_005.jpg?download=true', ARRAY['core'], 3, '[{"type": "video", "url": "https://www.youtube.com/watch?v=C46tTtsCi6U", "title": "Anti-Rotation Crunch Tutorial"}]'::jsonb),
(120, 'Sentadilla Pistola Asistida con Banda', 'Sentadilla pistola asistida con banda elastica. La banda reduce la carga para aprender la tecnica de la pistola.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_003.jpg?download=true', ARRAY['legs', 'glutes', 'core'], 4, '[{"type": "video", "url": "https://www.youtube.com/watch?v=zrawScWAi8g", "title": "Pistol Squat with Band Tutorial"}]'::jsonb),
(121, 'Rodillas al Pecho con Banda', 'Elevacion de rodillas al pecho con resistencia de banda. Trabaja los flexores de cadera y el core.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_005.jpg?download=true', ARRAY['core', 'legs'], 1, '[{"type": "video", "url": "https://www.youtube.com/watch?v=cFmGU8ZO2Z0", "title": "Knees to Chest Tutorial"}]'::jsonb),
(122, 'Estocada Levitante con Banda', 'Estocada levitante con banda elastica. Variante avanzada de estocada que trabaja el equilibrio y los gluteos.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_003.jpg?download=true', ARRAY['legs', 'glutes'], 3, '[{"type": "video", "url": "https://www.youtube.com/watch?v=8jPq9b4ghio", "title": "Levitating Lunge Tutorial"}]'::jsonb),
(123, 'Elevacion de Piernas con Banda', 'Elevacion de piernas con resistencia de banda elastica. Trabaja el core inferior con mayor dificultad.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_005.jpg?download=true', ARRAY['core'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=8RSLrkkIbl4", "title": "Leg Raise with Band Tutorial"}]'::jsonb),
(124, 'Crunch', 'Tumbado boca arriba, eleva los hombros del suelo contrayendo el abdomen sin tirar del cuello.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_005.jpg?download=true', ARRAY['core'], 1, '[{"type": "video", "url": "https://www.youtube.com/watch?v=Xyd_fa5zoEU", "title": "Crunch Tutorial"}]'::jsonb),
(125, 'Crunch con Piernas Elevadas', 'Realiza el crunch con las piernas elevadas a 90 grados para aumentar la activacion del abdomen.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_005.jpg?download=true', ARRAY['core'], 1, '[{"type": "video", "url": "https://www.youtube.com/watch?v=5ER5Of4MOPI", "title": "Legs Up Crunch Tutorial"}]'::jsonb),
(126, 'Situps', 'Desde tumbado boca arriba, sube el torso completo hasta quedar sentado y baja de forma controlada.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_005.jpg?download=true', ARRAY['core'], 1, '[{"type": "video", "url": "https://www.youtube.com/watch?v=1fbU_MkV7NE", "title": "Sit Up Tutorial"}]'::jsonb),
(127, 'Elevacion de Rodillas Tumbado', 'Tumbado boca arriba, lleva las rodillas hacia el pecho manteniendo el control del movimiento.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_005.jpg?download=true', ARRAY['core'], 1, '[{"type": "video", "url": "https://www.youtube.com/watch?v=JB2oyawG9KI", "title": "Knee Tuck Tutorial"}]'::jsonb),
(128, 'Elevacion de Piernas Tumbado', 'Con las piernas estiradas, elevalas y bajalas lentamente sin despegar la zona lumbar del suelo.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_005.jpg?download=true', ARRAY['core'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=l4kQd9eWclE", "title": "Lying Leg Raise Tutorial"}]'::jsonb),
(129, 'Russian Twist', 'Sentado e inclinado hacia atras, gira el torso de lado a lado para trabajar los oblicuos.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_005.jpg?download=true', ARRAY['core'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=wkD8rjkodUI", "title": "Russian Twist Tutorial"}]'::jsonb),
(130, 'Bicicleta', 'Tumbado boca arriba, lleva alternadamente el codo hacia la rodilla contraria con control.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_005.jpg?download=true', ARRAY['core'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=9FGilxCbdz8", "title": "Bicycle Crunch Tutorial"}]'::jsonb),
(131, 'Toe Touches', 'Con las piernas elevadas hacia el techo, intenta tocar las puntas de los pies contrayendo el abdomen.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_005.jpg?download=true', ARRAY['core'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=QhY2D4wM4f8", "title": "Toe Touches Tutorial"}]'::jsonb),
(132, 'Flutter Kicks', 'Realiza pequenas patadas alternas con piernas estiradas cerca del suelo, manteniendo el core activo.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_005.jpg?download=true', ARRAY['core'], 2, '[{"type": "video", "url": "https://www.youtube.com/watch?v=ANVdMDaYRts", "title": "Flutter Kicks Tutorial"}]'::jsonb),
(133, 'Plancha con Pies Elevados', 'Plancha abdominal con los pies en una superficie elevada para aumentar la carga sobre el core y hombros.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_005.jpg?download=true', ARRAY['core', 'shoulders'], 3, '[{"type": "video", "url": "https://www.youtube.com/watch?v=Qm66wQ6wYjg", "title": "Decline Plank Tutorial"}]'::jsonb),
(134, 'Plancha con Toque de Hombros', 'En posicion de flexion, alterna toques de hombro minimizando la rotacion de la cadera.', 'https://huggingface.co/buckets/RafaelJaime/OpenCalisthenics/resolve/image_005.jpg?download=true', ARRAY['core', 'shoulders'], 3, '[{"type": "video", "url": "https://www.youtube.com/watch?v=U1xW9z6M4xQ", "title": "Shoulder Tap Plank Tutorial"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    muscle_group = EXCLUDED.muscle_group,
    difficulty = EXCLUDED.difficulty,
    resources = EXCLUDED.resources;

-- Update equipment, category, and type for all exercises
UPDATE "Exercise" SET equipment = ARRAY['none'], category = 'push', type = 'dynamic' WHERE id = 1;
UPDATE "Exercise" SET equipment = ARRAY['pull_up_bar'], category = 'pull', type = 'dynamic' WHERE id = 2;
UPDATE "Exercise" SET equipment = ARRAY['none'], category = 'legs', type = 'dynamic' WHERE id = 3;
UPDATE "Exercise" SET equipment = ARRAY['parallel_bars'], category = 'push', type = 'dynamic' WHERE id = 4;
UPDATE "Exercise" SET equipment = ARRAY['none'], category = 'core', type = 'isometric' WHERE id = 5;
UPDATE "Exercise" SET equipment = ARRAY['pull_up_bar', 'rings'], category = 'pull', type = 'dynamic' WHERE id = 6;
UPDATE "Exercise" SET equipment = ARRAY['none'], category = 'legs', type = 'dynamic' WHERE id = 7;
UPDATE "Exercise" SET equipment = ARRAY['wall'], category = 'push', type = 'dynamic' WHERE id = 8;
UPDATE "Exercise" SET equipment = ARRAY['parallel_bars'], category = 'core', type = 'isometric' WHERE id = 9;
UPDATE "Exercise" SET equipment = ARRAY['low_bar', 'rings'], category = 'pull', type = 'dynamic' WHERE id = 10;
UPDATE "Exercise" SET equipment = ARRAY['none'], category = 'push', type = 'dynamic' WHERE id = 11;
UPDATE "Exercise" SET equipment = ARRAY['pull_up_bar'], category = 'pull', type = 'dynamic' WHERE id = 12;
UPDATE "Exercise" SET equipment = ARRAY['none'], category = 'full_body', type = 'plyometric' WHERE id = 13;
UPDATE "Exercise" SET equipment = ARRAY['pull_up_bar', 'rings'], category = 'skill', type = 'isometric' WHERE id = 14;
UPDATE "Exercise" SET equipment = ARRAY['rings', 'pull_up_bar'], category = 'skill', type = 'isometric' WHERE id = 15;
UPDATE "Exercise" SET equipment = ARRAY['vertical_pole', 'stall_bars'], category = 'skill', type = 'isometric' WHERE id = 16;
UPDATE "Exercise" SET equipment = ARRAY['none'], category = 'push', type = 'dynamic' WHERE id = 17;
UPDATE "Exercise" SET equipment = ARRAY['parallel_bars'], category = 'skill', type = 'isometric' WHERE id = 18;
UPDATE "Exercise" SET equipment = ARRAY['bench'], category = 'core', type = 'dynamic' WHERE id = 19;
UPDATE "Exercise" SET equipment = ARRAY['pull_up_bar'], category = 'core', type = 'dynamic' WHERE id = 20;
UPDATE "Exercise" SET equipment = ARRAY['wall'], category = 'push', type = 'dynamic' WHERE id = 21;
UPDATE "Exercise" SET equipment = ARRAY['bench', 'elevated_surface'], category = 'push', type = 'dynamic' WHERE id = 22;
UPDATE "Exercise" SET equipment = ARRAY['none'], category = 'push', type = 'dynamic' WHERE id = 23;
UPDATE "Exercise" SET equipment = ARRAY['none'], category = 'push', type = 'dynamic' WHERE id = 24;
UPDATE "Exercise" SET equipment = ARRAY['none'], category = 'push', type = 'dynamic' WHERE id = 25;
UPDATE "Exercise" SET equipment = ARRAY['pull_up_bar'], category = 'pull', type = 'dynamic' WHERE id = 26;
UPDATE "Exercise" SET equipment = ARRAY['pull_up_bar'], category = 'pull', type = 'dynamic' WHERE id = 27;
UPDATE "Exercise" SET equipment = ARRAY['pull_up_bar', 'resistance_band'], category = 'pull', type = 'dynamic' WHERE id = 28;
UPDATE "Exercise" SET equipment = ARRAY['pull_up_bar', 'weight_belt'], category = 'pull', type = 'dynamic' WHERE id = 29;
UPDATE "Exercise" SET equipment = ARRAY['support_surface'], category = 'legs', type = 'dynamic' WHERE id = 30;
UPDATE "Exercise" SET equipment = ARRAY['box', 'bench'], category = 'legs', type = 'dynamic' WHERE id = 31;
UPDATE "Exercise" SET equipment = ARRAY['bench'], category = 'legs', type = 'dynamic' WHERE id = 32;
UPDATE "Exercise" SET equipment = ARRAY['none'], category = 'legs', type = 'dynamic' WHERE id = 33;
UPDATE "Exercise" SET equipment = ARRAY['bench'], category = 'push', type = 'dynamic' WHERE id = 34;
UPDATE "Exercise" SET equipment = ARRAY['parallel_bars', 'resistance_band'], category = 'push', type = 'dynamic' WHERE id = 35;
UPDATE "Exercise" SET equipment = ARRAY['rings'], category = 'push', type = 'dynamic' WHERE id = 36;
UPDATE "Exercise" SET equipment = ARRAY['parallel_bars', 'weight_belt'], category = 'push', type = 'dynamic' WHERE id = 37;
UPDATE "Exercise" SET equipment = ARRAY['elevated_surface'], category = 'core', type = 'isometric' WHERE id = 38;
UPDATE "Exercise" SET equipment = ARRAY['none'], category = 'core', type = 'isometric' WHERE id = 39;
UPDATE "Exercise" SET equipment = ARRAY['none'], category = 'core', type = 'isometric' WHERE id = 40;
UPDATE "Exercise" SET equipment = ARRAY['pull_up_bar'], category = 'pull', type = 'dynamic' WHERE id = 41;
UPDATE "Exercise" SET equipment = ARRAY['pull_up_bar'], category = 'pull', type = 'plyometric' WHERE id = 42;
UPDATE "Exercise" SET equipment = ARRAY['parallel_bars'], category = 'core', type = 'isometric' WHERE id = 43;
UPDATE "Exercise" SET equipment = ARRAY['parallel_bars'], category = 'core', type = 'isometric' WHERE id = 44;
UPDATE "Exercise" SET equipment = ARRAY['none'], category = 'push', type = 'dynamic' WHERE id = 45;
UPDATE "Exercise" SET equipment = ARRAY['box', 'bench'], category = 'push', type = 'dynamic' WHERE id = 46;
UPDATE "Exercise" SET equipment = ARRAY['wall'], category = 'push', type = 'dynamic' WHERE id = 47;
UPDATE "Exercise" SET equipment = ARRAY['none'], category = 'core', type = 'dynamic' WHERE id = 48;
UPDATE "Exercise" SET equipment = ARRAY['none'], category = 'core', type = 'isometric' WHERE id = 49;
UPDATE "Exercise" SET equipment = ARRAY['pull_up_bar'], category = 'core', type = 'dynamic' WHERE id = 50;
UPDATE "Exercise" SET equipment = ARRAY['pull_up_bar'], category = 'core', type = 'dynamic' WHERE id = 51;
UPDATE "Exercise" SET equipment = ARRAY['pull_up_bar', 'rings'], category = 'skill', type = 'isometric' WHERE id = 52;
UPDATE "Exercise" SET equipment = ARRAY['pull_up_bar', 'rings'], category = 'skill', type = 'isometric' WHERE id = 53;
UPDATE "Exercise" SET equipment = ARRAY['pull_up_bar', 'rings'], category = 'skill', type = 'isometric' WHERE id = 54;
UPDATE "Exercise" SET equipment = ARRAY['rings', 'pull_up_bar'], category = 'skill', type = 'isometric' WHERE id = 55;
UPDATE "Exercise" SET equipment = ARRAY['rings', 'pull_up_bar'], category = 'skill', type = 'isometric' WHERE id = 56;
UPDATE "Exercise" SET equipment = ARRAY['parallel_bars'], category = 'push', type = 'isometric' WHERE id = 57;
UPDATE "Exercise" SET equipment = ARRAY['parallel_bars'], category = 'skill', type = 'isometric' WHERE id = 58;
UPDATE "Exercise" SET equipment = ARRAY['parallel_bars'], category = 'skill', type = 'isometric' WHERE id = 59;
UPDATE "Exercise" SET equipment = ARRAY['anchor_point'], category = 'legs', type = 'dynamic' WHERE id = 60;
UPDATE "Exercise" SET equipment = ARRAY['step'], category = 'legs', type = 'dynamic' WHERE id = 61;
UPDATE "Exercise" SET equipment = ARRAY['pull_up_bar'], category = 'core', type = 'dynamic' WHERE id = 62;
UPDATE "Exercise" SET equipment = ARRAY['rings', 'low_bar'], category = 'skill', type = 'isometric' WHERE id = 63;
UPDATE "Exercise" SET equipment = ARRAY['wall'], category = 'skill', type = 'isometric' WHERE id = 64;
UPDATE "Exercise" SET equipment = ARRAY['parallel_bars'], category = 'push', type = 'dynamic' WHERE id = 65;
UPDATE "Exercise" SET equipment = ARRAY['pull_up_bar'], category = 'pull', type = 'dynamic' WHERE id = 66;
UPDATE "Exercise" SET equipment = ARRAY['pull_up_bar'], category = 'pull', type = 'dynamic' WHERE id = 67;
UPDATE "Exercise" SET equipment = ARRAY['none'], category = 'push', type = 'plyometric' WHERE id = 68;
UPDATE "Exercise" SET equipment = ARRAY['low_bar', 'parallel_bars'], category = 'push', type = 'dynamic' WHERE id = 69;
UPDATE "Exercise" SET equipment = ARRAY['pull_up_bar', 'rings'], category = 'skill', type = 'isometric' WHERE id = 70;
UPDATE "Exercise" SET equipment = ARRAY['parallel_bars'], category = 'skill', type = 'isometric' WHERE id = 71;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'core', type = 'dynamic' WHERE id = 72;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'pull', type = 'dynamic' WHERE id = 73;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'push', type = 'dynamic' WHERE id = 74;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'full_body', type = 'dynamic' WHERE id = 75;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'pull', type = 'dynamic' WHERE id = 76;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'full_body', type = 'dynamic' WHERE id = 77;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'push', type = 'dynamic' WHERE id = 78;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'legs', type = 'dynamic' WHERE id = 79;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'core', type = 'dynamic' WHERE id = 80;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'pull', type = 'dynamic' WHERE id = 81;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'push', type = 'dynamic' WHERE id = 82;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'full_body', type = 'plyometric' WHERE id = 83;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'push', type = 'dynamic' WHERE id = 84;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'full_body', type = 'dynamic' WHERE id = 85;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'pull', type = 'dynamic' WHERE id = 86;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'legs', type = 'dynamic' WHERE id = 87;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'core', type = 'isometric' WHERE id = 88;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'push', type = 'dynamic' WHERE id = 89;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'full_body', type = 'dynamic' WHERE id = 90;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'push', type = 'dynamic' WHERE id = 91;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'legs', type = 'dynamic' WHERE id = 92;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'core', type = 'dynamic' WHERE id = 93;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'pull', type = 'dynamic' WHERE id = 94;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'full_body', type = 'dynamic' WHERE id = 95;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'push', type = 'dynamic' WHERE id = 96;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'legs', type = 'dynamic' WHERE id = 97;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'core', type = 'dynamic' WHERE id = 98;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'pull', type = 'dynamic' WHERE id = 99;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'push', type = 'dynamic' WHERE id = 100;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'full_body', type = 'plyometric' WHERE id = 101;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'push', type = 'dynamic' WHERE id = 102;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'full_body', type = 'dynamic' WHERE id = 103;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'push', type = 'dynamic' WHERE id = 104;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'legs', type = 'dynamic' WHERE id = 105;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'core', type = 'dynamic' WHERE id = 106;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'legs', type = 'dynamic' WHERE id = 107;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'push', type = 'dynamic' WHERE id = 108;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'full_body', type = 'dynamic' WHERE id = 109;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'legs', type = 'dynamic' WHERE id = 110;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'core', type = 'dynamic' WHERE id = 111;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'pull', type = 'dynamic' WHERE id = 112;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'push', type = 'plyometric' WHERE id = 113;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'full_body', type = 'dynamic' WHERE id = 114;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'full_body', type = 'dynamic' WHERE id = 115;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'full_body', type = 'dynamic' WHERE id = 116;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'push', type = 'dynamic' WHERE id = 117;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'legs', type = 'dynamic' WHERE id = 118;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'core', type = 'dynamic' WHERE id = 119;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'legs', type = 'dynamic' WHERE id = 120;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'core', type = 'dynamic' WHERE id = 121;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'legs', type = 'dynamic' WHERE id = 122;
UPDATE "Exercise" SET equipment = ARRAY['resistance_band'], category = 'core', type = 'dynamic' WHERE id = 123;
UPDATE "Exercise" SET equipment = ARRAY['none'], category = 'core', type = 'dynamic' WHERE id = 124;
UPDATE "Exercise" SET equipment = ARRAY['none'], category = 'core', type = 'dynamic' WHERE id = 125;
UPDATE "Exercise" SET equipment = ARRAY['none'], category = 'core', type = 'dynamic' WHERE id = 126;
UPDATE "Exercise" SET equipment = ARRAY['none'], category = 'core', type = 'dynamic' WHERE id = 127;
UPDATE "Exercise" SET equipment = ARRAY['none'], category = 'core', type = 'dynamic' WHERE id = 128;
UPDATE "Exercise" SET equipment = ARRAY['none'], category = 'core', type = 'dynamic' WHERE id = 129;
UPDATE "Exercise" SET equipment = ARRAY['none'], category = 'core', type = 'dynamic' WHERE id = 130;
UPDATE "Exercise" SET equipment = ARRAY['none'], category = 'core', type = 'dynamic' WHERE id = 131;
UPDATE "Exercise" SET equipment = ARRAY['none'], category = 'core', type = 'dynamic' WHERE id = 132;
UPDATE "Exercise" SET equipment = ARRAY['elevated_surface'], category = 'core', type = 'isometric' WHERE id = 133;
UPDATE "Exercise" SET equipment = ARRAY['none'], category = 'core', type = 'dynamic' WHERE id = 134;

-- Reset the sequence to continue from the last ID
SELECT setval('"Exercise_id_seq"', (SELECT MAX(id) FROM "Exercise"));

-- =============================================
-- Exercise Progressions seed data
-- Generated from data/exerciseProgressions.ts
-- =============================================
INSERT INTO exercise_progressions (exercise_id, prerequisites, variations, progressions) VALUES
(1, '{21,22,23}', '{24}', '{11,68,17,25}'),
(2, '{26,10,27,28}', '{12}', '{29,66,67,41,42,6}'),
(3, '{30,31}', '{32}', '{33,7}'),
(4, '{34,35}', '{}', '{36,69,37,6}'),
(5, '{38}', '{39}', '{40,48,49}'),
(6, '{2,4,41,42}', '{}', '{}'),
(7, '{3,32,33}', '{}', '{}'),
(8, '{45,46,47}', '{}', '{}'),
(9, '{43}', '{}', '{44}'),
(10, '{26}', '{}', '{27,28,2}'),
(11, '{1}', '{}', '{17,25}'),
(12, '{26,10,27,28}', '{2}', '{29}'),
(13, '{1,3}', '{}', '{}'),
(14, '{2,52,53}', '{}', '{54}'),
(15, '{55,56}', '{}', '{}'),
(16, '{2,39}', '{}', '{}'),
(17, '{1,11}', '{}', '{25}'),
(18, '{57,65}', '{}', '{71,58,59}'),
(19, '{20,51,49}', '{}', '{}'),
(20, '{50}', '{}', '{51,19}'),
(21, '{}', '{}', '{22,23,1}'),
(22, '{21}', '{}', '{23,1}'),
(23, '{21,22}', '{}', '{1}'),
(24, '{1}', '{11}', '{17}'),
(25, '{1,11,17}', '{}', '{}'),
(26, '{}', '{}', '{10,27,28,2}'),
(27, '{26,10}', '{28}', '{2}'),
(28, '{26,10}', '{27}', '{2}'),
(29, '{2}', '{}', '{41,42,6}'),
(30, '{}', '{31}', '{3}'),
(31, '{}', '{30}', '{3}'),
(32, '{3}', '{}', '{33,7}'),
(33, '{3,32}', '{7}', '{}'),
(34, '{}', '{}', '{35,4}'),
(35, '{34}', '{}', '{4}'),
(36, '{4}', '{}', '{6}'),
(37, '{4}', '{36}', '{}'),
(38, '{}', '{}', '{5}'),
(39, '{5}', '{}', '{16}'),
(40, '{5}', '{39}', '{49}'),
(41, '{2}', '{}', '{42,6}'),
(42, '{2,41}', '{}', '{6}'),
(43, '{}', '{}', '{9}'),
(44, '{43,9}', '{}', '{}'),
(45, '{1}', '{}', '{46,64,47,8}'),
(46, '{45}', '{}', '{47,8}'),
(47, '{45,46}', '{}', '{8}'),
(48, '{}', '{}', '{5,49}'),
(49, '{5,48}', '{}', '{19}'),
(50, '{}', '{}', '{20,51}'),
(51, '{50,20}', '{}', '{62,19}'),
(52, '{2}', '{}', '{53,14}'),
(53, '{2,52}', '{}', '{70,54,14}'),
(54, '{52,53,70}', '{}', '{14}'),
(55, '{63}', '{}', '{56,15}'),
(56, '{55}', '{}', '{15}'),
(57, '{1}', '{}', '{65,18,71,58,59}'),
(58, '{57,65,18,71}', '{}', '{59}'),
(59, '{57,65,18,71,58}', '{}', '{}'),
(60, '{3,32}', '{}', '{}'),
(61, '{}', '{}', '{}'),
(62, '{20,51,49}', '{}', '{}'),
(63, '{}', '{}', '{55,36}'),
(64, '{45,46}', '{}', '{47,8}'),
(65, '{1,57}', '{}', '{18,71,58,59}'),
(66, '{2,29}', '{}', '{67}'),
(67, '{2,29,66}', '{}', '{}'),
(68, '{1,11}', '{42}', '{25}'),
(69, '{4}', '{36}', '{}'),
(70, '{52,53}', '{}', '{54,14}'),
(71, '{57,65,18}', '{}', '{58,59}'),
-- Resistance band exercises progressions
(72, '{}', '{}', '{80}'),
(73, '{99}', '{}', '{81,112}'),
(74, '{}', '{}', '{100,75,82}'),
(75, '{74,92}', '{}', '{90}'),
(76, '{}', '{}', '{77,94}'),
(77, '{76}', '{}', '{94}'),
(78, '{86,96}', '{}', '{91,90,103}'),
(79, '{}', '{61}', '{}'),
(80, '{72,98}', '{}', '{93}'),
(81, '{99}', '{}', '{73,112}'),
(82, '{74}', '{}', '{}'),
(83, '{}', '{}', '{101}'),
(84, '{}', '{}', '{89}'),
(85, '{92,86}', '{}', '{}'),
(86, '{99}', '{}', '{78,91,85,104}'),
(87, '{}', '{}', '{105,116,114,103,95}'),
(88, '{5}', '{}', '{}'),
(89, '{84}', '{}', '{}'),
(90, '{92,78}', '{}', '{}'),
(91, '{86}', '{}', '{}'),
(92, '{}', '{}', '{75,85,90,109,122}'),
(93, '{80}', '{}', '{119}'),
(94, '{76,77}', '{}', '{}'),
(95, '{87,105}', '{}', '{}'),
(96, '{}', '{}', '{86,104}'),
(97, '{}', '{}', '{}'),
(98, '{}', '{}', '{72,80}'),
(99, '{}', '{}', '{81,86,112,114,109}'),
(100, '{1}', '{}', '{102,108,113,117}'),
(101, '{83}', '{}', '{103}'),
(102, '{100}', '{}', '{}'),
(103, '{87,101,78}', '{}', '{95}'),
(104, '{96,86}', '{}', '{}'),
(105, '{87}', '{}', '{95,116}'),
(106, '{}', '{}', '{123}'),
(107, '{87}', '{}', '{}'),
(108, '{100}', '{}', '{}'),
(109, '{92,99}', '{}', '{}'),
(110, '{}', '{}', '{118,122,120}'),
(111, '{123}', '{}', '{}'),
(112, '{99,81}', '{}', '{73}'),
(113, '{100}', '{}', '{}'),
(114, '{87,99}', '{}', '{103}'),
(115, '{99,74}', '{}', '{}'),
(116, '{87,80}', '{}', '{}'),
(117, '{100,45}', '{}', '{}'),
(118, '{92,110}', '{}', '{120}'),
(119, '{93}', '{}', '{}'),
(120, '{110,118}', '{}', '{7}'),
(121, '{}', '{}', '{123,111}'),
(122, '{92,110}', '{}', '{}'),
(123, '{106,121}', '{}', '{111}'),
(124, '{}', '{}', '{125,126,127}'),
(125, '{124}', '{}', '{128}'),
(126, '{124}', '{}', '{}'),
(127, '{124}', '{}', '{128}'),
(128, '{125,127}', '{}', '{20}'),
(129, '{124}', '{}', '{130}'),
(130, '{129}', '{}', '{132}'),
(131, '{124}', '{}', '{}'),
(132, '{130}', '{}', '{}'),
(133, '{5}', '{}', '{}'),
(134, '{5}', '{}', '{133}')
ON CONFLICT (exercise_id) DO UPDATE SET
    prerequisites = EXCLUDED.prerequisites,
    variations = EXCLUDED.variations,
    progressions = EXCLUDED.progressions;
