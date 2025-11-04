import Link from "next/link";

export function ZedNewsBanner() {
  return (
    <div className="w-full bg-[#0066ff] text-white text-center py-2 text-sm">
      <Link className="hover:underline" href="#windows">
        News: Zed Available on Windows →
      </Link>
    </div>
  );
}
