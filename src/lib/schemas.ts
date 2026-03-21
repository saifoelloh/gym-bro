import { z } from 'zod'

export const SetPayloadSchema = z.object({
  set_number: z.number().int().positive(),
  reps: z.number().int().positive().optional(),
  weight_kg: z.number().positive().optional(),
  duration_seconds: z.number().int().positive().optional(),
  rest_seconds: z.number().int().nonnegative().optional(),
  notes: z.string().optional()
})

export const ExercisePayloadSchema = z.object({
  exerciseId: z.string().uuid(),
  exerciseOrder: z.number().int().nonnegative(),
  notes: z.string().optional(),
  sets: z.array(SetPayloadSchema)
})

export const CreateWorkoutSchema = z.object({
  name: z.string().min(1).max(100),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().optional(),
  rpe: z.number().int().min(1).max(10).optional(),
  duration_minutes: z.number().int().positive().optional(),
  exercises: z.array(ExercisePayloadSchema).min(1),
})

export const TemplateExercisePayloadSchema = z.object({
  exercise_id: z.string().uuid(),
  exercise_order: z.number().int().nonnegative(),
  target_sets: z.number().int().positive(),
  notes: z.string().optional()
})

export const CreateTemplateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  exercises: z.array(TemplateExercisePayloadSchema)
})

export const UpdateTemplateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  exercises: z.array(TemplateExercisePayloadSchema).optional()
})
