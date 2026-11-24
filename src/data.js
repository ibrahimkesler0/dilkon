// Google Haritalar'daki işletme kaydından alınan bilgiler
export const business = {
  name: "DİLKON Dil Konuşma ve Rehabilitasyon Merkezi",
  rating: 4.9,
  reviewCount: 66,
  address: "Ataşehir, Zeybekler Sk. No:35, 23270 Elazığ Merkez/Elazığ",
  phone: "0536 404 07 23",
  phoneIntl: "+905364040723",
  instagram: "https://www.instagram.com/dilkonusmaelazig/",
  lat: 38.6614922,
  lng: 39.1755731,
  placeId: "ChIJtTmv6VjrdkAR8r2k-zH0G0I",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=D%C4%B0LKON%20Dil%20Konu%C5%9Fma%20ve%20Rehabilitasyon%20Merkezi&query_place_id=ChIJtTmv6VjrdkAR8r2k-zH0G0I",
  // 0 = Pazar ... 6 = Cumartesi
  hours: [
    { day: "Pazartesi", idx: 1, time: null },
    { day: "Salı", idx: 2, time: "09:00 – 17:00" },
    { day: "Çarşamba", idx: 3, time: "09:00 – 17:00" },
    { day: "Perşembe", idx: 4, time: "09:00 – 17:00" },
    { day: "Cuma", idx: 5, time: "09:00 – 17:00" },
    { day: "Cumartesi", idx: 6, time: "09:00 – 17:00" },
    { day: "Pazar", idx: 0, time: null },
  ],
};

export const services = [
  { icon: "🗣️", title: "Gecikmiş Konuşma", text: "Yaşına göre beklenen dil ve konuşma becerilerine ulaşamayan çocuklar için oyun temelli, aile destekli terapi programları.", tint: "rgba(255,122,89,.14)" },
  { icon: "🔤", title: "Artikülasyon (Sesletim)", text: "R, S, K gibi seslerin hatalı ya da eksik üretimine yönelik sistematik ses çalışmaları ve günlük konuşmaya genelleme.", tint: "rgba(37,87,214,.12)" },
  { icon: "🌊", title: "Kekemelik ve Akıcılık", text: "Takılma, uzatma ve blokları azaltan, konuşma özgüvenini artıran kanıta dayalı akıcılık terapisi.", tint: "rgba(25,179,166,.14)" },
  { icon: "🎙️", title: "Ses Bozuklukları", text: "Ses kısıklığı, yanlış ses kullanımı ve ses kalitesindeki sorunlar için ses hijyeni ve terapi çalışmaları.", tint: "rgba(255,198,92,.22)" },
  { icon: "🧩", title: "Dil Gelişim Geriliği", text: "Kelime dağarcığı, cümle kurma, anlama ve ifade etme becerilerini güçlendiren bireysel dil terapisi.", tint: "rgba(155,93,229,.13)" },
  { icon: "🌱", title: "Özel Eğitim", text: "Özel gereksinimli bireylerin akademik, bilişsel ve sosyal becerilerini destekleyen bireysel eğitim programları.", tint: "rgba(25,179,166,.14)" },
  { icon: "👨‍👩‍👧", title: "Aile Rehberliği", text: "Aileleri sürecin aktif bir parçası yapan ev programları, ödevler ve düzenli bilgilendirme görüşmeleri.", tint: "rgba(255,122,89,.14)" },
  { icon: "📋", title: "Değerlendirme ve Raporlama", text: "Standart testler ve klinik gözlemle kapsamlı dil-konuşma değerlendirmesi ve kişiye özel yol haritası.", tint: "rgba(37,87,214,.12)" },
];

export const faqs = [
  { q: "Çocuğumun konuşma terapisine ihtiyacı olduğunu nasıl anlarım?", a: "2 yaşında hiç kelimesi olmayan, 3 yaşında iki kelimelik cümle kuramayan, sesleri yaşıtlarına göre belirgin şekilde hatalı çıkaran veya konuşurken takılan çocuklar için bir uzman değerlendirmesi önerilir. Erken müdahale süreci önemli ölçüde kısaltır." },
  { q: "İlk görüşmede neler oluyor?", a: "İlk görüşmede ailenizle tanışır, gelişim öykünüzü dinler ve çocuğunuzla oyun temelli bir değerlendirme yaparız. Sonrasında güçlü yönleri, ihtiyaçları ve önerilen terapi planını sizinle paylaşırız." },
  { q: "Terapi süreci ne kadar sürer?", a: "Süre; bireyin ihtiyacına, yaşına, seans sıklığına ve ev çalışmalarının düzenine göre değişir. Değerlendirme sonrası kısa ve uzun vadeli hedeflerle birlikte tahmini bir yol haritası sunuyoruz." },
  { q: "Yetişkinlere de hizmet veriyor musunuz?", a: "Evet. Kekemelik, ses bozuklukları ve sesletim sorunları gibi alanlarda yetişkin danışanlarımıza da bireysel terapi hizmeti veriyoruz." },
  { q: "Aile olarak sürece nasıl katılıyoruz?", a: "Aileler terapinin en önemli parçasıdır. Seans sonrası bilgilendirme, ev ödevleri ve günlük yaşama yönelik önerilerle evde de gelişimi destekleyebilmeniz için sizi yönlendiriyoruz." },
  { q: "Randevu nasıl alabilirim?", a: "Bizi telefonla arayabilir ya da WhatsApp üzerinden yazabilirsiniz. Salı–Cumartesi 09:00–17:00 saatleri arasında hizmet veriyoruz." },
];

// Yalnızca 5 yıldızlı Google yorumları
export const reviews = [
  { name: "muhammet zorel", date: "2 ay önce", text: "Alanında deneyimli çalışanlarıyla, Kübra hanımın yiğenimle seanslarından somra yiğenimin kelime konuşmaları arttı süreç güzel ilerliyor devam ediyoruz, çok memnunuz. Dilkona teşekkürler" },
  { name: "Tolgahan Solmaz", date: "4 yıl önce", text: "Kübra hocamızdan hep mutlu ayrılıyoruz. İletişimi çok zor oğlumla bile çok güzel bir şekilde diyalog kurdu, bizi de güzel yönlendiriyor aileler olarak. Ev ödevlerimizi yapıyoruz ve ilerlemeleri görüyoruz. 3yaşındaki oğlumun konuşmasında sorun vardı kelime azlığı, bir çok harfin çıkmaması gibi. Henüz bitmedi seanslarımız ama gayet verim alarak ilerliyoruz ☺️" },
  { name: "hafi güler", date: "4 yıl önce", text: "Biz kübra hanıma geldiğimiz de oğlum tam 36 aylıktı ve bir kelimesi dahi yoktu. Şuanda oğlum konuşuyor ve eskisi gibi hırçınlık inat vs kalmadı alanında uzman kendisi. Çok memnunuz👍🏻" },
  { name: "Zeliha ARSLAN", date: "2 yıl önce", text: "Gerçekten çok kısa sürede mucizeler yaratıyor. İyiki yollarımız sizinle kesişti sayenizde çocuğumun söyleyemediği başta R harfi olmak üzere tüm harfleri söylettiniz. Teşekkür ederiz." },
  { name: "Zeynep Kaya", date: "4 yıl önce", text: "Gerçekten güvenilir bir kurum çocuğunuzu gönül rahatlığıyla emanet edebilirsiniz. İlk günden bu yana kardeşimdeki değişimleri çok rahat görebiliyoruz ayrıca güleryüzleri için de teşekkür ediyorum." },
  { name: "Selin Kılıçaslan", date: "2 yıl önce", text: "Kızım küçükken yaşadığı bi travmadan dolayı konuşmasında sıkıntı çekiyordu Kübra hocamla tanıştık sayesinde bu sorununda üstesinden geldik biz çok memnunuz herkese tavsiye ederim Güleryüz’ünüzden dolayı teşekkürler Kübra hocam 💘👍" },
  { name: "elif kızıl", date: "4 yıl önce", text: "Birkaç yere gittim. En profesyonel, hızlı, akılcı, içten ilgilenip çocuğa ulaşan ve aileyi bilgilendiren yer ve kişiydi." },
  { name: "Gülsemin YILDIRIM", date: "4 yıl önce", text: "İşini hakkıyla ve uzman ekiniyle yapan en doğru adres kesinlikle. Aklınızda soru işareti olmadan güvenebilirsiniz.İlgi ve alakası için Dil ve konuşma terapisti Kübra hanıma özellikle teşekkür ederim işini çok iyi bilen ve uygulayan bir kişi" },
  { name: "Aykut Aydın", date: "2 yıl önce", text: "Harika bir egitim yeri özveri ile her konuda itina ve titizlikle hizmet veriyor işinin hakkını veriyor elazığdaki tüm kurumlara örnek bir yer elazığ gurur duymalı sonuna kadar desdek olmalı böyle ğüvenilir yerlerin kıymeti bilinmeli.." },
  { name: "Soner Korkmaz", date: "4 yıl önce", text: "Mukemmel bir ortam mükemmel bir uzmanimiz var ilk seansda bile oglumun sorunu bile çözdük oglumda cok rahat ve mutlu olduğunu gordum seans icinde iyiki tercih etmisiz" },
  { name: "GÜLŞEN ULUCAN", date: "4 yıl önce", text: "Alanında kendini geliştirmiş ve geliştirmekte olan, sıcacık ve yakın tavırları ve özverili çalışması ile tanınmış Ekibi özellikle alanında çok başarılı çocuklar ile iletişimi yüksek bir Dil Konuşma terapistine sahip kurum" },
  { name: "Esma Aydın", date: "4 yıl önce", text: "Yeğenimi götürdüm çok güzel ilgileniyorlar tavsi ediyorum herkese kekemelikle ilgili çok güzel düzelmeler oldu biz memnun kaldık  tavsiye ediyorum👍👏" },
  { name: "Sema Kızılarslan", date: "4 yıl önce", text: "Uzman personel kadrosu ile, Elazığ’da Özel gereksinimli birey ve ailesine, maksimum düzeyde özel eğitim hizmeti vermeyi amaç edinen, özel eğitim kurumu. Çok memnunuz." },
  { name: "Emine Kızılarslan", date: "4 yıl önce", text: "Bir veli olarak kurumdan çok memnunum. Çocuğum buraya isteyerek geliyor ve gelismesi cok guzel ilerliyor. Öğretmenlerinden çok memnunum." },
  { name: "Büşra Arslan", date: "2 yıl önce", text: "Herkese tavsiye edebileceğim bi merkez biz çok memnun kaldık. Terapi sürecimizde çok ilgili ve alakalılar çok ilerleme kaydettik." },
  { name: "Onder Seker", date: "4 yıl önce", text: "Kaliteli eğitimi, profesyonel eğitimcileri ve aile sıcaklığını hissettiren çalışanları ile çok güvenilir bir kurum kesinlikle tavsiye ediyorum.👍" },
  { name: "Nida ALTUNGÖK KAYA", date: "4 yıl önce", text: "Kübra hanım alanında uzman ve gerçekten çok ilgili bi eğitimci Elazığ'ın böyle bi kuruma ihtiyacı vardı." },
  { name: "Adem Adam Aydın", date: "2 yıl önce", text: "Gönül rahatlığıyla gidebileceğiniz bir kurum. Alanında uzman eğitici ve öğreticileriyle 5 yıldızdan fazlasını hak ediyor." },
  { name: "Tayfun Aydın", date: "2 yıl önce", text: "Çok temiz güler yüzlü çözüm odaklı ekibi kaliteli bir okul çocuğunuzu gönül rahatlığıyla getirebilirsiniz." },
  { name: "Aleyna Türkmen", date: "2 yıl önce", text: "Kübra Aydına çok teşekkür ederiz. Çok güler yüzlüler çok memnun kaldık." },
].map((r) => ({ ...r, rating: 5 }));
