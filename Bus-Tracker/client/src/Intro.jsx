"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Shield,
  BarChart3,
  Users,
  Route,
  CreditCard,
  Menu,
  X,
  ArrowRight,
  Star,
} from "lucide-react";

export default function EnterpriseHomePage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[id]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: MapPin,
      title: "Real-time Journey Tracking",
      description:
        "Track your bus in real time with GPS integration and live updates.",
    },
    {
      icon: CreditCard,
      title: "Seamless Payments",
      description:
        "Secure, enterprise-grade payment gateway for smooth transactions.",
    },
    {
      icon: Shield,
      title: "Driver Verification",
      description:
        "Multi-step authentication ensures safety for all passengers.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Admins get insights into fleet efficiency and passenger activity.",
    },
  ];

  const services = [
    {
      icon: Users,
      title: "Passenger Portal",
      description: "Book rides, view schedules, and track journeys with ease.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Route,
      title: "Driver Dashboard",
      description: "Manage trips, monitor routes, and get real-time updates.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Shield,
      title: "Admin Control",
      description:
        "Verify users, manage services, and ensure smooth operations.",
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Daily Commuter",
      content:
        "TransitHub has transformed my daily commute. Real-time tracking means I never miss my bus again!",
      rating: 5,
    },
    {
      name: "Mike Chen",
      role: "Bus Driver",
      content:
        "The driver dashboard is intuitive and helps me manage my routes efficiently. Great platform!",
      rating: 5,
    },
    {
      name: "Lisa Rodriguez",
      role: "Transit Manager",
      content:
        "Our fleet efficiency has improved by 30% since implementing TransitHub's analytics.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Route className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-green-600">TransitHub</h1>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#services"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Services
            </a>
            <a
              href="#features"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Features
            </a>
            {/* <a
              href="#testimonials"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Testimonials
            </a> */}
            <a
              href="#contact"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Contact
            </a>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              onClick={() => navigate("/App")}
            >
              Login
            </button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-4 py-2 space-y-2">
            <a
              href="#services"
              className="block py-2 text-gray-600 hover:text-green-600"
            >
              Services
            </a>
            <a
              href="#features"
              className="block py-2 text-gray-600 hover:text-green-600"
            >
              Features
            </a>
            {/* <a
              href="#testimonials"
              className="block py-2 text-gray-600 hover:text-green-600"
            >
              Testimonials
            </a> */}
            <a
              href="#contact"
              className="block py-2 text-gray-600 hover:text-green-600"
            >
              Contact
            </a>
            <button
              className="w-full mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              onClick={() => navigate("/App")}
            >
              Login
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden text-black">
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
              Smart Transit{" "}
              <span className="text-green-800 block">Management</span>
            </h2>
            <p className="text-lg max-w-lg">
              A unified platform for passengers and drivers — secure, efficient,
              and built for enterprise-level transport systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="bg-black/20 text-green-700 px-6 py-3 rounded-lg border border-transparent font-medium shadow-lg transition hover:border-green-600 hover:scale-105"
                onClick={() => navigate("/App")}
              >
                Login
              </button>

              <button className="bg-black/20 px-6 py-3 rounded-lg border border-transparent font-medium shadow-lg transition hover:border-green-600 hover:scale-105">
                Watch Demo
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-3xl blur-3xl"></div>
            <img
              src="https://images.unsplash.com/photo-1627163814192-97f2e2d76bac?q=80&w=1090&auto=format&fit=crop"
              alt="Bus illustration"
              className="relative rounded-3xl shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold">Our Services</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions for every stakeholder in your transit
              ecosystem
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                id={`service-${index}`}
                className={`p-8 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all ${
                  isVisible[`service-${index}`]
                    ? "animate-fade-in-up"
                    : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center mb-6`}
                >
                  <service.icon className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-semibold mb-2">{service.title}</h4>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-32 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold">Core Features</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Advanced technology powering the future of public transportation
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                id={`feature-${index}`}
                className={`p-8 rounded-xl bg-white shadow-md hover:shadow-lg transition-all ${
                  isVisible[`feature-${index}`]
                    ? "animate-fade-in-up"
                    : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">{feature.title}</h4>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {/* <section id="testimonials" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold">
              What Our Users Say
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trusted by thousands of passengers, drivers, and transit operators
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                id={`testimonial-${index}`}
                className={`p-8 rounded-xl bg-white shadow-md hover:shadow-lg transition-all ${
                  isVisible[`testimonial-${index}`]
                    ? "animate-fade-in-up"
                    : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4">
                  "{testimonial.content}"
                </p>
                <div className="border-t pt-4">
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-blue-600 to-green-600 text-white text-center">
        <h3 className="text-3xl lg:text-4xl font-bold mb-4">
          Ready to transform your transport system?
        </h3>
        <p className="mb-6">
          Join TransitHub today and experience the future of smart mobility.
        </p>
        <button
          className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium shadow-lg hover:scale-105 transition"
          onClick={() => navigate("/App")}
        >
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="bg-gray-100 border-t border-gray-200 py-12 text-center"
      >
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} TransitHub Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
