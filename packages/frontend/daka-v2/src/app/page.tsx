import {TopBar} from "../components/ui/top-bar";
import Image from 'next/image'

export default function Home() {
  return (
      <div className="min-h-screen">
        <TopBar/>

        {/* Main content with enough height to demonstrate scrolling */}
        <main className="w-full mx-auto m-0 px-4 py-8 relative">
          {/* Background image overlay */}
          <div
              className="absolute w-full h-full inset-0 bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage: "url(/banner.webp)",
                backgroundPosition: "center top",
                backgroundRepeat: "no-repeat",
                top: "0",
                left: "0",
              }}
          />

          {/* Content with relative positioning to appear above background */}
          <div className="relative z-10 space-y-8">
            <section className="text-center">
              <h1 className="text-4xl font-bold tracking-tight">Sticky Top Bar Demo</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Scroll down to see the top bar stick to the top of the page
              </p>
            </section>

            {/* Content sections to enable scrolling */}
            {Array.from({length: 10}).map((_, i) => (
                <section key={i} className="rounded-lg border p-8 bg-background/90 backdrop-blur-sm">
                  <h2 className="text-2xl font-semibold mb-4">Section {i + 1}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et
                    dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip
                    ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                    dolore eu
                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                    totam
                    rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
                    explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
                  </p>
                </section>
            ))}
          </div>
        </main>
      </div>
  );
}
