import type { InvitationData, ThemeConfig, WishItem } from '../../types/invitation';

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

  quote_title: 'Ungkapan Kasih & Janji',
  quote_religion: 'universal',
  quote_arabic: '',
  quote:
    'Dan di antara tanda-tanda kebesaran-Nya diciptakan-Nya untukmu pasangan hidup dari jenismu sendiri supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.',
  quote_source: 'QS. Ar-Rum: 21',
  hashtag: '#RomeoJulietForever',

  dresscode: {
    enabled: true,
    title: 'Panduan Busana (Dress Code)',
    subtitle:
      'Tamu undangan diharapkan mengenakan pakaian bernuansa warna alam / botanical rustic:',
    colors: [
      { name: 'Earth Terracotta', hex: '#9E3B2B' },
      { name: 'Forest Green', hex: '#4E6B50' },
      { name: 'Warm Sand', hex: '#D8C4B6' },
      { name: 'Kraft Brown', hex: '#8C6D58' },
      { name: 'Pure Linen', hex: '#FAF7F2' },
    ],
  },

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
