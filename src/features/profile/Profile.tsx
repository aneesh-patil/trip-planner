import { useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { useTripStore } from "@/shared/hooks/useTripStore";
import { Icons } from "@/shared/icons";
import {
  PageTitle,
  SectionTitle,
  CardTitle,
  BodyText,
  Caption,
} from "@/shared/components/ui/Typography";
import { Button } from "@/shared/components/ui/button";

type ProfileTab = "overview" | "account" | "security" | "connected" | "summary";

export default function Profile() {
  const { user, updateUserProfile, deleteAccount } = useAuth();
  const { visited, visitedPrefectures, trips } = useTripStore();
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");

  const [username, setUsername] = useState(
    user?.user_metadata?.username || user?.user_metadata?.full_name || "",
  );
  const [homeCity, setHomeCity] = useState(
    user?.user_metadata?.home_city || "",
  );
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaveSuccess(false);

    try {
      const { error } = await updateUserProfile({
        username,
        full_name: username,
        home_city: homeCity,
      });

      if (!error) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const userInitial = (username[0] || user?.email?.[0] || "U").toUpperCase();

  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "July 2026";

  const OverviewIcon = Icons.overview;
  const AccountIcon = Icons.profile;
  const SecurityIcon = Icons.security;
  const ConnectedIcon = Icons.link;
  const SummaryIcon = Icons.statistics;
  const CheckIcon = Icons.check;
  const MailIcon = Icons.help;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl space-y-8 animate-in fade-in duration-200">
      {/* Profile Hero Header Banner */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-emerald-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-emerald-600/20 ring-4 ring-emerald-500/20 shrink-0">
              {userInitial}
            </div>
            <div className="space-y-1">
              <PageTitle>{username || "Aneesh Patil"}</PageTitle>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold border border-emerald-200 dark:border-emerald-800">
                  Explorer Hub
                </span>
                <span>•</span>
                <span>Member since {joinDate}</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {user?.email || " traveler@tabimap.com "}
          </div>
        </div>

        {/* 4-Stat Pill Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {visitedPrefectures.length}{" "}
              <span className="text-xs font-normal text-slate-400">/ 47</span>
            </div>
            <Caption>Prefectures</Caption>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {visited.length}
            </div>
            <Caption>Destinations</Caption>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
            <div className="text-xl font-black text-slate-900 dark:text-white">
              6
            </div>
            <Caption>Badges</Caption>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
            <div className="text-xl font-black text-slate-900 dark:text-white">
              2
            </div>
            <Caption>Achievements</Caption>
          </div>
        </div>
      </div>

      {/* Profile Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: "overview", label: "Overview", icon: OverviewIcon },
          { id: "account", label: "Account Info", icon: AccountIcon },
          { id: "security", label: "Security", icon: SecurityIcon },
          { id: "connected", label: "Connected Accounts", icon: ConnectedIcon },
          { id: "summary", label: "Travel Summary", icon: SummaryIcon },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ProfileTab)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs shrink-0 transition-all ${
                isActive
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <IconComp className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-Tab Content Panes */}
      <div className="max-w-3xl space-y-6">
        {activeTab === "overview" && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <SectionTitle>Explorer Activity Overview</SectionTitle>
            <BodyText>
              Welcome to your TabiMap traveler hub. Here you can manage your
              identity, account preferences, and personal travel summary.
            </BodyText>
          </div>
        )}

        {activeTab === "account" && (
          <form
            onSubmit={handleUpdate}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6"
          >
            <SectionTitle>Account Information</SectionTitle>

            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckIcon className="w-4 h-4" /> Profile details saved
                successfully!
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                  Display Name / Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                  Email Address (Sign in)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                  Home City / Country
                </label>
                <input
                  type="text"
                  value={homeCity}
                  onChange={(e) => setHomeCity(e.target.value)}
                  placeholder="e.g. Tokyo, Japan"
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Profile Changes"}
            </Button>
          </form>
        )}

        {activeTab === "security" && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
            <SectionTitle>Account Security & Data</SectionTitle>
            <BodyText>
              Your account authentication is secured via standard OAuth /
              Supabase Authentication.
            </BodyText>

            <div className="pt-4 border-t border-red-100 dark:border-red-950/60 space-y-3">
              <div className="text-sm font-bold text-red-600 dark:text-red-400">
                Danger Zone
              </div>
              {!deleteConfirm ? (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-xs font-bold border border-red-200 dark:border-red-800 hover:bg-red-100 transition-colors"
                >
                  Delete Account
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800 space-y-3">
                  <p className="text-xs font-bold text-red-800 dark:text-red-200">
                    Are you sure you want to delete your account? This action
                    cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => deleteAccount?.()}
                      className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs"
                    >
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "connected" && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <SectionTitle>Connected Accounts</SectionTitle>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MailIcon className="w-5 h-5 text-slate-500" />
                <div>
                  <CardTitle>Email Authentication</CardTitle>
                  <Caption>{user?.email}</Caption>
                </div>
              </div>
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Connected
              </span>
            </div>
          </div>
        )}

        {activeTab === "summary" && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <SectionTitle>Travel Progression Summary</SectionTitle>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <p>
                • Explored <strong>{visitedPrefectures.length}</strong> of 47
                prefectures in Japan.
              </p>
              <p>
                • Logged <strong>{visited.length}</strong> individual
                destination spots visited.
              </p>
              <p>
                • Created <strong>{trips.length}</strong> custom trip
                itineraries.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
