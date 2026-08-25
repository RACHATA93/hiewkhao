import { useApp } from '../../hooks/useApp'

const radii = [0.5, 1, 1.5, 2, 3]

export default function Settings() {
  const { location, radiusKm, setRadiusKm, favorites } = useApp()

  return (
    <div className="page">
      <h2>ตั้งค่า</h2>
      <p className="muted">เวอร์ชันแรก: ไม่มีสมาชิก ไม่มีเซิร์ฟเวอร์</p>

      <section className="settings-card">
        <h3>รัศมีร้านใกล้ฉัน</h3>
        <div className="chip-row">
          {radii.map((km) => (
            <button
              key={km}
              type="button"
              className={`chip-btn ${radiusKm === km ? 'is-on' : ''}`}
              onClick={() => setRadiusKm(km)}
            >
              {km < 1 ? `${km * 1000} ม.` : `${km} กม.`}
            </button>
          ))}
        </div>
      </section>

      <section className="settings-card">
        <h3>ตำแหน่ง</h3>
        <p className="muted">
          ตอนนี้:{' '}
          {location.source === 'gps'
            ? 'GPS จริง'
            : location.source === 'demo'
              ? 'จุดตัวอย่าง (สยาม)'
              : 'ยังไม่ระบุ'}
        </p>
        <div className="row-actions">
          <button type="button" className="btn btn-ghost" onClick={location.requestGps}>
            📍 ใช้ตำแหน่งจริง
          </button>
          <button type="button" className="btn btn-ghost" onClick={location.useDemo}>
            ใช้จุดตัวอย่าง
          </button>
        </div>
      </section>

      <section className="settings-card">
        <h3>ข้อมูลในเครื่อง</h3>
        <p className="muted">ร้านตัวอย่างวางรอบตำแหน่งคุณเพื่อทดลองใช้</p>
        <button type="button" className="btn btn-danger" onClick={favorites.clear}>
          ล้างรายการติดดาว
        </button>
      </section>
    </div>
  )
}
