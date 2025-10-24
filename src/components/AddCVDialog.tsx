"use client";

import FormDialog from "./FormDialog";
import { Input } from "./ui/input";
import { addCV } from "@/app/actions";

export default function AddCVDialog({
  variant,
}: {
  variant: "fixed" | "outline";
}) {
  return (
    <FormDialog
      title="Subir CV"
      description="Extensión .pdf o .docx sin excepción."
      action={addCV}
      type="add"
      variant={variant}
      triggerText={variant === "outline" ? "Subir CV" : undefined}
    >
      {(pending, actionStarted) => (
        <Input
          name="cv"
          type="file"
          accept=".pdf,.docx"
          disabled={pending || actionStarted.saving}
        />
      )}
    </FormDialog>
  );
}
