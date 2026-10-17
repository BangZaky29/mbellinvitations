import type { InvitationData, ThemeConfig, WishItem } from '../../types/invitation';

export const MOCK_INVITATION_DATA: InvitationData = {
  groom: {
    name: 'Dimas',
    full_name: 'Dimas Pratama, B.Eng.',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD_eP_POHaB7Nploj3Q0ZHcyGBuuMApu4i6ANpP8lMbjtx9FDTbeSsZuAtch0QX2cS5Sg4xBgWM3h7d5kba8R-DQrBtv07P5zZoloTKbZOUJ_2-2XjxMncwI98Omt_mbEseHf3baTdDP1MZr5q05ZESpEW0brXG0m2NJk7ogqHGmvNcerIp4pbDFUanMa1kUuSzD0sQnWDQe9Bs16WlF6EFP4ZF70cspGg5a9CoIwNZfn-UKjk_AWTk3g',
    parent_father: 'Bpk. Ir. Hendra Pratama',
    parent_mother: 'Ibu drg. Ratna Kusuma',
    child_order: 'Putra pertama dari pasangan',
    instagram: '@dimas.pratama',
  },
  bride: {
    name: 'Sarah',
    full_name: 'Sarah Anindita, S.Ds.',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDPbRG76myixpvHwLXyr2ljlw90tXbsoGSrwXvoVQ91b7lfXU9jSs8Ys6IkU5au6ZCIyU9iBdl6DBwCROPaisRMMwzqpfYADdQsVBTprW6-q8J933Et7e-VFsFpLv-SwSAl5DWvRpQK65uCInc00rWO8S243f7AY1e0sTSjzPvmbIUi8xBwjigkIkDyliKyrzY5B1Zx588WFe3Pwz4BMIsRbL-6N9PC9OGZlUWv3aDNrvagOj4pLYyvnA',
    parent_father: 'Bpk. H. Bambang Soediro',
    parent_mother: 'Ibu Hj. Siti Nurhaliza',
    child_order: 'Putri bungsu dari pasangan',
    instagram: '@sarah.anindita',
  },
  is_bride_first: false,
  couple_photo:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBwweqbsC_on2q_yj29Iz_hr4hFrrdk5VS7dsFtbcujV_CbaWz0IOdnL54LVIx0AQ6GcrXiCY7tMbXjVDl6j9Y6q3P9AOXdnSFu3PnxM3czufg3iWCsN-Km9_5TOYromCmrbJfflkTrN-D769KyQd_4Mbq0F_xkJ6Z_7T8O4QsAgVTNwr9mBOvhvVdczJaJichKPXIBNkkWOCqK1ee7R8cGQOBTBuKgA7sBagnwTfVo7RjGUHgk-t7BFQ',

  wedding_date_iso: '2026-10-24T08:00:00+07:00',
  wedding_date_display: 'Sabtu, 24 Oktober 2026',

  quote:
    'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
  quote_source: 'QS. Ar-Rum: 21',
  hashtag: '#DimasSarahForever',

  events: [
    {
      name: 'Akad Nikah',
      title: 'Upacara Ijab & Qobul',
      date: 'Sabtu, 24 Oktober 2026',
      time: '08.00 - 10.00 WIB',
      venue_name: 'The Glasshouse Grand Ballroom',
      venue_address:
        'Jl. Dharmawangsa Raya No. 42, Kebayoran Baru, Jakarta Selatan',
      maps_url: 'https://maps.google.com',
      icon: 'ring',
      badge: undefined,
    },
    {
      name: 'Resepsi Pernikahan',
      title: 'Jamuan & Perayaan',
      date: 'Sabtu, 24 Oktober 2026',
      time: '18.30 - 21.30 WIB',
      venue_name: 'The Glasshouse Grand Ballroom',
      venue_address:
        'Jl. Dharmawangsa Raya No. 42, Kebayoran Baru, Jakarta Selatan',
      maps_url: 'https://maps.google.com',
      icon: 'champagne-glasses',
      badge: undefined,
    },
  ],

  love_story: [
    {
      title: 'Pertama Bertemu',
      subtitle: 'Sebuah Pertemuan Tak Terduga',
      year: '2021',
      description:
        'Berawal dari sebuah proyek desain bersama di Bandung, percakapan sederhana tentang estetika dan secangkir kopi membuka jalan untuk persahabatan yang begitu hangat.',
      icon: 'dot',
    },
    {
      title: 'Lamaran Khidmat',
      subtitle: 'Langkah Menuju Selamanya',
      year: '2025',
      description:
        'Di hadapan kedua keluarga besar, Dimas mengutarakan niat tulus untuk meminang Sarah dalam suasana penuh haru, doa restu, dan kehangatan tradisi.',
      icon: 'dot',
    },
    {
      title: 'Hari Pernikahan',
      subtitle: 'Ikatan Janji Suci',
      year: '2026',
      description:
        'Hari di mana lembaran baru dimulai. Kami bersujud memohon doa restu Anda semua untuk melangkah bersama sebagai sepasang suami dan istri seumur hidup.',
      icon: 'check',
    },
  ],

  gallery: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBwweqbsC_on2q_yj29Iz_hr4hFrrdk5VS7dsFtbcujV_CbaWz0IOdnL54LVIx0AQ6GcrXiCY7tMbXjVDl6j9Y6q3P9AOXdnSFu3PnxM3czufg3iWCsN-Km9_5TOYromCmrbJfflkTrN-D769KyQd_4Mbq0F_xkJ6Z_7T8O4QsAgVTNwr9mBOvhvVdczJaJichKPXIBNkkWOCqK1ee7R8cGQOBTBuKgA7sBagnwTfVo7RjGUHgk-t7BFQ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB-mBfBWlqicgvQ44TtViyvzSiDUaYlEcKDkJlV4QVOulRfZ9J2XstCHZLR304_0q4a4mmAnMODviotuXJDqSQkofwXtCYavkThM_uAJXHGo5wjUCqTdCkRBKgWqv2XWJnQRRSI1LgEqCG0P0-j1Uwuta0P-8JTH-rwxcZ-i6NmYtz0mkiw0cgCV8r-SH5rThp8yZW1enGtSeC9cfnpnAWbIKRb1mqBfzEK1TSyA3eut8KUQjOJsCeWYg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDPbRG76myixpvHwLXyr2ljlw90tXbsoGSrwXvoVQ91b7lfXU9jSs8Ys6IkU5au6ZCIyU9iBdl6DBwCROPaisRMMwzqpfYADdQsVBTprW6-q8J933Et7e-VFsFpLv-SwSAl5DWvRpQK65uCInc00rWO8S243f7AY1e0sTSjzPvmbIUi8xBwjigkIkDyliKyrzY5B1Zx588WFe3Pwz4BMIsRbL-6N9PC9OGZlUWv3aDNrvagOj4pLYyvnA',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD_eP_POHaB7Nploj3Q0ZHcyGBuuMApu4i6ANpP8lMbjtx9FDTbeSsZuAtch0QX2cS5Sg4xBgWM3h7d5kba8R-DQrBtv07P5zZoloTKbZOUJ_2-2XjxMncwI98Omt_mbEseHf3baTdDP1MZr5q05ZESpEW0brXG0m2NJk7ogqHGmvNcerIp4pbDFUanMa1kUuSzD0sQnWDQe9Bs16WlF6EFP4ZF70cspGg5a9CoIwNZfn-UKjk_AWTk3g',
  ],

  banks: [
    {
      bank_name: 'BCA',
      account_number: '8801 2345 6789',
      account_number_raw: '880123456789',
      account_holder: 'Dimas Pratama',
    },
    {
      bank_name: 'MANDIRI',
      account_number: '1370 0192 8472 1',
      account_number_raw: '1370019284721',
      account_holder: 'Sarah Anindita',
    },
  ],
  bank_accounts: [
    {
      bank_name: 'BCA',
      account_number: '8801 2345 6789',
      account_number_raw: '880123456789',
      account_holder: 'Dimas Pratama',
    },
    {
      bank_name: 'MANDIRI',
      account_number: '1370 0192 8472 1',
      account_number_raw: '1370019284721',
      account_holder: 'Sarah Anindita',
    },
  ],
  cover_image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBwweqbsC_on2q_yj29Iz_hr4hFrrdk5VS7dsFtbcujV_CbaWz0IOdnL54LVIx0AQ6GcrXiCY7tMbXjVDl6j9Y6q3P9AOXdnSFu3PnxM3czufg3iWCsN-Km9_5TOYromCmrbJfflkTrN-D769KyQd_4Mbq0F_xkJ6Z_7T8O4QsAgVTNwr9mBOvhvVdczJaJichKPXIBNkkWOCqK1ee7R8cGQOBTBuKgA7sBagnwTfVo7RjGUHgk-t7BFQ',
  theme_id: 'modern',
  slug: 'dimas-sarah',
  qris_url: '',
  gift_address: '',

  guest_name: 'Tamu Kehormatan',
  guest_code: 'k8x9p',
  livestream_url: undefined,
};

export const MOCK_THEME_CONFIG: ThemeConfig = {
  primary_color: '#C5A059',
  music_url: '',
  active_sections: [
    'cover',
    'hero',
    'couple',
    'story',
    'event',
    'gallery',
    'rsvp',
    'gift',
    'wishes',
  ],
  show_gallery: true,
  show_love_story: true,
  show_rsvp: true,
  show_gift: true,
  show_wishes: true,
};

export const MOCK_WISHES: WishItem[] = [
  {
    id: '1',
    guest_name: 'Anissa Daniswara',
    message:
      'Selamat menempuh hidup baru Dimas & Sarah! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Sangat bahagia melihat kalian berdua bersatu!',
    attendance: 'attending',
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    guest_name: 'Bima Wicaksono',
    message:
      'Happy wedding bro Dimas! Lancar sampai hari H ya, selamat atas babak barunya bersama Sarah tersayang.',
    attendance: 'attending',
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    guest_name: 'Maya Paramitha',
    message:
      'Dear Sarah & Dimas, turut berbahagia atas pernikahan kalian. Mohon maaf belum bisa hadir langsung karena dinas luar kota, tapi doa tulus kami selalu menyertai!',
    attendance: 'declined',
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_MODERN_DATA = MOCK_INVITATION_DATA;
export const MOCK_MODERN_THEME = MOCK_THEME_CONFIG;
export const MOCK_MODERN_WISHES = MOCK_WISHES;
