'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import type { Event, Category } from '@/types/database';

interface TrendingEvent extends Event {
  category: Category;
}

interface TrendingMarqueeProps {
  initialEvents?: TrendingEvent[];
}

export function TrendingMarquee({ initialEvents = [] }: TrendingMarqueeProps) {
  const [events, setEvents] = useState<TrendingEvent[]>(initialEvents);
  const [isPaused, setIsPaused] = useState(false);
  const [votingEvent, setVotingEvent] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchEvents() {
      const { data } = await supabase
        .from('events')
        .select('*, category:categories(*)')
        .eq('status', 'active')
        .gt('deadline', new Date().toISOString())
        .order('yes_count', { ascending: false })
        .limit(10);

      if (data) {
        setEvents(data as TrendingEvent[]);
      }
    }

    if (initialEvents.length === 0) {
      fetchEvents();
    }

    const channel = supabase
      .channel('trending-events')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'events' },
        async (payload) => {
          const { data: newEvent } = await supabase
            .from('events')
            .select('*, category:categories(*)')
            .eq('id', payload.new.id)
            .single();

          const typedEvent = newEvent as TrendingEvent | null;
          if (typedEvent && typedEvent.status === 'active') {
            setEvents((prev) => {
              const updated = [typedEvent, ...prev];
              return updated.slice(0, 10);
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, initialEvents.length]);

  const handleVote = useCallback(async (eventId: string, prediction: boolean, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setVotingEvent(eventId);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = `/login?redirect=/events/${eventId}`;
        return;
      }

      const { error } = await (supabase
        .from('votes') as any)
        .insert({
          user_id: user.id,
          event_id: eventId,
          prediction,
          trust_score_at_vote: 50,
          confidence_level: 'medium',
        });

      if (error) {
        if (error.code === '23505') {
          console.log('Already voted');
        } else {
          console.error('Vote error:', error);
        }
      }
    } catch (err) {
      console.error('Vote failed:', err);
    } finally {
      setVotingEvent(null);
    }
  }, [supabase]);

  if (events.length === 0) {
    return null;
  }

  const duplicatedEvents = [...events, ...events];

  return (
    <div className="ticker-wrap relative overflow-hidden">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none ticker-fade-left" />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none ticker-fade-right" />

      <div className="flex items-center h-10">
        {/* Label */}
        <div className="shrink-0 px-4 h-full flex items-center gap-2 border-r border-ink-200 bg-white/60">
          <span className="w-1.5 h-1.5 bg-signal rounded-full pulse-dot" />
          <span className="data-label text-ink-600">Canlı</span>
        </div>

        {/* Scrolling content */}
        <div
          ref={containerRef}
          className={cn(
            "flex items-center gap-0 ticker-scroll",
            isPaused && "ticker-paused"
          )}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {duplicatedEvents.map((event, index) => {
            const totalWeight = event.weighted_yes + event.weighted_no;
            const yesPct = totalWeight > 0 ? Math.round((event.weighted_yes / totalWeight) * 100) : 50;

            return (
              <div
                key={`${event.id}-${index}`}
                className="flex items-center shrink-0 px-4 h-10 border-r border-ink-200 hover:bg-white/80 transition-colors"
              >
                <span className="text-sm text-ink-700 mr-3 max-w-[240px] truncate">
                  {event.title}
                </span>
                <span className={cn(
                  "data-value text-sm mr-3",
                  yesPct >= 50 ? "text-yes" : "text-no"
                )}>
                  {yesPct}%
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => handleVote(event.id, true, e)}
                    disabled={votingEvent === event.id}
                    className={cn(
                      "vote-yes",
                      votingEvent === event.id && "opacity-50 cursor-wait"
                    )}
                  >
                    EVET
                  </button>
                  <button
                    onClick={(e) => handleVote(event.id, false, e)}
                    disabled={votingEvent === event.id}
                    className={cn(
                      "vote-no",
                      votingEvent === event.id && "opacity-50 cursor-wait"
                    )}
                  >
                    HAYIR
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

