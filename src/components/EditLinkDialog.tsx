"use client";

import { deleteLink, editLink } from "@/app/actions";
import FormDialog from "./FormDialog";
import { Input } from "./ui/input";

export default function AddLinkDialog({
  linkId,
  link,
}: {
  linkId: number;
  link: string;
}) {
  return (
    <FormDialog
      title="Editar enlace"
      description="Incluye tus perfiles profesionales o proyectos destacados."
      action={editLink}
      type="edit"
      onDelete={deleteLink}
      id={linkId}
    >
      {(pending, actionStarted) => (
        <>
          <Input
            defaultValue={link}
            name="link"
            type="text"
            placeholder="Enlace"
            required
            disabled={pending || actionStarted.saving}
          />
          <input type="hidden" name="linkId" value={linkId} />
        </>
      )}
    </FormDialog>
  );
}
