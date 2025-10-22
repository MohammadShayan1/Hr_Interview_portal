import Link from 'next/link';
import { ArrowRight, Briefcase, Users, Zap, CheckCircle, Star, MessageSquare, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Navigation */}
      <nav className="px-4 sm:px-6 py-4 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-lg sm:text-2xl font-bold text-primary-600">HR Interview Portal</h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/login"
              className="text-sm sm:text-base text-gray-700 hover:text-primary-600 font-medium"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            AI-Powered Interview Automation
          </h1>
          <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Streamline your recruitment process with automated interview scheduling,
            AI-generated job descriptions, and intelligent candidate evaluation.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center px-5 sm:px-6 py-2.5 sm:py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-base sm:text-lg font-medium"
          >
            Start Free Trial
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-20">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              AI Job Descriptions
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Generate professional, compelling job descriptions in seconds using advanced AI technology.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Automated Workflows
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Automatically schedule interviews, send invitations, and manage the entire candidate pipeline.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Smart Evaluation
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Get AI-powered interview reports with detailed candidate assessments and recommendations.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose HR Interview Portal?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Reduce hiring time, improve candidate quality, and make data-driven decisions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Save 80% Interview Time
                </h3>
                <p className="text-gray-600">
                  Automate scheduling and reduce manual work with intelligent workflow management.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  AI-Powered Insights
                </h3>
                <p className="text-gray-600">
                  Get detailed candidate analysis and recommendations based on interview performance.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Setup Required
                </h3>
                <p className="text-gray-600">
                  Get started immediately with zero configuration. Create jobs and start hiring today.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Built-in Analytics
                </h3>
                <p className="text-gray-600">
                  Track hiring metrics, candidate quality, and interview performance in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20 sm:mt-32">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Simple 4-step process to streamline your hiring
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Create Job
              </h3>
              <p className="text-sm text-gray-600 px-4">
                Post a job or let AI generate the description for you
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Receive Applications
              </h3>
              <p className="text-sm text-gray-600 px-4">
                Candidates apply with resumes and qualifications
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Schedule Interviews
              </h3>
              <p className="text-sm text-gray-600 px-4">
                Send interview invites and candidates join online
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Get Reports
              </h3>
              <p className="text-sm text-gray-600 px-4">
                Receive AI-generated reports and make decisions
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "This platform reduced our hiring cycle from 3 months to just 2 weeks. The AI recommendations are spot on."
              </p>
              <p className="font-semibold text-gray-900">Sarah Johnson</p>
              <p className="text-sm text-gray-600">HR Manager, Tech Startup</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The automation features save us hours every week. No more manual scheduling and follow-ups needed."
              </p>
              <p className="font-semibold text-gray-900">Mike Chen</p>
              <p className="text-sm text-gray-600">Recruiting Director, Fortune 500</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Best investment we made for our HR team. Quality of hires has improved significantly."
              </p>
              <p className="font-semibold text-gray-900">Emily Rodriguez</p>
              <p className="text-sm text-gray-600">CEO, Marketing Agency</p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mt-20 sm:mt-32">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Free to start, scales with your business
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Starter</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">For individuals and small teams</p>
              <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-4 sm:mb-6">
                Free
              </div>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                <li className="flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Up to 5 jobs</span>
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">50 applications/month</span>
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Basic reports</span>
                </li>
              </ul>
              <Link
                href="/signup"
                className="block w-full px-4 py-2 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium text-center text-sm sm:text-base"
              >
                Get Started
              </Link>
            </div>

            <div className="bg-primary-600 text-white p-6 sm:p-8 rounded-xl shadow-lg border-2 border-primary-600 relative">
              <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold">
                POPULAR
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">Professional</h3>
              <p className="text-sm sm:text-base text-primary-100 mb-4 sm:mb-6">For growing teams</p>
              <div className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
                $49<span className="text-base sm:text-lg text-primary-100">/mo</span>
              </div>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                <li className="flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
                  <span>Unlimited jobs</span>
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
                  <span>500 applications/month</span>
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
                  <span>AI descriptions</span>
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
                  <span>Advanced reports</span>
                </li>
              </ul>
              <Link
                href="/signup"
                className="block w-full px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-medium text-center text-sm sm:text-base"
              >
                Start Free Trial
              </Link>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">For large organizations</p>
              <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-4 sm:mb-6">
                Custom
              </div>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                <li className="flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Everything in Pro</span>
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Unlimited everything</span>
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">24/7 Support</span>
                </li>
              </ul>
              <button className="w-full px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors font-medium text-sm sm:text-base">
                Contact Sales
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 bg-primary-600 text-white rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of companies using HR Interview Portal to streamline their recruitment process.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold"
          >
            Start Your Free Trial Today
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>

        {/* FAQ Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            <details className="group cursor-pointer">
              <summary className="flex items-center justify-between bg-white p-6 rounded-lg border border-gray-200 hover:border-primary-300">
                <span className="text-lg font-semibold text-gray-900">
                  How do candidates apply for jobs?
                </span>
                <span className="text-primary-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 p-6 bg-gray-50 border-t border-gray-200">
                Candidates receive a unique link to your job posting where they can fill out an application form and upload their resume. The process is simple and mobile-friendly.
              </p>
            </details>

            <details className="group cursor-pointer">
              <summary className="flex items-center justify-between bg-white p-6 rounded-lg border border-gray-200 hover:border-primary-300">
                <span className="text-lg font-semibold text-gray-900">
                  Can I customize interview questions?
                </span>
                <span className="text-primary-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 p-6 bg-gray-50 border-t border-gray-200">
                Yes! You can customize interview questions, scoring criteria, and evaluation forms for each position to match your hiring needs.
              </p>
            </details>

            <details className="group cursor-pointer">
              <summary className="flex items-center justify-between bg-white p-6 rounded-lg border border-gray-200 hover:border-primary-300">
                <span className="text-lg font-semibold text-gray-900">
                  Is there a limit to the number of interviews?
                </span>
                <span className="text-primary-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 p-6 bg-gray-50 border-t border-gray-200">
                No! You can schedule unlimited interviews. The limits only apply to new applications per month based on your plan.
              </p>
            </details>

            <details className="group cursor-pointer">
              <summary className="flex items-center justify-between bg-white p-6 rounded-lg border border-gray-200 hover:border-primary-300">
                <span className="text-lg font-semibold text-gray-900">
                  What file formats are supported for resumes?
                </span>
                <span className="text-primary-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 p-6 bg-gray-50 border-t border-gray-200">
                We support PDF, DOC, and DOCX formats. Files up to 5MB are accepted. This ensures compatibility with most resume formats.
              </p>
            </details>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-32 text-center">
          <p className="text-xl text-gray-600 mb-8">
            Have questions? <Link href="/login" className="text-primary-600 hover:underline">Get started free today</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
