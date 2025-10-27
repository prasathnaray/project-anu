// frontend/src/hooks/useNotifications.js
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let myUserId;

    const init = async () => {
      // Get logged-in user
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.error('User not logged in', error);
        setLoading(false);
        return;
      }
      myUserId = user.id;
      const { data: pastData, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('receiver_id', myUserId)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error(fetchError);
      } else {
        setNotifications(pastData);
      }
      const channel = supabase
        .channel('public:notifications')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications' },
          (payload) => {
            if (payload.new.receiver_id === myUserId) {
              setNotifications((prev) => [payload.new, ...prev]);
            }
          }
        )
        .subscribe();

      setLoading(false);

      return () => {
        supabase.removeChannel(channel);
      };
    };

    init();
  }, []);

  return { notifications, loading };
};