import { displayDate } from "@/lib/utils";

export default function EducationCard({
  degree,
  school,
  endDate,
  startDate,
  description,
}: {
  degree: string;
  school: string;
  endDate: string;
  startDate: string;
  description: string;
}) {
  return (
    <div>
      <p className="font-medium">{school}</p>
      <p>{degree}</p>
      {startDate && endDate && (
        <p className=" text-[#777777]">
          {displayDate(startDate)} - {displayDate(endDate)}
        </p>
      )}
      {description && <p>{description}</p>}
    </div>
  );
}
