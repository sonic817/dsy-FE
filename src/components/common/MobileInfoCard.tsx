"use client";

interface MobileInfoCardProps {
  title: string;
  subtitle: string;
  onClick: () => void;
  selected?: boolean;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  actionLabel?: string;
}

export default function MobileInfoCard({
  title,
  subtitle,
  onClick,
  selected = false,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  actionLabel = "자세히보기",
}: MobileInfoCardProps) {
  const buttonClassName = ["program-select-btn", selected ? "selected" : "", className]
    .filter(Boolean)
    .join(" ");
  const titleTextClassName = ["program-select-name", titleClassName].filter(Boolean).join(" ");
  const subtitleTextClassName = ["program-select-meta-text", subtitleClassName].filter(Boolean).join(" ");

  return (
    <button type="button" className={buttonClassName} onClick={onClick}>
      <span className={titleTextClassName}>{title}</span>
      <span className="program-select-meta">
        <span className={subtitleTextClassName}>{subtitle}</span>
        <span className="program-select-meta-action">{actionLabel}</span>
      </span>
    </button>
  );
}
