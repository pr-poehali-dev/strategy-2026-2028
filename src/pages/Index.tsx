import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const useInView = (threshold = 0.2) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
};

const AnimCounter = ({ target, suffix = "", duration = 1800 }: { target: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView(0.3);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
};

export default function Index() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = ["Ситуация", "Стратегия", "KPI"];

  const scrollToSlide = (i: number) => {
    document.getElementById(`slide-${i}`)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    slides.forEach((_, i) => {
      const el = document.getElementById(`slide-${i}`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSlide(i); },
        { threshold: 0.5 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <div className="font-montserrat bg-[#141414] text-white overflow-x-hidden">

      {/* Nav dots */}
      <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {slides.map((label, i) => (
          <button
            key={i}
            onClick={() => scrollToSlide(i)}
            className="group flex items-center gap-3 justify-end"
          >
            <span className={`text-xs font-semibold tracking-widest uppercase transition-all duration-300 ${activeSlide === i ? "opacity-100 text-red-400" : "opacity-0 group-hover:opacity-60 text-white"}`}>
              {label}
            </span>
            <span className={`block rounded-full transition-all duration-300 ${activeSlide === i ? "w-4 h-4 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]" : "w-2 h-2 bg-white/40 group-hover:bg-white/70"}`} />
          </button>
        ))}
      </nav>

      <SlideOne id="slide-0" />
      <SlideTwo id="slide-1" />
      <SlideThree id="slide-2" />
    </div>
  );
}

function SlideOne({ id }: { id: string }) {
  const { ref, inView } = useInView(0.1);
  return (
    <section id={id} className="relative min-h-screen flex flex-col justify-center overflow-hidden px-8 md:px-20 py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-[#141414] via-[#1c1c1c] to-[#141414]" />
      <div className="absolute top-0 left-0 w-[700px] h-[700px] rounded-full bg-red-700/10 blur-[140px] -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-red-900/10 blur-[120px] translate-x-1/4 translate-y-1/4" />
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
        backgroundSize: "80px 80px"
      }} />

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto w-full">
        <div className={`transition-all duration-700 ${inView ? "animate-fade-up opacity-100" : "opacity-0"}`} style={{ animationDelay: "0.1s" }}>
          <span className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-red-400 font-semibold mb-6 border border-red-500/30 rounded-full px-4 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Слайд 01 / Анализ
          </span>
        </div>

        <h1 className={`text-5xl md:text-7xl font-black leading-none mb-4 transition-all duration-700 ${inView ? "animate-fade-up opacity-100" : "opacity-0"}`} style={{ animationDelay: "0.2s" }}>
          ТЕКУЩАЯ
          <br />
          <span className="bg-gradient-to-r from-red-500 via-red-400 to-rose-400 bg-clip-text text-transparent">
            СИТУАЦИЯ
          </span>
        </h1>

        <div className={`w-24 h-1 bg-gradient-to-r from-red-600 to-rose-500 rounded-full mb-12 transition-all duration-700 ${inView ? "animate-fade-up opacity-100" : "opacity-0"}`} style={{ animationDelay: "0.3s" }} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: "Store", label: "Форматы магазинов", value: "Супермаркеты + Гипермаркеты", sub: "Требует трансформации", color: "from-red-600 to-rose-500" },
            { icon: "Tag", label: "СТМ-бренды сейчас", value: "17 брендов", sub: "Доля в продажах 19%", color: "from-red-700 to-red-500" },
            { icon: "ShoppingCart", label: "E-commerce", value: "Стартовая позиция", sub: "Быстрая доставка, B2B, Dark store", color: "from-rose-600 to-red-500" },
          ].map((card, i) => (
            <div
              key={i}
              className={`relative group rounded-2xl border border-white/8 bg-[#1e1e1e] p-6 hover:border-red-500/30 transition-all duration-500 ${inView ? "animate-slide-left opacity-100" : "opacity-0"}`}
              style={{ animationDelay: `${0.4 + i * 0.15}s` }}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4`}>
                <Icon name={card.icon} size={18} className="text-white" />
              </div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">{card.label}</p>
              <p className="text-xl font-bold text-white mb-1">{card.value}</p>
              <p className="text-sm text-white/50">{card.sub}</p>
              <div className="absolute inset-0 rounded-2xl bg-red-600/0 group-hover:bg-red-600/5 transition-all duration-300" />
            </div>
          ))}
        </div>

        <div className={`rounded-2xl border border-red-500/20 bg-red-500/5 p-6 transition-all duration-700 ${inView ? "animate-fade-up opacity-100" : "opacity-0"}`} style={{ animationDelay: "0.85s" }}>
          <p className="text-white/70 font-ibm text-lg leading-relaxed">
            Сеть работает в двух форматах — <span className="text-white font-semibold">супермаркеты</span> и <span className="text-white font-semibold">гипермаркеты</span>.
            Собственная торговая марка занимает <span className="text-red-400 font-bold">19% продаж</span> при 17 брендах.
            E-commerce находится в начальной стадии. Период 2026–2028 — время агрессивного роста и трансформации.
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="text-xs tracking-widest uppercase">Далее</span>
        <Icon name="ChevronDown" size={16} className="animate-bounce" />
      </div>
    </section>
  );
}

function SlideTwo({ id }: { id: string }) {
  const { ref, inView } = useInView(0.05);

  const pillars = [
    {
      letter: "А",
      title: "Новые точки продаж",
      subtitle: "Агрессивное расширение",
      color: "from-red-600 to-rose-500",
      border: "border-red-500/25",
      bg: "bg-[#1e1e1e]",
      icon: "TrendingUp",
      items: [
        "Открытие новых супермаркетов",
        "Приоритетный формат для роста",
        "Ускоренное масштабирование сети",
      ]
    },
    {
      letter: "Б",
      title: "Трансформация гипермаркетов",
      subtitle: "Перезапуск формата",
      color: "from-red-700 to-red-500",
      border: "border-red-500/25",
      bg: "bg-[#1e1e1e]",
      icon: "RefreshCw",
      items: [
        "Shop-in-shop: рамёная, кулинария/кафе, пельмени",
        "В собственности: сокращение площадей + развитие арендных площадок",
        "В аренде: переговоры по условиям или выход из контракта",
      ]
    },
    {
      letter: "В",
      title: "Ассортиментная политика",
      subtitle: "СТМ + рентабельность",
      color: "from-rose-600 to-red-500",
      border: "border-red-500/25",
      bg: "bg-[#1e1e1e]",
      icon: "BarChart3",
      items: [
        "СТМ: рост с 17 → 30 брендов",
        "Доля СТМ в продажах: 19% → 30%",
        "Широкий ассортимент с упором на рентабельных поставщиков",
      ]
    },
    {
      letter: "Г",
      title: "E-Commerce",
      subtitle: "Цифровой прорыв",
      color: "from-red-500 to-rose-400",
      border: "border-red-500/25",
      bg: "bg-[#1e1e1e]",
      icon: "Zap",
      items: [
        "Быстрая доставка + Витрина для поставщиков",
        "B2B: ускоренное развитие",
        "Dark store в центре Москвы",
        "Dark store внутри гипермаркета (в собственности)",
      ]
    },
  ];

  return (
    <section id={id} className="relative min-h-screen flex flex-col justify-center overflow-hidden px-8 md:px-20 py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-[#141414] via-[#191919] to-[#141414]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-red-800/8 blur-[180px]" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-red-600/6 blur-[120px]" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto w-full">
        <div className={`${inView ? "animate-fade-up opacity-100" : "opacity-0"}`}>
          <span className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-red-400 font-semibold mb-6 border border-red-500/30 rounded-full px-4 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Слайд 02 / Стратегия
          </span>
        </div>

        <h2 className={`text-5xl md:text-7xl font-black leading-none mb-4 ${inView ? "animate-fade-up opacity-100" : "opacity-0"}`} style={{ animationDelay: "0.15s" }}>
          СТРАТЕГИЯ
          <br />
          <span className="bg-gradient-to-r from-red-500 via-rose-400 to-red-600 bg-clip-text text-transparent">
            2026 — 2028
          </span>
        </h2>

        <div className={`w-24 h-1 bg-gradient-to-r from-red-600 to-rose-500 rounded-full mb-10 ${inView ? "animate-fade-up opacity-100" : "opacity-0"}`} style={{ animationDelay: "0.25s" }} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pillars.map((p, i) => (
            <div
              key={i}
              className={`group relative rounded-2xl border ${p.border} ${p.bg} p-6 hover:scale-[1.02] hover:border-red-500/50 transition-all duration-500 ${inView ? "animate-fade-up opacity-100" : "opacity-0"}`}
              style={{ animationDelay: `${0.35 + i * 0.12}s` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center flex-shrink-0 font-black text-white text-lg`}>
                  {p.letter}
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest">{p.subtitle}</p>
                  <h3 className="text-lg font-bold text-white">{p.title}</h3>
                </div>
                <div className="ml-auto">
                  <Icon name={p.icon} size={20} className="text-white/20 group-hover:text-red-400/60 transition-colors duration-300" />
                </div>
              </div>
              <ul className="space-y-2">
                {p.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-white/60 font-ibm">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SlideThree({ id }: { id: string }) {
  const { ref, inView } = useInView(0.1);

  const kpis = [
    { icon: "Award", label: "СТМ-бренды", target: 25, suffix: "", unit: "брендов", sub: "было 17", color: "from-red-600 to-rose-500" },
    { icon: "Percent", label: "Доля СТМ", target: 25, suffix: "%", unit: "", sub: "было 19%", color: "from-red-700 to-red-500" },
    { icon: "Globe", label: "Online-продажи", target: 15, suffix: "%", unit: "", sub: "из них B2B — 3%", color: "from-rose-600 to-red-500" },
    { icon: "TrendingUp", label: "EBITDA", target: 10, suffix: "", unit: "млрд ₽", sub: "ключевой финансовый показатель", color: "from-red-500 to-rose-400" },
  ];

  return (
    <section id={id} className="relative min-h-screen flex flex-col justify-center overflow-hidden px-8 md:px-20 py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-[#141414] via-[#1a1414] to-[#141414]" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-red-800/10 blur-[150px] -translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-red-700/8 blur-[130px]" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="text-[20vw] font-black text-white/[0.02] select-none">KPI</span>
      </div>

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto w-full">
        <div className={`${inView ? "animate-fade-up opacity-100" : "opacity-0"}`}>
          <span className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-red-400 font-semibold mb-6 border border-red-500/30 rounded-full px-4 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Слайд 03 / Цели
          </span>
        </div>

        <h2 className={`text-5xl md:text-7xl font-black leading-none mb-4 ${inView ? "animate-fade-up opacity-100" : "opacity-0"}`} style={{ animationDelay: "0.15s" }}>
          ЦЕЛИ
          <br />
          <span className="bg-gradient-to-r from-red-500 via-rose-400 to-red-600 bg-clip-text text-transparent">
            И МЕТРИКИ
          </span>
        </h2>

        <div className={`w-24 h-1 bg-gradient-to-r from-red-600 to-rose-500 rounded-full mb-12 ${inView ? "animate-fade-up opacity-100" : "opacity-0"}`} style={{ animationDelay: "0.25s" }} />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          {kpis.map((kpi, i) => (
            <div
              key={i}
              className={`group relative rounded-2xl border border-white/8 bg-[#1e1e1e] p-6 text-center hover:border-red-500/40 hover:scale-105 transition-all duration-500 ${inView ? "animate-counter-up opacity-100" : "opacity-0"}`}
              style={{ animationDelay: `${0.35 + i * 0.12}s` }}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center mx-auto mb-4`}>
                <Icon name={kpi.icon} size={18} className="text-white" />
              </div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-2">{kpi.label}</p>
              <div className={`text-4xl md:text-5xl font-black bg-gradient-to-br ${kpi.color} bg-clip-text text-transparent mb-1`}>
                <AnimCounter target={kpi.target} suffix={kpi.suffix} />
                {kpi.unit && <span className="text-2xl ml-1">{kpi.unit}</span>}
              </div>
              <p className="text-xs text-white/30 mt-2">{kpi.sub}</p>
            </div>
          ))}
        </div>

        <div className={`relative rounded-2xl overflow-hidden ${inView ? "animate-fade-up opacity-100" : "opacity-0"}`} style={{ animationDelay: "0.8s" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 via-[#2a1515]/60 to-red-900/30" />
          <div className="absolute inset-0 border border-red-500/15 rounded-2xl" />
          <div className="relative p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-white/50 text-sm uppercase tracking-widest mb-1 font-ibm">Горизонт планирования</p>
              <p className="text-2xl md:text-3xl font-black text-white">2026 — 2028</p>
            </div>
            <div className="hidden md:block w-px h-16 bg-white/10" />
            <div className="text-center md:text-left">
              <p className="text-white/50 text-sm uppercase tracking-widest mb-1 font-ibm">Ключевой вектор</p>
              <p className="text-xl font-bold bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">Расширение + Трансформация</p>
            </div>
            <div className="hidden md:block w-px h-16 bg-white/10" />
            <div className="text-center md:text-left">
              <p className="text-white/50 text-sm uppercase tracking-widest mb-1 font-ibm">Инструменты роста</p>
              <p className="text-xl font-bold bg-gradient-to-r from-rose-400 to-red-500 bg-clip-text text-transparent">СТМ + E-com + Форматы</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
