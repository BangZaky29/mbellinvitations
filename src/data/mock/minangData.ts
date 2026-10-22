import type { InvitationData, ThemeConfig, WishItem } from '../../types/invitation';

export const MOCK_MINANG_DATA: InvitationData = {
  groom: {
    name: 'Farhan',
    full_name: 'Farhan Al-Ghifari, S.T., M.Sc.',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCXKmE54OTIFHSVXCm7XRblmdEHEXPmQDEoxbImtKMM5XnTPSWuNQ9rzggqwZf8HQ9jjv8RdSH_taax0q3ATesgmIfMAE7LhDi-IIDhncothrG1fqIwNoPoTdOkzd-Lo7SfpNafq65Sc7LHp9kblje7PNYXVM1SmEg7ZQGrmpnIdIJd_bJVUuXI50us3l67wWTTsGGUUdqUF6RsURGqu8rJP6xL9K0P0M1CnglMHN1iG4wk0HNgX0D9',
    parent_father: 'Bpk. Dr. H. Irwan Chaniago',
    parent_mother: 'Ibu Hj. Rosmawati',
    child_order: 'Putra sulung dari',
    parent_info: 'Bpk. Dr. H. Irwan Chaniago & Ibu Hj. Rosmawati',
    instagram: '@farhan.ghifari',
  },
  bride: {
    name: 'Nadia',
    full_name: 'Nadia Larasati, S.Ds.',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJvKvZ2xgLAnECRSyY58tE27Axd2hSIlTg0aNlPcfBk27c-WI7BI5DGQcQofS0eOnAhKumPQuxc6SEwE2aLYsmbM3lntrCRb_WSjLZcDWuCmOSqhAAlQrmpP5uf55MxIrpYA33C7UMSTIVnyfmUSyErIrFIEeCx2vjWKqWRev0rmZEj8qwIrI3GCng5iapknfYTc2LmihwTI63bEjLW8HaTUPEx_0cLuFk3D8540QBMpUjxm4IRc-t',
    parent_father: 'Bpk. H. Syamsul Bahri Koto',
    parent_mother: 'Ibu Hj. Elvi Marlina',
    child_order: 'Putri kedua dari',
    parent_info: 'Bpk. H. Syamsul Bahri Koto & Ibu Hj. Elvi Marlina',
    instagram: '@nadialarasati',
  },
  theme_id: 'minang',
  is_bride_first: false,
  cover_image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDgLnqV_U-riKLNLyLBn6NqnwbV933vGSbT-EUd-TBZFqnAU5xn0G99ZpdiU9-SarwFoKF-rUdaFpjhH3LP6818oBvzB3x4mBJ2fsEovR541jqP3cdVPTqZZb-V02Q2stPzv8TDvmPdl3zJcBMxU51mwGe51QEqHGwrvm9JtTMhgqO9eiobF4XJVW0uGJ-q4tatqQ1vPUPna0a3xUYSyPsf96p8XYuTP0cqYJD8vKascFqqLcE6FzBA',
  couple_photo:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDgLnqV_U-riKLNLyLBn6NqnwbV933vGSbT-EUd-TBZFqnAU5xn0G99ZpdiU9-SarwFoKF-rUdaFpjhH3LP6818oBvzB3x4mBJ2fsEovR541jqP3cdVPTqZZb-V02Q2stPzv8TDvmPdl3zJcBMxU51mwGe51QEqHGwrvm9JtTMhgqO9eiobF4XJVW0uGJ-q4tatqQ1vPUPna0a3xUYSyPsf96p8XYuTP0cqYJD8vKascFqqLcE6FzBA',

  wedding_date_iso: '2026-10-24T09:30:00+07:00',
  wedding_date_display: 'Sabtu, 24 Oktober 2026',
  countdown_target: 'resepsi',

  quote:
    'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.',
  quote_source: 'QS. Ar-Rum: 21 • “Saikek Bak Siriah, Sarumpun Bak Sarai”',
  hashtag: '#FarhanNadiaBaralekGadang',

  events: [
    {
      name: 'Malam Bainai & Pasambahan Adat',
      title: 'Malam Bainai & Pasambahan Adat',
      date: 'Sabtu, 24 Oktober 2026',
      time: '08.00 - 09.00 WIB',
      venue_name: 'Rumah Gadang Keluarga Chaniago',
      venue_address:
        'Koto Nan Ampek, Kec. Payakumbuh Barat, Kota Payakumbuh, Sumatera Barat',
      maps_url: 'https://maps.google.com/?q=Payakumbuh+Sumatera+Barat',
      icon: 'auto_stories',
      badge: 'Tradisi Sakral Adat',
    },
    {
      name: 'Akad Nikah',
      title: 'Ijab & Qabul (Akad Nikah)',
      date: 'Sabtu, 24 Oktober 2026',
      time: '09.30 - 11.00 WIB',
      venue_name: 'The Grand Royal Ballroom (Lantai 2)',
      venue_address:
        'Jl. M. Tamrin No. 27, Alang Laweh, Kec. Padang Selatan, Kota Padang, Sumatera Barat 25133',
      maps_url: 'https://maps.google.com/?q=The+Grand+Zuri+Hotel+Padang',
      icon: 'verified',
      badge: 'Upacara Ijab Qabul',
    },
    {
      name: 'Baralek Gadang (Resepsi Akbar)',
      title: 'Resepsi Baralek Gadang & Tari Piring',
      date: 'Sabtu, 24 Oktober 2026',
      time: '11.30 - 17.00 WIB',
      venue_name: 'The Grand Zuri Royal Ballroom & Pelaminan',
      venue_address:
        'Jl. M. Tamrin No. 27, Alang Laweh, Kec. Padang Selatan, Kota Padang, Sumatera Barat 25133',
      maps_url: 'https://maps.google.com/?q=The+Grand+Zuri+Hotel+Padang',
      icon: 'celebration',
      badge: 'Dress Code: Royal Burgundy & Gold Songket',
    },
  ],

  love_story: [
    {
      year: '2021',
      title: 'Kato Mandaki di Ranah Minang',
      description:
        'Awal mula pertemuan takdir di kota Padang, bertegur sapa dengan tata krama adat dan nilai kekeluargaan nan luhur.',
    },
    {
      year: '2024',
      title: 'Marisik & Maanta Tando',
      description:
        'Prosesi pinangan resmi ninik mamak sarato keluarga besar, mengikat janji suci diringi petatah-petitih pusaka luhur.',
    },
    {
      year: '2026',
      title: 'Baralek Gadang',
      description:
        'Alah tibo masonyo mahimpun janji manjalin kasiah nan tulus elok dalam mahligai rumah tangga sakinah mawaddah warahmah.',
    },
  ],

  gallery: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDgLnqV_U-riKLNLyLBn6NqnwbV933vGSbT-EUd-TBZFqnAU5xn0G99ZpdiU9-SarwFoKF-rUdaFpjhH3LP6818oBvzB3x4mBJ2fsEovR541jqP3cdVPTqZZb-V02Q2stPzv8TDvmPdl3zJcBMxU51mwGe51QEqHGwrvm9JtTMhgqO9eiobF4XJVW0uGJ-q4tatqQ1vPUPna0a3xUYSyPsf96p8XYuTP0cqYJD8vKascFqqLcE6FzBA',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAJvKvZ2xgLAnECRSyY58tE27Axd2hSIlTg0aNlPcfBk27c-WI7BI5DGQcQofS0eOnAhKumPQuxc6SEwE2aLYsmbM3lntrCRb_WSjLZcDWuCmOSqhAAlQrmpP5uf55MxIrpYA33C7UMSTIVnyfmUSyErIrFIEeCx2vjWKqWRev0rmZEj8qwIrI3GCng5iapknfYTc2LmihwTI63bEjLW8HaTUPEx_0cLuFk3D8540QBMpUjxm4IRc-t',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCXKmE54OTIFHSVXCm7XRblmdEHEXPmQDEoxbImtKMM5XnTPSWuNQ9rzggqwZf8HQ9jjv8RdSH_taax0q3ATesgmIfMAE7LhDi-IIDhncothrG1fqIwNoPoTdOkzd-Lo7SfpNafq65Sc7LHp9kblje7PNYXVM1SmEg7ZQGrmpnIdIJd_bJVUuXI50us3l67wWTTsGGUUdqUF6RsURGqu8rJP6xL9K0P0M1CnglMHN1iG4wk0HNgX0D9',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCoNqx57G2VSG38jni_dV7SVRfSkcViEjSdb7vyWwlvddY0HcMesn7jPndYvhleASLMsskPuqdXXSZYv8th-6XW4TVeA0U7YZm-gJJigmUOvkV0cEPFlVBgFzMVvOlumnXfi2FxVbH37_1ZcWdI3yt6Vo6oN5hYZSOQhsIT-mJyrLmPJDMZKEPY1B40dqf60VufszwJ4awfRtrfonD33sr1Asxx1bQVErXZvQIKhGde8IXUZxYM0RtM',
  ],

  banks: [
    {
      bank_name: 'Bank Mandiri',
      account_number: '1110 0987 6543 2',
      account_number_raw: '1110098765432',
      account_holder: 'Farhan Al-Ghifari',
    },
    {
      bank_name: 'Bank BCA',
      account_number: '8245 1290 88',
      account_number_raw: '8245129088',
      account_holder: 'Nadia Larasati',
    },
  ],

  bank_accounts: [
    {
      bank_name: 'Bank Mandiri',
      account_number: '1110 0987 6543 2',
      account_number_raw: '1110098765432',
      account_holder: 'Farhan Al-Ghifari',
    },
    {
      bank_name: 'Bank BCA',
      account_number: '8245 1290 88',
      account_number_raw: '8245129088',
      account_holder: 'Nadia Larasati',
    },
  ],

  gift_address:
    'Komp. Jati Griya Asri Blok C No. 12, Sawahan Timur, Kec. Padang Timur, Kota Padang, Sumatera Barat 25121 (Penerima: Nadia / Farhan - 0812-7654-3210)',
  music_url: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
};

export const MOCK_MINANG_THEME: ThemeConfig = {
  primary_color: '#4A121A',
  music_url: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
  active_sections: ['cover', 'couple', 'event', 'gallery', 'rsvp', 'wishes', 'gift'],
  show_gallery: true,
  show_love_story: true,
  show_rsvp: true,
  show_gift: true,
  show_wishes: true,
};

export const MOCK_MINANG_WISHES: WishItem[] = [
  {
    id: 'minang-wish-1',
    guest_name: 'Dt. Maruhun Basa & Istri',
    message:
      'Barakallahu lakuma wa baraka ‘alaikuma wa jama‘a bainakuma fii khair. Selamat Baralek Gadang Uda Farhan & Uni Nadia. Semoga manjadi kaluarga sakinah mawaddah warahmah, rukun damai saikek bak siriah sarumpun bak sarai.',
    attendance: 'attending',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'minang-wish-2',
    guest_name: 'Hj. Syarifah & Keluarga',
    message:
      'Tarimo kasih banyak ateh undangannyo. Masya Allah Anak Daro rancak bana bapakai suntiang ameh, Marapulai gagah jo saluak. Insya Allah kami sakaluarga hadia di Padang!',
    attendance: 'attending',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'minang-wish-3',
    guest_name: 'Rian Pratama, S.T.',
    message:
      'Selamat menempuh babak baru bro Farhan! Turut berbahagia dari rantau Jakarta. Semoga dilancarkan semua prosesi adat dan acaranya hingga selesai. Aamiin ya Rabbal alamin.',
    attendance: 'attending',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
];
