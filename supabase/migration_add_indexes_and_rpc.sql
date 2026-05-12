-- =============================================
-- Aura Finance: Performance Optimization Migration
-- Run this SQL in Supabase Dashboard > SQL Editor
-- =============================================

-- ─────────────────────────────────────────────
-- 1. INDEXES
-- ─────────────────────────────────────────────

-- Core composite index: covers most dashboard/report queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_date
  ON transactions(user_id, transaction_date DESC);

-- Composite index for type-filtered queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_type
  ON transactions(user_id, type);

-- Composite index for category-filtered queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_category
  ON transactions(user_id, category);

-- Composite index for user + type + date (covers period stats)
CREATE INDEX IF NOT EXISTS idx_transactions_user_type_date
  ON transactions(user_id, type, transaction_date);

-- Index on created_at for transaction list ordering
CREATE INDEX IF NOT EXISTS idx_transactions_user_created
  ON transactions(user_id, created_at DESC);

-- Enable trigram extension for text search (optional, comment out if not needed)
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- CREATE INDEX IF NOT EXISTS idx_transactions_title_trgm
--   ON transactions USING gin(title gin_trgm_ops);


-- ─────────────────────────────────────────────
-- 2. RPC FUNCTIONS
-- ─────────────────────────────────────────────

-- ─── 2a. Get all-time balance (total income - total expense) ───
CREATE OR REPLACE FUNCTION get_balance(p_user_id uuid)
RETURNS TABLE(total_income numeric, total_expense numeric, balance numeric)
LANGUAGE sql STABLE
SET search_path = public
AS $$
  SELECT
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
    COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense,
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0)
    - COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS balance
  FROM transactions
  WHERE user_id = p_user_id;
$$;


-- ─── 2b. Get period stats (income/expense in a date range) ───
CREATE OR REPLACE FUNCTION get_period_stats(
  p_user_id uuid,
  p_start_date date,
  p_end_date date
)
RETURNS TABLE(total_income numeric, total_expense numeric, limit_expense numeric)
LANGUAGE sql STABLE
SET search_path = public
AS $$
  SELECT
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
    COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense,
    COALESCE(SUM(CASE WHEN type = 'expense' AND (exclude_from_limit IS NULL OR exclude_from_limit = false) THEN amount ELSE 0 END), 0) AS limit_expense
  FROM transactions
  WHERE user_id = p_user_id
    AND transaction_date >= p_start_date
    AND transaction_date <= p_end_date;
$$;


-- ─── 2c. Get monthly chart data (income/expense grouped by month) ───
CREATE OR REPLACE FUNCTION get_monthly_chart(
  p_user_id uuid,
  p_start_date date,
  p_end_date date
)
RETURNS TABLE(month text, income numeric, expenses numeric)
LANGUAGE sql STABLE
SET search_path = public
AS $$
  SELECT
    to_char(transaction_date, 'YYYY-MM') AS month,
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
    COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expenses
  FROM transactions
  WHERE user_id = p_user_id
    AND transaction_date >= p_start_date
    AND transaction_date <= p_end_date
  GROUP BY to_char(transaction_date, 'YYYY-MM')
  ORDER BY month;
$$;


-- ─── 2d. Get daily chart data (income/expense grouped by day) ───
CREATE OR REPLACE FUNCTION get_daily_chart(
  p_user_id uuid,
  p_start_date date,
  p_end_date date
)
RETURNS TABLE(day text, income numeric, expenses numeric)
LANGUAGE sql STABLE
SET search_path = public
AS $$
  SELECT
    to_char(transaction_date, 'YYYY-MM-DD') AS day,
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
    COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expenses
  FROM transactions
  WHERE user_id = p_user_id
    AND transaction_date >= p_start_date
    AND transaction_date <= p_end_date
  GROUP BY to_char(transaction_date, 'YYYY-MM-DD')
  ORDER BY day;
$$;


-- ─── 2e. Get category distribution (expenses grouped by category) ───
CREATE OR REPLACE FUNCTION get_category_distribution(
  p_user_id uuid,
  p_start_date date DEFAULT NULL,
  p_end_date date DEFAULT NULL
)
RETURNS TABLE(name text, value numeric)
LANGUAGE sql STABLE
SET search_path = public
AS $$
  SELECT
    COALESCE(category, 'other') AS name,
    SUM(amount) AS value
  FROM transactions
  WHERE user_id = p_user_id
    AND type = 'expense'
    AND (p_start_date IS NULL OR transaction_date >= p_start_date)
    AND (p_end_date IS NULL OR transaction_date <= p_end_date)
  GROUP BY COALESCE(category, 'other')
  ORDER BY value DESC;
$$;
