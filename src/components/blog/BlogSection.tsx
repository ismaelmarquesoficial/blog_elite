import { FeaturedPostSlider } from './FeaturedPostSlider';
import { PopularPosts } from './PopularPosts';
import { MonthlyEvents } from './MonthlyEvents';
import { Celebrations } from './Celebrations';
import { Birthdays } from './Birthdays';
import { UpcomingEvents } from './UpcomingEvents';
import { PastEvents } from './PastEvents';

export function BlogSection() {
  return (
    <div className="py-12 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Post Slider */}
        <div className="mb-16">
          <FeaturedPostSlider />
        </div>

        {/* Rest of the sections remain unchanged */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">
            <span className="bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text text-transparent">
              Últimas Publicações
            </span>
          </h2>
          <PopularPosts />
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">
            <span className="bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text text-transparent">
              Eventos do Mês
            </span>
          </h2>
          <MonthlyEvents />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <section>
            <h2 className="text-2xl font-bold text-white mb-8">
              <span className="bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text text-transparent">
                Confraternizações
              </span>
            </h2>
            <Celebrations />
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-8">
              <span className="bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text text-transparent">
                Aniversariantes do Mês
              </span>
            </h2>
            <Birthdays />
          </section>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">
            <span className="bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text text-transparent">
              Eventos Realizados
            </span>
          </h2>
          <PastEvents />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-8">
            <span className="bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text text-transparent">
              Próximos Eventos
            </span>
          </h2>
          <UpcomingEvents />
        </section>
      </div>
    </div>
  );
}

export default BlogSection;