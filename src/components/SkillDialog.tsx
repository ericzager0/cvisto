"use client";

import { addSkill, editSkill, deleteSkill } from "@/app/actions";
import FormDialog from "./FormDialog";
import { Input } from "./ui/input";

export default function SkillDialog({
  initialValue,
}: {
  initialValue?: { skill: string; id: number };
}) {
  return (
    <FormDialog
      title={initialValue ? "Editar habilidad" : "Agregar habilidad"}
      description="Le recomendamos incluir habilidades en demanda."
      action={initialValue ? editSkill : addSkill}
      type={initialValue ? "edit" : "add"}
      onDelete={initialValue ? deleteSkill : undefined}
      id={initialValue?.id}
    >
      {(pending, actionStarted) => (
        <>
          <Input
            name="skill"
            type="text"
            placeholder="Habilidad"
            required
            disabled={pending || actionStarted.saving}
            defaultValue={initialValue ? initialValue.skill : ""}
          />
          {initialValue && (
            <input type="hidden" name="skillId" value={initialValue.id} />
          )}
        </>
      )}
    </FormDialog>
  );
}
