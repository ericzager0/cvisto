"use client";

import { Textarea } from "@/components/ui/textarea";
import { updateUserBio } from "@/app/actions";
import FormDialog from "./FormDialog";

export default function EditBioDialog({
  initialValue,
}: {
  initialValue: string;
}) {
  return (
    <FormDialog
      title="Editar biografía"
      description="Es importante que seas claro y preciso."
      action={updateUserBio}
      type="edit"
    >
      {(pending, actionStarted) => (
        <Textarea
          name="bio"
          className="resize-none h-32"
          defaultValue={initialValue}
          disabled={pending || actionStarted.saving}
        />
      )}
    </FormDialog>
  );
}
