import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeInLeft,
  FadeInUp,
  FadeOut,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: W } = Dimensions.get("window");

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  bg: "#06091A",
  surface: "#0D1426",
  card: "#111827",
  border: "#1E2D50",
  border2: "#243460",
  text: "#F1F5F9",
  sub: "#94A3B8",
  muted: "#475569",
  blue: "#3B82F6",
  blueD: "#1D4ED8",
  purple: "#8B5CF6",
  green: "#10B981",
  orange: "#F97316",
  red: "#F87171",
  yellow: "#FCD34D",
};

// ─── Types ────────────────────────────────────────────────────────────────────
type TxType = "income" | "expense";
type Category =
  | "Salary"
  | "Freelance"
  | "Investment"
  | "Gift"
  | "Food"
  | "Transport"
  | "Shopping"
  | "Bills"
  | "Health"
  | "Entertainment"
  | "Education"
  | "Other";

interface Transaction {
  id: string;
  type: TxType;
  category: Category;
  amount: number;
  description: string;
  date: string;
  dateLabel: string;
}

interface TxForm {
  type: TxType;
  category: Category;
  amount: string;
  description: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  photoUri: string | null;
}

interface FilterState {
  type: "all" | TxType;
  category: Category | "All";
  dateRange: "all" | "today" | "week" | "month";
}

// ─── Category Metadata ────────────────────────────────────────────────────────
const INCOME_CATEGORIES: Category[] = [
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
];
const EXPENSE_CATEGORIES: Category[] = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
  "Education",
  "Other",
];
const ALL_CATEGORIES: Category[] = [
  ...INCOME_CATEGORIES,
  ...EXPENSE_CATEGORIES,
];

const CATEGORY_META: Record<
  Category,
  { icon: keyof typeof Ionicons.glyphMap; color: string }
> = {
  Salary: { icon: "cash-outline", color: C.green },
  Freelance: { icon: "laptop-outline", color: C.blue },
  Investment: { icon: "trending-up-outline", color: C.purple },
  Gift: { icon: "gift-outline", color: C.yellow },
  Food: { icon: "fast-food-outline", color: C.orange },
  Transport: { icon: "car-outline", color: C.blue },
  Shopping: { icon: "bag-handle-outline", color: C.purple },
  Bills: { icon: "receipt-outline", color: C.red },
  Health: { icon: "medical-outline", color: C.green },
  Entertainment: { icon: "film-outline", color: C.yellow },
  Education: { icon: "school-outline", color: C.blue },
  Other: { icon: "ellipsis-horizontal-outline", color: C.muted },
};

// ─── Seed Data ────────────────────────────────────────────────────────────────
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: "s1",
    type: "income",
    category: "Salary",
    amount: 85000,
    description: "March salary",
    date: daysAgo(0),
    dateLabel: fmtDate(daysAgo(0)),
  },
  {
    id: "s2",
    type: "expense",
    category: "Food",
    amount: 650,
    description: "Dinner with friends",
    date: daysAgo(0),
    dateLabel: fmtDate(daysAgo(0)),
  },
  {
    id: "s3",
    type: "expense",
    category: "Transport",
    amount: 250,
    description: "Cab to office",
    date: daysAgo(1),
    dateLabel: fmtDate(daysAgo(1)),
  },
  {
    id: "s4",
    type: "income",
    category: "Freelance",
    amount: 12000,
    description: "UI design project",
    date: daysAgo(2),
    dateLabel: fmtDate(daysAgo(2)),
  },
  {
    id: "s5",
    type: "expense",
    category: "Shopping",
    amount: 3200,
    description: "New headphones",
    date: daysAgo(3),
    dateLabel: fmtDate(daysAgo(3)),
  },
  {
    id: "s6",
    type: "expense",
    category: "Bills",
    amount: 1800,
    description: "Electricity bill",
    date: daysAgo(4),
    dateLabel: fmtDate(daysAgo(4)),
  },
  {
    id: "s7",
    type: "expense",
    category: "Food",
    amount: 420,
    description: "Groceries",
    date: daysAgo(5),
    dateLabel: fmtDate(daysAgo(5)),
  },
  {
    id: "s8",
    type: "income",
    category: "Investment",
    amount: 5500,
    description: "Mutual fund dividend",
    date: daysAgo(10),
    dateLabel: fmtDate(daysAgo(10)),
  },
  {
    id: "s9",
    type: "expense",
    category: "Health",
    amount: 900,
    description: "Pharmacy",
    date: daysAgo(14),
    dateLabel: fmtDate(daysAgo(14)),
  },
  {
    id: "s10",
    type: "expense",
    category: "Entertainment",
    amount: 699,
    description: "OTT subscription",
    date: daysAgo(20),
    dateLabel: fmtDate(daysAgo(20)),
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number): string {
  return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 0 });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TransactionRow({
  tx,
  onDelete,
  index,
}: {
  tx: Transaction;
  onDelete: (id: string) => void;
  index: number;
}) {
  const meta = CATEGORY_META[tx.category];
  const isIncome = tx.type === "income";
  return (
    <Animated.View
      entering={FadeInLeft.delay(index * 40).springify()}
      style={s.txCard}
    >
      <View style={[s.txIconWrap, { backgroundColor: meta.color + "22" }]}>
        <Ionicons name={meta.icon} size={20} color={meta.color} />
      </View>
      <View style={s.txCenter}>
        <Text style={s.txCat}>{tx.category}</Text>
        {tx.description ? <Text style={s.txDesc}>{tx.description}</Text> : null}
        <Text style={s.txDate}>{tx.dateLabel}</Text>
      </View>
      <View style={s.txRight}>
        <Text style={[s.txAmount, { color: isIncome ? C.green : C.red }]}>
          {isIncome ? "+" : "-"}
          {fmt(tx.amount)}
        </Text>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onDelete(tx.id);
          }}
          style={s.txDelete}
          hitSlop={8}
        >
          <Ionicons name="trash-outline" size={14} color={C.muted} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

function Pill({
  label,
  active,
  onPress,
  activeColor = C.blue,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  activeColor?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        s.pill,
        active
          ? { backgroundColor: activeColor, borderColor: activeColor }
          : { backgroundColor: "transparent", borderColor: C.border },
      ]}
    >
      <Text style={[s.pillText, { color: active ? "#fff" : C.sub }]}>
        {label}
      </Text>
    </Pressable>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
function BarChart({ transactions }: { transactions: Transaction[] }) {
  const MAX_H = 80;
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const data = days.map((d) => {
    const label = d
      .toLocaleDateString("en-IN", { weekday: "short" })
      .slice(0, 1);
    const dayStr = d.toDateString();
    const income = transactions
      .filter(
        (t) =>
          new Date(t.date).toDateString() === dayStr && t.type === "income",
      )
      .reduce((s, t) => s + t.amount, 0);
    const expense = transactions
      .filter(
        (t) =>
          new Date(t.date).toDateString() === dayStr && t.type === "expense",
      )
      .reduce((s, t) => s + t.amount, 0);
    return { label, income, expense };
  });

  const maxVal = Math.max(...data.map((d) => Math.max(d.income, d.expense)), 1);

  return (
    <Animated.View
      entering={FadeInUp.delay(200).springify()}
      style={s.chartCard}
    >
      <Text style={s.chartTitle}>7-Day Overview</Text>
      <View style={s.chartBars}>
        {data.map((d, i) => (
          <View key={i} style={s.chartCol}>
            <View style={s.chartBarGroup}>
              <View
                style={[
                  s.chartBar,
                  {
                    height: Math.max(
                      (d.income / maxVal) * MAX_H,
                      d.income > 0 ? 4 : 0,
                    ),
                    backgroundColor: C.green + "CC",
                    marginRight: 2,
                  },
                ]}
              />
              <View
                style={[
                  s.chartBar,
                  {
                    height: Math.max(
                      (d.expense / maxVal) * MAX_H,
                      d.expense > 0 ? 4 : 0,
                    ),
                    backgroundColor: C.red + "CC",
                  },
                ]}
              />
            </View>
            <Text style={s.chartLabel}>{d.label}</Text>
          </View>
        ))}
      </View>
      <View style={s.chartLegend}>
        <View style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: C.green }]} />
          <Text style={s.legendText}>Income</Text>
        </View>
        <View style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: C.red }]} />
          <Text style={s.legendText}>Expense</Text>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Storage keys ────────────────────────────────────────────────────────────
const STORAGE_KEY = "expense_tracker_transactions";
const PROFILE_KEY = "expense_tracker_profile";
const DEFAULT_PROFILE: UserProfile = {
  name: "",
  email: "",
  phone: "",
  photoUri: null,
};

// ─── Splash Screen ───────────────────────────────────────────────────────────
function SplashOverlay() {
  const glow = useSharedValue(0.4);
  const dot1 = useSharedValue(0.3);
  const dot2 = useSharedValue(0.3);
  const dot3 = useSharedValue(0.3);

  useEffect(() => {
    glow.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    dot1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 400 }),
        withTiming(0.3, { duration: 400 }),
      ),
      -1,
    );
    dot2.value = withDelay(
      180,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.3, { duration: 400 }),
        ),
        -1,
      ),
    );
    dot3.value = withDelay(
      360,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.3, { duration: 400 }),
        ),
        -1,
      ),
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.value }));
  const dot1Style = useAnimatedStyle(() => ({ opacity: dot1.value }));
  const dot2Style = useAnimatedStyle(() => ({ opacity: dot2.value }));
  const dot3Style = useAnimatedStyle(() => ({ opacity: dot3.value }));

  return (
    <Animated.View exiting={FadeOut.duration(700)} style={s.splashOverlay}>
      {/* Glow ring behind icon */}
      <Animated.View style={[s.splashGlow, glowStyle]} />

      {/* Icon */}
      <Animated.View
        entering={ZoomIn.delay(150).springify()}
        style={s.splashIconWrap}
      >
        <Ionicons name="wallet" size={54} color={C.blue} />
      </Animated.View>

      {/* App name */}
      <Animated.Text
        entering={FadeInDown.delay(450).springify()}
        style={s.splashTitle}
      >
        Expense Tracker
      </Animated.Text>

      {/* Tagline */}
      <Animated.Text
        entering={FadeInDown.delay(620).springify()}
        style={s.splashTagline}
      >
        Your smart money companion
      </Animated.Text>

      {/* Animated dots */}
      <Animated.View
        entering={FadeInUp.delay(780).springify()}
        style={s.splashDots}
      >
        <Animated.View style={[s.splashDot, dot1Style]} />
        <Animated.View style={[s.splashDot, dot2Style]} />
        <Animated.View style={[s.splashDot, dot3Style]} />
      </Animated.View>

      {/* Brand */}
      <Animated.View
        entering={FadeInUp.delay(500).springify()}
        style={s.splashBrand}
      >
        <Ionicons name="globe-outline" size={12} color={C.muted} />
        <Text style={s.splashBrandText}>
          by <Text style={s.splashBrandLink}>thitainfo.com</Text>
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

// ─── Profile Modal ────────────────────────────────────────────────────────────
function ProfileModal({
  visible,
  profile,
  onSave,
  onClose,
}: {
  visible: boolean;
  profile: UserProfile;
  onSave: (p: UserProfile) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<UserProfile>(profile);

  useEffect(() => {
    if (visible) setForm(profile);
  }, [visible]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setForm((f) => ({ ...f, photoUri: result.assets[0].uri }));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const initials = form.name.trim()
    ? form.name
        .trim()
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={s.modalSafe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={s.modalScroll}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              entering={FadeInDown.delay(0).springify()}
              style={s.modalHeader}
            >
              <Text style={s.modalTitle}>My Profile</Text>
              <Pressable onPress={onClose} style={s.modalClose}>
                <Ionicons name="close" size={22} color={C.text} />
              </Pressable>
            </Animated.View>

            {/* Avatar picker */}
            <Animated.View
              entering={ZoomIn.delay(80).springify()}
              style={s.profileAvatarSection}
            >
              <Pressable onPress={pickImage} style={s.profileAvatarWrap}>
                {form.photoUri ? (
                  <Image
                    source={{ uri: form.photoUri }}
                    style={s.profileAvatarImg}
                  />
                ) : (
                  <View style={s.profileAvatarPlaceholder}>
                    <Text style={s.profileAvatarInitials}>{initials}</Text>
                  </View>
                )}
                <View style={s.profileCameraBtn}>
                  <Ionicons name="camera" size={13} color="#fff" />
                </View>
              </Pressable>
              <View style={s.profileAvatarActions}>
                <Pressable onPress={pickImage} style={s.profileAvatarActionBtn}>
                  <Ionicons name="image-outline" size={14} color={C.blue} />
                  <Text style={[s.profileAvatarActionText, { color: C.blue }]}>
                    Change
                  </Text>
                </Pressable>
                {form.photoUri ? (
                  <Pressable
                    onPress={() => {
                      setForm((f) => ({ ...f, photoUri: null }));
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    style={s.profileAvatarActionBtn}
                  >
                    <Ionicons name="trash-outline" size={14} color={C.red} />
                    <Text style={[s.profileAvatarActionText, { color: C.red }]}>
                      Remove
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            </Animated.View>

            {/* Name */}
            <Animated.View
              entering={FadeInUp.delay(160).springify()}
              style={s.modalSection}
            >
              <Text style={s.modalLabel}>Full Name</Text>
              <TextInput
                style={s.descInput}
                value={form.name}
                onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
                placeholder="e.g. Raj Sharma"
                placeholderTextColor={C.muted}
                returnKeyType="next"
              />
            </Animated.View>

            {/* Email */}
            <Animated.View
              entering={FadeInUp.delay(210).springify()}
              style={s.modalSection}
            >
              <Text style={s.modalLabel}>Email</Text>
              <TextInput
                style={s.descInput}
                value={form.email}
                onChangeText={(v) => setForm((f) => ({ ...f, email: v }))}
                placeholder="e.g. raj@example.com"
                placeholderTextColor={C.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />
            </Animated.View>

            {/* Phone */}
            <Animated.View
              entering={FadeInUp.delay(260).springify()}
              style={s.modalSection}
            >
              <Text style={s.modalLabel}>Phone</Text>
              <TextInput
                style={s.descInput}
                value={form.phone}
                onChangeText={(v) => setForm((f) => ({ ...f, phone: v }))}
                placeholder="e.g. +91 98765 43210"
                placeholderTextColor={C.muted}
                keyboardType="phone-pad"
                returnKeyType="done"
              />
            </Animated.View>

            {/* Save */}
            <Animated.View
              entering={FadeInUp.delay(310).springify()}
              style={s.modalSection}
            >
              <Pressable
                onPress={() => {
                  onSave(form);
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success,
                  );
                  onClose();
                }}
                style={s.submitBtn}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color="#fff"
                />
                <Text style={s.submitBtnText}>Save Profile</Text>
              </Pressable>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ExpenseTracker() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2400);
    return () => clearTimeout(t);
  }, []);

  // Load from storage on first launch
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setTransactions(JSON.parse(raw));
        } catch {
          setTransactions(SEED_TRANSACTIONS);
        }
      } else {
        // First ever launch — use seed data
        setTransactions(SEED_TRANSACTIONS);
      }
      setLoaded(true);
    });
  }, []);

  // Save to storage whenever transactions change (skip before initial load)
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions, loaded]);

  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Load profile
  useEffect(() => {
    AsyncStorage.getItem(PROFILE_KEY).then((raw) => {
      if (raw) {
        try {
          setProfile(JSON.parse(raw));
        } catch {}
      }
    });
  }, []);

  // Save profile whenever it changes
  useEffect(() => {
    AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState<TxForm>({
    type: "expense",
    category: "Food",
    amount: "",
    description: "",
  });
  const [amountError, setAmountError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterState>({
    type: "all",
    category: "All",
    dateRange: "all",
  });
  const [showFilters, setShowFilters] = useState(false);

  const filterHeight = useSharedValue(0);
  const filterAnim = useAnimatedStyle(() => ({
    height: filterHeight.value,
    overflow: "hidden",
  }));

  // ── Derived
  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + t.amount, 0),
    [transactions],
  );
  const totalExpense = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0),
    [transactions],
  );
  const balance = totalIncome - totalExpense;

  const filtered = useMemo(() => {
    const now = new Date();
    return transactions
      .filter((tx) => {
        if (filter.type !== "all" && tx.type !== filter.type) return false;
        if (filter.category !== "All" && tx.category !== filter.category)
          return false;
        if (filter.dateRange !== "all") {
          const txDate = new Date(tx.date);
          if (filter.dateRange === "today")
            return txDate.toDateString() === now.toDateString();
          if (filter.dateRange === "week") {
            const cutoff = new Date(now);
            cutoff.setDate(now.getDate() - 7);
            return txDate >= cutoff;
          }
          if (filter.dateRange === "month") {
            return (
              txDate.getMonth() === now.getMonth() &&
              txDate.getFullYear() === now.getFullYear()
            );
          }
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filter]);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (filter.type !== "all") n++;
    if (filter.category !== "All") n++;
    if (filter.dateRange !== "all") n++;
    return n;
  }, [filter]);

  // ── Handlers
  const handleOpenAdd = useCallback(() => {
    setForm({ type: "expense", category: "Food", amount: "", description: "" });
    setAmountError(null);
    setShowAddModal(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const handleTypeChange = useCallback((type: TxType) => {
    setForm((prev) => ({
      ...prev,
      type,
      category: type === "income" ? "Salary" : "Food",
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    const parsed = parseFloat(form.amount);
    if (isNaN(parsed) || parsed <= 0) {
      setAmountError("Please enter a valid amount");
      return;
    }
    const now = new Date().toISOString();
    const newTx: Transaction = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: form.type,
      category: form.category,
      amount: parsed,
      description: form.description.trim(),
      date: now,
      dateLabel: fmtDate(now),
    };
    setTransactions((prev) => [newTx, ...prev]);
    setShowAddModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [form]);

  const handleDelete = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }, []);

  const toggleFilters = useCallback(() => {
    const next = !showFilters;
    setShowFilters(next);
    filterHeight.value = withTiming(next ? 190 : 0, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
  }, [showFilters]);

  const categoryList =
    form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="light" backgroundColor={C.bg} />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInDown.delay(0).springify()}
          style={s.header}
        >
          <Pressable
            onPress={() => {
              setShowProfileModal(true);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            style={s.headerAvatar}
          >
            {profile.photoUri ? (
              <Image
                source={{ uri: profile.photoUri }}
                style={s.headerAvatarImg}
              />
            ) : (
              <View style={s.headerAvatarPlaceholder}>
                <Text style={s.headerAvatarInitials}>
                  {profile.name
                    ? profile.name
                        .trim()
                        .split(" ")
                        .map((w: string) => w[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                    : "?"}
                </Text>
              </View>
            )}
          </Pressable>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.appTitle}>Expense Tracker</Text>
            <Text style={s.appSub}>
              {profile.name
                ? `Hi, ${profile.name.trim().split(" ")[0]}`
                : "Track your money"}
            </Text>
          </View>
          <Animated.View entering={ZoomIn.delay(200).springify()}>
            <Pressable onPress={handleOpenAdd} style={s.fab}>
              <Ionicons name="add" size={26} color="#fff" />
            </Pressable>
          </Animated.View>
        </Animated.View>

        {/* ── BALANCE CARD ────────────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={s.balanceCard}
        >
          <Text style={s.balanceLabel}>Total Balance</Text>
          <Text
            style={[s.balanceAmount, { color: balance >= 0 ? C.green : C.red }]}
          >
            {balance < 0 ? "-" : ""}
            {fmt(Math.abs(balance))}
          </Text>
          <View style={s.balanceRow}>
            <View style={s.balanceStat}>
              <View style={s.balanceStatIcon}>
                <Ionicons name="arrow-up-outline" size={14} color={C.green} />
              </View>
              <View>
                <Text style={s.balanceStatLabel}>Income</Text>
                <Text style={[s.balanceStatAmount, { color: C.green }]}>
                  {fmt(totalIncome)}
                </Text>
              </View>
            </View>
            <View style={s.balanceDivider} />
            <View style={s.balanceStat}>
              <View
                style={[s.balanceStatIcon, { backgroundColor: C.red + "22" }]}
              >
                <Ionicons name="arrow-down-outline" size={14} color={C.red} />
              </View>
              <View>
                <Text style={s.balanceStatLabel}>Expense</Text>
                <Text style={[s.balanceStatAmount, { color: C.red }]}>
                  {fmt(totalExpense)}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* ── CHART ───────────────────────────────────────────────────────── */}
        <BarChart transactions={transactions} />

        {/* ── FILTERS ─────────────────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInDown.delay(250).springify()}
          style={s.filterSection}
        >
          <Pressable onPress={toggleFilters} style={s.filterToggle}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Ionicons name="filter-outline" size={16} color={C.blue} />
              <Text style={s.filterToggleText}>
                Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
              </Text>
            </View>
            <Ionicons
              name={showFilters ? "chevron-up-outline" : "chevron-down-outline"}
              size={16}
              color={C.sub}
            />
          </Pressable>

          <Animated.View style={filterAnim}>
            <View style={s.filterBody}>
              {/* Type */}
              <View style={s.filterRow}>
                {(["all", "income", "expense"] as const).map((t) => (
                  <Pill
                    key={t}
                    label={
                      t === "all"
                        ? "All"
                        : t.charAt(0).toUpperCase() + t.slice(1)
                    }
                    active={filter.type === t}
                    onPress={() => setFilter((f) => ({ ...f, type: t }))}
                    activeColor={
                      t === "income"
                        ? C.green
                        : t === "expense"
                          ? C.red
                          : C.blue
                    }
                  />
                ))}
              </View>
              {/* Date range */}
              <View style={s.filterRow}>
                {(["all", "today", "week", "month"] as const).map((r) => (
                  <Pill
                    key={r}
                    label={r.charAt(0).toUpperCase() + r.slice(1)}
                    active={filter.dateRange === r}
                    onPress={() => setFilter((f) => ({ ...f, dateRange: r }))}
                  />
                ))}
              </View>
              {/* Category */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 6 }}
              >
                <View style={s.filterRow}>
                  {(["All", ...ALL_CATEGORIES] as (Category | "All")[]).map(
                    (c) => (
                      <Pill
                        key={c}
                        label={c}
                        active={filter.category === c}
                        onPress={() =>
                          setFilter((f) => ({ ...f, category: c }))
                        }
                      />
                    ),
                  )}
                </View>
              </ScrollView>
            </View>
          </Animated.View>
        </Animated.View>

        {/* ── TRANSACTIONS ────────────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={s.txSection}
        >
          <View style={s.txHeader}>
            <Text style={s.txSectionTitle}>Transactions</Text>
            <Text style={s.txCount}>
              {filtered.length} item{filtered.length !== 1 ? "s" : ""}
            </Text>
          </View>

          {filtered.length === 0 ? (
            <View style={s.emptyState}>
              <Ionicons name="wallet-outline" size={40} color={C.muted} />
              <Text style={s.emptyText}>No transactions found</Text>
              <Text style={s.emptySub}>
                Try changing your filters or add a new transaction
              </Text>
            </View>
          ) : (
            filtered.map((tx, i) => (
              <TransactionRow
                key={tx.id}
                tx={tx}
                onDelete={handleDelete}
                index={i}
              />
            ))
          )}
        </Animated.View>

        {/* ── FOOTER ──────────────────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={s.footer}
        >
          <View style={s.footerDivider} />
          <Ionicons name="globe-outline" size={14} color={C.muted} />
          <Text style={s.footerText}>
            Crafted by <Text style={s.footerLink}>thitainfo.com</Text>
          </Text>
          <Text style={s.footerCopy}>
            © {new Date().getFullYear()} ThitaInfo · All rights reserved
          </Text>
        </Animated.View>
      </ScrollView>

      {/* ── SPLASH ────────────────────────────────────────────────────────── */}
      {showSplash && <SplashOverlay />}

      {/* ── PROFILE MODAL ─────────────────────────────────────────────────── */}
      <ProfileModal
        visible={showProfileModal}
        profile={profile}
        onSave={setProfile}
        onClose={() => setShowProfileModal(false)}
      />

      {/* ── ADD MODAL ──────────────────────────────────────────────────────── */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowAddModal(false)}
      >
        <SafeAreaView style={s.modalSafe}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={s.modalScroll}
              keyboardShouldPersistTaps="handled"
            >
              {/* Modal header */}
              <Animated.View
                entering={FadeInDown.delay(0).springify()}
                style={s.modalHeader}
              >
                <Text style={s.modalTitle}>Add Transaction</Text>
                <Pressable
                  onPress={() => setShowAddModal(false)}
                  style={s.modalClose}
                >
                  <Ionicons name="close" size={22} color={C.text} />
                </Pressable>
              </Animated.View>

              {/* Type toggle */}
              <Animated.View
                entering={FadeInUp.delay(80).springify()}
                style={s.modalSection}
              >
                <Text style={s.modalLabel}>Type</Text>
                <View style={s.typeRow}>
                  <Pressable
                    onPress={() => handleTypeChange("income")}
                    style={[
                      s.typeBtn,
                      form.type === "income" && {
                        backgroundColor: C.green,
                        borderColor: C.green,
                      },
                    ]}
                  >
                    <Ionicons
                      name="arrow-up-outline"
                      size={16}
                      color={form.type === "income" ? "#fff" : C.sub}
                    />
                    <Text
                      style={[
                        s.typeBtnText,
                        { color: form.type === "income" ? "#fff" : C.sub },
                      ]}
                    >
                      Income
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleTypeChange("expense")}
                    style={[
                      s.typeBtn,
                      form.type === "expense" && {
                        backgroundColor: C.red,
                        borderColor: C.red,
                      },
                    ]}
                  >
                    <Ionicons
                      name="arrow-down-outline"
                      size={16}
                      color={form.type === "expense" ? "#fff" : C.sub}
                    />
                    <Text
                      style={[
                        s.typeBtnText,
                        { color: form.type === "expense" ? "#fff" : C.sub },
                      ]}
                    >
                      Expense
                    </Text>
                  </Pressable>
                </View>
              </Animated.View>

              {/* Amount */}
              <Animated.View
                entering={FadeInUp.delay(140).springify()}
                style={s.modalSection}
              >
                <Text style={s.modalLabel}>Amount</Text>
                <View
                  style={[
                    s.amountWrap,
                    amountError ? { borderColor: C.red } : null,
                  ]}
                >
                  <Text style={s.amountPrefix}>₹</Text>
                  <TextInput
                    style={s.amountInput}
                    value={form.amount}
                    onChangeText={(v) => {
                      setAmountError(null);
                      setForm((f) => ({ ...f, amount: v }));
                    }}
                    placeholder="0.00"
                    placeholderTextColor={C.muted}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                  />
                </View>
                {amountError ? (
                  <Text style={s.errorText}>{amountError}</Text>
                ) : null}
              </Animated.View>

              {/* Category */}
              <Animated.View
                entering={FadeInUp.delay(200).springify()}
                style={s.modalSection}
              >
                <Text style={s.modalLabel}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View
                    style={{ flexDirection: "row", gap: 8, paddingVertical: 4 }}
                  >
                    {categoryList.map((cat) => {
                      const meta = CATEGORY_META[cat];
                      const active = form.category === cat;
                      return (
                        <Pressable
                          key={cat}
                          onPress={() =>
                            setForm((f) => ({ ...f, category: cat }))
                          }
                          style={[
                            s.catChip,
                            active
                              ? {
                                  backgroundColor: meta.color + "33",
                                  borderColor: meta.color,
                                }
                              : {
                                  backgroundColor: "transparent",
                                  borderColor: C.border,
                                },
                          ]}
                        >
                          <Ionicons
                            name={meta.icon}
                            size={14}
                            color={active ? meta.color : C.sub}
                          />
                          <Text
                            style={[
                              s.catChipText,
                              { color: active ? meta.color : C.sub },
                            ]}
                          >
                            {cat}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </ScrollView>
              </Animated.View>

              {/* Description */}
              <Animated.View
                entering={FadeInUp.delay(260).springify()}
                style={s.modalSection}
              >
                <Text style={s.modalLabel}>
                  Description <Text style={{ color: C.muted }}>(optional)</Text>
                </Text>
                <TextInput
                  style={s.descInput}
                  value={form.description}
                  onChangeText={(v) =>
                    setForm((f) => ({ ...f, description: v }))
                  }
                  placeholder="e.g. Dinner, Monthly rent..."
                  placeholderTextColor={C.muted}
                  returnKeyType="done"
                />
              </Animated.View>

              {/* Submit */}
              <Animated.View
                entering={FadeInUp.delay(320).springify()}
                style={s.modalSection}
              >
                <Pressable onPress={handleSubmit} style={s.submitBtn}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={18}
                    color="#fff"
                  />
                  <Text style={s.submitBtnText}>Add Transaction</Text>
                </Pressable>
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  appTitle: { fontSize: 26, fontWeight: "800", color: C.text },
  appSub: { fontSize: 13, color: C.sub, marginTop: 2 },
  fab: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: C.blue,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.blue,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  // Balance card
  balanceCard: {
    marginHorizontal: 24,
    marginBottom: 20,
    backgroundColor: C.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    padding: 24,
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 13,
    color: C.sub,
    fontWeight: "500",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: -1,
    marginBottom: 24,
  },
  balanceRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  balanceStat: { flexDirection: "row", alignItems: "center", gap: 12 },
  balanceStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: C.green + "22",
    alignItems: "center",
    justifyContent: "center",
  },
  balanceStatLabel: {
    fontSize: 11,
    color: C.sub,
    fontWeight: "500",
    marginBottom: 2,
  },
  balanceStatAmount: { fontSize: 16, fontWeight: "700" },
  balanceDivider: { width: 1, height: 40, backgroundColor: C.border },

  // Chart
  chartCard: {
    marginHorizontal: 24,
    marginBottom: 20,
    backgroundColor: C.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 18,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: C.text,
    marginBottom: 16,
  },
  chartBars: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 90,
  },
  chartCol: { alignItems: "center", flex: 1 },
  chartBarGroup: { flexDirection: "row", alignItems: "flex-end", height: 80 },
  chartBar: { width: 7, borderRadius: 4, minHeight: 0 },
  chartLabel: { fontSize: 10, color: C.muted, marginTop: 6, fontWeight: "600" },
  chartLegend: { flexDirection: "row", gap: 16, marginTop: 12 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: C.sub },

  // Filter
  filterSection: { marginHorizontal: 24, marginBottom: 16 },
  filterToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterToggleText: { fontSize: 14, fontWeight: "600", color: C.text },
  filterBody: { paddingTop: 12, gap: 8 },
  filterRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillText: { fontSize: 12, fontWeight: "600" },

  // Transactions
  txSection: { paddingHorizontal: 24 },
  txHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  txSectionTitle: { fontSize: 18, fontWeight: "700", color: C.text },
  txCount: { fontSize: 12, color: C.muted, fontWeight: "500" },

  txCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  txIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  txCenter: { flex: 1 },
  txCat: { fontSize: 14, fontWeight: "700", color: C.text },
  txDesc: { fontSize: 12, color: C.sub, marginTop: 1 },
  txDate: { fontSize: 11, color: C.muted, marginTop: 2 },
  txRight: { alignItems: "flex-end", gap: 6 },
  txAmount: { fontSize: 15, fontWeight: "700" },
  txDelete: { padding: 4 },

  // Empty state
  emptyState: { alignItems: "center", paddingVertical: 48 },
  emptyText: { fontSize: 16, fontWeight: "600", color: C.sub, marginTop: 14 },
  emptySub: {
    fontSize: 13,
    color: C.muted,
    marginTop: 6,
    textAlign: "center",
    lineHeight: 20,
  },

  // Modal
  modalSafe: { flex: 1, backgroundColor: C.bg },
  modalScroll: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 40 },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  modalTitle: { fontSize: 22, fontWeight: "800", color: C.text },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  modalSection: { marginBottom: 24 },
  modalLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: C.sub,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  typeRow: { flexDirection: "row", gap: 12 },
  typeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  typeBtnText: { fontSize: 15, fontWeight: "700" },

  amountWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  amountPrefix: {
    fontSize: 28,
    fontWeight: "700",
    color: C.sub,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: "800",
    color: C.text,
    paddingVertical: 12,
  },
  errorText: { fontSize: 12, color: C.red, marginTop: 6 },

  catChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  catChipText: { fontSize: 13, fontWeight: "600" },

  descInput: {
    backgroundColor: C.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: C.text,
  },

  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: C.blue,
    borderRadius: 16,
    paddingVertical: 16,
  },
  submitBtnText: { fontSize: 16, fontWeight: "800", color: "#fff" },

  // Header avatar
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: C.border2,
  },
  headerAvatarImg: { width: 44, height: 44 },
  headerAvatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.purple + "33",
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatarInitials: {
    fontSize: 16,
    fontWeight: "800",
    color: C.purple,
    textAlign: "center",
    textAlignVertical: "center",
    width: 44,
    height: 44,
    includeFontPadding: false,
  },

  // Profile modal avatar
  profileAvatarSection: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 8,
  },
  profileAvatarWrap: { position: "relative" },
  profileAvatarImg: { width: 100, height: 100, borderRadius: 50 },
  profileAvatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: C.purple + "33",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: C.border2,
  },
  profileAvatarInitials: {
    fontSize: 36,
    fontWeight: "800",
    color: C.purple,
    textAlign: "center",
    textAlignVertical: "center",
    width: 100,
    height: 100,
    includeFontPadding: false,
  },
  profileCameraBtn: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.blue,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: C.bg,
  },
  profileAvatarHint: { fontSize: 12, color: C.muted, marginTop: 10 },
  profileAvatarActions: { flexDirection: "row", gap: 16, marginTop: 12 },
  profileAvatarActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  profileAvatarActionText: { fontSize: 13, fontWeight: "600" },

  // Splash
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    gap: 0,
  },
  splashGlow: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: C.blue + "18",
  },
  splashIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: C.blue + "18",
    borderWidth: 1.5,
    borderColor: C.blue + "44",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  splashTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: C.text,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  splashTagline: {
    fontSize: 14,
    color: C.sub,
    fontWeight: "500",
    marginBottom: 36,
  },
  splashDots: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 60,
  },
  splashDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.blue,
  },
  splashBrand: {
    position: "absolute",
    bottom: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  splashBrandText: { fontSize: 12, color: C.muted, fontWeight: "500" },
  splashBrandLink: { color: C.blue, fontWeight: "700" },

  // Footer
  footer: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
    gap: 6,
  },
  footerDivider: {
    width: 40,
    height: 1,
    backgroundColor: C.border,
    marginBottom: 12,
  },
  footerText: { fontSize: 12, color: C.muted, fontWeight: "500" },
  footerLink: { color: C.blue, fontWeight: "700" },
  footerCopy: {
    fontSize: 11,
    color: C.muted + "99",
    fontWeight: "400",
    letterSpacing: 0.3,
  },
});
