import { useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function NotificationListener({ myUserId, onNotify }) {
  useEffect(() => {
    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          if (payload.new.receiver_id === myUserId) {
            onNotify(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [myUserId, onNotify]);

  return null;
}