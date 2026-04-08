import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://owwvfelfxbthamqdilov.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93d3ZmZWxmeGJ0aGFtcWRpbG92Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDE0ODI0NSwiZXhwIjoyMDg5NzI0MjQ1fQ.Gtl8JSM7dVv7rcn6T4g6JDrP62bJ5QhoOQ7cfrEbEGc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixImages() {
  await supabase
    .from('articles')
    .update({ image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop' })
    .eq('title', 'ปริมาณอาหารที่แนะนำใน 1 วัน สำหรับเด็ก 2-5 ปี');

  await supabase
    .from('articles')
    .update({ image_url: 'https://images.unsplash.com/photo-1602052793312-b99c2a9ee797?q=80&w=2070&auto=format&fit=crop' })
    .eq('title', 'คู่มือวิธีอ่านและใช้กราฟติดตามการเจริญเติบโต');

  console.log("Images fixed!");
}

fixImages();
