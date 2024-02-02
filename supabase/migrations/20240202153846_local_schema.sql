drop policy "Enable ALL for users based on user_id" on "public"."cards";

drop policy "Enable ALL for users based on user_id" on "public"."words";

revoke delete on table "public"."cards" from "anon";

revoke insert on table "public"."cards" from "anon";

revoke references on table "public"."cards" from "anon";

revoke select on table "public"."cards" from "anon";

revoke trigger on table "public"."cards" from "anon";

revoke truncate on table "public"."cards" from "anon";

revoke update on table "public"."cards" from "anon";

revoke delete on table "public"."cards" from "authenticated";

revoke insert on table "public"."cards" from "authenticated";

revoke references on table "public"."cards" from "authenticated";

revoke select on table "public"."cards" from "authenticated";

revoke trigger on table "public"."cards" from "authenticated";

revoke truncate on table "public"."cards" from "authenticated";

revoke update on table "public"."cards" from "authenticated";

revoke delete on table "public"."cards" from "service_role";

revoke insert on table "public"."cards" from "service_role";

revoke references on table "public"."cards" from "service_role";

revoke select on table "public"."cards" from "service_role";

revoke trigger on table "public"."cards" from "service_role";

revoke truncate on table "public"."cards" from "service_role";

revoke update on table "public"."cards" from "service_role";

revoke delete on table "public"."words" from "anon";

revoke insert on table "public"."words" from "anon";

revoke references on table "public"."words" from "anon";

revoke select on table "public"."words" from "anon";

revoke trigger on table "public"."words" from "anon";

revoke truncate on table "public"."words" from "anon";

revoke update on table "public"."words" from "anon";

revoke delete on table "public"."words" from "authenticated";

revoke insert on table "public"."words" from "authenticated";

revoke references on table "public"."words" from "authenticated";

revoke select on table "public"."words" from "authenticated";

revoke trigger on table "public"."words" from "authenticated";

revoke truncate on table "public"."words" from "authenticated";

revoke update on table "public"."words" from "authenticated";

revoke delete on table "public"."words" from "service_role";

revoke insert on table "public"."words" from "service_role";

revoke references on table "public"."words" from "service_role";

revoke select on table "public"."words" from "service_role";

revoke trigger on table "public"."words" from "service_role";

revoke truncate on table "public"."words" from "service_role";

revoke update on table "public"."words" from "service_role";

alter table "public"."cards" drop constraint "cards_lesson_id_fkey";

alter table "public"."cards" drop constraint "cards_user_id_fkey";

alter table "public"."cards" drop constraint "cards_pkey";

alter table "public"."words" drop constraint "words_pkey";

drop index if exists "public"."words_pkey";

drop index if exists "public"."cards_pkey";

drop table "public"."cards";

drop table "public"."words";

create table "public"."translations" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "lesson_id" bigint,
    "user_id" uuid not null,
    "interval_history" integer[],
    "repetition_history" timestamp with time zone[],
    "phrase_primary_id" bigint not null,
    "phrase_secondary_id" bigint not null
);


alter table "public"."translations" enable row level security;

alter table "public"."phrases" add column "part_speech" text;

alter table "public"."phrases" alter column "lang" set data type text using "lang"::text;

CREATE UNIQUE INDEX cards_pkey ON public.translations USING btree (id);

alter table "public"."translations" add constraint "cards_pkey" PRIMARY KEY using index "cards_pkey";

alter table "public"."translations" add constraint "translations_lesson_id_fkey" FOREIGN KEY (lesson_id) REFERENCES lessons(id) not valid;

alter table "public"."translations" validate constraint "translations_lesson_id_fkey";

alter table "public"."translations" add constraint "translations_phrase_primary_id_fkey" FOREIGN KEY (phrase_primary_id) REFERENCES phrases(id) not valid;

alter table "public"."translations" validate constraint "translations_phrase_primary_id_fkey";

alter table "public"."translations" add constraint "translations_phrase_secondary_id_fkey" FOREIGN KEY (phrase_secondary_id) REFERENCES phrases(id) not valid;

alter table "public"."translations" validate constraint "translations_phrase_secondary_id_fkey";

alter table "public"."translations" add constraint "translations_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."translations" validate constraint "translations_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_subject_lesson_translations(_user_id uuid, _subject_name text, _current_level text, _lesson_title text, _lesson_description text, _translations jsonb, _subject_id bigint)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
    _new_subject_id int8;
    _lesson_id int8;
    _phrase_primary_id int;
    _phrase_secondary_id int;
    _translation_record jsonb;
BEGIN
    -- Check if subject_id is provided
    IF _subject_id IS NOT NULL THEN
        -- Update existing subject (if any other updates are needed)
        UPDATE subjects SET name = _subject_name, current_level = _current_level
        WHERE id = _subject_id;
        _new_subject_id := _subject_id;
    ELSE
        -- Insert new subject
        INSERT INTO subjects (user_id, name, current_level)
        VALUES (_user_id, _subject_name, _current_level)
        RETURNING id INTO _new_subject_id;
    END IF;

    -- Insert lesson
    INSERT INTO lessons (user_id, title, short_description, subject_id)
    VALUES (_user_id, _lesson_title, _lesson_description, _new_subject_id)
    RETURNING id INTO _lesson_id;

    -- Process each translation
    FOR _translation_record IN SELECT * FROM jsonb_array_elements(_translations) LOOP
        -- Insert phrase_primary
        INSERT INTO phrases (text, lang)
        VALUES (_translation_record->'phrase_primary'->>'text', _translation_record->'phrase_primary'->>'lang')
        RETURNING id INTO _phrase_primary_id;

        -- Insert phrase_secondary
        INSERT INTO phrases (text, lang)
        VALUES (_translation_record->'phrase_secondary'->>'text', _translation_record->'phrase_secondary'->>'lang')
        RETURNING id INTO _phrase_secondary_id;

        -- Insert translation with references to phrases
        INSERT INTO translations (lesson_id, user_id, phrase_primary_id, phrase_secondary_id)
        VALUES (_lesson_id, _user_id, _phrase_primary_id, _phrase_secondary_id);
    END LOOP;

    -- Return lesson_id and subject_id
    RETURN json_build_object('lesson_id', _lesson_id, 'subject_id', _new_subject_id);

EXCEPTION WHEN OTHERS THEN
    -- Handle exceptions
    RAISE;
END;
$function$
;

grant delete on table "public"."translations" to "anon";

grant insert on table "public"."translations" to "anon";

grant references on table "public"."translations" to "anon";

grant select on table "public"."translations" to "anon";

grant trigger on table "public"."translations" to "anon";

grant truncate on table "public"."translations" to "anon";

grant update on table "public"."translations" to "anon";

grant delete on table "public"."translations" to "authenticated";

grant insert on table "public"."translations" to "authenticated";

grant references on table "public"."translations" to "authenticated";

grant select on table "public"."translations" to "authenticated";

grant trigger on table "public"."translations" to "authenticated";

grant truncate on table "public"."translations" to "authenticated";

grant update on table "public"."translations" to "authenticated";

grant delete on table "public"."translations" to "service_role";

grant insert on table "public"."translations" to "service_role";

grant references on table "public"."translations" to "service_role";

grant select on table "public"."translations" to "service_role";

grant trigger on table "public"."translations" to "service_role";

grant truncate on table "public"."translations" to "service_role";

grant update on table "public"."translations" to "service_role";

create policy "Enable ALL for users based on user_id"
on "public"."translations"
as permissive
for all
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



