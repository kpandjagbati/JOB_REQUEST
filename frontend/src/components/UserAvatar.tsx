type UserAvatarProps = {
  firstName: string;
  lastName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "h-10 w-10 text-sm",
  md: "h-16 w-16 text-xl",
  lg: "h-28 w-28 text-4xl",
};

export function UserAvatar({
  firstName,
  lastName,
  size = "md",
  className = "",
}: UserAvatarProps) {
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-primary text-primary-content font-bold font-display leading-none select-none ${sizes[size]} ${className}`}
      aria-hidden
    >
      {initials}
    </div>
  );
}
