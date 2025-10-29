"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, AlertCircle } from "lucide-react";

interface GenerateCVDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (options: { cvName: string; includePhoto: boolean }) => void;
  loading: boolean;
}

export default function GenerateCVDialog({
  open,
  onOpenChange,
  onGenerate,
  loading,
}: GenerateCVDialogProps) {
  const [cvName, setCvName] = useState("");
  const [includePhoto, setIncludePhoto] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvName.trim()) return;
    onGenerate({ cvName: cvName.trim(), includePhoto });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generar CV
          </DialogTitle>
          <DialogDescription>
            Configurá las opciones para tu CV optimizado
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cvName">
              Nombre del CV <span className="text-red-500">*</span>
            </Label>
            <Input
              id="cvName"
              placeholder="Ej: CV para Amazon - Senior Developer"
              value={cvName}
              onChange={(e) => setCvName(e.target.value)}
              disabled={loading}
              required
            />
            <p className="text-xs text-gray-500">
              Usá un nombre descriptivo para identificarlo fácilmente en tu
              lista
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="includePhoto"
                checked={includePhoto}
                onChange={(e) => setIncludePhoto(e.target.checked)}
                disabled={loading}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-[#5D3A9B] focus:ring-[#5D3A9B]"
              />
              <div className="flex-1">
                <Label
                  htmlFor="includePhoto"
                  className="font-normal cursor-pointer"
                >
                  Incluir foto de perfil
                </Label>
              </div>
            </div>
            {includePhoto && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">
                  <strong>Nota:</strong> Los sistemas ATS automáticos pueden
                  tener problemas con fotos. Recomendamos esta opción solo para
                  envíos directos a humanos o cuando sea explícitamente
                  requerido.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !cvName.trim()}
              className="bg-[#5D3A9B] hover:bg-[#5D3A9B]/90"
            >
              {loading ? "Generando..." : "Generar CV"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
