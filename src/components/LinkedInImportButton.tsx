"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Sparkles } from "lucide-react";
import LinkedInImportWizard from "./LinkedInImportWizard";
import { useRouter } from "next/navigation";

interface LinkedInImportButtonProps {
  userId: string;
  hasContent: boolean;
}

export default function LinkedInImportButton({
  userId,
  hasContent,
}: LinkedInImportButtonProps) {
  const [wizardOpen, setWizardOpen] = useState(false);
  const router = useRouter();

  // Abrir automáticamente solo en la primera carga si no hay contenido
  useEffect(() => {
    // Verificar si ya se mostró el wizard en esta sesión
    const wizardShown = sessionStorage.getItem('linkedinWizardShown');
    
    if (!hasContent && !wizardShown) {
      // Pequeño delay para que la página cargue completamente
      setTimeout(() => {
        setWizardOpen(true);
        sessionStorage.setItem('linkedinWizardShown', 'true');
      }, 500);
    }
  }, [hasContent]);

  const handleComplete = () => {
    setWizardOpen(false);
    // Recargar la página para mostrar el perfil actualizado
    router.refresh();
  };

  return (
    <>
      <Button
        onClick={() => setWizardOpen(true)}
        variant="outline"
        className="text-[#5D3A9B] hover:text-white hover:bg-[#5D3A9B] border-[#5D3A9B]"
      >
        <Download className="mr-2 h-4 w-4" />
        Importar desde LinkedIn
      </Button>
      <LinkedInImportWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onComplete={handleComplete}
        userId={userId}
      />
    </>
  );
}
