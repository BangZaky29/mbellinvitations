import type { InvitationData, ThemeConfig, WishItem } from '../types/invitation';

// ============================================================
// MOCK DATA — Data dummy lengkap untuk testing Template
// Menggunakan data yang sama persis dengan Template1 Modern HTML
// ============================================================

export const MOCK_INVITATION_DATA: InvitationData = {
  // --- Couple ---
  groom: {
    name: 'Raditya',
    full_name: 'Raditya Pratama, B.Eng.',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD_eP_POHaB7Nploj3Q0ZHcyGBuuMApu4i6ANpP8lMbjtx9FDTbeSsZuAtch0QX2cS5Sg4xBgWM3h7d5kba8R-DQrBtv07P5zZoloTKbZOUJ_2-2XjxMncwI98Omt_mbEseHf3baTdDP1MZr5q05ZESpEW0brXG0m2NJk7ogqHGmvNcerIp4pbDFUanMa1kUuSzD0sQnWDQe9Bs16WlF6EFP4ZF70cspGg5a9CoIwNZfn-UKjk_AWTk3g',
    parent_father: 'Bpk. Ir. Hendra Pratama',
    parent_mother: 'Ibu drg. Ratna Kusuma',
    child_order: 'Putra pertama dari pasangan',
    instagram: '@raditya.pratama',
  },
  bride: {
    name: 'Jessica',
    full_name: 'Jessica Anindita, S.Ds.',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDPbRG76myixpvHwLXyr2ljlw90tXbsoGSrwXvoVQ91b7lfXU9jSs8Ys6IkU5au6ZCIyU9iBdl6DBwCROPaisRMMwzqpfYADdQsVBTprW6-q8J933Et7e-VFsFpLv-SwSAl5DWvRpQK65uCInc00rWO8S243f7AY1e0sTSjzPvmbIUi8xBwjigkIkDyliKyrzY5B1Zx588WFe3Pwz4BMIsRbL-6N9PC9OGZlUWv3aDNrvagOj4pLYyvnA',
    parent_father: 'Bpk. H. Bambang Soediro',
    parent_mother: 'Ibu Hj. Siti Nurhaliza',
    child_order: 'Putri bungsu dari pasangan',
    instagram: '@jessica.anindita',
  },
  is_bride_first: false,
  couple_photo:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBwweqbsC_on2q_yj29Iz_hr4hFrrdk5VS7dsFtbcujV_CbaWz0IOdnL54LVIx0AQ6GcrXiCY7tMbXjVDl6j9Y6q3P9AOXdnSFu3PnxM3czufg3iWCsN-Km9_5TOYromCmrbJfflkTrN-D769KyQd_4Mbq0F_xkJ6Z_7T8O4QsAgVTNwr9mBOvhvVdczJaJichKPXIBNkkWOCqK1ee7R8cGQOBTBuKgA7sBagnwTfVo7RjGUHgk-t7BFQ',

  // --- Wedding Date ---
  wedding_date_iso: '2026-10-24T08:00:00+07:00',
  wedding_date_display: 'Sabtu, 24 Oktober 2026',

  // --- Content ---
  quote:
    'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
  quote_source: 'QS. Ar-Rum: 21',
  hashtag: '#RadityaJessicaForever',

  // --- Events ---
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

  // --- Love Story ---
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
        'Di hadapan kedua keluarga besar, Raditya mengutarakan niat tulus untuk meminang Jessica dalam suasana penuh haru, doa restu, dan kehangatan tradisi.',
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

  // --- Gallery ---
  gallery: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBwweqbsC_on2q_yj29Iz_hr4hFrrdk5VS7dsFtbcujV_CbaWz0IOdnL54LVIx0AQ6GcrXiCY7tMbXjVDl6j9Y6q3P9AOXdnSFu3PnxM3czufg3iWCsN-Km9_5TOYromCmrbJfflkTrN-D769KyQd_4Mbq0F_xkJ6Z_7T8O4QsAgVTNwr9mBOvhvVdczJaJichKPXIBNkkWOCqK1ee7R8cGQOBTBuKgA7sBagnwTfVo7RjGUHgk-t7BFQ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB-mBfBWlqicgvQ44TtViyvzSiDUaYlEcKDkJlV4QVOulRfZ9J2XstCHZLR304_0q4a4mmAnMODviotuXJDqSQkofwXtCYavkThM_uAJXHGo5wjUCqTdCkRBKgWqv2XWJnQRRSI1LgEqCG0P0-j1Uwuta0P-8JTH-rwxcZ-i6NmYtz0mkiw0cgCV8r-SH5rThp8yZW1enGtSeC9cfnpnAWbIKRb1mqBfzEK1TSyA3eut8KUQjOJsCeWYg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDPbRG76myixpvHwLXyr2ljlw90tXbsoGSrwXvoVQ91b7lfXU9jSs8Ys6IkU5au6ZCIyU9iBdl6DBwCROPaisRMMwzqpfYADdQsVBTprW6-q8J933Et7e-VFsFpLv-SwSAl5DWvRpQK65uCInc00rWO8S243f7AY1e0sTSjzPvmbIUi8xBwjigkIkDyliKyrzY5B1Zx588WFe3Pwz4BMIsRbL-6N9PC9OGZlUWv3aDNrvagOj4pLYyvnA',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD_eP_POHaB7Nploj3Q0ZHcyGBuuMApu4i6ANpP8lMbjtx9FDTbeSsZuAtch0QX2cS5Sg4xBgWM3h7d5kba8R-DQrBtv07P5zZoloTKbZOUJ_2-2XjxMncwI98Omt_mbEseHf3baTdDP1MZr5q05ZESpEW0brXG0m2NJk7ogqHGmvNcerIp4pbDFUanMa1kUuSzD0sQnWDQe9Bs16WlF6EFP4ZF70cspGg5a9CoIwNZfn-UKjk_AWTk3g',
  ],

  // --- Gift ---
  banks: [
    {
      bank_name: 'BCA',
      account_number: '8801 2345 6789',
      account_number_raw: '880123456789',
      account_holder: 'Raditya Pratama',
    },
    {
      bank_name: 'MANDIRI',
      account_number: '1370 0192 8472 1',
      account_number_raw: '1370019284721',
      account_holder: 'Jessica Anindita',
    },
  ],
  bank_accounts: [
    {
      bank_name: 'BCA',
      account_number: '8801 2345 6789',
      account_number_raw: '880123456789',
      account_holder: 'Raditya Pratama',
    },
    {
      bank_name: 'MANDIRI',
      account_number: '1370 0192 8472 1',
      account_number_raw: '1370019284721',
      account_holder: 'Jessica Anindita',
    },
  ],
  cover_image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBwweqbsC_on2q_yj29Iz_hr4hFrrdk5VS7dsFtbcujV_CbaWz0IOdnL54LVIx0AQ6GcrXiCY7tMbXjVDl6j9Y6q3P9AOXdnSFu3PnxM3czufg3iWCsN-Km9_5TOYromCmrbJfflkTrN-D769KyQd_4Mbq0F_xkJ6Z_7T8O4QsAgVTNwr9mBOvhvVdczJaJichKPXIBNkkWOCqK1ee7R8cGQOBTBuKgA7sBagnwTfVo7RjGUHgk-t7BFQ',
  theme_id: 'rustic',
  slug: 'raditya-jessica',
  qris_url: '',
  gift_address: '',

  // --- Guest ---
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
      'Selamat menempuh hidup baru Radit & Jessica! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Sangat bahagia melihat kalian berdua bersatu!',
    attendance: 'attending',
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    guest_name: 'Bima Wicaksono',
    message:
      'Happy wedding bro Radit! Lancar sampai hari H ya, selamat atas babak barunya bersama Jessica tersayang.',
    attendance: 'attending',
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    guest_name: 'Sarah Paramitha',
    message:
      'Dear Jessica & Raditya, turut berbahagia atas pernikahan kalian. Mohon maaf belum bisa hadir langsung karena dinas luar kota, tapi doa tulus kami selalu menyertai!',
    attendance: 'declined',
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
];

// ============================================================
// MOCK DATA TEMPLATE 3: ADAT JAWA (KRATON NGAYOGYAKARTA)
// 100% otentik persis dengan aset Template3_Jawa.html
// ============================================================
export const MOCK_JAWA_DATA: InvitationData = {
  groom: {
    name: 'Arya Suryonegoro',
    full_name: 'Raden Mas Arya Suryonegoro, S.T., M.Sc.',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCGrqlEISAaXnaxC2OTt1Rs-fzAx-5B57Ssv_OKzplO-BAGhl8WCSHbBDbdaoJrjCq6t11wBKMYHMAila2ihhV5v3zS4hd6Qq92nd6Bb8WgEku6dp02eFYENb6SaTWQeLv994deQMzJFUVSXHRRL3WJM3ewGSvXkSK9jikUlORkBmO46Rm8LmJNryAVoHasjuR4sG9yemDH9g8eMryx-h5M1P0de6vSJWHWQ0uAx6g2kuiQW-Ww5hUG',
    parent_father: 'K.P.H. Haryo Danurdoro',
    parent_mother: 'R.Ay. Siti Hardiyanti',
    child_order: 'Putra pambayun',
    instagram: '@arya.suryo',
  },
  bride: {
    name: 'Dian Daniswara',
    full_name: 'Raden Ajeng Dian Daniswara, B.A., M.B.A.',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCOK4k8V-u1F0I39kBfKzKuqsS3hX5xzBB1ZQIaZtuKkLiM57QueHRPeDqNcBAOlSovVw3af4pGRGseZ9dpvyKZMFGCtoZXvyu-fFPXRcJgyFlEB0fsLcGkdbrLE8lT1tFSO6taV8zgAEW4lX26UKi3G-o0ag2aBFslBtUwSH0tSa8amYuwBngGK6vJxVRkaXksnGGBfw6TkTdaMDzxYL0D2oAQwkmvU7DLEJHZPjtd8WbDunJZkaKw',
    parent_father: 'K.R.T. Danang Kusumo',
    parent_mother: 'R.Ay. Ratna Sekarwangi',
    child_order: 'Putri wuragil',
    instagram: '@diandaniswara',
  },
  theme_id: 'jawa',
  is_bride_first: false,
  cover_image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBtF6SNDAVw9PclpW__UCoK15JCOnrUxa3SpSh8tBeieO6elVHnbQ7e9j4UQNFXESREMjKbEOTbz7BDOIihhTa69cTeslvSLhrtzlSJ6RaSFTXNyJ0UpGPIih2lpOnWTwiSbJsLS-JQXhctz9klyf2VrBJHbW5MowOrZxZKYL8YYJ3uf66M_5CFU-AGPjLd3b2TcoGQxUMhzQuvtCxYYUx6T6pfxlVvqxMtVxdLLn07tHvyeEK6zTwI',
  couple_photo:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBtF6SNDAVw9PclpW__UCoK15JCOnrUxa3SpSh8tBeieO6elVHnbQ7e9j4UQNFXESREMjKbEOTbz7BDOIihhTa69cTeslvSLhrtzlSJ6RaSFTXNyJ0UpGPIih2lpOnWTwiSbJsLS-JQXhctz9klyf2VrBJHbW5MowOrZxZKYL8YYJ3uf66M_5CFU-AGPjLd3b2TcoGQxUMhzQuvtCxYYUx6T6pfxlVvqxMtVxdLLn07tHvyeEK6zTwI',

  wedding_date_iso: '2025-05-24T08:00:00+07:00',
  wedding_date_display: 'Sabtu Kliwon, 24 Mei 2025',

  quote:
    'Mugi tansah pinaringan berkah saha pangreksa saking Gusti Ingkang Maha Agung. Dados pasangan ingkang runtut, atut, runtang runtung dumugipurnaning mangsa.',
  quote_source: 'Surah Ar-Rum: 21',
  hashtag: 'Kraton Ngayogyakarta Hadiningrat',

  events: [
    {
      name: 'Akad Nikah',
      title: 'Upacara Ijab Qobul',
      date: 'Sabtu, 24 Mei 2025',
      time: '08.00 - 10.00 WIB',
      venue_name: 'Bangsal Kencana / Ndalem Sasana Hinggil',
      venue_address:
        'Kompleks Kraton Ngayogyakarta Hadiningrat, DI Yogyakarta',
      maps_url: 'https://maps.google.com',
      icon: 'verified',
    },
    {
      name: 'Resepsi Ageng',
      title: 'Pasugatan & Gamelan Ageng',
      date: 'Sabtu, 24 Mei 2025',
      time: '11.00 - 14.00 WIB',
      venue_name: 'Sasana Handrawina Ballroom',
      venue_address:
        'Jl. Rotowijayan No. 1, Panembahan, Kraton, Kota Yogyakarta',
      maps_url: 'https://maps.google.com',
      icon: 'celebration',
    },
  ],

  love_story: [
    {
      title: 'Pandangan Pertama di Pelataran Balairung',
      subtitle: 'Purwaka',
      year: '2018',
      description:
        'Kala surya kembar ing langit Ngayogyakarta, pinanggih ing adicara Pentas Seni Kraton. Pandangan kawitan ingkang nuwuhaken raos tulus ing manah.',
      icon: 'explore',
    },
    {
      title: 'Ikrar Prasetya & Peningset',
      subtitle: 'Lamaran',
      year: '2022',
      description:
        'Kalawau kulawarga ageng pepanggihan masrahaken paningset pinongka tandha tresna jati, nyawiji tekad lumampah bebarengan.',
      icon: 'favorite',
    },
    {
      title: 'Menuju Mahligai Rumah Tangga',
      subtitle: 'Pawiwahan',
      year: '2025',
      description:
        'Kanthi panyuwunan ridho saking Gusti, sumadya ngrakit gesang anyar ing Sasana Hinggil Kraton Ngayogyakarta Hadiningrat.',
      icon: 'church',
    },
  ],

  gallery: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBtF6SNDAVw9PclpW__UCoK15JCOnrUxa3SpSh8tBeieO6elVHnbQ7e9j4UQNFXESREMjKbEOTbz7BDOIihhTa69cTeslvSLhrtzlSJ6RaSFTXNyJ0UpGPIih2lpOnWTwiSbJsLS-JQXhctz9klyf2VrBJHbW5MowOrZxZKYL8YYJ3uf66M_5CFU-AGPjLd3b2TcoGQxUMhzQuvtCxYYUx6T6pfxlVvqxMtVxdLLn07tHvyeEK6zTwI',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCGrqlEISAaXnaxC2OTt1Rs-fzAx-5B57Ssv_OKzplO-BAGhl8WCSHbBDbdaoJrjCq6t11wBKMYHMAila2ihhV5v3zS4hd6Qq92nd6Bb8WgEku6dp02eFYENb6SaTWQeLv994deQMzJFUVSXHRRL3WJM3ewGSvXkSK9jikUlORkBmO46Rm8LmJNryAVoHasjuR4sG9yemDH9g8eMryx-h5M1P0de6vSJWHWQ0uAx6g2kuiQW-Ww5hUG',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCOK4k8V-u1F0I39kBfKzKuqsS3hX5xzBB1ZQIaZtuKkLiM57QueHRPeDqNcBAOlSovVw3af4pGRGseZ9dpvyKZMFGCtoZXvyu-fFPXRcJgyFlEB0fsLcGkdbrLE8lT1tFSO6taV8zgAEW4lX26UKi3G-o0ag2aBFslBtUwSH0tSa8amYuwBngGK6vJxVRkaXksnGGBfw6TkTdaMDzxYL0D2oAQwkmvU7DLEJHZPjtd8WbDunJZkaKw',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA2V-3uY62r_SVy7ntONZGPcZ-X70hgkAukqYUKDon2fXZ8v2Rp8KDV-dusTyLjL74C-j-T8P5s0bLa8gIS5LAw2OSRdD4TNmymLSJmnGHEouujgheTkFZg0yQpjZNCWE8eU6VXLyLc0ggcfYF-ajdg8wo-bYDZA3RSW_eQDi-DYdid3D2hM6JgqJukQulVCk5o9fYiRwq3lhguGOJqphsVkLYju7_q8MkKVdPLL1eizZpgZvRsiLyN',
  ],

  banks: [
    {
      bank_name: 'BCA',
      account_number: '8735 9182 301',
      account_number_raw: '87359182301',
      account_holder: 'Raden Mas Arya Suryonegoro',
    },
    {
      bank_name: 'MANDIRI',
      account_number: '1370 0092 8410',
      account_number_raw: '137000928410',
      account_holder: 'Raden Ajeng Dian Daniswara',
    },
  ],
  bank_accounts: [
    {
      bank_name: 'BCA',
      account_number: '8735 9182 301',
      account_number_raw: '87359182301',
      account_holder: 'Raden Mas Arya Suryonegoro',
    },
    {
      bank_name: 'MANDIRI',
      account_number: '1370 0092 8410',
      account_number_raw: '137000928410',
      account_holder: 'Raden Ajeng Dian Daniswara',
    },
  ],
  qris_url: '',
  gift_address: 'Bangsal Sri Manganti, Kompleks Kraton Ngayogyakarta Hadiningrat',

  guest_name: 'Tamu Undangan Kinasih',
  guest_code: 'KRT-2025',
  livestream_url: undefined,
};

export const MOCK_JAWA_THEME: ThemeConfig = {
  primary_color: '#f2ca50',
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

export const MOCK_JAWA_WISHES: WishItem[] = [
  {
    id: '1',
    guest_name: 'G.K.R. Mangkubumi',
    message:
      'Ndherek mangayubagya awit dhaupipun Raden Mas Arya kaliyan Raden Ajeng Dian. Mugi tansah ayem tentrem, bagya mulya, dados tuladha kautaman lahir batin.',
    attendance: 'attending',
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    guest_name: 'Prof. Dr. Ir. Sudarmono',
    message:
      'Selamat menempuh hidup baru untuk Mas Arya dan Mbak Dian. Semoga senantiasa sakinah, mawaddah, warahmah dalam lindungan Gusti Ingkang Maha Wikan.',
    attendance: 'attending',
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    guest_name: 'Sekar & Dimas',
    message:
      "Baarakallahu laka wa baaraka 'alaika wa jama'a bainakuma fii khoir. Lancar sedaya adicara ageng mangke, aamiin ya rabbal 'alamin!",
    attendance: 'attending',
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
];

// ============================================================
// MOCK DATA 4: NUANSA ISLAMI (Template 4)
// Pasangan: Muhammad Rayhan Al-Fatih & Yasmin Nurul Anbiya
// ============================================================
export const MOCK_ISLAMI_DATA: InvitationData = {
  groom: {
    name: 'Rayhan',
    full_name: 'Muhammad Rayhan Al-Fatih, S.T.',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB9KpuOvAPLIb_fF_M32tI56Amc-h3KLOSoZgLqhBwmNoYfHpofOiWP03wsdw0ujXrSiO910_gcb3pTNd8dZJ7WyNyQNPE7Zq_l3sjRIYZovQ0NK-0T3I-JW1iIxOvzxtYb5Jlo-M-39ERRB0CX-O1h-bfDABmxHRfN6hBftUsBNbhKzxzylC_Lzs-k_Bev5wgS5_BSqinprFQ6L2MLIsX-cfFs5XRUgzxUV_hz28k_u9ivI-2Knxnxaw',
    parent_father: 'Bpk. Ir. Hendra Prasetyo',
    parent_mother: 'Ibu Dra. Siti Aminah',
    child_order: 'Putra pertama dari',
    instagram: '@rayhan.alfatih',
  },
  bride: {
    name: 'Yasmin',
    full_name: 'Yasmin Nurul Anbiya, S.Farm.',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuATzcZMTqTrIeaizUemSP0BOkCA8LSbwB-uj6puN7gX4Uv4cjtJJ4U0ZsAvgqGbm0esetAMA2NDlsgheNk-YvxJUyahnuavaNykXlrbpN0jMIaiFonUt4SNjtKJ4Gxlm1GE9eCakCoYWByQk_lhvLcUo11RxaToMJvu5xWYQh0Ny01mR4oPQ3yzT6ndhDLKKKoEaf-8e1U4qJGr4ofgZ0Y40s4OoQ7uq80ehRToLXSnwLp9a_EY2r96Ew',
    parent_father: 'Bpk. Dr. H. Lukman Hakim',
    parent_mother: 'Ibu Hj. Ratna Sari Dewi',
    child_order: 'Putri kedua dari',
    instagram: '@yasmin.anbiya',
  },
  theme_id: 'islami',
  is_bride_first: false,
  cover_image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBR9L8ISRUM7mLqvnPG1IUud4itXFzYibGb-gsVdr2o8XOghzC2pdxs3o4Y2QQOZT5FDELCcHb1hQXs0m_y-Ug4bTBYR_zj1eXdzZ_EYzKQ5aJLGJsYRXpgssNhtGWT6egpeoVh-gBwyzuhPmyDGWnAET59APKBr1X9uYdaxY7TpdT6rg3zm48_6s4Va2AuaAL7-qkj_lnVIPqmYeb4KJVg6qBDlsZ1TKkNe3MGDcM_G9le8id4Vh3few',
  couple_photo:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBR9L8ISRUM7mLqvnPG1IUud4itXFzYibGb-gsVdr2o8XOghzC2pdxs3o4Y2QQOZT5FDELCcHb1hQXs0m_y-Ug4bTBYR_zj1eXdzZ_EYzKQ5aJLGJsYRXpgssNhtGWT6egpeoVh-gBwyzuhPmyDGWnAET59APKBr1X9uYdaxY7TpdT6rg3zm48_6s4Va2AuaAL7-qkj_lnVIPqmYeb4KJVg6qBDlsZ1TKkNe3MGDcM_G9le8id4Vh3few',

  wedding_date_iso: '2025-05-24T08:00:00+07:00',
  wedding_date_display: 'Sabtu, 24 Mei 2025',

  quote:
    'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
  quote_source: 'QS. Ar-Rum: 21',
  hashtag: '#RayhanYasminHalal',

  events: [
    {
      name: 'Akad Nikah',
      title: 'Ijab & Qobul',
      date: 'Sabtu, 24 Mei 2025',
      time: '08.00 - 10.00 WIB',
      venue_name: 'Masjid Agung Al-Ukhuwah, Ballroom Lt. 2',
      venue_address: 'Jl. Wastukencana No. 27, Babakan Ciamis, Sumur Bandung, Kota Bandung',
      maps_url: 'https://maps.google.com',
      badge: 'Khusus Keluarga & Kerabat Dekat',
      icon: 'verified',
    },
    {
      name: 'Walimatul Ursy / Resepsi',
      title: 'Jamuan Keberkahan',
      date: 'Sabtu, 24 Mei 2025',
      time: '11.00 - 14.00 WIB',
      venue_name: 'Grand Asrilia Hotel & Convention Hall',
      venue_address: 'Jl. Pelajar Pejuang 45 No. 123, Turangga, Kec. Lengkong, Kota Bandung',
      maps_url: 'https://maps.google.com',
      badge: 'Tamu Undangan',
      icon: 'diversity_3',
    },
  ],

  love_story: [
    {
      year: 'Juni 2023',
      title: "1. Ta'aruf",
      subtitle: 'Awal Pertemuan yang Diridhoi',
      description:
        'Pertemuan pertama yang diridhoi melalui perantara keluarga dengan niat tulus menyempurnakan ibadah dan mencari ridho Allah SWT.',
      icon: 'handshake',
    },
    {
      year: 'Desember 2024',
      title: '2. Khitbah',
      subtitle: 'Ikrar Keseriusan Dua Keluarga',
      description:
        'Pertemuan silaturahmi kedua belah keluarga besar disertai penyematan cincin sebagai tanda keseriusan dan komitmen melangkah ke jenjang pernikahan.',
      icon: 'favorite',
    },
    {
      year: 'Mei 2025',
      title: '3. Walimatul Ursy',
      subtitle: 'Menyempurnakan Separuh Agama',
      description:
        'Insya Allah ikrar suci akad nikah serta menyatukan doa dan kebahagiaan bersama seluruh sanak saudara, kerabat, dan sahabat tercinta.',
      icon: 'celebration',
    },
  ],

  gallery: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuATzcZMTqTrIeaizUemSP0BOkCA8LSbwB-uj6puN7gX4Uv4cjtJJ4U0ZsAvgqGbm0esetAMA2NDlsgheNk-YvxJUyahnuavaNykXlrbpN0jMIaiFonUt4SNjtKJ4Gxlm1GE9eCakCoYWByQk_lhvLcUo11RxaToMJvu5xWYQh0Ny01mR4oPQ3yzT6ndhDLKKKoEaf-8e1U4qJGr4ofgZ0Y40s4OoQ7uq80ehRToLXSnwLp9a_EY2r96Ew',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBxriFDDDE-mOuz0GKB1Dlpx9YOPe0b8wGvxQUPHJ422D6GmL-43sokWBZ7h-l6WoSMwMLIXtwFovEwa0tpxLj7X8SMKOfgmeu1fo3cAMHL1phNAMDd4dZFhbPS45E_nnLcKUSk2K2t6LzMH7u-tSI2A9-1sqM__9Jvo1Z7pyX5MCKq7Bman9n3VnYaUAG96OArv2Ut6YrIFcyacLfQLJq0zkKccJQrDUjdp9BeBeycyO0syx3I9efUow',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBxTA5bQUvMZVfRlw4RyKaqqFP8HU68CX1GFXf0u7orfx3tXdKP304_Jwo5Lh-P2vuYXyZ0G966MH2RJfvyZ8OekDoo_9zUaZdz8hZbBwbkTruETK4GbfHPxuWGoVWTjQudohVKQcebyPltUBRhyfAYNEtZJpAzXDZ37x-JXXeeS9MYmwpZQGfYBUPAAQSYIa-Yeb7S1Hat0EHadQmJ6WGUj5GfkuoUqT0TNEHqBK-g97UF7SDEfDqNlw',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB9KpuOvAPLIb_fF_M32tI56Amc-h3KLOSoZgLqhBwmNoYfHpofOiWP03wsdw0ujXrSiO910_gcb3pTNd8dZJ7WyNyQNPE7Zq_l3sjRIYZovQ0NK-0T3I-JW1iIxOvzxtYb5Jlo-M-39ERRB0CX-O1h-bfDABmxHRfN6hBftUsBNbhKzxzylC_Lzs-k_Bev5wgS5_BSqinprFQ6L2MLIsX-cfFs5XRUgzxUV_hz28k_u9ivI-2Knxnxaw',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAQmfXHi9lYd84jsEv-poNeALYJq-j6zBuWHVttlbuK8SwaHvCPuwDzg3r3Pd8LdXdPUkdygtFz1j9BV4z87ufvFJY_8vXcnISFkHKkxWx19emEtr2bEqIWTKg4BfnhuGr55R8zGbt6dcu2LEor-aEafzuGYRSHSwDtwa1uQjVC3MCb0h56RRbGT4fpPKsn005PsevMGLBrzjlSe6J9m4S0xx-4NsBOEpY9387ZBu46Lpg-5shNmLHD9A',
  ],

  banks: [
    {
      bank_name: 'BCA',
      account_number: '7810 4928 19',
      account_number_raw: '7810492819',
      account_holder: 'Muhammad Rayhan',
    },
    {
      bank_name: 'MANDIRI',
      account_number: '1300 0982 7161 8',
      account_number_raw: '1300098271618',
      account_holder: 'Yasmin Nurul Anbiya',
    },
  ],
  bank_accounts: [
    {
      bank_name: 'BCA',
      account_number: '7810 4928 19',
      account_number_raw: '7810492819',
      account_holder: 'Muhammad Rayhan',
    },
    {
      bank_name: 'MANDIRI',
      account_number: '1300 0982 7161 8',
      account_number_raw: '1300098271618',
      account_holder: 'Yasmin Nurul Anbiya',
    },
  ],
  qris_url: '',
  gift_address:
    'Jl. Dago Asri No. 18, Dago, Coblong, Kota Bandung, Jawa Barat 40135 (Penerima: Yasmin Nurul Anbiya / 08123456789)',

  guest_name: 'Dr. H. Ahmad Farhan & Keluarga',
  guest_code: 'ISL-2025',
  livestream_url: undefined,
};

export const MOCK_ISLAMI_THEME: ThemeConfig = {
  primary_color: '#5e2832',
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

export const MOCK_ISLAMI_WISHES: WishItem[] = [
  {
    id: '1',
    guest_name: 'Fajar Nugraha & Istri',
    message:
      "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khoir. Selamat menempuh hidup baru Rayhan dan Yasmin. Semoga selalu menjadi keluarga sakinah, mawaddah, warahmah.",
    attendance: 'attending',
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    guest_name: 'dr. Anisa Rahma',
    message:
      'MasyaAllah Tabarakallah Yasmin sayang! Semoga perjalanan cinta kalian selalu dinaungi berkah dan dilancarkan hingga hari H. Sangat bahagia melihat kalian bersatu dalam ridho-Nya.',
    attendance: 'attending',
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    guest_name: 'Dimas & Rekan Teknik Sipil',
    message:
      'Selamat brader Rayhan! Akhirnya sah juga setelah penantian panjang. Doa terbaik dari kami semua, langgeng sampai surga.',
    attendance: 'attending',
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    guest_name: 'Keluarga Besar Alm. H. Zakaria',
    message:
      'Turut berbahagia untuk kedua keluarga besar. Semoga kedua ananda senantiasa diberkahi keturunan sholeh dan sholehah penyejuk hati.',
    attendance: 'attending',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

// ============================================================
// MOCK DATA 5: LUXURY GLAMOUR (Template 5)
// Pasangan: Romeo Alexander Hartanto & Juliet Aurelia Kusuma
// ============================================================
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

  quote:
    'Two souls bound under the quiet grandeur of the midnight sky, beginning their forever.',
  quote_source: 'Union & Grace',
  hashtag: '#RomeoJulietGala',

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

export const MOCK_RUSTIC_DATA: InvitationData = {
  groom: {
    name: 'Romeo',
    full_name: 'Romeo Danendra, S.T.',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAsun46rUeWE3Hq0Qvp71MH_mJm9m52oKuIrvfSU6X4Nq8kz6lhhCBlgyK16PZkBukutIC0EXeur_Rg7615NSdukwf7gscbP_YXdXdsvU24TZA7LVitEutLTceJsi7C-MSAz7JGRxJaOJloCmhp7uEzHARdcDzN2_0gM4Wsg1ik-ci_ZUIRhdI3iv-CKtFAVh3jsOd53V87YW7wyIuoi8jOFSyJQaJgQ-zfLRwzCR-iSQCZxRH2its-',
    parent_father: 'Bpk. Bambang Wijaya',
    parent_mother: 'Ibu Siti Rahayu',
    child_order: 'Putra pertama dari',
    instagram: '@romeodanendra',
  },
  bride: {
    name: 'Juliet',
    full_name: 'Juliet Maharani, B.Des.',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC8HvrENb0WBSV7Ih1ayaRPaFFC-I_61Cmt9vk4Q_o_4XSEqeUB_aopO-oqABfat3nL0GYYCwyQNk2NXTXaoQsLzbvDaW7KGFfVMR1KYFVmZwp8QyoPyoMJ3TKOND2H6BUqEHB66ruSge5wtnEhEWNvF26h7CefNCbxNPVZYSAIScb1kZ9NIHmex88peNm83pybx4TcFkXxz9kwV0LPF1YtHgHtipeseovfSUNiQzqOxRnuxn34vc-X',
    parent_father: 'Bpk. Hendra Kusuma',
    parent_mother: 'Ibu Dewi Anggraini',
    child_order: 'Putri kedua dari',
    instagram: '@julietmaharani',
  },
  is_bride_first: false,
  couple_photo:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD8xLip0H_cCbnjFejRwJJEPwdAIwlluZwgC-H86elsfbMJfI6fBuv4VPAXx1f94WjAYmdsw_kDUo_fQ75Jo1scS-zcSijB0tInmc1KKiRnzLo8v5HO5_jPUnA7CgaHs9ZUxRj7jsdQqGG4jtW2bsze4UCtMm9yi30Fcpx1cy_OVAt7mPXa60qBU5I-bDW5_2sIKvqUwAjRoOwu75lWKvmkpSNJ95Feb5cA6bzU9OycxT8Q2Hui_AaA',
  cover_image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD2hBi0JqhtZJ6UbnhyjGy999a9yFsLJ3aQt9yohNzO3Mm25_QqZWt_A_xMgIqS5k5TVkcqF50hgwjTC8ab0RPatc2WmMEgg5trqtA1H7Nu9mRfjZwXh_S1jP-uWje9fnkIExS8M8wgoB-1p6JK7XJmbiQTq5qtma6DqGPnUwra8h3MQFVCj85UL_h6aaQRfjkCbafs9TgD6Wvgm0Oc_7XpZ3yqV0qe-4ZnLD_yr1Z98bdfw4ZHnslm',

  wedding_date_iso: '2025-10-25T08:00:00+07:00',
  wedding_date_display: 'Sabtu, 25 Oktober 2025',

  quote:
    'Dan di antara tanda-tanda kebesaran-Nya diciptakan-Nya untukmu pasangan hidup dari jenismu sendiri supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.',
  quote_source: 'QS. Ar-Rum: 21',
  hashtag: '#RomeoJulietForever',

  events: [
    {
      name: 'Akad Nikah',
      title: 'Akad & Ikrar Suci',
      date: 'Sabtu, 25 Oktober 2025',
      time: '08.00 - 10.00 WIB',
      venue_name: 'Pine Forest Sanctuary Villa',
      venue_address: 'Jl. Maribaya No. 120, Lembang, Bandung Barat',
      maps_url: 'https://maps.google.com',
      badge: 'Khusus Keluarga Inti',
      icon: 'church',
    },
    {
      name: 'Resepsi Pernikahan',
      title: 'Garden Party & Jamuan',
      date: 'Sabtu, 25 Oktober 2025',
      time: '11.00 - 14.00 WIB',
      venue_name: 'Pine Forest Sanctuary Grand Hall',
      venue_address: 'Jl. Maribaya No. 120, Lembang, Bandung Barat',
      maps_url: 'https://maps.google.com',
      badge: 'Sesi 1 & 2',
      icon: 'celebration',
    },
  ],

  love_story: [
    {
      year: '2021',
      title: 'Awal Cerita',
      subtitle: 'Pertemuan Kampus',
      description:
        'Pertemuan pertama di bangku kuliah, berawal dari kerja kelompok tugas akhir bersama hingga perlahan tumbuh rasa saling mengagumi dan bertumbuh bersama.',
      icon: 'school',
    },
    {
      year: '2023',
      title: 'Mengikat Janji',
      subtitle: 'Lamaran di Hutan Pinus',
      description:
        'Mengambil langkah serius diiringi restu hangat kedua keluarga besar. Momen lamaran syahdu di bawah naungan rimbun pepohonan pinus Lembang.',
      icon: 'favorite',
    },
    {
      year: '2025',
      title: 'Hari Bahagia',
      subtitle: 'Menuju Pelaminan',
      description:
        'Memulai babak baru ikatan suci pernikahan, saling menguatkan, beribadah bersama, dan melangkah bergandengan tangan untuk selamanya.',
      icon: 'loyalty',
    },
  ],

  gallery: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD2hBi0JqhtZJ6UbnhyjGy999a9yFsLJ3aQt9yohNzO3Mm25_QqZWt_A_xMgIqS5k5TVkcqF50hgwjTC8ab0RPatc2WmMEgg5trqtA1H7Nu9mRfjZwXh_S1jP-uWje9fnkIExS8M8wgoB-1p6JK7XJmbiQTq5qtma6DqGPnUwra8h3MQFVCj85UL_h6aaQRfjkCbafs9TgD6Wvgm0Oc_7XpZ3yqV0qe-4ZnLD_yr1Z98bdfw4ZHnslm',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD8xLip0H_cCbnjFejRwJJEPwdAIwlluZwgC-H86elsfbMJfI6fBuv4VPAXx1f94WjAYmdsw_kDUo_fQ75Jo1scS-zcSijB0tInmc1KKiRnzLo8v5HO5_jPUnA7CgaHs9ZUxRj7jsdQqGG4jtW2bsze4UCtMm9yi30Fcpx1cy_OVAt7mPXa60qBU5I-bDW5_2sIKvqUwAjRoOwu75lWKvmkpSNJ95Feb5cA6bzU9OycxT8Q2Hui_AaA',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAsun46rUeWE3Hq0Qvp71MH_mJm9m52oKuIrvfSU6X4Nq8kz6lhhCBlgyK16PZkBukutIC0EXeur_Rg7615NSdukwf7gscbP_YXdXdsvU24TZA7LVitEutLTceJsi7C-MSAz7JGRxJaOJloCmhp7uEzHARdcDzN2_0gM4Wsg1ik-ci_ZUIRhdI3iv-CKtFAVh3jsOd53V87YW7wyIuoi8jOFSyJQaJgQ-zfLRwzCR-iSQCZxRH2its-',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC8HvrENb0WBSV7Ih1ayaRPaFFC-I_61Cmt9vk4Q_o_4XSEqeUB_aopO-oqABfat3nL0GYYCwyQNk2NXTXaoQsLzbvDaW7KGFfVMR1KYFVmZwp8QyoPyoMJ3TKOND2H6BUqEHB66ruSge5wtnEhEWNvF26h7CefNCbxNPVZYSAIScb1kZ9NIHmex88peNm83pybx4TcFkXxz9kwV0LPF1YtHgHtipeseovfSUNiQzqOxRnuxn34vc-X',
  ],

  banks: [
    {
      bank_name: 'BCA',
      account_number: '8271 9028 4410',
      account_number_raw: '827190284410',
      account_holder: 'Romeo Danendra',
    },
    {
      bank_name: 'MANDIRI',
      account_number: '1370 0019 2831',
      account_number_raw: '137000192831',
      account_holder: 'Juliet Maharani',
    },
  ],
  qris_url: '',
  gift_address: 'Jl. Maribaya No. 120, Lembang, Bandung Barat (Penerima: Romeo & Juliet)',

  guest_name: 'Ananda Pratama & Partner',
  guest_code: 'RST-2025',
  livestream_url: undefined,
};

export const MOCK_RUSTIC_THEME: ThemeConfig = {
  primary_color: '#162a1f',
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

export const MOCK_RUSTIC_WISHES: WishItem[] = [
  {
    id: '1',
    guest_name: 'Ananda Pratama',
    message: 'Selamat berbahagia Romeo & Juliet! Semoga menjadi keluarga yang sakinah, rukun selamanya, dan saling melengkapi di tiap perjalanan hidup.',
    attendance: 'attending',
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    guest_name: 'Dinda Kirana',
    message: 'Happy wedding Romeo & Juliet! Nuansa pernikahannya adem banget di Lembang. Semoga cinta kalian senantiasa mekar seperti bunga di taman.',
    attendance: 'attending',
    created_at: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
  },
];

// ============================================================
// EXPORT ALIASES & UNIFIED MAP (Multi-Template Concept Presets)
// ============================================================
export const MOCK_MODERN_DATA = MOCK_INVITATION_DATA;
export const MOCK_MODERN_THEME = MOCK_THEME_CONFIG;
export const MOCK_MODERN_WISHES = MOCK_WISHES;

export const MOCK_THEME_DATA_MAP: Record<string, InvitationData> = {
  modern: MOCK_MODERN_DATA,
  template1: MOCK_MODERN_DATA,
  rustic: MOCK_RUSTIC_DATA,
  template2: MOCK_RUSTIC_DATA,
  jawa: MOCK_JAWA_DATA,
  template3: MOCK_JAWA_DATA,
  islami: MOCK_ISLAMI_DATA,
  template4: MOCK_ISLAMI_DATA,
  luxury: MOCK_LUXURY_DATA,
  template5: MOCK_LUXURY_DATA,
};

export const MOCK_THEME_CONFIG_MAP: Record<string, ThemeConfig> = {
  modern: MOCK_MODERN_THEME,
  template1: MOCK_MODERN_THEME,
  rustic: MOCK_RUSTIC_THEME,
  template2: MOCK_RUSTIC_THEME,
  jawa: MOCK_JAWA_THEME,
  template3: MOCK_JAWA_THEME,
  islami: MOCK_ISLAMI_THEME,
  template4: MOCK_ISLAMI_THEME,
  luxury: MOCK_LUXURY_THEME,
  template5: MOCK_LUXURY_THEME,
};

export const MOCK_THEME_WISHES_MAP: Record<string, WishItem[]> = {
  modern: MOCK_MODERN_WISHES,
  template1: MOCK_MODERN_WISHES,
  rustic: MOCK_RUSTIC_WISHES,
  template2: MOCK_RUSTIC_WISHES,
  jawa: MOCK_JAWA_WISHES,
  template3: MOCK_JAWA_WISHES,
  islami: MOCK_ISLAMI_WISHES,
  template4: MOCK_ISLAMI_WISHES,
  luxury: MOCK_LUXURY_WISHES,
  template5: MOCK_LUXURY_WISHES,
};

