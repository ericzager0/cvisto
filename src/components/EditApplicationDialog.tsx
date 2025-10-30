"use client";

import { useState } from "react";
import { JobApplication } from "@/lib/queries";
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
import { Edit } from "lucide-react";
import { updateJobApplicationAction } from "@/app/actions";

interface EditApplicationDialogProps {
  application: JobApplication;
  onSuccess?: () => void;
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

export default function EditApplicationDialog({
  application,
  onSuccess,
}: EditApplicationDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      status: formData.get("status") as string,
      salary: formData.get("salary") as string,
      notes: formData.get("notes") as string,
      nextStep: formData.get("nextStep") as string,
      nextStepDate: formData.get("nextStepDate") as string,
    };

    try {
      await updateJobApplicationAction(application.id, data);
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error updating application:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Aplicación</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Read-only info */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="font-semibold text-lg">{application.jobTitle}</div>
            <div className="text-sm text-gray-600">{application.company}</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado *</Label>
            <Select name="status" defaultValue={application.status} required>
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
            <Label htmlFor="salary">Salario</Label>
            <Input
              id="salary"
              name="salary"
              placeholder="Ej: $500,000 - $800,000"
              defaultValue={application.salary || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Notas sobre la aplicación, contactos, etc."
              rows={4}
              defaultValue={application.notes || ""}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nextStep">Próximo paso</Label>
              <Input
                id="nextStep"
                name="nextStep"
                placeholder="Ej: Entrevista técnica"
                defaultValue={application.nextStep || ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextStepDate">Fecha del próximo paso</Label>
              <Input
                id="nextStepDate"
                name="nextStepDate"
                type="date"
                defaultValue={application.nextStepDate || ""}
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
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
