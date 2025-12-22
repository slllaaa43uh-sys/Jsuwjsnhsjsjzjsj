
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Language = 'ar' | 'en';
type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: Direction;
  translationTarget: string;
  setTranslationTarget: (code: string) => void;
}

const translations = {
  ar: {
    // App
    app_name: "مهنتي لي",
    
    // Feature Pending
    feature_coming_soon: "هذه الميزة قيد التطوير وستتوفر في التحديث القادم بإذن الله.",

    // Login & Register
    login_title: "تسجيل الدخول",
    login_subtitle: "مرحباً بك مجدداً",
    email_label: "البريد الإلكتروني",
    password_label: "كلمة المرور",
    login_button: "دخول",
    create_new_account: "إنشاء حساب جديد",
    forgot_password: "نسيت كلمة المرور؟",
    email_placeholder: "name@example.com",
    logging_in: "جاري تسجيل الدخول...",
    
    // Register Flow
    register_title: "إنشاء حساب جديد",
    register_subtitle: "أكمل بياناتك",
    register_choose_type: "اختر نوع الحساب للمتابعة:",
    register_individual_title: "تسجيل دخول فردي",
    register_individual_desc: "حساب شخصي للمستخدمين",
    register_commercial_title: "تسجيل دخول تجاري",
    register_commercial_desc: "حساب تجاري للشركات",
    register_name_placeholder: "اسمك الكامل",
    register_company_name_placeholder: "اسم الشركة",
    confirm_password: "تأكيد كلمة المرور",
    i_agree_to: "أوافق على",
    privacy_policy_link: "سياسة الخصوصية",
    register_button: "إنشاء حساب",
    registering: "جاري الإنشاء...",
    back: "عودة",
    privacy_error_msg: "الرجاء الموافقة على سياسة الخصوصية للمتابعة",

    // Navigation
    nav_home: "الرئيسية",
    nav_jobs: "وظائف",
    nav_shorts: "شورتس",
    nav_haraj: "حراج",
    
    // Actions
    like: "أعجبني",
    liked: "أعجبني",
    comment: "تعليق",
    share: "مشاركة",
    follow: "متابعة",
    unfollow: "إلغاء المتابعة",
    following: "تتابعه",
    reply: "رد",
    delete: "حذف",
    edit: "تعديل",
    report: "إبلاغ",
    copy: "نسخ",
    copy_link: "نسخ الرابط",
    copy_text: "نسخ النص",
    download: "تنزيل",
    repost: "إعادة نشر",
    write_thought: "اكتب أفكارك حول هذا...",
    repost_button: "نشر الآن",
    undo_repost: "إلغاء المشاركة",
    cancel: "إلغاء",
    confirm: "تأكيد",
    view_replies: "عرض الردود",
    hide_replies: "إخفاء الردود",
    send: "إرسال",
    view_all: "عرض الكل",
    views: "مشاهدة",
    follow_back: "رد المتابعة",
    mark_all_read: "تحديد الكل كمقروء",
    repost_no_comment_confirm: "هل تريد إعادة النشر بدون كتابة أي تعليق؟",
    repost_success: "تمت إعادة النشر بنجاح!",
    repost_fail: "فشل إعادة النشر",
    repost_error: "حدث خطأ أثناء إعادة النشر",
    delete_success: "تم الحذف بنجاح",
    delete_fail: "فشل في الحذف",
    done: "تم",
    retry: "إعادة محاولة",
    comments_disabled_creator: "التعليقات معطلة من قبل المنشئ",
    downloads_disabled_creator: "التنزيل معطل من قبل المنشئ",
    repost_disabled_creator: "إعادة النشر معطلة من قبل المنشئ",
    
    // Translation
    translate_post: "ترجمة المنشور",
    show_original: "عرض النص الأصلي",
    translating: "جاري الترجمة...",
    translation_settings: "إعدادات الترجمة",
    source_lang: "لغة المنشور (الأصلية)",
    target_lang: "اللغة المستهدفة للترجمة",
    lang_ar: "العربية",
    lang_en: "English",
    lang_bn: "বাংলা",
    lang_ur: "اردو",
    lang_ne: "नेपाली",
    lang_hi: "हिन्दी",
    lang_sw: "Kiswahili",
    lang_am: "አማርኛ",
    lang_so: "Soomaali",
    lang_tr: "Türkçe",
    lang_ti: "ትግርኛ",
    save: "حفظ",
    
    // Stories
    create_story: "إنشاء قصة",
    your_story: "قصتك",
    story_viewers: "المشاهدات",
    story_limit_title: "عذراً يا غالي",
    story_limit_desc: "لقد قمت بإضافة قصة بالفعل.\nحالياً النظام يسمح بقصة واحدة نشطة لكل مستخدم (حتى مدة دقيقتين) للحفاظ على جودة الخدمة.",
    story_limit_hint: "سيتم تطوير الميزة لإتاحة المزيد قريباً!",
    story_no_viewers: "لا توجد مشاهدات بعد",
    story_text_placeholder: "انقر للكتابة...",
    story_media_placeholder: "اضغط لاختيار صورة أو فيديو",
    story_font_size: "حجم",
    story_type_text: "نص",
    story_type_media: "ميديا",
    story_upload_fail: "فشل نشر القصة",
    story_upload_error: "حدث خطأ أثناء النشر",
    
    // Suggestions
    suggested_companies: "شركات مقترحة",
    suggested_people: "أشخاص قد تعرفهم",
    
    // Posts & Feed
    post_header_create: "بم تفكر يا",
    post_placeholder: "اكتب شيئاً...",
    reply_placeholder: "اكتب رداً...",
    replying_to: "الرد على",
    post_publish: "نشر",
    post_next: "التالي",
    post_location: "الموقع",
    post_category: "التصنيف",
    post_media: "صور/فيديو",
    post_settings: "إعدادات المنشور",
    post_premium: "مُميز",
    post_delete_confirm: "هل أنت متأكد من رغبتك في حذف هذا المنشور؟",
    post_hide: "إخفاء المنشور",
    post_report_success: "تم إرسال البلاغ للإدارة",
    no_posts_home: "لا توجد منشورات حالياً",
    be_first_post: "كن أول من ينشر!",
    no_more_posts: "لا توجد منشورات أخرى",
    post_add_to: "إضافة إلى منشورك",
    no_comments: "لا توجد تعليقات",
    no_replies: "لا توجد ردود",
    post_details_title: "تفاصيل المنشور",
    
    // Shorts
    shorts_for_you: "لك",
    shorts_haraj: "حراج",
    shorts_jobs: "وظائف",
    shorts_friends: "الأصدقاء",
    shorts_empty: "لا توجد فيديوهات قصيرة حالياً",
    
    // Video Creation & Publishing
    camera_access_required: "الوصول إلى الكاميرا مطلوب",
    camera_access_desc: "يرجى السماح بالوصول إلى الكاميرا والميكروفون لمتابعة تسجيل الفيديو.",
    recording: "جاري التسجيل",
    type_something: "اكتب شيئاً...",
    text_size: "حجم النص",
    publish_video: "نشر الفيديو",
    publishing: "جاري النشر...",
    select_cover: "اختر غلاف",
    video_title_placeholder: "اكتب عنواناً للفيديو...",
    video_desc_placeholder: "أضف وصفاً واشتاقات #...",
    who_can_watch: "من يمكنه المشاهدة",
    privacy_public: "الجميع",
    privacy_public_desc: "يمكن لأي شخص مشاهدة الفيديو",
    privacy_friends: "الأصدقاء",
    privacy_friends_desc: "فقط المتابعين الذين تتابعهم",
    privacy_private: "أنا فقط",
    privacy_private_desc: "لن يظهر الفيديو لأي شخص آخر",
    allow_comments: "السماح بالتعليقات",
    allow_downloads: "السماح بالتنزيلات",
    allow_duet: "السماح بإعادة النشر",
    select_category: "اختر التصنيف",

    // Upload Status
    post_publishing: "جاري نشر منشورك...",
    post_success: "تم نشر المنشور بنجاح",
    post_pending_desc: "يرجى الانتظار، يتم الرفع في الخلفية",
    video_preparing: "جاري التحضير...",
    video_uploading: "جاري النشر...",
    video_success: "تم النشر بنجاح",
    video_wait: "يرجى الانتظار",
    video_dont_close: "لا تغلق التطبيق",
    video_watch_now: "يمكنك المشاهدة الآن",

    // Profile
    profile_posts: "منشور",
    profile_followers: "متابع",
    profile_following: "يتابع",
    profile_about: "حول",
    profile_photos: "الصور",
    profile_videos: "فيديو",
    profile_edit: "تعديل الملف",
    profile_bio: "نبذة",
    profile_name: "الاسم",
    profile_phone: "الهاتف",
    profile_website: "الموقع الإلكتروني",
    profile_no_posts: "لا توجد منشورات حتى الآن",
    add_new_section: "إضافة قسم جديد",
    section_title_label: "عنوان القسم",
    section_content_label: "محتوى القسم",
    add_bio: "أضف نبذة تعريفية",
    edit_field_title: "تعديل",
    account_delete_option: "حذف الحساب",
    delete_account_confirm_title: "هل أنت متأكد؟",
    delete_account_confirm_msg: "سيتم حذف حسابك إلى الأبد ولن تتمكن من استرجاع حسابك أبداً. جميع منشوراتك وبياناتك سيتم حذفها نهائياً.",
    delete_account_btn: "حذف الحساب نهائياً",
    account_deleted_success: "تم حذف حسابك بنجاح",
    account_delete_fail: "فشل حذف الحساب",
    error_occurred: "حدث خطأ",
    
    // Settings
    settings_title: "الإعدادات",
    settings_subscriptions: "الاشتراكات",
    settings_language: "اللغة",
    settings_dark_mode: "الوضع الليلي",
    settings_warnings: "إرشادات الأمان",
    settings_privacy: "سياسة الخصوصية",
    settings_report: "الإبلاغ عن مشكلة",
    settings_about: "حول التطبيق",
    settings_warning_notifs: "إشعارات التحذيرات",
    settings_control_panel: "قائمة التحكم",
    
    // Security Warnings (Updated)
    warning_intro: "سلامتك وأمانك هما أولويتنا. يرجى اتباع الإرشادات التالية لحماية نفسك:",
    warning_job_title: "احتيال التوظيف",
    warning_job_desc: "لا تقم أبداً بدفع أي مبالغ مالية مقابل التقديم لوظيفة، تأمين تأشيرة، أو حجز موعد مقابلة. أصحاب العمل الحقيقيون لا يطلبون رسوماً من المتقدمين.",
    warning_payment_title: "التعاملات المالية",
    warning_payment_desc: "تجنب تحويل الأموال مسبقاً للبائعين غير الموثوقين. في تعاملات البيع والشراء (الحراج)، احرص على اللقاء وجهاً لوجه في مكان عام والدفع عند الاستلام.",
    warning_data_title: "البيانات الشخصية",
    warning_data_desc: "لا تشارك صور هويتك، جواز سفرك، أو تفاصيل حسابك البنكي عبر المحادثات الخاصة مع أي شخص لا تثق به تماماً.",
    warning_links_title: "الروابط المشبوهة",
    warning_links_desc: "احذر من الضغط على الروابط المجهولة التي قد تصلك في الرسائل، فقد تكون محاولات تصيد لسرقة بياناتك.",

    // Wallet
    wallet_balance: "الرصيد الحالي",
    wallet_currency: "عملة",
    wallet_buy: "شراء عملات",
    wallet_gold: "عملة ذهبية",
    
    // Notifications
    notif_like_post: "أعجب بمنشورك",
    notif_comment_post: "علق على منشورك",
    notif_reply_post: "رد على تعليقك",
    notif_follow: "بدأ في متابعتك",
    notif_like_short: "أعجب بالفيديو الخاص بك",
    notif_comment_short: "علق على الفيديو الخاص بك",
    notif_comment_like: "أعجب بتعليقك",
    notif_reply_like: "أعجب بردك",
    notif_short_comment_like: "أعجب بتعليقك في الفيديو",
    notif_short_reply_like: "أعجب بردك في الفيديو",
    notif_short_reply: "رد على تعليقك في الفيديو",
    notif_empty: "لا توجد إشعارات حالياً",
    notif_general: "إشعار جديد",
    notif_menu_delete: "حذف الإشعار",
    notif_menu_read: "وضع كمقروء",
    notif_delete_title: "حذف الإشعار؟",
    notif_delete_msg: "هل أنت متأكد من رغبتك في حذف هذا الإشعار؟",
    
    // General
    close: "إغلاق",
    understood: "فهمت ذلك",
    submit: "إرسال",
    sending: "جاري الإرسال...",
    logout: "تسجيل الخروج",
    logout_confirm: "هل أنت متأكد من رغبتك في تسجيل الخروج؟",
    yes: "نعم",
    no: "لا",
    loading: "جاري التحميل...",
    location_general: "عام",
    location_all_cities: "كل المدن",
    all_cities: "كل المدن",
    location_select_country: "اختر الدولة",
    location_select_city: "اختر المدينة",
    location_select_city_opt: "اختر المدينة (اختياري)",
    location_cities_in: "مدن",
    contact_header: "طرق التواصل",
    start_contact: "بدء التواصل",
    
    // Welcome Screen
    welcome_title: "مرحباً بك في مهنتي لي",
    welcome_body: "تم إعداد حسابك بنجاح. يمكنك الآن تصفح الوظائف، التواصل مع أصحاب العمل، واستكشاف الفرص المتاحة في السوق.",
    welcome_footer: "نتمنى لك تجربة ممتعة ومفيدة.",
    start_using: "ابدأ الاستخدام",
    
    // Report Modal
    report_post_title: "الإبلاغ عن المنشور",
    report_comment_title: "الإبلاغ عن التعليق",
    report_reply_title: "الإبلاغ عن الرد",
    report_video_title: "الإبلاغ عن الفيديو",
    report_problem_title: "الإبلاغ عن مشكلة",
    report_content_owner: "صاحب المحتوى",
    report_hint: "ساعدنا في الحفاظ على مجتمع آمن. يرجى وصف المشكلة بدقة وسيتم مراجعة البلاغ من قبل الإدارة.",
    report_reason_label: "سبب الإبلاغ",
    report_placeholder_detail: "اكتب تفاصيل المشكلة هنا...",
    report_submit_button: "إرسال البلاغ",
    
    // Report (Settings)
    report_desc: "يرجى وصف المشكلة التي تواجهها بالتفصيل.",
    report_placeholder: "اكتب هنا...",
    report_success: "تم إرسال بلاغك بنجاح.",
    
    // Warning Modal
    warning_empty_title: "لا توجد تحذيرات حاليا",
    warning_empty_desc: "سجلك نظيف تماماً.",
    
    // About
    about_desc: "مهنتي لي هي منصة اجتماعية احترافية تهدف إلى ربط المجتمعات العربية بشكل آمن وفعال. نحن ملتزمون بتوفير بيئة موثوقة لجميع مستخدمينا مع الحفاظ على خصوصيتهم.",
    about_version: "إصدار توافق المتاجر 1.0.0",
    
    // Privacy
    privacy_title: "التزامنا بحماية بياناتك",
    privacy_desc: "1. **لا نجمع بياناتك الشخصية:** نحن نؤمن بأن خصوصيتك حق أساسي. تطبيق 'مهنتي لي' مصمم على أساس عدم جمع أو تخزين أي معلومات شخصية تعريفية عنك. نحن لا نتبع نشاطك، لا نبيع بياناتك، ولا نشاركها مع أي طرف ثالث على الإطلاق.\n\n2. **ما الذي نعنيه بـ 'عدم الجمع'؟** هذا يعني أننا لا نسجل محادثاتك الخاصة، لا نحلل اهتماماتك لبيعها للمعلنين، ولا نجمع بيانات موقعك في الخلفية. المعلومات التي تخزن لدينا هي فقط بيانات حسابك الأساسية (الاسم، البريد الإلكتروني المشفر، وكلمة المرور المشفرة) اللازمة لتسجيل دخولك.\n\n3. **مسؤولية المستخدم:** المحتوى الذي تقوم بنشره بشكل عام (المنشورات، التعليقات، الفيديوهات) يكون متاحاً للآخرين حسب نطاق النشر الذي تحدده. كن حذراً بشأن المعلومات التي تشاركها في منشوراتك العامة.\n\n4. **آلية الإبلاغ:** لضمان بيئة آمنة، نعتمد على مجتمعنا. إذا لم يرد عليك صاحب عمل أو منشور بعد فترة معقولة، أو إذا لاحظت أي سلوك مشبوه أو احتيالي، يرجى استخدام خيار 'الإبلاغ' فوراً. فريقنا سيقوم بمراجعة الحساب واتخاذ الإجراءات اللازمة.\n\n5. **أمان الحساب:** يتم تشفير كلمة المرور الخاصة بك وتخزينها بشكل آمن. لا يمكن لأي شخص، بما في ذلك فريقنا، الاطلاع عليها. نوصي باستخدام كلمة مرور قوية وفريدة.\n\n6. **خصوصية الأطفال:** منصتنا مخصصة للمستخدمين فوق سن 18 عاماً. نحن لا نجمع بيانات من الأطفال عن قصد.\n\n7. **تحديثات السياسة:** قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سيتم إعلامك بأي تغييرات جوهرية. استمرارك في استخدام التطبيق يعني موافقتك على السياسة المحدثة.",

    // Jobs View
    jobs_employer: "أبحث عن موظفين",
    jobs_seeker: "أبحث عن وظيفة",
    jobs_subtitle: "ابحث عن عمل أو موظفين",
    jobs_empty: "لا توجد وظائف حالياً",
    be_first_to_post: "كن أول من ينشر منشور في",

    // New Translations for Job Creation
    job_type_title: "نوع الإعلان",
    job_type_hiring: "أبحث عن موظفين",
    job_type_seeking: "أبحث عن عمل",
    scope_visibility: "نطاق الظهور",
    scope_home_category: "الرئيسية والقسم",
    scope_home_desc: "يظهر للجميع (موصى به)",
    scope_category_only: "القسم فقط",
    scope_category_desc: "يظهر للمهتمين فقط",
    scope_label: "نطاق النشر",
    scope_global: "عالمي",
    scope_local: "محلي",
    visibility_public: "عام",
    contact_info_title: "معلومات التواصل",
    contact_phone_placeholder: "رقم الهاتف (اختياري)",
    contact_email_placeholder: "البريد الإلكتروني (اختياري)",
    contact_method_whatsapp: "واتساب",
    contact_method_call: "اتصال",
    contact_method_email: "بريد",
    premium_subtitle: "ظهور أعلى وأكثر تميزاً",

    // Status Badges
    status_hired: "تم التوظيف",
    status_negotiating: "قيد المفاوضة",
    status_mark_hired: 'تعيين كـ "تم التوظيف"',
    status_mark_negotiating: 'تعيين كـ "قيد المفاوضة"',
    status_reopen: "إعادة فتح",

    // Haraj View
    haraj_latest_offers: "أحدث العروض المضافة",
    haraj_subtitle: "بيع وشراء بكل سهولة",
    haraj_empty: "لا توجد عروض حالياً",
    end_of_results: "نهاية النتائج في",
    
    // Dynamic Titles Mapping (Exact Strings from Backend)
    "ابحث عن وظيفة": "أبحث عن وظيفة",
    "أبحث عن وظيفة": "أبحث عن وظيفة",
    "ابحث عن موظفين": "أبحث عن موظفين",
    "أبحث عن موظفين": "أبحث عن موظفين",
    "تم التوظيف": "تم التوظيف",
    "قيد المفاوضة": "قيد المفاوضة",

    // Custom Job Translations
    "سائق خاص": "سائق"
  },
  en: {
    // App
    app_name: "MyJob",
    
    // Feature Pending
    feature_coming_soon: "This feature is currently under development and will be available in the next update.",

    // Login & Register
    login_title: "Login",
    login_subtitle: "Welcome back",
    email_label: "Email",
    password_label: "Password",
    login_button: "Login",
    create_new_account: "Create new account",
    forgot_password: "Forgot password?",
    email_placeholder: "name@example.com",
    logging_in: "Logging in...",

    // Register Flow
    register_title: "Create New Account",
    register_subtitle: "Complete your data",
    register_choose_type: "Choose account type to continue:",
    register_individual_title: "Individual Account",
    register_individual_desc: "Personal account for users",
    register_commercial_title: "Commercial Account",
    register_commercial_desc: "Business account for companies",
    register_name_placeholder: "Full Name",
    register_company_name_placeholder: "Company Name",
    confirm_password: "Confirm Password",
    i_agree_to: "I agree to",
    privacy_policy_link: "Privacy Policy",
    register_button: "Register",
    registering: "Registering...",
    back: "Back",
    privacy_error_msg: "Please agree to the privacy policy to continue",

    // Navigation
    nav_home: "Home",
    nav_jobs: "Jobs",
    nav_shorts: "Shorts",
    nav_haraj: "Marketplace",
    
    // Actions
    like: "Like",
    liked: "Liked",
    comment: "Comment",
    share: "Share",
    follow: "Follow",
    unfollow: "Unfollow",
    following: "Following",
    reply: "Reply",
    delete: "Delete",
    edit: "Edit",
    report: "Report",
    copy: "Copy",
    copy_link: "Copy Link",
    copy_text: "Copy Text",
    download: "Download",
    repost: "Repost",
    write_thought: "Write a thought...",
    repost_button: "Post",
    undo_repost: "Undo Repost",
    cancel: "Cancel",
    confirm: "Confirm",
    view_replies: "View Replies",
    hide_replies: "Hide Replies",
    send: "Send",
    view_all: "View All",
    views: "Views",
    follow_back: "Follow Back",
    mark_all_read: "Mark all as read",
    repost_no_comment_confirm: "Do you want to repost without a comment?",
    repost_success: "Reposted successfully!",
    repost_fail: "Repost failed",
    repost_error: "An error occurred while reposting",
    delete_success: "Deleted successfully",
    delete_fail: "Failed to delete",
    done: "Done",
    retry: "Retry",
    comments_disabled_creator: "Comments disabled by creator",
    downloads_disabled_creator: "Downloads disabled by creator",
    repost_disabled_creator: "Repost disabled by creator",
    
    // Translation
    translate_post: "Translate",
    show_original: "Show Original",
    translating: "Translating...",
    translation_settings: "Translation Settings",
    source_lang: "Source (Post Language)",
    target_lang: "Target (Translate To)",
    lang_ar: "العربية",
    lang_en: "English",
    lang_bn: "বাংলা",
    lang_ur: "اردو",
    lang_ne: "नेपाली",
    lang_hi: "हिन्दी",
    lang_sw: "Kiswahili",
    lang_am: "አማርኛ",
    lang_so: "Soomaali",
    lang_tr: "Türkçe",
    lang_ti: "ትግርኛ",
    save: "Save",
    
    // Stories
    create_story: "Create Story",
    your_story: "Your Story",
    story_viewers: "Viewers",
    story_limit_title: "Sorry Dear",
    story_limit_desc: "You have already added a story.\nCurrently, the system allows one active story per user (up to 2 minutes) to maintain service quality.",
    story_limit_hint: "This feature will be improved to allow more soon!",
    story_no_viewers: "No views yet",
    story_text_placeholder: "Tap to type...",
    story_media_placeholder: "Tap to select photo or video",
    story_font_size: "Size",
    story_type_text: "Text",
    story_type_media: "Media",
    story_upload_fail: "Failed to post story",
    story_upload_error: "Error occurred while posting",
    
    // Suggestions
    suggested_companies: "Suggested Companies",
    suggested_people: "People You May Know",
    
    // Posts & Feed
    post_header_create: "What's on your mind,",
    post_placeholder: "Type something...",
    reply_placeholder: "Write a reply...",
    replying_to: "Replying to",
    post_publish: "Post",
    post_next: "Next",
    post_location: "Location",
    post_category: "Category",
    post_media: "Photo/Video",
    post_settings: "Post Details",
    post_premium: "Premium",
    post_delete_confirm: "Are you sure you want to delete this post?",
    post_hide: "Hide Post",
    post_report_success: "Report sent to administration",
    no_posts_home: "No posts right now",
    be_first_post: "Be the first to post!",
    no_more_posts: "No more posts",
    post_add_to: "Add to your post",
    no_comments: "No comments",
    no_replies: "No replies",
    post_details_title: "Post Details",
    
    // Shorts
    shorts_for_you: "For You",
    shorts_haraj: "Haraj",
    shorts_jobs: "Jobs",
    shorts_friends: "Friends",
    shorts_empty: "No shorts available right now",
    
    // Video Creation & Publishing
    camera_access_required: "Camera Access Required",
    camera_access_desc: "Please allow access to the camera and microphone to continue recording video.",
    recording: "Recording",
    type_something: "Type something...",
    text_size: "Text Size",
    publish_video: "Publish Video",
    publishing: "Publishing...",
    select_cover: "Select Cover",
    video_title_placeholder: "Write a video title...",
    video_desc_placeholder: "Add description and #hashtags...",
    who_can_watch: "Who can watch",
    privacy_public: "Everyone",
    privacy_public_desc: "Anyone can watch the video",
    privacy_friends: "Friends",
    privacy_friends_desc: "Only followers you follow back",
    privacy_private: "Only Me",
    privacy_private_desc: "Video won't appear to anyone else",
    allow_comments: "Allow Comments",
    allow_downloads: "Allow Downloads",
    allow_duet: "Allow Repost",
    select_category: "Select Category",

    // Upload Status
    post_publishing: "Publishing your post...",
    post_success: "Post published successfully",
    post_pending_desc: "Please wait, uploading in background",
    video_preparing: "Preparing...",
    video_uploading: "Publishing...",
    video_success: "Published successfully",
    video_wait: "Please wait",
    video_dont_close: "Don't close the app",
    video_watch_now: "You can watch now",
    
    // Profile
    profile_posts: "Posts",
    profile_followers: "Followers",
    profile_following: "Following",
    profile_about: "About",
    profile_photos: "Photos",
    profile_videos: "Videos",
    profile_edit: "Edit Profile",
    profile_bio: "Bio",
    profile_name: "Name",
    profile_phone: "Phone",
    profile_website: "Website",
    profile_no_posts: "No posts yet",
    add_new_section: "Add New Section",
    section_title_label: "Section Title",
    section_content_label: "Section Content",
    add_bio: "Add Bio",
    edit_field_title: "Edit",
    account_delete_option: "Delete Account",
    delete_account_confirm_title: "Are you sure?",
    delete_account_confirm_msg: "Your account will be deleted forever and you will never be able to recover it. All your posts and data will be permanently deleted.",
    delete_account_btn: "Delete Account Permanently",
    account_deleted_success: "Account deleted successfully",
    account_delete_fail: "Failed to delete account",
    error_occurred: "An error occurred",
    
    // Settings
    settings_title: "Settings",
    settings_subscriptions: "Subscriptions",
    settings_language: "Language",
    settings_dark_mode: "Dark Mode",
    settings_warnings: "Safety Guidelines",
    settings_privacy: "Privacy Policy",
    settings_report: "Report a Problem",
    settings_about: "About App",
    settings_warning_notifs: "Warning Notifications",
    settings_control_panel: "Control Panel",
    
    // Security Warnings (Updated)
    warning_intro: "Your safety and security are our top priority. Please follow these guidelines to protect yourself:",
    warning_job_title: "Job Scams",
    warning_job_desc: "Never pay any money to apply for a job, secure a visa, or schedule an interview. Legitimate employers never ask for fees from applicants.",
    warning_payment_title: "Financial Transactions",
    warning_payment_desc: "Avoid transferring money in advance to untrusted sellers. For marketplace transactions, meet in person in a public place and pay upon receipt.",
    warning_data_title: "Personal Data",
    warning_data_desc: "Do not share photos of your ID, passport, or bank account details via private messages with anyone you do not fully trust.",
    warning_links_title: "Suspicious Links",
    warning_links_desc: "Be careful not to click on unknown links that may be sent to you in messages, as they may be phishing attempts to steal your data.",

    // Wallet
    wallet_balance: "Current Balance",
    wallet_currency: "Coins",
    wallet_buy: "Buy Coins",
    wallet_gold: "Gold Coin",
    
    // Notifications
    notif_like_post: "liked your post",
    notif_comment_post: "commented on your post",
    notif_reply_post: "replied to your comment",
    notif_follow: "started following you",
    notif_like_short: "liked your video",
    notif_comment_short: "commented on your video",
    notif_comment_like: "liked your comment",
    notif_reply_like: "liked your reply",
    notif_short_comment_like: "liked your comment on the video",
    notif_short_reply_like: "liked your reply on the video",
    notif_short_reply: "replied to your comment on the video",
    notif_empty: "No notifications yet",
    notif_general: "New notification",
    notif_menu_delete: "Delete Notification",
    notif_menu_read: "Mark as read",
    notif_delete_title: "Delete Notification?",
    notif_delete_msg: "Are you sure you want to delete this notification?",
    
    // General
    close: "Close",
    understood: "Understood",
    submit: "Submit",
    sending: "Sending...",
    logout: "Logout",
    logout_confirm: "Are you sure you want to logout?",
    yes: "Yes",
    no: "No",
    loading: "Loading...",
    location_general: "General",
    location_all_cities: "All Cities",
    all_cities: "All Cities",
    location_select_country: "Select Country",
    location_select_city: "Select City",
    location_select_city_opt: "Select City (Optional)",
    location_cities_in: "Cities in",
    contact_header: "Contact Methods",
    start_contact: "Start Contact",
    
    // Welcome Screen
    welcome_title: "Welcome to MyJob",
    welcome_body: "Your account has been successfully set up. You can now browse jobs, connect with employers, and explore opportunities in the market.",
    welcome_footer: "We wish you a pleasant and useful experience.",
    start_using: "Start Using",
    
    // Report Modal
    report_post_title: "Report Post",
    report_comment_title: "Report Comment",
    report_reply_title: "Report Reply",
    report_video_title: "Report Video",
    report_problem_title: "Report Problem",
    report_content_owner: "Content Owner",
    report_hint: "Help us keep the community safe. Please describe the issue accurately and it will be reviewed by administration.",
    report_reason_label: "Reason for reporting",
    report_placeholder_detail: "Write details here...",
    report_submit_button: "Submit Report",
    
    // Report (Settings)
    report_desc: "Please describe the issue you are facing in detail.",
    report_placeholder: "Type here...",
    report_success: "Report sent successfully.",
    
    // Warning Modal
    warning_empty_title: "No warnings currently",
    warning_empty_desc: "Your record is perfectly clean.",
    
    // About
    about_desc: "MyJob is a professional social platform aimed at connecting Arab communities safely and effectively. We are committed to providing a reliable environment for all our users while maintaining their privacy.",
    about_version: "Store Compatible Version 1.0.0",
    
    // Privacy
    privacy_title: "Commitment to Privacy",
    privacy_desc: "1. **We Do Not Collect Your Personal Data:** We believe that your privacy is a fundamental right. The 'MyJob' app is designed on the principle of not collecting or storing any personally identifiable information about you. We do not track your activity, sell your data, or share it with any third party whatsoever.\n\n2. **What Do We Mean by 'No Collection'?** This means we do not record your private conversations, analyze your interests to sell to advertisers, or collect your background location data. The only information we store is your basic account data (name, encrypted email, and encrypted password) necessary for you to log in.\n\n3. **User Responsibility:** The content you post publicly (posts, comments, videos) is available to others according to the scope you set. Be cautious about the information you share in your public posts.\n\n4. **Reporting Mechanism:** To ensure a safe environment, we rely on our community. If a job poster or user does not respond to you after a reasonable time, or if you notice any suspicious or fraudulent behavior, please use the 'Report' option immediately. Our team will review the account and take necessary action.\n\n5. **Account Security:** Your password is encrypted and stored securely. No one, including our team, can view it. We recommend using a strong and unique password.\n\n6. **Children's Privacy:** Our platform is intended for users over the age of 18. We do not knowingly collect data from children.\n\n7. **Policy Updates:** We may update this Privacy Policy from time to time. You will be notified of any material changes. Your continued use of the app signifies your agreement to the updated policy.",

    // Jobs View
    jobs_employer: "Hiring",
    jobs_seeker: "Looking for a Job",
    jobs_subtitle: "Find work or employees",
    jobs_empty: "No jobs available right now",
    be_first_to_post: "Be the first to post in",

    // New Translations for Job Creation
    job_type_title: "Ad Type",
    job_type_hiring: "Hiring",
    job_type_seeking: "Seeking Job",
    scope_visibility: "Visibility",
    scope_home_category: "Home & Category",
    scope_home_desc: "Visible to everyone (Recommended)",
    scope_category_only: "Category Only",
    scope_category_desc: "Visible to interested users only",
    scope_label: "Scope",
    scope_global: "Global",
    scope_local: "Local",
    visibility_public: "Public",
    contact_info_title: "Contact Info",
    contact_phone_placeholder: "Phone (Optional)",
    contact_email_placeholder: "Email (Optional)",
    contact_method_whatsapp: "Whatsapp",
    contact_method_call: "Call",
    contact_method_email: "Email",
    premium_subtitle: "Higher visibility",

    // Status Badges
    status_hired: "Hired",
    status_negotiating: "Negotiating",
    status_mark_hired: "Mark as Hired",
    status_mark_negotiating: "Mark as Negotiating",
    status_reopen: "Re-open",

    // Haraj View
    haraj_latest_offers: "Latest offers added",
    haraj_subtitle: "Buy and sell easily",
    haraj_empty: "No offers available right now",
    end_of_results: "End of results in",

    // Dynamic Titles Mapping (Exact Strings from Backend)
    // Key (Arabic from DB) -> Value (English Translation)
    "ابحث عن وظيفة": "Looking for a job",
    "أبحث عن وظيفة": "Looking for a job",
    "ابحث عن موظفين": "Looking for employees",
    "أبحث عن موظفين": "Looking for employees",
    "تم التوظيف": "Hired",
    "قيد المفاوضة": "Negotiating",

    // Haraj Categories
    "سيارات": "Cars",
    "عقارات": "Real Estate",
    "أجهزة منزلية": "Home Appliances",
    "أثاث ومفروشات": "Furniture",
    "جوالات": "Mobiles",
    "لابتوبات وكمبيوتر": "Laptops & PC",
    "كاميرات وتصوير": "Cameras",
    "ألعاب فيديو": "Video Games",
    "ملابس وموضة": "Fashion",
    "ساعات ومجوهرات": "Watches & Jewelry",
    "حيوانات أليفة": "Pets",
    "طيور": "Birds",
    "معدات ثقيلة": "Heavy Equipment",
    "قطع غيار": "Spare Parts",
    "تحف ومقتنيات": "Antiques",
    "كتب ومجلات": "Books",
    "أدوات رياضية": "Sports Equipment",
    "مستلزمات أطفال": "Baby Items",
    "خيم وتخييم": "Camping",
    "أرقام مميزة": "VIP Numbers",
    "نقل عفش": "Furniture Moving",

    // Job Categories
    "سائق خاص": "Private Driver",
    "حارس أمن": "Security Guard",
    "طباخ": "Chef",
    "محاسب": "Accountant",
    "مهندس مدني": "Civil Engineer",
    "طبيب/ممرض": "Doctor/Nurse",
    "نجار": "Carpenter",
    "كاتب محتوى": "Content Writer",
    "كهربائي": "Electrician",
    "ميكانيكي": "Mechanic",
    "بائع / كاشير": "Sales / Cashier",
    "مبرمج": "Developer",
    "مصمم جرافيك": "Graphic Designer",
    "مترجم": "Translator",
    "مدرس خصوصي": "Tutor",
    "مدير مشاريع": "Project Manager",
    "خدمة عملاء": "Customer Service",
    "مقدم طعام": "Waiter",
    "توصيل": "Delivery",
    "حلاق / خياط": "Barber / Tailor",
    "مزارع": "Farmer",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Safer initialization
    if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem('app_language');
        if (stored === 'en' || stored === 'ar') {
            return stored as Language;
        }
    }
    return 'ar'; // Default fallback
  });

  const [translationTarget, setTranslationTarget] = useState<string>(() => {
      if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem('trans_target_lang') || 'en';
      }
      return 'en';
  });

  const t = (key: string): string => {
    // @ts-ignore
    return translations[language][key] || key;
  };

  const dir: Direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    // Ensure persistence on change
    localStorage.setItem('app_language', language);
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  const updateTranslationTarget = (code: string) => {
      setTranslationTarget(code);
      localStorage.setItem('trans_target_lang', code);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir, translationTarget, setTranslationTarget: updateTranslationTarget }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
