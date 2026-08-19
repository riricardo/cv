import type { CatalogExperience, Localized } from '../types/index.ts'

export const experience: Localized<CatalogExperience[]> = {
  en: [
    {
      id: 'bidvestNoonan',
      company: 'Bidvest Noonan',
      role: 'Cleaning Operative',
      location: 'Leixlip, County Kildare, Ireland',
      startDate: '2025-03',
      endDate: 'Present',
      description:
        'Work in a controlled cleanroom environment, following site procedures, safety requirements and operational standards.',
      highlights: [
        {
          category: 'general',
          value:
            'Carry out cleaning and waste-management duties according to hygiene, quality and safety procedures.',
        },
      ],
      technologies: ['Workplace Safety', 'Manual Handling', 'Teamwork'],
    },

    {
      id: 'linx',
      company: 'Linx',
      role: 'Junior Developer',
      location: 'Remote · Bebedouro, São Paulo, Brazil',
      startDate: '2021-09',
      endDate: '2024-09',
      description:
        'Worked on a Delphi-based corporate ERP for the pharmaceutical sector and related business applications, contributing to maintenance, bug fixes, new features, business rules, reporting and integrations using Delphi, C#, ASP.NET and SQL Server.',
      highlights: [
        {
          category: 'enterprise',
          value:
            'Maintained and enhanced a corporate ERP covering operational management, billing-related workflows and pharmaceutical business processes.',
        },
        {
          category: 'enterprise',
          value:
            'Designed and delivered a white-label customisation feature across the database, API and presentation layers, including structured configuration, key-based retrieval and caching.',
        },
        {
          category: 'backend',
          value:
            'Built backend and service-layer components using Dependency Injection, interface-based design, CQRS, MediatR, Dapper, Entity Framework and LINQ.',
        },
        {
          category: 'backend',
          value:
            'Implemented a resilient address lookup service with fallback across multiple external providers.',
        },
        {
          category: 'backend',
          value:
            'Configured dependency injection registrations for interfaces, services and application components across ASP.NET projects.',
        },
        {
          category: 'backend',
          value:
            'Developed service-layer components and contributed to projects using CQRS and MediatR.',
        },
        {
          category: 'desktop',
          value:
            'Developed and maintained features across Delphi desktop applications, ASP.NET Web Forms, ASP.NET MVC, Windows Forms and C# services.',
        },
        {
          category: 'desktop',
          value:
            'Co-developed reusable C# components and native-compatible libraries to integrate modern services with legacy Delphi applications.',
        },
        {
          category: 'desktop',
          value:
            'Integrated Chromium-based WebView functionality into a Delphi 7 application, enabling communication between web interfaces and legacy desktop workflows.',
        },
        {
          category: 'desktop',
          value:
            'Used a C# class library with UnmanagedExports to expose functionality that could be consumed by Delphi applications.',
        },
        {
          category: 'desktop',
          value:
            'Developed reusable Delphi routines for consuming external APIs and organising integration-related functionality.',
        },
        {
          category: 'desktop',
          value:
            'Created components designed to work both in a standard browser and inside the Delphi application WebView.',
        },
        {
          category: 'database',
          value:
            'Improved SQL queries, reporting routines and database access security, including protection against SQL injection.',
        },
        {
          category: 'database',
          value:
            'Worked with data consolidation and reporting features across business applications.',
        },
        {
          category: 'database',
          value: 'Created SQL scripts for database adjustments, updates and application releases.',
        },
        {
          category: 'team',
          value:
            'Planned, estimated, tested and documented feature work, delivering changes within the planned estimate.',
        },
        {
          category: 'team',
          value:
            'Worked with Git, Azure DevOps and Scrum practices, including feature branches, testing, release preparation, regression testing and technical documentation.',
        },
        {
          category: 'team',
          value:
            'Investigated and resolved issues involving debugging, merge conflicts, deployments, environments and system integrations.',
        },
        {
          category: 'team',
          value:
            'Participated in Scrum ceremonies including daily meetings, refinement, estimation, planning, reviews and retrospectives.',
        },
        {
          category: 'team',
          value:
            'Performed regression testing, environment configuration, release preparation and technical documentation.',
        },
        {
          category: 'team',
          value:
            'Produced clear technical documentation to support team understanding and future maintenance.',
        },
      ],
      technologies: [
        'C#',
        '.NET',
        'Delphi 7',
        'ASP.NET',
        'ASP.NET MVC',
        'ASP.NET Web Forms',
        'Windows Forms',
        'SQL Server',
        'SQL',
        'Dapper',
        'Entity Framework',
        'LINQ',
        'Dependency Injection',
        'CQRS',
        'MediatR',
        'Polly',
        'UnmanagedExports',
        'REST APIs',
        'WebView',
        'Chromium',
        'Tailwind CSS',
        'DaisyUI',
        'Git',
        'Azure DevOps',
        'Jira',
        'Scrum',
      ],
    },

    {
      id: 'syshouse',
      company: 'Syshouse Informática',
      role: 'Software Developer',
      location: 'Bebedouro, São Paulo, Brazil',
      startDate: '2020-01',
      endDate: '2021-09',
      description:
        'Worked across mobile, desktop, web and backend systems, contributing to ERP maintenance, new features, integrations, database access and performance improvements.',
      highlights: [
        {
          category: 'erp',
          value:
            'Maintained and enhanced the company’s main Delphi-based ERP system, delivering bug fixes, new features and performance improvements across business workflows.',
        },
        {
          category: 'erp',
          value:
            'Maintained a Delphi-based SMS solution that queried an API for pending messages and communicated directly with a modem.',
        },
        {
          category: 'mobile',
          value:
            'Maintained and enhanced a Xamarin-based waiter application using C#, XAML and MVVM, including bug fixes, UI adjustments, HTTP requests and new mobile features.',
        },
        {
          category: 'mobile',
          value:
            'Worked with push notifications, Firebase Cloud Messaging, SVG asset support and Google Play release support.',
        },
        {
          category: 'mobile',
          value: 'Configured Firebase Cloud Messaging for mobile notifications.',
        },
        {
          category: 'mobile',
          value: 'Added support for SVG assets through external Xamarin libraries.',
        },
        {
          category: 'backend',
          value:
            'Developed and maintained Delphi DataSnap APIs, including routes, database communication and application integrations.',
        },
        {
          category: 'backend',
          value:
            'Implemented synchronisation between SQL Server and Paradox through the Delphi DataSnap API.',
        },
        {
          category: 'backend',
          value:
            'Implemented token-based authentication, account-confirmation flows and e-mail delivery using MailKit.',
        },
        {
          category: 'backend',
          value:
            'Worked across the complete flow between mobile applications, backend APIs, SQL Server, Paradox and the Delphi ERP system.',
        },
        {
          category: 'database',
          value:
            'Resolved a concurrency issue by using a mutex to control simultaneous access to a Paradox database table.',
        },
        {
          category: 'database',
          value:
            'Implemented database access using SqlClient and integrated the application with the Delphi DataSnap API.',
        },
        {
          category: 'database',
          value: 'Worked with secure file-based configuration storage and application integration.',
        },
        {
          category: 'web',
          value:
            'Contributed to a customer ordering web application built with ASP.NET and SQL Server, including SqlClient database access and integration with the Delphi DataSnap API.',
        },
        {
          category: 'web',
          value:
            'Contributed to login, confirmation and communication workflows involving e-mail and SMS.',
        },
      ],
      technologies: [
        'C#',
        'Delphi',
        'Xamarin',
        'XAML',
        'MVVM',
        'ASP.NET',
        'Delphi DataSnap',
        'SQL Server',
        'Paradox',
        'ADO.NET',
        'SqlClient',
        'REST APIs',
        'HTTP',
        'Firebase Cloud Messaging',
        'MailKit',
        'Mutex',
        'Google Play',
        'SVG',
      ],
    },

    {
      id: 'japi',
      company: 'Japi S.A. Indústria e Comércio',
      role: 'Intern',
      location: 'Jundiaí, São Paulo, Brazil',
      startDate: '2019-01',
      endDate: '2019-03',
      description:
        'Supported inventory-control and production-related activities in an industrial environment.',
      highlights: [
        {
          category: 'general',
          value: 'Assisted with stock checks, item counting and inventory records.',
        },
        {
          category: 'general',
          value: 'Supported sampling and inspection of plastic components.',
        },
        {
          category: 'general',
          value: 'Followed operational procedures and collaborated with the production team.',
        },
      ],
      technologies: [
        'Inventory Control',
        'Stock Management',
        'Quality Inspection',
        'Attention to Detail',
        'Teamwork',
      ],
    },

    {
      id: 'numericalAnalysisTutor',
      company: 'University of São Paulo · EESC',
      role: 'Numerical Analysis Tutor',
      location: 'São Carlos, São Paulo, Brazil',
      startDate: '2018-08',
      endDate: '2018-12',
      description:
        'Assisted undergraduate students in Numerical Analysis, helping them understand mathematical concepts and solve engineering problems.',
      highlights: [
        {
          category: 'general',
          value:
            'Provided academic support during practical exercises and problem-solving sessions.',
        },
        {
          category: 'general',
          value:
            'Helped students understand numerical methods and apply them to engineering problems.',
        },
        {
          category: 'general',
          value: 'Developed communication, analytical-thinking and technical-explanation skills.',
        },
      ],
      technologies: [
        'Numerical Analysis',
        'Mathematics',
        'Problem Solving',
        'Technical Communication',
        'Analytical Thinking',
        'Mentoring',
      ],
    },
  ],

  pt: [
    {
      id: 'bidvestNoonan',
      company: 'Bidvest Noonan',
      role: 'Operador de Limpeza',
      location: 'Leixlip, County Kildare, Irlanda',
      startDate: '2025-03',
      endDate: 'Atual',
      description:
        'Atuo em ambiente controlado de cleanroom, seguindo procedimentos do local, requisitos de segurança e padrões operacionais.',
      highlights: [
        {
          category: 'general',
          value:
            'Realizo atividades de limpeza e gerenciamento de resíduos conforme procedimentos de higiene, qualidade e segurança.',
        },
      ],
      technologies: ['Segurança no Trabalho', 'Manual Handling', 'Trabalho em Equipe'],
    },

    {
      id: 'linx',
      company: 'Linx',
      role: 'Desenvolvedor Júnior',
      location: 'Remoto · Bebedouro, São Paulo, Brasil',
      startDate: '2021-09',
      endDate: '2024-09',
      description:
        'Trabalhei em um ERP corporativo em Delphi para o setor farmacêutico e em aplicações de negócio relacionadas, contribuindo com manutenção, correção de bugs, novas funcionalidades, regras de negócio, relatórios e integrações utilizando Delphi, C#, ASP.NET e SQL Server.',
      highlights: [
        {
          category: 'enterprise',
          value:
            'Mantive e evoluí um ERP corporativo com funcionalidades de gestão operacional, processos relacionados a faturamento/cobrança e regras de negócio do setor farmacêutico.',
        },
        {
          category: 'enterprise',
          value:
            'Planejei e entreguei uma funcionalidade de personalização white-label envolvendo banco de dados, API e camada de apresentação, com configuração estruturada, recuperação por chave e cache.',
        },
        {
          category: 'backend',
          value:
            'Desenvolvi componentes backend e de camada de serviços utilizando Injeção de Dependência, design baseado em interfaces, CQRS, MediatR, Dapper, Entity Framework e LINQ.',
        },
        {
          category: 'backend',
          value:
            'Implementei um serviço resiliente de consulta de endereços com fallback entre múltiplos provedores externos.',
        },
        {
          category: 'backend',
          value:
            'Configurei registros de Injeção de Dependência para interfaces, serviços e componentes de aplicações ASP.NET.',
        },
        {
          category: 'backend',
          value:
            'Desenvolvi componentes da camada de serviços e contribuí para projetos utilizando CQRS e MediatR.',
        },
        {
          category: 'desktop',
          value:
            'Desenvolvi e mantive funcionalidades em aplicações desktop Delphi, ASP.NET Web Forms, ASP.NET MVC, Windows Forms e serviços em C#.',
        },
        {
          category: 'desktop',
          value:
            'Codesenvolvi componentes reutilizáveis em C# e bibliotecas compatíveis com código nativo para integrar serviços modernos a aplicações Delphi legadas.',
        },
        {
          category: 'desktop',
          value:
            'Integrei uma WebView baseada em Chromium a uma aplicação Delphi 7, permitindo a comunicação entre interfaces web e fluxos do sistema desktop legado.',
        },
        {
          category: 'desktop',
          value:
            'Utilizei uma Class Library em C# com UnmanagedExports para expor funcionalidades que pudessem ser consumidas por aplicações Delphi.',
        },
        {
          category: 'desktop',
          value:
            'Desenvolvi rotinas reutilizáveis em Delphi para consumo de APIs externas e organização das funcionalidades de integração.',
        },
        {
          category: 'desktop',
          value:
            'Criei componentes preparados para funcionar tanto no navegador quanto dentro da WebView da aplicação Delphi.',
        },
        {
          category: 'database',
          value:
            'Otimizei consultas SQL, rotinas de relatórios e segurança de acesso ao banco de dados, incluindo proteção contra SQL injection.',
        },
        {
          category: 'database',
          value:
            'Trabalhei com consolidação de dados e funcionalidades de relatórios em aplicações corporativas.',
        },
        {
          category: 'database',
          value: 'Criei scripts SQL para ajustes de banco, atualizações e releases das aplicações.',
        },
        {
          category: 'team',
          value:
            'Planejei, estimei, testei e documentei funcionalidades, entregando mudanças dentro da estimativa planejada.',
        },
        {
          category: 'team',
          value:
            'Trabalhei com Git, Azure DevOps e práticas Scrum, incluindo branches, testes, preparação de releases, testes regressivos e documentação técnica.',
        },
        {
          category: 'team',
          value:
            'Investiguei e resolvi problemas relacionados a debugging, conflitos de merge, deployments, ambientes e integrações entre sistemas.',
        },
        {
          category: 'team',
          value:
            'Participei de cerimônias Scrum, incluindo reuniões diárias, refinamentos, estimativas, planejamentos, reviews e retrospectivas.',
        },
        {
          category: 'team',
          value:
            'Realizei testes regressivos, configuração de ambientes, preparação de releases e documentação técnica.',
        },
        {
          category: 'team',
          value:
            'Produzi documentação técnica clara para apoiar o entendimento da equipe e a manutenção futura.',
        },
      ],
      technologies: [
        'C#',
        '.NET',
        'Delphi',
        'Delphi 7',
        'ASP.NET',
        'ASP.NET MVC',
        'ASP.NET Web Forms',
        'Windows Forms',
        'SQL Server',
        'SQL',
        'Dapper',
        'Entity Framework',
        'LINQ',
        'Injeção de Dependência',
        'CQRS',
        'MediatR',
        'Polly',
        'UnmanagedExports',
        'APIs REST',
        'WebView',
        'Chromium',
        'Tailwind CSS',
        'DaisyUI',
        'Git',
        'Azure DevOps',
        'Jira',
        'Scrum',
      ],
    },

    {
      id: 'syshouse',
      company: 'Syshouse Informática',
      role: 'Desenvolvedor de Software',
      location: 'Bebedouro, São Paulo, Brasil',
      startDate: '2020-01',
      endDate: '2021-09',
      description:
        'Trabalhei em sistemas mobile, desktop, web e backend, contribuindo para manutenção de ERP, novas funcionalidades, integrações, acesso a banco de dados e melhorias de desempenho.',
      highlights: [
        {
          category: 'erp',
          value:
            'Realizei manutenção e evolução do ERP principal da empresa em Delphi, desenvolvendo correções de bugs, novas funcionalidades e otimizações em diferentes fluxos de negócio.',
        },
        {
          category: 'erp',
          value:
            'Mantive uma solução de envio de SMS em Delphi que consultava uma API para mensagens pendentes e se comunicava diretamente com um modem.',
        },
        {
          category: 'mobile',
          value:
            'Realizei manutenção e evolução de um aplicativo para garçons desenvolvido em Xamarin, utilizando C#, XAML e MVVM, incluindo correções, ajustes de interface, requisições HTTP e novas funcionalidades.',
        },
        {
          category: 'mobile',
          value:
            'Trabalhei com notificações push, Firebase Cloud Messaging, suporte a imagens SVG e publicações na Google Play.',
        },
        {
          category: 'mobile',
          value: 'Configurei o Firebase Cloud Messaging para notificações mobile.',
        },
        {
          category: 'mobile',
          value: 'Implementei suporte a imagens SVG utilizando bibliotecas externas para Xamarin.',
        },
        {
          category: 'backend',
          value:
            'Desenvolvi e mantive APIs em Delphi DataSnap, incluindo rotas, comunicação com banco de dados e integrações entre aplicações.',
        },
        {
          category: 'backend',
          value:
            'Implementei sincronização entre SQL Server e Paradox por meio da API Delphi DataSnap.',
        },
        {
          category: 'backend',
          value:
            'Implementei autenticação baseada em token, confirmação de contas e envio de e-mails utilizando MailKit.',
        },
        {
          category: 'backend',
          value:
            'Trabalhei no fluxo completo entre aplicações mobile, APIs backend, SQL Server, Paradox e o ERP em Delphi.',
        },
        {
          category: 'database',
          value:
            'Resolvi um problema de concorrência utilizando Mutex para controlar o acesso simultâneo a uma tabela do banco Paradox.',
        },
        {
          category: 'database',
          value:
            'Implementei acesso ao banco utilizando SqlClient e integrei a aplicação à API Delphi DataSnap.',
        },
        {
          category: 'database',
          value:
            'Trabalhei com armazenamento seguro de configurações em arquivos e integração entre aplicações.',
        },
        {
          category: 'web',
          value:
            'Contribuí para uma aplicação web de pedidos de clientes desenvolvida com ASP.NET e SQL Server, incluindo acesso ao banco com SqlClient e integração com a API Delphi DataSnap.',
        },
        {
          category: 'web',
          value:
            'Contribuí para fluxos de login, confirmação e comunicação envolvendo e-mail e SMS.',
        },
      ],
      technologies: [
        'C#',
        'Delphi',
        'Xamarin',
        'XAML',
        'MVVM',
        'ASP.NET',
        'Delphi DataSnap',
        'SQL Server',
        'Paradox',
        'ADO.NET',
        'SqlClient',
        'APIs REST',
        'HTTP',
        'Firebase Cloud Messaging',
        'MailKit',
        'Mutex',
        'Google Play',
        'SVG',
      ],
    },

    {
      id: 'japi',
      company: 'Japi S.A. Indústria e Comércio',
      role: 'Estagiário',
      location: 'Jundiaí, São Paulo, Brasil',
      startDate: '2019-01',
      endDate: '2019-03',
      description:
        'Supported inventory-control and production-related activities in an industrial environment.',
      highlights: [
        {
          category: 'general',
          value:
            'Auxiliei na conferência de estoque, contagem de itens e atualização de registros.',
        },
        {
          category: 'general',
          value: 'Apoiei a amostragem e inspeção de componentes plásticos.',
        },
        {
          category: 'general',
          value:
            'Segui procedimentos operacionais e trabalhei em conjunto com a equipe de produção.',
        },
      ],
      technologies: [
        'Controle de Estoque',
        'Gestão de Estoque',
        'Inspeção de Qualidade',
        'Atenção aos Detalhes',
        'Trabalho em Equipe',
      ],
    },

    {
      id: 'numericalAnalysisTutor',
      company: 'Universidade de São Paulo · EESC',
      role: 'Monitor de Cálculo Numérico',
      location: 'São Carlos, São Paulo, Brasil',
      startDate: '2018-08',
      endDate: '2018-12',
      description:
        'Atuei como monitor de Cálculo Numérico, auxiliando alunos de graduação na compreensão de conceitos matemáticos e na resolução de problemas de engenharia.',
      highlights: [
        {
          category: 'general',
          value:
            'Prestei suporte acadêmico durante exercícios práticos e atividades de resolução de problemas.',
        },
        {
          category: 'general',
          value:
            'Auxiliei alunos na compreensão de métodos numéricos e de sua aplicação em problemas de engenharia.',
        },
        {
          category: 'general',
          value:
            'Desenvolvi habilidades de comunicação, raciocínio analítico e explicação técnica.',
        },
      ],
      technologies: [
        'Cálculo Numérico',
        'Matemática',
        'Resolução de Problemas',
        'Comunicação Técnica',
        'Pensamento Analítico',
        'Mentoria',
      ],
    },
  ],
}
