
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CoolDudePage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://picsum.photos/seed/cooldude/1920/1080"
        alt="Cool Dude Background"
        fill
        className="object-cover -z-20"
        data-ai-hint="abstract technology"
        priority
      />
      {/* Frosted Black Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md -z-10" />

      <div className="container mx-auto px-4 py-12 text-center relative z-10 flex flex-col items-center">
        {/* Main Content Area */}
        <div className="w-full max-w-2xl lg:max-w-3xl flex flex-col items-center">
          {/* Highlighted Right Text Block - Frosted Glass */}
          <div className="bg-[#f8f8f8]/80 dark:bg-neutral-800/80 backdrop-blur-lg rounded-xl p-8 md:p-12 shadow-2xl w-full mb-12 text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#0000ff] dark:text-blue-400">
              Recent Research
            </h1>
            <p className="text-lg md:text-xl text-neutral-700 dark:text-neutral-300 mb-8 leading-relaxed">
              Computational Intelligence | Information Technology | Artificial Intelligence | Machine Learning
            </p>
            <Button
              asChild
              variant="outline" // Using outline to better showcase border and glow
              className="group border-2 border-[#0000ff] dark:border-blue-400 text-[#0000ff] dark:text-blue-400 hover:bg-[#0000ff] dark:hover:bg-blue-400 hover:text-white dark:hover:text-black px-8 py-3 text-lg font-semibold rounded-lg relative overflow-hidden animate-glowBlue hover:animate-none"
            >
              <Link href="#">
                Explore More
                {/* Animated underline */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0000ff] dark:bg-blue-400 group-hover:w-full transition-all duration-300 ease-in-out"></span>
              </Link>
            </Button>
          </div>

          {/* Box Under the Fold - Circular Glass Frame */}
          <div className="bg-[#f8f8f8]/80 dark:bg-neutral-800/80 backdrop-blur-lg rounded-full py-4 px-8 shadow-xl">
            <p className="text-md md:text-lg font-semibold text-neutral-700 dark:text-neutral-300">
              IIT Delhi | Mathematics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
