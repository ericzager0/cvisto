import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface CVEditorVolunteeringProps {
  data: any[];
  onChange: (data: any[]) => void;
}

export default function CVEditorVolunteering({ data, onChange }: CVEditorVolunteeringProps) {
  const addVolunteering = () => {
    onChange([
      ...(data || []),
      {
        organization: "",
        role: "",
        start_date: "",
        end_date: "",
        bullets: [""]
      }
    ]);
  };

  const removeVolunteering = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateVolunteering = (index: number, field: string, value: any) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  const addBullet = (volIndex: number) => {
    const newData = [...data];
    newData[volIndex].bullets = [...(newData[volIndex].bullets || []), ""];
    onChange(newData);
  };

  const removeBullet = (volIndex: number, bulletIndex: number) => {
    const newData = [...data];
    newData[volIndex].bullets = newData[volIndex].bullets.filter(
      (_: any, i: number) => i !== bulletIndex
    );
    onChange(newData);
  };

  const updateBullet = (volIndex: number, bulletIndex: number, value: string) => {
    const newData = [...data];
    newData[volIndex].bullets[bulletIndex] = value;
    onChange(newData);
  };

  return (
    <div className="space-y-4">
      {data?.map((vol: any, volIndex: number) => (
        <div key={volIndex} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Voluntariado {volIndex + 1}</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeVolunteering(volIndex)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label>Organización *</Label>
              <Input
                value={vol.organization || ""}
                onChange={(e) => updateVolunteering(volIndex, "organization", e.target.value)}
                placeholder="Nombre de la organización"
              />
            </div>

            <div>
              <Label>Rol *</Label>
              <Input
                value={vol.role || ""}
                onChange={(e) => updateVolunteering(volIndex, "role", e.target.value)}
                placeholder="Tu posición"
              />
            </div>

            <div>
              <Label>Fecha de Inicio</Label>
              <Input
                value={vol.start_date || ""}
                onChange={(e) => updateVolunteering(volIndex, "start_date", e.target.value)}
                placeholder="Ej: Jan 2023"
              />
            </div>

            <div>
              <Label>Fecha de Fin</Label>
              <Input
                value={vol.end_date || ""}
                onChange={(e) => updateVolunteering(volIndex, "end_date", e.target.value)}
                placeholder="Ej: Present o Dec 2024"
              />
            </div>
          </div>

          {/* Bullets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm">Actividades y Logros</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addBullet(volIndex)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Punto
              </Button>
            </div>
            <div className="space-y-2">
              {vol.bullets?.map((bullet: string, bulletIndex: number) => (
                <div key={bulletIndex} className="flex gap-2">
                  <Textarea
                    value={bullet}
                    onChange={(e) => updateBullet(volIndex, bulletIndex, e.target.value)}
                    placeholder="Describe tu contribución o actividad..."
                    rows={2}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBullet(volIndex, bulletIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addVolunteering} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Agregar Voluntariado
      </Button>
    </div>
  );
}
