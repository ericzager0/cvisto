import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface CVEditorHeaderProps {
  data: any;
  onChange: (data: any) => void;
}

export default function CVEditorHeader({ data, onChange }: CVEditorHeaderProps) {
  const updateField = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const updateLink = (index: number, field: string, value: string) => {
    const newLinks = [...(data.links || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onChange({ ...data, links: newLinks });
  };

  const addLink = () => {
    onChange({
      ...data,
      links: [...(data.links || []), { label: "", url: "" }]
    });
  };

  const removeLink = (index: number) => {
    const newLinks = data.links.filter((_: any, i: number) => i !== index);
    onChange({ ...data, links: newLinks });
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="name">Nombre Completo *</Label>
          <Input
            id="name"
            value={data?.name || ""}
            onChange={(e) => updateField("name", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={data?.email || ""}
            onChange={(e) => updateField("email", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            value={data?.phone || ""}
            onChange={(e) => updateField("phone", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="address">Ubicación</Label>
          <Input
            id="address"
            value={data?.address || ""}
            onChange={(e) => updateField("address", e.target.value)}
            placeholder="Ciudad, País"
          />
        </div>
      </div>

      {/* Links */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Enlaces (LinkedIn, GitHub, Portfolio, etc.)</Label>
          <Button type="button" variant="outline" size="sm" onClick={addLink}>
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </div>
        <div className="space-y-2">
          {data?.links?.map((link: any, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Etiqueta (ej: LinkedIn)"
                value={link.label}
                onChange={(e) => updateLink(index, "label", e.target.value)}
                className="w-1/3"
              />
              <Input
                placeholder="URL completa"
                value={link.url}
                onChange={(e) => updateLink(index, "url", e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeLink(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
