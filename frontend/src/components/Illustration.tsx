import Image from "next/image";

type IllustrationProps = {
  name:
    | "job-hunt"
    | "job-offers"
    | "hiring"
    | "interview"
    | "login"
    | "empty"
    | "online-resume"
    | "career-development";
  alt: string;
  className?: string;
  priority?: boolean;
};

export function Illustration({
  name,
  alt,
  className = "",
  priority = false,
}: IllustrationProps) {
  return (
    <Image
      src={`/illustrations/${name}.svg`}
      alt={alt}
      width={560}
      height={420}
      className={`h-auto w-full ${className}`}
      priority={priority}
    />
  );
}
