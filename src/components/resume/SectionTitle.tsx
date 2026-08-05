type SectionTitleProps = {
  children: string
  id?: string
}

function SectionTitle({ children, id }: SectionTitleProps) {
  return (
    <h2 className="resume-section-title" id={id}>
      {children}
    </h2>
  )
}

export default SectionTitle
