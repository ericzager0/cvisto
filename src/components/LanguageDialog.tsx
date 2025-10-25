"use client";

import { addLanguage, editLanguage, deleteLanguage } from "@/app/actions";
import FormDialog from "./FormDialog";
import { Input } from "./ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "./ui/select";
import { useEffect, useState } from "react";

const proficiencyLevels = [
  { display: "Básico", value: "elementary" },
  { display: "Limitado", value: "limited" },
  { display: "Profesional", value: "professional" },
  { display: "Profesional avanzado", value: "full_professional" },
  { display: "Nativo / Bilingüe", value: "native" },
];

export default function LanguageDialog({
  initialValue,
}: {
  initialValue?: { name: string; id: number; proficiency?: string };
}) {
  return (
    <FormDialog
      title={initialValue ? "Editar idioma" : "Agregar idioma"}
      description="Le recomendamos seleccionar su dominio del idioma."
      action={initialValue ? editLanguage : addLanguage}
      type={initialValue ? "edit" : "add"}
      onDelete={initialValue ? deleteLanguage : undefined}
      id={initialValue?.id}
    >
      {(pending, actionStarted, _picturePreview, _handleFileChange, open) => (
        <Language
          initialValue={initialValue}
          pending={pending}
          actionStarted={actionStarted}
          open={open as boolean}
        />
      )}
    </FormDialog>
  );
}

function Language({
  initialValue,
  pending,
  actionStarted,
  open,
}: {
  initialValue?: {
    id: number;
    name: string;
    proficiency?: string;
  };
  pending: boolean;
  actionStarted: { saving: boolean; deleting: boolean };
  open: boolean;
}) {
  const [proficiency, setProficiency] = useState(
    initialValue?.proficiency ? initialValue.proficiency : ""
  );

  useEffect(() => {
    if (!open) {
      setProficiency("");
    }
  }, [open]);

  return (
    <>
      <Input
        name="name"
        type="text"
        placeholder="Idioma"
        required
        disabled={pending || actionStarted.saving}
        defaultValue={initialValue ? initialValue.name : ""}
      />
      {initialValue && (
        <input type="hidden" name="languageId" value={initialValue.id} />
      )}
      <Select
        defaultValue={proficiency}
        onValueChange={setProficiency}
        disabled={pending || actionStarted.saving || actionStarted.deleting}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Dominio" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Dominio</SelectLabel>
            {proficiencyLevels.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.display}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <input type="hidden" name="proficiency" value={proficiency} />
    </>
  );
}
