# ⚡ Quick Start - 5 Minutes to First Design

**הדרך המהירה ביותר להתחיל להשתמש בהרחבה**

---

## 📦 התקנה (פעם אחת)

### שלב 1: טען את ההרחבה בChrome (30 שניות)

```bash
# 1. פתח Chrome וגש ל:
chrome://extensions/

# 2. הפעל "Developer mode" (מתג בפינה ימנית עליונה)

# 3. לחץ "Load unpacked"

# 4. בחר את התיקייה:
/Users/tzoharlary/FigmaFirstTryChromeExtention

# 5. ההרחבה תופיע בסרגל הכלים 🌐
```

### שלב 2: טען את הפלאגין בFigma (30 שניות)

```bash
# 1. פתח Figma Desktop (לא דפדפן!)

# 2. לחץ: Plugins → Development → Import plugin from manifest...

# 3. בחר את הקובץ:
/Users/tzoharlary/FigmaFirstTryChromeExtention/figma-plugin/manifest.json

# 4. הפלאגין מותקן ✓
```

---

## 🎬 שימוש (30 שניות)

### תרחיש: חילוץ example.com

```bash
# 1. פתח Chrome וגש ל:
https://example.com

# 2. לחץ על אייקון ההרחבה 🌐

# 3. לחץ "Extract Page"
# ⏱️ המתן 1-2 שניות...
# ✅ "Extraction complete! JSON copied to clipboard"

# 4. פתח Figma Desktop

# 5. הרץ: Plugins → Development → HTML to Figma

# 6. הJSON כבר מודבק! לחץ "Create Design"
# ⏱️ המתן 2-3 שניות...
# ✅ העיצוב נוצר על הקנבס!
```

---

## 🎯 מה קיבלת?

על הקנבס בFigma תראה:

```
Layers Panel                    Canvas
───────────────────────────────────────────────────
📐 example.com                  ┌─────────────────┐
   📝 Example Domain            │  Example Domain │
   📝 This domain is for...     │  ───────────── │
   🔘 More information...       │  This domain... │
                                │                 │
                                │  [More info...] │
                                └─────────────────┘
```

**עכשיו אתה יכול:**
- ✏️ לערוך טקסטים
- 🎨 לשנות צבעים
- 📐 לשנות גדלים
- 📤 לייצא (PNG, SVG, PDF)

---

## 🚀 אתרים מומלצים לניסיון

| אתר | זמן | מורכבות | תוצאה |
|-----|-----|---------|--------|
| [example.com](https://example.com) | 1-2s | ⭐ פשוט | מושלם ללמידה |
| [GitHub Profile](https://github.com) | 2-4s | ⭐⭐ בינוני | טוב לניסוי |
| [Amazon Product](https://amazon.com) | 5-10s | ⭐⭐⭐ מורכב | מתקדם |

---

## ❌ פתרון בעיות מהיר

### ההרחבה לא עובדת?
```bash
# רענן את ההרחבה:
chrome://extensions/ → מצא את ההרחבה → 🔄 Reload

# בדוק Developer mode מופעל
```

### הפלאגין לא עובד?
```bash
# ודא שאתה ב-Figma Desktop (לא דפדפן!)
# בנה את הפלאגין:
cd /Users/tzoharlary/FigmaFirstTryChromeExtention/figma-plugin
npm install
npm run build
```

### JSON לא הועתק?
```bash
# העתק ידנית:
# 1. בpopup של ההרחבה, תראה את הJSON
# 2. סמן הכל (Cmd+A), העתק (Cmd+C)
# 3. הדבק בFigma (Cmd+V)
```

---

## 📖 מדריכים מפורטים

- **🎨 [מדריך ויזואלי מלא](./docs/QUICK_START_VISUAL_GUIDE.md)** - עם צילומי מסך ממוספרים
- **📚 [מדריך משתמש](./docs/USER_MANUAL.md)** - כל התיעוד
- **👨‍💻 [מדריך מפתח](./docs/DEVELOPER_GUIDE.md)** - טכני

---

## 🎉 זהו! אתה מוכן

**במשך 5 דקות למדת:**
- ✅ להתקין את ההרחבה והפלאגין
- ✅ לחלץ אתרים
- ✅ ליצור עיצובים בFigma
- ✅ לפתור בעיות בסיסיות

**עכשיו נסה בעצמך! 🚀**

```bash
# דוגמה מהירה:
1. פתח https://example.com
2. לחץ על ההרחבה → Extract Page
3. פתח Figma → Plugins → HTML to Figma
4. לחץ Create Design
5. הצלחת! 🎊
```
