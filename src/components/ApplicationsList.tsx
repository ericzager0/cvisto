"use client";

import { useState } from "react";
import { JobApplication } from "@/lib/queries";
import {
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  Edit,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import EditApplicationDialog from "./EditApplicationDialog";
import { deleteJobApplicationAction } from "@/app/actions";

interface ApplicationsListProps {
  applications: JobApplication[];
  userId: string;
  onUpdate: () => void;
}

const statusColors = {
  applied: "bg-purple-100 text-purple-800 border-purple-200",
  phone_screen: "bg-blue-100 text-blue-800 border-blue-200",
  interview: "bg-yellow-100 text-yellow-800 border-yellow-200",
  technical_test: "bg-orange-100 text-orange-800 border-orange-200",
  offer: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  withdrawn: "bg-gray-100 text-gray-800 border-gray-200",
};

const statusLabels = {
  applied: "Aplicado",
  phone_screen: "Entrevista telefónica",
  interview: "Entrevista",
  technical_test: "Prueba técnica",
  offer: "Oferta recibida",
  rejected: "Rechazado",
  withdrawn: "Retirado",
};

export default function ApplicationsList({
  applications,
  userId,
  onUpdate,
}: ApplicationsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que querés eliminar esta aplicación?")) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteJobApplicationAction(id);
      onUpdate();
    } catch (error) {
      console.error("Error deleting application:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No tenés aplicaciones registradas
        </h3>
        <p className="text-gray-600 mb-4">
          Comenzá a registrar tus aplicaciones para hacer seguimiento
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <div
          key={app.id}
          className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
        >
          {/* Header */}
          <div className="flex justify-between items-start gap-4 mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  {app.jobTitle}
                </h3>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium border ${
                    statusColors[app.status]
                  }`}
                >
                  {statusLabels[app.status]}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {app.company}
                </div>
                {app.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {app.location}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Aplicado: {formatDate(app.appliedDate)}
                </div>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              {app.jobUrl && (
                <a
                  href={app.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              )}
              <EditApplicationDialog
                application={app}
                onSuccess={onUpdate}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(app.id)}
                disabled={deletingId === app.id}
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </div>

          {/* Salary */}
          {app.salary && (
            <div className="mb-3 text-sm font-medium text-green-700">
              💰 {app.salary}
            </div>
          )}

          {/* Next Step */}
          {app.nextStep && (
            <div className="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-sm font-medium text-purple-900 mb-1">
                Próximo paso: {app.nextStep}
              </div>
              {app.nextStepDate && (
                <div className="text-xs text-purple-700">
                  📅 {formatDate(app.nextStepDate)}
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {app.notes && (
            <div className="text-sm text-gray-700 p-3 bg-gray-50 rounded border border-gray-200">
              {app.notes}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
