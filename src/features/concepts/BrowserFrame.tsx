import type { ConceptBrandConfig, ConceptFrameId } from '@/features/concepts/concepts.config';

export interface BrowserFrameProps {
  config: ConceptBrandConfig;
  frame: ConceptFrameId;
}

/**
 * `<BrowserFrame />` + `<MiniSite />` composition component
 * (Fixes Prompt Section 5.3 & Tech Stack Section 12):
 * Renders a crisp desktop/mobile browser window chrome around a live HTML/Tailwind mini-site
 * for the 4 Web Design concepts (`haven-stays`, `adire-atelier`, `ledgerly`, `lumen-dental`).
 */
export function BrowserFrame({ config, frame }: BrowserFrameProps) {
  const { palette } = config;

  if (frame === 'gallery-02') {
    // 4:5 Portrait Mobile & Component System Study (800x1000 @ 2x -> 1600x2000)
    return (
      <div
        data-concept-frame={`${config.slug}-${frame}`}
        style={{ backgroundColor: palette.primary.hex, color: palette.ink }}
        className="relative flex h-[1000px] w-[800px] flex-col justify-between overflow-hidden p-12 font-sans"
      >
        <div
          style={{ borderColor: `${palette.ink}24` }}
          className="flex items-center justify-between border-b pb-5 font-mono text-xs uppercase tracking-[0.08em]"
        >
          <span>{config.name} · RESPONSIVE INTERFACE</span>
          <span>{config.location}</span>
        </div>

        {/* Centered Mobile Viewport Frame + Floating Spec Cards */}
        <div className="my-auto grid grid-cols-12 items-center gap-8 py-6">
          <div
            style={{
              backgroundColor: palette.surface.hex,
              color: palette.surfaceInk,
            }}
            className="col-span-7 flex h-[680px] flex-col justify-between rounded-[24px] border-4 border-black/20 p-7 shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <span className="font-sans text-base font-medium tracking-tight">
                {config.name}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] opacity-70">
                MENU · 02
              </span>
            </div>

            <div className="my-auto space-y-5 py-4">
              <span
                style={{
                  backgroundColor: palette.primary.hex,
                  color: palette.ink,
                }}
                className="inline-block rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.08em]"
              >
                {config.metricsOrBadges[0]}
              </span>
              <h2 className="text-3xl font-medium leading-[1.08] tracking-[-0.03em]">
                {config.specimenHeadline}
              </h2>
              <p className="text-xs leading-relaxed opacity-80">{config.specimenBody}</p>

              {/* Interactive widget card */}
              <div
                style={{ borderColor: `${palette.surfaceInk}20` }}
                className="space-y-3 rounded-[6px] border p-4"
              >
                <div className="flex items-center justify-between font-mono text-[10px] uppercase opacity-70">
                  <span>{config.deliverables[2]}</span>
                  <span>{config.metricsOrBadges[1]}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {config.deliverables.map((d) => (
                    <div
                      key={d}
                      style={{ backgroundColor: `${palette.surfaceInk}08` }}
                      className="rounded px-3 py-2 font-mono text-[10px] uppercase"
                    >
                      {d}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: palette.primary.hex,
                color: palette.ink,
              }}
              className="flex items-center justify-between rounded-full px-5 py-3.5 text-xs font-medium"
            >
              <span>{config.deliverables[0]}</span>
              <span className="font-mono text-[10px] uppercase">
                {config.metricsOrBadges[2]} →
              </span>
            </div>
          </div>

          <div className="col-span-5 space-y-5">
            {config.deliverables.map((item, idx) => (
              <div
                key={item}
                style={{
                  backgroundColor: `${palette.ink}10`,
                  borderColor: `${palette.ink}25`,
                }}
                className="space-y-1.5 rounded-[6px] border p-5"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] opacity-70">
                  SCREEN 0{idx + 1}
                </span>
                <p className="text-lg font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{ borderColor: `${palette.ink}24` }}
          className="flex items-center justify-between border-t pt-5 font-mono text-xs uppercase tracking-[0.08em] opacity-80"
        >
          <span>MOBILE & COMPONENT ARCHITECTURE</span>
          <span>ISÉOLUWA WEB ENGINEERING</span>
        </div>
      </div>
    );
  }

  // 16:9 Landscape Browser Frame (`hero` or `gallery-01`, 1200x675 @ 2x -> 2400x1350)
  const isDashboardView = frame === 'gallery-01';

  return (
    <div
      data-concept-frame={`${config.slug}-${frame}`}
      style={{
        backgroundColor: isDashboardView ? palette.primary.hex : '#E8E6E0',
        color: palette.surfaceInk,
      }}
      className="relative flex h-[675px] w-[1200px] flex-col justify-between overflow-hidden p-8 font-sans"
    >
      {/* Clean Browser Window Chrome */}
      <div
        style={{
          backgroundColor: palette.surface.hex,
          color: palette.surfaceInk,
          borderColor: `${palette.surfaceInk}22`,
        }}
        className="flex h-full w-full flex-col overflow-hidden rounded-[8px] border shadow-sm"
      >
        {/* Browser Top Bar */}
        <div
          style={{ borderColor: `${palette.surfaceInk}18` }}
          className="flex h-11 shrink-0 items-center justify-between border-b px-5"
        >
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-current opacity-25" />
            <span className="h-2.5 w-2.5 rounded-full bg-current opacity-25" />
            <span className="h-2.5 w-2.5 rounded-full bg-current opacity-25" />
          </div>
          <div
            style={{ backgroundColor: `${palette.surfaceInk}08` }}
            className="rounded-full px-5 py-1 font-mono text-[11px] tracking-[0.04em] opacity-75"
          >
            https://{config.location}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.08em] opacity-60">
            {config.year} · CONCEPT
          </div>
        </div>

        {/* Scrollable MiniSite Viewport (`data-scroll-viewport="true"` used for Playwright video loop) */}
        <div
          data-scroll-viewport="true"
          className="flex flex-1 flex-col justify-between overflow-y-auto p-10"
        >
          {/* MiniSite Header */}
          <div
            style={{ borderColor: `${palette.surfaceInk}15` }}
            className="flex items-center justify-between border-b pb-5"
          >
            <div className="flex items-center gap-3">
              <span
                style={{
                  backgroundColor: palette.primary.hex,
                  color: palette.ink,
                }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-medium"
              >
                {config.monogram}
              </span>
              <span className="text-lg font-medium tracking-tight">{config.name}</span>
            </div>

            <div className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.06em] opacity-75">
              {config.deliverables.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <span
              style={{
                backgroundColor: palette.primary.hex,
                color: palette.ink,
              }}
              className="rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.06em]"
            >
              {config.metricsOrBadges[2]}
            </span>
          </div>

          {/* MiniSite Hero / Main Content Grid */}
          <div className="my-auto grid grid-cols-12 items-center gap-8 py-6">
            <div className="col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-current/20 px-3.5 py-1 font-mono text-[11px] uppercase tracking-[0.08em]">
                <span
                  style={{ backgroundColor: palette.secondary.hex }}
                  className="h-2 w-2 rounded-full"
                />
                <span>{config.subtitle}</span>
              </div>

              <h1 className="text-5xl font-medium leading-[1.02] tracking-[-0.035em]">
                {config.specimenHeadline}
              </h1>

              <p className="max-w-[50ch] text-base leading-relaxed opacity-80">
                {config.specimenBody}
              </p>

              {/* Interactive search / action bar */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {config.metricsOrBadges.map((badge, idx) => (
                  <div
                    key={badge}
                    style={
                      idx === 0
                        ? { backgroundColor: palette.primary.hex, color: palette.ink }
                        : { borderColor: `${palette.surfaceInk}25` }
                    }
                    className="rounded-[6px] border px-4 py-2.5 font-mono text-xs uppercase tracking-[0.06em]"
                  >
                    {badge}
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 cols: Live UI Preview Cards */}
            <div className="col-span-5 space-y-4">
              <div
                style={{
                  backgroundColor: palette.primary.hex,
                  color: palette.ink,
                }}
                className="space-y-5 rounded-[6px] p-7"
              >
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.08em] opacity-80">
                  <span>{config.deliverables[1].toUpperCase()}</span>
                  <span>LIVE PREVIEW</span>
                </div>

                <div className="space-y-3">
                  {config.deliverables.map((step, i) => (
                    <div
                      key={step}
                      style={{
                        backgroundColor: `${palette.ink}12`,
                        borderColor: `${palette.ink}20`,
                      }}
                      className="flex items-center justify-between rounded border px-4 py-3"
                    >
                      <span className="font-mono text-xs">0{i + 1}</span>
                      <span className="text-sm font-medium">{step}</span>
                      <span
                        style={{ color: palette.secondary.hex }}
                        className="font-mono text-[11px] uppercase"
                      >
                        ACTIVE
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* MiniSite Footer Feature Row (enables smooth vertical scroll during video capture) */}
          <div
            style={{ borderColor: `${palette.surfaceInk}18` }}
            className="grid grid-cols-4 gap-4 border-t pt-5"
          >
            {config.deliverables.map((feature, idx) => (
              <div key={feature} className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] opacity-60">
                  MODULE 0{idx + 1}
                </span>
                <p className="text-sm font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
