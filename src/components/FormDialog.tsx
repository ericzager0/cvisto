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
  variant,
  triggerText,
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
  variant?: "fixed" | "outline";
  triggerText?: string;
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
      <DialogTrigger
        {...(variant === "fixed" && {
          className:
            "fixed bottom-4 right-4 h-8 w-8 flex items-center justify-center bg-[#5D3A9B] hover:bg-[#5D3A9B]/90 cursor-pointer self-center p-1 rounded-full",
        })}
        {...(variant === "outline" && {
          className:
            "h-9 px-4 py-2 has-[>svg]:px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 cursor-pointer",
        })}
      >
        {type === "edit" && variant !== "outline" && <Pencil size={18} />}
        {type === "add" && variant !== "outline" && (
          <Plus
            size={18}
            {...(variant === "fixed" && {
              color: "white",
              size: 24,
            })}
          />
        )}
        {variant === "outline" && triggerText}
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
                  pending || actionStarted.saving || actionStarted.deleting
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
