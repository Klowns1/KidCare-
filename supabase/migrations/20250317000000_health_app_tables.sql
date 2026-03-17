-- Migration: Create tables for Child Health Monitoring App
-- Based on: คณะพยาบาลศาสตร์ มหาวิทยาลัยราชภัฏร้อยเอ็ด

-- 1. Parent Profiles
CREATE TABLE IF NOT EXISTS public.parent_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    gender TEXT,
    age INTEGER,
    education_level TEXT,
    occupation TEXT,
    family_income TEXT,
    marital_status TEXT,
    family_type TEXT, -- ครอบครัวเดี่ยว / ครอบครัวขยาย
    relationship_to_child TEXT, -- พ่อ แม่ ปู่ ย่า ตา ยาย
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

-- 2. Children
CREATE TABLE IF NOT EXISTS public.children (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NOT NULL REFERENCES public.parent_profiles(id) ON DELETE CASCADE,
    gender TEXT,
    birth_date DATE,
    birth_order INTEGER,
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    decayed_teeth INTEGER DEFAULT 0,
    dentist_visit_history TEXT,
    dspm_gross_motor TEXT, -- กล้ามเนื้อมัดใหญ่
    dspm_fine_motor TEXT,  -- กล้ามเนื้อมัดเล็ก / สติปัญญา
    dspm_language_comprehension TEXT, -- การเข้าใจภาษา
    dspm_language_use TEXT, -- การใช้ภาษา
    dspm_self_help TEXT, -- การช่วยเหลือตนเองและสังคม
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Behavior Logs
CREATE TABLE IF NOT EXISTS public.behavior_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    -- โภชนาการ
    meals_3_per_day BOOLEAN DEFAULT false,
    fruits_vegetables BOOLEAN DEFAULT false,
    breakfast BOOLEAN DEFAULT false,
    processed_food BOOLEAN DEFAULT false,
    -- สุขภาพฟัน
    brushed_teeth BOOLEAN DEFAULT false,
    dental_checkup BOOLEAN DEFAULT false,
    bottle_before_bed BOOLEAN DEFAULT false,
    -- พัฒนาการ
    read_stories BOOLEAN DEFAULT false,
    played_with_child BOOLEAN DEFAULT false,
    self_help_training BOOLEAN DEFAULT false,
    praised_child BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Health Records (for growth chart)
CREATE TABLE IF NOT EXISTS public.health_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
    record_date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Assessment Results (Pre/Post-test)
CREATE TABLE IF NOT EXISTS public.assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    test_type TEXT NOT NULL CHECK (test_type IN ('pre', 'post')),
    score_access_info INTEGER DEFAULT 0,
    score_knowledge INTEGER DEFAULT 0,
    score_communication INTEGER DEFAULT 0,
    score_media_literacy INTEGER DEFAULT 0,
    score_decision_making INTEGER DEFAULT 0,
    score_care_management INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    literacy_level TEXT,
    recommendations TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- brush_teeth, dental_checkup, weigh_in, development_activity
    title TEXT NOT NULL,
    message TEXT,
    scheduled_at TIMESTAMPTZ,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.parent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.behavior_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Parent profiles: users can only see/edit their own
CREATE POLICY "Users can manage their own parent profile" ON public.parent_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Children: users can manage children linked to their parent profile
CREATE POLICY "Users can manage their own children" ON public.children
    FOR ALL USING (parent_id IN (SELECT id FROM public.parent_profiles WHERE user_id = auth.uid()));

-- Behavior logs: via children
CREATE POLICY "Users can manage behavior logs" ON public.behavior_logs
    FOR ALL USING (child_id IN (SELECT c.id FROM public.children c JOIN public.parent_profiles p ON c.parent_id = p.id WHERE p.user_id = auth.uid()));

-- Health records: via children
CREATE POLICY "Users can manage health records" ON public.health_records
    FOR ALL USING (child_id IN (SELECT c.id FROM public.children c JOIN public.parent_profiles p ON c.parent_id = p.id WHERE p.user_id = auth.uid()));

-- Assessment results: own
CREATE POLICY "Users can manage their own assessments" ON public.assessment_results
    FOR ALL USING (auth.uid() = user_id);

-- Notifications: own
CREATE POLICY "Users can manage their own notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);
