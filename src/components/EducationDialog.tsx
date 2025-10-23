"use client";

import { useEffect, useState } from "react";
import FormDialog from "./FormDialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { addEducation, editEducation, deleteEducation } from "@/app/actions";
import { getMonth, getYear } from "@/lib/utils";

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export default function EducationDialog({
  initialValue,
}: {
  initialValue?: {
    id: number;
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
    description: string;
  };
}) {
  return (
    <FormDialog
      title={initialValue ? "Editar educación" : "Agregar educación"}
      description="Compartí la información que consideres relevante."
      action={initialValue ? editEducation : addEducation}
      type={initialValue ? "edit" : "add"}
      onDelete={initialValue ? deleteEducation : undefined}
      id={initialValue?.id}
    >
      {(pending, actionStarted, _picturePreview, _handleFileChange, open) => (
        <Education
          initialValue={initialValue}
          pending={pending}
          actionStarted={actionStarted}
          open={open as boolean}
        />
      )}
    </FormDialog>
  );
}

function Education({
  initialValue,
  pending,
  actionStarted,
  open,
}: {
  initialValue?: {
    id: number;
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
    description: string;
  };
  pending: boolean;
  actionStarted: { saving: boolean; deleting: boolean };
  open: boolean;
}) {
  const currentYear = new Date().getFullYear();

  const [startMonth, setStartMonth] = useState(
    initialValue ? getMonth(initialValue.startDate) : ""
  );
  const [endMonth, setEndMonth] = useState(
    initialValue ? getMonth(initialValue.endDate) : ""
  );

  useEffect(() => {
    if (!open) {
      setStartMonth("");
      setEndMonth("");
    }
  }, [open]);

  return (
    <div className="flex flex-col gap-3">
      {initialValue && (
        <input type="hidden" value={initialValue.id} name="educationId" />
      )}
      <div className="flex flex-col gap-2">
        <Label htmlFor="school">Institución</Label>
        <Input
          id="school"
          name="school"
          placeholder="Institución"
          disabled={pending || actionStarted.saving || actionStarted.deleting}
          pattern=".*\S.*"
          required
          defaultValue={initialValue ? initialValue.school : ""}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="degree">Título</Label>
        <Input
          id="degree"
          name="degree"
          type="text"
          placeholder="Título"
          disabled={pending || actionStarted.saving || actionStarted.deleting}
          pattern=".*\S.*"
          required
          defaultValue={initialValue ? initialValue.degree : ""}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Fecha de inicio</Label>
        <div className="flex gap-2">
          <Select
            defaultValue={startMonth}
            onValueChange={setStartMonth}
            disabled={pending || actionStarted.saving || actionStarted.deleting}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Mes</SelectLabel>
                {months.map((name, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <input type="hidden" name="startMonth" value={startMonth} />
          <Input
            type="number"
            name="startYear"
            placeholder="Año"
            min={currentYear - 100}
            max={currentYear}
            className="flex-1"
            pattern="\d*"
            required
            disabled={pending || actionStarted.saving || actionStarted.deleting}
            defaultValue={initialValue ? getYear(initialValue.startDate) : ""}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Fecha de fin (o la esperada)</Label>
        <div className="flex gap-2">
          <Select
            defaultValue={endMonth}
            onValueChange={setEndMonth}
            disabled={pending || actionStarted.saving || actionStarted.deleting}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Mes</SelectLabel>
                {months.map((name, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <input type="hidden" name="endMonth" value={endMonth} />
          <Input
            type="number"
            name="endYear"
            placeholder="Año"
            min={currentYear - 100}
            max={currentYear + 10}
            className="flex-1"
            pattern="\d*"
            required
            disabled={pending || actionStarted.saving || actionStarted.deleting}
            defaultValue={initialValue ? getYear(initialValue.endDate) : ""}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="education-description">Descripción</Label>
        <Textarea
          id="education-description"
          name="description"
          className="resize-none h-32"
          style={{ overflowWrap: "break-word", wordBreak: "break-word" }}
          placeholder="Descripción"
          disabled={pending || actionStarted.saving || actionStarted.deleting}
          defaultValue={initialValue ? initialValue.description : ""}
        />
      </div>
    </div>
  );
}
