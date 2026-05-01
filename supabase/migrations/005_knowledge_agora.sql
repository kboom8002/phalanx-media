-- Knowledge Agora DB Migration
-- 실행: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. agora_questions (쟁점 질문 스레드)
CREATE TABLE IF NOT EXISTS public.agora_questions (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                 TEXT        UNIQUE NOT NULL,
  title                TEXT        NOT NULL,
  body                 TEXT,
  issue_tags           TEXT[]      DEFAULT '{}',
  ai_synthesis         TEXT,
  source_signal_id     UUID,       -- raw_signals 연동
  source_fact_card_id  UUID,       -- fact_cards 연동
  status               TEXT        NOT NULL DEFAULT 'open'
    CHECK (status IN ('pending', 'open', 'closed', 'hidden')),
  best_reply_id        UUID,
  quality_score        FLOAT       DEFAULT 0,
  total_upvotes        INT         DEFAULT 0,
  reply_count          INT         DEFAULT 0,
  created_by           UUID        REFERENCES auth.users(id),
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- 2. agora_replies (답변 + 후속질문)
CREATE TABLE IF NOT EXISTS public.agora_replies (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id          UUID        NOT NULL REFERENCES public.agora_questions(id) ON DELETE CASCADE,
  parent_reply_id      UUID        REFERENCES public.agora_replies(id),
  author_id            UUID        REFERENCES auth.users(id),
  vanguard_id          TEXT,
  reply_type           TEXT        NOT NULL DEFAULT 'vanguard'
    CHECK (reply_type IN (
      'canon_synthesis',
      'statesman',
      'expert',
      'vanguard',
      'follow_up'
    )),
  content              TEXT        NOT NULL,
  source_fact_card_id  UUID,
  upvotes              INT         DEFAULT 0,
  downvotes            INT         DEFAULT 0,
  elo_score            FLOAT       DEFAULT 1200,
  is_accepted          BOOLEAN     DEFAULT false,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- 3. agora_votes (👍👎)
CREATE TABLE IF NOT EXISTS public.agora_votes (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  reply_id    UUID        NOT NULL REFERENCES public.agora_replies(id) ON DELETE CASCADE,
  voter_id    UUID        NOT NULL REFERENCES auth.users(id),
  vote_type   TEXT        NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (reply_id, voter_id)
);

-- 4. agora_dpo_pairs (DPO 비교 투표)
CREATE TABLE IF NOT EXISTS public.agora_dpo_pairs (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id          UUID        NOT NULL REFERENCES public.agora_questions(id) ON DELETE CASCADE,
  voter_id             UUID        REFERENCES auth.users(id),
  chosen_reply_id      UUID        NOT NULL REFERENCES public.agora_replies(id),
  rejected_reply_id    UUID        NOT NULL REFERENCES public.agora_replies(id),
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- 5. narrative_journeys 뷰 (Oiticle Copilot 훈련 데이터)
CREATE OR REPLACE VIEW public.narrative_journeys AS
WITH turns AS (
  SELECT
    r.question_id,
    r.id          AS reply_id,
    r.content,
    r.reply_type,
    r.parent_reply_id,
    r.upvotes - r.downvotes  AS net_score,
    r.created_at,
    ROW_NUMBER() OVER (PARTITION BY r.question_id ORDER BY r.created_at) AS turn_order
  FROM public.agora_replies r
  WHERE r.reply_type != 'follow_up'
    AND r.upvotes >= r.downvotes
)
SELECT
  q.id              AS question_id,
  q.title           AS initial_question,
  q.body            AS question_detail,
  q.issue_tags,
  q.ai_synthesis    AS ai_initial_answer,
  json_agg(
    json_build_object(
      'turn',    t.turn_order,
      'type',    t.reply_type,
      'content', t.content,
      'score',   t.net_score
    ) ORDER BY t.turn_order
  ) AS conversation_turns,
  q.quality_score
FROM public.agora_questions q
JOIN turns t ON t.question_id = q.id
WHERE q.status = 'open'
GROUP BY q.id, q.title, q.body, q.issue_tags, q.ai_synthesis, q.quality_score;

-- 6. 인덱스
CREATE INDEX IF NOT EXISTS idx_agora_q_status    ON public.agora_questions (status);
CREATE INDEX IF NOT EXISTS idx_agora_q_tags      ON public.agora_questions USING GIN (issue_tags);
CREATE INDEX IF NOT EXISTS idx_agora_q_created   ON public.agora_questions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agora_r_qid       ON public.agora_replies (question_id);
CREATE INDEX IF NOT EXISTS idx_agora_r_elo       ON public.agora_replies (elo_score DESC);
CREATE INDEX IF NOT EXISTS idx_agora_v_reply     ON public.agora_votes (reply_id);

-- 7. RLS
ALTER TABLE public.agora_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agora_replies   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agora_votes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agora_dpo_pairs ENABLE ROW LEVEL SECURITY;

-- 기존 정책 제거 (재실행 안전)
DROP POLICY IF EXISTS "Public read open agora_questions" ON public.agora_questions;
DROP POLICY IF EXISTS "Public read agora_replies"        ON public.agora_replies;
DROP POLICY IF EXISTS "Auth insert agora_replies"        ON public.agora_replies;
DROP POLICY IF EXISTS "Auth insert agora_votes"          ON public.agora_votes;
DROP POLICY IF EXISTS "Auth insert agora_questions"      ON public.agora_questions;
DROP POLICY IF EXISTS "Auth insert agora_dpo_pairs"      ON public.agora_dpo_pairs;
DROP POLICY IF EXISTS "Service role full access agora_questions" ON public.agora_questions;
DROP POLICY IF EXISTS "Service role full access agora_replies"   ON public.agora_replies;

-- 열람: 전체 공개
CREATE POLICY "Public read open agora_questions"
  ON public.agora_questions FOR SELECT
  USING (status = 'open');

CREATE POLICY "Public read agora_replies"
  ON public.agora_replies FOR SELECT
  USING (true);

-- 쓰기: 로그인 필수
CREATE POLICY "Auth insert agora_replies"
  ON public.agora_replies FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Auth insert agora_votes"
  ON public.agora_votes FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Auth insert agora_questions"
  ON public.agora_questions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Auth insert agora_dpo_pairs"
  ON public.agora_dpo_pairs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Service Role: 시딩/관제탑 전용 (RLS 우회 없이도 쓰기 가능)
CREATE POLICY "Service role full access agora_questions"
  ON public.agora_questions FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access agora_replies"
  ON public.agora_replies FOR ALL
  USING (auth.role() = 'service_role');

-- 8. Realtime 활성화 (이미 등록된 경우 무시)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'agora_questions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.agora_questions;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'agora_replies'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.agora_replies;
  END IF;
END $$;

-- 9. ELO 초기값 트리거 (reply_type별 자동 설정)
CREATE OR REPLACE FUNCTION set_elo_by_reply_type()
RETURNS TRIGGER AS $$
BEGIN
  NEW.elo_score := CASE NEW.reply_type
    WHEN 'canon_synthesis' THEN 1500
    WHEN 'expert'          THEN 1450
    WHEN 'statesman'       THEN 1400
    WHEN 'vanguard'        THEN 1200
    ELSE 1200
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_elo    ON public.agora_replies;
DROP TRIGGER IF EXISTS trg_reply_count ON public.agora_replies;

CREATE TRIGGER trg_set_elo
  BEFORE INSERT ON public.agora_replies
  FOR EACH ROW EXECUTE FUNCTION set_elo_by_reply_type();

-- 10. reply_count 자동 갱신 트리거
CREATE OR REPLACE FUNCTION increment_question_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.agora_questions
  SET reply_count = reply_count + 1,
      updated_at  = NOW()
  WHERE id = NEW.question_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reply_count
  AFTER INSERT ON public.agora_replies
  FOR EACH ROW EXECUTE FUNCTION increment_question_reply_count();

-- 확인 쿼리
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE 'agora_%';
