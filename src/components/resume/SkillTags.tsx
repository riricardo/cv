type SkillTagsProps = {
  items: string[]
}

function SkillTags({ items }: SkillTagsProps) {
  if (!items.length) {
    return null
  }

  return (
    <ul className="skill-tags">
      {items.map((item) => (
        <li className="skill-tag" key={item}>
          {item}
        </li>
      ))}
    </ul>
  )
}

export default SkillTags
