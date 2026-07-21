const HeroBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-125 h-125 bg-linear-to-br from-primary/20 via-purple-500/10 to-accent/20 rounded-full blur-[120px] animate-pulse-slow animate-gradient-bg"></div>
      <div className="absolute bottom-1/4 left-1/4 w-100 h-100 bg-linear-to-tl from-accent/15 via-blue-500/10 to-primary/10 rounded-full blur-[100px] animate-pulse-slow animate-delay-200 animate-gradient-bg"></div>

      <div className="absolute top-20 left-20 w-32 h-32 border border-primary/10 rounded-full animate-pulse-slow animate-delay-400"></div>
      <div className="absolute bottom-40 right-40 w-48 h-48 border border-accent/10 rounded-full animate-pulse-slow animate-delay-600"></div>

      <div className="absolute top-1/3 right-1/4 w-16 h-16 border-2 border-accent/10 rotate-45 animate-[spin_30s_linear_infinite]"></div>
      <div className="absolute bottom-1/3 left-1/4 w-10 h-10 border border-primary/10 rotate-12 animate-[spin_45s_linear_infinite_reverse]"></div>

      <svg
        className="absolute bottom-1/4 left-1/3 w-12 h-12 text-primary/10 animate-float animate-delay-200"
        viewBox="0 0 40 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20 4L36 36H4L20 4Z" />
      </svg>

      <svg
        className="absolute top-1/2 left-20 w-10 h-10 text-destructive/10 animate-[spin_40s_linear_infinite_reverse]"
        viewBox="0 0 40 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20 2L36.32 11V29L20 38L3.68 29V11L20 2Z" />
      </svg>

      <div className="absolute bottom-20 right-1/3 text-accent/10 animate-pulse-slow animate-delay-600 text-4xl font-light select-none">
        +
      </div>

      <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse-slow shadow-lg shadow-primary/50"></div>
      <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-accent rounded-full animate-pulse-slow animate-delay-200 shadow-lg shadow-accent/50"></div>
      <div className="absolute top-1/2 right-10 w-2 h-2 bg-destructive rounded-full animate-pulse-slow animate-delay-400 shadow-lg shadow-destructive/50"></div>
    </div>
  );
};

export default HeroBackground;
