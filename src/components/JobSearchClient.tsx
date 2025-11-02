"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  Building2,
  Calendar,
  ExternalLink,
  Briefcase,
  Clock,
  Plus,
  DollarSign,
  ScanSearch,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  postedDate: string;
  salary?: string;
  jobType?: string;
}

interface JobSearchResponse {
  jobs: Job[];
  total: number;
  sources?: {
    linkedin: number;
    bumeran: number;
    computrabajo: number;
  };
}

interface JobSearchClientProps {
  initialQuery?: string;
  triggerSearch?: boolean;
  onSearchComplete?: () => void;
  onCopyToScanner?: (jobText: string) => void;
  onAddToApplications?: (job: Job) => void;
}

export default function JobSearchClient({
  initialQuery = "",
  triggerSearch = false,
  onSearchComplete,
  onCopyToScanner,
  onAddToApplications,
}: JobSearchClientProps) {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState("Argentina");
  const [source, setSource] = useState("all");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [total, setTotal] = useState(0);

  // Efecto para cuando se clickea un puesto recomendado
  useEffect(() => {
    if (triggerSearch && initialQuery) {
      setQuery(initialQuery);
      searchJobs(initialQuery);
      if (onSearchComplete) {
        onSearchComplete();
      }
    }
  }, [triggerSearch, initialQuery]);

  const searchJobs = async (searchQuery?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery || query,
        location: location,
        source: source, // all, linkedin, bumeran, computrabajo
      });

      const response = await fetch(`/api/jobs/scrape?${params.toString()}`);
      const data: JobSearchResponse = await response.json();

      if (response.ok) {
        console.log("Jobs received:", data.jobs.length);
        console.log("Sample job data:", data.jobs[0]);
        setJobs(data.jobs);
        setTotal(data.total);
        setSearched(true);
      } else {
        console.error("Error fetching jobs:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchJobs();
  };

  const handleCopyToScanner = async (job: Job) => {
    try {
      // Intentar obtener el contenido completo de la página
      const response = await fetch(`/api/fetch-job-content?url=${encodeURIComponent(job.url)}`);
      let fullContent = '';
      
      if (response.ok) {
        const data = await response.json();
        fullContent = data.content || '';
      }
      
      // Si no se pudo obtener el contenido completo, usar la info que tenemos
      if (!fullContent) {
        fullContent = `${job.title}\n\nEmpresa: ${job.company}\nUbicación: ${job.location}\n${job.salary ? `Salario: ${job.salary}\n` : ''}${job.jobType ? `Tipo: ${job.jobType}\n` : ''}\n\n${stripHtml(job.description)}\n\nURL: ${job.url}`;
      }
      
      // Guardar en sessionStorage en lugar de URL para evitar error 431
      sessionStorage.setItem('jobScannerText', fullContent);
      window.open('/job-scanner', '_blank');
    } catch (error) {
      console.error('Error fetching job content:', error);
      // Fallback: usar la info básica que tenemos
      const jobText = `${job.title}\n\nEmpresa: ${job.company}\nUbicación: ${job.location}\n${job.salary ? `Salario: ${job.salary}\n` : ''}${job.jobType ? `Tipo: ${job.jobType}\n` : ''}\n\n${stripHtml(job.description)}\n\nURL: ${job.url}`;
      sessionStorage.setItem('jobScannerText', jobText);
      window.open('/job-scanner', '_blank');
    }
  };

  const handleAddToApplications = (job: Job) => {
    if (onAddToApplications) {
      onAddToApplications(job);
    }
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return date.toLocaleDateString("es-ES", { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    });
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Puesto, palabra clave o empresa..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              required
            />
          </div>
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buenos Aires, Argentina"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Source Selector */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Fuentes:</label>
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las fuentes</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="bumeran">Bumeran</SelectItem>
              <SelectItem value="computrabajo">Computrabajo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={loading} className="md:w-auto bg-[#5D3A9B] hover:bg-[#4A2D7C] text-white">
          {loading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Buscando...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </>
          )}
        </Button>
      </form>

      {/* Results Count */}
      {searched && !loading && (
        <div className="text-sm text-gray-600">
          {total > 0 ? (
            <>
              Se encontraron <span className="font-semibold">{total.toLocaleString()}</span> ofertas
              {query && ` para "${query}"`}
              {location && ` en ${location}`}
            </>
          ) : (
            <>No se encontraron ofertas con esos criterios</>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      )}

      {/* Job Results */}
      {!loading && jobs.length > 0 && (
        <div className="flex flex-col gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
            >
              {/* Header */}
              <div className="flex justify-between items-start gap-4 mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {job.company}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                  </div>
                </div>
                <div className="shrink-0 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyToScanner(job)}
                    title="Escanear oferta con IA"
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  >
                    <ScanSearch className="h-4 w-4 mr-2" />
                    Escanear aviso
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddToApplications(job)}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    title="Agregar a postulaciones"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar a postulaciones
                  </Button>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      Ver oferta
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 mb-3 text-sm">
                {job.salary && (
                  <div className="flex items-center gap-1 text-green-700 font-semibold">
                    <DollarSign className="h-4 w-4" />
                    {job.salary}
                  </div>
                )}
                {job.jobType && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <Briefcase className="h-4 w-4" />
                    {job.jobType}
                  </div>
                )}
                <div className="flex items-center gap-1 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {formatDate(job.postedDate)}
                </div>
              </div>

              {/* Description */}
              <div className="text-sm text-gray-700 line-clamp-3">
                {stripHtml(job.description)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
