"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CVEditor from "./CVEditor";

interface CVEditorWrapperProps {
  cvId: string;
  cvData: any;
}

export default function CVEditorWrapper({ cvId, cvData }: CVEditorWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!cvData) {
    return (
      <Button variant="outline" disabled className="opacity-50 cursor-not-allowed">
        <Edit className="h-4 w-4 mr-2" />
        Editar (No disponible)
      </Button>
    );
  }

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Edit className="h-4 w-4 mr-2" />
        Editar CV
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-none w-[96vw] h-[96vh] max-h-[96vh] flex flex-col p-0 gap-0">
          <div className="px-8 pt-6 pb-4 border-b shrink-0">
            <DialogHeader>
              <DialogTitle className="text-2xl">Editor de CV</DialogTitle>
              <DialogDescription className="text-base">
                Edita todos los campos de tu currículum vitae. Los cambios se guardarán y regenerarán el documento automáticamente.
                También podés descargarlo y editarlo en tu editor de docx favorito, pero tendrás que volver a subirlo para actualizar los datos.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <CVEditor
              cvId={cvId}
              initialData={cvData}
              onCancel={() => setIsOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
