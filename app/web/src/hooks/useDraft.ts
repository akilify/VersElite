import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { supabase } from '@/lib/supabase';
import useSound from 'use-sound';

interface UseDraftOptions {
  session: any;
  isOnline: boolean;
  playSave: () => void;
}

export function useDraft({ session, isOnline, playSave }: UseDraftOptions) {
  const [draftId, setDraftId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'written' | 'spoken_audio' | 'spoken_video'>('written');
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  const contentRef = useRef(content);
  const titleRef = useRef(title);
  const [debouncedContent] = useDebounce(content, 3000);
  const [debouncedTitle] = useDebounce(title, 3000);

  const LOCAL_DRAFT_KEY = `verselite_draft_${session?.user?.id}`;

  const saveLocalDraft = useCallback(() => {
    const draft = { title, content, type, mediaUrl, updatedAt: new Date().toISOString() };
    localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(draft));
  }, [title, content, type, mediaUrl]);

  const loadLocalDraft = useCallback(() => {
    const stored = localStorage.getItem(LOCAL_DRAFT_KEY);
    if (stored) {
      const draft = JSON.parse(stored);
      setTitle(draft.title || '');
      setContent(draft.content || '');
      setType(draft.type || 'written');
      setMediaUrl(draft.mediaUrl || null);
    }
  }, []);

  const saveDraftImmediately = useCallback(async () => {
    if (!session?.user?.id) return;
    const payload = {
      author_id: session.user.id,
      title,
      content,
      type,
      media_url: mediaUrl,
      is_published: false,
      updated_at: new Date(),
    };
    if (draftId) {
      await supabase.from('poems').update(payload).eq('id', draftId);
    } else {
      const { data } = await supabase.from('poems').insert(payload).select().single();
      if (data) setDraftId(data.id);
    }
  }, [session, title, content, type, mediaUrl, draftId]);

  // Load draft
  useEffect(() => {
    if (!session?.user?.id) return;
    const loadDraft = async () => {
      if (isOnline) {
        const { data } = await supabase
          .from('poems')
          .select('*')
          .eq('author_id', session.user.id)
          .eq('is_published', false)
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();
        if (data) {
          setDraftId(data.id);
          setTitle(data.title || '');
          setContent(data.content || '');
          setType(data.type || 'written');
          setMediaUrl(data.media_url);
          saveLocalDraft();
          return;
        }
      }
      loadLocalDraft();
    };
    loadDraft();
  }, [session, isOnline]);

  // Auto-save
  useEffect(() => {
    const save = async () => {
      if (!session?.user?.id) return;
      if (!title && !content && !mediaUrl) return;
      saveLocalDraft();
      if (!isOnline) {
        setSaveStatus('saved');
        return;
      }
      setSaveStatus('saving');
      const payload = {
        author_id: session.user.id,
        title,
        content,
        type,
        media_url: mediaUrl,
        is_published: false,
        updated_at: new Date(),
      };
      let error;
      if (draftId) {
        ({ error } = await supabase.from('poems').update(payload).eq('id', draftId));
      } else {
        const { data, error: insertError } = await supabase.from('poems').insert(payload).select().single();
        error = insertError;
        if (data) setDraftId(data.id);
      }
      setSaveStatus(error ? 'error' : 'saved');
      if (!error) playSave();
    };

    if (debouncedContent !== contentRef.current || debouncedTitle !== titleRef.current) {
      contentRef.current = debouncedContent;
      titleRef.current = debouncedTitle;
      save();
    }
  }, [debouncedContent, debouncedTitle, isOnline, draftId]);

  return {
    draftId,
    title,
    setTitle,
    content,
    setContent,
    type,
    setType,
    mediaUrl,
    setMediaUrl,
    saveStatus,
    saveLocalDraft,
    loadLocalDraft,
    saveDraftImmediately,
  };
}
