import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FaHeart, FaRegHeart, FaFilter, FaSearch } from "react-icons/fa";
import useAuthStore from "@/stores/authStore";
import { useNavigate } from 'react-router-dom';
import { UserType } from '@/domain/user';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Job } from '@/domain/job'
import { jobTypeMapping, modalityMapping, fieldMaping, jobTypes, modalities, fields } from '@/utils/mappings';


const jobs: Job[] = [
  {
    id: 1,
    job_name: "Fullstack Developer",
    description: "Desenvolvedor fullstack com experiência em Node.js e PHP.",
    location: "São Paulo",
    type: "internship",
    salary: 2000,
    requirements: "MySQL, PHP, Git, Node.js",
    benefits: "Vale alimentação, Gympass, Horário Flexível",
    mode: "remote",
    weekly_hours: 20,
    field_id: 1,
  },
  {
    id: 2,
    job_name: "Backend C# .Net Developer (Sênior)",
    description: "Desenvolvedor backend experiente em C# e .NET Core.",
    location: "Curitiba",
    type: "freelance",
    salary: 15000,
    requirements: "API, C#, .NET Core, Microsoft SQL Server",
    benefits: "Vale Transporte, Plano de saúde, Gympass",
    mode: "on_site",
    weekly_hours: 20,
    field_id: 1,
  },
  {
    id: 3,
    job_name: "Tech Lead (Python)",
    description: "Líder técnico com forte conhecimento em Python.",
    location: "Campinas",
    type: "clt",
    salary: 5000,
    requirements: "JavaScript, Linux, Python",
    benefits: "Vale alimentação, Plano de saúde, Day off aniversário",
    mode: "hybrid",
    weekly_hours: 20,
    field_id: 1,
  },
  {
    id: 4,
    job_name: "Agile Master",
    description: "Especialista em metodologias ágeis como Scrum e Kanban.",
    location: "Florianópolis",
    type: "pj",
    salary: 20000,
    requirements: "SCRUM, Agile, Kanban",
    benefits: "Plano de saúde, Plano odontológico, Horário flexível",
    mode: "remote",
    weekly_hours: 20,
    field_id: 3,
  },
  {
    id: 5,
    job_name: "Estágio em FrontEnd",
    description: "Desenvolvedor FrontEnd",
    location: "São Paulo",
    type: "internship",
    salary: 2000,
    requirements: "HTML, CSS, JavaScript",
    benefits: "Vale alimentação, Gympass, Horário Flexível",
    mode: "on_site",
    weekly_hours: 20,
    field_id: 1,
  },
];

const JobCard: React.FC<{ job: Job }> = ({ job }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = () => setIsFavorited(!isFavorited);

  const getTranslatedValue = (value: string, mapping: Record<string, string>): string => {
    const translatedKey = Object.keys(mapping).find(key => mapping[key] === value);
    return translatedKey || value;
  };

  return (
    <div className="relative flex flex-col items-start md:p-2 shadow-md bg-white rounded-lg mb-4 w-full">
      <button
        className={`absolute top-2 right-2 ${isFavorited ? 'text-red-500' : 'text-gray-400'}`}
        onClick={toggleFavorite}
      >
        {isFavorited ? <FaHeart /> : <FaRegHeart />}
      </button>

      <div className="flex-grow mb-4 md:mb-0">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">{job.job_name}</h2>
        <p className="text-xs md:text-sm text-gray-700">{job.location}</p>
        <p className="text-xs md:text-sm text-gray-700">{getTranslatedValue(job.type, jobTypeMapping)} • {getTranslatedValue(job.mode, modalityMapping)} • R$ {job.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <div className="flex">
          <p className="text-xs md:text-sm font-semibold text-gray-700 mr-1">Benefícios:</p>
          <p className="text-xs md:text-sm text-gray-500">{job.benefits}</p>
        </div>
        <div className="flex">
          <p className="text-xs md:text-sm font-semibold text-gray-700 mr-1">Área de atuação:</p>
          <p className="text-xs md:text-sm text-gray-500">{getTranslatedValue(job.field_id?.toString() || '', fieldMaping)}</p>
        </div>
        <div className="flex mb-3">
          <p className="text-xs md:text-sm font-semibold text-gray-700 mr-1">Requisitos:</p>
          <p className="text-xs md:text-sm text-gray-500">{job.requirements}</p>
        </div>
      </div>

      <Button className="bg-primary text-white hover:bg-primary text-xs md:text-sm rounded right-0">
        Ver Vaga
      </Button>
    </div>

  );
};

const JobList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'todos',
    salary: '',
    requirements: '',
    mode: 'todos',
    weekly_hours: '',
    field_id: 'todos',
  });
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user && user.status !== 'complete') {
      user.type === UserType.STUDENT && navigate('/perfil-estudante');
      user.type === UserType.COMPANY && navigate('/perfil-empresa');
    }
  }, [user, navigate]);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationTerm(e.target.value);
  };

  const handleClearFilters = () => {
    setFilters({
      type: 'todos',
      salary: '',
      requirements: '',
      mode: 'todos',
      weekly_hours: '',
      field_id: 'todos',
    });
    setLocationTerm('');
  };

  const filteredJobs = jobs.filter(job =>
    job.job_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    job.location.toLowerCase().includes(locationTerm.toLowerCase()) &&
    (filters.type === 'todos' || job.type === filters.type) &&
    (filters.salary === '' || job.salary?.toString() === filters.salary) &&
    (filters.requirements === '' || filters.requirements === job.requirements) &&
    (filters.mode === 'todos' || job.mode === filters.mode) &&
    (filters.weekly_hours === '' || job.weekly_hours?.toString() === filters.weekly_hours) &&
    (filters.field_id === 'todos' || job.field_id?.toString() === filters.field_id)
  );

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="p-4 max-w-2xl md:max-w-4xl mx-auto">
      <div className="mb-4">
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <Input
            type="text"
            placeholder="Buscar vagas..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border p-2 w-full rounded"
          />
          <button className="bg-primary text-white p-2 rounded hover:bg-primary flex items-center justify-center">
            <FaSearch />
          </button>
          <button
            className="bg-primary text-white p-2 rounded hover:bg-primary flex items-center justify-center"
            onClick={() => setIsFilterOpen(true)}
          >
            <FaFilter />
          </button>
        </div>

        {isFilterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
              <button
                className="absolute top-2 right-2 text-gray-500"
                onClick={() => setIsFilterOpen(false)}
              >
                X
              </button>

              <h2 className="text-lg font-semibold mb-4">Filtros</h2>

              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Localização..."
                  className="border p-2 w-full rounded"
                  label='Localização:'
                  value={locationTerm}
                  onChange={handleLocationChange}
                />
              </div>

              <Label className="text-primary">Tipo de vaga:
                <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
                  <SelectTrigger className="border p-2 w-full rounded">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem key="todos" value='todos'>
                      Todos
                    </SelectItem>
                    {jobTypes.map((option) => (
                      <SelectItem key={option} value={jobTypeMapping[option]}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Label>

              <div>
                <div className="mb-4">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      label="Salário:"
                      name="salary"
                      value={filters.salary}
                      placeholder="ex: 2000"
                      onChange={(e) => handleFilterChange("salary", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Label className="text-primary">Modalidade:
                <Select value={filters.mode} onValueChange={(value) => handleFilterChange("mode", value)}>
                  <SelectTrigger className="border p-2 w-full rounded">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem key="todos" value='todos'>
                      Todos
                    </SelectItem>
                    {modalities.map((option) => (
                      <SelectItem key={option} value={modalityMapping[option]}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Label>

              <div className="mb-4">
                <Input
                  type="number"
                  name="weekly_hours"
                  label="Horas Semanais:"
                  value={filters.weekly_hours}
                  placeholder="Ex: 40"
                  onChange={(e) => handleFilterChange("weekly_hours", e.target.value)}
                />
              </div>

              <Label className="text-primary">Área de atuação:
                <Select value={filters.field_id} onValueChange={(value) => handleFilterChange("field_id", value)}>
                  <SelectTrigger className="border p-2 w-full rounded">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem key="todos" value='todos'>
                      Todos
                    </SelectItem>
                    {fields.map((option) => (
                      <SelectItem key={option} value={fieldMaping[option]}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Label>

              <div className="flex justify-between mt-3">
                <Button className="bg-red-500 text-white hover:bg-red-600 mr-2" onClick={handleClearFilters}>
                  Limpar Filtros
                </Button>
                <Button className="bg-primary text-white hover:bg-primary ml-2" onClick={() => {
                  setIsFilterOpen(false)
                }}>
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

      <div className="flex justify-center mt-4 p-5">
        <button
          className="bg-primary text-white px-4 py-2 rounded mx-2"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>{currentPage} de {totalPages}</span>
        <button
          className="bg-primary text-white px-4 py-2 rounded mx-2"
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