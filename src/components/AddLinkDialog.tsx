"use client";

import FormDialog from "./FormDialog";
import { Input } from "./ui/input";
import { addLink } from "@/app/actions";

export default function AddLinkDialog() {
  return (
    <FormDialog
      title="Agregar enlace"
      description="Incluye tus perfiles profesionales o proyectos destacados."
      action={addLink}
      type="add"
    >
      {(pending, actionStarted) => (
        <Input
          name="link"
          type="text"
          placeholder="Enlace"
          required
          disabled={pending || actionStarted.saving}
        />
      )}
    </FormDialog>
  );
}
