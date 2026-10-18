import { supabase } from './client';
import type { UserTemplateRecord } from './types';

/**
 * Fetch all saved templates for a given user
 */
export async function fetchUserTemplates(userId: string): Promise<UserTemplateRecord[]> {
  if (!userId) return [];
  try {
    const { data, error } = await supabase
      .from('user_templates')
      .select('*')
      .eq('user_id', userId)
      .neq('slug', 'raditya-jessica')
      .order('updated_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] fetchUserTemplates error:', error.message);
      return [];
    }

    // Filter out raditya-jessica secara permanen agar tidak pernah muncul di UI user manapun
    const cleanList = (data || []).filter((item: any) => {
      if (item.slug === 'raditya-jessica') return false;
      const title = (item.title || '').toLowerCase();
      if (title.includes('raditya') && title.includes('jessica')) return false;
      const gName = (item.content?.groom?.name || '').toLowerCase();
      const bName = (item.content?.bride?.name || '').toLowerCase();
      if (gName.includes('raditya') && bName.includes('jessica')) return false;
      return true;
    });

    return cleanList as UserTemplateRecord[];
  } catch (err) {
    console.error('[Supabase] fetchUserTemplates exception:', err);
    return [];
  }
}

/**
 * Save or update a user template in user_templates table
 */
export async function saveUserTemplate(
  payload: Partial<UserTemplateRecord> & { user_id: string; slug: string }
): Promise<{ success: boolean; data?: UserTemplateRecord; error?: string }> {
  try {
    // Blokir total penyimpanan atau pembaruan untuk raditya-jessica
    const isRadityaJessica =
      payload.slug === 'raditya-jessica' ||
      ((payload.title || '').toLowerCase().includes('raditya') && (payload.title || '').toLowerCase().includes('jessica')) ||
      (((payload.content as any)?.groom?.name || '').toLowerCase().includes('raditya') &&
        ((payload.content as any)?.bride?.name || '').toLowerCase().includes('jessica'));

    if (isRadityaJessica) {
      console.info('[Supabase] Blocked save for deprecated template raditya-jessica.');
      return { success: false, error: 'Template raditya-jessica telah dihapus secara permanen.' };
    }

    const now = new Date().toISOString();
    const record: any = {
      ...payload,
      unlocked_templates: payload.unlocked_templates || (payload.content as any)?.unlocked_templates || [],
      is_paid: payload.is_paid ?? (payload.content as any)?.is_paid ?? false,
      paid_template_id: payload.paid_template_id || (payload.content as any)?.paid_template_id || null,
      updated_at: now,
    };

    let result;
    if (payload.id) {
      // Proteksi permanen: Template yang sudah live 'published' tidak boleh tertimpa menjadi 'draft'
      const { data: curr } = await supabase
        .from('user_templates')
        .select('status, is_paid, paid_template_id, unlocked_templates')
        .eq('id', payload.id)
        .maybeSingle();

      if (curr) {
        if (curr.status === 'published' && payload.status === 'draft') {
          record.status = 'published';
        }
        if (curr.is_paid) {
          record.is_paid = true;
        }
        if (curr.paid_template_id && !record.paid_template_id) {
          record.paid_template_id = curr.paid_template_id;
        }
        if (Array.isArray(curr.unlocked_templates) && curr.unlocked_templates.length > 0) {
          record.unlocked_templates = Array.from(new Set([...curr.unlocked_templates, ...(record.unlocked_templates || [])]));
        }
      }

      result = await supabase
        .from('user_templates')
        .update(record)
        .eq('id', payload.id)
        .select()
        .single();
    } else {
      // Periksa apakah sudah ada template dengan slug & user_id yang sama sebelum insert baru
      const { data: existingRows } = await supabase
        .from('user_templates')
        .select('id, status, is_paid, paid_template_id, unlocked_templates')
        .eq('user_id', payload.user_id)
        .eq('slug', payload.slug)
        .limit(1);

      if (existingRows && existingRows.length > 0) {
        const curr = existingRows[0];
        if (curr.status === 'published' && payload.status === 'draft') {
          record.status = 'published';
        }
        if (curr.is_paid) {
          record.is_paid = true;
        }
        if (curr.paid_template_id && !record.paid_template_id) {
          record.paid_template_id = curr.paid_template_id;
        }
        if (Array.isArray(curr.unlocked_templates) && curr.unlocked_templates.length > 0) {
          record.unlocked_templates = Array.from(new Set([...curr.unlocked_templates, ...(record.unlocked_templates || [])]));
        }

        result = await supabase
          .from('user_templates')
          .update(record)
          .eq('id', existingRows[0].id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('user_templates')
          .insert({
            ...record,
            created_at: now,
          })
          .select()
          .single();
      }
    }

    if (result.error) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.data as UserTemplateRecord };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Delete a user template by id and optionally slug, also cleaning related tables
 */
export async function deleteUserTemplate(
  id: string,
  slug?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Hapus dari user_templates berdasarkan id
    await supabase.from('user_templates').delete().eq('id', id);

    // 2. Hapus juga dari invitations berdasarkan id
    await supabase.from('invitations').delete().eq('id', id);

    // 3. Jika slug ada, hapus juga berdasarkan slug dari kedua tabel
    if (slug) {
      await supabase.from('user_templates').delete().eq('slug', slug);
      await supabase.from('invitations').delete().eq('slug', slug);
      // Bersihkan buku tamu dan ucapan terkait invitation tersebut
      await supabase.from('wishes').delete().eq('invitation_id', id);
      await supabase.from('guests').delete().eq('invitation_id', id);
    }

    // 4. Jika id atau slug terkait raditya-jessica, bersihkan seluruh tabel
    if (id === 'raditya-jessica' || slug === 'raditya-jessica') {
      await purgeRadityaJessica();
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Purge raditya-jessica permanently from both user_templates and invitations
 */
export async function purgeRadityaJessica(): Promise<void> {
  try {
    await supabase.from('user_templates').delete().eq('slug', 'raditya-jessica');
    await supabase.from('invitations').delete().eq('slug', 'raditya-jessica');
  } catch (e) {
    console.warn('[Supabase] purgeRadityaJessica notice:', e);
  }
}
