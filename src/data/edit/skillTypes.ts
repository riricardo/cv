import type { EditableRecord } from '../../types/edit.ts'

export const fixedSkillTypes = [
  { id: 'language', title: 'Languages' },
  { id: 'framework', title: 'Frameworks' },
  { id: 'database', title: 'Databases' },
  { id: 'tool', title: 'Tools' },
  { id: 'concept', title: 'Concepts' },
  { id: 'skill', title: 'Other skills' },
] as const

export function groupSkillsByFixedType(skills: EditableRecord[]) {
  return fixedSkillTypes.map((skillType) => ({
    ...skillType,
    skills: skills.filter((skill) => skill.type === skillType.id),
  }))
}
