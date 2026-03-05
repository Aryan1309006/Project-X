function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-slate-950 text-white
      [background-image:linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)]
      [background-size:96px_96px]"
    >

      {/* Left Radial Glow */}
      <div className="absolute inset-0 
                      bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18),transparent_40%)]">
      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-6 pt-10 pb-20 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 
                        bg-white/5 border border-white/10 
                        backdrop-blur-sm 
                        rounded-full px-4 py-2 
                        text-sm text-gray-300 mb-8">
          <span className="nav-link"><i className="fa-solid fa-bolt"></i></span>
           Powering India's EV Revolution
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold leading-tight">
          Find EV Charging
          <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-bold bg-gradient-to-t from-emerald-300 to-teal-500 bg-clip-text text-transparent">
            Stations Near You
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
          Discover 10,000+ charging stations across India. 
          Fast, reliable, and always available when you need them.
        </p>

       {/* Search Section */}
<div className="relative mt-12 max-w-3xl mx-auto group">

  {/* Glow */}
  <div className="absolute -inset-1 rounded-xl 
                  bg-gradient-to-r from-emerald-400 to-teal-600 
                  blur opacity-40 
                  transition-all duration-300 
                  group-hover:opacity-80">
  </div>

  {/* Search Bar */}
  <div className="relative 
                  bg-white/95 
                  rounded-2xl 
                  p-3 
                  flex flex-col sm:flex-row 
                  items-center gap-3 
                  shadow-xl">

    <input
      type="text"
      placeholder="Search by city, area, or station name..."
      className="flex-1 bg-transparent outline-none px-4 py-3 
                 text-gray-800 placeholder-gray-500"
    />

    <button className="w-full sm:w-auto 
                       bg-gradient-to-t from-emerald-400 to-teal-600
                       cursor-pointer transition 
                       hover:brightness-110 hover:scale-105
                       px-6 py-3 
                       rounded-xl font-medium text-white">
      Search
    </button>

  </div>
</div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">

          <div>
            <p className="text-3xl font-bold">10,000+</p>
            <p className="text-gray-400 text-sm">Charging Stations</p>
          </div>

          <div>
            <p className="text-3xl font-bold">500+</p>
            <p className="text-gray-400 text-sm">Cities Covered</p>
          </div>

          <div>
            <p className="text-3xl font-bold">50M+</p>
            <p className="text-gray-400 text-sm">kWh Delivered</p>
          </div>

          <div>
            <p className="text-3xl font-bold">24/7</p>
            <p className="text-gray-400 text-sm">Availability</p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;