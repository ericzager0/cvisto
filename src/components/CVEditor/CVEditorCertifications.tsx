import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface CVEditorCertificationsProps {
  data: any[];
  onChange: (data: any[]) => void;
}

export default function CVEditorCertifications({ data, onChange }: CVEditorCertificationsProps) {
  const addCertification = () => {
    onChange([
      ...(data || []),
      {
        name: "",
        issuer: "",
        year: "",
        id_or_url: ""
      }
    ]);
  };

  const removeCertification = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateCertification = (index: number, field: string, value: string) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  return (
    <div className="space-y-4">
      {data?.map((cert: any, index: number) => (
        <div key={index} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Certificación {index + 1}</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeCertification(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label>Nombre de la Certificación *</Label>
              <Input
                value={cert.name || ""}
                onChange={(e) => updateCertification(index, "name", e.target.value)}
                placeholder="Ej: AWS Certified Developer"
              />
            </div>

            <div>
              <Label>Emisor *</Label>
              <Input
                value={cert.issuer || ""}
                onChange={(e) => updateCertification(index, "issuer", e.target.value)}
                placeholder="Ej: Amazon Web Services"
              />
            </div>

            <div>
              <Label>Año</Label>
              <Input
                value={cert.year || ""}
                onChange={(e) => updateCertification(index, "year", e.target.value)}
                placeholder="Ej: 2024"
              />
            </div>

            <div>
              <Label>ID o URL de Verificación</Label>
              <Input
                value={cert.id_or_url || ""}
                onChange={(e) => updateCertification(index, "id_or_url", e.target.value)}
                placeholder="Credential ID o URL"
              />
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addCertification} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Agregar Certificación
      </Button>
    </div>
  );
}
