import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FaHeart, FaRegHeart, FaFilter, FaSearch } from "react-icons/fa";
import useAuthStore from "@/stores/authStore";
import { useNavigate } from 'react-router-dom';
import { UserType } from '@/domain/user';


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
  weekly_hour: string;
  field: string;
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
    weekly_hour: "20 horas",
    field: "TI",
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
    weekly_hour: "20 horas",
    field: "TI",
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
    weekly_hour: "20 horas",
    field: "TI",
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
    weekly_hour: "20 horas",
    field: "Ciências exatas",
  },
  {
    id: 5,
    title: "Estágio em FrontEnd",
    description: "Desenvolvedor FrontEnd",
    location: "São Paulo",
    type: "Estágio",
    company: "Dev Tech",
    salaryRange: "R$ 1.200,00 - R$ 2.000,00",
    requirements: ["HTML", "CSS", "JavaScript"],
    benefits: ["Vale alimentação", "Gympass", "Horário Flexível"],
    modality: "Presencial",
    weekly_hour: "20 horas",
    field: "TI",
  },
];

const JobCard: React.FC<{ job: Job }> = ({ job }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="relative flex flex-col md:flex-row items-start p-4 md:p-6 shadow-md bg-white rounded-lg mb-4 w-full">
      <div className="flex-grow mb-4 md:mb-0">
        <div className="mb-2">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">{job.title}</h2>
          <p className="text-xs md:text-sm text-gray-500">
            {job.company} • {job.location}
          </p>
        </div>
        <div className="mb-2">
          <p className="text-xs md:text-sm text-gray-500">
            {job.type} • {job.modality} • {job.salaryRange}
          </p>
        </div>
        <div className="mb-2">
          <p className="text-xs md:text-sm font-semibold text-gray-700">Benefícios:</p>
          <p className="text-xs md:text-sm text-gray-500">
            {job.benefits.join(' | ')}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap md:flex-row items-start md:items-start justify-between w-full md:w-auto">
        <div className="flex flex-wrap gap-2 mb-2 md:mb-0">
          {job.requirements.map((req, index) => (
            <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs md:text-sm">
              {req}
            </span>
          ))}
        </div>
        <Button className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-2 text-xs md:text-sm rounded absolute bottom-4 right-4">
          Ver Vaga
        </Button>
        <button
          className={`absolute top-2 right-2 focus:outline-none ${isFavorited ? 'text-red-500' : 'text-gray-400'}`}
          onClick={toggleFavorite}
        >
          {isFavorited ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>
    </div>
  );
};

const JobList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    salaryRange: '',
    requirements: [] as string[],
    modality: '',
    weekly_hour: '',
    field: '',
  });
  const {user} = useAuthStore()
  const navigate = useNavigate();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  
  if(user?.status != 'complete'){
    user?.type == UserType.STUDENT && navigate('perfil-estudante')
    user?.type == UserType.COMPANY && navigate('perfil-empresa')
    return;
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationTerm(e.target.value);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedSkills(selectedOptions);
    setFilters(prev => ({ ...prev, requirements: selectedOptions }));
  };

  const handleClearFilters = () => {
    setFilters({
      type: '',
      salaryRange: '',
      requirements: [],
      modality: '',
      weekly_hour: '',
      field: '',
    });
    setLocationTerm('');
    setSelectedSkills([]);
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    job.location.toLowerCase().includes(locationTerm.toLowerCase()) &&
    (filters.type === '' || job.type === filters.type) &&
    (filters.salaryRange === '' || job.salaryRange === filters.salaryRange) &&
    (filters.requirements.length === 0 || filters.requirements.every(req => job.requirements.includes(req))) &&
    (filters.modality === '' || job.modality === filters.modality) &&
    (filters.weekly_hour === '' || job.weekly_hour === filters.weekly_hour) &&
    (filters.field === '' || job.field === filters.field)
  );

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  return (
    <div className="p-4 max-w-2xl md:max-w-4xl mx-auto">
      <div className="mb-4">
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <input
            type="text"
            placeholder="Buscar vagas..."
            className="border p-2 w-full rounded"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center">
            <FaSearch />
          </button>
          <button
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center justify-center"
            onClick={() => setIsFilterOpen(true)}
          >
            <FaFilter />
          </button>
        </div>

        {isFilterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4">Filtros</h2>

              <div className="mb-4">
                <label className="block mb-2">Localização</label>
                <input
                  type="text"
                  placeholder="Localização..."
                  className="border p-2 w-full rounded"
                  value={locationTerm}
                  onChange={handleLocationChange}
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Tipo</label>
                <select
                  name="type"
                  className="border p-2 w-full rounded"
                  value={filters.type}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos</option>
                  <option value="Estágio">Estágio</option>
                  <option value="Trainee">Trainee</option>
                  <option value="Júnior">Júnior</option>
                  <option value="Pleno">Pleno</option>
                  <option value="Sênior">Sênior</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Habilidades</label>
                <select
                  multiple
                  className="border p-2 w-full h-32 rounded"  // Ajuste a altura para permitir rolagem
                  value={selectedSkills}
                  onChange={handleSelectChange}
                >
                  <option value="JavaScript">JavaScript</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="React">React</option>
                  <option value="Node.js">Node.js</option>
                  <option value="Python">Python</option>
                  {/* Adicione outras opções conforme necessário */}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Faixa Salarial</label>
                <select
                  name="salaryRange"
                  className="border p-2 w-full rounded"
                  value={filters.salaryRange}
                  onChange={handleFilterChange}
                >
                  <option value="">Todas</option>
                  <option value="0-2000">Até R$2000</option>
                  <option value="2000-5000">R$2000 - R$5000</option>
                  <option value="5000-10000">R$5000 - R$10000</option>
                  <option value="10000+">Acima de R$10000</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Modalidade</label>
                <select
                  name="modality"
                  className="border p-2 w-full rounded"
                  value={filters.modality}
                  onChange={handleFilterChange}
                >
                  <option value="">Todas</option>
                  <option value="Presencial">Presencial</option>
                  <option value="Remoto">Remoto</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Horas Semanais</label>
                <select
                  name="weekly_hour"
                  className="border p-2 w-full rounded"
                  value={filters.weekly_hour}
                  onChange={handleFilterChange}
                >
                  <option value="">Todas</option>
                  <option value="20h">20h</option>
                  <option value="30h">30h</option>
                  <option value="40h">40h</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Área</label>
                <select
                  name="field"
                  className="border p-2 w-full rounded"
                  value={filters.field}
                  onChange={handleFilterChange}
                >
                  <option value="">Todas</option>
                  <option value="IT">TI</option>
                  <option value="Engineering">Engenharia</option>
                  <option value="Exact Sciences">Ciências Exatas</option>
                  <option value="Humanities">Humanidades</option>
                  <option value="Business">Negócios</option>
                  <option value="Health">Saúde</option>
                  <option value="Arts">Artes</option>
                  <option value="Agriculture">Agricultura</option>
                  <option value="Law">Lei</option>
                  <option value="Education">Educação</option>
                </select>
              </div>

              <div className="flex justify-between">
                <Button className="bg-red-500 text-white hover:bg-red-600" onClick={handleClearFilters}>
                  Limpar Filtros
                </Button>
                <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={() => setIsFilterOpen(false)}>
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {paginatedJobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mx-2"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>{currentPage} de {totalPages}</span>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mx-2"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

export default JobList;