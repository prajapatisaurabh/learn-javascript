import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Linking,
  Dimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  ZoomIn,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";

const { width: W } = Dimensions.get("window");

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  bg:       "#06091A",
  surface:  "#0D1426",
  card:     "#111827",
  border:   "#1E2D50",
  border2:  "#243460",
  text:     "#F1F5F9",
  sub:      "#94A3B8",
  muted:    "#475569",
  blue:     "#3B82F6",
  blueD:    "#1D4ED8",
  purple:   "#8B5CF6",
  green:    "#10B981",
  orange:   "#F97316",
  red:      "#F87171",
  yellow:   "#FCD34D",
};

const open = (url: string) => Linking.openURL(url);

// ─── Pulse dot ────────────────────────────────────────────────────────────────
function PulseDot() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.6, { duration: 700, easing: Easing.out(Easing.ease) }),
        withTiming(1,   { duration: 700, easing: Easing.in(Easing.ease) })
      ),
      -1,
      false
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 700 }),
        withTiming(1,   { duration: 700 })
      ),
      -1,
      false
    );
  }, []);

  const ring = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={s.dotWrap}>
      <Animated.View style={[s.dotRing, ring]} />
      <View style={s.dot} />
    </View>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionTitle({ title, delay = 0 }: { title: string; delay?: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).springify()} style={s.sectionTitleRow}>
      <View style={s.sectionAccent} />
      <Text style={s.sectionTitle}>{title}</Text>
    </Animated.View>
  );
}

// ─── Chip ─────────────────────────────────────────────────────────────────────
function Chip({ label, color = C.blue }: { label: string; color?: string }) {
  return (
    <View style={[s.chip, { borderColor: color + "44", backgroundColor: color + "18" }]}>
      <Text style={[s.chipText, { color }]}>{label}</Text>
    </View>
  );
}

// ─── Experience Card ──────────────────────────────────────────────────────────
function ExpCard({
  role, company, period, desc, tags, link, delay,
}: {
  role: string; company: string; period: string; desc: string; tags: string[]; link?: string; delay: number;
}) {
  return (
    <Animated.View entering={FadeInLeft.delay(delay).springify()} style={s.expCard}>
      <View style={s.expDot} />
      <View style={s.expLine} />
      <View style={s.expContent}>
        <Text style={s.expRole}>{role}</Text>
        <Pressable onPress={() => link && open(link)} style={s.expCompanyRow}>
          <Text style={[s.expCompany, link && { color: C.blue }]}>{company}</Text>
          {link && <Ionicons name="open-outline" size={12} color={C.blue} style={{ marginLeft: 4 }} />}
        </Pressable>
        <Text style={s.expPeriod}>{period}</Text>
        <Text style={s.expDesc}>{desc}</Text>
        <View style={s.chipRow}>
          {tags.map((t) => <Chip key={t} label={t} color={C.purple} />)}
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({
  emoji, title, desc, tags, stack, link, delay,
}: {
  emoji: string; title: string; desc: string; tags: string[]; stack: string[]; link?: string; delay: number;
}) {
  return (
    <Animated.View entering={FadeInUp.delay(delay).springify()} style={s.projCard}>
      <View style={s.projTop}>
        <Text style={s.projEmoji}>{emoji}</Text>
        {link && (
          <Pressable onPress={() => open(link)} style={s.projLinkBtn}>
            <Ionicons name="arrow-forward-outline" size={16} color={C.blue} />
          </Pressable>
        )}
      </View>
      <Text style={s.projTitle}>{title}</Text>
      <Text style={s.projDesc}>{desc}</Text>
      <View style={s.chipRow}>
        {tags.map((t) => <Chip key={t} label={t} color={C.orange} />)}
      </View>
      <View style={[s.chipRow, { marginTop: 6 }]}>
        {stack.map((t) => <Chip key={t} label={t} color={C.muted} />)}
      </View>
    </Animated.View>
  );
}

// ─── Social Button ────────────────────────────────────────────────────────────
function SocialBtn({
  icon, label, url, color, delay,
}: {
  icon: keyof typeof Ionicons.glyphMap; label: string; url: string; color: string; delay: number;
}) {
  return (
    <Animated.View entering={ZoomIn.delay(delay).springify()}>
      <Pressable onPress={() => open(url)} style={[s.socialBtn, { borderColor: color + "55" }]}>
        <Ionicons name={icon} size={20} color={color} />
        <Text style={[s.socialLabel, { color }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const SKILLS = [
  { group: "Frontend & Web", color: C.blue,   items: ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express.js", "MongoDB", "TailwindCSS"] },
  { group: "AI & Cloud",     color: C.purple, items: ["LangChain", "LangGraph", "OpenAI API", "RAG Pipelines", "GPT-4", "AWS", "Docker", "Git"] },
];

const EXPERIENCE = [
  {
    role: "Software Engineer",
    company: "IBM India Software Lab",
    period: "Apr 2024 – Present",
    desc: "Working on Maximo enterprise asset management solutions using modern React and Graphite technologies.",
    tags: ["React", "Graphite", "TypeScript"],
    link: "https://www.ibm.com/in-en",
  },
  {
    role: "Software Engineer",
    company: "Visilean India Pvt. Ltd.",
    period: "May 2023 – Apr 2024",
    desc: "Built scalable web applications with React frontend.",
    tags: ["React"],
  },
  {
    role: "Software Engineer",
    company: "Knovos India Pvt. Ltd.",
    period: "May 2021 – May 2023",
    desc: "Developed enterprise solutions with React for the legal technology sector.",
    tags: ["React"],
  },
];

const PROJECTS = [
  {
    emoji: "🤖",
    title: "AI Thitainfo",
    desc: "Full-stack SaaS platform for AI-powered multi-agent interactions with pay-per-session interviews and Razorpay payment integration.",
    tags: ["Multi-Agent AI", "Pay-per-Session", "SaaS"],
    stack: ["React", "Express.js", "PostgreSQL", "Docker"],
    link: "https://ai.thitainfo.com/",
  },
  {
    emoji: "🎬",
    title: "URL to Video",
    desc: "AI video generator with 4 modes — URL, Topic, Story, LeetCode — powered by ElevenLabs TTS, Remotion & OpenAI.",
    tags: ["URL to Video", "LeetCode to Video"],
    stack: ["Next.js", "Remotion", "OpenAI API", "ElevenLabs"],
    link: "https://video.thitainfo.com/",
  },
  {
    emoji: "📦",
    title: "Chai Choco Tailwind",
    desc: "Zero-build-step runtime CSS utility engine with a chocolate color palette. No PostCSS, no config, no compilation.",
    tags: ["npm Package", "Runtime CSS", "Zero Build"],
    stack: ["JavaScript", "Vite", "ESM", "UMD"],
    link: "https://chaichoco.thitainfo.com/",
  },
  {
    emoji: "🧮",
    title: "CalculatorHub",
    desc: "Professional calculators for mathematics, finance, health, technology, and more — 73+ calculators.",
    tags: ["73+ Calculators", "Finance", "Health"],
    stack: ["Next.js", "MongoDB", "DaisyUI"],
    link: "https://www.calculatorhub.services/",
  },
  {
    emoji: "⌨️",
    title: "Typer Games",
    desc: "Fun interactive typing games with multiplayer real-time race mode to improve typing speed and accuracy.",
    tags: ["Multiplayer", "Real-time", "Race Mode"],
    stack: ["React", "Node.js", "Socket.io"],
  },
  {
    emoji: "💬",
    title: "Chat With Your PDF",
    desc: "Chat with PDF documents using AI. Upload PDFs and have intelligent conversations powered by LangChain & OpenAI.",
    tags: ["AI Chat", "PDF Upload", "LangChain"],
    stack: ["LangChain", "OpenAI", "Streamlit"],
    link: "https://chat-with-your-pdf-by-sp.streamlit.app/",
  },
  {
    emoji: "📅",
    title: "BookYourSpa",
    desc: "Seamless spa booking platform where customers can explore services, check availability, and book appointments instantly.",
    tags: ["Online Booking", "SaaS"],
    stack: ["Next.js", "MongoDB"],
    link: "https://www.bookyourspa.in/",
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Portfolio() {
  const scrollRef = useRef<ScrollView>(null);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="light" backgroundColor={C.bg} />

      <ScrollView
        ref={scrollRef}
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <View style={s.hero}>
          {/* Glow blobs */}
          <View style={[s.blob, { top: -60, left: -80,  backgroundColor: C.blue   + "22", width: 260, height: 260 }]} />
          <View style={[s.blob, { top: 40,  right: -100, backgroundColor: C.purple + "1A", width: 220, height: 220 }]} />

          <Animated.View entering={ZoomIn.delay(0).springify()} style={s.availBadge}>
            <PulseDot />
            <Text style={s.availText}>Available for work</Text>
          </Animated.View>

          <Animated.Text entering={FadeInDown.delay(100).springify()} style={s.heroGreeting}>
            Hi, I'm
          </Animated.Text>

          <Animated.Text entering={FadeInDown.delay(200).springify()} style={s.heroName}>
            Saurabh
          </Animated.Text>
          <Animated.Text entering={FadeInDown.delay(280).springify()} style={s.heroNameAccent}>
            Prajapati
          </Animated.Text>

          <Animated.Text entering={FadeInDown.delay(380).springify()} style={s.heroRole}>
            Full-Stack Engineer · GenAI · React
          </Animated.Text>

          <Animated.Text entering={FadeInDown.delay(460).springify()} style={s.heroSub}>
            Building enterprise apps, AI-powered tools & scalable web platforms.
            Currently at{" "}
            <Text style={{ color: C.blue, fontWeight: "600" }}>IBM</Text>
            {" "}on Maximo asset management.
          </Animated.Text>

          <Animated.View entering={FadeInUp.delay(560).springify()} style={s.heroBtns}>
            <Pressable onPress={() => open("https://saurabhprajapati.in/")} style={s.btnPrimary}>
              <Ionicons name="globe-outline" size={16} color="#fff" />
              <Text style={s.btnPrimaryText}>Portfolio</Text>
            </Pressable>
            <Pressable onPress={() => open("mailto:saurabhprajapati120@gmail.com")} style={s.btnOutline}>
              <Ionicons name="mail-outline" size={16} color={C.blue} />
              <Text style={s.btnOutlineText}>Contact</Text>
            </Pressable>
          </Animated.View>

          {/* Location */}
          <Animated.View entering={FadeInUp.delay(640).springify()} style={s.heroMeta}>
            <Ionicons name="location-outline" size={14} color={C.sub} />
            <Text style={s.heroMetaText}>India</Text>
          </Animated.View>
        </View>

        {/* ── STATS BAR ─────────────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={s.statsBar}>
          {[
            { n: "5+",  l: "Years Exp" },
            { n: "3",   l: "Companies" },
            { n: "7+",  l: "Projects"  },
            { n: "73+", l: "Calculators" },
          ].map((stat, i) => (
            <View key={i} style={[s.statItem, i < 3 && s.statBorder]}>
              <Text style={s.statNum}>{stat.n}</Text>
              <Text style={s.statLabel}>{stat.l}</Text>
            </View>
          ))}
        </Animated.View>

        {/* ── SKILLS ────────────────────────────────────────────────────── */}
        <View style={s.section}>
          <SectionTitle title="Tech Stack" delay={0} />
          {SKILLS.map((group, gi) => (
            <Animated.View
              key={group.group}
              entering={FadeInLeft.delay(gi * 100).springify()}
              style={s.skillGroup}
            >
              <Text style={[s.skillGroupLabel, { color: group.color }]}>{group.group}</Text>
              <View style={s.chipRow}>
                {group.items.map((item) => (
                  <Chip key={item} label={item} color={group.color} />
                ))}
              </View>
            </Animated.View>
          ))}
        </View>

        {/* ── EXPERIENCE ────────────────────────────────────────────────── */}
        <View style={s.section}>
          <SectionTitle title="Experience" delay={0} />
          <View style={s.timeline}>
            {EXPERIENCE.map((exp, i) => (
              <ExpCard key={i} {...exp} delay={i * 120} />
            ))}
          </View>
        </View>

        {/* ── PROJECTS ──────────────────────────────────────────────────── */}
        <View style={s.section}>
          <SectionTitle title="Projects" delay={0} />
          {PROJECTS.map((proj, i) => (
            <ProjectCard key={proj.title} {...proj} delay={i * 80} />
          ))}
        </View>

        {/* ── EDUCATION ─────────────────────────────────────────────────── */}
        <View style={s.section}>
          <SectionTitle title="Education" delay={0} />
          <Animated.View entering={FadeInUp.delay(100).springify()} style={s.eduCard}>
            <View style={s.eduIcon}>
              <Ionicons name="school-outline" size={22} color={C.blue} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.eduDeg}>B.E. in Computer Science</Text>
              <Text style={s.eduUni}>Gujarat Technological University</Text>
              <Text style={s.eduMeta}>Graduated May 2021  ·  CGPA: 8.23</Text>
            </View>
          </Animated.View>
        </View>

        {/* ── CONTACT ───────────────────────────────────────────────────── */}
        <View style={s.section}>
          <SectionTitle title="Connect" delay={0} />
          <Animated.Text entering={FadeInDown.delay(100).springify()} style={s.connectSub}>
            Let's build something great together.
          </Animated.Text>

          <View style={s.socialGrid}>
            <SocialBtn icon="logo-github"   label="GitHub"    url="https://github.com/prajapatisaurabh"                            color={C.text}   delay={0}   />
            <SocialBtn icon="logo-linkedin" label="LinkedIn"  url="https://www.linkedin.com/in/saurabh-prajapati-08b41915b/"       color="#0A66C2"  delay={80}  />
            <SocialBtn icon="logo-twitter"  label="X / Twitter" url="https://x.com/saurabhkals"                                   color={C.text}   delay={160} />
            <SocialBtn icon="logo-youtube"  label="YouTube"   url="https://www.youtube.com/@thitainfo"                             color="#FF0000"  delay={240} />
            <SocialBtn icon="mail-outline"  label="Email"     url="mailto:saurabhprajapati120@gmail.com"                           color={C.orange} delay={320} />
            <SocialBtn icon="globe-outline" label="Thitainfo" url="https://thitainfo.com/"                                         color={C.blue}   delay={400} />
          </View>
        </View>

        {/* ── FOOTER ────────────────────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.delay(200).springify()} style={s.footer}>
          <Text style={s.footerText}>Designed & built by Saurabh Prajapati</Text>
          <Text style={s.footerSub}>React Native · Expo · 2025</Text>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  // ── Hero
  hero: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    overflow: "hidden",
  },
  blob: {
    position: "absolute",
    borderRadius: 999,
    ...(Platform.OS === "web" ? { filter: "blur(60px)" } as any : {}),
  },
  availBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: C.green + "20",
    borderWidth: 1,
    borderColor: C.green + "44",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 24,
    gap: 8,
  },
  availText:   { fontSize: 13, fontWeight: "600", color: C.green },
  dotWrap:     { width: 14, height: 14, alignItems: "center", justifyContent: "center" },
  dotRing:     { position: "absolute", width: 14, height: 14, borderRadius: 7, backgroundColor: C.green + "55" },
  dot:         { width: 7, height: 7, borderRadius: 4, backgroundColor: C.green },

  heroGreeting: { fontSize: 20, fontWeight: "400", color: C.sub, marginBottom: 4 },
  heroName:     { fontSize: 52, fontWeight: "800", color: C.text, letterSpacing: -1.5, lineHeight: 56 },
  heroNameAccent: { fontSize: 52, fontWeight: "800", color: C.blue, letterSpacing: -1.5, lineHeight: 60, marginBottom: 12 },
  heroRole:     { fontSize: 16, fontWeight: "600", color: C.purple, marginBottom: 14, letterSpacing: 0.3 },
  heroSub:      { fontSize: 15, lineHeight: 24, color: C.sub, marginBottom: 28, maxWidth: 360 },

  heroBtns: { flexDirection: "row", gap: 12, marginBottom: 20 },
  btnPrimary: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: C.blue, paddingHorizontal: 20, paddingVertical: 13,
    borderRadius: 12,
  },
  btnPrimaryText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  btnOutline: {
    flexDirection: "row", alignItems: "center", gap: 6,
    borderWidth: 1.5, borderColor: C.blue + "88",
    paddingHorizontal: 20, paddingVertical: 13,
    borderRadius: 12,
  },
  btnOutlineText: { color: C.blue, fontWeight: "700", fontSize: 14 },

  heroMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  heroMetaText: { fontSize: 13, color: C.sub },

  // ── Stats
  statsBar: {
    flexDirection: "row",
    marginHorizontal: 24,
    backgroundColor: C.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 36,
    overflow: "hidden",
  },
  statItem:   { flex: 1, alignItems: "center", paddingVertical: 16 },
  statBorder: { borderRightWidth: 1, borderRightColor: C.border },
  statNum:    { fontSize: 22, fontWeight: "800", color: C.text },
  statLabel:  { fontSize: 10, color: C.sub, marginTop: 2, fontWeight: "500" },

  // ── Section
  section: { paddingHorizontal: 24, marginBottom: 44 },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 },
  sectionAccent: { width: 4, height: 22, backgroundColor: C.blue, borderRadius: 2 },
  sectionTitle: { fontSize: 22, fontWeight: "700", color: C.text },

  // ── Skills
  skillGroup: {
    backgroundColor: C.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
    marginBottom: 12,
  },
  skillGroupLabel: { fontSize: 12, fontWeight: "700", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.8 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 8, borderWidth: 1,
  },
  chipText: { fontSize: 12, fontWeight: "600" },

  // ── Experience timeline
  timeline: { paddingLeft: 8 },
  expCard: {
    flexDirection: "row",
    marginBottom: 28,
  },
  expDot: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: C.blue, borderWidth: 2, borderColor: C.blue + "55",
    marginTop: 4, marginRight: 16, flexShrink: 0,
  },
  expLine: {
    position: "absolute",
    left: 5, top: 16, bottom: -28,
    width: 2, backgroundColor: C.border,
  },
  expContent: { flex: 1 },
  expRole:    { fontSize: 16, fontWeight: "700", color: C.text, marginBottom: 3 },
  expCompanyRow: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  expCompany: { fontSize: 14, fontWeight: "600", color: C.sub },
  expPeriod:  { fontSize: 12, color: C.muted, marginBottom: 8 },
  expDesc:    { fontSize: 13, lineHeight: 20, color: C.sub, marginBottom: 10 },

  // ── Projects
  projCard: {
    backgroundColor: C.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 18,
    marginBottom: 14,
  },
  projTop:     { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  projEmoji:   { fontSize: 28 },
  projLinkBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: C.blue + "22", alignItems: "center", justifyContent: "center",
  },
  projTitle: { fontSize: 17, fontWeight: "700", color: C.text, marginBottom: 6 },
  projDesc:  { fontSize: 13, lineHeight: 20, color: C.sub, marginBottom: 10 },

  // ── Education
  eduCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    backgroundColor: C.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 18,
  },
  eduIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: C.blue + "20", alignItems: "center", justifyContent: "center",
  },
  eduDeg:  { fontSize: 16, fontWeight: "700", color: C.text, marginBottom: 4 },
  eduUni:  { fontSize: 14, color: C.sub, marginBottom: 4 },
  eduMeta: { fontSize: 12, color: C.muted },

  // ── Contact
  connectSub: { fontSize: 15, color: C.sub, marginBottom: 20 },
  socialGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  socialBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: 12, borderWidth: 1,
    backgroundColor: C.surface,
  },
  socialLabel: { fontSize: 13, fontWeight: "600" },

  // ── Footer
  footer: { alignItems: "center", paddingVertical: 24, borderTopWidth: 1, borderTopColor: C.border, marginHorizontal: 24 },
  footerText: { fontSize: 13, color: C.sub, fontWeight: "500" },
  footerSub:  { fontSize: 11, color: C.muted, marginTop: 4 },
});
