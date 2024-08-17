import React from 'react';
import { Card } from '@/components/ui/card'; 
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
    title: "Estágio em Desenvolvimento",
    description: "Oportunidade de estágio em desenvolvimento web com foco em React.",
    location: "São Paulo, SP",
    type: "Estágio",
    company: "Tech Corp",
    salaryRange: "R$ 1.500 - R$ 2.000",
    requirements: ["Conhecimento em JavaScript", "Noções de React", "Cursando Ensino Superior"],
    benefits: ["Vale Transporte", "Bolsa Auxílio", "Oportunidade de Efetivação"],
    modality: "Presencial",
  },
  {
    id: 2,
    title: "Analista de Dados",
    description: "Buscamos um analista de dados para atuar em projetos estratégicos.",
    location: "Belo Horizonte, MG",
    type: "CLT",
    company: "Data Inc.",
    salaryRange: "R$ 4.000 - R$ 6.000",
    requirements: ["Experiência com Python e SQL", "Capacidade Analítica", "Conhecimento em Power BI"],
    benefits: ["Plano de Saúde", "Vale Refeição", "Bônus Anual"],
    modality: "Híbrido",
  },
  {
    id: 3,
    title: "Desenvolvedor Full Stack",
    description: "Vaga para desenvolvedor full stack com experiência em Node.js e React.",
    location: "Remoto",
    type: "Freelancer",
    company: "Dev Solutions",
    salaryRange: "R$ 7.000 - R$ 9.000",
    requirements: ["Experiência com Node.js e React", "Conhecimento em TypeScript", "Capacidade de Trabalhar em Equipe"],
    benefits: ["Horário Flexível", "Oportunidade de Crescimento", "Trabalho Remoto"],
    modality: "Home Office",
  },
];

const JobList: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Vagas Disponíveis</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className="p-4 shadow-lg bg-white rounded-lg">
            <div className="job-header mb-4">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-600">{job.company}</p>
            </div>
            <div className="job-details mb-4">
              <p className="text-sm"><strong>Local:</strong> {job.location}</p>
              <p className="text-sm"><strong>Tipo:</strong> {job.type}</p>
              <p className="text-sm"><strong>Faixa Salarial:</strong> {job.salaryRange}</p>
              <p className="text-sm"><strong>Modalidade:</strong> {job.modality}</p>
            </div>
            <div className="job-description mb-4">
              <p>{job.description}</p>
            </div>
            <div className="job-requirements mb-4">
              <h3 className="text-md font-semibold">Requisitos:</h3>
              <ul className="list-disc pl-5">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="text-sm">{requirement}</li>
                ))}
              </ul>
            </div>
            <div className="job-benefits mb-4">
              <h3 className="text-md font-semibold">Benefícios:</h3>
              <ul className="list-disc pl-5">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="text-sm">{benefit}</li>
                ))}
              </ul>
            </div>
            <Button className="w-full mt-2">Ver Detalhes</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JobList;
