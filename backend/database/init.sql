-- ==========================================
-- SUPABASE INITIALIZATION SCRIPT - CAMPUSFLOW
-- ==========================================

-- ==========================================
-- 1. EXTENSIONS
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 2. TABLES & CONSTRAINTS
-- ==========================================

-- Roles
CREATE TABLE public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- Permissions
CREATE TABLE public.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- Users (Custom Auth Table)
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20),
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions
CREATE TABLE public.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    refresh_token TEXT UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subjects
CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    credits INT DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Task Reminders
CREATE TABLE public.task_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    reminder_time TIMESTAMPTZ NOT NULL,
    is_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance
CREATE TABLE public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('present', 'absent', 'late', 'excused')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, subject_id, date)
);

-- Study Groups
CREATE TABLE public.study_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Group Members
CREATE TABLE public.group_members (
    group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (group_id, user_id)
);

-- Companies
CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) UNIQUE NOT NULL,
    industry VARCHAR(100),
    website TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Placement Tracker
CREATE TABLE public.placement_tracker (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    role_title VARCHAR(150) NOT NULL,
    status VARCHAR(50) DEFAULT 'applied' CHECK (status IN ('applied', 'interviewing', 'offered', 'rejected', 'accepted')),
    date_applied DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calendar Events
CREATE TABLE public.calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    provider_event_id TEXT, -- e.g., Google Calendar ID
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    event_type VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'system',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notice History (Global Announcements)
CREATE TABLE public.notice_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    published_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automation Logs
CREATE TABLE public.automation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_name VARCHAR(150) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('success', 'failed', 'pending')),
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WhatsApp Logs
CREATE TABLE public.whatsapp_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    phone_number VARCHAR(20) NOT NULL,
    direction VARCHAR(10) CHECK (direction IN ('inbound', 'outbound')),
    message_content TEXT,
    status VARCHAR(50) DEFAULT 'sent',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI History
CREATE TABLE public.ai_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    context JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flashcards
CREATE TABLE public.flashcards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    next_review TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MCQs
CREATE TABLE public.mcqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of strings
    correct_option INT NOT NULL, -- Index of correct option
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. INDEXES FOR PERFORMANCE
-- ==========================================
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_attendance_user_id ON public.attendance(user_id);
CREATE INDEX idx_calendar_events_user_id ON public.calendar_events(user_id);
CREATE INDEX idx_placement_tracker_user_id ON public.placement_tracker(user_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_ai_history_user_id ON public.ai_history(user_id);
CREATE INDEX idx_flashcards_user_id ON public.flashcards(user_id);
CREATE INDEX idx_mcqs_user_id ON public.mcqs(user_id);
CREATE INDEX idx_group_members_user_id ON public.group_members(user_id);
CREATE INDEX idx_study_groups_created_by ON public.study_groups(created_by);
CREATE INDEX idx_task_reminders_task_id ON public.task_reminders(task_id);
CREATE INDEX idx_task_reminders_time_sent ON public.task_reminders(reminder_time, is_sent);
CREATE INDEX idx_whatsapp_logs_user_id ON public.whatsapp_logs(user_id);
CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);

-- ==========================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ==========================================
-- Enable RLS on sensitive user-facing tables
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcqs ENABLE ROW LEVEL SECURITY;

-- Note: Because we are using custom auth (public.users) instead of Supabase Auth (auth.users),
-- standard RLS policies using `auth.uid()` won't work out of the box for frontend clients unless 
-- custom JWT claims are passed.
-- Currently, the Backend Service Role Key bypasses these policies completely.
-- Should we move to frontend access with custom JWTs, policies would look like this:
-- CREATE POLICY "Users can view own tasks" ON public.tasks FOR SELECT USING (user_id = current_setting('request.jwt.claim.sub')::uuid);

-- ==========================================
-- 5. STORAGE BUCKETS (LOGICAL)
-- ==========================================
-- Assuming 'storage' schema exists natively in Supabase
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false) ON CONFLICT DO NOTHING;

-- ==========================================
-- 6. SEED DATA
-- ==========================================
INSERT INTO public.roles (name, description) VALUES 
('student', 'Standard student user'), 
('admin', 'System administrator') 
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.subjects (code, name, credits) VALUES 
('CS101', 'Introduction to Computer Science', 3),
('MA201', 'Advanced Calculus', 4),
('AI301', 'Artificial Intelligence & Machine Learning', 4)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.companies (name, industry, website) VALUES 
('Google', 'Technology', 'https://google.com'),
('Microsoft', 'Technology', 'https://microsoft.com')
ON CONFLICT (name) DO NOTHING;
