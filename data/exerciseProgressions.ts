/**
 * Sistema de progresiones de ejercicios de calistenia.
 * Define las relaciones entre ejercicios: prerrequisitos, variaciones y progresiones avanzadas.
 */

export interface ExerciseProgression {
	exerciseId: number;
	prerequisites: number[]; // IDs ordenados de más fácil a más difícil
	variations: number[]; // IDs de variaciones del mismo nivel
	progressions: number[]; // IDs ordenados de más fácil a más difícil
}

/**
 * Mapa de progresiones para todos los ejercicios.
 * - prerequisites: Ejercicios más fáciles que debes dominar antes
 * - variations: Variaciones del mismo nivel de dificultad
 * - progressions: Ejercicios más difíciles hacia los que progresar
 */
export const exerciseProgressions: ExerciseProgression[] = [
	// Push Up (id: 1)
	{
		exerciseId: 1,
		prerequisites: [21, 22, 23], // Wall Push Up → Incline Push Up → Knee Push Up
		variations: [24], // Wide Push Up
		progressions: [11, 17, 25], // Diamond Push Up → Archer Push Up → One Arm Push Up
	},
	// Pull Up (id: 2)
	{
		exerciseId: 2,
		prerequisites: [26, 10, 27, 28], // Scapular → Australian → Negative → Band Assisted
		variations: [12], // Chin Up
		progressions: [29, 41, 42, 6], // Weighted → High Pull Up → Explosive → Muscle Up
	},
	// Squat (id: 3)
	{
		exerciseId: 3,
		prerequisites: [30, 31], // Assisted Squat → Box Squat
		variations: [32], // Bulgarian Split Squat
		progressions: [33, 7], // Shrimp Squat → Pistol Squat
	},
	// Dips (id: 4)
	{
		exerciseId: 4,
		prerequisites: [34, 35], // Bench Dips → Assisted Dips
		variations: [],
		progressions: [36, 37, 6], // Ring Dips → Weighted Dips → Muscle Up
	},
	// Plank (id: 5)
	{
		exerciseId: 5,
		prerequisites: [38], // Incline Plank
		variations: [39], // Side Plank
		progressions: [40, 48, 49], // Plank with Leg Lift → Dead Bug → Hollow Body Hold
	},
	// Muscle Up (id: 6)
	{
		exerciseId: 6,
		prerequisites: [2, 4, 41, 42], // Pull Up → Dips → High Pull Up → Explosive Pull Up
		variations: [],
		progressions: [],
	},
	// Pistol Squat (id: 7)
	{
		exerciseId: 7,
		prerequisites: [3, 32, 33], // Squat → Bulgarian → Shrimp Squat
		variations: [],
		progressions: [],
	},
	// Handstand Push Up (id: 8)
	{
		exerciseId: 8,
		prerequisites: [45, 46, 47], // Pike Push Up → Elevated Pike → Wall HSPU
		variations: [],
		progressions: [],
	},
	// L-Sit (id: 9)
	{
		exerciseId: 9,
		prerequisites: [43], // Tucked L-Sit
		variations: [],
		progressions: [44], // V-Sit
	},
	// Australian Pull Up (id: 10)
	{
		exerciseId: 10,
		prerequisites: [26], // Scapular Pull Up
		variations: [],
		progressions: [27, 28, 2], // Negative → Band Assisted → Pull Up
	},
	// Diamond Push Up (id: 11)
	{
		exerciseId: 11,
		prerequisites: [1], // Push Up
		variations: [],
		progressions: [17, 25], // Archer Push Up → One Arm Push Up
	},
	// Chin Up (id: 12)
	{
		exerciseId: 12,
		prerequisites: [26, 10, 27, 28], // Scapular → Australian → Negative → Band Assisted
		variations: [2], // Pull Up
		progressions: [29], // Weighted Pull Up
	},
	// Burpee (id: 13)
	{
		exerciseId: 13,
		prerequisites: [1, 3], // Push Up, Squat
		variations: [],
		progressions: [],
	},
	// Front Lever (id: 14)
	{
		exerciseId: 14,
		prerequisites: [2, 52, 53], // Pull Up → Tuck FL → Advanced Tuck FL
		variations: [],
		progressions: [54], // Straddle Front Lever
	},
	// Back Lever (id: 15)
	{
		exerciseId: 15,
		prerequisites: [55, 56], // Tuck Back Lever → Straddle Back Lever
		variations: [],
		progressions: [],
	},
	// Human Flag (id: 16)
	{
		exerciseId: 16,
		prerequisites: [2, 39], // Pull Up → Side Plank
		variations: [],
		progressions: [],
	},
	// Archer Push Up (id: 17)
	{
		exerciseId: 17,
		prerequisites: [1, 11], // Push Up → Diamond Push Up
		variations: [],
		progressions: [25], // One Arm Push Up
	},
	// Tuck Planche (id: 18)
	{
		exerciseId: 18,
		prerequisites: [57], // Planche Lean
		variations: [],
		progressions: [58, 59], // Straddle Planche → Full Planche
	},
	// Dragon Flag (id: 19)
	{
		exerciseId: 19,
		prerequisites: [20, 51, 49], // Hanging Leg Raise → Toes to Bar → Hollow Body Hold
		variations: [],
		progressions: [],
	},
	// Hanging Leg Raise (id: 20)
	{
		exerciseId: 20,
		prerequisites: [50], // Knee Raise
		variations: [],
		progressions: [51, 19], // Toes to Bar → Dragon Flag
	},
	// Wall Push Up (id: 21)
	{
		exerciseId: 21,
		prerequisites: [],
		variations: [],
		progressions: [22, 23, 1], // Incline → Knee → Push Up
	},
	// Incline Push Up (id: 22)
	{
		exerciseId: 22,
		prerequisites: [21], // Wall Push Up
		variations: [],
		progressions: [23, 1], // Knee Push Up → Push Up
	},
	// Knee Push Up (id: 23)
	{
		exerciseId: 23,
		prerequisites: [21, 22], // Wall → Incline
		variations: [],
		progressions: [1], // Push Up
	},
	// Wide Push Up (id: 24)
	{
		exerciseId: 24,
		prerequisites: [1], // Push Up
		variations: [11], // Diamond Push Up
		progressions: [17], // Archer Push Up
	},
	// One Arm Push Up (id: 25)
	{
		exerciseId: 25,
		prerequisites: [1, 11, 17], // Push Up → Diamond → Archer
		variations: [],
		progressions: [],
	},
	// Scapular Pull Up (id: 26)
	{
		exerciseId: 26,
		prerequisites: [],
		variations: [],
		progressions: [10, 27, 28, 2], // Australian → Negative → Band → Pull Up
	},
	// Negative Pull Up (id: 27)
	{
		exerciseId: 27,
		prerequisites: [26, 10], // Scapular → Australian
		variations: [28], // Band Assisted
		progressions: [2], // Pull Up
	},
	// Band Assisted Pull Up (id: 28)
	{
		exerciseId: 28,
		prerequisites: [26, 10], // Scapular → Australian
		variations: [27], // Negative
		progressions: [2], // Pull Up
	},
	// Weighted Pull Up (id: 29)
	{
		exerciseId: 29,
		prerequisites: [2], // Pull Up
		variations: [],
		progressions: [41, 42, 6], // High Pull Up → Explosive → Muscle Up
	},
	// Assisted Squat (id: 30)
	{
		exerciseId: 30,
		prerequisites: [],
		variations: [31], // Box Squat
		progressions: [3], // Squat
	},
	// Box Squat (id: 31)
	{
		exerciseId: 31,
		prerequisites: [],
		variations: [30], // Assisted Squat
		progressions: [3], // Squat
	},
	// Bulgarian Split Squat (id: 32)
	{
		exerciseId: 32,
		prerequisites: [3], // Squat
		variations: [],
		progressions: [33, 7], // Shrimp → Pistol
	},
	// Shrimp Squat (id: 33)
	{
		exerciseId: 33,
		prerequisites: [3, 32], // Squat → Bulgarian
		variations: [7], // Pistol Squat
		progressions: [],
	},
	// Bench Dips (id: 34)
	{
		exerciseId: 34,
		prerequisites: [],
		variations: [],
		progressions: [35, 4], // Assisted → Dips
	},
	// Assisted Dips (id: 35)
	{
		exerciseId: 35,
		prerequisites: [34], // Bench Dips
		variations: [],
		progressions: [4], // Dips
	},
	// Ring Dips (id: 36)
	{
		exerciseId: 36,
		prerequisites: [4], // Dips
		variations: [],
		progressions: [6], // Muscle Up
	},
	// Weighted Dips (id: 37)
	{
		exerciseId: 37,
		prerequisites: [4], // Dips
		variations: [36], // Ring Dips
		progressions: [],
	},
	// Incline Plank (id: 38)
	{
		exerciseId: 38,
		prerequisites: [],
		variations: [],
		progressions: [5], // Plank
	},
	// Side Plank (id: 39)
	{
		exerciseId: 39,
		prerequisites: [5], // Plank
		variations: [],
		progressions: [16], // Human Flag
	},
	// Plank with Leg Lift (id: 40)
	{
		exerciseId: 40,
		prerequisites: [5], // Plank
		variations: [39], // Side Plank
		progressions: [49], // Hollow Body Hold
	},
	// High Pull Up (id: 41)
	{
		exerciseId: 41,
		prerequisites: [2], // Pull Up
		variations: [],
		progressions: [42, 6], // Explosive → Muscle Up
	},
	// Explosive Pull Up (id: 42)
	{
		exerciseId: 42,
		prerequisites: [2, 41], // Pull Up → High Pull Up
		variations: [],
		progressions: [6], // Muscle Up
	},
	// Tucked L-Sit (id: 43)
	{
		exerciseId: 43,
		prerequisites: [],
		variations: [],
		progressions: [9], // L-Sit
	},
	// V-Sit (id: 44)
	{
		exerciseId: 44,
		prerequisites: [43, 9], // Tucked L-Sit → L-Sit
		variations: [],
		progressions: [],
	},
	// Pike Push Up (id: 45)
	{
		exerciseId: 45,
		prerequisites: [1], // Push Up
		variations: [],
		progressions: [46, 47, 8], // Elevated Pike → Wall HSPU → HSPU
	},
	// Elevated Pike Push Up (id: 46)
	{
		exerciseId: 46,
		prerequisites: [45], // Pike Push Up
		variations: [],
		progressions: [47, 8], // Wall HSPU → HSPU
	},
	// Wall Handstand Push Up (id: 47)
	{
		exerciseId: 47,
		prerequisites: [45, 46], // Pike → Elevated Pike
		variations: [],
		progressions: [8], // HSPU
	},
	// Dead Bug (id: 48)
	{
		exerciseId: 48,
		prerequisites: [],
		variations: [],
		progressions: [5, 49], // Plank → Hollow Body
	},
	// Hollow Body Hold (id: 49)
	{
		exerciseId: 49,
		prerequisites: [5, 48], // Plank → Dead Bug
		variations: [],
		progressions: [19], // Dragon Flag
	},
	// Knee Raise (id: 50)
	{
		exerciseId: 50,
		prerequisites: [],
		variations: [],
		progressions: [20, 51], // Hanging Leg Raise → Toes to Bar
	},
	// Toes to Bar (id: 51)
	{
		exerciseId: 51,
		prerequisites: [50, 20], // Knee Raise → Hanging Leg Raise
		variations: [],
		progressions: [19], // Dragon Flag
	},
	// Tuck Front Lever (id: 52)
	{
		exerciseId: 52,
		prerequisites: [2], // Pull Up
		variations: [],
		progressions: [53, 14], // Advanced Tuck → Front Lever
	},
	// Advanced Tuck Front Lever (id: 53)
	{
		exerciseId: 53,
		prerequisites: [2, 52], // Pull Up → Tuck FL
		variations: [],
		progressions: [54, 14], // Straddle → Front Lever
	},
	// Straddle Front Lever (id: 54)
	{
		exerciseId: 54,
		prerequisites: [52, 53, 14], // Tuck → Advanced Tuck → Front Lever
		variations: [],
		progressions: [],
	},
	// Tuck Back Lever (id: 55)
	{
		exerciseId: 55,
		prerequisites: [],
		variations: [],
		progressions: [56, 15], // Straddle → Back Lever
	},
	// Straddle Back Lever (id: 56)
	{
		exerciseId: 56,
		prerequisites: [55], // Tuck Back Lever
		variations: [],
		progressions: [15], // Back Lever
	},
	// Planche Lean (id: 57)
	{
		exerciseId: 57,
		prerequisites: [1], // Push Up
		variations: [],
		progressions: [18, 58, 59], // Tuck Planche → Straddle → Full
	},
	// Straddle Planche (id: 58)
	{
		exerciseId: 58,
		prerequisites: [57, 18], // Planche Lean → Tuck Planche
		variations: [],
		progressions: [59], // Full Planche
	},
	// Full Planche (id: 59)
	{
		exerciseId: 59,
		prerequisites: [57, 18, 58], // Lean → Tuck → Straddle
		variations: [],
		progressions: [],
	},
];

/**
 * Obtiene la progresión de un ejercicio por su ID.
 */
export function getProgressionByExerciseId(exerciseId: number): ExerciseProgression | undefined {
	return exerciseProgressions.find((p) => p.exerciseId === exerciseId);
}
