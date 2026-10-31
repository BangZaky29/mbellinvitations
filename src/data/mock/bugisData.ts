import type { InvitationData, ThemeConfig, WishItem } from '../../types/invitation';

export const MOCK_BUGIS_DATA: InvitationData = {
  groom: {
    name: 'Andi Fauzan',
    full_name: 'Andi Fauzan Pratama, S.T., M.Sc.',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA5iPu1V7l1Dxz7-YQzWEY6-9AzgdfqQ-xbx3yxPUg9VkdnxL7YYlDXSiBSYTBtLhfTOaK8Ij29KT5CaVj__9aUpgR5qusJTLofCjenrapTOWeKkrp27ueQDzapAnXCJyV3h7knLdr70b29gG2diTQNIh2SkdwtAi_fHob6gfSEhe0RsN9-N3NNaXcfNse-nju4N3nvj8VJhwr-tw2hox1hKkRhGkFrey-8r80rKyJfZbX0bzhB_mQ6',
    parent_father: 'Bpk. Andi Muhammad Ridwan',
    parent_mother: 'Ibu Hj. Andi Bau Mirah',
    child_order: 'Putra pertama dari Pasangan',
    parent_info: 'Bpk. Andi Muhammad Ridwan & Ibu Hj. Andi Bau Mirah',
    instagram: '@andi.fauzan',
  },
  bride: {
    name: 'Andi Tenri',
    full_name: 'Andi Tenri Olle, S.Ked.',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBx6CY-lmGdNYlDAeONVZWfZfclZxWpNktDwFgD8k3y4_Or5RkKVQUR0MHOqFUMZdJmP3t6wfdNTGUDIVpY2SksTBvJDHg8EHQaRYwkcEqVw6FYb57Ftpq8rw7bJq7CXg-uEnFdnY-xbxByP43GSfRJUNMZ9eTt58V-OP7la75Mmt0vs6eRiEmJheMqp_eJtuYnyFoQsARM-3N--OuRkUmUx46GgE5qYRIw-H55-k7bRXyJs7EVnwJy',
    parent_father: 'Bpk. Dr. Andi Ilham Karaeng Patunru',
    parent_mother: 'Ibu Hj. Andi Sitti Aminah',
    child_order: 'Putri bungsu dari Pasangan',
    parent_info: 'Bpk. Dr. Andi Ilham Karaeng Patunru & Ibu Hj. Andi Sitti Aminah',
    instagram: '@tenri.olle',
  },
  theme_id: 'bugis',
  is_bride_first: false,
  cover_image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDfeDHwF42vYu1DgHDFyle8ek_U1PyU6WuDh02hF8CiImTCmoSo7XoNZC6SRw7k1v4WoI7jbQK-OW3Ip0UZKGDVljSMPkFjF4T31cUQQ6hyu823kS9jCGyLxZu-T-HY8oMdvofScTbJ8fYCITYJHtX0dAnkPwiokrI09qeXH9USB6_0gQaI2aub3lXtZGxGLjoIApmt0-rBJ6Iwpan63-GEj0ExP8doGSF5QrZpEUV-k3z1m-oSUh_0',
  couple_photo:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDfeDHwF42vYu1DgHDFyle8ek_U1PyU6WuDh02hF8CiImTCmoSo7XoNZC6SRw7k1v4WoI7jbQK-OW3Ip0UZKGDVljSMPkFjF4T31cUQQ6hyu823kS9jCGyLxZu-T-HY8oMdvofScTbJ8fYCITYJHtX0dAnkPwiokrI09qeXH9USB6_0gQaI2aub3lXtZGxGLjoIApmt0-rBJ6Iwpan63-GEj0ExP8doGSF5QrZpEUV-k3z1m-oSUh_0',

  wedding_date_iso: '2026-12-12T09:00:00+08:00',
  wedding_date_display: 'Sabtu, 12 Desember 2026',
  countdown_target: 'resepsi',

  quote_title: 'Filosofi Luhur & Doa Suci',
  quote_religion: 'islam',
  quote_arabic:
    'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
  quote:
    'ᨔᨗᨄᨀᨈᨕᨘ ᨔᨗᨄᨀᨕᨗᨂᨙ ᨔᨗᨄᨀᨒᨙᨅᨗ — “Sipakatau, Sipakainge, Sipakalebbi (Saling memanusiakan, saling mengingatkan dalam kebaikan, dan saling memuliakan martabat).”',
  quote_source:
    'QS. Ar-Rum: 21 • “Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.”',
  hashtag: '#FauzanTenriRoyalBugis',

  dresscode: {
    enabled: true,
    title: 'Panduan Busana Tamu (Attire Guide)',
    subtitle:
      'Tamu undangan terhormat disarankan mengenakan Baju Bodo, Jas Tutu, atau busana bernuansa kerajaan Bugis-Makassar:',
    colors: [
      { name: 'Royal Emerald', hex: '#0F2E22' },
      { name: 'Prada Gold', hex: '#D4AF37' },
      { name: 'Pearl Ivory', hex: '#F8F5EE' },
      { name: 'Silk Beige', hex: '#E2D9C8' },
      { name: 'Noble Sage', hex: '#6E8B76' },
    ],
  },

  events: [
    {
      name: 'Malam Mappacci (Penyucian Diri)',
      title: 'Malam Mappacci (Penyucian Diri)',
      date: 'Jumat, 11 Desember 2026',
      time: '19:30 WITA',
      start_time: '19:30',
      end_time: '22:00',
      timezone: 'WITA',
      venue_name: 'Saoraja Kediaman Keluarga Mempelai',
      venue_address:
        'Jl. Botolempangan No. 42, Sawerigading, Kec. Ujung Pandang, Kota Makassar, Sulawesi Selatan 90115',
      venue_city: 'Makassar',
      maps_url: 'https://maps.google.com/?q=Jl.+Botolempangan+Makassar',
      icon: 'spa',
      badge: 'Malam Pensucian',
    },
    {
      name: 'Akad Nikah & Mappasikarawa',
      title: 'Akad Nikah & Mappasikarawa',
      date: 'Sabtu, 12 Desember 2026',
      time: '09:00 WITA',
      start_time: '09:00',
      end_time: '11:00',
      timezone: 'WITA',
      venue_name: 'Masjid Raya Makassar',
      venue_address:
        'Jl. Masjid Raya, Bontoala, Kec. Bontoala, Kota Makassar, Sulawesi Selatan 90151',
      venue_city: 'Makassar',
      maps_url: 'https://maps.google.com/?q=Masjid+Raya+Makassar',
      icon: 'favorite',
      badge: 'Akad Khidmat',
    },
    {
      name: 'Tudang Bottung (Resepsi Adat Kebesaran)',
      title: 'Tudang Bottung (Resepsi Adat Kebesaran)',
      date: 'Sabtu, 12 Desember 2026',
      time: '11:30 - 15:00 WITA',
      start_time: '11:30',
      end_time: '15:00',
      timezone: 'WITA',
      venue_name: 'The Phinisi Grand Ballroom • Hotel Claro Makassar',
      venue_address:
        'Jl. A. P. Pettarani No. 03, Gunungsari, Kec. Rappocini, Kota Makassar, Sulawesi Selatan 90222',
      venue_city: 'Makassar',
      maps_url: 'https://maps.google.com/?q=Hotel+Claro+Makassar',
      icon: 'celebration',
      badge: 'Puncak Acara',
    },
  ],

  love_story: [
    {
      year: '2021',
      title: 'Perjumpaan di Tepian Paotere',
      description:
        'Awal mula pertemuan indah saat silaturahmi keluarga bangsawan di tepian dermaga Phinisi Makassar, menyatukan dua garis kekerabatan Daeng dan Karaeng.',
    },
    {
      year: '2024',
      title: 'Madduta & Mappetuada (Musyawarah Adat)',
      description:
        'Prosesi perutusan keluarga pihak pria membawa sompa dan seserahan adat untuk meresmikan ikrar kesepakatan hari suci pernikahan.',
    },
    {
      year: '2026',
      title: 'Mappasikarawa & Tudang Bottung',
      description:
        'Penyatuan dua insan dalam mahligai rumah tangga agung berlandaskan adat luhur Bugis-Makassar dan syariat Islam yang penuh berkah.',
    },
  ],

  gallery: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDfeDHwF42vYu1DgHDFyle8ek_U1PyU6WuDh02hF8CiImTCmoSo7XoNZC6SRw7k1v4WoI7jbQK-OW3Ip0UZKGDVljSMPkFjF4T31cUQQ6hyu823kS9jCGyLxZu-T-HY8oMdvofScTbJ8fYCITYJHtX0dAnkPwiokrI09qeXH9USB6_0gQaI2aub3lXtZGxGLjoIApmt0-rBJ6Iwpan63-GEj0ExP8doGSF5QrZpEUV-k3z1m-oSUh_0',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA5iPu1V7l1Dxz7-YQzWEY6-9AzgdfqQ-xbx3yxPUg9VkdnxL7YYlDXSiBSYTBtLhfTOaK8Ij29KT5CaVj__9aUpgR5qusJTLofCjenrapTOWeKkrp27ueQDzapAnXCJyV3h7knLdr70b29gG2diTQNIh2SkdwtAi_fHob6gfSEhe0RsN9-N3NNaXcfNse-nju4N3nvj8VJhwr-tw2hox1hKkRhGkFrey-8r80rKyJfZbX0bzhB_mQ6',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBx6CY-lmGdNYlDAeONVZWfZfclZxWpNktDwFgD8k3y4_Or5RkKVQUR0MHOqFUMZdJmP3t6wfdNTGUDIVpY2SksTBvJDHg8EHQaRYwkcEqVw6FYb57Ftpq8rw7bJq7CXg-uEnFdnY-xbxByP43GSfRJUNMZ9eTt58V-OP7la75Mmt0vs6eRiEmJheMqp_eJtuYnyFoQsARM-3N--OuRkUmUx46GgE5qYRIw-H55-k7bRXyJs7EVnwJy',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCFbuoVDYzIHpXTJDd73fPHfS-vAhqR5DehL7y0692C3T5hLJ8JLfRhX15KwXA4LI7tx0iUjpBotUU0XRaUamA9RpXkBw41NTYW7ZfpdL0qen1sX-y7QmvJjKIH27OR4Wtd1Cp9ZbKSVLU-4XgDogyQGEaW6Ya35Q_ticPag_mI78CPTDDJGLmLszPPOKhPzjHvwZYq_qLAJMuXzdRrXDNvBGTzPj_EkNzpL_w6B2H307Gi0ysZ10_i',
  ],

  bank_accounts: [
    {
      bank_name: 'Bank Mandiri',
      account_number: '1520098477121',
      account_holder: 'Andi Fauzan Pratama',
    },
    {
      bank_name: 'Bank Central Asia (BCA)',
      account_number: '7890334155',
      account_holder: 'Andi Tenri Olle',
    },
  ],
  banks: [
    {
      bank_name: 'Bank Mandiri',
      account_number: '1520098477121',
      account_holder: 'Andi Fauzan Pratama',
    },
    {
      bank_name: 'Bank Central Asia (BCA)',
      account_number: '7890334155',
      account_holder: 'Andi Tenri Olle',
    },
  ],

  gift_address:
    'Kediaman Keluarga Andi Fauzan, Jl. Botolempangan No. 42, Sawerigading, Kec. Ujung Pandang, Kota Makassar, Sulawesi Selatan 90115 (Konfirmasi kurir/penerima: Andi Fauzan / 0812-4455-8899)',

  streaming_url: 'https://youtube.com/live',
  guest_name: 'Bapak/Ibu/Saudara/i',
};

export const MOCK_BUGIS_THEME: ThemeConfig = {
  primary_color: '#F2CA50',
  music_url:
    'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
  music_title: 'Kecapi Suling Bugis • Baju Bodo Tokko',
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

export const MOCK_BUGIS_WISHES: WishItem[] = [
  {
    id: 'w1',
    guest_name: 'Andi Baso Karaeng & Keluarga (Somba Opu)',
    attendance: 'attending',
    message:
      'Kurru Sumanga’ — Selamat atas pernikahan agung Ananda Andi Fauzan & Andi Tenri. Semoga senantiasa dipenuhi sakinah, mawaddah, warahmah, rukun damai dalam naungan Sipakatau, Sipakainge, Sipakalebbi.',
    created_at: '2026-10-25T14:30:00Z',
  },
  {
    id: 'w2',
    guest_name: 'Datu Mappanyukki & Sahabat Alumni',
    attendance: 'attending',
    message:
      'Barakallahu lakuma wa baraka alaikuma wa jama’a bainakuma fii khoir. Selamat melangkah bersama menatap masa depan yang cerah, Daeng Mattutu & Daeng Bau!',
    created_at: '2026-10-26T09:15:00Z',
  },
  {
    id: 'w3',
    guest_name: 'Kerukunan Keluarga Sulawesi Selatan (KKSS)',
    attendance: 'attending',
    message:
      'Selamat menempuh hidup baru. Turut bersukacita atas perhelatan Tudang Bottung yang sakral dan penuh kebesaran adat luhur tanah Bugis-Makassar.',
    created_at: '2026-10-27T18:45:00Z',
  },
];

