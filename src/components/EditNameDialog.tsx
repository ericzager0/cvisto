"use client";

import { updateUserName } from "@/app/actions";
import FormDialog from "./FormDialog";
import { Input } from "./ui/input";

export default function EditNameDialog({
  initialValue,
}: {
  initialValue: { firstName: string; lastName: string };
}) {
  return (
    <FormDialog
      title="Editar nombre y apellido"
      description="Agrega segundo nombre o apellido separado con espacio."
      action={updateUserName}
      type="edit"
    >
      {(pending, actionStarted) => (
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            defaultValue={initialValue.firstName}
            name="firstName"
            disabled={pending || actionStarted.saving}
            placeholder="Nombre"
            required
            pattern=".*\S.*"
          />
          <Input
            type="text"
            defaultValue={initialValue.lastName}
            name="lastName"
            disabled={pending || actionStarted.saving}
            placeholder="Apellido"
            required
            pattern=".*\S.*"
          />
        </div>
      )}
    </FormDialog>
  );
}
