"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, TrendingUp, Users, HeartPulse, Sparkles, Quote, Mic, Linkedin } from "lucide-react";

// Project data
const projects = [
  {
    id: 1,
    title: "3x Revenue Growth in 60 Days Through Lifecycle Marketing",
    context: "Wellness Tech Startup | Marketing Strategist | 2 Months",
    hook: "Built automated, segmented lifecycle campaigns that transformed sporadic email inquiries into consistent revenue—tripling weekly bookings while maintaining a 37.81% open rate.",
    metrics: [
      { value: "3x", label: "Revenue Growth", color: "blue" },
      { value: "37.81%", label: "Email Open Rate", color: "green" },
      { value: "232%", label: "List Growth", color: "purple" }
    ],
    skills: ["Lifecycle Marketing", "Email Marketing", "Marketing Automation", "Conversion Optimization", "Copywriting"],
    link: "/projects/neuma-3x-growth",
    icon: TrendingUp,
    gradient: "from-blue-500 to-blue-700",
    image: "/featured-revenue-growth.jpg"
  },
  {
    id: 2,
    title: "Building a 100+ Client Book in 5 Months From Zero",
    context: "Flock Freight (Freight Tech) | Strategic Sales Rep | 5 Months",
    hook: "Combined high-volume execution with strategic relationship development to build a carrier network from scratch in a declining market—closing deals on the spot through consultative selling.",
    metrics: [
      { value: "100+", label: "Clients Acquired", color: "blue" },
      { value: "100+", label: "Daily Outbound Calls", color: "green" },
      { value: "100+", label: "Deals Per Month", color: "purple" }
    ],
    skills: ["Business Development", "Consultative Selling", "Relationship Building", "Pipeline Management", "Cold Outreach"],
    link: "/projects",
    icon: Users,
    gradient: "from-slate-600 to-slate-800",
    image: "/featured-flock-freight.png"
  },
  {
    id: 3,
    title: "73% Cost Reduction Through Strategic Healthcare Partnerships",
    context: "NYC Mental Health Practice | Marketing Manager | 1 Year",
    hook: "Shifted from $30K/month ZocDoc spend to an owned partnership model with 1,000+ PCPs and free consultations—reducing costs by 73% while achieving 85% patient retention.",
    metrics: [
      { value: "73%", label: "Cost Reduction", color: "blue" },
      { value: "1,000+", label: "PCP Partnerships", color: "green" },
      { value: "85%", label: "Patient Retention", color: "purple" }
    ],
    skills: ["Partnership Development", "Healthcare Marketing", "CRM Systems", "Cost Optimization", "B2B Healthcare"],
    link: "/projects",
    icon: HeartPulse,
    gradient: "from-blue-600 to-indigo-600",
    image: "/featured-healthcare-partnerships.jpeg"
  },
  {
    id: 4,
    title: "1M+ Reach Campaign Through Data-Driven Social Strategy",
    context: "D2C Consumer Brand | Growth Strategist | 2 Months",
    hook: "Scaled brand awareness from minimal presence to over 1 million impressions through strategic content optimization, audience insights, and AI-powered workflow automation.",
    metrics: [
      { value: "1M+", label: "Total Reach", color: "blue" },
      { value: "2", label: "Months", color: "green" },
      { value: "5x", label: "Engagement Growth", color: "purple" }
    ],
    skills: ["Social Media Marketing", "Content Strategy", "Data Analysis", "AI Integration", "GTM Strategy"],
    link: "/projects",
    icon: Sparkles,
    gradient: "from-purple-600 to-pink-600",
    image: "/featured-reach-campaign.png"
  }
];

function FeaturedProjectsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const totalProjects = projects.length;

  const nextProject = () => {
    setDirection('right');
    setCurrentIndex((prev) => (prev < totalProjects - 1 ? prev + 1 : prev));
  };

  const prevProject = () => {
    setDirection('left');
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToProject = (index: number) => {
    setDirection(index > currentIndex ? 'right' : 'left');
    setCurrentIndex(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setDirection('right');
        setCurrentIndex((prev) => (prev < projects.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        setDirection('left');
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-advance (optional)
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      if (currentIndex < totalProjects - 1) {
        setDirection('right');
        setCurrentIndex((prev) => prev + 1);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [currentIndex, isHovered, totalProjects]);

  // Handle drag end for mobile swipe
  const handleDragEnd = (event: any, info: any) => {
    const threshold = 50;
    if (info.offset.x > threshold && currentIndex > 0) {
      setDirection('left');
      setCurrentIndex((prev) => prev - 1);
    } else if (info.offset.x < -threshold && currentIndex < totalProjects - 1) {
      setDirection('right');
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const currentProject = projects[currentIndex];
  const IconComponent = currentProject.icon;

  const getMetricColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'text-blue-600 dark:text-blue-400';
      case 'green':
        return 'text-green-600 dark:text-green-400';
      case 'purple':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-slate-600 dark:text-slate-400';
    }
  };

  return (
    <section id="featured-works" className="py-20 lg:py-24 px-6 lg:px-8 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            My Featured Works
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Strategic projects that drive measurable results
          </p>
        </div>

        {/* Carousel Container */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="relative bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-800 rounded-3xl p-8 lg:p-12 shadow-lg hover:shadow-xl transition-shadow duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            {/* Left Arrow - Desktop */}
            <button
              onClick={prevProject}
              disabled={currentIndex === 0}
              className="hidden lg:flex absolute left-[-4rem] top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-zinc-800 border-2 border-slate-300 dark:border-zinc-700 rounded-full items-center justify-center hover:bg-slate-50 dark:hover:bg-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed z-10"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-6 h-6 text-slate-700 dark:text-slate-300" />
            </button>

            {/* Left Arrow - Mobile */}
            <button
              onClick={prevProject}
              disabled={currentIndex === 0}
              className="lg:hidden absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-zinc-800/90 border-2 border-slate-300 dark:border-zinc-700 rounded-full items-center justify-center hover:bg-slate-50 dark:hover:bg-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed z-10 flex"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>

            {/* Right Arrow - Desktop */}
            <button
              onClick={nextProject}
              disabled={currentIndex === totalProjects - 1}
              className="hidden lg:flex absolute right-[-4rem] top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-zinc-800 border-2 border-slate-300 dark:border-zinc-700 rounded-full items-center justify-center hover:bg-slate-50 dark:hover:bg-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed z-10"
              aria-label="Next project"
            >
              <ChevronRight className="w-6 h-6 text-slate-700 dark:text-slate-300" />
            </button>

            {/* Right Arrow - Mobile */}
            <button
              onClick={nextProject}
              disabled={currentIndex === totalProjects - 1}
              className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-zinc-800/90 border-2 border-slate-300 dark:border-zinc-700 rounded-full items-center justify-center hover:bg-slate-50 dark:hover:bg-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed z-10 flex"
              aria-label="Next project"
            >
              <ChevronRight className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>

            {/* Project Card */}
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={{
                    enter: (dir: 'left' | 'right') => ({
                      x: dir === 'left' ? -300 : 300,
                      opacity: 0
                    }),
                    center: {
                      x: 0,
                      opacity: 1
                    },
                    exit: (dir: 'left' | 'right') => ({
                      x: dir === 'left' ? 300 : -300,
                      opacity: 0
                    })
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12"
                >
                  {/* Left Column - Visual (40%) */}
                  <div className="lg:col-span-2 relative aspect-video lg:aspect-square rounded-2xl shadow-md overflow-hidden">
                    {imageErrors.has(currentIndex) ? (
                      // Fallback gradient with icon
                      <div className={`absolute inset-0 bg-gradient-to-br ${currentProject.gradient} flex items-center justify-center`}>
                        <IconComponent className="w-16 h-16 lg:w-20 lg:h-20 text-white" />
                      </div>
                    ) : (
                      // Project image
                      <Image
                        src={currentProject.image}
                        alt={currentProject.title}
                        fill
                        className="object-cover"
                        onError={() => {
                          setImageErrors((prev) => new Set(prev).add(currentIndex));
                        }}
                      />
                    )}
                  </div>

                  {/* Right Column - Content (60%) */}
                  <div className="lg:col-span-3 flex flex-col justify-center">
                    <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                      {currentProject.title}
                    </h3>

                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex items-center gap-2 flex-wrap">
                      {currentProject.context.split(' | ').map((item, index, array) => (
                        <span key={index}>
                          {item}
                          {index < array.length - 1 && <span className="mx-2">•</span>}
                        </span>
                      ))}
                    </div>

                    <p className="text-base lg:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                      {currentProject.hook}
                    </p>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-3 lg:gap-4 mb-6">
                      {currentProject.metrics.map((metric, index) => (
                        <div
                          key={index}
                          className="bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-3 lg:p-4 text-center"
                        >
                          <div className={`text-2xl lg:text-3xl font-bold ${getMetricColor(metric.color)} mb-1`}>
                            {metric.value}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-2">
                      {currentProject.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Progress Dots */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => goToProject(index)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  index === currentIndex
                    ? 'w-3 h-3 bg-blue-600'
                    : 'w-2 h-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                }`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [isAboutVideoPlaying, setIsAboutVideoPlaying] = useState(false);
  const [testimonialImageErrors, setTestimonialImageErrors] = useState<Set<number>>(new Set());
  const [podcastImageError, setPodcastImageError] = useState(false);
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  // Seek video to a few seconds in for better preview frame
  useEffect(() => {
    if (previewVideoRef.current && !isAboutVideoPlaying) {
      const video = previewVideoRef.current;
      const handleLoadedMetadata = () => {
        // Seek to 1 second into the video for the preview frame
        video.currentTime = 1;
      };
      
      if (video.readyState >= 1) {
        // Metadata already loaded
        video.currentTime = 1;
      } else {
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
      }

      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [isAboutVideoPlaying]);

  const testimonials = [
    {
      name: "Sofia Raimondi",
      title: "Director of Marketing",
      company: "Aluum",
      quote: "Soleil's strategic mindset helped us experiment with and identify the content formats that resonated most with our community, and her organized approach to analytics and reporting gave us clear visibility into what worked and what didn't.",
      gradient: "from-purple-500 to-pink-500",
      image: "/testimonial-sofia-raimondi.jpg"
    },
    {
      name: "Marissa Brassfield",
      title: "CEO and Visionary Entrepreneur Advisor",
      company: "Ridiculously Efficient",
      quote: "Soleil's result is what we call a Facilitator (6-5-4-4), which is kind of a unicorn: she can step into any type of team or workgroup and be the glue that helps very different personalities work together effectively.",
      gradient: "from-blue-500 to-cyan-500",
      image: "/testimonial-marissa-brassfield.jpg"
    },
    {
      name: "Asia Lefebre",
      title: "Human Resources Director",
      company: "SohoMD",
      quote: "Soleil has an incredible ability to dive into metrics and uncover valuable insights that drive success. Her analytical mindset paired with her creativity made her a standout in her role.",
      gradient: "from-green-500 to-emerald-500",
      image: "/testimonial-asia-lefebre.jpg"
    }
  ];
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Name in upper left corner */}
      <div className="absolute top-8 left-8 z-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
          Soleil Rain
        </h2>
      </div>

      {/* LinkedIn logo in upper right corner */}
      <div className="absolute top-8 right-8 z-20">
        <a
          href="https://www.linkedin.com/in/soleilrain"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          aria-label="LinkedIn profile"
        >
          <Linkedin className="w-6 h-6 sm:w-7 sm:h-7" />
        </a>
      </div>

      {/* You've Found Me Section - Now at Top */}
      <section className="pt-32 pb-24 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content - Left Side */}
            <div className="space-y-6">
              <h2 className="text-4xl sm:text-5xl font-bold text-black dark:text-white">
                You've Found Me!
              </h2>
              <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
                I'm Soleil and I'm glad you're here. I've built my career at the intersection 
                of strategy and execution. I spend my time doing what I love: analyzing business 
                marketing and operations strategies to help companies grow revenue, and working 
                with leaders worldwide through my podcast "Brilliant or BS," where we determine 
                what's actually driving value versus what's just noise.
              </p>
              <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
                My approach combines data-driven marketing operations with creative problem-solving 
                to deliver measurable business outcomes. If you want to understand how I think and 
                work, start with my 40-second intro—it's the best way to get to know me.
              </p>
            </div>

            {/* Video - Right Side */}
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl bg-black">
              {!isAboutVideoPlaying ? (
                <div className="relative w-full h-full">
                  {/* Video Preview with Frame from a Few Seconds In */}
                  <video 
                    ref={previewVideoRef}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                    onError={(e) => {
                      console.error("Video error:", e);
                    }}
                  >
                    <source src="/about-video.mp4" type="video/mp4" />
                  </video>
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors cursor-pointer"
                       onClick={() => {
                         if (previewVideoRef.current) {
                           previewVideoRef.current.currentTime = 0;
                         }
                         setIsAboutVideoPlaying(true);
                       }}>
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all group">
                        <svg 
                          className="w-10 h-10 text-white ml-1" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <p className="text-white/80 text-sm">Click to play video</p>
                    </div>
                  </div>
                </div>
              ) : (
                <video 
                  key="playing-video"
                  className="w-full h-full object-cover"
                  autoPlay
                  controls
                  onLoadedData={(e) => {
                    // Ensure video starts from beginning when playing
                    e.currentTarget.currentTime = 0;
                  }}
                  onEnded={() => setIsAboutVideoPlaying(false)}
                  onError={(e) => {
                    console.error("Video playback error:", e);
                  }}
                >
                  <source src="/about-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        </div>
        
        {/* Bouncing Down Arrow */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => {
              document.getElementById('featured-works')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group cursor-pointer"
            aria-label="Scroll to next section"
          >
            <svg 
              className="w-8 h-8 text-black dark:text-white animate-bounce-down opacity-70 group-hover:opacity-100 transition-opacity" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Featured Projects Carousel */}
      <FeaturedProjectsCarousel />

      {/* Podcast Section */}
      <section className="py-20 lg:py-24 px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
              🎙️ MY PODCAST: BRILLIANT OR BS
            </h2>
          </div>

          {/* Featured Episode Card */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 lg:p-12 shadow-2xl hover:translate-y-[-4px] transition-transform duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
                {/* Left Column - Visual (2/5 width) */}
                <div className="lg:col-span-2 relative aspect-square rounded-2xl shadow-xl overflow-hidden">
                  {podcastImageError ? (
                    // Fallback gradient with microphone icon
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center">
                      <Mic className="w-20 h-20 lg:w-24 lg:h-24 text-white opacity-90" />
                    </div>
                  ) : (
                    // Podcast artwork image
                    <Image
                      src="/podcast-artwork.png"
                      alt="Brilliant or BS Podcast"
                      fill
                      className="object-cover"
                      onError={() => {
                        setPodcastImageError(true);
                      }}
                    />
                  )}
                </div>

                {/* Right Column - Content (3/5 width) */}
                <div className="lg:col-span-3 flex flex-col gap-4">
                  {/* Label */}
                  <p className="text-sm font-semibold tracking-wider text-blue-600 uppercase mb-2">
                    POPULAR EPISODE
                  </p>

                  {/* Episode Title */}
                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
                    Electric Vehicles: Brilliant or BS?
                  </h3>

                  {/* Guest Info */}
                  <div className="mb-1">
                    <p className="text-base lg:text-lg text-slate-700">
                      with Brian Dillard
                    </p>
                    <p className="text-sm text-slate-600">
                      Former Head of Battery, Vinfast
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-base text-slate-700 leading-relaxed mb-6 line-clamp-3">
                    Electric cars promise a clean-energy future, but if their batteries depend on dirty, fragile supply chains, is the EV revolution really as green as it seems?
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="https://open.spotify.com/episode/2OtvSVDSpOoXEyqqnQP2bO?si=2aaa55e4210b4c8f"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow hover:shadow-lg transition-colors"
                      aria-label="Listen on Spotify"
                    >
                      🎧 Listen on Spotify
                    </a>
                    <a
                      href="https://podcasts.apple.com/us/podcast/brilliant-or-b-t/id1761493067?i=1000734039350"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow hover:shadow-lg transition-colors"
                      aria-label="Listen on Apple Podcasts"
                    >
                      🎧 Listen on Apple Podcasts
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tagline */}
          <p className="text-base lg:text-lg text-slate-700 italic text-center mt-8 max-w-3xl mx-auto">
            Analyzing business strategies, social trends, and economic topics with practitioners worldwide
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 lg:py-24 px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3">
              What People Say
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Trusted by leaders across industries
            </p>
          </div>

          {/* Three-Column Testimonial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <article
                key={index}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 lg:p-10 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col min-h-full relative"
              >
                {/* Decorative Quote Mark */}
                <Quote className="w-6 h-6 lg:w-7 lg:h-7 text-blue-600 dark:text-blue-400 opacity-20 absolute top-6 left-6 z-0" />

                {/* Quote Text */}
                <blockquote className="text-base lg:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6 flex-1 relative z-10">
                  {testimonial.quote}
                </blockquote>

                {/* Attribution Section */}
                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-200 dark:border-slate-700">
                  {/* Photo */}
                  <div className="relative w-14 h-14 lg:w-16 lg:h-16 rounded-full overflow-hidden flex-shrink-0">
                    {testimonialImageErrors.has(index) ? (
                      // Fallback gradient placeholder
                      <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center`}>
                        <span className="text-white font-bold text-xl">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                    ) : (
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover rounded-full"
                        onError={() => {
                          setTestimonialImageErrors((prev) => new Set(prev).add(index));
                        }}
                      />
                    )}
                  </div>

                  {/* Name and Title */}
                  <div className="flex-1 min-w-0">
                    <cite className="not-italic">
                      <p className="text-base lg:text-lg font-semibold text-slate-900 dark:text-white mb-0.5">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-tight">
                        {testimonial.title}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {testimonial.company}
                      </p>
                    </cite>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-cyan-50 border border-slate-200 shadow-md">
        <div className="max-w-3xl mx-auto text-center text-slate-900">
          <a
            href="https://www.linkedin.com/in/soleilrain"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 hover:shadow-lg transition-all duration-200"
            aria-label="Connect on LinkedIn"
          >
            Connect on LinkedIn
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

    </div>
  );
}
