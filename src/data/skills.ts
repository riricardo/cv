import type { SkillAreas } from '../types/index.ts'

const backendSkills = {
  csharp: 'C#',
  dotnet: '.NET',
  aspNet: 'ASP.NET',
  delphiDataSnap: 'Delphi DataSnap',
  restApis: 'REST APIs',
  http: 'HTTP',
  mailKit: 'MailKit',
  polly: 'Polly',
}

const frontendSkills = {
  react: 'React',
  aspNetMvc: 'ASP.NET MVC',
  aspNetWebForms: 'ASP.NET Web Forms',
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  html: 'HTML',
  css: 'CSS',
  tailwindCss: 'Tailwind CSS',
  daisyui: 'DaisyUI',
  xaml: 'XAML',
  xamarin: 'Xamarin',
  reactNative: 'React Native',
  windowsForms: 'Windows Forms',
}

const databaseSkills = {
  sqlServer: 'SQL Server',
  sql: 'SQL',
  dapper: 'Dapper',
  entityFramework: 'Entity Framework',
  adoNet: 'ADO.NET',
  sqlClient: 'SqlClient',
  linq: 'LINQ',
  paradox: 'Paradox',
}

const architectureSkills = {
  objectOrientedProgramming: 'Object-Oriented Programming',
  dependencyInjection: 'Dependency Injection',
  interfaceBasedDesign: 'Interface-Based Design',
  cqrs: 'CQRS',
  mediatr: 'MediatR',
  mvvm: 'MVVM',
  mvc: 'MVC',
  caching: 'Caching',
}

const toolSkills = {
  delphi: 'Delphi',
  git: 'Git',
  azureDevOps: 'Azure DevOps',
  jira: 'Jira',
  scrum: 'Scrum',
  firebaseCloudMessaging: 'Firebase Cloud Messaging',
  googlePlay: 'Google Play',
  chromiumWebView: 'Chromium WebView',
  unmanagedExports: 'UnmanagedExports',
}

export const skills = {
  backend: Object.values(backendSkills),
  frontend: Object.values(frontendSkills),
  databases: Object.values(databaseSkills),
  architecture: Object.values(architectureSkills),
  tools: Object.values(toolSkills),
} satisfies SkillAreas
