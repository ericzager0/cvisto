"use client";

import { updateUserLocation } from "@/app/actions";
import FormDialog from "./FormDialog";
import { Input } from "./ui/input";

export default function EditLocationDialog({
  initialValue,
}: {
  initialValue: string;
}) {
  return (
    <FormDialog
      title="Editar ubicación"
      description="Le pedimos que sea general."
      action={updateUserLocation}
      type="edit"
    >
      {(pending, actionStarted) => (
        <Input
          type="text"
          defaultValue={initialValue}
          name="location"
          disabled={pending || actionStarted.saving}
        />
      )}
    </FormDialog>
  );
}
