// Google Haritalar kaydından doğrulanmış DİLKON Elazığ verileri
export const business = {
  name: "DİLKON Dil Konuşma ve Rehabilitasyon Merkezi",
  shortName: "DİLKON",
  city: "Elazığ",
  category: "Dil ve Konuşma Terapisi · Rehabilitasyon",
  rating: 4.9,
  reviewCount: 66,
  fiveStarCount: 65,
  address: "Ataşehir, Zeybekler Sk. No:35, 23270 Elazığ Merkez / Elazığ",
  addressShort: "Ataşehir, Zeybekler Sk. No:35 · Elazığ",
  plusCode: "M56G+H6 Elazığ Merkez",
  phone: "0536 404 07 23",
  phoneIntl: "+905364040723",
  instagram: "https://www.instagram.com/dilkonusmaelazig/",
  instagramHandle: "@dilkonusmaelazig",
  lat: 38.6614922,
  lng: 39.1755731,
  placeId: "ChIJtTmv6VjrdkAR8r2k-zH0G0I",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=D%C4%B0LKON%20Dil%20Konu%C5%9Fma%20ve%20Rehabilitasyon%20Merkezi&query_place_id=ChIJtTmv6VjrdkAR8r2k-zH0G0I",
  description:
    "Dilkon Dil ve Konuşma Merkezi, Elazığ'da çocuk ve yetişkinlere yönelik dil ve konuşma terapisi hizmeti sunar. Uzman terapist ekibimiz gecikmiş konuşma, artikülasyon, kekemelik, ses bozukluğu ve dil gelişim geriliği gibi alanlarda bilimsel temelli yaklaşımlar uygular. Her bireyin ihtiyacına özel terapi planlarıyla iletişim becerilerini güçlendirir, aileleri sürece aktif olarak dahil ederiz. Dilkon'da amaç sadece konuşmayı düzeltmek değil, bireyin kendini güvenle ifade etmesini sağlamaktır.",
  // Google Maps "Hakkında" özellikleri
  amenities: [
    "Tekerlekli sandalyeye uygun giriş & park",
    "Erişilebilir oturma düzeni & lavabo",
    "Aileler için emzirme odası",
    "Yüz yüze bireysel terapi seansları",
  ],
  hours: [
    { day: "Pazartesi", idx: 1, open: null, close: null, label: "Kapalı" },
    { day: "Salı", idx: 2, open: 9, close: 17, label: "09:00 – 17:00" },
    { day: "Çarşamba", idx: 3, open: 9, close: 17, label: "09:00 – 17:00" },
    { day: "Perşembe", idx: 4, open: 9, close: 17, label: "09:00 – 17:00" },
    { day: "Cuma", idx: 5, open: 9, close: 17, label: "09:00 – 17:00" },
    { day: "Cumartesi", idx: 6, open: 9, close: 17, label: "09:00 – 17:00" },
    { day: "Pazar", idx: 0, open: null, close: null, label: "Kapalı" },
  ],
};

// Her hizmet gerçek 3D beyin modelindeki ilgili dil/konuşma bölgesine bağlıdır
export const services = [
  {
    code: "01",
    title: "Gecikmiş Konuşma",
    region: "wernicke",
    regionLabel: "WERNICKE · ALICI & İFADE EDİCİ DİL",
    text: "Yaşından beklenen sözcük ve cümle gelişimini göstermeyen çocuklarda oyun temelli, kanıta dayalı ve aile katılımlı erken müdahale programları.",
  },
  {
    code: "02",
    title: "Artikülasyon (Sesletim)",
    region: "motor",
    regionLabel: "MOTOR KORTEKS · KONUŞMA SESLERİ",
    text: "R, S, Ş, K gibi konuşma seslerinin eksik veya hatalı üretilmesini hedefleyen sistematik ses çalışmaları ve günlük konuşmaya kalıcı aktarım.",
  },
  {
    code: "03",
    title: "Kekemelik ve Akıcılık",
    region: "broca",
    regionLabel: "BROCA & ARKUAT YOL · AKICILIK",
    text: "Takılma, tekrar ve blokları yönetmeyi öğreten, konuşma kaygısını azaltıp akıcı iletişimi destekleyen bireyselleştirilmiş akıcılık terapisi.",
  },
  {
    code: "04",
    title: "Ses Bozuklukları",
    region: "brainstem",
    regionLabel: "BEYİN SAPI · FONASYON & SES YOLU",
    text: "Ses kısıklığı, yanlış ses kullanımı, nodül veya zorlanmaya bağlı ses kalitesi sorunlarında vokal hijyen ve bilimsel ses terapisi.",
  },
  {
    code: "05",
    title: "Dil Gelişim Geriliği",
    region: "tracts",
    regionLabel: "SİNİR AĞLARI · DİL BAĞLANTILARI",
    text: "Sözcük dağarcığı, dilbilgisi, anlama ve kendini ifade etme becerilerini bütüncül olarak geliştiren yapılandırılmış bireysel terapi.",
  },
  {
    code: "06",
    title: "Özel Eğitim Desteği",
    region: "cerebellum",
    regionLabel: "SEREBELLUM · ÖĞRENME & KOORDİNASYON",
    text: "Özel gereksinimli bireylerin bilişsel, akademik ve sosyal iletişim becerilerini en üst düzeye taşımayı hedefleyen bireysel eğitim süreci.",
  },
  {
    code: "07",
    title: "Aile Rehberliği ve Ev Programı",
    region: "all",
    regionLabel: "BÜTÜNCÜL YAKLAŞIM · AİLE KATILIMI",
    text: "Seans içi kazanımların ev yaşamına taşınması için düzenli geri bildirim, yazılı ev ödevleri ve ebeveyn danışmanlığı.",
  },
  {
    code: "08",
    title: "Kapsamlı Klinik Değerlendirme",
    region: "broca",
    regionLabel: "KLİNİK HARİTALAMA · ÖLÇÜMLEME",
    text: "Standart değerlendirme araçları ve klinik gözlemle güçlü yönlerin belirlenmesi, kısa ve uzun vadeli terapi hedeflerinin planlanması.",
  },
];

export const processSteps = [
  {
    num: "01",
    tag: "TANIŞMA & ÖYKÜ",
    title: "Ön Görüşme",
    text: "Ailenizle bir araya gelir, gelişim öyküsünü, günlük gözlemlerinizi ve beklentilerinizi sakin bir ortamda dinleriz.",
  },
  {
    num: "02",
    tag: "BİLİMSEL ANALİZ",
    title: "Kapsamlı Değerlendirme",
    text: "Çocuğun veya yetişkinin yaşına uygun standart değerlendirmeler ve oyun/iletişim gözlemleriyle mevcut profili netleştiririz.",
  },
  {
    num: "03",
    tag: "BİREYSEL YOL HARİTASI",
    title: "Kişiye Özel Terapi Planı",
    text: "Her birey için ölçülebilir kısa ve uzun vadeli hedefler, seans sıklığı ve eve yönelik uygulama rehberi oluştururuz.",
  },
  {
    num: "04",
    tag: "KALICI GELİŞİM",
    title: "Terapi, Ev Programı ve Takip",
    text: "Düzenli bireysel seanslar, aile geri bildirimleri ve ilerleme ölçümleriyle konuşmayı kalıcı özgüvene dönüştürürüz.",
  },
];

export const faqs = [
  {
    q: "Çocuğumun dil ve konuşma terapisine ihtiyacı olduğunu nasıl anlarım?",
    a: "24 aylık olmasına karşın anlamlı sözcük üretmeyen, 3 yaşında iki kelimelik ifadeler kurmakta zorlanan, yaşıtlarına göre sesleri belirgin biçimde hatalı söyleyen ya da konuşurken sık takılan çocuklar için uzman değerlendirmesi önerilir. Erken başlanan destek süreci belirgin şekilde hızlandırır.",
  },
  {
    q: "İlk değerlendirme seansında neler yapılır?",
    a: "İlk görüşmede aileden ayrıntılı gelişim öyküsü alınır, ardından danışanla yaşına uygun etkileşimli bir değerlendirme gerçekleştirilir. Görüşme sonunda güçlü yönler, ihtiyaç duyulan alanlar ve önerilen terapi planı açıkça paylaşılır.",
  },
  {
    q: "Terapi süreci ortalama ne kadar sürer?",
    a: "Süre; destek alanına, yaşa, seans düzenine ve aile ile yürütülen ev programına göre kişiden kişiye değişir. Değerlendirme sonrasında somut hedeflerle birlikte öngörülen bir çalışma takvimi sunulur.",
  },
  {
    q: "Yetişkin danışanlara da terapi veriliyor mu?",
    a: "Evet. DİLKON'da çocukların yanı sıra yetişkin bireyler için de kekemelik, artikülasyon (sesletim) ve ses bozuklukları alanlarında bireysel terapi hizmeti verilmektedir.",
  },
  {
    q: "Aileler terapi sürecine nasıl dahil olur?",
    a: "Aile katılımı kalıcı gelişimin temelidir. Her seans sonrasında yapılan çalışmalar aktarılır, günlük hayata kolayca uygulanabilen ev ödevleri ve iletişim önerileri paylaşılır.",
  },
  {
    q: "Randevu ve çalışma saatleriniz nedir?",
    a: "Merkezimiz Salı'dan Cumartesi'ye 09:00 – 17:00 saatleri arasında hizmet verir (Pazartesi ve Pazar kapalıdır). 0536 404 07 23 üzerinden arayarak veya WhatsApp ile yazarak randevu oluşturabilirsiniz.",
  },
];

// Yalnızca 5 yıldızlı doğrulanmış Google Haritalar yorumları (20 adet)
export const reviews = [
  {
    name: "muhammet zorel",
    date: "2 ay önce",
    text: "Alanında deneyimli çalışanlarıyla, Kübra hanımın yiğenimle seanslarından somra yiğenimin kelime konuşmaları arttı süreç güzel ilerliyor devam ediyoruz, çok memnunuz. Dilkona teşekkürler",
  },
  {
    name: "Tolgahan Solmaz",
    date: "4 yıl önce",
    text: "Kübra hocamızdan hep mutlu ayrılıyoruz. İletişimi çok zor oğlumla bile çok güzel bir şekilde diyalog kurdu, bizi de güzel yönlendiriyor aileler olarak. Ev ödevlerimizi yapıyoruz ve ilerlemeleri görüyoruz. 3yaşındaki oğlumun konuşmasında sorun vardı kelime azlığı, bir çok harfin çıkmaması gibi. Henüz bitmedi seanslarımız ama gayet verim alarak ilerliyoruz ☺️",
  },
  {
    name: "hafi güler",
    date: "4 yıl önce",
    text: "Biz kübra hanıma geldiğimiz de oğlum tam 36 aylıktı ve bir kelimesi dahi yoktu. Şuanda oğlum konuşuyor ve eskisi gibi hırçınlık inat vs kalmadı alanında uzman kendisi. Çok memnunuz👍🏻",
  },
  {
    name: "Zeliha ARSLAN",
    date: "2 yıl önce",
    text: "Gerçekten çok kısa sürede mucizeler yaratıyor. İyiki yollarımız sizinle kesişti sayenizde çocuğumun söyleyemediği başta R harfi olmak üzere tüm harfleri söylettiniz. Teşekkür ederiz.",
  },
  {
    name: "Zeynep Kaya",
    date: "4 yıl önce",
    text: "Gerçekten güvenilir bir kurum çocuğunuzu gönül rahatlığıyla emanet edebilirsiniz. İlk günden bu yana kardeşimdeki değişimleri çok rahat görebiliyoruz ayrıca güleryüzleri için de teşekkür ediyorum.",
  },
  {
    name: "Selin Kılıçaslan",
    date: "2 yıl önce",
    text: "Kızım küçükken yaşadığı bi travmadan dolayı konuşmasında sıkıntı çekiyordu Kübra hocamla tanıştık sayesinde bu sorununda üstesinden geldik biz çok memnunuz herkese tavsiye ederim Güleryüz’ünüzden dolayı teşekkürler Kübra hocam 💘👍",
  },
  {
    name: "elif kızıl",
    date: "4 yıl önce",
    text: "Birkaç yere gittim. En profesyonel, hızlı, akılcı, içten ilgilenip çocuğa ulaşan ve aileyi bilgilendiren yer ve kişiydi.",
  },
  {
    name: "Gülsemin YILDIRIM",
    date: "4 yıl önce",
    text: "İşini hakkıyla ve uzman ekiniyle yapan en doğru adres kesinlikle. Aklınızda soru işareti olmadan güvenebilirsiniz.İlgi ve alakası için Dil ve konuşma terapisti Kübra hanıma özellikle teşekkür ederim işini çok iyi bilen ve uygulayan bir kişi",
  },
  {
    name: "Aykut Aydın",
    date: "2 yıl önce",
    text: "Harika bir egitim yeri özveri ile her konuda itina ve titizlikle hizmet veriyor işinin hakkını veriyor elazığdaki tüm kurumlara örnek bir yer elazığ gurur duymalı sonuna kadar desdek olmalı böyle ğüvenilir yerlerin kıymeti bilinmeli..",
  },
  {
    name: "Soner Korkmaz",
    date: "4 yıl önce",
    text: "Mukemmel bir ortam mükemmel bir uzmanimiz var ilk seansda bile oglumun sorunu bile çözdük oglumda cok rahat ve mutlu olduğunu gordum seans icinde iyiki tercih etmisiz",
  },
  {
    name: "GÜLŞEN ULUCAN",
    date: "4 yıl önce",
    text: "Alanında kendini geliştirmiş ve geliştirmekte olan, sıcacık ve yakın tavırları ve özverili çalışması ile tanınmış Ekibi özellikle alanında çok başarılı çocuklar ile iletişimi yüksek bir Dil Konuşma terapistine sahip kurum",
  },
  {
    name: "Esma Aydın",
    date: "4 yıl önce",
    text: "Yeğenimi götürdüm çok güzel ilgileniyorlar tavsi ediyorum herkese kekemelikle ilgili çok güzel düzelmeler oldu biz memnun kaldık  tavsiye ediyorum👍👏",
  },
  {
    name: "Sema Kızılarslan",
    date: "4 yıl önce",
    text: "Uzman personel kadrosu ile, Elazığ’da Özel gereksinimli birey ve ailesine, maksimum düzeyde özel eğitim hizmeti vermeyi amaç edinen, özel eğitim kurumu. Çok memnunuz.",
  },
  {
    name: "Emine Kızılarslan",
    date: "4 yıl önce",
    text: "Bir veli olarak kurumdan çok memnunum. Çocuğum buraya isteyerek geliyor ve gelismesi cok guzel ilerliyor. Öğretmenlerinden çok memnunum.",
  },
  {
    name: "Büşra Arslan",
    date: "2 yıl önce",
    text: "Herkese tavsiye edebileceğim bi merkez biz çok memnun kaldık. Terapi sürecimizde çok ilgili ve alakalılar çok ilerleme kaydettik.",
  },
  {
    name: "Onder Seker",
    date: "4 yıl önce",
    text: "Kaliteli eğitimi, profesyonel eğitimcileri ve aile sıcaklığını hissettiren çalışanları ile çok güvenilir bir kurum kesinlikle tavsiye ediyorum.👍",
  },
  {
    name: "Nida ALTUNGÖK KAYA",
    date: "4 yıl önce",
    text: "Kübra hanım alanında uzman ve gerçekten çok ilgili bi eğitimci Elazığ'ın böyle bi kuruma ihtiyacı vardı.",
  },
  {
    name: "Adem Adam Aydın",
    date: "2 yıl önce",
    text: "Gönül rahatlığıyla gidebileceğiniz bir kurum. Alanında uzman eğitici ve öğreticileriyle 5 yıldızdan fazlasını hak ediyor.",
  },
  {
    name: "Tayfun Aydın",
    date: "2 yıl önce",
    text: "Çok temiz güler yüzlü çözüm odaklı ekibi kaliteli bir okul çocuğunuzu gönül rahatlığıyla getirebilirsiniz.",
  },
  {
    name: "Aleyna Türkmen",
    date: "2 yıl önce",
    text: "Kübra Aydına çok teşekkür ederiz. Çok güler yüzlüler çok memnun kaldık.",
  },
].map((r) => ({ ...r, rating: 5 }));
