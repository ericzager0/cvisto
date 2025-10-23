"use client";

import { Pencil, Plus } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function FormDialog({
  title,
  description,
  action,
  children,
  type,
  onDelete,
  id,
}: {
  title: string;
  description: string;
  action: any;
  children: (
    pending: boolean,
    actionStarted: { saving: boolean; deleting: boolean },
    picturePreview?: string,
    handleFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    open?: boolean
  ) => React.ReactNode;
  type: "add" | "edit";
  onDelete?: (id: number) => Promise<{ success: boolean }>;
  id?: number;
}) {
  const [open, setOpen] = useState(false);
  const [actionStarted, setActionStarted] = useState({
    saving: false,
    deleting: false,
  });
  const [_state, formAction, pending] = useActionState(action, {
    success: false,
  });
  const [picturePreview, setPicturePreview] = useState<string>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (picturePreview) URL.revokeObjectURL(picturePreview);

      setPicturePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (pending) {
      setActionStarted((prev) => ({
        ...prev,
        saving: true,
      }));
    } else {
      setOpen(false);
    }
  }, [pending]);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!pending) setOpen(value);
        if (value) {
          setActionStarted({
            saving: false,
            deleting: false,
          });
          if (picturePreview) {
            URL.revokeObjectURL(picturePreview);
            setPicturePreview(undefined);
          }
        }
      }}
    >
      <DialogTrigger>
        {type === "edit" && <Pencil size={18} />}
        {type === "add" && <Plus size={18} />}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="grid gap-4">
          {children(
            pending,
            actionStarted,
            picturePreview,
            handleFileChange,
            open
          )}
          <DialogFooter>
            {onDelete && (
              <Button
                type="button"
                variant="destructive"
                className="cursor-pointer"
                onClick={async () => {
                  setActionStarted((prev) => ({
                    ...prev,
                    deleting: true,
                  }));

                  await onDelete(id!);
                }}
                disabled={
                  actionStarted.deleting || pending || actionStarted.saving
                }
              >
                {actionStarted.deleting ? "Eliminando..." : "Eliminar"}
              </Button>
            )}

            <DialogClose asChild>
              <Button
                variant="outline"
                disabled={
                  pending || actionStarted.deleting || actionStarted.deleting
                }
                className="cursor-pointer"
                type="button"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-[#5D3A9B] hover:bg-[#5D3A9B]/90 cursor-pointer"
              disabled={
                pending || actionStarted.deleting || actionStarted.saving
              }
            >
              {pending || actionStarted.saving ? "Confirmando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
