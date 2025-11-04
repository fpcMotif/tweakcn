import Link from "next/link";

export function ZedFooter() {
  return (
    <footer className="relative px-4 py-12 sm:px-6 md:py-20 bg-[#0a0a0a] text-[#a0a0a0]">
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="text-center">
          <p className="text-sm mb-4">Zed Industries © 2025</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link className="hover:text-white transition-colors" href="#signup">
              Sign Up
            </Link>
            <span>·</span>
            <Link className="hover:text-white transition-colors" href="#signin">
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
