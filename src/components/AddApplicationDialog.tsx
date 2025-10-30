"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { createJobApplicationAction } from "@/app/actions";

interface AddApplicationDialogProps {
  userId: string;
  onSuccess?: () => void;
  initialData?: {
    position?: string;
    company?: string;
    location?: string;
    url?: string;
    description?: string;
    salary?: string;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const statusOptions = [
  { value: "applied", label: "Aplicado" },
  { value: "phone_screen", label: "Entrevista telefónica" },
  { value: "interview", label: "Entrevista" },
  { value: "technical_test", label: "Prueba técnica" },
  { value: "offer", label: "Oferta recibida" },
  { value: "rejected", label: "Rechazado" },
  { value: "withdrawn", label: "Retirado" },
];

export default function AddApplicationDialog({ 
  userId, 
  onSuccess,
  initialData,
  open: controlledOpen,
  onOpenChange,
}: AddApplicationDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (onOpenChange || (() => {})) : setInternalOpen;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      userId,
      jobTitle: formData.get("jobTitle") as string,
      company: formData.get("company") as string,
      location: formData.get("location") as string,
      jobUrl: formData.get("jobUrl") as string,
      status: formData.get("status") as string,
      appliedDate: formData.get("appliedDate") as string,
      salary: formData.get("salary") as string,
      notes: formData.get("notes") as string,
      nextStep: formData.get("nextStep") as string,
      nextStepDate: formData.get("nextStepDate") as string,
    };

    try {
      await createJobApplicationAction(data);
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error creating application:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#5D3A9B] hover:bg-[#4A2D7C] text-white">
          <Plus className="mr-2 h-4 w-4" />
          Agregar Aplicación
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Aplicación</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Puesto *</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                placeholder="Ej: Desarrollador Full Stack"
                defaultValue={initialData?.position || ""}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Empresa *</Label>
              <Input
                id="company"
                name="company"
                placeholder="Ej: Tech Company SA"
                defaultValue={initialData?.company || ""}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                name="location"
                placeholder="Ej: Buenos Aires, Argentina"
                defaultValue={initialData?.location || ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salario</Label>
              <Input
                id="salary"
                name="salary"
                placeholder="Ej: $500,000 - $800,000"
                defaultValue={initialData?.salary || ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobUrl">Link de la oferta</Label>
            <Input
              id="jobUrl"
              name="jobUrl"
              defaultValue={initialData?.url || ""}
              type="url"
              placeholder="https://..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Estado *</Label>
              <Select name="status" defaultValue="applied" required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="appliedDate">Fecha de aplicación *</Label>
              <Input
                id="appliedDate"
                name="appliedDate"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Notas sobre la aplicación, contactos, etc."
              defaultValue={initialData?.description || ""}
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nextStep">Próximo paso</Label>
              <Input
                id="nextStep"
                name="nextStep"
                placeholder="Ej: Entrevista técnica"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextStepDate">Fecha del próximo paso</Label>
              <Input
                id="nextStepDate"
                name="nextStepDate"
                type="date"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[#5D3A9B] hover:bg-[#4A2D7C] text-white"
            >
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
