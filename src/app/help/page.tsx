"use client";

import { useState, useEffect } from "react";

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState<string>("getting-started");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const faqData = [
    {
      id: "getting-started",
      title: "Getting Started",
      questions: [
        {
          q: "How do I create an account?",
          a: "Click on the wallet icon in the top navigation, then select either 'Personal Account' for individuals or 'Business Account' for organizations. Follow the registration process to create your account."
        },
        {
          q: "What types of accounts are available?",
          a: "We offer two account types: Personal accounts for individual traders and Business accounts for organizations and companies."
        },
        {
          q: "How do I browse algorithms?",
          a: "Visit the Marketplace page to browse available algorithms. You can filter by category (Trading, Analytics, Prediction) or use the search function to find specific algorithms."
        }
      ]
    },
    {
      id: "marketplace",
      title: "Marketplace",
      questions: [
        {
          q: "How do I purchase an algorithm?",
          a: "Browse the marketplace, click on an algorithm you're interested in, and use the 'View Details' button to see pricing and subscription options."
        },
        {
          q: "Can I try algorithms before purchasing?",
          a: "Yes! Most algorithms offer a demo version. Click 'Try Demo' to test the algorithm with sample data before committing to a subscription."
        },
        {
          q: "What payment methods are accepted?",
          a: "We accept major cryptocurrencies and traditional payment methods. Specific payment options are displayed during the checkout process."
        }
      ]
    },
    {
      id: "technical",
      title: "Technical Support",
      questions: [
        {
          q: "How do I integrate algorithms with my trading platform?",
          a: "Each algorithm comes with detailed API documentation and integration guides. Our technical team can assist with custom integrations."
        },
        {
          q: "What are the system requirements?",
          a: "Algorithms are cloud-based and accessible through our web platform. You only need a modern web browser and internet connection."
        },
        {
          q: "How do I get technical support?",
          a: "Contact our support team through the contact form below or email support@cryptoblueblocks.com. We typically respond within 24 hours."
        }
      ]
    },
    {
      id: "billing",
      title: "Billing & Subscriptions",
      questions: [
        {
          q: "How does billing work?",
          a: "Algorithms are billed monthly. You can cancel or change your subscription at any time through your account dashboard."
        },
        {
          q: "Can I get a refund?",
          a: "We offer a 7-day money-back guarantee for all new subscriptions. Contact support if you're not satisfied with your purchase."
        },
        {
          q: "How do I cancel my subscription?",
          a: "Log into your account, go to the billing section, and click 'Cancel Subscription'. Your access will continue until the end of your current billing period."
        }
      ]
    }
  ];

  const contactMethods = [
    {
      icon: "📧",
      title: "Email Support",
      description: "Get help via email",
      contact: "support@cryptoblueblocks.com",
      response: "Response within 24 hours"
    },
    {
      icon: "💬",
      title: "Live Chat",
      description: "Chat with our team",
      contact: "Available 9 AM - 6 PM EST",
      response: "Instant response"
    },
    {
      icon: "📞",
      title: "Phone Support",
      description: "Call us directly",
      contact: "+1 (555) 123-4567",
      response: "Mon-Fri 9 AM - 5 PM EST"
    }
  ];

  return (
    <main className="bg-[#161616] text-white min-h-screen">
      <div className="w-[85%] mx-auto pt-8 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2aa5ff] mb-4">Help Center</h1>
          <p className="text-xl text-gray-400">Find answers to common questions and get support</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-[#323232] rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Help Topics</h2>
              <nav className="space-y-2">
                {faqData.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-[#2aa5ff] text-white'
                        : 'text-gray-400 hover:bg-[#404040] hover:text-white'
                    }`}
                    disabled={!isClient}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-2">
            <div className="bg-[#323232] rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">
                {faqData.find(section => section.id === activeSection)?.title}
              </h2>
              
              <div className="space-y-6">
                {faqData
                  .find(section => section.id === activeSection)
                  ?.questions.map((faq, index) => (
                    <div key={index} className="border-b border-gray-600 pb-6 last:border-b-0">
                      <h3 className="text-lg font-semibold mb-3 text-[#2aa5ff]">
                        {faq.q}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-[#323232] rounded-lg p-6 text-center hover:bg-[#404040] transition-colors">
                <div className="text-4xl mb-4">{method.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                <p className="text-gray-400 mb-4">{method.description}</p>
                <p className="text-[#2aa5ff] font-semibold mb-2">{method.contact}</p>
                <p className="text-sm text-gray-500">{method.response}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="mt-16">
          <div className="bg-[#323232] rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg border border-gray-600 bg-[#404040] text-white placeholder-gray-400"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full p-3 rounded-lg border border-gray-600 bg-[#404040] text-white placeholder-gray-400"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border border-gray-600 bg-[#404040] text-white placeholder-gray-400"
                  placeholder="What can we help you with?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full p-3 rounded-lg border border-gray-600 bg-[#404040] text-white placeholder-gray-400"
                  placeholder="Describe your question or issue..."
                />
              </div>
              <button
                type="submit"
                className="bg-[#2aa5ff] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#2aa5ff]/90 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
