"use client";

import Image from "next/image";
import { Plus } from "lucide-react";



const HeroSection = () => {
  return (
    <section className="wrapper pt-[calc(var(--navbar-height)+24px)] mb-10 md:mb-16">
      <div className="library-hero-card">
        <div className="library-hero-content">
          {/* ---------- LEFT: Text + CTA ---------- */}
          <div className="library-hero-text">
            <h1 className="library-hero-title">
              Your Library
            </h1>
            <p className="library-hero-description">
              Upload your favourite books and start interactive
              voice conversations with your personal AI librarian.
            </p>

            <button className="library-cta-primary">
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              Add New Book
            </button>
          </div>

          {/* ---------- CENTER: Illustration (desktop only) ---------- */}
          <div className="library-hero-illustration-desktop">
            <Image
              src="/assets/hero-illustration.png"
              alt="Vintage books and globe illustration"
              width={340}
              height={220}
              className="object-contain"
              priority
            />
          </div>

          {/* ---------- RIGHT: Steps Card ---------- */}
          <div className="library-steps-card">
            <div className="space-y-4">
              <div className="library-step-item">
                <span className="library-step-number">1</span>
                <div>
                  <p className="library-step-title">Upload your book</p>
                  <p className="library-step-description">
                    Add a PDF or EPUB to your personal library
                  </p>
                </div>
              </div>

              <div className="library-step-item">
                <span className="library-step-number">2</span>
                <div>
                  <p className="library-step-title">AI analyzes it</p>
                  <p className="library-step-description">
                    Your AI librarian reads and understands the content
                  </p>
                </div>
              </div>

              <div className="library-step-item">
                <span className="library-step-number">3</span>
                <div>
                  <p className="library-step-title">Start chatting</p>
                  <p className="library-step-description">
                    Ask questions and discuss with your book using voice
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ---------- Mobile-only illustration ---------- */}
          <div className="library-hero-illustration">
            <Image
              src="/assets/hero-illustration.png"
              alt="Vintage books and globe illustration"
              width={260}
              height={170}
              className="object-contain"
            />
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default HeroSection;