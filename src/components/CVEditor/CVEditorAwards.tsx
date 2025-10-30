import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface CVEditorAwardsProps {
  data: any[];
  onChange: (data: any[]) => void;
}

export default function CVEditorAwards({ data, onChange }: CVEditorAwardsProps) {
  const addAward = () => {
    onChange([
      ...(data || []),
      {
        title: "",
        issuer: "",
        year: "",
        description: ""
      }
    ]);
  };

  const removeAward = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateAward = (index: number, field: string, value: string) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  return (
    <div className="space-y-4">
      {data?.map((award: any, index: number) => (
        <div key={index} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Premio {index + 1}</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeAward(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label>Título del Premio *</Label>
              <Input
                value={award.title || ""}
                onChange={(e) => updateAward(index, "title", e.target.value)}
                placeholder="Ej: Best Innovation Award"
              />
            </div>

            <div>
              <Label>Otorgado Por *</Label>
              <Input
                value={award.issuer || ""}
                onChange={(e) => updateAward(index, "issuer", e.target.value)}
                placeholder="Ej: Tech Conference 2024"
              />
            </div>

            <div>
              <Label>Año</Label>
              <Input
                value={award.year || ""}
                onChange={(e) => updateAward(index, "year", e.target.value)}
                placeholder="Ej: 2024"
              />
            </div>
          </div>

          <div>
            <Label>Descripción</Label>
            <Textarea
              value={award.description || ""}
              onChange={(e) => updateAward(index, "description", e.target.value)}
              placeholder="Breve descripción del premio y el logro..."
              rows={2}
            />
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addAward} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Agregar Premio
      </Button>
    </div>
  );
}
