import { useState } from "react";
import {
  HelpCircle,
  BookOpen,
  Keyboard,
  History,
  MessageSquare,
  ChevronDown,
  Sparkles,
  Command,
} from "lucide-react";
import { FeedbackModal } from "@/shared/components/feedback/FeedbackModal";

type HelpSection = "getting-started" | "faq" | "shortcuts" | "changelog";

const FAQS = [
  {
    question: "How do I mark a destination or sight as visited?",
    answer:
      "Browse to any destination page or sight card and click the 'Mark as Visited' checkmark button. Your visit history will automatically sync to your Travel Passport and prefecture map.",
  },
  {
    question: "How does the Base Location setting work?",
    answer:
      "Configure your Base Location (e.g., Tokyo Station, Osaka) in Settings > General. TabiMap uses this as your default home starting point when calculating travel times and daily route plans.",
  },
  {
    question: "What is the difference between Achievements and Badges?",
    answer:
      "Achievements represent official heritage benchmarks (like UNESCO World Heritage Sites or 12 Existing Castles). Badges represent gamified exploration rewards unlocked by visiting regions and reaching travel milestones.",
  },
  {
    question: "How do I export my trip itinerary to Google Calendar?",
    answer:
      "Open any itinerary in My Trips and click the 'Export to Calendar' button. You can download an .ics file or add it directly to Google Calendar.",
  },
];

const SHORTCUTS = [
  {
    key: "⌘ + K / Ctrl + K",
    description: "Open Global Search & Command Palette",
  },
  { key: "ESC", description: "Close Command Palette or any open dialog/menu" },
  {
    key: "↑ / ↓",
    description: "Navigate items in search results or command lists",
  },
  { key: "Enter", description: "Select highlighted search result or action" },
];

export default function Help() {
  const [activeSection, setActiveSection] =
    useState<HelpSection>("getting-started");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <HelpCircle className="w-4 h-4" />
            Documentation & Support
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Help Center
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Learn feature workflows, view keyboard shortcuts, check release
            notes, or send feedback.
          </p>
        </div>

        <button
          onClick={() => setFeedbackOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all self-start md:self-auto"
        >
          <MessageSquare className="w-4 h-4" />
          Send Feedback
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-1">
          {[
            {
              id: "getting-started",
              label: "🚀 Getting Started",
              icon: BookOpen,
            },
            {
              id: "faq",
              label: "❓ Frequently Asked Questions",
              icon: HelpCircle,
            },
            { id: "shortcuts", label: "⌨️ Keyboard Shortcuts", icon: Keyboard },
            { id: "changelog", label: "📜 Release Changelog", icon: History },
          ].map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id as HelpSection)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
            {/* Section 1: Getting Started */}
            {activeSection === "getting-started" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Getting Started with TabiMap
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    3 simple steps to master your travel exploration in Japan.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white font-black text-sm flex items-center justify-center">
                      1
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Discover & Bookmark
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Explore Japan sights and curated UNESCO collections.
                      Bookmark places to your Bucket List.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white font-black text-sm flex items-center justify-center">
                      2
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Plan Itineraries
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Build daily travel plans in My Trips. Configure your Base
                      Location in Settings for accurate transit times.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white font-black text-sm flex items-center justify-center">
                      3
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Track Progression
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Log visited spots in Passport. Watch your Japan map light
                      up and earn milestone badges.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: FAQ */}
            {activeSection === "faq" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Frequently Asked Questions
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Find quick answers to common questions about TabiMap.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {FAQS.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full flex items-center justify-between p-4 text-left font-bold text-xs md:text-sm text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isOpen
                                ? "rotate-180 text-emerald-500"
                                : "text-slate-400"
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="p-4 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section 3: Keyboard Shortcuts */}
            {activeSection === "shortcuts" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Command className="w-5 h-5 text-emerald-600" />
                    Keyboard Shortcuts Cheat Sheet
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Speed up your navigation across TabiMap with global hotkeys.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  {SHORTCUTS.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60"
                    >
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {s.description}
                      </span>
                      <kbd className="px-2.5 py-1 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                        {s.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 4: Changelog */}
            {activeSection === "changelog" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Release History & Changelog
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Latest features and improvements added to TabiMap.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-500" />{" "}
                        Version 1.5.0
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        July 2026
                      </span>
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                      <li>Global Search & Command Palette (`Cmd+K`).</li>
                      <li>
                        Full-page user platform hubs (`/profile`, `/settings`,
                        `/help`).
                      </li>
                      <li>
                        Redesigned Passport 12-column motivational dashboard.
                      </li>
                      <li>
                        Consolidated Timeline and explicitly separated
                        Achievements vs Badges.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </div>
  );
}
