import type { InvitationData, ThemeConfig, WishItem } from '../../types/invitation';

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

  quote_title: 'Serat Wulang & Doa Suci',
  quote_religion: 'islam',
  quote_arabic:
    'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ',
  quote:
    'Mugi tansah pinaringan berkah saha pangreksa saking Gusti Ingkang Maha Agung. Dados pasangan ingkang runtut, atut, runtang runtung dumugipurnaning mangsa.',
  quote_source: 'Surah Ar-Rum: 21 • Serat Panembahan',
  hashtag: 'Kraton Ngayogyakarta Hadiningrat',

  dresscode: {
    enabled: true,
    title: 'Panduan Busana (Dress Code)',
    subtitle:
      'Tamu undangan dipersilakan mengenakan busana batik Jawa / beskap bernuansa sogan klasik berikut:',
    colors: [
      { name: 'Sogan Gold', hex: '#C5A059' },
      { name: 'Coklat Truntum', hex: '#5A3825' },
      { name: 'Gading Anget', hex: '#FAF6EE' },
      { name: 'Hitam Wulung', hex: '#1F1A17' },
      { name: 'Merah Maroon', hex: '#6B1D28' },
    ],
  },

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
