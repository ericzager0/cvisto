"use client";

import { useState, memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Save, X, ChevronDown, ChevronUp } from "lucide-react";
import { updateCVAction } from "@/app/actions";
import { useRouter } from "next/navigation";
import CVEditorHeader from "@/components/CVEditor/CVEditorHeader";
import CVEditorEducation from "@/components/CVEditor/CVEditorEducation";
import CVEditorExperience from "@/components/CVEditor/CVEditorExperience";
import CVEditorProjects from "@/components/CVEditor/CVEditorProjects";
import CVEditorSkills from "@/components/CVEditor/CVEditorSkills";
import CVEditorCertifications from "@/components/CVEditor/CVEditorCertifications";
import CVEditorAwards from "@/components/CVEditor/CVEditorAwards";
import CVEditorPublications from "@/components/CVEditor/CVEditorPublications";
import CVEditorVolunteering from "@/components/CVEditor/CVEditorVolunteering";
import CVEditorInterests from "@/components/CVEditor/CVEditorInterests";

interface CVEditorProps {
  cvId: string;
  initialData: any;
  onCancel: () => void;
}

// Componente Section movido fuera del render
const Section = memo(({ 
  title, 
  name, 
  children, 
  isExpanded, 
  onToggle 
}: { 
  title: string; 
  name: string; 
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: (name: string) => void;
}) => (
  <div className="border rounded-lg overflow-hidden">
    <button
      type="button"
      onClick={() => onToggle(name)}
      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
    </button>
    {isExpanded && (
      <div className="p-4">
        {children}
      </div>
    )}
  </div>
));

Section.displayName = 'Section';

export default function CVEditor({ cvId, initialData, onCancel }: CVEditorProps) {
  const [cvData, setCvData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    header: true,
    education: true,
    experience: true,
    projects: false,
    skills: false,
    certifications: false,
    awards: false,
    publications: false,
    volunteering: false,
    interests: false,
  });
  const router = useRouter();

  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const result = await updateCVAction(cvId, cvData);
      if (result.success) {
        router.refresh();
        onCancel();
      } else {
        setError(result.error || "Error al guardar");
      }
    } catch (err) {
      setError("Error al guardar el CV");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <Section title="Información de Contacto" name="header" isExpanded={expandedSections.header} onToggle={toggleSection}>
          <CVEditorHeader data={cvData.header} onChange={(header: any) => setCvData({ ...cvData, header })} />
        </Section>

        <Section title="Educación" name="education" isExpanded={expandedSections.education} onToggle={toggleSection}>
          <CVEditorEducation data={cvData.education || []} onChange={(education: any) => setCvData({ ...cvData, education })} />
        </Section>

        <Section title="Experiencia Laboral" name="experience" isExpanded={expandedSections.experience} onToggle={toggleSection}>
          <CVEditorExperience data={cvData.experiences || []} onChange={(experiences: any) => setCvData({ ...cvData, experiences })} />
        </Section>

        <Section title="Proyectos Personales" name="projects" isExpanded={expandedSections.projects} onToggle={toggleSection}>
          <CVEditorProjects data={cvData.projects_independent || []} onChange={(projects_independent: any) => setCvData({ ...cvData, projects_independent })} />
        </Section>

        <Section title="Habilidades" name="skills" isExpanded={expandedSections.skills} onToggle={toggleSection}>
          <CVEditorSkills data={cvData.skills || {}} onChange={(skills: any) => setCvData({ ...cvData, skills })} />
        </Section>

        <Section title="Certificaciones" name="certifications" isExpanded={expandedSections.certifications} onToggle={toggleSection}>
          <CVEditorCertifications data={cvData.certifications || []} onChange={(certifications: any) => setCvData({ ...cvData, certifications })} />
        </Section>

        <Section title="Premios y Reconocimientos" name="awards" isExpanded={expandedSections.awards} onToggle={toggleSection}>
          <CVEditorAwards data={cvData.awards || []} onChange={(awards: any) => setCvData({ ...cvData, awards })} />
        </Section>

        <Section title="Publicaciones" name="publications" isExpanded={expandedSections.publications} onToggle={toggleSection}>
          <CVEditorPublications data={cvData.publications || []} onChange={(publications: any) => setCvData({ ...cvData, publications })} />
        </Section>

        <Section title="Voluntariado" name="volunteering" isExpanded={expandedSections.volunteering} onToggle={toggleSection}>
          <CVEditorVolunteering data={cvData.volunteering || []} onChange={(volunteering: any) => setCvData({ ...cvData, volunteering })} />
        </Section>

        <Section title="Intereses" name="interests" isExpanded={expandedSections.interests} onToggle={toggleSection}>
          <CVEditorInterests data={cvData.interests || []} onChange={(interests: any) => setCvData({ ...cvData, interests })} />
        </Section>
      </div>

      {/* Botones de acción en la parte inferior */}
      <div className="pt-6 border-t flex items-center justify-end gap-3">
        <Button variant="outline" onClick={onCancel} disabled={saving} size="lg">
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={saving} className="bg-[#5D3A9B] hover:bg-[#5D3A9B]/90" size="lg">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
    </div>
  );
}
