import Link from "next/link"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Building2, Home, FileText, ChevronRight, Users, Globe, Apple } from "lucide-react"
import { Header } from "../components/common/header"
import { Footer } from "../components/common/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full text-sm mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-green-500 font-medium">Live on App Store</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance">
              Connect Dealers, Simplify Property Discovery
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              Deal Kroo brings real estate dealers together on one platform. Publish your property listings and discover
              available properties from fellow dealers within a few clicks.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8  mb-8 py-6 px-4 rounded-lg bg-muted/30 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto justify-center">
                <Globe className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <span className="text-sm md:text-base font-medium whitespace-nowrap">Available on Web</span>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground whitespace-nowrap">
                    Coming soon
                  </span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto justify-center">
                <Apple className="h-6 w-6 text-foreground flex-shrink-0" />
                <span className="text-sm md:text-base font-medium whitespace-nowrap">Available on App Store</span>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto justify-center">
                <svg className="h-6 w-6 text-muted-foreground flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <span className="text-sm md:text-base font-medium whitespace-nowrap">Available on Play Store</span>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground whitespace-nowrap">
                    Coming soon
                  </span>
                </div>
              </div>
            </div>
            {/* </CHANGE> */}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-base" asChild>
                <a href="https://apps.apple.com/us/app/deal-kroo/id6755895370" target="_blank" rel="noopener noreferrer">
                  <Apple className="mr-2 h-5 w-5" />
                  Download on App Store
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-base bg-transparent" asChild>
                <Link href="#features">
                  Learn More
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Everything Dealers Need in One Place</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              A streamlined platform designed specifically for dealer-to-dealer property interactions and networking.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Add Inventory Effortlessly</h3>
              <p className="text-muted-foreground text-pretty">
                Publish your property listings quickly and make it easy for other dealers to find and contact you.
                Streamline your inventory management with an intuitive interface.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Deal Property Required for Sale</h3>
              <p className="text-muted-foreground text-pretty">
                Discover properties available for sale from verified dealers. Access real-time authentic listings and
                connect directly with property owners.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Deal Property for Instalment Plans</h3>
              <p className="text-muted-foreground text-pretty">
                Find properties with flexible installment payment options. Browse authenticated listings and offer your
                clients more purchasing flexibility.
              </p>
            </Card>
          </div>

          <div className="mt-12 max-w-3xl mx-auto">
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Dealer-to-Dealer Network</h3>
                  <p className="text-muted-foreground text-pretty">
                    Connect with a growing network of verified real estate dealers. Share listings, discover
                    opportunities, and build valuable professional relationships all in one centralized platform.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">Why Deal Kroo?</h2>
            <p className="text-lg text-muted-foreground mb-6 text-pretty">
              Deal Kroo is built specifically for real estate dealers who need a centralized platform to publish and
              discover property listings. No more scattered contacts or missed opportunities.
            </p>
            <p className="text-lg text-muted-foreground text-pretty">
              Our mobile app is now live on the App Store! Google Play Store and web versions are coming soon. Download
              now and join the growing network of real estate dealers.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">Join Deal Kroo Today</h2>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Download Deal Kroo from the App Store now and start connecting with real estate dealers. Transform how you
              discover and share property listings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="https://apps.apple.com/us/app/deal-kroo/id6755895370" target="_blank" rel="noopener noreferrer">
                  <Apple className="mr-2 h-5 w-5" />
                  Download on App Store
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-base bg-transparent" asChild>
                <Link href="/privacy-policy">View Privacy Policy</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
