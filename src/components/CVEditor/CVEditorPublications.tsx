import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface CVEditorPublicationsProps {
  data: any[];
  onChange: (data: any[]) => void;
}

export default function CVEditorPublications({ data, onChange }: CVEditorPublicationsProps) {
  const addPublication = () => {
    onChange([
      ...(data || []),
      {
        title: "",
        venue: "",
        year: "",
        url: ""
      }
    ]);
  };

  const removePublication = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updatePublication = (index: number, field: string, value: string) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  return (
    <div className="space-y-4">
      {data?.map((pub: any, index: number) => (
        <div key={index} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Publicación {index + 1}</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removePublication(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label>Título *</Label>
              <Input
                value={pub.title || ""}
                onChange={(e) => updatePublication(index, "title", e.target.value)}
                placeholder="Título del artículo o paper"
              />
            </div>

            <div>
              <Label>Venue/Conferencia *</Label>
              <Input
                value={pub.venue || ""}
                onChange={(e) => updatePublication(index, "venue", e.target.value)}
                placeholder="Ej: IEEE Conference on AI"
              />
            </div>

            <div>
              <Label>Año</Label>
              <Input
                value={pub.year || ""}
                onChange={(e) => updatePublication(index, "year", e.target.value)}
                placeholder="Ej: 2024"
              />
            </div>

            <div>
              <Label>URL</Label>
              <Input
                value={pub.url || ""}
                onChange={(e) => updatePublication(index, "url", e.target.value)}
                placeholder="Link a la publicación"
              />
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addPublication} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Agregar Publicación
      </Button>
    </div>
  );
}
