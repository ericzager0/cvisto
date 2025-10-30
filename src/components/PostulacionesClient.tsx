"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobApplication } from "@/lib/queries";
import ApplicationsList from "./ApplicationsList";
import AddApplicationDialog from "./AddApplicationDialog";
import JobSearchClient from "./JobSearchClient";
import RecommendedPositions from "./RecommendedPositions";
import { Briefcase, Search } from "lucide-react";
import { updateRecommendedPositionsAction } from "@/app/actions";

interface PostulacionesClientProps {
  initialApplications: JobApplication[];
  userId: string;
  profile: any;
}

export default function PostulacionesClient({
  initialApplications,
  userId,
  profile,
}: PostulacionesClientProps) {
  const [applications, setApplications] = useState(initialApplications);
  const [searchQuery, setSearchQuery] = useState("");
  const [shouldSearch, setShouldSearch] = useState(false);
  const [activeTab, setActiveTab] = useState("search");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const handleRefreshSimple = () => {
    window.location.reload();
  };

  const handlePositionClick = (position: string) => {
    setSearchQuery(position);
    setShouldSearch(true);
  };

  const handleRegenerate = async (positions: string[]) => {
    try {
      await updateRecommendedPositionsAction(userId, positions);
    } catch (error) {
      console.error("Error saving positions:", error);
    }
  };

  const handleCopyToScanner = (jobText: string) => {
    // Cambiar a la pestaña de job-scanner y pasar el texto
    const encodedText = encodeURIComponent(jobText);
    window.open(`/job-scanner?jobText=${encodedText}`, '_blank');
  };

  const handleAddToApplications = async (job: any) => {
    // Cambiar a la pestaña de aplicaciones y abrir el diálogo con los datos
    setSelectedJob({
      position: job.title,
      company: job.company,
      location: job.location,
      url: job.url,
      description: job.description,
      salary: job.salary,
    });
    setActiveTab("applications");
    setAddDialogOpen(true);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2 bg-purple-100">
        <TabsTrigger 
          value="applications" 
          className="flex items-center gap-2 data-[state=active]:bg-[#5D3A9B] data-[state=active]:text-white"
        >
          <Briefcase className="h-4 w-4" />
          Mis Aplicaciones
        </TabsTrigger>
        <TabsTrigger 
          value="search" 
          className="flex items-center gap-2 data-[state=active]:bg-[#5D3A9B] data-[state=active]:text-white"
        >
          <Search className="h-4 w-4" />
          Buscar Ofertas
        </TabsTrigger>
      </TabsList>

      <TabsContent value="applications" className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Mis Aplicaciones</h2>
            <p className="text-muted-foreground">
              Seguimiento de tus postulaciones
            </p>
          </div>
          <AddApplicationDialog 
            userId={userId} 
            onSuccess={handleRefreshSimple}
            initialData={selectedJob}
            open={addDialogOpen}
            onOpenChange={(open) => {
              setAddDialogOpen(open);
              if (!open) setSelectedJob(null);
            }}
          />
        </div>

        <ApplicationsList
          applications={applications}
          userId={userId}
          onUpdate={handleRefreshSimple}
        />
      </TabsContent>

      <TabsContent value="search" className="mt-6">
        <div className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Buscar Ofertas</h2>
            <p className="text-muted-foreground">
              Encontrá nuevas oportunidades laborales en Argentina
            </p>
          </div>

          <RecommendedPositions
            initialPositions={profile.recommendedPositions}
            profile={profile}
            onPositionClick={handlePositionClick}
            onRegenerate={handleRegenerate}
          />

          <JobSearchClient 
            initialQuery={searchQuery}
            triggerSearch={shouldSearch}
            onSearchComplete={() => setShouldSearch(false)}
            onCopyToScanner={handleCopyToScanner}
            onAddToApplications={handleAddToApplications}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
