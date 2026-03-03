export default function BrandGuidelines() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0b1630] py-10 px-4 sm:px-6 md:px-10 lg:px-16">
        <h1 className="text-white text-2xl sm:text-3xl font-bold mb-2">Brand Guidelines</h1>
        <p className="text-blue-200/60 text-sm">ALVIO Automotive Marketplace — design tokens and usage</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="text-gray-900 font-bold text-lg mb-4">Brand name</h2>
          <p className="text-gray-600 text-sm">ALVIO — used in app title, PWA name, PDF reports, and email signatures.</p>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="text-gray-900 font-bold text-lg mb-4">Colors</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="h-16 rounded-xl bg-[#3b82f6]" />
              <p className="text-sm font-medium text-gray-700 mt-2">Primary blue</p>
              <p className="text-xs text-gray-400">#3b82f6</p>
            </div>
            <div>
              <div className="h-16 rounded-xl bg-[#0b1630]" />
              <p className="text-sm font-medium text-gray-700 mt-2">Header / dark</p>
              <p className="text-xs text-gray-400">#0b1630</p>
            </div>
            <div>
              <div className="h-16 rounded-xl bg-[#0a0a0f]" />
              <p className="text-sm font-medium text-gray-700 mt-2">Background dark</p>
              <p className="text-xs text-gray-400">#0a0a0f</p>
            </div>
            <div>
              <div className="h-16 rounded-xl bg-[#0f1d40]" />
              <p className="text-sm font-medium text-gray-700 mt-2">Cards / dropdown</p>
              <p className="text-xs text-gray-400">#0f1d40</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="text-gray-900 font-bold text-lg mb-4">Typography</h2>
          <p className="text-gray-600 text-sm mb-2">Primary font: <strong>Inter</strong> (system fallback: system-ui, sans-serif).</p>
          <p className="text-2xl font-sans text-gray-900">Sample heading — Inter</p>
          <p className="text-sm text-gray-600 mt-1">Body text for readability and UI labels.</p>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="text-gray-900 font-bold text-lg mb-4">Iconography & assets</h2>
          <p className="text-gray-600 text-sm">PWA icons (72px–512px) live in <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">/public/icons/</code>. Logo: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">/alvio-logo.png</code>. Use consistent stroke weight (e.g. 1.5–2) for inline SVG icons.</p>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="text-gray-900 font-bold text-lg mb-4">UI patterns</h2>
          <ul className="text-gray-600 text-sm space-y-2 list-disc list-inside">
            <li>Page headers: dark strip <span className="text-gray-400">(#0b1630)</span> with white title and blue-200/60 subtitle.</li>
            <li>Cards: white background, <span className="text-gray-400">rounded-2xl</span>, <span className="text-gray-400">border border-gray-100</span>.</li>
            <li>Primary buttons: <span className="text-gray-400">bg-blue-500 hover:bg-blue-600</span>, rounded-xl or rounded-full.</li>
            <li>Loading: blue spinner <span className="text-gray-400">border-blue-500 border-t-transparent</span>.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
