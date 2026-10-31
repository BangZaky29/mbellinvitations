import type { InvitationData, ThemeConfig, WishItem } from '../../types/invitation';

export const MOCK_BALI_DATA: InvitationData = {
  groom: {
    name: 'Bagus Arya',
    full_name: 'Anak Agung Bagus Arya Wiguna, S.T., M.M.',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuABcncbuZFV_wDzfMUSvzivw-WHG_DjWI9kngwMeqJZ0BAubTO1Gl8p2oRc1RuKpFBJnUQrlg5KAfFNkYFEgd_xZFmJJTjw7zTOjbGT0YXz9b4Iwh1y3HrsFtKWrwr8YVldPkiXSkPxFYFn4oOK2F4dYqepT4iK13iRBvDQhDSvVJ9x1AoZJAlQGSzQP8BfoyZAEWjXIPO49XiCzb6CW-Gr1Qp_na6I-KPOzWd11_68t3R7D0RTqVim',
    parent_father: 'Anak Agung Ngurah Gede',
    parent_mother: 'Desak Made Ratna',
    child_order: 'Putra sulung dari Pasangan',
    parent_info: 'Anak Agung Ngurah Gede & Desak Made Ratna',
    instagram: '@bagus.arya',
  },
  bride: {
    name: 'Ayu Bulan',
    full_name: 'Sang Ayu Bulan Prameswari, S.Sn.',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCcx_gA9cokEyxGX8Q2h3fZIyaObh-zLYHM2MaPrB-0ciUqHebb0HhOvB9Xf8a87TqeGJCnr2MuBFDjvrbCNiPbHh9hje2lfw5eLOPLtijquq6iuQypqF2yr2OLAG--gypnOeXusufPCmvgx7P_qOnXSvxkpWzS5YJg6Q1-xeEc8llvhH3uTUTNIcCssHctxx0Vp7OXzRKzAW1Ac7A3jNJL2xl-406D7I4c0qWORkaXZTNvX2OB59yP',
    parent_father: 'I Gusti Made Suweta',
    parent_mother: 'Ni Luh Made Kencana',
    child_order: 'Putri kedua dari Pasangan',
    parent_info: 'I Gusti Made Suweta & Ni Luh Made Kencana',
    instagram: '@bulan.prameswari',
  },
  theme_id: 'bali',
  is_bride_first: false,
  cover_image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC4x4igP0XPajQ_Pab5_XqwvaY5w1ng7fkVbONU9DhQ_7kXap53kK5vWctMJnblAQJHxIVltulHlIqEcXuX2blF47I9NDrAEAxormr6O8qUAkxRu64IC52pzA1v85E0GwtCQ89U8CZFJxHsXUUNLq5gip6KwNwylFpFv_ak2GnLwoQIDvQej1kgynO4f5bTQK8J1kGQh385j1qUtgmFi0a4QlWJfNhW1NBTkhe9dceAHKzsri305b8R',
  couple_photo:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC4x4igP0XPajQ_Pab5_XqwvaY5w1ng7fkVbONU9DhQ_7kXap53kK5vWctMJnblAQJHxIVltulHlIqEcXuX2blF47I9NDrAEAxormr6O8qUAkxRu64IC52pzA1v85E0GwtCQ89U8CZFJxHsXUUNLq5gip6KwNwylFpFv_ak2GnLwoQIDvQej1kgynO4f5bTQK8J1kGQh385j1qUtgmFi0a4QlWJfNhW1NBTkhe9dceAHKzsri305b8R',

  wedding_date_iso: '2026-11-28T08:30:00+08:00',
  wedding_date_display: 'Sabtu, 28 November 2026',
  countdown_target: 'resepsi',

  quote_title: 'Mantra Sloka Pawiwahan',
  quote_religion: 'hindu',
  quote_arabic:
    'ॐ गृभ्णामि ते सुप्रजास्त्वाय हस्तं मया पत्या जरदष्टिर्यथासः',
  quote:
    '“Grbhnami te suprajastvaya hastam mayya patya jaradastir yatha”',
  quote_source:
    'Rgveda X.85.36 — “Aku memegang tanganmu demi kebahagiaan dan keturunan yang utama, semoga engkau hidup bersamaku sebagai pasangan hingga masa tua tiba.”',
  hashtag: '#AryaBulanPawiwahan',

  dresscode: {
    enabled: true,
    title: 'Panduan Busana Tamu (Attire Guide)',
    subtitle:
      'Tamu terhormat dipersilakan mengenakan busana Wastra Adat Madya / Tenun Endek / Songket Bali dengan palet tropis alami:',
    colors: [
      { name: 'Bata Candi', hex: '#9E3B2B' },
      { name: 'Krem Alami', hex: '#F5EFE6' },
      { name: 'Prada Emas', hex: '#D4AF37' },
      { name: 'Zaitun Tropis', hex: '#3A422E' },
      { name: 'Arang Hitam', hex: '#261C18' },
    ],
  },

  events: [
    {
      name: 'Upacara Mepandes / Potong Gigi',
      title: 'Upacara Mepandes / Potong Gigi',
      date: 'Sabtu, 28 November 2026',
      time: '08:30 WITA',
      start_time: '08:30',
      end_time: '10:00',
      timezone: 'WITA',
      venue_name: 'Puri Santrian Sanctuary - Bale Kambang',
      venue_address: 'Jl. Raya Sanggingan No. 88, Sayan, Ubud, Kabupaten Gianyar, Bali 80571',
      maps_url: 'https://maps.google.com/?q=-8.5034,115.2536',
    },
    {
      name: 'Upacara Pawiwahan & Makala-kalaan',
      title: 'Upacara Pawiwahan & Makala-kalaan',
      date: 'Sabtu, 28 November 2026',
      time: '10:00 WITA',
      start_time: '10:00',
      end_time: '12:00',
      timezone: 'WITA',
      venue_name: 'Puri Santrian Sanctuary & Ubud Royal Pavilion',
      venue_address: 'Jl. Raya Sanggingan No. 88, Sayan, Ubud, Kabupaten Gianyar, Bali 80571',
      maps_url: 'https://maps.google.com/?q=-8.5034,115.2536',
    },
    {
      name: 'Majanguk & Ramah Tamah Puri',
      title: 'Majanguk & Ramah Tamah Puri',
      date: 'Sabtu, 28 November 2026',
      time: '12:30 WITA',
      start_time: '12:30',
      end_time: '15:00',
      timezone: 'WITA',
      venue_name: 'Pelataran Wantilan Puri Agung Ubud',
      venue_address: 'Jl. Raya Sanggingan No. 88, Sayan, Ubud, Kabupaten Gianyar, Bali 80571',
      maps_url: 'https://maps.google.com/?q=-8.5034,115.2536',
    },
    {
      name: 'Sunset Royal Dinner & Reception',
      title: 'Sunset Royal Dinner & Reception',
      date: 'Sabtu, 28 November 2026',
      time: '16:30 - 21:00 WITA',
      start_time: '16:30',
      end_time: '21:00',
      timezone: 'WITA',
      venue_name: 'Pelataran Candi Bentar Ubud Royal Sanctuary',
      venue_address: 'Jl. Raya Sanggingan No. 88, Sayan, Ubud, Kabupaten Gianyar, Bali 80571',
      maps_url: 'https://maps.google.com/?q=-8.5034,115.2536',
    },
  ],

  love_story: [
    {
      year: '2020',
      title: 'Pertemuan Pertama di Ubud',
      story:
        'Di tengah alunan semilir angin lembah Campuhan Ubud dan gemulai tari Legong Keraton, takdir mempertemukan kami untuk pertama kali dalam sebuah pameran seni budaya Bali.',
    },
    {
      year: '2023',
      title: 'Matur Piuning & Kesepakatan Jiwa',
      story:
        'Dengan restu kedua orang tua di hadapan leluhur keluarga puri, kami memohon bimbingan Hyang Widhi untuk menyatukan dua langkah dalam sebuah komitmen suci berlandaskan Dharma.',
    },
    {
      year: '2026',
      title: 'Dharma Yadnya Pawiwahan Ageng',
      story:
        'Kini, diiringi doa suci Rgveda dan berkah Ida Pedanda, kami mengikat janji suci pernikahan abadi menuju kehidupan Grhastha Asrama yang harmonis dan penuh cinta.',
    },
  ],

  gallery: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC4x4igP0XPajQ_Pab5_XqwvaY5w1ng7fkVbONU9DhQ_7kXap53kK5vWctMJnblAQJHxIVltulHlIqEcXuX2blF47I9NDrAEAxormr6O8qUAkxRu64IC52pzA1v85E0GwtCQ89U8CZFJxHsXUUNLq5gip6KwNwylFpFv_ak2GnLwoQIDvQej1kgynO4f5bTQK8J1kGQh385j1qUtgmFi0a4QlWJfNhW1NBTkhe9dceAHKzsri305b8R',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAY8Q7lxXz0s6p5cs4O63Me2lLpKFRTZjRVneZNkaRjsBRUwj5FKaDZfxgBk1qBI7PYwT2pe3kQ2Yqb5XpYb3UEAU8yUUBVkdaqOhpdqPmvuJ8OLfI5WozIcTlO2J1HYNyoh5BxmcL4LeyEOu5abtl4m-ksqcmeu_G1B_eKiWD-8ONfOTwtqSWnBzd-r4js8caEWXS1BtAIfxVUD0qENVOQJPYZ4sB116_J0wM5FEFxmb_tDfW8cWjN',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuABcncbuZFV_wDzfMUSvzivw-WHG_DjWI9kngwMeqJZ0BAubTO1Gl8p2oRc1RuKpFBJnUQrlg5KAfFNkYFEgd_xZFmJJTjw7zTOjbGT0YXz9b4Iwh1y3HrsFtKWrwr8YVldPkiXSkPxFYFn4oOK2F4dYqepT4iK13iRBvDQhDSvVJ9x1AoZJAlQGSzQP8BfoyZAEWjXIPO49XiCzb6CW-Gr1Qp_na6I-KPOzWd11_68t3R7D0RTqVim',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCcx_gA9cokEyxGX8Q2h3fZIyaObh-zLYHM2MaPrB-0ciUqHebb0HhOvB9Xf8a87TqeGJCnr2MuBFDjvrbCNiPbHh9hje2lfw5eLOPLtijquq6iuQypqF2yr2OLAG--gypnOeXusufPCmvgx7P_qOnXSvxkpWzS5YJg6Q1-xeEc8llvhH3uTUTNIcCssHctxx0Vp7OXzRKzAW1Ac7A3jNJL2xl-406D7I4c0qWORkaXZTNvX2OB59yP',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDg7gbAKksXNKaLTfhtk7rMc0z9Jgm15UY2j7tCZkjfS2CeobS69ozf6cqMrXpYz2iUaSdYr6MZjojziUGzhAzqk0p9cGTHa2I4AEnoxVscFr5ZdNwbh5n6DpbHTC_eflR--ZPYuQqjwkinJKvcxmrBodAJKyJYcTHZVYcvMQI5a9r_UiVAuWjeksQz7P5_rFSnUKUrtVzAMS3HzBiHy-AKN2XJILTlJ88mAQWSGna8Szi1KTjNSPJL',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAqQqmLzCfwk95PDLEs9yU1gy6PxwJdIeTPuyuLi79MiLFuEARix4a0An1ZElsOxGnZEAIXyqY5GhPIiRS41oOFyN-nBctY9-ERO7baG4k1XGhLrJmJn1p-3gPCarzP5ghEEtSrCYtTJ8quXqVGmmQYUZRczPVQhTRWzN4LSg0wVDbLtNYxOpCWLB10s9jTGEH3J-rfOPMzE5ncE_QJw9JceZMXdzO9v0QGIeKUR7gizq0KfzyBWJiO',
  ],

  banks: [
    {
      bank_name: 'Bank Central Asia (BCA)',
      account_number: '7720891204',
      account_holder: 'Anak Agung Bagus Arya Wiguna',
    },
    {
      bank_name: 'Bank Mandiri',
      account_number: '14500987721',
      account_holder: 'Sang Ayu Bulan Prameswari',
    },
  ],

  gift_address:
    'Puri Agung Ubud • Kediaman Bagus Arya & Ayu Bulan\nJl. Suweta No. 12, Ubud, Kecamatan Ubud, Kabupaten Gianyar, Bali 80571\n(Konfirmasi penerima: +62 812-3456-7890)',

  streaming_url: 'https://youtube.com/live',
  livestream_url: 'https://youtube.com/live',
  guest_name: 'Bapak/Ibu/Saudara/i',
};

export const MOCK_BALI_THEME: ThemeConfig = {
  primary_color: '#411710',
  music_url:
    'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
  music_title: 'Gamelan Semar Pegulingan • Laras Pelog',
  active_sections: [
    'cover',
    'hero',
    'quote',
    'couple',
    'event',
    'dresscode',
    'story',
    'gallery',
    'gift',
    'rsvp',
    'wishes',
    'livestream',
  ],
  show_quote: true,
  show_dresscode: true,
  show_gallery: true,
  show_love_story: true,
  show_gift: true,
  show_rsvp: true,
  show_wishes: true,
  show_livestream: false,
};

export const MOCK_BALI_WISHES: WishItem[] = [
  {
    id: 'w-bali-1',
    guest_name: 'Ida Bagus Made Mantra & Keluarga (Puri Griya Sanur)',
    attendance: 'attending',
    message:
      'Om Swastyastu. Rahajeng ngemargiang Pawiwahan Ageng Arya & Ayu Bulan. Dumogi langgeng riwekasan, labda karya, tur nemu karahayuan lan kerahayuan sarwa dharma. Om Shanti Shanti Shanti Om.',
    created_at: '2026-11-20T10:15:00Z',
  },
  {
    id: 'w-bali-2',
    guest_name: 'Cokorda Gede Putra (Puri Agung Ubud)',
    attendance: 'attending',
    message:
      'Selamat atas terlaksananya ikatan suci Dharma Yadnya Bagus Arya & Bulan Prameswari. Semoga senantiasa diberkahi Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa.',
    created_at: '2026-11-21T14:30:00Z',
  },
  {
    id: 'w-bali-3',
    guest_name: 'Ni Putu Ayu Saraswati',
    attendance: 'attending',
    message:
      'Matur suksma atas undangannya! Turut berbahagia untuk kedua mempelai yang serasi bagaikan Rama dan Sita. Sampai jumpa di Ubud!',
    created_at: '2026-11-22T09:40:00Z',
  },
];
