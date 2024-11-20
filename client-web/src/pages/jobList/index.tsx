import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FaHeart, FaRegHeart, FaFilter, FaSearch } from "react-icons/fa";
import useAuthStore from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import { UserType } from "@/domain/user";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Job, JobFilters, JobPublication } from '@/domain/job'
import { jobTypeMapping, modalityMapping, fieldMaping, jobTypes, modalities, fields } from '@/utils/mappings';
import { favoriteJob, unfavoriteJob, getFavoriteJobs, getJobPublicationsStudent } from '@/services';
import JobDetailsModal from './jobDetailsModal';


const JobCard: React.FC<{ jobPublication: JobPublication }> = ({ jobPublication: { job, id: jobPublicationId } }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleFavorite = () => setIsFavorited(!isFavorited);

  const getTranslatedValue = (
    value: string,
    mapping: Record<string, string>
  ): string => {
    const translatedKey = Object.keys(mapping).find(
      (key) => mapping[key] === value
    );
    return translatedKey || value;
  };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  async function handleFavoriteClick() {
    if (jobPublicationId) {
      await favoriteJob(jobPublicationId)
    }
  }

  async function handleUnfavoriteClick() {

    if (jobPublicationId) {
      await unfavoriteJob(jobPublicationId)
    }
  }

  return (
    <div className="relative flex flex-col items-start md:p-2 shadow-md bg-white rounded-lg mb-4 w-full">
      <button
        className={`absolute top-2 right-2 ${isFavorited ? "text-red-500" : "text-gray-400"}`}
        onClick={toggleFavorite}
      >
        {isFavorited ? <FaHeart onClick={handleUnfavoriteClick} /> : <FaRegHeart onClick={handleFavoriteClick} />}
      </button>

      <div className="flex-grow mb-4 md:mb-0">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">
          {job.job_name}
        </h2>
        <p className="text-xs md:text-sm text-gray-700">{job.location}</p>
        <p className="text-xs md:text-sm text-gray-700">
          {getTranslatedValue(job.type, jobTypeMapping)} •{" "}
          {getTranslatedValue(job.mode, modalityMapping)} • R${" "}
          {job.salary.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <div className="flex">
          <p className="text-xs md:text-sm font-semibold text-gray-700 mr-1">
            Benefícios:
          </p>
          <p className="text-xs md:text-sm text-gray-500">{job.benefits}</p>
        </div>
        <div className="flex">
          <p className="text-xs md:text-sm font-semibold text-gray-700 mr-1">Área de atuação:</p>
          <p className="text-xs md:text-sm text-gray-500">{getTranslatedValue(job.field?.id.toString() || '', fieldMaping)}</p>
        </div>
        <div className="flex mb-3">
          <p className="text-xs md:text-sm font-semibold text-gray-700 mr-1">
            Requisitos:
          </p>
          <p className="text-xs md:text-sm text-gray-500">{job.requirements}</p>
        </div>
      </div>

      <Button
        className="bg-primary text-white hover:bg-primary text-xs md:text-sm rounded right-0"
        onClick={() => handleJobClick(job)}
      >
        Ver Vaga
      </Button>

      {isModalOpen && selectedJob && (
        <JobDetailsModal job={selectedJob} onClose={handleCloseModal} />
      )}
    </div>
  );
};

const JobList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<JobFilters>({
    type: 'todos',
    minSalary: '',
    maxSalary: '',
    requirements: '',
    mode: 'todos',
    weekly_hours: '',
    field_id: 'todos',
    location: '',
  });
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobPublications, setJobPublication] = useState<JobPublication[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)
  const [totalPages, setTotalPages] = useState<number>(1);
  const [paginatedJobsPublications, setPaginatedJobsPublications] = useState<JobPublication[]>([]);

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;


  const fetchJobs = useCallback(async () => {
    try {
      const jobData = await getJobPublicationsStudent();
      const totalItems = jobData.publications.length || 0;
      const pages = Math.ceil(totalItems / itemsPerPage);
      setTotalPages(pages || 1);
      setPaginatedJobsPublications(jobData.publications.slice(startIndex, startIndex + itemsPerPage));
      setJobPublication(jobData.publications);
    } catch (error) {
      console.error("Erro ao carregar as vagas:", error);
      setTotalPages(1);
    }
  }, [startIndex, itemsPerPage]);

  /*
  const fetchJobs = useCallback(async () => {
    try {
      const jobData = await getJobPublicationsStudent();
      setTotalPages(jobData.length / itemsPerPage);
      setPaginatedJobsPublications(jobData.slice(startIndex, startIndex + itemsPerPage));
      setJobPublication(jobData.publications);
    } catch (error) {
      console.error("Erro ao carregar as vagas:", error);
    }
  }, [getJobPublicationsStudent, setJobPublication]);*/


  useEffect(() => {
    fetchJobs();
  }, [fetchJobs, currentPage]);

  useEffect(() => {
    if (user && user.status !== "complete") {
      user.type === UserType.STUDENT && navigate("/perfil-estudante");
      user.type === UserType.COMPANY && navigate("/perfil-empresa");
    }
  }, [user, navigate]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleShowFavoritesToggle = async () => {
    try {
      if (showOnlyFavorites) {
        const jobData = await getJobPublicationsStudent();
        setTotalPages(jobData.publications.length / itemsPerPage);
        setPaginatedJobsPublications(jobData.publications.slice(startIndex, startIndex + itemsPerPage));
        setJobPublication(jobData.publications);
      } else {
        const favoriteData = await getFavoriteJobs();
        setTotalPages(favoriteData.length / itemsPerPage);
        setPaginatedJobsPublications(favoriteData.slice(startIndex, startIndex + itemsPerPage));
        setJobPublication(favoriteData.publications);
      }
      setShowOnlyFavorites(prev => !prev);
    } catch (error) {
      console.error("Erro ao alternar as vagas:", error);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      type: 'todos',
      minSalary: '',
      maxSalary: '',
      requirements: '',
      mode: 'todos',
      weekly_hours: '',
      field_id: 'todos',
      location: '',
    });
  };

  const handleApplyFiters = async () => {
    const jobData = await getJobPublicationsStudent(filters);
    setJobPublication(jobData.publications);
    setIsFilterOpen(false)
  }

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= (totalPages ? totalPages : 1)) setCurrentPage(page);
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
          <button className="bg-primary text-white p-2 rounded hover:bg-primary flex items-center justify-center"
            onClick={handleShowFavoritesToggle}>
            <FaHeart className={showOnlyFavorites ? 'text-red-500' : 'text-gray-400'} />
          </button>
          <button
            className="bg-primary text-white p-2 rounded hover:bg-primary flex items-center justify-center"
            onClick={() => setIsFilterOpen(true)}
          >
            <FaFilter className="fill-white" />
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
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                />
              </div>

              <Label className="text-primary">
                Tipo de vaga:
                <Select
                  value={filters.type}
                  onValueChange={(value) => handleFilterChange("type", value)}
                >
                  <SelectTrigger className="border p-2 w-full rounded">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="todos" value="todos">
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
                      label="Salário mínimo:"
                      name="minSalary"
                      value={filters.minSalary}
                      placeholder="ex: 1000"
                      onChange={(e) => handleFilterChange("minSalary", e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      label="Salário máximo:"
                      name="maxSalary"
                      value={filters.maxSalary}
                      placeholder="ex: 3000"
                      onChange={(e) => handleFilterChange("maxSalary", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Label className="text-primary">
                Modalidade:
                <Select
                  value={filters.mode}
                  onValueChange={(value) => handleFilterChange("mode", value)}
                >
                  <SelectTrigger className="border p-2 w-full rounded">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="todos" value="todos">
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
                  onChange={(e) =>
                    handleFilterChange("weekly_hours", e.target.value)
                  }
                />
              </div>

              <Label className="text-primary">
                Área de atuação:
                <Select
                  value={filters.field_id}
                  onValueChange={(value) =>
                    handleFilterChange("field_id", value)
                  }
                >
                  <SelectTrigger className="border p-2 w-full rounded">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="todos" value="todos">
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
                <Button
                  className="bg-red-500 text-white hover:bg-red-600 mr-2"
                  onClick={handleClearFilters}
                >
                  Limpar Filtros
                </Button>
                <Button className="bg-primary text-white hover:bg-primary ml-2" onClick={handleApplyFiters}>
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {paginatedJobsPublications.map(jobPublication => (
          <JobCard key={jobPublication.id} jobPublication={jobPublication} />
        ))}
      </div>

      <div className="flex justify-center mt-4 p-5 items-center ">
        <button
          className="bg-primary text-white px-4 py-2 rounded mx-2"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>{currentPage} de {totalPages || 1}</span>
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
