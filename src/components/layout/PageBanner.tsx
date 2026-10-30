import hero from "../../imagenes/hero-santorini.png";

export function PageBanner({
  title,
  subtitle,
  crumb,
  image = false,
}: {
  title: string;
  subtitle: string;
  crumb: string;
  image?: boolean;
}) {
  return (
    <section
      className={`page-banner ${image ? "with-image" : ""}`}
      style={image ? { backgroundImage: `url(${hero})` } : undefined}
    >
      <p className="eyebrow">INICIO&nbsp;&nbsp;·&nbsp;&nbsp;{crumb}</p>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {image && (
        <em>
          El mundo
          <br />
          te espera
        </em>
      )}
    </section>
  );
}
