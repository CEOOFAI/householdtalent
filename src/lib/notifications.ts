import { createClient } from '@/lib/supabase/server'

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  body?: string,
  actionUrl?: string
) {
  const supabase = await createClient()

  const { error } = await supabase.from('notifications').insert({
    user_id: userId,
    type,
    title,
    body: body || null,
    action_url: actionUrl || null,
  })

  if (error) {
    console.error('Failed to create notification:', error)
  }
}

export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = await createClient()

  const { count } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false)

  return count ?? 0
}

export async function markAsRead(notificationId: string) {
  const supabase = await createClient()

  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
}

export async function markAllAsRead(userId: string) {
  const supabase = await createClient()

  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false)
}
