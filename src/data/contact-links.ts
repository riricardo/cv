import type { ContactLink } from '../types/resume.js'

export const contactLinks = {
  github: {
    label: 'GitHub',
    url: 'https://github.com/riricardo',
    icon: 'fa-brands fa-github',
  },
  linkedin: {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/',
    icon: 'fa-brands fa-linkedin',
  },
} satisfies Record<string, ContactLink>
