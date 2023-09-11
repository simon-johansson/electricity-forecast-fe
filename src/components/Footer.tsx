const navigation = {
  main: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Jobs", href: "#" },
    { name: "Press", href: "#" },
    { name: "Accessibility", href: "#" },
    { name: "Partners", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="w-full bg-white">
      <div className="mx-auto max-w-4xl px-4 pb-8 pt-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between border-b border-black border-opacity-10 pb-12 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center text-gray-900">
              <a href="/#">
                <p className="text-xl font-semibold tracking-tighter">MyEnergyPrice</p>
              </a>
            </div>
            <div className="mt-2">
              <p className="hover:delay-0 relative text-sm text-gray-700 transition-colors delay-150 hover:text-gray-900">
                Contact us:{" "}
                <a className="underline" href="mailto:info@eterniaenergy.se">
                  info@eterniaenergy.se
                </a>
              </p>
            </div>
            <nav className="mt-8 flex gap-8">
              <a
                className="hover:delay-0 relative -mx-3 -my-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors delay-150 hover:text-gray-900"
                href="/#forecasts"
              >
                <span className="relative z-10">Forecasts</span>
              </a>
              <a
                className="hover:delay-0 relative -mx-3 -my-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors delay-150 hover:text-gray-900"
                href="/#faqs"
              >
                <span className="relative z-10">FAQs</span>
              </a>
            </nav>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-7 divide-y pt-12 sm:divide-x sm:divide-y-0">
          <div className="col-span-2 sm:col-span-1">
            <h3 className="mb-2 text-sm font-semibold leading-6">Disclaimer</h3>
            <p className="text-xs leading-5 text-slate-600">
              Please note that the electricity price forecast provided is based on a fundamental
              analysis of the underlying factors that affect supply and demand in the electricity
              market. While we believe that our model is accurate and reliable, we cannot guarantee
              the accuracy of the forecast. The electricity market can be volatile and subject to
              unexpected events or changes, which can impact the accuracy of the forecast.
              Therefore, this forecast should be used as a guide only, and not as a guarantee of
              future electricity prices. We recommend that you consult with a professional energy
              advisor or conduct your own analysis before making any energy-related decisions based
              on this forecast.
            </p>
            <br />
            <p className="text-xs leading-5 text-slate-600">
              All prices in the forecast exclude your local Energy-Tax, VAT, and any mark-ups from
              your supplier.
            </p>
          </div>
          <div className="col-span-2 pt-6 sm:col-span-1 sm:pl-6 sm:pt-0">
            <h3 className="mb-2 text-sm font-semibold leading-6">Privacy</h3>
            <p className=" text-xs leading-5 text-slate-600">
              At MyEnergyPrice.eu, we take data privacy seriously and are fully committed to GDPR
              compliance. Our electricity forecast model is built using industry-standard security
              measures to protect personal data, and we never share personal information with third
              parties without explicit consent. By using our services, you can trust that your data
              is handled responsibly and with the utmost care.
            </p>
          </div>
        </div>

        <div className="mt-12 md:flex md:items-center md:justify-between">
          <p className="text-xs leading-5 text-gray-400 md:order-1 md:mt-0">
            &copy; 2023 My Energy Price, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
