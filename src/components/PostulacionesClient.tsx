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

  return (
    <Tabs defaultValue="search" className="w-full">
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
          <AddApplicationDialog userId={userId} onSuccess={handleRefreshSimple} />
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
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
