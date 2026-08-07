import type { PersonalInfo } from '../../types/index.ts'
import ContactList from './ContactList.tsx'

type ResumeHeaderProps = {
  personalInfo: PersonalInfo
  profilePhotoUrl: string
}

function getMapUrl(location: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
}

function ResumeHeader({ personalInfo, profilePhotoUrl }: ResumeHeaderProps) {
  const [firstName, ...remainingNameParts] = personalInfo.name.split(' ')
  const lastName = remainingNameParts.join(' ')

  return (
    <header className="min-w-0 overflow-hidden rounded-2xl border border-base-300/80 bg-[linear-gradient(135deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.9)_55%,_rgba(241,245,249,0.72))] p-4 shadow-sm sm:rounded-[1.5rem] sm:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="role-tag">
              <span aria-hidden="true" className="fa-solid fa-briefcase" />
              {personalInfo.professionalDescription}
            </span>
            <a
              className="info-pill"
              href={getMapUrl(personalInfo.location)}
              rel="noreferrer"
              target="_blank"
            >
              <span aria-hidden="true" className="fa-solid fa-location-dot text-blue-800" />
              <span className="location-screen-label">
                {personalInfo.displayLocation ?? personalInfo.location}
              </span>
              <span className="location-print-label">{personalInfo.location}</span>
            </a>
          </div>

          <div className="profile-name-row mt-4">
            <div className="profile-photo interactive-only">
              <img alt={personalInfo.name} src={profilePhotoUrl} />
            </div>

            <div className="min-w-0">
              <h1 className="text-4xl font-bold leading-tight text-slate-950 break-anywhere sm:text-5xl">
                <span className="screen-name">
                  <span className="block">{firstName}</span>
                  {lastName ? <span className="block">{lastName}</span> : null}
                </span>
                <span className="print-name">{personalInfo.fullName ?? personalInfo.name}</span>
              </h1>
            </div>
          </div>
        </div>

        <ContactList personalInfo={personalInfo} />
      </div>
    </header>
  )
}

export default ResumeHeader
