import type { Language, Localized } from '../types/index.ts'
import type { SkillAreaId } from '../types/resume-data.ts'

type ResumeTranslation = {
  actionsLabel: string
  interactiveMessage: string
  whyTitle: string
  portfolio: string
  download: string
  downloadAriaLabel: string
  downloadTitle: string
  summary: string
  experience: string
  projects: string
  skills: string
  skillAreaTitles: Record<SkillAreaId, string>
  languages: string
  education: string
  closeWhyDialog: string
  close: string
  seeLess: string
  seeMore: string
  present: string
  repository: string
  demo: string
}

export const resumeTranslations = {
  en: {
    actionsLabel: 'Interactive resume actions',
    interactiveMessage: 'This resume includes interactive features!',
    whyTitle: 'Why Ric?',
    portfolio: 'Portfolio',
    download: 'Download CV',
    downloadAriaLabel: 'Download CV by opening the print dialog',
    downloadTitle: 'Open print dialog without interactive elements',
    summary: 'Professional Summary',
    experience: 'Experience',
    projects: 'Projects',
    skills: 'Skills',
    skillAreaTitles: {
      backend: 'Backend',
      frontend: 'Frontend',
      databases: 'Databases',
      architecture: 'Architecture & Practices',
      tools: 'Tools',
    },
    languages: 'Languages',
    education: 'Education',
    closeWhyDialog: 'Close Why Ric dialog',
    close: 'close',
    seeLess: 'See less',
    seeMore: 'See more',
    present: 'Present',
    repository: 'Repository',
    demo: 'Demo',
  },
  pt: {
    actionsLabel: 'Ações interativas do currículo',
    interactiveMessage: 'Este currículo inclui recursos interativos!',
    whyTitle: 'Por que Ric?',
    portfolio: 'Portfólio',
    download: 'Baixar CV',
    downloadAriaLabel: 'Baixar CV abrindo a janela de impressão',
    downloadTitle: 'Abrir janela de impressão sem elementos interativos',
    summary: 'Resumo Profissional',
    experience: 'Experiência',
    projects: 'Projetos',
    skills: 'Competências',
    skillAreaTitles: {
      backend: 'Backend',
      frontend: 'Frontend',
      databases: 'Bancos de Dados',
      architecture: 'Arquitetura e Práticas',
      tools: 'Ferramentas',
    },
    languages: 'Idiomas',
    education: 'Formação',
    closeWhyDialog: 'Fechar diálogo Por que Ric',
    close: 'fechar',
    seeLess: 'Ver menos',
    seeMore: 'Ver mais',
    present: 'Atual',
    repository: 'Repositório',
    demo: 'Demo',
  },
} satisfies Localized<ResumeTranslation>

export type ResumeText = (typeof resumeTranslations)[Language]
