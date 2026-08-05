import type { PersonalInfo } from '../../types/index.ts'

type ContactItem = {
  href?: string
  icon: string
  label: string
}

type ContactListProps = {
  personalInfo: PersonalInfo
}

function isContactItem(item: ContactItem | undefined): item is ContactItem {
  return Boolean(item)
}

function getContactItems(personalInfo: PersonalInfo) {
  return (
    [
      personalInfo.email
        ? {
            href: `mailto:${personalInfo.email}`,
            icon: 'fa-solid fa-envelope',
            label: personalInfo.email,
          }
        : undefined,
      personalInfo.phone
        ? {
            href: `tel:${personalInfo.phone.replaceAll(' ', '')}`,
            icon: 'fa-solid fa-phone',
            label: personalInfo.phone,
          }
        : undefined,
      {
        href: personalInfo.githubUrl,
        icon: 'fa-brands fa-github',
        label: 'GitHub',
      },
      {
        href: personalInfo.linkedInUrl,
        icon: 'fa-brands fa-linkedin',
        label: 'LinkedIn',
      },
      personalInfo.nationality
        ? {
            icon: 'fa-solid fa-passport',
            label: personalInfo.nationality,
          }
        : undefined,
    ] satisfies Array<ContactItem | undefined>
  ).filter(isContactItem)
}

function ContactList({ personalInfo }: ContactListProps) {
  const items = getContactItems(personalInfo)

  return (
    <ul className="grid w-full min-w-0 gap-2 text-sm text-slate-700 md:w-auto md:min-w-64">
      {items.map((item) => (
        <li key={item.label}>
          {item.href ? (
            <a
              className="grid grid-cols-[1.5rem_minmax(0,1fr)] items-center gap-2 rounded-2xl border border-base-300/70 bg-base-100/65 px-3 py-2 text-slate-700 underline-offset-4 shadow-sm transition hover:-translate-y-px hover:bg-base-100 hover:text-blue-800 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              href={item.href}
              rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
              target={item.href.startsWith('http') ? '_blank' : undefined}
            >
              <span aria-hidden="true" className={`${item.icon} text-center text-blue-800`} />
              <span className="min-w-0 break-anywhere">{item.label}</span>
            </a>
          ) : (
            <div className="grid grid-cols-[1.5rem_minmax(0,1fr)] items-center gap-2 rounded-2xl border border-base-300/70 bg-base-100/65 px-3 py-2 text-slate-700 shadow-sm">
              <span aria-hidden="true" className={`${item.icon} text-center text-blue-800`} />
              <span className="min-w-0 break-anywhere">{item.label}</span>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}

export default ContactList
