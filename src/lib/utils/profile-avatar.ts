export const getInitials = (name: string | null | undefined): string => {
  if (!name) return "U";
  const words = name.trim().split(/\s+/);
  if (words.length === 0) return "U";

  const firstInitial = words[0][0]?.toUpperCase() || "U";

  if (words.length === 1) {
    return firstInitial;
  }

  const secondInitial = words[1][0]?.toUpperCase() || "";
  return firstInitial + secondInitial;
};

export const getAvatarColor = (name: string | null | undefined): string => {
  if (!name) return "from-green-500 to-emerald-600";

  const colors = [
    "from-green-500 to-emerald-600",
    "from-blue-500 to-cyan-600",
    "from-purple-500 to-pink-600",
    "from-orange-500 to-red-600",
    "from-indigo-500 to-blue-600",
    "from-teal-500 to-green-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const hasCustomAvatar = (
  avatarUrl: string | null | undefined
): boolean => {
  if (!avatarUrl || avatarUrl === "") return false;
  return (
    avatarUrl.startsWith("/profiles/") ||
    avatarUrl.includes("supabase.co") ||
    avatarUrl.startsWith("blob:") ||
    avatarUrl.startsWith("http")
  );
};

