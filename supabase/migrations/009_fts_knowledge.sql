drop function if exists search_verified_knowledge(text);
create or replace function search_verified_knowledge(p_search_text text)
returns table (
  id uuid,
  title text,
  content text,
  category text,
  source text,
  verified boolean,
  updated_at timestamptz,
  rank real
)
language sql
security invoker
stable
as $$
  select
    kd.id, kd.title, kd.content, kd.category, kd.source, kd.verified, kd.updated_at,
    ts_rank(kd.search_vector, websearch_to_tsquery('english', coalesce(p_search_text, ''))) as rank
  from knowledge_documents kd
  where kd.verified = true
    and (
      p_search_text is null
      or kd.search_vector @@ websearch_to_tsquery('english', p_search_text)
      or kd.title ilike '%' || p_search_text || '%'
      or kd.content ilike '%' || p_search_text || '%'
    )
  order by rank desc, kd.updated_at desc
  limit 10;
$$;
grant execute on function search_verified_knowledge(text) to authenticated, anon;