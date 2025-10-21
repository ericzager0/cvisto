"use client";

import { updateProfile } from "@/app/actions";
import FormDialog from "./FormDialog";
import { Input } from "./ui/input";
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Camera } from "lucide-react";

export default function EditProfileDialog({
  initialValue,
}: {
  initialValue: { firstName: string; lastName: string; picture: string };
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <FormDialog
      title="Editar perfil"
      description="Le recomendamos utilizar una imagen cuadrada."
      action={updateProfile}
      type="edit"
    >
      {(pending, actionStarted, picturePreview, handleFileChange) => (
        <div className="flex flex-col gap-2 items-center">
          <div className="relative w-24 h-24">
            <Avatar className="w-full h-full border">
              <AvatarImage src={picturePreview || initialValue.picture} />
              <AvatarFallback />
            </Avatar>
            <Button
              type="button"
              variant="outline"
              className="h-8 w-8 rounded-full cursor-pointer absolute bottom-0 right-0"
              onClick={handleButtonClick}
              disabled={pending || actionStarted.saving}
            >
              <Camera className="size-[18px]" />
            </Button>
            <input
              ref={fileInputRef}
              onChange={handleFileChange}
              type="file"
              accept="image/*"
              className="hidden"
              name="picture"
            ></input>
          </div>

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
