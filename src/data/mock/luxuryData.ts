import type { InvitationData, ThemeConfig, WishItem } from '../../types/invitation';

export const MOCK_LUXURY_DATA: InvitationData = {
  groom: {
    name: 'Romeo',
    full_name: 'Romeo Alexander Hartanto, B.Eng',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAfFqftByZ1-_ZWDn1o_4G2ekb5gP-Q-y84vdEx2oDTnAsEuQ_6MApK1pcFRBnky76TwFZ8tH6Vbl4rt4uIFnGMDMB4uihlEBNMeY0d92SP1cLEJ4OEL4rlqbDfrsogxPpAnw8rqogO7CRsiNP0kpgwPxW4hFholWdz8ly9EBqDBXcQ5nNcQoqFyRgZBYEZuC_BwPGQIr20JJ0Zm1O3UTlFKNxfx5mmCWzsO3eHsX4Ef_bPaf6cOMYp',
    parent_father: 'Bpk. Richard Hartanto',
    parent_mother: 'Ibu Eleanor Hartanto',
    child_order: 'Putra pertama dari',
    instagram: '@romeohartanto',
  },
  bride: {
    name: 'Juliet',
    full_name: 'Juliet Aurelia Kusuma, B.A',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAFwANbTvSsZUdGjlzds4oJiWoKicpbrm0kWRK0QksxyY1gplF9mTLVRBQRBW6WseyDXtdGmF7C3-M9FCGcSlofCBk-85wF0PahioovGYHRuarpqI7X8zvDoiNjHrXNdxP1GIE0t0-tc5_r1MzTUCUyuOMUW_79wagxHjqvHjCEjrxjIIg9nygK2h1prePS1K5KEp4yPHK_wyCDBmknimC92Q8HCW24_JTBJ1JRz56UhkGopSfKQ9PS',
    parent_father: 'Bpk. Adipati Kusuma',
    parent_mother: 'Ibu Veronica Kusuma',
    child_order: 'Putri bungsu dari',
    instagram: '@julietaurelia',
  },
  theme_id: 'luxury',
  is_bride_first: false,
  cover_image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAyyV8nYnWx2tEy7LxLdEPijzUQ2lkIshsrFjKYWD-tNhUs38wKz_untFwzYcIsu_NefUSV9tF1RgMhUS20kKyhra-0O76kwWMBZ1ffHnOhSwWov-uD4wkM5HmVLdVENobwnjuIzZ7fA63bQ9wacLZHJwGse9Fgnz4NRkTLd0fhnZ12nesIAdenQ-acjOcQhtncKgj5t-ndrKTTg8xT-MicB-xM2ZlycPDmo7r8XlBPTaO2n0YPvhMZ',
  couple_photo:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAyyV8nYnWx2tEy7LxLdEPijzUQ2lkIshsrFjKYWD-tNhUs38wKz_untFwzYcIsu_NefUSV9tF1RgMhUS20kKyhra-0O76kwWMBZ1ffHnOhSwWov-uD4wkM5HmVLdVENobwnjuIzZ7fA63bQ9wacLZHJwGse9Fgnz4NRkTLd0fhnZ12nesIAdenQ-acjOcQhtncKgj5t-ndrKTTg8xT-MicB-xM2ZlycPDmo7r8XlBPTaO2n0YPvhMZ',

  wedding_date_iso: '2026-10-24T10:00:00+07:00',
  wedding_date_display: 'Saturday, 24 October 2026',

  quote_title: 'Royal Love Quote',
  quote_religion: 'universal',
  quote_arabic: '',
  quote:
    'Two souls bound under the quiet grandeur of the midnight sky, beginning their forever.',
  quote_source: 'Union & Grace',
  hashtag: '#RomeoJulietGala',

  dresscode: {
    enabled: true,
    title: 'Panduan Busana (Dress Code)',
    subtitle:
      'Tamu undangan diharapkan mengenakan pakaian formal pesta / black-tie attire bernuansa royal berikut:',
    colors: [
      { name: 'Royal Emerald', hex: '#0F4C3A' },
      { name: 'Pure Gold Foil', hex: '#D4AF37' },
      { name: 'Obsidian Black', hex: '#121816' },
      { name: 'Royal Platinum', hex: '#E2E8F0' },
      { name: 'Ivory Silk', hex: '#FAF8F5' },
    ],
  },

  events: [
    {
      name: 'Holy Matrimony / Akad',
      title: 'Chapter I',
      date: 'Saturday, 24 October 2026',
      time: '10:00 - 12:00 WIB',
      venue_name: 'The Glass Sanctuary, The St. Regis Jakarta',
      venue_address: 'Kuningan, Setiabudi, Jakarta Selatan',
      maps_url: 'https://maps.google.com',
      badge: 'Chapter I',
      icon: 'diamond',
    },
    {
      name: 'Evening Gala Reception',
      title: 'Chapter II',
      date: 'Saturday, 24 October 2026',
      time: '18:30 - 23:00 WIB',
      venue_name: 'The Astor Grand Ballroom, The St. Regis Jakarta',
      venue_address: 'Rajawali Place, Jl. H. R. Rasuna Said, Jakarta Selatan',
      maps_url: 'https://maps.google.com',
      badge: 'Chapter II',
      icon: 'styler',
    },
  ],

  love_story: [
    {
      year: 'OCTOBER 2020',
      title: 'The Serendipitous Encounter',
      subtitle: 'Paris, France',
      description:
        'An autumn gala in Paris where our stolen glances turned into spontaneous midnight conversations that lasted till dawn.',
      icon: 'auto_awesome',
    },
    {
      year: 'APRIL 2023',
      title: 'The Promise in Kyoto',
      subtitle: 'Kyoto, Japan',
      description:
        'Under a quiet canopy of midnight cherry blossoms, a shared silence gave way to an eternal promise sealed with a ring.',
      icon: 'diamond',
    },
    {
      year: 'OCTOBER 2026',
      title: 'Forever Begins Tonight',
      subtitle: 'Jakarta, Indonesia',
      description:
        'Hand in hand, gathering our closest circle to witness two worlds intertwining under timeless luxury.',
      icon: 'celebration',
    },
  ],

  gallery: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAyyV8nYnWx2tEy7LxLdEPijzUQ2lkIshsrFjKYWD-tNhUs38wKz_untFwzYcIsu_NefUSV9tF1RgMhUS20kKyhra-0O76kwWMBZ1ffHnOhSwWov-uD4wkM5HmVLdVENobwnjuIzZ7fA63bQ9wacLZHJwGse9Fgnz4NRkTLd0fhnZ12nesIAdenQ-acjOcQhtncKgj5t-ndrKTTg8xT-MicB-xM2ZlycPDmo7r8XlBPTaO2n0YPvhMZ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAfFqftByZ1-_ZWDn1o_4G2ekb5gP-Q-y84vdEx2oDTnAsEuQ_6MApK1pcFRBnky76TwFZ8tH6Vbl4rt4uIFnGMDMB4uihlEBNMeY0d92SP1cLEJ4OEL4rlqbDfrsogxPpAnw8rqogO7CRsiNP0kpgwPxW4hFholWdz8ly9EBqDBXcQ5nNcQoqFyRgZBYEZuC_BwPGQIr20JJ0Zm1O3UTlFKNxfx5mmCWzsO3eHsX4Ef_bPaf6cOMYp',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAFwANbTvSsZUdGjlzds4oJiWoKicpbrm0kWRK0QksxyY1gplF9mTLVRBQRBW6WseyDXtdGmF7C3-M9FCGcSlofCBk-85wF0PahioovGYHRuarpqI7X8zvDoiNjHrXNdxP1GIE0t0-tc5_r1MzTUCUyuOMUW_79wagxHjqvHjCEjrxjIIg9nygK2h1prePS1K5KEp4yPHK_wyCDBmknimC92Q8HCW24_JTBJ1JRz56UhkGopSfKQ9PS',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDKBB8-qibEzbBkPMwrhruecaVqCTj6fThLAIftriWYQb_Jr9oOQNZsti0sdxmAw-dBIGnnZLg_B2gWx5bcAGWOHfjrEjaV8fgvKzWYXLg1qcqawihV2iNK5ocY1uqHGObqQys82uAFSlcqv-dDBDd4O20dQP0ifd3d4FGLQV8K1v7cQU-sERZWui33Jy8nJvP0gYju3iOYDx3c7xRKmm1axbS8vyXNjuGAJakCVZqShadjtVUyKC-8',
  ],

  banks: [
    {
      bank_name: 'BANK BCA',
      account_number: '8820 1938 4920',
      account_number_raw: '882019384920',
      account_holder: 'Romeo Hartanto',
    },
    {
      bank_name: 'BANK MANDIRI',
      account_number: '1370 0293 8472',
      account_number_raw: '137002938472',
      account_holder: 'Juliet Aurelia',
    },
  ],
  qris_url: '',
  gift_address:
    'The St. Regis Residences, Penthouse Suite 38A, Kuningan, Setiabudi, Jakarta Selatan 12920',

  guest_name: 'Bapak / Ibu / Saudara(i) Dian Sastrowardoyo & Partner',
  guest_code: 'LUX-2026',
  livestream_url: undefined,
};

export const MOCK_LUXURY_THEME: ThemeConfig = {
  primary_color: '#dec38f',
  music_url: '',
  active_sections: [
    'cover',
    'hero',
    'quote',
    'couple',
    'event',
    'dresscode',
    'story',
    'gallery',
    'rsvp',
    'gift',
    'wishes',
  ],
  show_quote: true,
  show_dresscode: true,
  show_gallery: true,
  show_love_story: true,
  show_rsvp: true,
  show_gift: true,
  show_wishes: true,
};

export const MOCK_LUXURY_WISHES: WishItem[] = [
  {
    id: '1',
    guest_name: 'Reza Rahadian',
    message:
      'Selamat menempuh babak baru yang penuh keindahan Romeo & Juliet. May your union shine with perpetual elegance and joy!',
    attendance: 'attending',
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    guest_name: 'Nicholas Saputra',
    message:
      'A truly magnificent match. Looking forward to celebrating this historic evening with you both at the St. Regis!',
    attendance: 'attending',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    guest_name: 'Tante Maya & Family',
    message:
      'Semoga cinta dan berkat senantiasa menyertai setiap langkah kalian hingga hari tua. Bahagia selalu anak-anakku.',
    attendance: 'attending',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];
