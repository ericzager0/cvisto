import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CVEditorSkillsProps {
  data: any;
  onChange: (data: any) => void;
}

const PROFICIENCY_LEVELS = ["Native", "Fluent", "Advanced", "Intermediate", "Basic"];

export default function CVEditorSkills({ data, onChange }: CVEditorSkillsProps) {
  const updateArrayItem = (category: string, index: number, value: any) => {
    const newData = { ...data };
    newData[category][index] = value;
    onChange(newData);
  };

  const addArrayItem = (category: string, defaultValue: any = "") => {
    const newData = { ...data };
    newData[category] = [...(newData[category] || []), defaultValue];
    onChange(newData);
  };

  const removeArrayItem = (category: string, index: number) => {
    const newData = { ...data };
    newData[category] = newData[category].filter((_: any, i: number) => i !== index);
    onChange(newData);
  };

  return (
    <div className="space-y-6">
      {/* Languages Spoken */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-base font-medium">Idiomas</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addArrayItem("languages_spoken", { name: "", level: "Intermediate" })}
          >
            <Plus className="h-4 w-4 mr-1" />
            Idioma
          </Button>
        </div>
        <div className="space-y-2">
          {data?.languages_spoken?.map((lang: any, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                value={lang.name || ""}
                onChange={(e) =>
                  updateArrayItem("languages_spoken", index, { ...lang, name: e.target.value })
                }
                placeholder="Ej: English"
                className="flex-1"
              />
              <Select
                value={lang.level || "Intermediate"}
                onValueChange={(value) =>
                  updateArrayItem("languages_spoken", index, { ...lang, level: value })
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROFICIENCY_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem("languages_spoken", index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Programming Languages */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-base font-medium">Lenguajes de Programación</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addArrayItem("programming_languages")}
          >
            <Plus className="h-4 w-4 mr-1" />
            Lenguaje
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {data?.programming_languages?.map((lang: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                value={lang}
                onChange={(e) => updateArrayItem("programming_languages", index, e.target.value)}
                placeholder="Ej: JavaScript"
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem("programming_languages", index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Frameworks & Tools */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-base font-medium">Frameworks & Herramientas</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addArrayItem("frameworks_tools")}
          >
            <Plus className="h-4 w-4 mr-1" />
            Framework/Herramienta
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {data?.frameworks_tools?.map((tool: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                value={tool}
                onChange={(e) => updateArrayItem("frameworks_tools", index, e.target.value)}
                placeholder="Ej: React"
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem("frameworks_tools", index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Databases */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-base font-medium">Bases de Datos</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addArrayItem("databases")}
          >
            <Plus className="h-4 w-4 mr-1" />
            Base de Datos
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {data?.databases?.map((db: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                value={db}
                onChange={(e) => updateArrayItem("databases", index, e.target.value)}
                placeholder="Ej: PostgreSQL"
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem("databases", index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* DevOps & Cloud */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-base font-medium">DevOps & Cloud</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addArrayItem("devops_cloud")}
          >
            <Plus className="h-4 w-4 mr-1" />
            Herramienta
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {data?.devops_cloud?.map((tool: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                value={tool}
                onChange={(e) => updateArrayItem("devops_cloud", index, e.target.value)}
                placeholder="Ej: Docker"
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem("devops_cloud", index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Methodologies */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-base font-medium">Metodologías</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addArrayItem("methodologies")}
          >
            <Plus className="h-4 w-4 mr-1" />
            Metodología
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {data?.methodologies?.map((method: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                value={method}
                onChange={(e) => updateArrayItem("methodologies", index, e.target.value)}
                placeholder="Ej: Agile/Scrum"
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem("methodologies", index)}
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
