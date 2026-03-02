"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ArrowRight,
  ArrowDown,
  Check,
  Star,
  Smile,
  Meh,
  Frown,
  Route,
  QrCode,
  LayoutDashboard,
  Paintbrush,
  Lock,
  ExternalLink,
  Shield,
  ShieldAlert,
  TrendingUp,
  UtensilsCrossed,
  Pizza,
  Coffee,
  Hotel,
} from "lucide-react";

/* ─── Animation helpers ─── */

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ─── Data ─── */

const features = [
  {
    title: "Routing intelligente",
    description:
      "I clienti felici vengono guidati verso Google, TripAdvisor e altre piattaforme. I feedback negativi restano solo a te.",
    icon: Route,
  },
  {
    title: "QR code per tavolo",
    description:
      "Un QR code dedicato per ogni tavolo, così sai esattamente da dove arriva ogni feedback.",
    icon: QrCode,
  },
  {
    title: "Dashboard analytics",
    description:
      "Visualizza punteggi, trend e sentiment in un\u2019unica dashboard chiara e intuitiva.",
    icon: LayoutDashboard,
  },
  {
    title: "Personalizzazione completa",
    description:
      "Scegli le domande, il tipo di risposta e il flusso che meglio si adatta al tuo locale.",
    icon: Paintbrush,
  },
];

const pricingFeatures = [
  "Moduli di feedback illimitati",
  "QR code per ogni tavolo",
  "Dashboard analytics completa",
  "Routing intelligente alle recensioni",
  "Personalizzazione completa",
  "Supporto prioritario",
];

const reviewPlatforms = [
  { name: "Google", stars: 5 },
  { name: "TripAdvisor", stars: 5 },
  { name: "TheFork", stars: 5 },
  { name: "Trustpilot", stars: 5 },
];

const qrPattern = [
  [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1],
  [1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
  [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1],
];

/* ─── Animated illustrations ─── */

function AnimatedStars() {
  const cycleDuration = 8;

  return (
    <div className="relative mb-8 inline-flex items-center gap-1.5 py-4 px-4 sm:gap-2.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1.15, 1, 0],
            rotate: [-180, 0, 0, -180],
          }}
          transition={{
            duration: cycleDuration,
            times: [0, 0.12, 0.92, 1],
            delay: i * 0.08,
            repeat: Infinity,
            repeatDelay: 0,
            ease: "easeInOut",
          }}
        >
          <Star className="size-8 fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.3)] sm:size-10" />
        </motion.div>
      ))}
      {/* Shimmer sweep — plays each cycle */}
      <motion.div
        className="pointer-events-none absolute inset-y-0 w-[40%] bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[2px]"
        animate={{ x: ["-100%", "350%"] }}
        transition={{
          duration: 0.7,
          delay: 1.0,
          repeat: Infinity,
          repeatDelay: cycleDuration - 0.7,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

function FormIllustration() {
  return (
    <motion.div
      className="mx-auto w-full max-w-sm rounded-2xl border bg-card p-6 shadow-xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={stagger}
    >
      {/* Window chrome */}
      <motion.div variants={fadeUp} className="mb-5 flex gap-1.5">
        <div className="size-2.5 rounded-full bg-red-400/80" />
        <div className="size-2.5 rounded-full bg-amber-400/80" />
        <div className="size-2.5 rounded-full bg-green-400/80" />
      </motion.div>

      {/* Sentiment question */}
      <motion.div variants={fadeUp} className="mb-5">
        <div className="mb-3 h-3 w-3/4 rounded-full bg-muted" />
        <div className="flex gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl border-2 border-green-200 bg-green-50">
            <Smile className="size-5 text-green-600" />
          </div>
          <div className="flex size-11 items-center justify-center rounded-xl border-2 border-amber-200 bg-amber-50">
            <Meh className="size-5 text-amber-600" />
          </div>
          <div className="flex size-11 items-center justify-center rounded-xl border-2 border-red-200 bg-red-50">
            <Frown className="size-5 text-red-600" />
          </div>
        </div>
      </motion.div>

      {/* Star rating */}
      <motion.div variants={fadeUp} className="mb-5">
        <div className="mb-3 h-3 w-1/2 rounded-full bg-muted" />
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star
              key={i}
              className="size-5 fill-amber-400 text-amber-400"
            />
          ))}
        </div>
      </motion.div>

      {/* Text input */}
      <motion.div variants={fadeUp} className="mb-5">
        <div className="mb-3 h-3 w-2/3 rounded-full bg-muted" />
        <div className="h-16 rounded-lg border border-dashed bg-muted/30" />
      </motion.div>

      {/* Submit button */}
      <motion.div variants={fadeUp}>
        <div className="h-10 rounded-lg bg-primary" />
      </motion.div>
    </motion.div>
  );
}

function QRIllustration() {
  const cols = 11;
  return (
    <motion.div
      className="mx-auto flex flex-col items-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={stagger}
    >
      <motion.div
        className="rounded-2xl border bg-card p-6 shadow-xl"
        variants={fadeUp}
      >
        <div className="grid grid-cols-11 gap-[3px]">
          {qrPattern.flat().map((cell, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;
            return (
              <motion.div
                key={i}
                className={`size-4 rounded-[2px] sm:size-5 ${
                  cell ? "bg-foreground" : "bg-transparent"
                }`}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{
                  opacity: cell ? 1 : 0,
                  scale: 1,
                }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.3 + (row + col) * 0.03,
                  duration: 0.2,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              />
            );
          })}
        </div>
      </motion.div>
      <motion.div variants={fadeUp} className="mt-4 flex items-center gap-2">
        <div className="size-2 rounded-full bg-green-500" />
        <span className="text-sm font-medium text-muted-foreground">
          Tavolo 5
        </span>
      </motion.div>
    </motion.div>
  );
}

function DashboardIllustration() {
  const bars = [55, 80, 45, 92, 65, 78, 88];

  return (
    <motion.div
      className="mx-auto w-full max-w-sm rounded-2xl border bg-card p-6 shadow-xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={stagger}
    >
      {/* Header */}
      <motion.div
        variants={fadeUp}
        className="mb-6 flex items-center justify-between"
      >
        <div className="h-4 w-20 rounded-full bg-muted" />
        <div className="flex items-center gap-1">
          <span className="text-xl font-bold">4.8</span>
          <Star className="size-4 fill-amber-400 text-amber-400" />
        </div>
      </motion.div>

      {/* Bar chart */}
      <motion.div
        variants={fadeUp}
        className="mb-6 flex h-28 items-end gap-1.5"
      >
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 origin-bottom rounded-t bg-primary/80"
            style={{ height: `${h}%` }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.8 + i * 0.08,
              duration: 0.5,
              ease: "easeOut",
            }}
          />
        ))}
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-2">
        {[
          { value: "127", label: "Feedback" },
          { value: "4.8", label: "Media" },
          { value: "92%", label: "Positivi" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg bg-muted/50 p-2.5 text-center"
          >
            <div className="text-lg font-bold">{stat.value}</div>
            <div className="text-[11px] text-muted-foreground">
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ─── Page ─── */

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center">
            <Image src="/logo-5stelle.svg" alt="5stelle" width={130} height={38} priority />
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Accedi</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Inizia gratis</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.04)_1px,_transparent_0)] bg-[size:32px_32px]" />
        <motion.div
          className="relative mx-auto max-w-6xl px-6 py-24 text-center sm:py-32"
          {...fadeIn}
        >
          <AnimatedStars />
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent">
              Trasforma i feedback in recensioni a 5 stelle
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Raccogli le opinioni dei tuoi clienti con un QR code. I clienti
            soddisfatti lasciano recensioni pubbliche, i feedback negativi
            restano privati.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4">
            <Button
              size="lg"
              asChild
              className="text-base shadow-lg shadow-primary/20"
            >
              <Link href="/signup">
                Prova gratis per 7 giorni
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Nessuna carta di credito richiesta
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── Pain Point → Solution ── */}
      <section className="border-t py-24">
        <motion.div
          className="mx-auto max-w-6xl px-6 text-center"
          {...fadeIn}
        >
          <span className="mb-4 inline-block rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-sm font-semibold text-red-800">
            Il problema
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Recensioni perse ogni giorno
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            I clienti soddisfatti se ne vanno in silenzio. Quelli insoddisfatti
            corrono a scrivere recensioni negative. La tua reputazione online
            non riflette la qualità reale del tuo locale.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-16 max-w-5xl px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: ShieldAlert,
                title: "Intercetta il negativo",
                description:
                  "Le critiche restano private, solo per te. Nessuna recensione negativa pubblica, solo opportunità per migliorare.",
                color: "text-red-500",
                bg: "bg-red-500/10",
                border: "border-red-200",
              },
              {
                icon: Star,
                title: "Guida il positivo",
                description:
                  "Chi è felice viene indirizzato a lasciare una recensione su Google, TripAdvisor e le piattaforme che contano.",
                color: "text-amber-500",
                bg: "bg-amber-500/10",
                border: "border-amber-200",
              },
              {
                icon: TrendingUp,
                title: "Cresci online",
                description:
                  "Più recensioni positive, meno negative pubbliche. Il tuo punteggio online cresce in modo naturale e costante.",
                color: "text-green-500",
                bg: "bg-green-500/10",
                border: "border-green-200",
              },
            ].map((item) => (
              <motion.div key={item.title} variants={fadeUp}>
                <div
                  className={`h-full rounded-2xl border ${item.border} ${item.bg} p-8 text-center`}
                >
                  <div
                    className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-background shadow-sm"
                  >
                    <item.icon className={`size-7 ${item.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Come funziona ── */}
      <section className="border-t bg-muted/50 py-24">
        <motion.div
          className="mx-auto max-w-6xl px-6 text-center"
          {...fadeIn}
        >
          <span className="mb-4 inline-block rounded-full border bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground">
            Come funziona
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Da zero a feedback in 3 passi
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Bastano pochi minuti per configurare 5stelle e iniziare a
            raccogliere feedback dai tuoi clienti.
          </p>
        </motion.div>

        {/* Step 1 — Form builder */}
        <div className="mx-auto mt-24 max-w-6xl px-6">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                1
              </div>
              <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Crea il tuo modulo di feedback
              </h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Costruisci il modulo perfetto per il tuo ristorante. Scegli tra
                domande a stelle, sentiment, scelta multipla e testo libero.
                Fino a 6 domande per modulo, con un&apos;esperienza mobile-first
                che i tuoi clienti ameranno compilare.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "5 tipi di domande disponibili",
                  "Anteprima in tempo reale",
                  "Ottimizzato per mobile",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground"
                  >
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary">
                      <Check className="size-3 text-primary-foreground" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <FormIllustration />
            </motion.div>
          </div>
        </div>

        {/* Step 2 — QR code (reversed) */}
        <div className="mx-auto mt-32 max-w-6xl px-6">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <motion.div
              className="md:order-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                2
              </div>
              <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Stampa il QR code per ogni tavolo
              </h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Genera QR code unici per ogni tavolo del tuo ristorante. Scarica
                i PDF pronti da stampare e posizionali dove i tuoi clienti
                possono vederli facilmente. Ogni feedback è tracciato al tavolo
                di origine.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Un QR code per ogni tavolo",
                  "Download PDF singolo o in blocco",
                  "Tracciamento per tavolo",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground"
                  >
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary">
                      <Check className="size-3 text-primary-foreground" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              className="md:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <QRIllustration />
            </motion.div>
          </div>
        </div>

        {/* Step 3 — Dashboard */}
        <div className="mx-auto mt-32 max-w-6xl px-6">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                3
              </div>
              <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Monitora e migliora
              </h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Tutti i feedback in una dashboard intuitiva. Visualizza punteggi
                medi, trend nel tempo, dettagli per ogni risposta e analisi del
                sentiment. Ogni opinione è un&apos;opportunità per migliorare il
                tuo servizio.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Punteggio medio e trend",
                  "Filtri per periodo e sentiment",
                  "Dettaglio per singolo tavolo",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground"
                  >
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary">
                      <Check className="size-3 text-primary-foreground" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <DashboardIllustration />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats / Impact Numbers ── */}
      <section className="py-24">
        <motion.div
          className="mx-auto max-w-6xl px-6 text-center"
          {...fadeIn}
        >
          <span className="mb-4 inline-block rounded-full border bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground">
            I numeri parlano
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            L&apos;impatto sulle recensioni
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Ecco perché i ristoratori scelgono 5stelle per proteggere e far
            crescere la propria reputazione online.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-16 max-w-5xl px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                value: "70%",
                accent: "text-primary",
                description:
                  "dei clienti soddisfatti non lascia mai una recensione — a meno che non glielo chiedi al momento giusto.",
              },
              {
                value: "1 su 3",
                accent: "text-red-500",
                description:
                  "clienti insoddisfatti scrive una recensione negativa. Senza un filtro, queste finiscono online.",
              },
              {
                value: "+40%",
                accent: "text-green-500",
                description:
                  "di recensioni positive in più nei primi 30 giorni grazie al routing intelligente di 5stelle.",
              },
            ].map((stat) => (
              <motion.div
                key={stat.value}
                variants={fadeUp}
                className="rounded-2xl border bg-muted/50 p-8 text-center"
              >
                <div className={`text-4xl font-bold tracking-tight sm:text-5xl ${stat.accent}`}>
                  {stat.value}
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Reviews section ── */}
      <section className="border-t bg-muted/50 py-24">
        <motion.div
          className="mx-auto max-w-6xl px-6 text-center"
          {...fadeIn}
        >
          <span className="mb-4 inline-block rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-800">
            La funzionalità più amata
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Più recensioni a 5 stelle,
            <br className="hidden sm:block" /> in automatico
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Il cuore di 5stelle: i clienti soddisfatti vengono guidati a
            lasciare recensioni pubbliche. I feedback negativi restano privati,
            solo per te.
          </p>
        </motion.div>

        {/* Two-path routing visual */}
        <div className="mx-auto mt-16 max-w-5xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Positive path */}
            <motion.div
              className="rounded-2xl border-2 border-green-200 bg-green-50/50 p-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-green-100">
                  <Smile className="size-6 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-green-900">
                    Cliente soddisfatto
                  </div>
                  <div className="text-sm text-green-700">
                    Esperienza positiva
                  </div>
                </div>
              </div>

              <div className="flex justify-center py-3">
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <ArrowDown className="size-5 text-green-400" />
                </motion.div>
              </div>

              {/* Platform review cards */}
              <div className="space-y-2.5">
                {reviewPlatforms.map((platform, i) => (
                  <motion.div
                    key={platform.name}
                    className="flex items-center justify-between rounded-xl bg-white p-3.5 shadow-sm"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                  >
                    <span className="text-sm font-medium">
                      {platform.name}
                    </span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: platform.stars }).map((_, j) => (
                        <Star
                          key={j}
                          className="size-3.5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-2 text-sm font-medium text-green-700">
                <ExternalLink className="size-4" />
                Recensione pubblica a 5 stelle
              </div>
            </motion.div>

            {/* Negative path */}
            <motion.div
              className="rounded-2xl border-2 border-border bg-muted/30 p-8"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <Frown className="size-6 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-semibold">Feedback critico</div>
                  <div className="text-sm text-muted-foreground">
                    Esperienza da migliorare
                  </div>
                </div>
              </div>

              <div className="flex justify-center py-3">
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <ArrowDown className="size-5 text-muted-foreground/50" />
                </motion.div>
              </div>

              {/* Private feedback card */}
              <motion.div
                className="rounded-xl border bg-card p-5 shadow-sm"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
                    <Lock className="size-4" />
                  </div>
                  <div className="text-sm font-medium">Feedback privato</div>
                </div>
                <div className="space-y-2">
                  <div className="h-2.5 w-full rounded-full bg-muted" />
                  <div className="h-2.5 w-4/5 rounded-full bg-muted" />
                  <div className="h-2.5 w-3/5 rounded-full bg-muted" />
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  Opportunità di miglioramento
                </div>
              </motion.div>

              <div className="mt-5 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Shield className="size-4" />
                Visibile solo a te
              </div>
            </motion.div>
          </div>
        </div>

        {/* Value proposition callout */}
        <motion.div
          className="mx-auto mt-16 max-w-3xl px-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <p className="text-xl font-semibold leading-relaxed">
            Proteggi la tua reputazione online.{" "}
            <span className="text-muted-foreground">
              Solo i clienti felici lasciano recensioni pubbliche — i feedback
              negativi arrivano direttamente a te, dandoti la possibilità di
              migliorare.
            </span>
          </p>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <motion.section className="border-t py-24" {...fadeIn}>
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Tutto quello che ti serve
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Strumenti pensati per i ristoratori che vogliono migliorare la
            propria reputazione online.
          </p>
          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full transition-shadow duration-300 hover:shadow-md">
                  <CardHeader>
                    <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                      <feature.icon className="size-6 text-foreground" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Perfetto per te ── */}
      <motion.section className="border-t bg-muted/50 py-24" {...fadeIn}>
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Perfetto per il tuo locale
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Qualunque sia il tuo tipo di attività, 5stelle si adatta alle tue
            esigenze.
          </p>
          <motion.div
            className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[
              {
                icon: UtensilsCrossed,
                title: "Ristoranti",
                tagline:
                  "Ogni piatto racconta una storia. Scopri cosa pensano davvero i tuoi ospiti.",
              },
              {
                icon: Pizza,
                title: "Pizzerie",
                tagline:
                  "Dalla margherita alla speciale: capisci quali creazioni conquistano di più.",
              },
              {
                icon: Coffee,
                title: "Bar & Caffetterie",
                tagline:
                  "Colazioni, aperitivi, pause caffè: ogni momento conta per i tuoi clienti.",
              },
              {
                icon: Hotel,
                title: "Hotel",
                tagline:
                  "Dal check-in al check-out, ogni dettaglio dell'esperienza fa la differenza.",
              },
            ].map((venue) => (
              <motion.div
                key={venue.title}
                variants={fadeUp}
                className="rounded-2xl border bg-background p-6 text-center"
              >
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                  <venue.icon className="size-7 text-foreground" />
                </div>
                <h3 className="font-semibold">{venue.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {venue.tagline}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ── Pricing ── */}
      <motion.section className="py-24" {...fadeIn}>
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Prezzo semplice e trasparente
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Un solo piano con tutto incluso. Nessun costo nascosto.
          </p>
          <div className="mx-auto mt-16 max-w-md">
            <Card className="relative overflow-hidden shadow-xl shadow-primary/5">
              <div className="absolute right-0 top-0 rounded-bl-xl bg-amber-400 px-4 py-1.5 text-xs font-bold text-amber-950">
                7 giorni gratis
              </div>
              <CardHeader className="pt-10">
                <CardTitle className="text-2xl">Pro</CardTitle>
                <CardDescription>
                  Tutto il necessario per gestire i feedback del tuo ristorante.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">€39</span>
                  <span className="text-muted-foreground">/mese</span>
                </div>
                <ul className="space-y-3">
                  {pricingFeatures.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary">
                        <Check className="size-3 text-primary-foreground" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full shadow-lg shadow-primary/20"
                  size="lg"
                  asChild
                >
                  <Link href="/signup">
                    Inizia la prova gratuita
                    <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.section>

      {/* ── Final CTA ── */}
      <motion.section
        className="relative overflow-hidden border-t bg-muted/50 py-24"
        {...fadeIn}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.04)_1px,_transparent_0)] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Pronto a migliorare le tue recensioni?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Unisciti ai ristoratori che già usano 5stelle per trasformare il
            feedback dei clienti in crescita reale.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4">
            <Button
              size="lg"
              asChild
              className="text-base shadow-lg shadow-primary/20"
            >
              <Link href="/signup">
                Prova gratis per 7 giorni
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Nessuna carta di credito richiesta
            </p>
          </div>
        </div>
      </motion.section>

      {/* ── Footer ── */}
      <footer className="border-t py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <Image src="/logo-5stelle.svg" alt="5stelle" width={28} height={28} />
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-foreground"
            >
              Termini di Servizio
            </Link>
          </div>
          <p>
            &copy; {new Date().getFullYear()} 5stelle. Tutti i diritti
            riservati.
          </p>
        </div>
      </footer>
    </div>
  );
}
