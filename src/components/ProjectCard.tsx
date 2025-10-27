import { displayDate } from "@/lib/utils";

export default function ProjectCard({
  name,
  endDate,
  startDate,
  description,
}: {
  name: string;
  endDate: string;
  startDate: string;
  description: string;
}) {
  return (
    <div>
      <p className="font-medium">{name}</p>
      {startDate && (
        <p className=" text-[#777777]">
          {displayDate(startDate)} -{" "}
          {endDate ? displayDate(endDate) : "Presente"}
        </p>
      )}
      {description && <p>{description}</p>}
    </div>
  );
}
