import { Icon } from "../ui/Icon";

export function SummaryLine({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="summary-line">
      <Icon>{icon}</Icon>
      <div>
        <b>{label}</b>
        <p>{value}</p>
      </div>
      <button className="link">Cambiar</button>
    </div>
  );
}
