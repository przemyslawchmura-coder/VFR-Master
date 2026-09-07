-- Earliest repository foundation for the authenticated runtime tables.
-- Later migrations own technical_clarification and ownership/RLS hardening.

create table public.motorcycles (
  id uuid not null default gen_random_uuid(),
  user_id uuid,
  brand text,
  model text,
  year integer,
  mileage integer,
  vin text,
  nickname text,
  created_at timestamptz default now(),
  catalog_variant_key text,
  constraint motorcycles_pkey primary key (id),
  constraint motorcycles_user_id_fkey
    foreign key (user_id) references auth.users(id) on delete cascade
);

create table public.service_records (
  id uuid not null default gen_random_uuid(),
  motorcycle_id uuid not null,
  user_id uuid not null,
  type text not null,
  description text not null,
  service_date date not null default current_date,
  mileage integer,
  parts_cost numeric default 0,
  labor_cost numeric default 0,
  workshop text,
  note text,
  next_service_date date,
  next_service_mileage integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint service_records_pkey primary key (id),
  constraint service_records_motorcycle_id_fkey
    foreign key (motorcycle_id) references public.motorcycles(id) on delete cascade,
  constraint service_records_user_id_fkey
    foreign key (user_id) references auth.users(id) on delete cascade
);
