"use client";

import FormDialog from "./FormDialog";
import { Input } from "./ui/input";

export default function CreateEducationDialog() {
  return (
    <FormDialog
      title="Agregar educación"
      description="Comparta la información que considere relevante."
      action={() => {}}
      type="add"
    >
      {(pending, actionStarted) => (
        <div className="flex flex-col gap-2">
          <Input type="text" placeholder="Institución" />
          <Input type="text" placeholder="Título" />
        </div>
      )}
    </FormDialog>
  );
}
