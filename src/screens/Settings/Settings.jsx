import { clearRestaurantCache } from '../../services/restaurantService'
import { useApp } from '../../hooks/useApp'

const radii = [0.5, 1, 1.5, 2, 3, 5]

export default function Settings() {
  const { location, radiusKm, setRadiusKm, favorites, restaurants } = useApp()

  const handleClearCache = () => {
    clearRestaurantCache()
    restaurants.refresh()
    alert('ล้างแคชข้อมูลแผนที่เรียบร้อย กำลังโหลดข้อมูลสดใหม่')
  }

  return (
    <div className="page">
      <h2>⚙️ ตั้งค่าระบบ</h2>
      <p className="muted">
        ระบบทำงานบนเครื่องคุณโดยตรง (No Backend) เชื่อมโยงข้อมูลสดและ Google Maps
      </p>

      {/* Radius setting */}
      <section className="settings-card">
        <h3>📏 รัศมีค้นหาร้านอาหารใกล้ฉัน</h3>
        <p className="muted">เลือกระยะทางรอบตัวที่ต้องการให้ค้นหาร้านอาหาร</p>
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

      {/* Location setting */}
      <section className="settings-card">
        <h3>📍 ตำแหน่งที่ใช้งาน</h3>
        <p className="muted">
          ตำแหน่งปัจจุบัน:{' '}
          <strong>
            {location.locationName}
            {location.source === 'gps' ? ' (GPS จริง)' : ''}
          </strong>
        </p>

        <div className="row-actions justify-start">
          <button
            type="button"
            className="btn btn-primary"
            onClick={location.requestGps}
          >
            📍 ใช้ตำแหน่ง GPS จริง
          </button>
        </div>

        <p className="preset-label">หรือเลือกทดสอบจากพื้นที่ยอดนิยม:</p>
        <div className="preset-grid">
          {location.presets.map((preset) => {
            const isSelected =
              Math.abs(location.coords.lat - preset.lat) < 0.001 &&
              Math.abs(location.coords.lng - preset.lng) < 0.001

            return (
              <button
                key={preset.id}
                type="button"
                className={`preset-btn ${isSelected ? 'is-selected' : ''}`}
                onClick={() => location.selectPreset(preset)}
              >
                <span>📍</span>
                <span>{preset.name}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Data & Cache management */}
      <section className="settings-card">
        <h3>🗄️ จัดการข้อมูลและหน่วยความจำ</h3>
        <div className="settings-action-rows">
          <div className="action-row-item">
            <div>
              <strong>ล้างแคชข้อมูลแผนที่สด</strong>
              <p className="muted">ล้างข้อมูลร้านค้าที่บันทึกชั่วคราวและดึงข้อมูลใหม่จาก OpenStreetMap</p>
            </div>
            <button type="button" className="btn btn-ghost btn-sm" onClick={handleClearCache}>
              🔄 ล้างแคช
            </button>
          </div>

          <div className="action-row-item">
            <div>
              <strong>ล้างรายการติดดาว</strong>
              <p className="muted">ลบร้านอาหารทั้งหมดที่บันทึกไว้ในหน้าร้านโปรด</p>
            </div>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => {
                if (confirm('ต้องการล้างร้านที่ติดดาวทั้งหมดหรือไม่?')) {
                  favorites.clear()
                }
              }}
            >
              🗑️ ล้างทั้งหมด
            </button>
          </div>
        </div>
      </section>

      {/* Source attribution */}
      <section className="settings-card info-card">
        <h3>ℹ️ แหล่งข้อมูลและเทคโนโลยี</h3>
        <ul className="info-list">
          <li>
            <strong>Real-time Places:</strong> OpenStreetMap Overpass API (Live Client Fetch)
          </li>
          <li>
            <strong>Navigation & Place Search:</strong> Google Maps Universal URL API
          </li>
          <li>
            <strong>Menu Engine:</strong> ระบบวิเคราะห์เมนูอาหารไทยอัตโนมัติตามประเภทและชื่อร้าน
          </li>
          <li>
            <strong>Backend:</strong> ไม่ต้องใช้ Server แบ็กเอนด์ (Client-side 100%)
          </li>
        </ul>
      </section>
    </div>
  )
}
