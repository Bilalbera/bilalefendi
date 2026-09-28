# Bilal Efendi — Yayın ve Sosyal Platform

Netflix tarzı, koyu temalı bir yayın platformu: seriler/sezonlar/bölümler, YouTube üzerinden izleme, profil, arkadaşlık, gerçek zamanlı sohbet ve tam yetkili kurucu paneli.

Kararlar: Google ile giriş, kurucu hesap `bilaliletisim465@gmail.com`, örnek içerik yok (her şey kurucu panelinden eklenir).

## Tasarım kimliği

- Çok koyu arka plan, koyu gri kartlar, tek bir sıcak amber/altın vurgu rengi
- Sinematik hero, yatay kaydırılabilir içerik satırları, yumuşak hover büyümesi
- Yuvarlatılmış butonlar, iskelet (skeleton) yüklenme durumları, açıklayıcı boş ekranlar
- Tüm ekranlar telefon, tablet ve masaüstünde çalışır

## Kullanıcı tarafı ekranlar

- Ana sayfa: hero + "İzlemeye Devam Et", "Popüler", "Yeni Bölümler" ve kurucunun tanımladığı kategori satırları
- Seriler ve Kategoriler listeleri
- Seri detayı: banner, bilgiler, sezon sekmeleri, bölüm listesi (ilerleme çubuklu)
- Bölüm izleme: YouTube oynatıcı, bölüm bilgisi, favori/listem/beğen/paylaş, önceki–sonraki bölüm, kaldığın yerden devam
- Profil: favoriler, izleme geçmişi, devam et, listem, arkadaşlar, mesajlar, hesap ayarları
- Başka kullanıcı profili: arkadaş ekle / mesaj gönder
- Arkadaşlar: liste, çevrimiçi durumu, arama, istekler
- Mesajlar: solda sohbet listesi (son mesaj, okunmamış sayacı), sağda gerçek zamanlı sohbet balonları, okundu bilgisi, mesaj/sohbet silme
- Bildirimler: üstte çan ikonu ve panel (arkadaşlık isteği, yeni mesaj, yeni bölüm/seri)
- Global arama: seri, bölüm, kategori ve kullanıcı sonuçları ayrı gruplar halinde
- Giriş ekranı: "Bilal Efendi'ye Hoş Geldin" + Google ile devam; ilk girişte kullanıcı adı / görünen ad / avatar kurulumu

## Kurucu paneli

Sol menülü ayrı bir yönetim arayüzü:

- Dashboard: kullanıcı, seri, bölüm, görüntülenme, arkadaşlık, mesaj sayıları ve grafikler
- Seri yönetimi: oluştur/düzenle/sil, kapak ve hero görseli, kategori, tür, yayın durumu, öne çıkar, hero'da göster, sıralama
- Sezon ve bölüm yönetimi: bölüm adı/no, YouTube adresi, thumbnail, açıklama, süre, durum, sıralama
- Kategori yönetimi, ana sayfa satır yönetimi (satır ekle/sil/sırala, hero seçimi)
- Kullanıcı yönetimi: liste, ban/ban kaldır, rol değiştir
- İstatistikler: günlük/haftalık/aylık izlenme, en çok izlenen seri ve bölümler

## Güvenlik

- Kurucu paneli hem arayüzde hem sunucu tarafında rol kontrolüyle korunur
- Özel mesajlar yalnızca o sohbetin üyelerine, kişisel veriler yalnızca sahibine açık
- Taslak/gizli içerik kullanıcı tarafında görünmez
- Hiçbir gizli anahtar arayüz koduna yazılmaz

## Teknik notlar

- Lovable Cloud etkinleştirilir (Postgres, auth, realtime, depolama)
- Tablolar: profiles, user_roles, series, seasons, episodes, categories, series_categories, homepage_sections, section_items, favorites, watchlist, watch_history, watch_progress, episode_views, friendships, friend_requests, conversations, conversation_members, messages, notifications, admin_settings
- Roller ayrı `user_roles` tablosunda + `has_role()` security-definer fonksiyonu; her tabloda RLS ve açık GRANT'ler
- Google girişi Lovable OAuth broker ile; `configure_social_auth` çağrılır
- Veri erişimi TanStack Start server function'ları üzerinden; korumalı sayfalar `_authenticated` altında
- Sohbet, çevrimiçi durum ve bildirimler Supabase Realtime ile
- Görseller Cloud storage'a yüklenir; mesaj/geçmiş/kullanıcı listelerinde sayfalama
- Yeniden kullanılabilir bileşenler: Navbar, HeroBanner, SeriesCard, EpisodeCard, ContentRow, FriendCard, ChatList, ChatWindow, NotificationDropdown, AdminSidebar, AdminTable

## Yapım sırası

1. Cloud + Google girişi + profil kurulum akışı + roller
2. İçerik şeması ve kurucu paneli CRUD (seri, sezon, bölüm, kategori, ana sayfa)
3. Kullanıcı tarafı: ana sayfa, seri detayı, izleme sayfası, ilerleme/geçmiş/favori/listem
4. Sosyal: arkadaşlık, arkadaşlar sayfası, gerçek zamanlı sohbet, bildirimler, arama
5. İstatistikler, boş/hata durumları, mobil cilalama
