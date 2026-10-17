import type { InvitationData, ThemeConfig, WishItem } from '../../types/invitation';

export const MOCK_SUNDA_DATA: InvitationData = {
  groom: {
    name: 'Raditya',
    full_name: 'Raditya Pratama, S.T., M.Sc.',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuASfCWw3-Nu-1IV5MGz5OqnmkZSTr7w9crraUApBuKXhWwhICHOrcfuwDGwT9mfktqCY--Lofo5hwGGkoMaAa58ALJ5EXgQb1_QFKgXg5HZpj4TlePv6eFLp1mewFt8BH8K5QEKY4Id3KXDxWU5Vua3PVCJdab8s6GtTuITN6Fnv80PFE4hxYPyRGLYl6ZrXF3_VEgaE7dHLDHkAHSLJp6MeJ4VT8HtciHBstGhMRmSk2kUlzOapEE8qA',
    parent_father: 'Bpk. Ir. H. Bambang Soedrajat',
    parent_mother: 'Ibu Hj. Siti Nurhasanah',
    child_order: 'Putra sulung dari pasangan',
    instagram: '@radityaprtm',
  },
  bride: {
    name: 'Jessica',
    full_name: 'Jessica Laksmi Sundari, S.Farm., Apt.',
    photo_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAgbBBsIYaF1FNBrw1P-ZTspaPzkE9nUJNSC3SCK3zR26aHA2aeqhD2Lnm0TveGZdkM74-ZTOLoUeh5btY_dpSFMb2tiCF0S_wCrNFcRYhqMlH9VflVykdRP1sO5RAiyw21K4FNN24mA1e6hmnvjFKWouiT1bfS619zs-_2hiGGY7HzW4V8vwel3yWKVbIJQgWJ1CKY87Lh07Tr-dCjFAFhGZwrwP2RoarAmduUVvXKtvU-O8qDHdB8rA',
    parent_father: 'Bpk. Drs. H. Asep Sunandar',
    parent_mother: 'Ibu Hj. Ratna Komala Dewi',
    child_order: 'Putri kedua dari pasangan',
    instagram: '@jessicalaksmi',
  },
  theme_id: 'sunda',
  is_bride_first: false,
  cover_image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDSMQzGjURPVSsGCRPPE-zHZ7bgKvtteTLFR6OM9LyCulQKLncbS8LirSkj3E_Ec1t0kJzOapSpd3NsulL3IStOlVI1tPnPGmcvYQoygMvF5gCkYEGhruz0lao1Cvo72k1VcpUgtv_jCWbRtWdBfhARMKHCGycQV3bau425N0jO8a6JVq5ufjrf_Pobe0giwVbiqnYhx5nY-LXDs9HaYTaUkUyKwqa5yxlJAfvBxubqUxz0wQHVGIl6mQ',
  couple_photo:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDSMQzGjURPVSsGCRPPE-zHZ7bgKvtteTLFR6OM9LyCulQKLncbS8LirSkj3E_Ec1t0kJzOapSpd3NsulL3IStOlVI1tPnPGmcvYQoygMvF5gCkYEGhruz0lao1Cvo72k1VcpUgtv_jCWbRtWdBfhARMKHCGycQV3bau425N0jO8a6JVq5ufjrf_Pobe0giwVbiqnYhx5nY-LXDs9HaYTaUkUyKwqa5yxlJAfvBxubqUxz0wQHVGIl6mQ',

  wedding_date_iso: '2026-10-24T08:00:00+07:00',
  wedding_date_display: 'Sabtu, 24 Oktober 2026',

  quote:
    'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
  quote_source: 'QS. Ar-Rum: 21 • “Runtut Raut Sauyunan”',
  hashtag: '#RadityaJessicaSundaSiger',

  events: [
    {
      name: 'Akad Nikah',
      title: 'Akad Nikah & Ijab Qobul',
      date: 'Sabtu, 24 Oktober 2026',
      time: '08.00 - 10.00 WIB',
      venue_name: 'Masjid Agung Trans Studio',
      venue_address:
        'Jl. Gatot Subroto No. 289, Cibangkong, Batununggal, Kota Bandung, Jawa Barat',
      maps_url: 'https://maps.google.com',
      icon: 'auto_stories',
      badge: 'Upacara Sakral',
    },
    {
      name: 'Resepsi Pernikahan',
      title: 'Resepsi & Gending Parahyangan',
      date: 'Sabtu, 24 Oktober 2026',
      time: '11.00 - 14.00 WIB',
      venue_name: 'Grand Ballroom InterContinental Bandung Dago Pakar',
      venue_address:
        'Jl. Resor Dago Pakar Raya 2B Resor Dago Pakar, Mekarsaluyu, Cimenyan, Bandung',
      maps_url: 'https://maps.google.com',
      icon: 'celebration',
      badge: 'Dresscode: Pastel Champagne & Earth Tone',
    },
  ],

  love_story: [
    {
      year: '2020',
      title: 'Patepung di Bumi Parahyangan',
      description:
        'Awal mula pertemuan manis di Kota Kembang Bandung, merajut cerita penuh canda dan kebersamaan.',
    },
    {
      year: '2023',
      title: 'Nyeureuhan & Mengikat Janji',
      description:
        'Keluarga besar bersilaturahmi melangsungkan prosesi lamaran adat Sunda penuh khidmat dan kehangatan.',
    },
    {
      year: '2026',
      title: 'Runtuy Raut Sauyunan',
      description:
        'Mengucap ijab kabul suci menuju gerbang mahligai rumah tangga yang sakinah mawaddah warahmah.',
    },
  ],

  gallery: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuASfCWw3-Nu-1IV5MGz5OqnmkZSTr7w9crraUApBuKXhWwhICHOrcfuwDGwT9mfktqCY--Lofo5hwGGkoMaAa58ALJ5EXgQb1_QFKgXg5HZpj4TlePv6eFLp1mewFt8BH8K5QEKY4Id3KXDxWU5Vua3PVCJdab8s6GtTuITN6Fnv80PFE4hxYPyRGLYl6ZrXF3_VEgaE7dHLDHkAHSLJp6MeJ4VT8HtciHBstGhMRmSk2kUlzOapEE8qA',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDWmQiWtFYMkMbRtAcS2Jrz28_xYMxrH3zxKcprJfflNyiRLumg-i0n_edFR6Vj7t9m--RpAklpTbUgClOogr4pHaDzw1c4RSXP-NNq6cqOdgLJkuKj76lyAuKoGDfhjJLK7km9IN5ET3Zu6ruPa0vU3ygDjB5XOiX8x2gkbDRCo7LPJbPDAC_sZJuNvWn44Oa77JlFcbLQVuyLtHripHo7Ra3i8eMV6r6yhEFGDW79dqr53YYWLEMd9g',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDArua4lohmx7ckSreazM_Guc2ca0eFQIPECKV2Mmt6rdOgUm4GJdu49GYNqvzggMZ1mC3sW4nZcKO8uHi_ueihbV7sB5LFTrZF8udqSJGXOat8SntKf0470hU2htYlje7bVp3uJvccqjMXe34IlDs2UesyVrFP18ecWI2XvItToaXBHUFDI2jL_u9lWiZFw7erFHTgVb9Ic6vjYU-tTwgIitOY0deMdBzMsW3SxrU4T9tqCpyvZFuLVQ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAgbBBsIYaF1FNBrw1P-ZTspaPzkE9nUJNSC3SCK3zR26aHA2aeqhD2Lnm0TveGZdkM74-ZTOLoUeh5btY_dpSFMb2tiCF0S_wCrNFcRYhqMlH9VflVykdRP1sO5RAiyw21K4FNN24mA1e6hmnvjFKWouiT1bfS619zs-_2hiGGY7HzW4V8vwel3yWKVbIJQgWJ1CKY87Lh07Tr-dCjFAFhGZwrwP2RoarAmduUVvXKtvU-O8qDHdB8rA',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDewZjvtWPQY_9HSLZUci4wOr0jnRGUqgcc74xP-ZvJS1S_SoaNxnvuIzXJGQWXSkS4kxdDkS5xXcqvYqkDGPIJiWVNe_uR_RrPXdHpIYZB2E5MKeyyGPD1PoYJBaDbkX6abG5dx1ad21Q6lsOIvaxfViBTaZlQNNjWaF5UV5NZyso85bFs__zjH1UdgrAQBH5ptivV3DTzFIBZHDa7YkZGyIoCfjd9MjRIwnrIqqMzZtNiyGEmasNXew',
  ],

  banks: [
    {
      bank_name: 'BCA',
      account_number: '8290 1928 31',
      account_number_raw: '8290192831',
      account_holder: 'Raditya Pratama',
    },
    {
      bank_name: 'Bank Mandiri',
      account_number: '132 0098 7654 32',
      account_number_raw: '1320098765432',
      account_holder: 'Jessica Laksmi Sundari',
    },
  ],

  bank_accounts: [
    {
      bank_name: 'BCA',
      account_number: '8290 1928 31',
      account_number_raw: '8290192831',
      account_holder: 'Raditya Pratama',
    },
    {
      bank_name: 'Bank Mandiri',
      account_number: '132 0098 7654 32',
      account_number_raw: '1320098765432',
      account_holder: 'Jessica Laksmi Sundari',
    },
  ],

  gift_address:
    'Jl. Kanayakan D-12, Dago, Coblong, Kota Bandung, Jawa Barat 40135 (Penerima: Jessica / Radit - 08123456789)',
  music_url: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
};

export const MOCK_SUNDA_THEME: ThemeConfig = {
  primary_color: '#775A19',
  music_url: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
  active_sections: ['cover', 'couple', 'event', 'gallery', 'rsvp', 'wishes', 'gift'],
  show_gallery: true,
  show_love_story: true,
  show_rsvp: true,
  show_gift: true,
  show_wishes: true,
};

export const MOCK_SUNDA_WISHES: WishItem[] = [
  {
    id: 'sunda-wish-1',
    guest_name: 'Dian & Keluarga',
    message:
      'Barakallahu lakuma wa baraka ‘alaikuma wa jama‘a bainakuma fii khoir. Selamat menempuh hidup baru Kang Radit & Teh Jessica, semoga sakinah mawaddah warahmah!',
    attendance: 'attending',
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: 'sunda-wish-2',
    guest_name: 'Almira Kusuma',
    message:
      'Wilujeng ngambah sagara rumah tangga Jessica sayang. MasyaAllah geulis pisan katingalina. Mugia janten kulawarga anu runtut raut sauyunan salamina. Aamiin!',
    attendance: 'attending',
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: 'sunda-wish-3',
    guest_name: 'Faisal & Maya',
    message:
      'Selamat bro Raditya! Mohon maaf belum bisa hadir langsung karena dinas di luar kota. Doa terbaik untuk kalian berdua dari kami di Bandung!',
    attendance: 'declined',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
];
