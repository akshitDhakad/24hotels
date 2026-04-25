import Image from "next/image";

export type HostDashboardGalleryProps = {
  heroImageUrl: string;
  rightTopLeftImageUrl: string;
  rightBottomRightImageUrl: string;
};

export function HostDashboardGallery({
  heroImageUrl,
  rightTopLeftImageUrl,
  rightBottomRightImageUrl,
}: HostDashboardGalleryProps) {
  return (
    <div className="relative grid gap-3 lg:aspect-[2.25/1] lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:items-stretch">
      <div className="relative aspect-[16/10] min-h-0 w-full overflow-hidden rounded-xl bg-muted lg:aspect-auto lg:h-full">
        <Image
          src={heroImageUrl}
          alt="Host dashboard hero photo"
          fill
          className="object-cover"
          priority
          sizes="(min-width: 1024px) 42vw, 100vw"
        />
      </div>

      <div className="grid min-h-0 grid-cols-2 grid-rows-2 gap-3 lg:h-full">
        <div className="relative min-h-0 aspect-[16/10] overflow-hidden rounded-xl bg-muted lg:aspect-auto">
          <Image
            src={rightTopLeftImageUrl}
            alt="Gallery photo"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 18vw, 50vw"
          />
        </div>

        <div className="relative min-h-0 aspect-[16/10] overflow-hidden rounded-xl bg-[#f3f5f4] lg:aspect-auto">
          <div className="absolute inset-0 bg-[radial-gradient(60%_90%_at_70%_20%,rgba(34,211,238,0.55),rgba(255,255,255,0.0))]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.85),rgba(255,255,255,0.55))]" />
          <div className="absolute inset-0 p-4">
            <div className="text-[11px] font-semibold tracking-wide text-black/50">SPA</div>
            <div className="mt-1 text-sm font-semibold text-black/80">Cete</div>
          </div>
        </div>

        <div className="relative min-h-0 aspect-[16/10] overflow-hidden rounded-xl bg-muted lg:aspect-auto">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.85),rgba(0,0,0,0.35))]" />
          <div className="absolute inset-0 p-4">
            <div className="text-xs font-semibold text-white/70">Dining</div>
            <div className="mt-1 text-lg font-semibold text-white">
              Dining
              <br />
              Experience
            </div>
            <div className="mt-2 text-xs text-white/70">Curated menus & wines</div>
          </div>
        </div>

        <div className="relative min-h-0 aspect-[16/10] overflow-hidden rounded-xl bg-muted lg:aspect-auto">
          <Image
            src={rightBottomRightImageUrl}
            alt="Gallery photo"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 18vw, 50vw"
          />
        </div>
      </div>
    </div>
  );
}

