import React from 'react';
import { Button } from '@/components/ui/button';

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  type: string;
  company: string;
  salaryRange: string;
  requirements: string[];
  benefits: string[];
  modality: string;
}

const jobs: Job[] = [
  {
    id: 1,
    title: "Fullstack Developer",
    description: "Desenvolvedor fullstack com experiência em Node.js e PHP.",
    location: "São Paulo",
    type: "Estágio",
    company: "NIDO Tecnologia",
    salaryRange: "R$ 1.200,00 - R$ 2.000,00",
    requirements: ["MySQL", "PHP", "Git", "Node.js"],
    benefits: ["Vale alimentação", "Gympass", "Horário Flexível"],
    modality: "Remoto",
  },
  {
    id: 2,
    title: "Backend C# .Net Developer (Sênior)",
    description: "Desenvolvedor backend experiente em C# e .NET Core.",
    location: "Curitiba",
    type: "Sênior",
    company: "Astro Technologies",
    salaryRange: "R$ 8.000,00 - R$ 15.000,00",
    requirements: ["API", "C#", ".NET Core", "Microsoft SQL Server"],
    benefits: ["Vale Transporte", "Plano de saúde", "Gympass"],
    modality: "Presencial",
  },
  {
    id: 3,
    title: "Tech Lead (Python)",
    description: "Líder técnico com forte conhecimento em Python.",
    location: "Campinas",
    type: "Júnior",
    company: "Banco Nexus",
    salaryRange: "R$ 3.000,00 - R$ 5.000,00",
    requirements: ["JavaScript", "Linux", "Python"],
    benefits: ["Vale alimentação", "Plano de saúde", "Day off aniversário"],
    modality: "Híbrido",
  },
  {
    id: 4,
    title: "Agile Master",
    description: "Especialista em metodologias ágeis como Scrum e Kanban.",
    location: "Florianópolis",
    type: "PJ",
    company: "Samba Tech",
    salaryRange: "Salário Negociável",
    requirements: ["SCRUM", "Agile", "Kanban"],
    benefits: ["Plano de saúde", "Plano odontológico", "Horário flexível"],
    modality: "Remoto",
  },
];

const JobCard: React.FC<{ job: Job }> = ({ job }) => (
  <div className="flex flex-col md:flex-row items-start p-6 shadow-md bg-white rounded-lg mb-4 w-full">
    <div className="flex-grow">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
        <p className="text-sm text-gray-500">
          {job.company} • {job.location}
        </p>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-500">
          {job.type} • {job.modality} • {job.salaryRange}
        </p>
      </div>

      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700">Benefícios:</p>
        <p className="text-sm text-gray-500">
          {job.benefits.join(' | ')}
        </p>
      </div>
    </div>

    
    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 md:ml-4">
      <div className="flex flex-wrap gap-2">
        {job.requirements.map((req, index) => (
          <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
            {req}
          </span>
        ))}
      </div>

      <Button className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded">
        Ver Vaga
      </Button>
    </div>
  </div>
);

const JobList: React.FC = () => (
  <div className="p-4 max-w-4xl mx-auto">
    <h1 className="text-2xl font-bold mb-6 text-gray-900">Vagas Disponíveis</h1>
    <div className="flex flex-col gap-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  </div>
);

export default JobList;


