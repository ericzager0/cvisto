"use client";

import FormDialog from "./FormDialog";

export default function EditEducationDialog() {
  return (
    <FormDialog
      title="Editar educación"
      description="Compartí la información que consideres relevante."
      action={() => {}}
      type="edit"
    >
      {(pending, actionStarted) => <></>}
    </FormDialog>
  );
}
