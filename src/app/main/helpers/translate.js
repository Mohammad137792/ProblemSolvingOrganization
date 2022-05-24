/**
 * @author Farbod Shams <farbodshams.2000@gmail.com>
 * This function searches for a equivalent word in dict constant and returns the translation if the equivalent word is
 * existed in dict constant or returns the argument with no changed otherwise. feel free to add some other words to dict
 */

const dict = {
    distributor: "توزیع کننده",
    supplier: "تامین کننده",
    manufacturer: "تولید کننده",
    serviceProvider: "خدمات فنی مهندسی",
    railParzadSeir: "ریل پرداز سیر",
    noAfarin: "نو آفرین",
    duta: "کترینگ دوتا",
    documentProducer: "تهیه مستندات",
    meetingOrganizer: "برگزاری جلسات",
    reportToManager: "گزارش به مدیریت",
    marketingManager: "مدیریت بازرگانی",
    highLoadPressure: "بار کاری زیاد",
    contractDisagreement: "عدم توافق سر قرارداد",
    illness: "بیماری",
    retired: "بازنشستگی",
    Theme: "تم",
    Layout: "چیدمان",
    "Theme Settings": "تنظیمات تم",
    "Not all option combinations are available": "استفاده همزمان از تمامی تنظیمات ممکن است برای برخی تم ها ممکن نباشد.",
    "Custom Scrollbars": "استفاده از نوار اسکرول مخصوص",
    Main: "اصلی",
    Navbar: "منو",
    Toolbar: "نوار ابزار",
    Footer: "پاورقی",
    Style: "حالت نمایش",
    ADMIN: 'مدیر',
}

const translate = data => dict[data] ? dict[data] : data;

export default translate;