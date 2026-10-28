import type { InvitationData, ThemeConfig, WishItem } from '../../types/invitation';

export const MOCK_BETAWI_DATA: InvitationData = {
  groom: {
    name: 'Rizky',
    full_name: 'Muhammad Rizky Pratama, S.T., M.B.A.',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDvj315uDZXn4l54Z9rsWz5dxN7n1zN6tQMm75ogSwJUInNGK1hhmHf6v0uR63NqNlWYEdx7GfC5FRRfz22O-XrVEB2UiUv6bF3KzWX4qTDz_vB0uBhihZ2WueUDeU6-9cZka5s-Sf1fXL3bTJZ4TA9lPUir3qSMU-cVBi7FpLjbVxc6dWUjwZEs3UibXHSv5LVy-fL3OSpjqL7Tv68q1htN-U8JB0wHQY4Qhi-US6bkcKfe7JNpZF3',
    parent_father: 'Bpk. H. Ahmad Marzuki',
    parent_mother: 'Ibu Hj. Rohana',
    child_order: 'Putra pertama dari',
    parent_info: 'Bpk. H. Ahmad Marzuki & Ibu Hj. Rohana',
    instagram: '@rizky.marzuki',
  },
  bride: {
    name: 'Fatimah',
    full_name: 'Siti Fatimah Azzahra, S.I.Kom.',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJsZ0fracfQoJP0PD9qX30gLxdwMBTZCCNdrQYozJXO6ZSzs-T02oubQQGtFZMzLl5yr508GBmd-MSK3lNDAmgi-TaYhhfs-CxXU2_VDmJUhI-i2wuo-wzh88Ldo3-GhDESotkfsBISYuwpMjbr6ZG6k8WUvF5mE2BBC65K4EoS2qM--XXXRE0vUWH2_J6kSl9EBEFLi9MM9Wh1jI-pC9SpSgdfxqLNmiW349uwvI-NnuEdif6RAGa',
    parent_father: 'Bpk. H. Syamsuddin Betawi',
    parent_mother: 'Ibu Hj. Maryani',
    child_order: 'Putri bungsu dari',
    parent_info: 'Bpk. H. Syamsuddin Betawi & Ibu Hj. Maryani',
    instagram: '@fatimah.azzahra',
  },
  theme_id: 'betawi',
  is_bride_first: false,
  cover_image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC38c0z_VRFW7pK5iEY8U1GecNyYvslcile2i98NOilLin6v5K2-EdEA-pw0lc5Ii-4Umtr-A2OHq10oR7AA91GmtqiLjbZdP5_M8cSzYDScBUa_6FPB3o222cYlN1FPrCxJ9yQzTbNhDErUc9P0RZ0PQjwaFOx8fa-KNvfb0o5Qj6Oy-E_2ONKQziS5NG2HznKRidJwLqFcdNwRhVHoqYJmRHb-35Ba81FILaNF79pktib-mMovGrI',
  couple_photo:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC38c0z_VRFW7pK5iEY8U1GecNyYvslcile2i98NOilLin6v5K2-EdEA-pw0lc5Ii-4Umtr-A2OHq10oR7AA91GmtqiLjbZdP5_M8cSzYDScBUa_6FPB3o222cYlN1FPrCxJ9yQzTbNhDErUc9P0RZ0PQjwaFOx8fa-KNvfb0o5Qj6Oy-E_2ONKQziS5NG2HznKRidJwLqFcdNwRhVHoqYJmRHb-35Ba81FILaNF79pktib-mMovGrI',

  wedding_date_iso: '2026-12-19T08:00:00+07:00',
  wedding_date_display: 'Sabtu, 19 Desember 2026',
  countdown_target: 'resepsi',

  quote_title: 'Pantun Penyambut & Doa Suci',
  quote_religion: 'islam',
  quote_arabic:
    'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
  quote:
    '“Buah manggis buah pepaye, pohon beringin daunnye lebat. Kite kumpulin sanak sodare, niat baik menyambung hajat.”',
  quote_source:
    'QS. Ar-Rum: 21 • “Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.”',
  hashtag: '#RizkyFatimahHajatanBetawi',

  dresscode: {
    enabled: true,
    title: 'Panduan Busana Tamu (Attire Guide)',
    subtitle:
      'Tamu undangan terhormat disarankan mengenakan Batik Betawi, Kebaya Encim, atau Sadariah bernuansa royal palette:',
    colors: [
      { name: 'Betawi Maroon', hex: '#5E1914' },
      { name: 'Prada Emas', hex: '#FED65B' },
      { name: 'Gading Alabaster', hex: '#FCF9F3' },
      { name: 'Hijau Sirih', hex: '#387D39' },
      { name: 'Arang Hitam', hex: '#222222' },
    ],
  },

  events: [
    {
      name: 'Prosesi Adat Palang Pintu & Rebana Biang',
      title: 'Prosesi Adat Palang Pintu & Rebana Biang',
      date: 'Sabtu, 19 Desember 2026',
      time: '08:00 WIB',
      venue_name: 'The Grand Batavia Heritage Ballroom',
      venue_address:
        'Jl. Taman Fatahillah No. 12, Kawasan Kota Tua, Jakarta Barat 11110',
      venue_city: 'Jakarta Barat',
      maps_url: 'https://maps.google.com/?q=The+Grand+Batavia+Heritage+Ballroom+Jakarta',
      icon: 'sports_martial_arts',
      badge: 'Tradisi Adat',
    },
    {
      name: 'Akad Nikah Khidmat',
      title: 'Akad Nikah Khidmat',
      date: 'Sabtu, 19 Desember 2026',
      time: '09:30 WIB',
      venue_name: 'The Grand Batavia Heritage Ballroom',
      venue_address:
        'Jl. Taman Fatahillah No. 12, Kawasan Kota Tua, Jakarta Barat 11110',
      venue_city: 'Jakarta Barat',
      maps_url: 'https://maps.google.com/?q=The+Grand+Batavia+Heritage+Ballroom+Jakarta',
      icon: 'auto_stories',
      badge: 'Akad Khidmat',
    },
    {
      name: 'Resepsi & Jamuan Kuliner Betawi',
      title: 'Resepsi & Jamuan Kuliner Betawi',
      date: 'Sabtu, 19 Desember 2026',
      time: '11:30 - 16:00 WIB',
      venue_name: 'The Grand Batavia Heritage Ballroom',
      venue_address:
        'Jl. Taman Fatahillah No. 12, Kawasan Kota Tua, Jakarta Barat 11110',
      venue_city: 'Jakarta Barat',
      maps_url: 'https://maps.google.com/?q=The+Grand+Batavia+Heritage+Ballroom+Jakarta',
      icon: 'celebration',
      badge: 'Hajatan Akbar',
    },
  ],

  love_story: [
    {
      year: '2022',
      title: 'Perjumpaan di Palang Pintu Kemang',
      description:
        'Awal mula pertemuan manis saat perhelatan Festival Palang Pintu Kemang, bermula dari pandangan pertama di depan panggung silat Beksi.',
    },
    {
      year: '2024',
      title: 'Rembug Tuwe & Ngalor-Ngidul Adat',
      description:
        'Silaturahmi keluarga besar kedua belah pihak dengan membawa tande putus roti buaya dan sirih nanas pertanda keseriusan niat.',
    },
    {
      year: '2026',
      title: 'Akad & Hajatan Besar Betawi',
      description:
        'Mengikat janji suci di hadapan penghulu, sanak famili, dan para sesepuh dalam naungan keberkahan dan doa restu.',
    },
  ],

  gallery: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC38c0z_VRFW7pK5iEY8U1GecNyYvslcile2i98NOilLin6v5K2-EdEA-pw0lc5Ii-4Umtr-A2OHq10oR7AA91GmtqiLjbZdP5_M8cSzYDScBUa_6FPB3o222cYlN1FPrCxJ9yQzTbNhDErUc9P0RZ0PQjwaFOx8fa-KNvfb0o5Qj6Oy-E_2ONKQziS5NG2HznKRidJwLqFcdNwRhVHoqYJmRHb-35Ba81FILaNF79pktib-mMovGrI',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDvj315uDZXn4l54Z9rsWz5dxN7n1zN6tQMm75ogSwJUInNGK1hhmHf6v0uR63NqNlWYEdx7GfC5FRRfz22O-XrVEB2UiUv6bF3KzWX4qTDz_vB0uBhihZ2WueUDeU6-9cZka5s-Sf1fXL3bTJZ4TA9lPUir3qSMU-cVBi7FpLjbVxc6dWUjwZEs3UibXHSv5LVy-fL3OSpjqL7Tv68q1htN-U8JB0wHQY4Qhi-US6bkcKfe7JNpZF3',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAJsZ0fracfQoJP0PD9qX30gLxdwMBTZCCNdrQYozJXO6ZSzs-T02oubQQGtFZMzLl5yr508GBmd-MSK3lNDAmgi-TaYhhfs-CxXU2_VDmJUhI-i2wuo-wzh88Ldo3-GhDESotkfsBISYuwpMjbr6ZG6k8WUvF5mE2BBC65K4EoS2qM--XXXRE0vUWH2_J6kSl9EBEFLi9MM9Wh1jI-pC9SpSgdfxqLNmiW349uwvI-NnuEdif6RAGa',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDybcI1qsh9Kw7UsH7c7zJB8vBKJMy-GiJ_TXaS5QrcNk_zHntg7IHZKwYDa9b1KJQhH0zUVtQnHBfCtIOekzWXOpjO0lOJm4d16vAspthSyYuDrYaqIuokQPOudDKrFlPqg48IFqw4RTBH6zCYVajTyUxGbpjFTJV5n-kstRcEdBKLzT9hSDmX5Pz1AoNrdYJBrF4s6uE6WxagfakxdZImk32GjGnrYcjSenZVmK-YummYZ1L6DZM1',
  ],

  bank_accounts: [
    {
      bank_name: 'Bank Central Asia (BCA)',
      account_number: '8420198221',
      account_holder: 'Muhammad Rizky Pratama',
    },
    {
      bank_name: 'Bank Mandiri',
      account_number: '13700984432',
      account_holder: 'Siti Fatimah Azzahra',
    },
  ],
  banks: [
    {
      bank_name: 'Bank Central Asia (BCA)',
      account_number: '8420198221',
      account_holder: 'Muhammad Rizky Pratama',
    },
    {
      bank_name: 'Bank Mandiri',
      account_number: '13700984432',
      account_holder: 'Siti Fatimah Azzahra',
    },
  ],

  gift_address:
    'Kediaman Keluarga H. Ahmad Marzuki, Jl. Teuku Cik Ditiro No. 45, Menteng, Jakarta Pusat 10310 (Konfirmasi kurir: +62 812-9988-7711)',

  streaming_url: 'https://youtube.com/live',
  guest_name: 'Bapak/Ibu/Saudara/i',
};

export const MOCK_BETAWI_THEME: ThemeConfig = {
  primary_color: '#5E1914',
  music_url:
    'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
  music_title: 'Gambang Kromong • Lagu Sirih Kuning',
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
  show_livestream: true,
};

export const MOCK_BETAWI_WISHES: WishItem[] = [
  {
    id: 'w1',
    guest_name: 'H. Romli & Keluarga (Condet)',
    attendance: 'attending',
    message:
      'Selamat buat Abang Rizky & None Fatimah! Semoga langgeng kayak pohon kelapa, berkah rejekinye, rukun terus sampai kakek-nenek. Aamiin ya rabbal alamin.',
    created_at: '2026-10-25T14:30:00Z',
  },
  {
    id: 'w2',
    guest_name: 'Mpok Leha & Bang Jampang',
    attendance: 'attending',
    message:
      'Makan kerak telor diciprat kuah soto, selamat menempuh hidup baru buat kedua mempelai! Lancar acaranye, sukses pelaminan agung hajatan Betawinye!',
    created_at: '2026-10-26T09:15:00Z',
  },
  {
    id: 'w3',
    guest_name: 'Keluarga Besar Silat Beksi Petukangan',
    attendance: 'attending',
    message:
      'Barakallahu lakuma wa baraka alaikuma wa jama’a bainakuma fii khoir. Salam takzim dari kami sekeluarga perguruan.',
    created_at: '2026-10-27T18:45:00Z',
  },
];
