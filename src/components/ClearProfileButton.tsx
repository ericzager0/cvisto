"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ClearProfileButtonProps {
  userId: string;
}

export default function ClearProfileButton({ userId }: ClearProfileButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const router = useRouter();

  const handleClearProfile = async () => {
    setClearing(true);
    try {
      const response = await fetch("/api/clear-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Error response:", result);
        throw new Error(result.details || result.error || "Error al limpiar el perfil");
      }

      setDialogOpen(false);
      // Marcar que el wizard ya fue mostrado para que no se abra automáticamente
      sessionStorage.setItem('linkedinWizardShown', 'true');
      router.refresh();
    } catch (error) {
      console.error("Error completo:", error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      alert(`Error al limpiar el perfil:\n\n${errorMessage}`);
    } finally {
      setClearing(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setDialogOpen(true)}
        variant="outline"
        className="text-red-600 hover:text-white hover:bg-red-600 border-red-600"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Limpiar perfil
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              ¿Limpiar perfil?
            </DialogTitle>
            <DialogDescription className="space-y-3 pt-2">
              <p>Esta acción eliminará permanentemente:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Biografía, teléfono y ubicación</li>
                <li>Todas tus experiencias laborales</li>
                <li>Toda tu educación</li>
                <li>Todas tus habilidades</li>
                <li>Todos tus proyectos</li>
                <li>Todos tus idiomas</li>
                <li>Todos tus links</li>
              </ul>
              <p className="font-semibold text-gray-900 mt-3">
                Se mantendrán: Nombre, email y foto de perfil
              </p>
              <p className="text-red-600 font-semibold">
                ⚠️ Esta acción no se puede deshacer
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={clearing}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleClearProfile}
              disabled={clearing}
              className="bg-red-600 hover:bg-red-700"
            >
              {clearing ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Limpiando...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Sí, limpiar perfil
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
