# مطالب للذكاء الاصطناعي لتعديل واجهة تطبيق "مهنتي لي"

## ملخص المهمة

المطلوب تعديل صفحتين في تطبيق React/TypeScript:
1. **صفحة البداية (SplashScreen)**
2. **صفحة تسجيل الدخول (LoginPage)**

**الصورة المرجعية:** `assets/images/app-logo.jpg` (صورة الأيقونة الأصلية للتطبيق بألوان أزرق وأخضر متدرج)

---

## المطلب الأول: تعديل صفحة البداية (SplashScreen)

### الملف: `components/SplashScreen.tsx`

### المطلب الكامل للذكاء الاصطناعي:

```
قم بتعديل ملف components/SplashScreen.tsx في مشروع React/TypeScript لتحقيق التالي:

1. أضف صورة الأيقونة الجديدة بدلاً من أيقونة Briefcase من lucide-react:
   - استورد الصورة من '../assets/images/app-logo.jpg'
   - احذف استيراد Briefcase من lucide-react
   - استبدل أيقونة Briefcase بعنصر <img> يعرض الصورة الجديدة

2. تعديل تصميم الأيقونة:
   - احذف خلفية التدرج الأزرق-البنفسجي (bg-gradient-to-tr from-blue-600 to-purple-600)
   - اجعل الحاوية شفافة أو بيضاء
   - اجعل حواف الصورة مربعة مع استدارة خفيفة (rounded-2xl)
   - حافظ على الظل (shadow-xl)

3. الكود المتوقع للجزء المعدل:
   <div className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200 dark:shadow-none mb-4 overflow-hidden bg-white">
     <img src={AppLogo} alt="مهنتي لي" className="w-full h-full object-contain" />
   </div>

4. احتفظ باسم التطبيق "مهنتي لي" وبقية التصميم كما هو.
```

---

## المطلب الثاني: تعديل صفحة تسجيل الدخول (LoginPage)

### الملف: `components/LoginPage.tsx`

### المطلب الكامل للذكاء الاصطناعي:

```
قم بتعديل ملف components/LoginPage.tsx في مشروع React/TypeScript لتحقيق التالي:

1. تغيير ألوان التدرج في الجزء العلوي:
   - ابحث عن: bg-gradient-to-tr from-blue-600 to-purple-600
   - استبدله بـ: bg-gradient-to-br from-blue-600 via-cyan-500 to-green-500
   - هذا التدرج يتناسب مع ألوان الأيقونة الجديدة (أزرق وأخضر)

2. استبدال أيقونة الحقيبة بالأيقونة الجديدة:
   - استورد الصورة: import AppLogo from '../assets/images/app-logo.jpg';
   - احذف استيراد Briefcase إذا لم يعد مستخدماً
   - في قسم "Overlapping Logo"، استبدل:
     <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
       <Briefcase size={36} className="text-white" strokeWidth={2.5} />
     </div>
   - بـ:
     <div className="w-20 h-20 rounded-xl overflow-hidden">
       <img src={AppLogo} alt="مهنتي لي" className="w-full h-full object-contain bg-white" />
     </div>

3. تعديل الحواف البيضاء:
   - الحاوية الخارجية البيضاء (bg-white p-2) يجب أن تبقى كما هي
   - الحواف العلوية تبقى بيضاء
   - الجزء السفلي من الصفحة يبقى أبيض

4. تأكد من أن التدرج الجديد يظهر بشكل صحيح في الجزء العلوي المنحني.
```

---

## المطلب الثالث: تعديل ملف index.html (صفحة البداية الثابتة)

### الملف: `index.html`

### المطلب الكامل للذكاء الاصطناعي:

```
قم بتعديل ملف index.html لتحديث شاشة البداية الثابتة (Static Splash Screen):

1. في قسم "Center Logo" (حوالي السطر 193-205):
   - احذف عنصر SVG الخاص بأيقونة الحقيبة
   - استبدله بعنصر <img> يشير إلى الصورة الجديدة:
     <img src="./assets/images/app-logo.jpg" alt="مهنتي لي" class="w-full h-full object-contain" />

2. عدل الحاوية:
   - احذف: bg-gradient-to-tr from-blue-600 to-purple-600
   - أضف: bg-white
   - احتفظ بـ: rounded-2xl shadow-xl overflow-hidden

3. الكود المتوقع:
   <div class="w-24 h-24 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200 dark:shadow-none mb-4 overflow-hidden bg-white">
     <img src="./assets/images/app-logo.jpg" alt="مهنتي لي" class="w-full h-full object-contain" />
   </div>
```

---

## ملخص الملفات المطلوب تعديلها

| الملف | التعديل المطلوب |
|-------|----------------|
| `components/SplashScreen.tsx` | استبدال أيقونة Briefcase بالصورة الجديدة، إزالة خلفية التدرج |
| `components/LoginPage.tsx` | تغيير ألوان التدرج إلى أزرق-أخضر، استبدال الأيقونة |
| `index.html` | تحديث شاشة البداية الثابتة بالصورة الجديدة |

---

## ملاحظات مهمة

1. **مسار الصورة:** تأكد من وجود الصورة في `assets/images/app-logo.jpg`
2. **ألوان الأيقونة:** الأيقونة الأصلية تحتوي على تدرج من الأزرق الداكن إلى الأخضر الفاتح
3. **الحواف:** يجب أن تكون حواف الصورة مربعة مع استدارة خفيفة (rounded-2xl أو rounded-xl)
4. **التوافق:** تأكد من أن التعديلات تعمل في الوضع الفاتح والداكن (dark mode)

---

## الصورة المرجعية

اسم الملف: `app-logo.jpg`

وصف الصورة: أيقونة تطبيق "مهنتي لي" تحتوي على:
- حرف "م" بالعربية بتصميم عصري
- حقيبة عمل مدمجة في التصميم
- سهم يشير للأعلى يرمز للتطور المهني
- ألوان متدرجة من الأزرق الداكن إلى الأخضر الفاتح
- خلفية بيضاء/فاتحة
