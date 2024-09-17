alter table "public"."profiles" drop constraint "profiles_pkey";

drop index if exists "public"."profiles_pkey";

alter table "public"."profiles" add column "primary_language" iso_639_language_code;

CREATE UNIQUE INDEX profiles_user_id_key ON public.profiles USING btree (user_id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id, user_id);

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."profiles" add constraint "profiles_user_id_key" UNIQUE using index "profiles_user_id_key";


