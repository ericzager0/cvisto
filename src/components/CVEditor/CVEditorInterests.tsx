import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface CVEditorInterestsProps {
  data: string[];
  onChange: (data: string[]) => void;
}

export default function CVEditorInterests({ data, onChange }: CVEditorInterestsProps) {
  const addInterest = () => {
    onChange([...(data || []), ""]);
  };

  const removeInterest = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateInterest = (index: number, value: string) => {
    const newData = [...data];
    newData[index] = value;
    onChange(newData);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-3">
        <Label className="text-base">Intereses Personales</Label>
        <Button type="button" variant="outline" size="sm" onClick={addInterest}>
          <Plus className="h-4 w-4 mr-1" />
          Agregar
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-2">
        {data?.map((interest: string, index: number) => (
          <div key={index} className="flex gap-2">
            <Input
              value={interest}
              onChange={(e) => updateInterest(index, e.target.value)}
              placeholder="Ej: Photography, Travel, Open Source"
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeInterest(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {(!data || data.length === 0) && (
        <p className="text-sm text-muted-foreground">
          No hay intereses agregados. Haz clic en &quot;Agregar&quot; para empezar.
        </p>
      )}
    </div>
  );
}
