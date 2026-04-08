import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://owwvfelfxbthamqdilov.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93d3ZmZWxmeGJ0aGFtcWRpbG92Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDE0ODI0NSwiZXhwIjoyMDg5NzI0MjQ1fQ.Gtl8JSM7dVv7rcn6T4g6JDrP62bJ5QhoOQ7cfrEbEGc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function removeArticle() {
  await supabase
    .from('articles')
    .delete()
    .eq('title', 'คู่มือวิธีอ่านและใช้กราฟติดตามการเจริญเติบโต');

  console.log("Article removed!");
}

removeArticle();
