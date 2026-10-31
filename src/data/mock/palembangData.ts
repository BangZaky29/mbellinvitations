import type { InvitationData, ThemeConfig, WishItem } from '../../types/invitation';

export const MOCK_PALEMBANG_DATA: InvitationData = {
  groom: {
    name: 'M. Farhan',
    full_name: 'Kemas M. Farhan Pratama, S.T., M.B.A.',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBtkeawZsxXK8Vh7J0px2hri_9qkQJL7RoPNNQU3Bbin2dEwWum2MpOf70rzq1dj6K3ufrEmyAiNtc6CcPniF--DetWbdlqf7LGkbKWufpTw43j29rgWRuySZ1wzWCHuT3iuzXQOcGYVSLN1LZ3kB1dDiXbhzyKHXzVcyAzIErVyEkdVhCa4jC2Wwj1diG50Q4_YXEgI9H5MOLm2wa2xmhVDiXTMT-JJcSpDPL5m-EVb3PlbBzOpLwG',
    parent_father: 'Kemas H. Ahmad Ridwan',
    parent_mother: 'Nyayu Hj. Ratna Sari',
    child_order: 'Putra sulung dari Pasangan',
    parent_info: 'Kemas H. Ahmad Ridwan & Nyayu Hj. Ratna Sari',
    instagram: '@farhan.pratama',
  },
  bride: {
    name: 'Nyimas Ayu',
    full_name: 'Nyimas Ayu Larasati, S.Ked.',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAWtjU5TX5OYbELr_sliov4ZkbyMtbDcst5INcKMuL42oRm5XpUlM8wlbmyS8MOrj-XiPT6uoNv3UU-L9dxfSWDyeDhVpz-Gpn0R2wU-IkXuUPsbfT_IQwqWp3anMIgDrMOSNsuxoiD1gTWf5JTDQBvUzx3hDDz42AxVLDFn9XlhqXC0hvVnD3Wtp1HxQo3BCPZEU6kBAL6NDPIdQJBHlZ13ZSzLQNxUowzozjPY727GEgaYWfyfb3O',
    parent_father: 'Masagus H. Ilham Thamrin',
    parent_mother: 'Masayu Hj. Halimah',
    child_order: 'Putri kedua dari Pasangan',
    parent_info: 'Masagus H. Ilham Thamrin & Masayu Hj. Halimah',
    instagram: '@nyimas.larasati',
  },
  theme_id: 'palembang',
  is_bride_first: false,
  cover_image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD59rgArBdfRwt0Bj91rgR2eMbbqZi_g7zCYxT1wcPVUXn4e68polrx3SYZ5MCnHMmPBsL8tLydsNPPZJ5vYmQTzUSDCkmF9qrV1JyH0oP74j3EPHFCJ6O9yruV8HPNjRh1LGdNOf8YUHwIRhJGxUK6j9OkVOXIb1O3kW2LSP6zHcCPuDBP4hUdhLVDxLWWUpLKK62dHj6pcVK4FiUpUPuu8ZIOVaL0mpX48Dl08Q7_WJhiwRBl-NWp',
  couple_photo:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD59rgArBdfRwt0Bj91rgR2eMbbqZi_g7zCYxT1wcPVUXn4e68polrx3SYZ5MCnHMmPBsL8tLydsNPPZJ5vYmQTzUSDCkmF9qrV1JyH0oP74j3EPHFCJ6O9yruV8HPNjRh1LGdNOf8YUHwIRhJGxUK6j9OkVOXIb1O3kW2LSP6zHcCPuDBP4hUdhLVDxLWWUpLKK62dHj6pcVK4FiUpUPuu8ZIOVaL0mpX48Dl08Q7_WJhiwRBl-NWp',

  wedding_date_iso: '2026-11-14T08:00:00+07:00',
  wedding_date_display: 'Sabtu, 14 November 2026',
  countdown_target: 'resepsi',

  quote_title: 'Sekapur Sirih Doa Restu',
  quote_religion: 'islam',
  quote_arabic:
    'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
  quote:
    '“Kapal berlayar ke Sungai Musi,\nsinggah sebentar di Pulau Kemaro.\nNiat suci mematri janji,\nmohon doa restu sanak dan dulur.”',
  quote_source:
    'QS. Ar-Rum: 21 — “Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.”',
  hashtag: '#FarhanNyimasSatuHati',

  dresscode: {
    enabled: true,
    title: 'Panduan Busana Tamu',
    subtitle:
      'Bapak/Ibu sanak dulur disarankan mengenakan Batik Palembang, Songket Lepus Halus, atau Busana Formal bernuansa:',
    colors: [
      { name: 'Lacquer', hex: '#4A0E12' },
      { name: 'Songket', hex: '#EAC168' },
      { name: 'Cempako', hex: '#FDF9F2' },
      { name: 'Lotus', hex: '#072A1E' },
      { name: 'Krem', hex: '#E6E2DB' },
    ],
  },

  events: [
    {
      name: 'Akad Nikah & Cacah Inai',
      title: 'Akad Nikah & Cacah Inai',
      date: 'Sabtu, 14 November 2026',
      time: '08.00 - 10.00 WIB',
      start_time: '08:00',
      end_time: '10:00',
      timezone: 'WIB',
      venue_name: 'The Grand Sriwijaya Royal Ballroom',
      venue_address:
        'Jl. Jenderal Sudirman No. 88, 20 Ilir D. IV, Ilir Timur I, Kota Palembang, Sumatera Selatan 30114',
      maps_url: 'https://maps.google.com/?q=-2.9760,104.7558',
    },
    {
      name: 'Tari Gending Sriwijaya & Munggah',
      title: 'Tari Gending Sriwijaya & Munggah',
      date: 'Sabtu, 14 November 2026',
      time: '10.30 - 12.00 WIB',
      start_time: '10:30',
      end_time: '12:00',
      timezone: 'WIB',
      venue_name: 'The Grand Sriwijaya Royal Ballroom',
      venue_address:
        'Jl. Jenderal Sudirman No. 88, 20 Ilir D. IV, Ilir Timur I, Kota Palembang, Sumatera Selatan 30114',
      maps_url: 'https://maps.google.com/?q=-2.9760,104.7558',
    },
    {
      name: 'Resepsi & Tradisi Ngobeng Palembang',
      title: 'Resepsi & Tradisi Ngobeng Palembang',
      date: 'Sabtu, 14 November 2026',
      time: '12.00 - 16.00 WIB',
      start_time: '12:00',
      end_time: '16:00',
      timezone: 'WIB',
      venue_name: 'The Grand Sriwijaya Royal Ballroom',
      venue_address:
        'Jl. Jenderal Sudirman No. 88, 20 Ilir D. IV, Ilir Timur I, Kota Palembang, Sumatera Selatan 30114',
      maps_url: 'https://maps.google.com/?q=-2.9760,104.7558',
    },
  ],

  love_story: [
    {
      year: '2021',
      title: 'Pandangan Pertama di Tepian Musi',
      story:
        'Di bawah kilau gemerlap Jembatan Ampera dan hembusan angin sejuk Sungai Musi, perjumpaan pertama membuka jalan bagi untaian cerita kami berdua.',
    },
    {
      year: '2023',
      title: 'Sekapur Sirih Mengetuk Pintu Hati',
      story:
        'Mengikuti adat luhur Palembang Darussalam, keluarga bersilaturahmi membawa Tepak Sirih tanda kesungguhan niat meminang sang pujaan hati.',
    },
    {
      year: '2026',
      title: 'Munggah & Janji Suci Pelaminan',
      story:
        'Berbalut kemegahan Songket Lepus benang emas dan busana kebesaran Aesan Gede, kami melangkah bersama menuju ikatan suci pernikahan berlandaskan ridho Ilahi.',
    },
  ],

  gallery: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD59rgArBdfRwt0Bj91rgR2eMbbqZi_g7zCYxT1wcPVUXn4e68polrx3SYZ5MCnHMmPBsL8tLydsNPPZJ5vYmQTzUSDCkmF9qrV1JyH0oP74j3EPHFCJ6O9yruV8HPNjRh1LGdNOf8YUHwIRhJGxUK6j9OkVOXIb1O3kW2LSP6zHcCPuDBP4hUdhLVDxLWWUpLKK62dHj6pcVK4FiUpUPuu8ZIOVaL0mpX48Dl08Q7_WJhiwRBl-NWp',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAWtjU5TX5OYbELr_sliov4ZkbyMtbDcst5INcKMuL42oRm5XpUlM8wlbmyS8MOrj-XiPT6uoNv3UU-L9dxfSWDyeDhVpz-Gpn0R2wU-IkXuUPsbfT_IQwqWp3anMIgDrMOSNsuxoiD1gTWf5JTDQBvUzx3hDDz42AxVLDFn9XlhqXC0hvVnD3Wtp1HxQo3BCPZEU6kBAL6NDPIdQJBHlZ13ZSzLQNxUowzozjPY727GEgaYWfyfb3O',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBtkeawZsxXK8Vh7J0px2hri_9qkQJL7RoPNNQU3Bbin2dEwWum2MpOf70rzq1dj6K3ufrEmyAiNtc6CcPniF--DetWbdlqf7LGkbKWufpTw43j29rgWRuySZ1wzWCHuT3iuzXQOcGYVSLN1LZ3kB1dDiXbhzyKHXzVcyAzIErVyEkdVhCa4jC2Wwj1diG50Q4_YXEgI9H5MOLm2wa2xmhVDiXTMT-JJcSpDPL5m-EVb3PlbBzOpLwG',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC763YkUJCuiTrGscxRQ7Bfv4h1E6H58fnRKCOJ-mlAETKKIqSqigNOJuJgGxZuCBr40un0ZHUxfcUKBgmTo_Waia7IZwjACTRwOkdv8ZozTxVfLBszb-QbaBPknrgQrkuMks35gARZ8H7T-0CsnxhGFpSmM32ZgYdTRcdH029kkqWCRIyoZvpv5Mc4eKu2gl8Y9XDN4bOw7tCQkVATG0qp8Y4ntcW9wS22iwgNwOOPdypCwcPWlTb-',
  ],

  banks: [
    {
      bank_name: 'Bank Central Asia (BCA)',
      account_number: '8420198331',
      account_holder: 'Kemas M. Farhan Pratama',
    },
    {
      bank_name: 'Bank Mandiri',
      account_number: '11300987721',
      account_holder: 'Nyimas Ayu Larasati',
    },
  ],

  gift_address:
    'Kediaman Mempelai (Kemas Farhan & Nyimas Ayu)\nJl. Mayor Santoso No. 12, 20 Ilir, Ilir Timur I, Kota Palembang, Sumatera Selatan 30129\n(Konfirmasi penerima: +62 812-7890-1234)',

  streaming_url: 'https://youtube.com/live',
  livestream_url: 'https://youtube.com/live',
  guest_name: 'Bapak Raden H. Zainal Abidin',
};

export const MOCK_PALEMBANG_THEME: ThemeConfig = {
  primary_color: '#4A0E12',
  music_url:
    'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
  music_title: 'Gending Sriwijaya • Iringan Tabuh Agung',
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

export const MOCK_PALEMBANG_WISHES: WishItem[] = [
  {
    id: 'w-palembang-1',
    guest_name: 'Kgs. H. Baharuddin & Nyimas Hj. Zubaidah',
    attendance: 'attending',
    message:
      'Barakallahu lakuma wa baraka ‘alaikuma wa jama’a bainakuma fii khoir. Selamat menempuh hidup baru untuk Kemas Farhan dan Nyimas Ayu. Semoga sakinah mawaddah warahmah, rukun damai sampai anak cucu.',
    created_at: '2026-11-08T09:15:00Z',
  },
  {
    id: 'w-palembang-2',
    guest_name: 'Raden M. Syukri & Keluarga Besar Wong Kito',
    attendance: 'attending',
    message:
      'Payo sanak dulur, selamat menempuh bahtera rumah tangga yang agung. Semoga limpahan berkah dan rezeki selalu mengalir seperti arus Sungai Musi bagi kedua mempelai.',
    created_at: '2026-11-09T14:20:00Z',
  },
  {
    id: 'w-palembang-3',
    guest_name: 'dr. Masayu Citra Dewi, Sp.A',
    attendance: 'attending',
    message:
      'Selamat berbahagia untuk adik tercinta Nyimas Ayu dan Kemas Farhan. Turut bersuka cita atas pernikahan adat Palembang yang sangat megah dan sakral ini. Aamiin ya Rabbal ‘Alamin.',
    created_at: '2026-11-10T11:45:00Z',
  },
];
