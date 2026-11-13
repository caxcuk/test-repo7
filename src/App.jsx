import React, { useMemo, useRef, useState, useId } from "react";

/* ==================================================================
   ДАННЫЕ
   ================================================================== */

const BEERS = [
    { id: 1, name: "Golden Hour",    type: "Американский пейл-эль", abv: 5.4,  ibu: 38, color: 18,  price: 380, notes: "Цитрус · Сосна · Тропики",      desc: "Солнечный эль с ярким хмелевым профилем и сухим финишем." },
    { id: 2, name: "Night Porter",   type: "Балтийский портер",     abv: 8.2,  ibu: 32, color: 88,  price: 460, notes: "Кофе · Тёмный шоколад · Сливки", desc: "Плотный, обволакивающий портер с нотами жареного солода." },
    { id: 3, name: "Wheat Cloud",    type: "Хефевайцен",            abv: 5.0,  ibu: 14, color: 12,  price: 340, notes: "Банан · Гвоздика · Пшеница",     desc: "Мягкий немецкий вайцен с облачным телом и фруктовым ароматом." },
    { id: 4, name: "Iron IPA",       type: "Double IPA",            abv: 9.1,  ibu: 82, color: 24,  price: 520, notes: "Смола · Манго · Грейпфрут",       desc: "Дерзкий DIPA для тех, кто любит горечь без компромиссов." },
    { id: 5, name: "Red Brick",      type: "Амбер-эль",             abv: 6.1,  ibu: 30, color: 45,  price: 390, notes: "Карамель · Хлеб · Орех",         desc: "Тёплый янтарный эль с карамельной сладостью и сухим финалом." },
    { id: 6, name: "Sour Cherry",    type: "Фруктовый сауэр",       abv: 4.3,  ibu: 8,  color: 60,  price: 410, notes: "Вишня · Лактоза · Кислота",      desc: "Яркий вишнёвый сауэр с освежающей кислинкой." },
    { id: 7, name: "Pilsner No.1",   type: "Чешский пилснер",       abv: 4.8,  ibu: 34, color: 8,   price: 300, notes: "Трава · Хлеб · Цветы",           desc: "Классика жанра: чистый, хрустящий, бесконечно питкий." },
    { id: 8, name: "Imperial Stout", type: "Имперский стаут",       abv: 11.0, ibu: 60, color: 100, price: 590, notes: "Ваниль · Кофе · Чернослив",      desc: "Тяжёлая артиллерия с бархатистой текстурой и долгим послевкусием." },
    { id: 9, name: "Session Pale",   type: "Сессионный IPA",        abv: 3.8,  ibu: 28, color: 16,  price: 330, notes: "Лайм · Персик · Мята",           desc: "Лёгкий и освежающий — идеален для долгих вечеров." },
];

const TESTIMONIALS = [
    { name: "Артём К.", role: "Бармен, «Пивная 12»", text: "Iron IPA уходит быстрее, чем я успеваю её заказать. Хмель — просто космос.", rating: 5 },
    { name: "Мария Л.", role: "Постоянный гость",     text: "Заказала подбор по слайдерам — попала в свой вкус с первого раза. Sour Cherry теперь мой фаворит.", rating: 5 },
    { name: "Дмитрий С.", role: "Пивной блогер",      text: "Imperial Stout — редкий случай, когда 11% не чувствуются вообще. Браво пивовару.", rating: 5 },
    { name: "Ольга В.", role: "Ресторатор",           text: "Взяли линейку на летнюю террасу. Pilsner No.1 и Session Pale разлетаются в ноль.", rating: 5 },
];

const MARQUEE = ["Pale Ale", "Stout", "Pilsner", "IPA", "Sour", "Porter", "Wheat", "Lager", "Saison", "Gose"];

const SRM_STOPS = [
    "#FFE699", "#FFCA5A", "#FBB123", "#F39C00", "#E58500", "#D77200",
    "#C55A00", "#B64A00", "#8A2A00", "#5A1300", "#240600", "#120200",
];

const hexToRgb = (h) => {
    const n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const toHex = (n) => n.toString(16).padStart(2, "0");

const beerColor = (v) => {
    const t = Math.max(0, Math.min(100, v)) / 100;
    const p = t * (SRM_STOPS.length - 1);
    const i = Math.min(SRM_STOPS.length - 2, Math.floor(p));
    const f = p - i;
    const a = hexToRgb(SRM_STOPS[i]);
    const b = hexToRgb(SRM_STOPS[i + 1]);
    const c = a.map((x, k) => Math.round(x + (b[k] - x) * f));
    return "#" + c.map(toHex).join("");
};

const colorName = (v) => {
    if (v < 12) return "Соломенный";
    if (v < 25) return "Золотистый";
    if (v < 40) return "Янтарный";
    if (v < 55) return "Медный";
    if (v < 70) return "Карамельный";
    if (v < 85) return "Тёмный шоколад";
    return "Обожжённый";
};

/* ==================================================================
   SVG-БОКАЛ (чистый SVG, стили — inline для динамического цвета)
   ================================================================== */

function BeerGlass({ color = "#F5B942", level = 0.8, className = "", bubbles = true }) {
    const rawId = useId();
    const uid = rawId.replace(/[:]/g, "");
    const liquidTop = 186 - (186 - 50) * level;

    const foam = [
        { x: 38, r: 8 }, { x: 50, r: 10.5 }, { x: 63, r: 9.5 }, { x: 76, r: 10 }, { x: 86, r: 7.5 },
    ];
    const bubblePos = [
        { x: 48, d: 0 }, { x: 58, d: .5 }, { x: 66, d: 1.1 }, { x: 52, d: 1.7 }, { x: 72, d: 2.2 },
    ];

    return (
        <svg
            viewBox="0 0 120 200"
            className={className}
            style={{ filter: `drop-shadow(0 0 42px ${color}66)` }}
        >
            <defs>
                <clipPath id={`clip-${uid}`}>
                    <path d="M33 44 L40 174 Q42 187 53 187 L67 187 Q78 187 80 174 L87 44 Z" />
                </clipPath>
                <linearGradient id={`liq-${uid}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.98" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.62" />
                </linearGradient>
                <linearGradient id={`glass-${uid}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.22" />
                    <stop offset="38%"  stopColor="#ffffff" stopOpacity="0.03" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.16" />
                </linearGradient>
            </defs>

            <path
                d="M30 40 L38 176 Q40 190 52 190 L68 190 Q80 190 82 176 L90 40 Z"
                fill={`url(#glass-${uid})`}
            />

            <g clipPath={`url(#clip-${uid})`}>
                <rect x="30" y={liquidTop} width="60" height={200 - liquidTop} fill={`url(#liq-${uid})`} />

                {bubbles &&
                    bubblePos.map((b, i) => (
                        <circle
                            key={i}
                            cx={b.x}
                            cy={182}
                            r={i % 2 ? 1.8 : 2.6}
                            fill="#ffffff"
                            opacity="0.5"
                            /* Та же анимация через Tailwind-классы */
                            className="animate-ping origin-center [transform-box:fill-box] [animation-duration:3s]"
                            style={{ animationDelay: `${b.d}s` }}
                        />
                    ))}
            </g>

            <g clipPath={`url(#clip-${uid})`}>
                <rect x="30" y={liquidTop - 3} width="60" height="11" fill="#FFF8E7" opacity="0.96" />
                {foam.map((f, i) => (
                    <circle key={i} cx={f.x} cy={liquidTop - 1} r={f.r} fill="#FFF8E7" opacity="0.96" />
                ))}
            </g>

            <path
                d="M30 40 L38 176 Q40 190 52 190 L68 190 Q80 190 82 176 L90 40"
                fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2" strokeLinejoin="round"
            />
            <path d="M37 52 L42 164" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
}

/* ==================================================================
   ХУК ДЛЯ SCROLL-СЛАЙДЕРА
   ================================================================== */

function useSnapSlider(count) {
    const ref = useRef(null);
    const [active, setActive] = useState(0);

    const go = (i) => {
        const el = ref.current;
        if (!el) return;
        const k = Math.max(0, Math.min(count - 1, i));
        const child = el.children[k];
        if (child) el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
    };

    const onScroll = () => {
        const el = ref.current;
        if (!el) return;
        let best = 0;
        let bestDist = Infinity;
        Array.from(el.children).forEach((c, i) => {
            const d = Math.abs(c.offsetLeft - el.scrollLeft);
            if (d < bestDist) {
                bestDist = d;
                best = i;
            }
        });
        setActive(best);
    };

    return { ref, active, go, onScroll };
}

/* ==================================================================
   СЛАЙДЕР-КОНТРОЛЬ — полностью Tailwind через arbitrary variants
   ================================================================== */

function RangeSlider({ label, value, min, max, step = 1, onChange, display, track, accent = "#F5A524" }) {
    const pct = ((value - min) / (max - min)) * 100;
    const background = track
        ? `linear-gradient(to right, ${track} ${pct}%, rgba(255,255,255,0.10) ${pct}%)`
        : `linear-gradient(to right, ${accent} ${pct}%, rgba(255,255,255,0.10) ${pct}%)`;

    const thumbBase =
        "appearance-none h-[26px] w-[26px] rounded-full border-[3px] border-[#0B0A08] " +
        "bg-[radial-gradient(circle_at_32%_30%,#FFF8E7,#F5A524_62%,#B45309)] " +
        "shadow-[0_0_0_3px_rgba(245,165,36,0.30),0_6px_16px_rgba(0,0,0,0.65)] " +
        "transition-transform duration-150 hover:scale-110";

    return (
        <div>
            <div className="mb-3 flex items-baseline justify-between">
                <span className="text-sm font-medium text-amber-100/60">{label}</span>
                <span className="font-black tracking-[0.05em] text-xl text-amber-300 uppercase">{display ?? value}</span>
            </div>

            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                style={{ background }}
                className={`
          w-full h-2.5 rounded-full appearance-none cursor-pointer outline-none
          focus-visible:shadow-[0_0_0_4px_rgba(245,165,36,0.25)]

          [&::-webkit-slider-thumb]:${thumbBase.split(" ").join(" [&::-webkit-slider-thumb]:")}
          [&::-moz-range-thumb]:appearance-none
          [&::-moz-range-thumb]:h-[22px] [&::-moz-range-thumb]:w-[22px]
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-[#0B0A08]
          [&::-moz-range-thumb]:bg-[radial-gradient(circle_at_32%_30%,#FFF8E7,#F5A524_62%,#B45309)]
          [&::-moz-range-thumb]:shadow-[0_0_0_3px_rgba(245,165,36,0.30)]
          [&::-moz-range-track]:bg-transparent
        `}
            />

            <div className="mt-1.5 flex justify-between text-[11px] text-amber-100/25">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );
}

/* ==================================================================
   НАВИГАЦИЯ
   ================================================================== */

function Nav() {
    const links = [
        ["Каталог", "catalog"],
        ["Подбор", "finder"],
        ["Лаборатория", "lab"],
        ["Отзывы", "reviews"],
    ];

    const scrollToId = (id) => (e) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0B0A08]/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
                <a href="#top" onClick={scrollToId("top")} className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-lg shadow-lg shadow-amber-600/30">
            🍺
          </span>
                    <span className="font-black uppercase tracking-[0.05em] text-2xl text-amber-50">
            HOP<span className="text-amber-500">&</span>HOP
          </span>
                </a>

                <nav className="hidden items-center gap-8 text-sm text-amber-100/55 md:flex">
                    {links.map(([t, id]) => (
                        <a key={t} href={`#${id}`} onClick={scrollToId(id)} className="transition hover:text-amber-300">
                            {t}
                        </a>
                    ))}
                </nav>

                <a
                    href="#catalog"
                    onClick={scrollToId("catalog")}
                    className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-semibold text-[#1a1208] shadow-lg shadow-amber-500/25 transition hover:shadow-amber-500/50 hover:brightness-110"
                >
                    В магазин
                </a>
            </div>
        </header>
    );
}

/* ==================================================================
   HERO
   ================================================================== */

function Hero() {
    const scrollToId = (id) => (e) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <section id="top" className="relative overflow-hidden">
            <div className="pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-amber-600/20 blur-[130px] animate-pulse [animation-duration:6s]" />
            <div className="pointer-events-none absolute -right-32 top-40 h-[420px] w-[420px] rounded-full bg-orange-700/20 blur-[130px]" />

            <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 md:grid-cols-2 md:py-28">
                <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-amber-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-amber-400" />
            </span>
            Крафт с 2014 года
          </span>

                    <h1 className="mt-6 font-black uppercase leading-[0.88] tracking-[0.02em] text-amber-50 text-[3.4rem] sm:text-7xl md:text-8xl">
                        ПИВО,
                        <br />
                        СВАРЕННОЕ
                        <br />
                        <span className="bg-gradient-to-r from-amber-300 via-amber-500 to-orange-600 bg-clip-text text-transparent">
              С ХАРАКТЕРОМ
            </span>
                    </h1>

                    <p className="mt-6 max-w-md text-[15px] leading-relaxed text-amber-100/45">
                        Девять сортов, сваренных малыми партиями. Никаких компромиссов —
                        только отборный хмель, честный солод и терпение.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <a
                            href="#catalog"
                            onClick={scrollToId("catalog")}
                            className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-7 py-3.5 text-sm font-semibold text-[#1a1208] shadow-xl shadow-amber-500/25 transition hover:-translate-y-0.5 hover:shadow-amber-500/50"
                        >
                            Выбрать пиво
                        </a>
                        <a
                            href="#finder"
                            onClick={scrollToId("finder")}
                            className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-amber-100/80 transition hover:border-amber-400/50 hover:text-amber-200"
                        >
                            Подобрать по вкусу
                        </a>
                    </div>

                    <div className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-7">
                        {[["9", "сортов"], ["11%", "макс. ABV"], ["12k+", "довольных"]].map(([v, l]) => (
                            <div key={l}>
                                <div className="font-black tracking-[0.02em] text-3xl text-amber-400">{v}</div>
                                <div className="text-xs uppercase tracking-wider text-amber-100/35">{l}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative flex justify-center">
                    <div className="absolute h-72 w-72 rounded-full bg-amber-500/30 blur-[90px] md:h-96 md:w-96 animate-pulse [animation-duration:6s]" />
                    <div className="absolute h-56 w-56 rounded-full border border-amber-400/15 md:h-80 md:w-80" />
                    <div className="absolute h-72 w-72 rounded-full border border-amber-400/10 md:h-[26rem] md:w-[26rem]" />
                    <BeerGlass
                        className="relative w-56 md:w-72 animate-bounce [animation-duration:4s]"
                        color="#F5A524"
                        level={0.82}
                    />
                </div>
            </div>
        </section>
    );
}

/* ==================================================================
   БЕГУЩАЯ СТРОКА (статическая + пульсирующие искры)
   ================================================================== */

function Marquee() {
    return (
        <div className="relative overflow-hidden border-y border-white/10 bg-amber-500/[0.03] py-4">
            <div className="flex items-center gap-10 px-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {MARQUEE.map((s, i) => (
                    <span
                        key={s}
                        className="flex shrink-0 items-center gap-10 whitespace-nowrap font-black uppercase text-2xl tracking-[0.05em] text-amber-100/25"
                    >
            {s}
                        <span className="text-amber-500/60 animate-pulse [animation-duration:2s]" style={{ animationDelay: `${i * 0.2}s` }}>
              ✦
            </span>
          </span>
                ))}
            </div>
        </div>
    );
}

/* ==================================================================
   КАРТОЧКА ПИВА
   ================================================================== */

function BeerCard({ beer }) {
    return (
        <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-6 transition duration-300 hover:border-amber-400/40 hover:shadow-[0_0_60px_-15px_rgba(245,165,36,0.5)]">
            <div
                className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-25 blur-3xl transition duration-500 group-hover:opacity-60"
                style={{ background: beerColor(beer.color) }}
            />

            <div className="flex items-start justify-between">
        <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-wider text-amber-100/50">
          {beer.type}
        </span>
                <span className="font-black tracking-[0.02em] text-lg text-amber-400">{beer.price} ₽</span>
            </div>

            <div className="my-4 flex justify-center">
                <BeerGlass
                    color={beerColor(beer.color)}
                    className="h-40 w-auto transition duration-500 group-hover:-translate-y-1.5 group-hover:scale-105"
                />
            </div>

            <h3 className="font-black uppercase tracking-[0.03em] text-2xl text-amber-50">{beer.name}</h3>
            <p className="mt-1 text-xs text-amber-300/60">{beer.notes}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-amber-100/40">{beer.desc}</p>

            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-center">
                {[["ABV", `${beer.abv}%`], ["IBU", beer.ibu], ["Цвет", beer.color]].map(([k, v]) => (
                    <div key={k}>
                        <div className="font-black tracking-[0.02em] text-base text-amber-200">{v}</div>
                        <div className="text-[10px] uppercase tracking-widest text-amber-100/30">{k}</div>
                    </div>
                ))}
            </div>
        </article>
    );
}

/* ==================================================================
   КАТАЛОГ / СЛАЙДЕР
   ================================================================== */

function Catalog() {
    const { ref, active, go, onScroll } = useSnapSlider(BEERS.length);

    return (
        <section id="catalog" className="relative mx-auto max-w-7xl px-5 py-20 md:py-28">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
                <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-500">Наша линейка</span>
                    <h2 className="mt-3 font-black uppercase tracking-[0.02em] text-5xl text-amber-50 md:text-6xl">
                        ВЫБЕРИ СВОЙ ХАРАКТЕР
                    </h2>
                </div>

                <div className="flex gap-2.5">
                    {[["←", -1], ["→", 1]].map(([icon, dir]) => (
                        <button
                            key={icon}
                            onClick={() => go(active + dir)}
                            className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-lg text-amber-200 transition hover:border-amber-400/60 hover:bg-amber-500/10 active:scale-95"
                            aria-label="Пролистать"
                        >
                            {icon}
                        </button>
                    ))}
                </div>
            </div>

            <div
                ref={ref}
                onScroll={onScroll}
                className="relative flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {BEERS.map((beer) => (
                    <div key={beer.id} className="w-[85%] shrink-0 snap-start sm:w-[47%] lg:w-[31%]">
                        <BeerCard beer={beer} />
                    </div>
                ))}
            </div>

            <div className="mt-6 flex justify-center gap-2">
                {BEERS.map((b, i) => (
                    <button
                        key={b.id}
                        onClick={() => go(i)}
                        aria-label={`Слайд ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                            active === i ? "w-8 bg-amber-400" : "w-1.5 bg-white/20 hover:bg-white/40"
                        }`}
                    />
                ))}
            </div>
        </section>
    );
}

/* ==================================================================
   ПОДБОР ПИВА ПО СЛАЙДЕРАМ
   ================================================================== */

function Finder() {
    const [abv, setAbv] = useState(6);
    const [ibu, setIbu] = useState(45);
    const [color, setColor] = useState(45);

    const ranked = useMemo(() => {
        return BEERS.map((b) => {
            const d = Math.sqrt(
                Math.pow((b.abv - abv) / 12, 2) +
                Math.pow((b.ibu - ibu) / 100, 2) +
                Math.pow((b.color - color) / 100, 2)
            );
            const score = Math.max(0, Math.round((1 - d / Math.sqrt(3)) * 100));
            return { ...b, score };
        }).sort((a, b) => b.score - a.score);
    }, [abv, ibu, color]);

    const reset = () => {
        setAbv(6);
        setIbu(45);
        setColor(45);
    };

    return (
        <section id="finder" className="relative overflow-hidden border-y border-white/5 bg-white/[0.015] py-20 md:py-28">
            <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[600px] -translate-x-1/2 rounded-full bg-amber-600/10 blur-[120px]" />

            <div className="relative mx-auto max-w-7xl px-5">
                <div className="mb-12 text-center">
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-500">Умный подбор</span>
                    <h2 className="mt-3 font-black uppercase tracking-[0.02em] text-5xl text-amber-50 md:text-6xl">
                        НАСТРОЙ СВОЙ ВКУС
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-sm text-amber-100/40">
                        Двигай ползунки — алгоритм подберёт сорта, максимально близкие к твоему профилю.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
                    <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-7">
                        <div className="space-y-8">
                            <RangeSlider
                                label="Крепость"
                                value={abv}
                                min={0}
                                max={12}
                                step={0.1}
                                onChange={setAbv}
                                display={`${abv.toFixed(1)}%`}
                            />
                            <RangeSlider
                                label="Горечь (IBU)"
                                value={ibu}
                                min={0}
                                max={100}
                                step={1}
                                onChange={setIbu}
                                display={ibu}
                                accent="#F97316"
                            />
                            <RangeSlider
                                label="Цвет"
                                value={color}
                                min={0}
                                max={100}
                                step={1}
                                onChange={setColor}
                                display={colorName(color)}
                                track="linear-gradient(to right, #FFE699, #FBB123, #C55A00, #5A1300, #120200)"
                            />
                        </div>

                        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                            <div className="flex items-center gap-3">
                                <div
                                    className="h-10 w-10 rounded-full border border-white/20 shadow-lg"
                                    style={{ background: beerColor(color) }}
                                />
                                <div>
                                    <div className="text-xs text-amber-100/40">Твой профиль</div>
                                    <div className="font-black tracking-[0.02em] text-lg text-amber-200">{colorName(color)}</div>
                                </div>
                            </div>
                            <button
                                onClick={reset}
                                className="rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-amber-100/60 transition hover:border-amber-400/50 hover:text-amber-200"
                            >
                                Сбросить
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100/35">
                            Лучшие совпадения
                        </div>

                        {ranked.slice(0, 4).map((b, i) => (
                            <div
                                key={b.id}
                                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-amber-400/30 hover:bg-white/[0.05]"
                            >
                                <div
                                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full font-black text-lg text-[#1a1208] shadow-lg"
                                    style={{ background: `linear-gradient(135deg, ${beerColor(b.color)}, ${beerColor(b.color)}99)` }}
                                >
                                    {i + 1}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-baseline justify-between gap-3">
                                        <p className="truncate font-semibold text-amber-50">{b.name}</p>
                                        <span className="font-black tracking-[0.02em] text-xl text-amber-400">{b.score}%</span>
                                    </div>
                                    <p className="truncate text-xs text-amber-100/40">
                                        {b.type} · {b.abv}% · IBU {b.ibu}
                                    </p>
                                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                                            style={{ width: `${b.score}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ==================================================================
   ЛАБОРАТОРИЯ ЦВЕТА
   ================================================================== */

function Lab() {
    const [value, setValue] = useState(42);
    const [level, setLevel] = useState(0.78);
    const color = beerColor(value);

    return (
        <section id="lab" className="mx-auto max-w-7xl px-5 py-20 md:py-28">
            <div className="mb-12 text-center">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-500">Лаборатория</span>
                <h2 className="mt-3 font-black uppercase tracking-[0.02em] text-5xl text-amber-50 md:text-6xl">
                    ЦВЕТ ПИВА
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-sm text-amber-100/40">
                    Покрути слайдер и посмотри, как меняется оттенок — от соломенного до обожжённого.
                </p>
            </div>

            <div className="grid items-center gap-10 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-8 md:grid-cols-2 md:p-12">
                <div className="flex justify-center">
                    <div className="relative">
                        <div
                            className="absolute inset-0 rounded-full blur-[90px] transition-colors duration-500"
                            style={{ background: color, opacity: 0.35 }}
                        />
                        <BeerGlass
                            color={color}
                            level={level}
                            className="relative w-52 transition duration-500 md:w-64"
                        />
                    </div>
                </div>

                <div>
                    <div className="mb-8 flex items-end gap-4">
                        <div
                            className="h-16 w-16 rounded-2xl border border-white/20 shadow-2xl transition-colors duration-300"
                            style={{ background: color }}
                        />
                        <div>
                            <div className="font-black uppercase tracking-[0.02em] text-4xl leading-none text-amber-50">
                                {colorName(value)}
                            </div>
                            <div className="mt-1 text-sm text-amber-100/40">
                                SRM ≈ {Math.round(value * 0.4)} · {color.toUpperCase()}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <RangeSlider
                            label="Оттенок"
                            value={value}
                            min={0}
                            max={100}
                            onChange={setValue}
                            display={value}
                            track="linear-gradient(to right, #FFE699, #FBB123, #C55A00, #5A1300, #120200)"
                        />
                        <RangeSlider
                            label="Уровень в бокале"
                            value={Math.round(level * 100)}
                            min={20}
                            max={100}
                            onChange={(v) => setLevel(v / 100)}
                            display={`${Math.round(level * 100)}%`}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ==================================================================
   ОТЗЫВЫ
   ================================================================== */

function Reviews() {
    const { ref, active, go, onScroll } = useSnapSlider(TESTIMONIALS.length);

    return (
        <section id="reviews" className="border-y border-white/5 bg-white/[0.015] py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-5">
                <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-500">Отзывы</span>
                        <h2 className="mt-3 font-black uppercase tracking-[0.02em] text-5xl text-amber-50 md:text-6xl">
                            ГОВОРЯТ О НАС
                        </h2>
                    </div>
                    <div className="flex gap-2.5">
                        {[["←", -1], ["→", 1]].map(([icon, dir]) => (
                            <button
                                key={icon}
                                onClick={() => go(active + dir)}
                                className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-lg text-amber-200 transition hover:border-amber-400/60 hover:bg-amber-500/10 active:scale-95"
                                aria-label="Пролистать"
                            >
                                {icon}
                            </button>
                        ))}
                    </div>
                </div>

                <div
                    ref={ref}
                    onScroll={onScroll}
                    className="relative flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {TESTIMONIALS.map((t) => (
                        <div
                            key={t.name}
                            className="w-[85%] shrink-0 snap-start rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-7 sm:w-[47%] lg:w-[32%]"
                        >
                            <div className="mb-4 text-amber-400">
                                {"★".repeat(t.rating)}
                                <span className="text-white/15">{"★".repeat(5 - t.rating)}</span>
                            </div>
                            <p className="text-[15px] leading-relaxed text-amber-100/70">«{t.text}»</p>
                            <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 font-black text-base text-[#1a1208]">
                                    {t.name[0]}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-amber-50">{t.name}</div>
                                    <div className="text-xs text-amber-100/35">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-center gap-2">
                    {TESTIMONIALS.map((t, i) => (
                        <button
                            key={t.name}
                            onClick={() => go(i)}
                            aria-label={`Отзыв ${i + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                active === i ? "w-8 bg-amber-400" : "w-1.5 bg-white/20 hover:bg-white/40"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ==================================================================
   CTA + FOOTER
   ================================================================== */

function Footer() {
    const scrollToId = (id) => (e) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <>
            <section className="relative overflow-hidden px-5 py-20 md:py-28">
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/15 blur-[130px]" />
                <div className="relative mx-auto max-w-3xl text-center">
                    <h2 className="font-black uppercase leading-[0.95] tracking-[0.02em] text-5xl text-amber-50 md:text-7xl">
                        ГОТОВ ПОПРОБОВАТЬ?
                    </h2>
                    <p className="mx-auto mt-5 max-w-md text-sm text-amber-100/40">
                        Доставка по городу за 2 часа. Первый заказ — со скидкой 15%.
                    </p>
                    <div className="mt-9 flex flex-wrap justify-center gap-3">
                        <a
                            href="#catalog"
                            onClick={scrollToId("catalog")}
                            className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-4 text-sm font-semibold text-[#1a1208] shadow-xl shadow-amber-500/25 transition hover:-translate-y-0.5 hover:shadow-amber-500/50"
                        >
                            Заказать сейчас
                        </a>
                        <a
                            href="#finder"
                            onClick={scrollToId("finder")}
                            className="rounded-full border border-white/15 px-8 py-4 text-sm font-semibold text-amber-100/80 transition hover:border-amber-400/50 hover:text-amber-200"
                        >
                            Помогите выбрать
                        </a>
                    </div>
                </div>
            </section>

            <footer className="border-t border-white/10 px-5 py-10">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-sm text-amber-100/35 md:flex-row">
                    <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 text-sm">
              🍺
            </span>
                        <span className="font-black uppercase tracking-[0.05em] text-xl text-amber-50">
              HOP<span className="text-amber-500">&</span>HOP
            </span>
                    </div>
                    <p>© {new Date().getFullYear()} Hop &amp; Hop Brewery. Пейте ответственно. 18+</p>
                    <div className="flex gap-6">
                        {["Telegram", "Instagram", "VK"].map((s) => (
                            <a key={s} href="#top" onClick={scrollToId("top")} className="transition hover:text-amber-300">
                                {s}
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </>
    );
}

/* ==================================================================
   APP
   ================================================================== */

export default function App() {
    return (
        <div className="min-h-screen bg-[#0B0A08] font-sans text-amber-50 antialiased selection:bg-amber-500/30 selection:text-amber-100">
            <Nav />
            <main>
                <Hero />
                <Marquee />
                <Catalog />
                <Finder />
                <Lab />
                <Reviews />
                <Footer />
            </main>
        </div>
    );
}