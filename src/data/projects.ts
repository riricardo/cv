import type { Localized, Project } from '../types/index.ts'

export const projects = {
  en: {
    cvWebsite: {
      name: 'Interactive CV & Portfolio Website',
      description:
        'Responsive bilingual website developed to present different versions of my professional CV and portfolio. The project uses structured and reusable TypeScript data, allowing personal information, experience, education, projects and translations to be maintained separately from the interface. It is designed for comfortable reading on mobile and desktop, while also providing a clean, traditional CV layout when printed.',
      technologies: [
        'React',
        'TypeScript',
        'Vite',
        'Responsive Design',
        'Data-Driven UI',
        'Internationalisation',
        'Print CSS',
        'Git',
        'GitHub Pages',
      ],
      repositoryUrl: 'https://github.com/riricardo/cv',
      demoUrl: 'https://riricardo.github.io/cv',
    },

    warthogRobotics: {
      name: 'Warthog Robotics',
      description:
        'University robotics project focused on developing autonomous football-playing robots. I worked with the electronics team on the design and implementation of a robot control board, contributing to circuit design, component selection, assembly, testing and integration. The completed board was installed in the robot and used in competition, with guidance from more experienced team members.',
      technologies: [
        'PCB Design',
        'Electronic Circuits',
        'Robotics',
        'Hardware Testing',
        'Embedded Systems',
        'Problem Solving',
        'Teamwork',
      ],
    },
  },

  pt: {
    cvWebsite: {
      name: 'Site Interativo de Currículo e Portfólio',
      description:
        'Site bilíngue e responsivo desenvolvido para apresentar diferentes versões do meu currículo profissional e portfólio. O projeto utiliza dados estruturados e reutilizáveis em TypeScript, permitindo manter informações pessoais, experiências, formação, projetos e traduções separadas da interface. Foi planejado para oferecer boa leitura em dispositivos móveis e desktop, além de gerar um formato tradicional e limpo de currículo ao ser impresso.',
      technologies: [
        'React',
        'TypeScript',
        'Vite',
        'Design Responsivo',
        'Interface Orientada a Dados',
        'Internacionalização',
        'CSS para Impressão',
        'Git',
        'GitHub Pages',
      ],
      repositoryUrl: 'https://github.com/riricardo/cv',
      demoUrl: 'https://riricardo.github.io/cv',
    },

    warthogRobotics: {
      name: 'Warthog Robotics',
      description:
        'Projeto universitário de robótica voltado ao desenvolvimento de robôs autônomos capazes de jogar futebol. Trabalhei com a equipe de eletrônica no projeto e implementação de uma placa de controle do robô, contribuindo para o projeto do circuito, seleção de componentes, montagem, testes e integração. A placa concluída foi instalada no robô e utilizada em competição, com o suporte de integrantes mais experientes da equipe.',
      technologies: [
        'Projeto de PCB',
        'Circuitos Eletrônicos',
        'Robótica',
        'Testes de Hardware',
        'Sistemas Embarcados',
        'Resolução de Problemas',
        'Trabalho em Equipe',
      ],
    },
  },
} satisfies Localized<Record<string, Project>>
