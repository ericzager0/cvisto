const proficiencyMap: Record<string, string> = {
  elementary: "Básico",
  limited: "Limitado",
  professional: "Profesional",
  full_professional: "Profesional avanzado",
  native: "Nativo / Bilingüe",
};

export default function LanguageCard({
  name,
  proficiency,
}: {
  name: string;
  proficiency?: string;
}) {
  if (proficiency) {
    return (
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-[#777777]">{proficiencyMap[proficiency]}</p>
      </div>
    );
  }

  return <p className="font-medium">{name}</p>;
}
