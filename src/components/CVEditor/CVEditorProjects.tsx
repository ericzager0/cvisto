import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface CVEditorProjectsProps {
  data: any[];
  onChange: (data: any[]) => void;
}

export default function CVEditorProjects({ data, onChange }: CVEditorProjectsProps) {
  const addProject = () => {
    onChange([
      ...(data || []),
      {
        project_name: "",
        stack: [],
        link: "",
        bullets: [""]
      }
    ]);
  };

  const removeProject = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, field: string, value: any) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  const addStackItem = (projectIndex: number) => {
    const newData = [...data];
    newData[projectIndex].stack = [...(newData[projectIndex].stack || []), ""];
    onChange(newData);
  };

  const removeStackItem = (projectIndex: number, stackIndex: number) => {
    const newData = [...data];
    newData[projectIndex].stack = newData[projectIndex].stack.filter(
      (_: any, i: number) => i !== stackIndex
    );
    onChange(newData);
  };

  const updateStackItem = (projectIndex: number, stackIndex: number, value: string) => {
    const newData = [...data];
    newData[projectIndex].stack[stackIndex] = value;
    onChange(newData);
  };

  const addBullet = (projectIndex: number) => {
    const newData = [...data];
    newData[projectIndex].bullets = [...(newData[projectIndex].bullets || []), ""];
    onChange(newData);
  };

  const removeBullet = (projectIndex: number, bulletIndex: number) => {
    const newData = [...data];
    newData[projectIndex].bullets = newData[projectIndex].bullets.filter(
      (_: any, i: number) => i !== bulletIndex
    );
    onChange(newData);
  };

  const updateBullet = (projectIndex: number, bulletIndex: number, value: string) => {
    const newData = [...data];
    newData[projectIndex].bullets[bulletIndex] = value;
    onChange(newData);
  };

  return (
    <div className="space-y-6">
      {data?.map((project: any, projectIndex: number) => (
        <div key={projectIndex} className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Proyecto {projectIndex + 1}</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeProject(projectIndex)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Nombre del Proyecto *</Label>
              <Input
                value={project.project_name || ""}
                onChange={(e) => updateProject(projectIndex, "project_name", e.target.value)}
              />
            </div>

            <div>
              <Label>Link (GitHub, Demo, etc.)</Label>
              <Input
                value={project.link || ""}
                onChange={(e) => updateProject(projectIndex, "link", e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Stack */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Tecnologías Usadas</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addStackItem(projectIndex)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Tecnología
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {project.stack?.map((tech: string, stackIndex: number) => (
                <div key={stackIndex} className="flex gap-2">
                  <Input
                    value={tech}
                    onChange={(e) => updateStackItem(projectIndex, stackIndex, e.target.value)}
                    placeholder="Ej: React"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStackItem(projectIndex, stackIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Bullets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Descripción y Logros</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addBullet(projectIndex)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Punto
              </Button>
            </div>
            <div className="space-y-2">
              {project.bullets?.map((bullet: string, bulletIndex: number) => (
                <div key={bulletIndex} className="flex gap-2">
                  <Textarea
                    value={bullet}
                    onChange={(e) => updateBullet(projectIndex, bulletIndex, e.target.value)}
                    placeholder="Describe la funcionalidad o logro del proyecto..."
                    rows={2}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBullet(projectIndex, bulletIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addProject} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Agregar Proyecto
      </Button>
    </div>
  );
}
