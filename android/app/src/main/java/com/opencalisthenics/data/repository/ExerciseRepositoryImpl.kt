package com.opencalisthenics.data.repository

import android.content.Context
import com.opencalisthenics.data.model.ExerciseDto
import com.opencalisthenics.domain.model.Exercise
import com.opencalisthenics.domain.model.AppError
import com.opencalisthenics.domain.repository.ExerciseRepository
import kotlinx.serialization.json.Json

class ExerciseRepositoryImpl(
    private val context: Context
) : ExerciseRepository {

    private val json = Json { ignoreUnknownKeys = true }

    override suspend fun getExerciseById(id: Int): Result<Exercise> = try {
        val exercises = getExercises().getOrThrow()
        val exercise = exercises.firstOrNull { it.id == id }
            ?: return Result.failure(AppError.NotFound)
        Result.success(exercise)
    } catch (e: AppError) {
        Result.failure(e)
    } catch (e: Exception) {
        Result.failure(AppError.Unknown(e.message))
    }

    override suspend fun getExercises(): Result<List<Exercise>> = try {
        val jsonString = context.assets.open("exercises.json")
            .bufferedReader()
            .use { it.readText() }

        val dtos = json.decodeFromString<List<ExerciseDto>>(jsonString)
        Result.success(dtos.map { dto ->
            val translation = exerciseTranslations[dto.id]
            Exercise(
                id = dto.id,
                image = dto.image,
                difficulty = dto.difficulty,
                muscleGroups = dto.muscle_group,
                category = dto.category,
                type = dto.type,
                equipment = dto.equipment,
                name = translation?.first ?: "Ejercicio ${dto.id}",
                description = translation?.second ?: ""
            )
        })
    } catch (e: Exception) {
        Result.failure(AppError.Unknown(e.message))
    }

    companion object {
        // Pair(name, description)
        private val exerciseTranslations = mapOf(
            1 to ("Flexiones" to "Ejercicio básico para pecho, hombros y tríceps"),
            2 to ("Dominadas" to "Ejercicio fundamental para espalda y bíceps"),
            3 to ("Sentadilla" to "Sentadilla básica para piernas"),
            4 to ("Fondos" to "Fondos en paralelas para tríceps y pecho"),
            5 to ("Plancha" to "Plancha isométrica para core"),
            6 to ("Muscle Up" to "Ejercicio avanzado que combina dominada y fondo"),
            7 to ("Sentadilla Pistola" to "Sentadilla a una pierna"),
            8 to ("Flexión en Pino" to "Flexiones en posición de pino"),
            9 to ("L-Sit" to "Posición isométrica de L"),
            10 to ("Remo Australiano" to "Dominada horizontal para principiantes"),
            11 to ("Flexión Diamante" to "Flexiones con manos juntas formando un diamante"),
            12 to ("Dominadas Supinas" to "Dominada con agarre supino"),
            13 to ("Burpee" to "Ejercicio de cuerpo completo"),
            14 to ("Front Lever" to "Posición horizontal colgado de la barra"),
            15 to ("Back Lever" to "Posición horizontal invertida en la barra"),
            16 to ("Bandera Humana" to "Bandera humana en poste vertical"),
            17 to ("Flexión Arquero" to "Flexión con un brazo extendido lateralmente"),
            18 to ("Tuck Planche" to "Planche con rodillas recogidas"),
            19 to ("Dragon Flag" to "Ejercicio avanzado de core"),
            20 to ("Elevación de Piernas Colgado" to "Elevación de piernas colgado de la barra"),
            21 to ("Flexión en Pared" to "Flexión contra la pared para principiantes"),
            22 to ("Flexión Inclinada" to "Flexión con manos en superficie elevada"),
            23 to ("Flexión de Rodillas" to "Flexión con rodillas apoyadas"),
            24 to ("Flexión Abierta" to "Flexión con manos más separadas"),
            25 to ("Flexión a Una Mano" to "Flexión a una mano"),
            26 to ("Dominada Escapular" to "Activación escapular colgado de la barra"),
            27 to ("Dominada Negativa" to "Dominada negativa controlada"),
            28 to ("Dominada con Banda" to "Dominada asistida con banda elástica"),
            29 to ("Dominada con Peso" to "Dominada con peso adicional"),
            30 to ("Sentadilla Asistida" to "Sentadilla asistida con soporte"),
            31 to ("Sentadilla en Caja" to "Sentadilla a una caja o banco"),
            32 to ("Sentadilla Búlgara" to "Sentadilla búlgara con pie trasero elevado"),
            33 to ("Sentadilla Camarón" to "Sentadilla camarón a una pierna"),
            34 to ("Fondos en Banco" to "Fondos en banco para tríceps"),
            35 to ("Fondos Asistidos" to "Fondos asistidos con banda"),
            36 to ("Fondos en Anillas" to "Fondos en anillas"),
            37 to ("Fondos con Peso" to "Fondos con peso adicional"),
            38 to ("Plancha Inclinada" to "Plancha inclinada en superficie elevada"),
            39 to ("Plancha Lateral" to "Plancha lateral para oblicuos"),
            40 to ("Plancha con Elevación de Pierna" to "Plancha con elevación de pierna"),
            41 to ("Dominada Alta" to "Dominada alta al pecho"),
            42 to ("Dominada Explosiva" to "Dominada explosiva con fase de vuelo"),
            43 to ("L-Sit Recogido" to "L-Sit con rodillas recogidas"),
            44 to ("V-Sit" to "Posición en V avanzada"),
            45 to ("Flexión Pike" to "Flexión en pike para hombros"),
            46 to ("Flexión Pike Elevada" to "Flexión pike con pies elevados"),
            47 to ("Flexión en Pino contra Pared" to "Flexión en pino contra la pared"),
            48 to ("Dead Bug" to "Ejercicio de core tumbado boca arriba"),
            49 to ("Hollow Body Hold" to "Posición hollow fundamental para gimnasia"),
            50 to ("Elevación de Rodillas" to "Elevación de rodillas colgado"),
            51 to ("Toes to Bar" to "Llevar los pies a la barra colgado"),
            52 to ("Tuck Front Lever" to "Front lever con rodillas recogidas"),
            53 to ("Advanced Tuck Front Lever" to "Front lever con rodillas extendidas"),
            54 to ("Straddle Front Lever" to "Front lever con piernas abiertas"),
            55 to ("Tuck Back Lever" to "Back lever con rodillas recogidas"),
            56 to ("Straddle Back Lever" to "Back lever con piernas abiertas"),
            57 to ("Planche Lean" to "Inclinación de planche"),
            58 to ("Straddle Planche" to "Planche con piernas abiertas"),
            59 to ("Full Planche" to "Planche completa con piernas juntas"),
            60 to ("Curl Nórdico" to "Ejercicio avanzado para isquiotibiales"),
            61 to ("Elevación de Talones" to "Ejercicio básico para pantorrillas"),
            62 to ("Limpiaparabrisas" to "Ejercicio avanzado de core rotacional"),
            63 to ("Colgado Alemán" to "Posición de movilidad para hombros"),
            64 to ("Pino" to "Equilibrio invertido sobre las manos"),
            65 to ("Flexión Pseudo Planche" to "Flexión inclinada para planche"),
            66 to ("Dominada Arquero" to "Dominada unilateral"),
            67 to ("Dominada a Una Mano" to "Dominada completa con un solo brazo"),
            68 to ("Flexión con Palmada" to "Flexión pliométrica explosiva"),
            69 to ("Fondos Coreanos" to "Fondos con manos detrás del cuerpo"),
            70 to ("Front Lever a Una Pierna" to "Front lever con una pierna extendida"),
            71 to ("Planche Recogida Avanzada" to "Progresión avanzada de tuck planche")
        )
    }
}
