import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, Heart, Users, Download } from "lucide-react";
import heroImage from "@/assets/hero-empowerment.jpg";
import appLogo from "@/assets/app-logo.jpg";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-accent/80 to-primary/90" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <img src={appLogo} alt="Safety SheIld Logo" className="w-32 h-32 mx-auto rounded-2xl shadow-glow" />
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Safety SheIld
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Anytime, Anywhere — Your Safety, Our Priority
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                variant="hero"
                size="lg"
                onClick={() => navigate("/signup")}
                className="min-w-[200px]"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/login")}
                className="min-w-[200px] border-white text-white hover:bg-white hover:text-primary"
              >
                Login
              </Button>
            </div>
            
            <div className="pt-6">
              <Button
                size="sm"
                onClick={() => navigate("/install")}
                className="bg-white/20 text-white hover:bg-white hover:text-primary backdrop-blur-sm border border-white/30 hover:scale-105 transition-all duration-300"
              >
                <Download className="mr-2 h-4 w-4" />
                Install Mobile App
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose Us?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive safety features designed to protect and empower
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mb-6 mx-auto">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-center mb-3">
                24/7 Emergency Alert
              </h3>
              <p className="text-muted-foreground text-center">
                Instant emergency response with location sharing and quick access to helplines
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mb-6 mx-auto">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-center mb-3">
                Safety Resources
              </h3>
              <p className="text-muted-foreground text-center">
                Access safety tips, helpline numbers, and support resources anytime
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mb-6 mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-center mb-3">
                Community Support
              </h3>
              <p className="text-muted-foreground text-center">
                Connect with a supportive community and share experiences safely
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Take Control of Your Safety?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of women who trust our platform for their safety and peace of mind
          </p>
          <Button
            variant="hero"
            size="lg"
            onClick={() => navigate("/signup")}
            className="bg-white text-primary hover:bg-white/90 min-w-[200px]"
          >
            Sign Up Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© 2024 Safety SheIld. Empowering women everywhere.</p>
            <div className="flex gap-6">
              <a href="tel:112" className="hover:text-primary transition-colors">
                Emergency: 112
              </a>
              <a href="tel:1091" className="hover:text-primary transition-colors">
                Women Helpline: 1091
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
