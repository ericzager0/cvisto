import { displayDate } from "@/lib/utils";

export default function ExperienceCard({
  title,
  company,
  endDate,
  startDate,
  description,
}: {
  title: string;
  company: string;
  endDate: string;
  startDate: string;
  description: string;
}) {
  return (
    <div>
      <p className="font-medium">{company}</p>
      <p>{title}</p>
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
