import type { InvitationData, ThemeConfig, WishItem } from '../../types/invitation';

export const MOCK_BATAK_DATA: InvitationData = {
  groom: {
    name: 'Johannes',
    full_name: 'Johannes Parlindungan Siregar, S.T., M.B.A.',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD7ul7JpVEUwTKOddyKJL42jdmBf9BvugyW8n5K0ckhOAkBeS1zwjL_An4ucB0kFz-NVopaFXia3QiNDJ5lSs5FQn4LktVL64uL32UiOg2OLd7w5Ak60GXdZsuVXeJFnOeCugwmZKQ8gWxkDH30MSrIvHTdcFQ5uN-GTc2TPzEJMCGYAyWTwONGyLCMcvJPj7GFogzG5mCxBgV6kC9xdkZoWkPfeUy6Q7Jy8qRq3IsY9iYmbgxUMqUO',
    parent_father: 'Bpk. Ir. Mangantar Siregar',
    parent_mother: 'Ibu Donna br. Hutabarat',
    child_order: 'Putra sulung (Anak Sasada) dari',
    parent_info: 'Bpk. Ir. Mangantar Siregar & Ibu Donna br. Hutabarat',
    instagram: '@johannes.siregar',
  },
  bride: {
    name: 'Melisa',
    full_name: 'dr. Melisa Yohana br. Simanjuntak, Sp.A.',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuACluK0g8lfNC6qzb0-HsuAuxxdLkgtUyxM9rcegwbzLZGkFWhJelsj4g97nZIA9LnzZ_hGg7SMoYbbVi2nT4sboQjm3991lgQhb3ImR_s4S3duYz_yro4gyK_PzAHM3wLeBc-UAuu5_3XGTfyeP4Xu7OV6wo9mJBgAkwMHDIlHC1HP1YcnK3OsifSacXbZd_ztpfyVoD7kmw_zzr-QOYSRcl-QZPsj573UyPbM9bYlyYO6iQ8v_i6U',
    parent_father: 'Bpk. Dr. Tumpal Simanjuntak, Sp.A',
    parent_mother: 'Ibu Christine br. Nainggolan',
    child_order: 'Putri tercinta (Boru Sasada) dari',
    parent_info: 'Bpk. Dr. Tumpal Simanjuntak, Sp.A & Ibu Christine br. Nainggolan',
    instagram: '@melisa.simanjuntak',
  },
  theme_id: 'batak',
  is_bride_first: false,
  cover_image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCSaBmrSBPc6JBKfMGqLIwMcxmJRsHH9qVZk8tBz0UbaTiqr__0cHe8qR7wa7pIidP8_8Og6HU73yBrOcZrSmoR0VOzFQbGjcAul7SLH3jLgnI3x7rrgaoHvaFdDgPWvWh-qvNSEonSJkhF0b6eLzJhN8v8BtpscySxZyQIK0FiwUhAhT03f0hmkC2Qs4L0mvbWQTNDyHGHXOByJ1ZMOP4CT3YnyDEde8G5oelkyODSd9uKn2rKVdGU',
  couple_photo:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCSaBmrSBPc6JBKfMGqLIwMcxmJRsHH9qVZk8tBz0UbaTiqr__0cHe8qR7wa7pIidP8_8Og6HU73yBrOcZrSmoR0VOzFQbGjcAul7SLH3jLgnI3x7rrgaoHvaFdDgPWvWh-qvNSEonSJkhF0b6eLzJhN8v8BtpscySxZyQIK0FiwUhAhT03f0hmkC2Qs4L0mvbWQTNDyHGHXOByJ1ZMOP4CT3YnyDEde8G5oelkyODSd9uKn2rKVdGU',

  wedding_date_iso: '2026-11-14T09:00:00+07:00',
  wedding_date_display: 'Sabtu, 14 November 2026',
  countdown_target: 'resepsi',

  quote_title: 'Ayat Pemberkatan & Tradisi Batak',
  quote_religion: 'kristen',
  quote_arabic: '',
  quote:
    '“Dua gabe sada, marsitangiangan di bagas holong ni Kristus” — Dua Menjadi Satu Berpadu Kasih di Hadapan Tuhan',
  quote_source:
    '1 Korintus 13 : 4-8 • “Holong na sintong i, ndang marnaloas; sabam do rohana, marhabasaon, jala ndang mangiburu.”',
  hashtag: '#JohannesMelisaMangalapBoru',

  dresscode: {
    enabled: true,
    title: 'Panduan Busana (Dress Code)',
    subtitle:
      'Tamu undangan dipersilakan mengenakan busana Formal Nusantara / Batik Tulis / Tenun Songket / Kebaya bernuansa warna berikut:',
    colors: [
      { name: 'Terracotta', hex: '#9E3B2B' },
      { name: 'Ebony Wood', hex: '#241C18' },
      { name: 'Sortali Gold', hex: '#C8A253' },
      { name: 'Warm Ivory', hex: '#F4EFE6' },
      { name: 'Ulos Maroon', hex: '#661D24' },
      { name: 'Forest Sage', hex: '#5B6349' },
    ],
  },

  events: [
    {
      name: 'Pemberkatan Nikah Kudus',
      title: 'Pemberkatan Nikah Kudus',
      date: 'Sabtu, 14 November 2026',
      time: '09.00 - 11.00 WIB',
      venue_name: 'Gereja HKBP Menteng',
      venue_address:
        'Jl. Jambu No. 29, RT 05/RW 02, Gondangdia, Kec. Menteng, Kota Jakarta Pusat, DKI Jakarta 10350',
      maps_url: 'https://maps.google.com/?q=Gereja+HKBP+Menteng+Jakarta',
      icon: 'church',
      badge: 'Sakramen Kudus',
    },
    {
      name: 'Pesta Adat Batak & Resepsi',
      title: 'Resepsi Pesta Adat & Mangulosi',
      date: 'Sabtu, 14 November 2026',
      time: '11.30 - 18.30 WIB',
      venue_name: 'The Grand Toba Ballroom, Hotel Mulia Senayan',
      venue_address:
        'Jl. Asia Afrika No. 6, Gelora, Kecamatan Tanah Abang, Kota Jakarta Pusat, DKI Jakarta 10270',
      maps_url: 'https://maps.google.com/?q=Hotel+Mulia+Senayan+Jakarta',
      icon: 'celebration',
      badge: 'Gondang Sabangunan & Tortor',
    },
  ],

  love_story: [
    {
      year: '2021',
      title: 'Partondongan di Tao Toba',
      description:
        'Pertemuan indah di tepian Danau Toba, berawal dari ramah tamah marga yang menumbuhkan rasa kagum dan kehangatan hati.',
    },
    {
      year: '2024',
      title: 'Marhusip & Marhata Sinamot',
      description:
        'Pertemuan keluarga besar Raja Parhata untuk membicarakan rencana adat secara sakral dan penuh kehormatan.',
    },
    {
      year: '2026',
      title: 'Pamasu-masuon & Ulos Hela',
      description:
        'Kini kami bersiap mengikat janji suci di hadapan Tuhan Yesus dan menerima Ulos Hela dari orang tua tercinta.',
    },
  ],

  gallery: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCSaBmrSBPc6JBKfMGqLIwMcxmJRsHH9qVZk8tBz0UbaTiqr__0cHe8qR7wa7pIidP8_8Og6HU73yBrOcZrSmoR0VOzFQbGjcAul7SLH3jLgnI3x7rrgaoHvaFdDgPWvWh-qvNSEonSJkhF0b6eLzJhN8v8BtpscySxZyQIK0FiwUhAhT03f0hmkC2Qs4L0mvbWQTNDyHGHXOByJ1ZMOP4CT3YnyDEde8G5oelkyODSd9uKn2rKVdGU',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD7ul7JpVEUwTKOddyKJL42jdmBf9BvugyW8n5K0ckhOAkBeS1zwjL_An4ucB0kFz-NVopaFXia3QiNDJ5lSs5FQn4LktVL64uL32UiOg2OLd7w5Ak60GXdZsuVXeJFnOeCugwmZKQ8gWxkDH30MSrIvHTdcFQ5uN-GTc2TPzEJMCGYAyWTwONGyLCMcvJPj7GFogzG5mCxBgV6kC9xdkZoWkPfeUy6Q7Jy8qRq3IsY9iYmbgxUMqUO',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuACluK0g8lfNC6qzb0-HsuAuxxdLkgtUyxM9rcegwbzLZGkFWhJelsj4g97nZIA9LnzZ_hGg7SMoYbbVi2nT4sboQjm3991lgQhb3ImR_s4S3duYz_yro4gyK_PzAHM3wLeBc-UAuu5_3XGTfyeP4Xu7OV6wo9mJBgAkwMHDIlHC1HP1YcnK3OsifSacXbZd_ztpfyVoD7kmw_zzr-QOYSRcl-QZPsj573UyPbM9bYlyYO6iQ8v_i6U',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBIltz_sSVgMheSBVwKp8eUtJ0_E5tV0ivr7sMS6-0fvaXgi5Enclfx2bItNCS_oNsVT42pirSpMPy4OBG9-GcJ_HUPvXS4FaKr6o8BLhf8rzoYJW0d6u0ngeo3QhVn0WJu68ApTsdiLYOieKGMskaVi8_BTax2UiPqBpgXrbuxAzME-2fcjEWVYHB4N84m31JKYLhy2FlXL1ua40kwaXjGrC8SihSxzSkuIZCSvgyRzlVTrw3N2zPv',
  ],

  banks: [
    {
      bank_name: 'Bank Mandiri',
      account_number: '1370 0192 8472 1',
      account_holder: 'Johannes Parlindungan Siregar',
      account_number_raw: '1370019284721',
    },
    {
      bank_name: 'Bank BCA',
      account_number: '5420 8819 23',
      account_holder: 'Melisa Yohana Simanjuntak',
      account_number_raw: '5420881923',
    },
  ],

  gift_address:
    'Kediaman Keluarga Siregar: Jl. Patra Kuningan VII No. 14, RT 06/RW 04, Kuningan Timur, Setiabudi, Jakarta Selatan 12950 (Penerima: Johannes Siregar / 0812-8899-7711)',
  qris_url: '',
};

export const MOCK_BATAK_THEME: ThemeConfig = {
  primary_color: '#C8A253',
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
  music_url:
    'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
  show_quote: true,
  show_dresscode: true,
  show_rsvp: true,
  show_gift: true,
  show_wishes: true,
  show_gallery: true,
  show_love_story: true,
};

export const MOCK_BATAK_WISHES: WishItem[] = [
  {
    id: 'w-batak-1',
    guest_name: 'Bpk. St. Mangapul Siregar & Keluarga',
    attendance: 'attending',
    message:
      'Selamat mangalap boru tu lae Johannes dohot paribandiba dr. Melisa. Sai gabe jala horas ma pardengganbasaon muna, tubu anak na bisuk jala boru na malo marparange.',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'w-batak-2',
    guest_name: 'Ny. Dameria Simanjuntak br. Sitompul',
    attendance: 'attending',
    message:
      'Tuhan Yesus memberkati bahtera rumah tangga Johannes dan Melisa. Seia sekata menapaki jalan hidup baru di dalam damai Kristus.',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'w-batak-3',
    guest_name: 'Keluarga Besar Parsadaan Pomparan Siraja Oloan',
    attendance: 'attending',
    message:
      'Horas jala gabe! Kiranya pesta adat berlangsung dengan lancar, penuh berkat dan sukacita dari awal hingga selesai.',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
];
