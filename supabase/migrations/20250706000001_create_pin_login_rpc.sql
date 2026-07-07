-- Migration: create_pin_login_rpc
-- Description: Creates the RPC function for PIN-based authentication
-- Date: 2025-07-06

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- PIN Authentication RPC Function
-- ============================================

CREATE OR REPLACE FUNCTION create_user_session(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_auth_code TEXT;
    v_expires_at TIMESTAMPTZ;
    v_result JSONB;
BEGIN
    -- Generate a secure random auth code (32 chars hex)
    v_auth_code := encode(gen_random_bytes(16), 'hex');
    v_expires_at := NOW() + INTERVAL '10 minutes';

    -- Store the auth code with expiration
    INSERT INTO public.auth_codes (code, user_id, expires_at, used)
    VALUES (v_auth_code, p_user_id, v_expires_at, FALSE);

    v_result := jsonb_build_object(
        'success', TRUE,
        'auth_code', v_auth_code
    );

    RETURN v_result;
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', FALSE,
            'error', SQLERRM
        );
END;
$$;

-- ============================================
-- Auth Codes Table (for PIN login flow)
-- ============================================

CREATE TABLE IF NOT EXISTS public.auth_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_auth_codes_code ON public.auth_codes(code);
CREATE INDEX IF NOT EXISTS idx_auth_codes_user_id ON public.auth_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_codes_expires_at ON public.auth_codes(expires_at);

-- ============================================
-- Cleanup expired auth codes (cron or trigger)
-- ============================================

CREATE OR REPLACE FUNCTION cleanup_expired_auth_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM public.auth_codes
    WHERE expires_at < NOW() OR used = TRUE;
END;
$$;

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

ALTER TABLE public.auth_codes ENABLE ROW LEVEL SECURITY;

-- Only service role can read auth_codes
CREATE POLICY "Service role can manage auth_codes" ON public.auth_codes
    FOR ALL
    TO service_role
    USING (TRUE)
    WITH CHECK (TRUE);

-- Users can only see their own auth codes
CREATE POLICY "Users can view own auth codes" ON public.auth_codes
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- ============================================
-- Grant permissions
-- ============================================

GRANT EXECUTE ON FUNCTION create_user_session(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION create_user_session(UUID) TO anon;
GRANT EXECUTE ON FUNCTION create_user_session(UUID) TO service_role;

-- ============================================
-- Comments
-- ============================================

COMMENT ON FUNCTION create_user_session(UUID) IS 'Creates a temporary auth code for PIN-based login. Returns a JSON object with success flag and auth_code.';
COMMENT ON TABLE public.auth_codes IS 'Stores temporary auth codes for PIN-based authentication flow.';
