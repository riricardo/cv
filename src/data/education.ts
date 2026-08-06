import type { Education, Localized } from '../types/index.ts'

export const education = {
  en: {
    usp: {
      institution: 'University of São Paulo',
      degree: "Bachelor's Degree in Electrical Engineering — Power Systems and Automation",
      location: 'São Carlos, São Paulo, Brazil',
      startDate: '2014-02',
      endDate: '2019-12',
      description:
        'Electrical Engineering degree with an emphasis on Power Systems and Automation, combining analytical engineering foundations with programming, digital systems, microprocessors and practical project work.',
      highlights: [
        'Developed a strong foundation in mathematics, logic, engineering analysis and structured problem-solving.',
        'Studied programming fundamentals in C and completed practical assignments involving control structures, functions and console-based applications.',
        'Developed a command-line game in C featuring a map, walls, player movement, bombs, items and objectives.',
        'Completed coursework in digital systems, including logic gates, digital circuits and practical laboratory activities.',
        'Programmed the 8051 microcontroller in Assembly during microprocessor laboratory exercises.',
        'Completed a final-year project focused on modelling a turbine system using a DC motor.',
        'Participated in the Warthog Robotics team and contributed to the design, assembly, testing and integration of a robot control board used in competition.',
      ],
      technologies: [
        'C',
        'Assembly',
        '8051 Microcontroller',
        'Digital Systems',
        'Microprocessors',
        'Mathematical Modelling',
        'Automation',
        'Electronic Circuits',
        'Problem Solving',
        'Teamwork',
      ],
    },

    linkoping: {
      institution: 'Linköping University',
      degree: 'Electrical Engineering Exchange Program',
      location: 'Linköping, Sweden',
      startDate: '2018-01',
      endDate: '2018-06',
      description:
        'Completed an international exchange semester in Electrical Engineering, studying and collaborating in an English-speaking and multicultural academic environment.',
      highlights: [
        'Completed engineering coursework in an international academic environment.',
        'Collaborated with students from different countries in team-based projects and academic activities conducted in English.',
        'Developed cross-cultural communication, adaptability and teamwork skills.',
        'Strengthened technical communication and problem-solving in an international context.',
      ],
      technologies: [
        'Engineering Analysis',
        'Problem Solving',
        'Teamwork',
        'Cross-Cultural Communication',
        'English',
      ],
    },

    senac: {
      institution: 'Senac São Paulo',
      degree: 'Mobile Development — React Native and Node.js',
      location: 'São Paulo, Brazil',
      startDate: '2019-08',
      endDate: '2019-11',
      description:
        'Practical mobile development course that supported my transition into software development, with an introduction to JavaScript, React Native, Node.js and client-server applications.',
      highlights: [
        'Studied introductory JavaScript, React Native and Node.js concepts.',
        'Developed a mobile application as part of a group project.',
        'Contributed to the creation of a backend API consumed by the mobile application.',
        'Practised mobile interface development and client-server communication.',
        'Worked collaboratively with other students throughout the project.',
      ],
      technologies: [
        'JavaScript',
        'React Native',
        'Node.js',
        'Mobile Development',
        'REST APIs',
        'Client-Server Communication',
        'Teamwork',
      ],
    },
  },

  pt: {
    usp: {
      institution: 'Universidade de São Paulo',
      degree: 'Bacharelado em Engenharia Elétrica — Sistemas de Energia e Automação',
      location: 'São Carlos, São Paulo, Brasil',
      startDate: '2014-02',
      endDate: '2019-12',
      description:
        'Graduação em Engenharia Elétrica com ênfase em Sistemas de Energia e Automação, combinando fundamentos analíticos de engenharia com programação, sistemas digitais, microprocessadores e projetos práticos.',
      highlights: [
        'Desenvolvi uma base sólida em matemática, lógica, análise de engenharia e resolução estruturada de problemas.',
        'Estudei fundamentos de programação em C e desenvolvi exercícios práticos envolvendo estruturas de controle, funções e aplicações em modo texto.',
        'Desenvolvi em C um jogo executado no terminal, com mapa, paredes, movimentação do personagem, bombas, itens e objetivos.',
        'Cursei disciplinas de sistemas digitais, trabalhando com portas lógicas, circuitos digitais e atividades práticas de laboratório.',
        'Programei o microcontrolador 8051 em Assembly durante atividades de laboratório de microprocessadores.',
        'Desenvolvi o Trabalho de Conclusão de Curso com foco na modelagem de uma turbina utilizando um motor de corrente contínua.',
        'Participei da equipe Warthog Robotics, contribuindo para o projeto, montagem, testes e integração de uma placa de controle utilizada pelo robô em competição.',
      ],
      technologies: [
        'C',
        'Assembly',
        'Microcontrolador 8051',
        'Sistemas Digitais',
        'Microprocessadores',
        'Modelagem Matemática',
        'Automação',
        'Circuitos Eletrônicos',
        'Resolução de Problemas',
        'Trabalho em Equipe',
      ],
    },

    linkoping: {
      institution: 'Linköping University',
      degree: 'Programa de Intercâmbio em Engenharia Elétrica',
      location: 'Linköping, Suécia',
      startDate: '2018-01',
      endDate: '2018-06',
      description:
        'Concluí um semestre de intercâmbio internacional em Engenharia Elétrica, estudando e colaborando em um ambiente acadêmico multicultural e de língua inglesa.',
      highlights: [
        'Cursei disciplinas de engenharia em um ambiente acadêmico internacional.',
        'Colaborei com estudantes de diferentes países em projetos em grupo e atividades acadêmicas realizadas em inglês.',
        'Desenvolvi comunicação intercultural, adaptação e trabalho em equipe.',
        'Aprimorei a comunicação técnica e a resolução de problemas em um contexto internacional.',
      ],
      technologies: [
        'Análise de Engenharia',
        'Resolução de Problemas',
        'Trabalho em Equipe',
        'Comunicação Intercultural',
        'Inglês',
      ],
    },

    senac: {
      institution: 'Senac São Paulo',
      degree: 'Desenvolvimento Mobile — React Native e Node.js',
      location: 'São Paulo, Brasil',
      startDate: '2019-08',
      endDate: '2019-11',
      description:
        'Curso prático de desenvolvimento mobile que apoiou minha transição para a área de software, com introdução a JavaScript, React Native, Node.js e aplicações cliente-servidor.',
      highlights: [
        'Estudei conceitos introdutórios de JavaScript, React Native e Node.js.',
        'Desenvolvi um aplicativo mobile como parte de um projeto em grupo.',
        'Contribuí para a criação de uma API backend consumida pelo aplicativo.',
        'Pratiquei desenvolvimento de interfaces mobile e comunicação cliente-servidor.',
        'Trabalhei de forma colaborativa com outros alunos durante o projeto.',
      ],
      technologies: [
        'JavaScript',
        'React Native',
        'Node.js',
        'Desenvolvimento Mobile',
        'APIs REST',
        'Comunicação Cliente-Servidor',
        'Trabalho em Equipe',
      ],
    },
  },
} satisfies Localized<Record<string, Education>>
