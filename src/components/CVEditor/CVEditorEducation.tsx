import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface CVEditorEducationProps {
  data: any[];
  onChange: (data: any[]) => void;
}

export default function CVEditorEducation({ data, onChange }: CVEditorEducationProps) {
  const addEducation = () => {
    onChange([
      ...(data || []),
      {
        university_name: "",
        city_state_country: "",
        degree: "",
        major: "",
        expected_graduation: "",
        gpa: "",
        honors: [],
        relevant_coursework: []
      }
    ]);
  };

  const removeEducation = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: string, value: any) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  const updateArrayItem = (eduIndex: number, field: string, arrayIndex: number, value: string) => {
    const newData = [...data];
    const newArray = [...(newData[eduIndex][field] || [])];
    newArray[arrayIndex] = value;
    newData[eduIndex][field] = newArray;
    onChange(newData);
  };

  const addArrayItem = (eduIndex: number, field: string) => {
    const newData = [...data];
    newData[eduIndex][field] = [...(newData[eduIndex][field] || []), ""];
    onChange(newData);
  };

  const removeArrayItem = (eduIndex: number, field: string, arrayIndex: number) => {
    const newData = [...data];
    newData[eduIndex][field] = newData[eduIndex][field].filter((_: any, i: number) => i !== arrayIndex);
    onChange(newData);
  };

  return (
    <div className="space-y-6">
      {data?.map((edu: any, eduIndex: number) => (
        <div key={eduIndex} className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Educación {eduIndex + 1}</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeEducation(eduIndex)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <Label>Universidad *</Label>
              <Input
                value={edu?.university_name || ""}
                onChange={(e) => updateEducation(eduIndex, "university_name", e.target.value)}
              />
            </div>

            <div>
              <Label>Ubicación (Ciudad, Estado, País)</Label>
              <Input
                value={edu?.city_state_country || ""}
                onChange={(e) => updateEducation(eduIndex, "city_state_country", e.target.value)}
                placeholder="Ej: Boston, MA, USA"
              />
            </div>

            <div>
              <Label>Título *</Label>
              <Input
                value={edu?.degree || ""}
                onChange={(e) => updateEducation(eduIndex, "degree", e.target.value)}
                placeholder="Ej: Bachelor of Science"
              />
            </div>

            <div>
              <Label>Especialización</Label>
              <Input
                value={edu?.major || ""}
                onChange={(e) => updateEducation(eduIndex, "major", e.target.value)}
                placeholder="Ej: Computer Science"
              />
            </div>

            <div>
              <Label>Fecha de Graduación</Label>
              <Input
                value={edu?.expected_graduation || ""}
                onChange={(e) => updateEducation(eduIndex, "expected_graduation", e.target.value)}
                placeholder="Ej: May 2023"
              />
            </div>

            <div>
              <Label>GPA (Opcional)</Label>
              <Input
                value={edu?.gpa || ""}
                onChange={(e) => updateEducation(eduIndex, "gpa", e.target.value)}
                placeholder="Ej: 3.8/4.0"
              />
            </div>
          </div>

          {/* Honors */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Honores y Distinciones</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem(eduIndex, "honors")}
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </div>
            <div className="space-y-2">
              {edu?.honors?.map((honor: string, honorIndex: number) => (
                <div key={honorIndex} className="flex gap-2">
                  <Input
                    value={honor}
                    onChange={(e) => updateArrayItem(eduIndex, "honors", honorIndex, e.target.value)}
                    placeholder="Ej: Dean's List"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem(eduIndex, "honors", honorIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Relevant Coursework */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Cursos Relevantes</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem(eduIndex, "relevant_coursework")}
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </div>
            <div className="space-y-2">
              {edu?.relevant_coursework?.map((course: string, courseIndex: number) => (
                <div key={courseIndex} className="flex gap-2">
                  <Input
                    value={course}
                    onChange={(e) => updateArrayItem(eduIndex, "relevant_coursework", courseIndex, e.target.value)}
                    placeholder="Ej: Data Structures & Algorithms"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem(eduIndex, "relevant_coursework", courseIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addEducation} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Agregar Educación
      </Button>
    </div>
  );
}
