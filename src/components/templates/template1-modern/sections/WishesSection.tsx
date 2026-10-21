import React from 'react';
import type { WishesSectionProps } from '../../types';

export const WishesSection: React.FC<WishesSectionProps> = ({
  data,
  wishes,
  wishForm,
  setWishForm,
  wishSubmitted,
  handleWishSubmit,
  renderBrandFooter,
}) => {
  return (
    <section id="wishes" className="py-12 px-6">
      <div className="text-center mb-8">
        <span className="text-[11px] tracking-[0.3em] uppercase text-gold-champagne font-medium">
          Buku Tamu
        </span>
        <h2 className="font-editorial text-3xl text-charcoal-dark font-normal mt-1">
          Ucapan &amp; Doa Restu
        </h2>
        <p className="text-xs text-charcoal-muted mt-1 font-light">
          Tuliskan pesan penuh cinta untuk kedua mempelai
        </p>
      </div>

      {/* Input Wishes Form */}
      <div className="bg-white border border-border-subtle rounded-2xl p-5 shadow-sm mb-8">
        {wishSubmitted && (
          <div className="mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center">
            Ucapan berhasil dikirim! Terima kasih atas doa restunya.
          </div>
        )}
        <form onSubmit={handleWishSubmit} className="space-y-3">
          <input
            type="text"
            value={wishForm.name}
            onChange={(e) => setWishForm({ ...wishForm, name: e.target.value })}
            placeholder="Nama Anda"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-border-subtle bg-alabaster text-xs text-charcoal-dark focus:outline-none focus:border-gold-champagne focus:bg-white transition-all"
          />
          <textarea
            rows={3}
            value={wishForm.message}
            onChange={(e) => setWishForm({ ...wishForm, message: e.target.value })}
            placeholder="Tuliskan ucapan dan doa terbaik Anda..."
            required
            className="w-full px-4 py-2.5 rounded-xl border border-border-subtle bg-alabaster text-xs text-charcoal-dark focus:outline-none focus:border-gold-champagne focus:bg-white transition-all resize-none"
          ></textarea>
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-charcoal-dark text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-gold-champagne transition-colors shadow flex items-center justify-center space-x-2 cursor-pointer"
          >
            <i className="fa-regular fa-paper-plane text-xs"></i>
            <span>Kirim Ucapan</span>
          </button>
        </form>
      </div>

      {/* Scrollable Guest Comment Cards */}
      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {wishes.map((wish) => {
          const initials = wish.guest_name
            ? wish.guest_name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()
            : 'TM';

          return (
            <div key={wish.id} className="bg-white border border-border-subtle rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-gold-light border border-gold-champagne/40 flex items-center justify-center text-gold-champagne text-xs font-semibold">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-semibold text-charcoal-dark break-words [overflow-wrap:anywhere]">{wish.guest_name}</h5>
                    <span className="text-[9px] text-charcoal-muted">
                      {new Date(wish.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-charcoal-dark/80 font-light leading-relaxed pl-9 break-words [overflow-wrap:anywhere]">
                {wish.message}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer Thank You */}
      <div className="text-center pt-10 pb-2">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gold-champagne font-medium mb-1">
          Terima Kasih
        </p>
        <h3 className="font-editorial text-2xl text-charcoal-dark font-normal">
          {data.groom.name} &amp; {data.bride.name}
        </h3>
        <p className="text-[10px] text-charcoal-muted tracking-widest mt-2 font-light">
          {data.hashtag} &bull; 2026
        </p>

        {/* Dynamic mbell Invitations Brand Signature Footer */}
        {renderBrandFooter()}
      </div>
    </section>
  );
};