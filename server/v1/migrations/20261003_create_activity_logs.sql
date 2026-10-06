-- Migration: Create activity_logs table for Global Action Tracking
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255),
    role VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    module VARCHAR(100) NOT NULL,
    target_type VARCHAR(100),
    target_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'SUCCESS',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_role ON public.activity_logs (role);
CREATE INDEX IF NOT EXISTS idx_activity_logs_module ON public.activity_logs (module);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public.activity_logs (action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_status ON public.activity_logs (status);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs (user_id);
