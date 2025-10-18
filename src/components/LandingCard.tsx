interface LandingCardProps {
  icon: React.ElementType;
  title: string;
  content: string;
}

export default function LandingCard({
  icon: Icon,
  title,
  content,
}: LandingCardProps) {
  return (
    <div className="flex flex-col gap-4 border border-[#d5d9d9] rounded-lg p-4 items-center md:items-start">
      <Icon color="#5D3A9B" size={32} />
      <h3 className="font-bold">{title}</h3>
      <p className="text-center md:text-left">{content}</p>
    </div>
  );
}
