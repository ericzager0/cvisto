"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteCVAction } from "@/app/actions";

interface DeleteCVButtonProps {
  cvId: string;
  cvTitle: string;
}

export default function DeleteCVButton({ cvId, cvTitle }: DeleteCVButtonProps) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const result = await deleteCVAction(cvId);
      if (result.success) {
        router.push("/cvs");
        router.refresh();
      } else {
        alert(result.error || "Error al eliminar el CV");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar el CV");
    } finally {
      setDeleting(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
      >
        <Trash2 className="h-4 w-4" />
        Eliminar
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar CV?</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que querés eliminar el CV <strong>&quot;{cvTitle}&quot;</strong>?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Eliminando..." : "Eliminar CV"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
