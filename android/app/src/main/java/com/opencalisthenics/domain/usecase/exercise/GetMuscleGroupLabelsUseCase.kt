package com.opencalisthenics.domain.usecase.exercise

import com.opencalisthenics.domain.model.MuscleGroupLabels

class GetMuscleGroupLabelsUseCase {
    operator fun invoke(): Map<String, String> = MuscleGroupLabels.getAll()

    operator fun invoke(key: String): String = MuscleGroupLabels.getLabel(key)
}
