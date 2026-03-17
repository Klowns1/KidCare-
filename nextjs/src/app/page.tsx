import Link from 'next/link';
import { ArrowRight, Heart, BookOpen, MessageCircle, Bell, BarChart2, ClipboardList, Star } from 'lucide-react';
import AuthAwareButtons from '@/components/AuthAwareButtons';

export default function Home() {
  const features = [
    {
      icon: Heart,
      title: 'ติดตามสุขภาพเด็ก',
      description: 'บันทึกน้ำหนัก ส่วนสูง และดูกราฟการเจริญเติบโตแบบเรียลไทม์',
      color: 'bg-rose-100 text-rose-500',
      href: '/app/growth',
    },
    {
      icon: BookOpen,
      title: 'คลังความรู้',
      description: 'บทความโภชนาการ สุขภาพฟัน และพัฒนาการเด็กวัย 2–5 ปี',
      color: 'bg-amber-100 text-amber-500',
      href: '/app/knowledge',
    },
    {
      icon: ClipboardList,
      title: 'แบบประเมินความรอบรู้',
      description: 'Pre-test / Post-test วัดระดับความรอบรู้ด้านสุขภาพพร้อมคำแนะนำเฉพาะบุคคล',
      color: 'bg-sky-100 text-sky-500',
      href: '/app/assessments',
    },
    {
      icon: BarChart2,
      title: 'บันทึกพฤติกรรมการเลี้ยงดู',
      description: 'Check-list รายวันด้านโภชนาการ สุขภาพฟัน และพัฒนาการ',
      color: 'bg-emerald-100 text-emerald-500',
      href: '/app/behavior',
    },
    {
      icon: MessageCircle,
      title: 'ปรึกษาบุคลากรสุขภาพ',
      description: 'แชทกับเจ้าหน้าที่สาธารณสุขในจังหวัดร้อยเอ็ดได้โดยตรง',
      color: 'bg-violet-100 text-violet-500',
      href: '/app/contact',
    },
    {
      icon: Bell,
      title: 'ระบบแจ้งเตือนอัจฉริยะ',
      description: 'เตือนแปรงฟัน ชั่งน้ำหนัก ฉีดวัคซีน และกิจกรรมพัฒนาการ',
      color: 'bg-orange-100 text-orange-500',
      href: '/app/notifications',
    },
  ];

  const steps = [
    { num: '01', title: 'สมัครสมาชิก', desc: 'กรอกข้อมูลผู้ปกครองและข้อมูลเด็กของคุณ' },
    { num: '02', title: 'ประเมินความรอบรู้', desc: 'ทำแบบประเมินเพื่อรับคำแนะนำที่เหมาะกับครอบครัวคุณ' },
    { num: '03', title: 'ติดตามและพัฒนา', desc: 'บันทึกสุขภาพเด็กและเรียนรู้จากคลังความรู้ทุกวัน' },
  ];

  return (
    <div className="min-h-screen font-sans" style={{ fontFamily: "'Sarabun', 'Noto Sans Thai', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&display=swap');

        :root {
          --green-primary: #2d7d52;
          --green-light: #e8f5ee;
          --green-mid: #4aad73;
          --yellow-accent: #f5c842;
          --peach: #fff3e8;
          --text-dark: #1a2e1f;
          --text-mid: #3d5a46;
          --text-soft: #6b8c74;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { background-color: #fafdf7; color: var(--text-dark); }

        .blob {
          border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
        }

        .hero-bg {
          background: radial-gradient(ellipse 80% 60% at 60% 40%, #c8f0d8 0%, #fafdf7 70%);
        }

        .card-hover {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(45,125,82,0.12);
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--green-light);
          color: var(--green-primary);
          border: 1px solid #b3dfc3;
          border-radius: 999px;
          padding: 4px 14px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .nav-link {
          color: var(--text-mid);
          font-weight: 500;
          font-size: 15px;
          transition: color 0.2s;
          text-decoration: none;
        }
        .nav-link:hover { color: var(--green-primary); }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--green-primary);
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 14px 28px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
          font-family: inherit;
        }
        .btn-primary:hover {
          background: #24643f;
          transform: translateY(-1px);
        }

        .btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: var(--green-primary);
          border: 2px solid var(--green-primary);
          border-radius: 12px;
          padding: 12px 26px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
          font-family: inherit;
        }
        .btn-outline:hover {
          background: var(--green-light);
        }

        .step-line::after {
          content: '';
          position: absolute;
          top: 28px;
          left: calc(100% - 8px);
          width: calc(100% - 16px);
          height: 2px;
          background: linear-gradient(90deg, #b3dfc3, transparent);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .float-anim { animation: float 4s ease-in-out infinite; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .fade-up-2 { animation: fadeUp 0.7s 0.15s ease both; }
        .fade-up-3 { animation: fadeUp 0.7s 0.3s ease both; }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 50,
        background: 'rgba(250,253,247,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #dff0e5',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #2d7d52, #4aad73)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Heart size={18} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--green-primary)' }}>
              KidCare ร้อยเอ็ด
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <a href="#features" className="nav-link">ฟีเจอร์</a>
            <a href="#how" className="nav-link">วิธีใช้งาน</a>
            <AuthAwareButtons variant="nav" />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-bg" style={{ paddingTop: 120, paddingBottom: 80, minHeight: '92vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>

          {/* Left */}
          <div>
            <div className="badge fade-up" style={{ marginBottom: 20 }}>
              <Star size={13} fill="currentColor" />
              โครงการวิจัย คณะพยาบาลศาสตร์ มรภ.ร้อยเอ็ด
            </div>

            <h1 className="fade-up-2" style={{
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 800,
              lineHeight: 1.2,
              color: 'var(--text-dark)',
              marginBottom: 20,
            }}>
              ดูแลลูกน้อย<br />
              <span style={{ color: 'var(--green-primary)' }}>อย่างรอบรู้</span>
              <br />ด้วยวิทยาศาสตร์
            </h1>

            <p className="fade-up-3" style={{
              fontSize: 18, color: 'var(--text-soft)', lineHeight: 1.8,
              marginBottom: 36, maxWidth: 440,
            }}>
              แอพพลิเคชันส่งเสริมความรอบรู้ด้านสุขภาพสำหรับผู้ปกครองเด็กวัยก่อนเรียน
              ในจังหวัดร้อยเอ็ด ติดตามพัฒนาการ โภชนาการ และสุขภาพฟัน ครบในที่เดียว
            </p>

            <div className="fade-up-3" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link href="/auth/register" className="btn-primary">
                เริ่มใช้งานฟรี
                <ArrowRight size={18} />
              </Link>
              <Link href="/auth/login" className="btn-outline">
                เข้าสู่ระบบ
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 32, marginTop: 48 }}>
              {[
                { v: '6 ด้าน', l: 'ความรอบรู้สุขภาพ' },
                { v: '3 หมวด', l: 'คลังความรู้' },
                { v: '24/7', l: 'ติดตามสุขภาพ' },
              ].map((s) => (
                <div key={s.l}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--green-primary)' }}>{s.v}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-soft)', marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — illustration */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div className="float-anim" style={{
              width: 380, height: 380,
              background: 'linear-gradient(135deg, #c8f0d8 0%, #e8f5ee 60%, #fff8e0 100%)',
              borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
              boxShadow: '0 24px 64px rgba(45,125,82,0.18)',
            }}>
              {/* Center icon */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 96 }}>👶</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--green-primary)', marginTop: 8 }}>สุขภาพดี</div>
                <div style={{ fontSize: 14, color: 'var(--text-soft)' }}>เติบโตสมวัย</div>
              </div>

              {/* Floating badges */}
              {[
                { emoji: '🥦', label: 'โภชนาการ', top: '8%', left: '-12%', delay: '0s' },
                { emoji: '🦷', label: 'สุขภาพฟัน', top: '8%', right: '-12%', delay: '0.5s' },
                { emoji: '📏', label: 'พัฒนาการ', bottom: '12%', left: '-14%', delay: '1s' },
                { emoji: '💊', label: 'วัคซีน', bottom: '12%', right: '-14%', delay: '1.5s' },
              ].map((b) => (
                <div key={b.label} style={{
                  position: 'absolute',
                  top: b.top, left: b.left, right: b.right, bottom: b.bottom,
                  background: '#fff',
                  borderRadius: 16,
                  padding: '10px 16px',
                  display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  fontSize: 13, fontWeight: 600, color: 'var(--text-mid)',
                  animation: `float 4s ${b.delay} ease-in-out infinite`,
                  whiteSpace: 'nowrap',
                }}>
                  <span style={{ fontSize: 20 }}>{b.emoji}</span>
                  {b.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ background: '#fafdf7', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="badge" style={{ marginBottom: 16 }}>ฟีเจอร์ทั้งหมด</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-dark)' }}>
              ครบทุกสิ่งที่ผู้ปกครองต้องการ
            </h2>
            <p style={{ marginTop: 12, fontSize: 17, color: 'var(--text-soft)' }}>
              ออกแบบมาเพื่อพ่อแม่ ผู้ปกครอง และผู้ดูแลเด็กปฐมวัยโดยเฉพาะ
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {features.map((f) => (
              <Link key={f.title} href={f.href} style={{ textDecoration: 'none' }}>
                <div className="card-hover" style={{
                  background: '#fff',
                  borderRadius: 20,
                  padding: 28,
                  border: '1px solid #e8f5ee',
                  height: '100%',
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 18,
                  }} className={f.color}>
                    <f.icon size={24} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-dark)', marginBottom: 8 }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--text-soft)', lineHeight: 1.7 }}>
                    {f.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ background: 'var(--green-light)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div className="badge" style={{ marginBottom: 16 }}>วิธีเริ่มต้น</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-dark)', marginBottom: 56 }}>
            ใช้งานง่าย 3 ขั้นตอน
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {steps.map((s, i) => (
              <div key={s.num} style={{ position: 'relative' }}>
                {i < steps.length - 1 && (
                  <div style={{
                    position: 'absolute', top: 24, left: '50%', width: '100%', height: 2,
                    background: 'linear-gradient(90deg, #b3dfc3, transparent)',
                    zIndex: 0,
                  }} />
                )}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: 'var(--green-primary)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, fontWeight: 800, margin: '0 auto 20px',
                    boxShadow: '0 8px 20px rgba(45,125,82,0.3)',
                  }}>
                    {s.num}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-dark)', marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-soft)', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: 'linear-gradient(135deg, var(--green-primary) 0%, #1a5c3a 100%)',
        padding: '80px 24px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💚</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 16 }}>
            เริ่มดูแลลูกน้อยวันนี้
          </h2>
          <p style={{ fontSize: 17, color: '#a8d5b8', lineHeight: 1.7, marginBottom: 36 }}>
            ร่วมเป็นส่วนหนึ่งของโครงการวิจัยเพื่อส่งเสริมสุขภาพเด็กปฐมวัย
            ในจังหวัดร้อยเอ็ด — ฟรี ไม่มีค่าใช้จ่าย
          </p>
          <Link href="/auth/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'var(--yellow-accent)', color: '#1a2e1f',
            borderRadius: 14, padding: '16px 36px',
            fontSize: 18, fontWeight: 800, textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(245,200,66,0.4)',
            transition: 'transform 0.15s',
          }}>
            สมัครใช้งานฟรี
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0f2318', color: '#6b8c74', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #2d7d52, #4aad73)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Heart size={16} color="#fff" fill="#fff" />
            </div>
            <span style={{ color: '#a8d5b8', fontWeight: 700, fontSize: 16 }}>KidCare ร้อยเอ็ด</span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.8 }}>
            โครงการวิจัย: การพัฒนาแอพพลิเคชันเพื่อส่งเสริมความรอบรู้ด้านสุขภาพของผู้ปกครอง<br />
            คณะพยาบาลศาสตร์ มหาวิทยาลัยราชภัฏร้อยเอ็ด
          </p>
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #1e3d2a', fontSize: 12, color: '#3d5a46' }}>
            © {new Date().getFullYear()} คณะพยาบาลศาสตร์ มหาวิทยาลัยราชภัฏร้อยเอ็ด — สงวนลิขสิทธิ์
          </div>
        </div>
      </footer>
    </div>
  );
}