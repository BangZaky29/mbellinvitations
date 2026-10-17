import type { InvitationData, ThemeConfig, WishItem } from '../../types/invitation';

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
