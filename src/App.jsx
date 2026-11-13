import { useState } from "react";

const BEERS = [
    { name: "Golden Hour",  type: "Pale Ale",    abv: 5.4, ibu: 38, color: "#F5A524", notes: "Цитрус · Сосна" },
    { name: "Night Porter", type: "Porter",      abv: 8.2, ibu: 32, color: "#5A1300", notes: "Кофе · Шоколад" },
    { name: "Wheat Cloud",  type: "Hefeweizen",  abv: 5.0, ibu: 14, color: "#FBB123", notes: "Банан · Гвоздика" },
    { name: "Iron IPA",     type: "Double IPA",  abv: 9.1, ibu: 82, color: "#D77200", notes: "Манго · Грейпфрут" },
    { name: "Sour Cherry",  type: "Sour",        abv: 4.3, ibu: 8,  color: "#B64A00", notes: "Вишня · Кислота" },
    { name: "Imperial Stout", type: "Stout",     abv: 11,  ibu: 60, color: "#120200", notes: "Ваниль · Кофе" },
];

const RANGES = [
    { key: "abv",   label: "Крепость", min: 0, max: 12,  step: 0.1, track: "#F5A524" },
    { key: "ibu",   label: "Горечь",   min: 0, max: 100, step: 1,   track: "#F97316" },
    { key: "color", label: "Цвет",     min: 0, max: 100, step: 1,   track: "#5A1300" },
];

function Slider({ label, value, min, max, step, onChange, track }) {
    const pct = ((value - min) / (max - min)) * 100;
    const bg = `linear-gradient(to right, ${track} ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;

    return (
        <div>
            <div className="mb-2 flex justify-between text-sm">
                <span className="text-amber-100/60">{label}</span>
                <span className="font-bold text-amber-300">{value}</span>
            </div>
            <input
                type="range"
                min={min} max={max} step={step} value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                style={{ background: bg }}
                className="h-2 w-full cursor-pointer appearance-none rounded-full outline-none
          [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black
          [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:shadow-lg
          [&::-webkit-slider-thumb]:transition [&::-webkit-slider-thumb]:hover:scale-125"
            />
        </div>
    );
}

function Glass({ color, className = "" }) {
    return (
        <svg viewBox="0 0 100 160" className={className}>
            <path d="M20 20 L27 140 Q28 150 38 150 H62 Q72 150 73 140 L80 20 Z" fill="#ffffff10" stroke="#ffffff30" strokeWidth="1.5"/>
            <path d="M24 60 L29 138 Q30 146 38 146 H62 Q70 146 71 138 L76 60 Z" fill={color} opacity="0.9"/>
            <ellipse cx="50" cy="60" rx="26" ry="5" fill="#FFF8E7" opacity="0.95"/>
            <circle cx="38" cy="57" r="5" fill="#FFF8E7" opacity="0.95"/>
            <circle cx="52" cy="56" r="6" fill="#FFF8E7" opacity="0.95"/>
            <circle cx="64" cy="57" r="5" fill="#FFF8E7" opacity="0.95"/>
        </svg>
    );
}

export default function App() {
    const [profile, setProfile] = useState({ abv: 6, ibu: 45, color: 50 });

    const set = (key) => (v) => setProfile((p) => ({ ...p, [key]: v }));

    const ranked = [...BEERS]
        .map((b) => {
            const d = Math.sqrt(
                ((b.abv - profile.abv) / 12) ** 2 +
                ((b.ibu - profile.ibu) / 100) ** 2 +
                ((parseInt(b.color.slice(1, 3), 16) / 2.55 - profile.color) / 100) ** 2
            );
            return { ...b, score: Math.max(0, Math.round((1 - d / Math.sqrt(3)) * 100)) };
        })
        .sort((a, b) => b.score - a.score);

    return (
        <div className="min-h-screen bg-[#0B0A08] text-amber-50 antialiased">
            <header className="border-b border-white/10 px-6 py-4">
                <div className="mx-auto flex max-w-6xl items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-lg">🍺</span>
                        <span className="text-xl font-black uppercase tracking-widest text-amber-50">
              Hop<span className="text-amber-500">&</span>Hop
            </span>
                    </div>
                    <span className="text-sm text-amber-100/50">18+</span>
                </div>
            </header>

            <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2">
                <div>
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs uppercase tracking-widest text-amber-300">
            Крафт с 2014
          </span>
                    <h1 className="mt-5 text-6xl font-black uppercase leading-none text-amber-50 md:text-7xl">
                        Пиво с{" "}
                        <span className="bg-gradient-to-r from-amber-300 to-orange-600 bg-clip-text text-transparent">
              характером
            </span>
                    </h1>
                    <p className="mt-5 max-w-md text-amber-100/50">
                        Малые партии. Отборный хмель. Никаких компромиссов. Подберите вкус прямо здесь — ползунками.
                    </p>
                </div>
                <div className="flex justify-center">
                    <Glass color="#F5A524" className="w-56 animate-bounce [animation-duration:3s]" />
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 py-10">
                <h2 className="mb-8 text-4xl font-black uppercase tracking-wide">Выбери свой вкус</h2>
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6">
                        {RANGES.map((r) => (
                            <Slider key={r.key} {...r} value={profile[r.key]} onChange={set(r.key)} />
                        ))}
                        <div className="border-t border-white/10 pt-4 text-xs text-amber-100/40">
                            Профиль: {profile.abv}% · IBU {profile.ibu} · цвет {profile.color}
                        </div>
                    </div>

                    <div className="space-y-3">
                        {ranked.slice(0, 4).map((b, i) => (
                            <div key={b.name} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-amber-400/40">
                                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-black text-black" style={{ background: b.color }}>
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between">
                                        <p className="truncate font-semibold">{b.name}</p>
                                        <span className="font-bold text-amber-400">{b.score}%</span>
                                    </div>
                                    <p className="truncate text-xs text-amber-100/40">
                                        {b.type} · {b.abv}% · {b.notes}
                                    </p>
                                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                                        <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-600 transition-all" style={{ width: `${b.score}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 py-10">
                <h2 className="mb-8 text-4xl font-black uppercase tracking-wide">Вся линейка</h2>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {BEERS.map((b) => (
                        <div key={b.name} className="group rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-5 transition hover:border-amber-400/40">
                            <div className="flex justify-between text-xs uppercase tracking-wider text-amber-100/50">
                                <span>{b.type}</span>
                                <span className="text-amber-400">IBU {b.ibu}</span>
                            </div>
                            <Glass color={b.color} className="mx-auto my-3 w-20 transition group-hover:-translate-y-1" />
                            <h3 className="text-xl font-black uppercase">{b.name}</h3>
                            <p className="mt-1 text-xs text-amber-300/60">{b.notes}</p>
                            <div className="mt-3 flex justify-between border-t border-white/10 pt-3 text-sm">
                                <span className="text-amber-200">{b.abv}% ABV</span>
                                <span className="font-bold text-amber-400">от 340 ₽</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-amber-100/40">
                © 2026 Hop & Hop Brewery · Пейте ответственно · 18+
            </footer>
        </div>
    );
}