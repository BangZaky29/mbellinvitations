import type { InvitationData, ThemeConfig, AnimationConfig, CoupleInfo } from '../types/invitation';
import { DEFAULT_ANIMATION_CONFIG } from '../types/invitation';

export interface FieldChangeDetail {
  fieldKey: string;
  fieldLabel: string;
  category: 'tema' | 'mempelai' | 'acara' | 'media' | 'cerita' | 'bank' | 'animasi' | 'pengaturan';
  oldValue: any;
  newValue: any;
}

export interface AuditTrailState {
  count: number;
  changes: FieldChangeDetail[];
  hasChanges: boolean;
}

/**
 * Membandingkan string dengan normalisasi trim dan fallback ke empty string
 */
function isStringDifferent(a: any, b: any): boolean {
  const strA = (a === undefined || a === null ? '' : String(a)).trim();
  const strB = (b === undefined || b === null ? '' : String(b)).trim();
  return strA !== strB;
}

/**
 * Membandingkan objek atau array secara mendalam via JSON string
 */
function isDeepDifferent(a: any, b: any): boolean {
  return JSON.stringify(a ?? null) !== JSON.stringify(b ?? null);
}

/**
 * Engine audit pembanding perubahan deterministik untuk seluruh form & settings mbell.
 * Menghitung secara eksak himpunan field yang berbeda dari baseline.
 */
export function computeAuditTrail(
  baseline: { formData: InvitationData; themeConfig: ThemeConfig } | null,
  current: { formData: InvitationData; themeConfig: ThemeConfig }
): AuditTrailState {
  if (!baseline) {
    return {
      count: 0,
      changes: [],
      hasChanges: false,
    };
  }

  const changes: FieldChangeDetail[] = [];
  const bForm = baseline.formData || ({} as InvitationData);
  const cForm = current.formData || ({} as InvitationData);
  const bTheme = baseline.themeConfig || ({} as ThemeConfig);
  const cTheme = current.themeConfig || ({} as ThemeConfig);

  const bAnim: AnimationConfig = {
    ...DEFAULT_ANIMATION_CONFIG,
    ...(bTheme.animation_config || {}),
  };
  const cAnim: AnimationConfig = {
    ...DEFAULT_ANIMATION_CONFIG,
    ...(cTheme.animation_config || {}),
  };

  // Helper untuk mendaftarkan perubahan
  const registerChange = (
    key: string,
    label: string,
    category: FieldChangeDetail['category'],
    oldVal: any,
    newVal: any
  ) => {
    changes.push({
      fieldKey: key,
      fieldLabel: label,
      category,
      oldValue: oldVal,
      newValue: newVal,
    });
  };

  // 1. TEMA UTAMA
  const bThemeId = bForm.theme_id || 'modern';
  const cThemeId = cForm.theme_id || 'modern';
  if (bThemeId !== cThemeId) {
    registerChange('theme_id', 'Tema & Gaya Desain', 'tema', bThemeId, cThemeId);
  }

  // 2. DATA PENGANTIN PRIA
  const bGroom: Partial<CoupleInfo> = bForm.groom || {};
  const cGroom: Partial<CoupleInfo> = cForm.groom || {};
  if (isStringDifferent(bGroom.name, cGroom.name)) {
    registerChange('groom.name', 'Nama Panggilan Mempelai Pria', 'mempelai', bGroom.name, cGroom.name);
  }
  if (isStringDifferent(bGroom.full_name, cGroom.full_name)) {
    registerChange('groom.full_name', 'Nama Lengkap Mempelai Pria', 'mempelai', bGroom.full_name, cGroom.full_name);
  }
  if (isStringDifferent(bGroom.instagram, cGroom.instagram)) {
    registerChange('groom.instagram', 'Instagram Mempelai Pria', 'mempelai', bGroom.instagram, cGroom.instagram);
  }
  if (isStringDifferent(bGroom.child_order, cGroom.child_order)) {
    registerChange('groom.child_order', 'Urutan Anak Mempelai Pria', 'mempelai', bGroom.child_order, cGroom.child_order);
  }
  if (isStringDifferent(bGroom.parent_father, cGroom.parent_father)) {
    registerChange('groom.parent_father', 'Nama Ayah Mempelai Pria', 'mempelai', bGroom.parent_father, cGroom.parent_father);
  }
  if (isStringDifferent(bGroom.parent_mother, cGroom.parent_mother)) {
    registerChange('groom.parent_mother', 'Nama Ibu Mempelai Pria', 'mempelai', bGroom.parent_mother, cGroom.parent_mother);
  }

  // 3. DATA PENGANTIN WANITA
  const bBride: Partial<CoupleInfo> = bForm.bride || {};
  const cBride: Partial<CoupleInfo> = cForm.bride || {};
  if (isStringDifferent(bBride.name, cBride.name)) {
    registerChange('bride.name', 'Nama Panggilan Mempelai Wanita', 'mempelai', bBride.name, cBride.name);
  }
  if (isStringDifferent(bBride.full_name, cBride.full_name)) {
    registerChange('bride.full_name', 'Nama Lengkap Mempelai Wanita', 'mempelai', bBride.full_name, cBride.full_name);
  }
  if (isStringDifferent(bBride.instagram, cBride.instagram)) {
    registerChange('bride.instagram', 'Instagram Mempelai Wanita', 'mempelai', bBride.instagram, cBride.instagram);
  }
  if (isStringDifferent(bBride.child_order, cBride.child_order)) {
    registerChange('bride.child_order', 'Urutan Anak Mempelai Wanita', 'mempelai', bBride.child_order, cBride.child_order);
  }
  if (isStringDifferent(bBride.parent_father, cBride.parent_father)) {
    registerChange('bride.parent_father', 'Nama Ayah Mempelai Wanita', 'mempelai', bBride.parent_father, cBride.parent_father);
  }
  if (isStringDifferent(bBride.parent_mother, cBride.parent_mother)) {
    registerChange('bride.parent_mother', 'Nama Ibu Mempelai Wanita', 'mempelai', bBride.parent_mother, cBride.parent_mother);
  }

  // 4. URUTAN TAMPIL MEMPELAI WANITA
  if (Boolean(bForm.is_bride_first) !== Boolean(cForm.is_bride_first)) {
    registerChange('is_bride_first', 'Tampilkan Mempelai Wanita Pertama', 'mempelai', bForm.is_bride_first, cForm.is_bride_first);
  }

  // 5. TANGGAL UTAMA & COUNTDOWN TARGET
  if (isStringDifferent(bForm.wedding_date_iso, cForm.wedding_date_iso)) {
    registerChange('wedding_date_iso', 'Tanggal Utama Acara', 'acara', bForm.wedding_date_iso, cForm.wedding_date_iso);
  }
  if (isStringDifferent(bForm.wedding_date_display, cForm.wedding_date_display)) {
    registerChange('wedding_date_display', 'Teks Tanggal Acara', 'acara', bForm.wedding_date_display, cForm.wedding_date_display);
  }
  if (isStringDifferent(bForm.countdown_target, cForm.countdown_target)) {
    registerChange('countdown_target', 'Patokan Acara Hitung Mundur', 'acara', bForm.countdown_target, cForm.countdown_target);
  }

  // 6. SUSUNAN ACARA (EVENTS)
  const bEvents = Array.isArray(bForm.events) ? bForm.events : [];
  const cEvents = Array.isArray(cForm.events) ? cForm.events : [];
  if (bEvents.length !== cEvents.length) {
    registerChange('events.length', 'Jumlah Susunan Acara', 'acara', bEvents.length, cEvents.length);
  } else {
    // Cek perbedaan isi item acara
    let eventsModified = false;
    for (let i = 0; i < cEvents.length; i++) {
      if (isDeepDifferent(bEvents[i], cEvents[i])) {
        eventsModified = true;
        break;
      }
    }
    if (eventsModified) {
      registerChange('events', 'Detail Informasi Susunan Acara', 'acara', bEvents, cEvents);
    }
  }

  // 7. FOTO COVER & PASANGAN
  const bCover = bForm.cover_image || bForm.couple_photo || '';
  const cCover = cForm.cover_image || cForm.couple_photo || '';
  if (isStringDifferent(bCover, cCover)) {
    registerChange('cover_image', 'Foto Sampul & Pasangan (Cover Hero)', 'media', bCover, cCover);
  }

  // 8. GALERI FOTO & GAYA TAMPILAN
  const bGallery = Array.isArray(bForm.gallery) ? bForm.gallery : [];
  const cGallery = Array.isArray(cForm.gallery) ? cForm.gallery : [];
  if (isDeepDifferent(bGallery, cGallery)) {
    registerChange('gallery', 'Koleksi Galeri Foto', 'media', `${bGallery.length} Foto`, `${cGallery.length} Foto`);
  }
  const bGalleryStyle = bForm.gallery_style || bTheme.gallery_style || 'bento-grid';
  const cGalleryStyle = cForm.gallery_style || cTheme.gallery_style || 'bento-grid';
  if (bGalleryStyle !== cGalleryStyle) {
    registerChange('gallery_style', 'Gaya Tampilan Galeri Foto', 'media', bGalleryStyle, cGalleryStyle);
  }

  // 9. KUTIPAN / AYAT SUCI & DOA
  if (isStringDifferent(bForm.quote_title, cForm.quote_title)) {
    registerChange('quote_title', 'Judul Bagian Doa', 'cerita', bForm.quote_title, cForm.quote_title);
  }
  if (isStringDifferent(bForm.quote_religion, cForm.quote_religion)) {
    registerChange('quote_religion', 'Kategori / Preset Doa', 'cerita', bForm.quote_religion, cForm.quote_religion);
  }
  if (isStringDifferent(bForm.quote_arabic, cForm.quote_arabic)) {
    registerChange('quote_arabic', 'Teks Doa / Naskah Asli (Arab)', 'cerita', bForm.quote_arabic, cForm.quote_arabic);
  }
  if (isStringDifferent(bForm.quote, cForm.quote)) {
    registerChange('quote', 'Teks Terjemahan / Kutipan Doa', 'cerita', bForm.quote, cForm.quote);
  }
  if (isStringDifferent(bForm.quote_source, cForm.quote_source)) {
    registerChange('quote_source', 'Sumber Kutipan / Referensi Ayat', 'cerita', bForm.quote_source, cForm.quote_source);
  }

  // 10. PANDUAN BUSANA / DRESSCODE
  const bDresscode = bForm.dresscode;
  const cDresscode = cForm.dresscode;
  if (Boolean(bDresscode?.enabled) !== Boolean(cDresscode?.enabled)) {
    registerChange('dresscode.enabled', 'Status Tampilan Dresscode', 'pengaturan', bDresscode?.enabled, cDresscode?.enabled);
  }
  if (isStringDifferent(bDresscode?.title, cDresscode?.title)) {
    registerChange('dresscode.title', 'Judul Panduan Busana', 'pengaturan', bDresscode?.title, cDresscode?.title);
  }
  if (isStringDifferent(bDresscode?.subtitle, cDresscode?.subtitle)) {
    registerChange('dresscode.subtitle', 'Catatan Panduan Busana', 'pengaturan', bDresscode?.subtitle, cDresscode?.subtitle);
  }
  const bDressColors = Array.isArray(bDresscode?.colors) ? bDresscode.colors : [];
  const cDressColors = Array.isArray(cDresscode?.colors) ? cDresscode.colors : [];
  if (isDeepDifferent(bDressColors, cDressColors)) {
    registerChange('dresscode.colors', 'Palet Warna Dresscode', 'pengaturan', `${bDressColors.length} Warna`, `${cDressColors.length} Warna`);
  }

  // 10. KISAH CINTA (LOVE STORY)
  const bStory = Array.isArray(bForm.love_story) ? bForm.love_story : [];
  const cStory = Array.isArray(cForm.love_story) ? cForm.love_story : [];
  if (isDeepDifferent(bStory, cStory)) {
    registerChange('love_story', 'Perjalanan Kisah Cinta', 'cerita', `${bStory.length} Cerita`, `${cStory.length} Cerita`);
  }

  // 11. AMPLOP DIGITAL & REKENING BANK
  const bBanks = (bForm.banks && Array.isArray(bForm.banks))
    ? bForm.banks
    : (bForm.bank_accounts && Array.isArray(bForm.bank_accounts))
    ? bForm.bank_accounts
    : [];
  const cBanks = (cForm.banks && Array.isArray(cForm.banks))
    ? cForm.banks
    : (cForm.bank_accounts && Array.isArray(cForm.bank_accounts))
    ? cForm.bank_accounts
    : [];
  if (isDeepDifferent(bBanks, cBanks)) {
    registerChange('banks', 'Daftar Rekening Bank & E-Wallet', 'bank', `${bBanks.length} Rekening`, `${cBanks.length} Rekening`);
  }
  if (isStringDifferent(bForm.qris_url, cForm.qris_url)) {
    registerChange('qris_url', 'Foto QRIS Amplop Digital', 'bank', bForm.qris_url, cForm.qris_url);
  }
  if (isStringDifferent(bForm.gift_address, cForm.gift_address)) {
    registerChange('gift_address', 'Alamat Pengiriman Kado Fisik', 'bank', bForm.gift_address, cForm.gift_address);
  }

  // 12. PENGATURAN TAUTAN SLUG & HASHTAG & STREAMING
  if (isStringDifferent(bForm.slug, cForm.slug)) {
    registerChange('slug', 'Tautan Alamat Undangan (Slug)', 'pengaturan', bForm.slug, cForm.slug);
  }
  if (isStringDifferent(bForm.hashtag, cForm.hashtag)) {
    registerChange('hashtag', 'Tagar Pernikahan (Hashtag)', 'pengaturan', bForm.hashtag, cForm.hashtag);
  }
  if (isStringDifferent(bForm.streaming_url || bForm.livestream_url, cForm.streaming_url || cForm.livestream_url)) {
    registerChange('streaming_url', 'Tautan Live Streaming', 'pengaturan', bForm.streaming_url, cForm.streaming_url);
  }

  // 13. MUSIK LATAR BELAKANG
  const bMusic = bForm.music_url || bTheme.music_url || '';
  const cMusic = cForm.music_url || cTheme.music_url || '';
  if (isStringDifferent(bMusic, cMusic)) {
    registerChange('music_url', 'Musik Latar Belakang', 'pengaturan', bMusic, cMusic);
  }

  // 14. PENGATURAN EFEK ANIMASI
  if (bAnim.preset !== cAnim.preset) {
    registerChange('anim.preset', 'Preset Gaya Animasi', 'animasi', bAnim.preset, cAnim.preset);
  }
  if (Number(bAnim.smoothness) !== Number(cAnim.smoothness)) {
    registerChange('anim.smoothness', 'Tingkat Kehalusan Animasi', 'animasi', `${bAnim.smoothness}%`, `${cAnim.smoothness}%`);
  }
  if (bAnim.stagger_speed !== cAnim.stagger_speed) {
    registerChange('anim.stagger_speed', 'Kecepatan Gerak Stagger', 'animasi', bAnim.stagger_speed, cAnim.stagger_speed);
  }
  if (Boolean(bAnim.floating_petals) !== Boolean(cAnim.floating_petals)) {
    registerChange('anim.floating_petals', 'Efek Taburan Bunga Melayang', 'animasi', bAnim.floating_petals, cAnim.floating_petals);
  }
  if (Boolean(bAnim.lens_focus_blur) !== Boolean(cAnim.lens_focus_blur)) {
    registerChange('anim.lens_focus_blur', 'Efek Blur Fokus Lensa', 'animasi', bAnim.lens_focus_blur, cAnim.lens_focus_blur);
  }
  if (Boolean(bAnim.reduced_motion) !== Boolean(cAnim.reduced_motion)) {
    registerChange('anim.reduced_motion', 'Mode Pengurangan Gerakan', 'animasi', bAnim.reduced_motion, cAnim.reduced_motion);
  }

  // 15. WARNA UTAMA TEMA (JIKA DIKONFIGURASI KHUSUS)
  if (isStringDifferent(bTheme.primary_color, cTheme.primary_color)) {
    registerChange('theme.primary_color', 'Warna Aksen Desain', 'tema', bTheme.primary_color, cTheme.primary_color);
  }

  // 16. PENGATURAN VISIBILITAS BAGIAN (SECTION VISIBILITY)
  const bSections = Array.isArray(bTheme.active_sections) ? bTheme.active_sections : [];
  const cSections = Array.isArray(cTheme.active_sections) ? cTheme.active_sections : [];
  if (isDeepDifferent(bSections, cSections)) {
    registerChange('theme.active_sections', 'Visibilitas Bagian Template', 'pengaturan', `${bSections.length} Bagian`, `${cSections.length} Bagian`);
  }
  if (Boolean(bTheme.show_quote) !== Boolean(cTheme.show_quote)) {
    registerChange('theme.show_quote', 'Tampilkan Doa & Kutipan', 'pengaturan', bTheme.show_quote, cTheme.show_quote);
  }
  if (Boolean(bTheme.show_dresscode) !== Boolean(cTheme.show_dresscode)) {
    registerChange('theme.show_dresscode', 'Tampilkan Panduan Busana', 'pengaturan', bTheme.show_dresscode, cTheme.show_dresscode);
  }
  if (Boolean(bTheme.show_gallery) !== Boolean(cTheme.show_gallery)) {
    registerChange('theme.show_gallery', 'Tampilkan Galeri Foto', 'pengaturan', bTheme.show_gallery, cTheme.show_gallery);
  }
  if (Boolean(bTheme.show_love_story) !== Boolean(cTheme.show_love_story)) {
    registerChange('theme.show_love_story', 'Tampilkan Cerita Cinta', 'pengaturan', bTheme.show_love_story, cTheme.show_love_story);
  }
  if (Boolean(bTheme.show_rsvp) !== Boolean(cTheme.show_rsvp)) {
    registerChange('theme.show_rsvp', 'Tampilkan Konfirmasi RSVP', 'pengaturan', bTheme.show_rsvp, cTheme.show_rsvp);
  }
  if (Boolean(bTheme.show_gift) !== Boolean(cTheme.show_gift)) {
    registerChange('theme.show_gift', 'Tampilkan Amplop & Hadiah', 'pengaturan', bTheme.show_gift, cTheme.show_gift);
  }
  if (Boolean(bTheme.show_wishes) !== Boolean(cTheme.show_wishes)) {
    registerChange('theme.show_wishes', 'Tampilkan Ucapan & Doa Tamu', 'pengaturan', bTheme.show_wishes, cTheme.show_wishes);
  }

  return {
    count: changes.length,
    changes,
    hasChanges: changes.length > 0,
  };
}
