"use client";

import { updateUserPhone } from "@/app/actions";
import FormDialog from "./FormDialog";
import { Input } from "./ui/input";

export default function EditPhoneDialog({
  initialValue,
}: {
  initialValue: string;
}) {
  return (
    <FormDialog
      title="Editar teléfono"
      description="Incluya los prefijos adecuados."
      action={updateUserPhone}
      type="edit"
    >
      {(pending, actionStarted) => (
        <Input
          type="text"
          defaultValue={initialValue}
          name="phone"
          disabled={pending || actionStarted.saving}
        />
      )}
    </FormDialog>
  );
}
