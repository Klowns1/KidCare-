import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.PRIVATE_SUPABASE_SERVICE_KEY
);

async function checkTable() {
    const list = ['parent_profiles', 'children', 'behavior_logs', 'health_records', 'assessment_results', 'notifications'];
    for (const t of list) {
        const { data, error } = await supabase.from(t).select('*').limit(1);
        console.log(`Table ${t}:`, error ? error.message : "Exists!");
    }
}

checkTable();
