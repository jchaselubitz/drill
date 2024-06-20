
-- on public
(bucket_id = 'text_to_speech'::text)

-- on authenticated
((bucket_id = 'text_to_speech'::text) AND (auth.role() = 'authenticated'::text))

-- for all functions in user_recordings
bucket_id = 'user_recordings' AND (select auth.uid()::text) = (storage.foldername(name))[1]