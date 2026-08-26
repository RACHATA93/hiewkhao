import { foodCatalog } from '../data/foodCatalog.js'

/**
 * วิเคราะห์ชื่อร้าน, แท็ก cuisine, amenity และแบรนด์ของร้านจริง
 * เพื่ออนุมานเมนูอาหารที่เป็นไปได้ (Plausible Menu Items) และหมวดหมู่ร้าน
 */

// กฎการจับคู่คีย์เวิร์ดในชื่อหรือแท็ก
const CATEGORY_RULES = [
  {
    category: 'cafe-dessert',
    badge: '☕ คาเฟ่ / เครื่องดื่ม / ของหวาน',
    matchers: [
      'cafe', 'coffee', 'tea', 'bakery', 'ice_cream', 'dessert', 'กาแฟ', 'คาเฟ่', 'ชา', 'ชานม',
      'amazon', 'starbucks', 'all cafe', 'all_cafe', 'ชาตรามือ', 'มนต์นมสด', 'บิงซู', 'ขนม',
      'เบเกอรี่', 'นมสด', 'ปังปิ้ง', 'sweet', 'roaster', 'espresso', 'matcha', 'bubble', 'boba'
    ],
    defaultFoodIds: ['iced-espresso-thai', 'iced-matcha-latte', 'thai-milk-tea', 'croissant-butter', 'toast-butter-sugar'],
    defaultPrice: '฿',
  },
  {
    category: 'noodle',
    badge: '🍜 ก๋วยเตี๋ยว / เส้น',
    matchers: [
      'noodle', 'noodles', 'ramen', 'ก๋วยเตี๋ยว', 'เตี๋ยว', 'บะหมี่', 'เกี๊ยว', 'เย็นตาโฟ',
      'ลูกชิ้น', 'ไก่มะระ', 'น้ำตก', 'เตี๋ยวเรือ', 'ชายสี่', 'ฮะจิบัง', 'เส้น', 'เกาเหลา',
      'ก๋วยจั๊บ', 'ผัดหมี่'
    ],
    defaultFoodIds: ['boat-noodle', 'tomyum-noodle', 'wonton-noodle', 'yen-ta-fo', 'clear-soup-noodle', 'chicken-bitter-gourd-noodle'],
    defaultPrice: '฿',
  },
  {
    category: 'isan',
    badge: '🥗 ส้มตำ / อาหารอีสาน',
    matchers: [
      'isan', 'esarn', 'somtum', 'ส้มตำ', 'ตำ', 'ลาบ', 'น้ำตก', 'อีสาน', 'แซ่บ', 'ไก่ย่าง',
      'คอหมูย่าง', 'ต้มแซ่บ', 'แจ่ว', 'ครก', 'นิตยาไก่ย่าง', 'ส้มตำนัว'
    ],
    defaultFoodIds: ['somtum-thai', 'somtum-pu-pla-ra', 'grilled-pork-neck', 'larb-moo', 'grilled-chicken-sticky-rice', 'tom-saeb'],
    defaultPrice: '฿',
  },
  {
    category: 'rice-dish',
    badge: '🍗 ข้าวมันไก่ / ขาหมู / หมูแดง',
    matchers: [
      'ข้าวมันไก่', 'ไก่ตอน', 'ประตูน้ำ', 'โกอ่าง', 'ขาหมู', 'คากิ', 'หมูแดง', 'หมูกรอบ',
      'ข้าวหมก', 'ข้าวหน้าเป็ด', 'เป็ดย่าง', 'ข้าวเฉโป', 'chicken rice'
    ],
    defaultFoodIds: ['khao-man-gai', 'khao-man-gai-tod', 'khao-kha-moo', 'khao-moo-dang', 'khao-mok-gai'],
    defaultPrice: '฿',
  },
  {
    category: 'japanese-korean',
    badge: '🍣 อาหารญี่ปุ่น / เกาหลี',
    matchers: [
      'japanese', 'sushi', 'sashimi', 'ramen', 'korean', 'bbq', 'donburi', 'ซูชิ', 'ซาชิมิ',
      'ราเมง', 'ญี่ปุ่น', 'เกาหลี', 'บอนชอน', 'bonchon', 'ยาโยอิ', 'yayoi', 'fuji', 'shabushi',
      'zen', 'katsu', 'ทงคัตสึ', 'curry', 'ข้าวแกงกะหรี่', 'bibimbap', 'โคชูจัง'
    ],
    defaultFoodIds: ['salmon-sashimi-don', 'tonkatsu-curry', 'ramen-tonkotsu', 'korean-fried-chicken', 'bibimbap'],
    defaultPrice: '฿฿',
  },
  {
    category: 'shabu-bbq',
    badge: '🥩 ชาบู / ปิ้งย่าง / หมูกระทะ',
    matchers: [
      'shabu', 'suki', 'hotpot', 'bbq', 'grill', 'buffet', 'หมูกระทะ', 'หมูกะทะ', 'ชาบู',
      'สุกี้', 'mk', 'mk restaurants', 'หมาล่า', 'mala', 'สายพาน', 'สุกี้จินดา', 'ปิ้งย่าง',
      'เตาถ่าน', 'haidilao', 'bar b q plaza', 'บาร์บีคิว'
    ],
    defaultFoodIds: ['shabu-shabu', 'moo-kratha', 'mala-hotpot', 'korean-bbq'],
    defaultPrice: '฿฿',
  },
  {
    category: 'fastfood-western',
    badge: '🍔 สเต็ก / เบอร์เกอร์ / ฟาสต์ฟู้ด',
    matchers: [
      'burger', 'pizza', 'steak', 'fast_food', 'fastfood', 'mcdonald', 'kfc', 'burger king',
      'pizza hut', 'the pizza company', 'sizzler', 'santa fe', 'สเต็ก', 'เบอร์เกอร์', 'พิซซ่า',
      'italian', 'spaghetti', 'พาสต้า', 'texas chicken', 'chester'
    ],
    defaultFoodIds: ['beef-burger', 'pork-chop-steak', 'pizza-hawaiian', 'spaghetti-carbonara', 'kfc-crispy-chicken'],
    defaultPrice: '฿฿',
  },
  {
    category: 'curry',
    badge: '🍲 ข้าวแกง / ซีฟู้ด / ต้มยำ',
    matchers: [
      'curry', 'seafood', 'ข้าวแกง', 'แกงส้ม', 'ปักษ์ใต้', 'แกงใต้', 'ครัว', 'ต้มยำ',
      'ซีฟู้ด', 'อาหารทะเล', 'กุ้งเผา', 'ปูเป็น', 'เจ๊ง้อ', 'แหลมเจริญ', 'สมบูรณ์โภชนา'
    ],
    defaultFoodIds: ['tom-yum-kung', 'green-curry-chicken', 'southern-curry', 'khua-kling', 'steamed-fish-lime'],
    defaultPrice: '฿฿',
  },
  {
    category: 'ala-carte',
    badge: '🍳 อาหารตามสั่ง / จานเดียว',
    matchers: [
      'ตามสั่ง', 'อาหารตามสั่ง', 'กะเพรา', 'ผัดกะเพรา', 'ข้าวผัด', 'ราดหน้า', 'ผัดซีอิ๊ว',
      'เจ๊', 'ป้า', 'ลุง', 'ครัว', 'โภชนา', 'อาหารไทย', 'thai', 'restaurant'
    ],
    defaultFoodIds: ['krapao-crispy-pork', 'krapao-minced-pork', 'fried-rice-crab', 'pad-kana-moo-krob', 'pad-thai', 'omelette-rice', 'garlic-pork'],
    defaultPrice: '฿',
  },
]

/**
 * อนุมานเมนูและข้อมูลของร้านอาหารจากข้อมูลจริงของ OpenStreetMap / Google Places
 */
export function inferRestaurantMenus(rawPlace) {
  const name = (rawPlace.name || rawPlace['name:th'] || rawPlace['name:en'] || 'ร้านอาหาร').trim()
  const cuisine = (rawPlace.cuisine || '').toLowerCase()
  const amenity = (rawPlace.amenity || '').toLowerCase()
  const brand = (rawPlace.brand || '').toLowerCase()
  const shop = (rawPlace.shop || '').toLowerCase()

  const combinedSearchText = `${name} ${cuisine} ${amenity} ${brand} ${shop}`.toLowerCase()

  // 1. ตรวจสอบการจับคู่หมวดหมู่
  let matchedRule = null
  for (const rule of CATEGORY_RULES) {
    const isMatched = rule.matchers.some((matcher) => combinedSearchText.includes(matcher.toLowerCase()))
    if (isMatched) {
      matchedRule = rule
      break
    }
  }

  // หากไม่ตรงกับอะไรเลย ให้จัดเป็นอาหารตามสั่ง/จานเดียวทั่วไป
  if (!matchedRule) {
    if (amenity === 'cafe') {
      matchedRule = CATEGORY_RULES.find((r) => r.category === 'cafe-dessert')
    } else if (amenity === 'fast_food') {
      matchedRule = CATEGORY_RULES.find((r) => r.category === 'fastfood-western')
    } else {
      matchedRule = CATEGORY_RULES.find((r) => r.category === 'ala-carte')
    }
  }

  // 2. ค้นหาเมนูอาหารเฉพาะเจาะจงจาก Keywords ในคลัง
  const specificMatchedFoods = foodCatalog.filter((food) => {
    return food.keywords.some((kw) => combinedSearchText.includes(kw.toLowerCase()))
  })

  // 3. รวมเมนูเฉพาะเจาะจงกับเมนูพื้นฐานของหมวดนั้นๆ
  const menuSet = new Map()
  
  // ใส่เมนูที่ตรงกับคีย์เวิร์ดเฉพาะก่อน
  for (const food of specificMatchedFoods) {
    menuSet.set(food.id, food)
  }

  // เติมเมนูพื้นฐานของหมวดหมู่ให้ครบอย่างน้อย 3-5 รายการ
  const categoryFoods = foodCatalog.filter((f) => f.category === matchedRule.category)
  for (const food of categoryFoods) {
    if (menuSet.size >= 5) break
    menuSet.set(food.id, food)
  }

  // ถ้ายังน้อยเกินไป เติมจาก default list
  if (menuSet.size < 3) {
    for (const foodId of matchedRule.defaultFoodIds) {
      const food = foodCatalog.find((f) => f.id === foodId)
      if (food) menuSet.set(food.id, food)
      if (menuSet.size >= 4) break
    }
  }

  const menuItems = Array.from(menuSet.values())

  // กำหนดช่วงราคา
  let price = matchedRule.defaultPrice
  if (combinedSearchText.includes('buffet') || combinedSearchText.includes('บุฟเฟต์') || combinedSearchText.includes('wagy') || combinedSearchText.includes('seafood')) {
    price = '฿฿฿'
  } else if (combinedSearchText.includes('starbucks') || combinedSearchText.includes('steak') || combinedSearchText.includes('sushi')) {
    price = '฿฿'
  }

  // จัดการเวลาเปิดทำการ (ถ้ามีแท็ก opening_hours ใน OSM)
  let openHours = rawPlace.opening_hours || 'เปิดบริการทุกวัน'
  if (openHours.length > 30) {
    openHours = openHours.slice(0, 28) + '…'
  }

  return {
    category: matchedRule.category,
    categoryBadge: matchedRule.badge,
    menuItems,
    menuIds: menuItems.map((m) => m.id),
    price,
    openHours,
  }
}
