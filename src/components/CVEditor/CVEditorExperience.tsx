import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface CVEditorExperienceProps {
  data: any[];
  onChange: (data: any[]) => void;
}

export default function CVEditorExperience({ data, onChange }: CVEditorExperienceProps) {
  const addExperience = () => {
    onChange([
      ...(data || []),
      {
        company_name: "",
        city_state_country: "",
        position_title: "",
        group_name: "",
        start_date: "",
        end_date: "",
        summary_sentence: "",
        selected_experiences: []
      }
    ]);
  };

  const removeExperience = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  const addProject = (expIndex: number) => {
    const newData = [...data];
    newData[expIndex].selected_experiences = [
      ...(newData[expIndex].selected_experiences || []),
      { project_name: "", bullets: [""] }
    ];
    onChange(newData);
  };

  const removeProject = (expIndex: number, projIndex: number) => {
    const newData = [...data];
    newData[expIndex].selected_experiences = newData[expIndex].selected_experiences.filter(
      (_: any, i: number) => i !== projIndex
    );
    onChange(newData);
  };

  const updateProject = (expIndex: number, projIndex: number, field: string, value: any) => {
    const newData = [...data];
    newData[expIndex].selected_experiences[projIndex] = {
      ...newData[expIndex].selected_experiences[projIndex],
      [field]: value
    };
    onChange(newData);
  };

  const addBullet = (expIndex: number, projIndex: number) => {
    const newData = [...data];
    newData[expIndex].selected_experiences[projIndex].bullets.push("");
    onChange(newData);
  };

  const removeBullet = (expIndex: number, projIndex: number, bulletIndex: number) => {
    const newData = [...data];
    newData[expIndex].selected_experiences[projIndex].bullets = newData[expIndex].selected_experiences[
      projIndex
    ].bullets.filter((_: any, i: number) => i !== bulletIndex);
    onChange(newData);
  };

  const updateBullet = (expIndex: number, projIndex: number, bulletIndex: number, value: string) => {
    const newData = [...data];
    newData[expIndex].selected_experiences[projIndex].bullets[bulletIndex] = value;
    onChange(newData);
  };

  return (
    <div className="space-y-6">
      {data?.map((exp: any, expIndex: number) => (
        <div key={expIndex} className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Experiencia {expIndex + 1}</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeExperience(expIndex)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <Label>Empresa *</Label>
              <Input
                value={exp.company_name || ""}
                onChange={(e) => updateExperience(expIndex, "company_name", e.target.value)}
              />
            </div>

            <div>
              <Label>Ubicación (Ciudad, Estado, País)</Label>
              <Input
                value={exp.city_state_country || ""}
                onChange={(e) => updateExperience(expIndex, "city_state_country", e.target.value)}
                placeholder="Ej: San Francisco, CA, USA"
              />
            </div>

            <div>
              <Label>Posición *</Label>
              <Input
                value={exp.position_title || ""}
                onChange={(e) => updateExperience(expIndex, "position_title", e.target.value)}
              />
            </div>

            <div>
              <Label>Grupo/Departamento (Opcional)</Label>
              <Input
                value={exp.group_name || ""}
                onChange={(e) => updateExperience(expIndex, "group_name", e.target.value)}
              />
            </div>

            <div>
              <Label>Fecha de Inicio *</Label>
              <Input
                value={exp.start_date || ""}
                onChange={(e) => updateExperience(expIndex, "start_date", e.target.value)}
                placeholder="Ej: Jun 2023"
              />
            </div>

            <div>
              <Label>Fecha de Fin *</Label>
              <Input
                value={exp.end_date || ""}
                onChange={(e) => updateExperience(expIndex, "end_date", e.target.value)}
                placeholder="Ej: Present o Dec 2024"
              />
            </div>
          </div>

          <div>
            <Label>Resumen (Una frase)</Label>
            <Textarea
              value={exp.summary_sentence || ""}
              onChange={(e) => updateExperience(expIndex, "summary_sentence", e.target.value)}
              placeholder="Descripción breve del rol y responsabilidades principales"
              rows={2}
            />
          </div>

          {/* Projects within Experience */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Proyectos y Logros</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addProject(expIndex)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Proyecto
              </Button>
            </div>

            {exp.selected_experiences?.map((project: any, projIndex: number) => (
              <div key={projIndex} className="ml-4 border-l-2 border-gray-200 pl-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    value={project.project_name || ""}
                    onChange={(e) =>
                      updateProject(expIndex, projIndex, "project_name", e.target.value)
                    }
                    placeholder="Nombre del proyecto o área de trabajo"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeProject(expIndex, projIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Bullets */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Logros/Responsabilidades</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => addBullet(expIndex, projIndex)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Punto
                    </Button>
                  </div>
                  {project.bullets?.map((bullet: string, bulletIndex: number) => (
                    <div key={bulletIndex} className="flex gap-2">
                      <Textarea
                        value={bullet}
                        onChange={(e) =>
                          updateBullet(expIndex, projIndex, bulletIndex, e.target.value)
                        }
                        placeholder="Describe el logro o responsabilidad..."
                        rows={2}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeBullet(expIndex, projIndex, bulletIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addExperience} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Agregar Experiencia
      </Button>
    </div>
  );
}
