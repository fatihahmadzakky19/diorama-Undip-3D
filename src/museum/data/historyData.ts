export interface ExhibitSubItem {
  id: string
  title: string
  subtitle?: string
  dateOrYear?: string
  leadershipPeriod?: string
  imageKey?: string
  description: string
  details?: string[]
  quote?: string
}

export interface HistoryBookPage {
  pageNumber: number
  chapterTitle: string
  pageHeader: string
  period: string
  imageKey?: string
  narrativeParagraphs: string[]
  keyMilestones?: string[]
  historicalQuote?: string
}

export interface ExhibitData {
  id: string
  code: 'history' | 'archive' | 'photos' | 'documents' | 'founders'
  areaName: string
  zoneNumber: number
  title: string
  subtitle: string
  badgeText: string
  mainDescription: string
  historicalContext: string
  significance: string
  items?: ExhibitSubItem[]
  bookPages?: HistoryBookPage[]
  stats?: { label: string; value: string }[]
}

/**
 * Data Sejarah Resmi Universitas Diponegoro
 * Rujukan Utama: https://undip.ac.id/sejarah-2
 */
export const EXHIBIT_DATA: Record<string, ExhibitData> = {
  history: {
    id: 'history',
    code: 'history',
    zoneNumber: 1,
    areaName: 'Sayap Barat · Buku Sejarah & Mimbar Baca',
    title: 'Sejarah Resmi Universitas Diponegoro (undip.ac.id/sejarah-2)',
    subtitle: 'Zona 1 — The Origin of Undip: Kronik Pendirian dari Universitas Semarang (1956/1957) hingga Penetapan PTN-BH',
    badgeText: 'Zona 1 — The Origin of Undip',
    mainDescription:
      'Berdasarkan catatan sejarah resmi Undip (undip.ac.id/sejarah-2), sekitar awal tahun 1950-an masyarakat Jawa Tengah khususnya Kota Semarang merasakan kebutuhan mendesak akan kehadiran lembaga pendidikan tinggi. Kebutuhan ini ditujukan untuk membantu pemerintah dalam penanganan pembangunan di segala bidang, sekaligus menampung para lulusan SMA di Jawa Tengah bagian utara yang saat itu jumlahnya terus meningkat pesat namun tidak tertampung di UGM Yogyakarta (satu-satunya universitas negeri di Jateng dan DIY saat itu).',
    historicalContext:
      'Guna mewujudkan cita-cita mulia tersebut, dibentuklah Yayasan Universitas Semarang berdasarkan Akta Notaris R.M. Soeprapto No. 59 tanggal 4 Desember 1956. Langkah bersejarah ini menjadi landasan formal berdirinya "Universitas Semarang" yang secara resmi dibuka pada 9 Januari 1957 dengan Mr. Imam Bardjo sebagai Presiden Universitas (Rektor) pertama. Pada upacara Dies Natalis ke-3 tanggal 9 Januari 1960, Presiden Republik Indonesia Ir. Soekarno mengubah nama Universitas Semarang menjadi "Universitas Diponegoro" sebagai bentuk penghargaan atas prestasi pembinaan pendidikan tinggi.',
    significance:
      'Status universitas negeri dikukuhkan melalui Peraturan Pemerintah No. 7 Tahun 1961 yang berlaku surut mulai 15 Oktober 1957. Tanggal 15 Oktober kemudian ditetapkan sebagai hari jadi atau Dies Natalis Undip, merujuk pada peristiwa heroik Pertempuran Lima Hari di Semarang (15–20 Oktober 1945) untuk meneladani jiwa kepahlawanan para pejuang. Kini Undip telah bertransformasi menjadi Perguruan Tinggi Negeri Badan Hukum (PTN-BH) berkelas dunia berpusat di Kampus Tembalang.',
    stats: [
      { label: 'Akta Notaris Yayasan', value: '4 Desember 1956' },
      { label: 'Pembukaan Resmi', value: '9 Januari 1957' },
      { label: 'Nama "Diponegoro"', value: '9 Januari 1960' },
      { label: 'Hari Jadi (Dies Natalis)', value: '15 Oktober 1957' },
    ],
    bookPages: [
      {
        pageNumber: 1,
        chapterTitle: 'Bab I: Kebutuhan Mendesak Pendidikan Tinggi di Jawa Tengah',
        pageHeader: 'Awal 1950-an — Aspirasi Luhur Pemuda Semarang',
        period: '1950 – 1956',
        imageKey: 'history_background',
        narrativeParagraphs: [
          'Pada awal dekade 1950-an pasca perang kemerdekaan, masyarakat Jawa Tengah khususnya di Kota Semarang merasakan kebutuhan yang sangat mendesak akan hadirnya lembaga pendidikan tinggi.',
          'Saat itu, di seluruh wilayah Jawa Tengah dan Daerah Istimewa Yogyakarta hanya terdapat satu universitas negeri, yaitu Universitas Gadjah Mada (UGM) di Yogyakarta. Sementara itu, jumlah lulusan Sekolah Menengah Atas (SMA) di Jawa Tengah bagian utara, khususnya karesidenan Semarang, Pati, dan Pekalongan, bertambah sangat pesat.',
          'Banyak pemuda berpotensi tidak mampu melanjutkan pendidikan karena kendala jarak dan biaya merantau ke luar kota. Hal ini memicu kebulatan tekad dari para cendekiawan, praktisi hukum, pejuang, serta pamong praja di Semarang untuk mendirikan universitas mandiri di ibukota Jawa Tengah.',
        ],
        keyMilestones: [
          'Tingginya lonjakan lulusan SMA yang membutuhkan akses universitas terjangkau.',
          'Kebutuhan mendesak tenaga sarjana untuk memimpin pembangunan daerah.',
          'Kesepakatan bersama para tokoh Semarang membentuk panitia persiapan perguruan tinggi.',
        ],
      },
      {
        pageNumber: 2,
        chapterTitle: 'Bab II: Pembentukan Yayasan Universitas Semarang',
        pageHeader: 'Akta Notaris R.M. Soeprapto No. 59 Th. 1956',
        period: '4 Desember 1956',
        imageKey: 'history_founding',
        narrativeParagraphs: [
          'Cita-cita luhur mendirikan universitas diwujudkan secara resmi dengan dibentuknya Yayasan Universitas Semarang berdasarkan Akta Notaris R.M. Soeprapto Nomor 59 pada tanggal 4 Desember 1956 di Semarang.',
          'Sebanyak 13 tokoh perintis tercatat dalam akta notaris ini, yang terdiri atas para hakim, notaris, dokter, pamong praja, dan cendekiawan. Mereka bahu-membahu menyumbangkan tenaga, pikiran, dan materi secara sukarela tanpa pamrih.',
          'Mr. Sudarto dipercaya memimpin sebagai Ketua Dewan Pengurus Yayasan, didampingi Mr. Dan Soelaiman (Wakil Ketua), Mr. Soesanto Kartoatmodjo (Panitera), Achmad Tjokrokoesoemo (Bendahara), Mr. Imam Bardjo, Mr. Goenawan Goetomo, Mr. Tan Tjing Hak, serta Mr. Koo Swan Ik. Dewan Kurator dipimpin oleh Walikota Semarang Hadi Soebeno Sosrowardoyo.',
        ],
        historicalQuote:
          '“Dengan landasan Akta No. 59 Tahun 1956, tonggak formal perguruan tinggi mandiri di Semarang resmi dipancangkan.”',
        keyMilestones: [
          'Legalisasi badan hukum yayasan di hadapan Notaris R.M. Soeprapto.',
          'Dukungan penuh dari 13 tokoh pendiri berjiwa patriotik.',
          'Komitmen gotong royong pendanaan dari segenap masyarakat Jawa Tengah.',
        ],
      },
      {
        pageNumber: 3,
        chapterTitle: 'Bab III: Pembukaan Resmi di Aula GRIS & Kuliah Perdana',
        pageHeader: '9 Januari 1957 — Lahirnya Universitas Semarang',
        period: '9 Januari 1957',
        imageKey: 'photo_campus_gris',
        narrativeParagraphs: [
          'Pada tanggal 9 Januari 1957, Universitas Semarang dibuka secara khidmat dalam upacara peresmian yang dihadiri para pemuka masyarakat Jawa Tengah di Gedung Rakyat Indonesia Semarang (GRIS), Jalan Pemuda.',
          'Mr. Imam Bardjo, yang saat itu menjabat sebagai Ketua Pengadilan Negeri Semarang, diangkat sebagai Presiden Universitas (Rektor) pertama. Dalam orasi ilmiah perdananya, beliau menekankan bahwa universitas ini adalah candradimuka bagi pembentukan watak bangsa yang berbudi luhur.',
          'Pada awal berdirinya, perkuliahan dibuka untuk empat fakultas perintis: Fakultas Hukum dan Masyarakat, Fakultas Ekonomi, Fakultas Teknik, serta Akademi Tata Praja. Fasilitas perkuliahan memanfaatkan ruang kelas SMA Negeri di Jl. Taman Menteri Supeno dan aula GRIS.',
        ],
        keyMilestones: [
          'Pelantikan Mr. Imam Bardjo sebagai Presiden Universitas pertama.',
          'Perkuliahan perdana 4 fakultas perintis dengan ratusan mahasiswa.',
          'Dukungan fasilitas belajar dari Pemerintah Kotapraja Semarang.',
        ],
      },
      {
        pageNumber: 4,
        chapterTitle: 'Bab IV: Penganugerahan Nama "Universitas Diponegoro" oleh Bung Karno',
        pageHeader: 'Dies Natalis III — 9 Januari 1960',
        period: '9 Januari 1960',
        imageKey: 'history_soekarno',
        narrativeParagraphs: [
          'Ketekunan sivitas akademika Universitas Semarang dalam membina pendidikan tinggi mendapat perhatian langsung dari pucuk pimpinan Republik Indonesia.',
          'Pada upacara Dies Natalis ke-3 tanggal 9 Januari 1960, Presiden Republik Indonesia Ir. Soekarno berkenan hadir dan secara resmi menganugerahkan nama baru: “UNIVERSITAS DIPONEGORO”.',
          'Penganugerahan nama pahlawan besar Pangeran Diponegoro merupakan bentuk kehormatan dan amanat luhur agar seluruh insan akademika meneladani keberanian, ketulusan budi, keteguhan prinsip, dan kesetiaan membela rakyat.',
        ],
        historicalQuote:
          '“Jadikanlah nama Diponegoro sebagai obor pengabdian kepada tanah air! Warisilah kejujuran budi dan keberanian Pangeran Diponegoro dalam menegakkan martabat bangsa.” — Ir. Soekarno (Semarang, 9 Januari 1960)',
        keyMilestones: [
          'Perubahan nama resmi dari Universitas Semarang menjadi Universitas Diponegoro.',
          'Penetapan Pangeran Diponegoro sebagai figur inspirasi keteladanan moral.',
        ],
      },
      {
        pageNumber: 5,
        chapterTitle: 'Bab V: Pengukuhan PTN & Makna Dies Natalis 15 Oktober',
        pageHeader: 'PP No. 7 Tahun 1961 & Jiwa Patriotisme Semarang',
        period: '15 Oktober 1957 / 1961',
        imageKey: 'history_ptn',
        narrativeParagraphs: [
          'Status Universitas Diponegoro sebagai Perguruan Tinggi Negeri (PTN) secara hukum dikukuhkan melalui Peraturan Pemerintah Nomor 7 Tahun 1961 yang ditandatangani oleh Presiden Soekarno, dengan ketentuan berlaku surut terhitung mulai tanggal 15 Oktober 1957.',
          'Tanggal 15 Oktober kemudian ditetapkan secara permanen sebagai Hari Jadi atau Dies Natalis Universitas Diponegoro.',
          'Pemilihan tanggal 15 Oktober memiliki makna filosofis yang sangat sakral: mengenang meletusnya Pertempuran Lima Hari di Semarang (15–20 Oktober 1945), di mana para pemuda dan pejuang Semarang gugur mempertahankan kemerdekaan Indonesia dari serangan tentara Jepang. Jiwa patriotik inilah yang diwariskan kepada seluruh alumni Undip.',
        ],
        keyMilestones: [
          'Penetapan status perguruan tinggi negeri penuh di bawah naungan pemerintah RI.',
          'Penetapan tanggal 15 Oktober sebagai Dies Natalis resmi Undip.',
          'Penyatuan nilai kepahlawanan Semarang dengan dharma bakti pendidikan tinggi.',
        ],
      },
      {
        pageNumber: 6,
        chapterTitle: 'Bab VI: Transformasi Menuju Kampus Tembalang & PTN-BH Berkelas Dunia',
        pageHeader: 'Dari Pleburan Menuju Pusat Riset Terpadu Tembalang',
        period: '2008 – Kini',
        imageKey: 'photo_campus_pleburan',
        narrativeParagraphs: [
          'Seiring pesatnya penambahan fakultas dan mahasiswa, Undip melakukan langkah strategis memindahkan dan memperluas kampus utama dari kawasan Pleburan Semarang Tengah menuju dataran tinggi perbukitan Tembalang seluas ratusan hektar.',
          'Kampus Tembalang kini menjadi pusat kegiatan akademik modern yang dilengkapi berbagai laboratorium riset, perpustakaan megah, gedung serbaguna Widya Puraya, serta stadion olahraga.',
          'Pada tahun 2008 Undip ditetapkan sebagai Badan Layanan Umum (BLU), dan selanjutnya pada 17 Oktober 2014 resmi bertransformasi menjadi Perguruan Tinggi Negeri Badan Hukum (PTN-BH) melalui Peraturan Pemerintah Nomor 81 Tahun 2014 dan disempurnakan dengan PP Nomor 52 Tahun 2015 tentang Statuta Undip.',
          'Kini Universitas Diponegoro berdiri kokoh sebagai salah satu universitas riset terbaik di Indonesia dan masuk dalam jajaran perguruan tinggi bereputasi internasional (World Class University).',
        ],
        keyMilestones: [
          'Pembangunan kampus terpadu Tembalang berwawasan lingkungan asri.',
          'Penetapan status PTN Badan Hukum (PTN-BH) berotonomi penuh.',
          'Capaian akreditasi unggul nasional dan pemeringkatan riset internasional.',
        ],
      },
    ],
    items: [
      {
        id: 'latar-belakang-1950',
        title: 'Kebutuhan Mendesak Pendidikan Tinggi Awal 1950-an',
        subtitle: 'Keterbatasan Daya Tampung Pendidikan Tinggi di Jawa Tengah',
        dateOrYear: 'Awal 1950-an',
        imageKey: 'history_background',
        description:
          'Pada awal dekade 1950-an, di wilayah Jawa Tengah dan D.I. Yogyakarta baru ada Universitas Gadjah Mada (UGM) berstatus negeri. Sementara itu, lulusan SMA di Jawa Tengah bagian utara, khususnya Semarang dan sekitarnya, meningkat drastis namun banyak yang tidak mampu melanjutkan studi ke luar kota.',
        details: [
          'Dibutuhkan banyak tenaga sarjana untuk mengisi pos-pos birokrasi, hukum, teknik, dan ekonomi daerah.',
          'Masyarakat dan para pejuang di Semarang bergotong royong menggagas pendirian universitas mandiri.',
          'Para praktisi hukum, notaris, dokter, dan insinyur menyatakan kesediaan mengajar secara sukarela.',
        ],
      },
      {
        id: 'pendirian-yayasan-1956',
        title: 'Akta Notaris R.M. Soeprapto No. 59 & Pembukaan 9 Januari 1957',
        subtitle: 'Lahirnya Universitas Semarang dan Kuliah Perdana di GRIS',
        dateOrYear: '4 Des 1956 / 9 Jan 1957',
        imageKey: 'history_founding',
        description:
          'Yayasan Universitas Semarang resmi berdiri pada 4 Desember 1956 di hadapan Notaris R.M. Soeprapto. Selanjutnya pada 9 Januari 1957, Universitas Semarang dibuka secara khidmat dengan Mr. Imam Bardjo sebagai Presiden Universitas pertama.',
        details: [
          'Kuliah perdana dimulai di Gedung Rakyat Indonesia Semarang (GRIS) di Jalan Pemuda.',
          'Empat fakultas perintis: Hukum & Masyarakat, Ekonomi, Teknik, serta Akademi Tata Praja.',
          'Dukungan luar biasa datang dari pemerintah daerah dan masyarakat Kota Semarang.',
        ],
      },
      {
        id: 'penganugerahan-nama-1960',
        title: 'Penganugerahan Nama "Universitas Diponegoro" oleh Presiden Soekarno',
        subtitle: 'Dies Natalis III — 9 Januari 1960 di Semarang',
        dateOrYear: '9 Januari 1960',
        imageKey: 'history_soekarno',
        description:
          'Presiden Soekarno memberikan restu dan penganugerahan nama agung "Universitas Diponegoro" (Undip) sebagai penghargaan atas ketekunan membina pendidikan tinggi di Jawa Tengah.',
        quote:
          '“Jadikanlah nama Diponegoro sebagai obor pengabdian kepada tanah air! Warisilah keberanian, kejujuran budi, dan ketulusan Pangeran Diponegoro dalam membela rakyat.” — Ir. Soekarno',
      },
      {
        id: 'penetapan-dies-natalis-15-oktober',
        title: 'Penetapan Dies Natalis 15 Oktober & Pertempuran Lima Hari',
        subtitle: 'PP No. 7 Tahun 1961 & Jiwa Patriotisme Semarang',
        dateOrYear: '15 Oktober 1957/1961',
        imageKey: 'history_ptn',
        description:
          'Penegerian Undip ditetapkan melalui PP No. 7 Tahun 1961 dengan penetapan hari Dies Natalis jatuh pada tanggal 15 Oktober. Momentum ini sengaja dipilih untuk meneladani patriotisme para pemuda pejuang dalam Pertempuran Lima Hari di Semarang (15–20 Oktober 1945).',
      },
      {
        id: 'transformasi-tembalang-ptnbh',
        title: 'Ekspansi Kampus Tembalang & Penetapan Status PTN-BH',
        subtitle: 'Keputusan Menkeu BLU (2008) & PP No. 81 Tahun 2014 (PTN-BH)',
        dateOrYear: '2008 – 2015 – Kini',
        imageKey: 'photo_campus_pleburan',
        description:
          'Dari kampus bersejarah Pleburan, Undip memperluas kampus utama ke perbukitan Tembalang. Undip bertransformasi menjadi BLU (2008) dan resmi ditetapkan sebagai PTN Badan Hukum (PTN-BH) melalui PP No. 81 Tahun 2014 dan PP No. 52 Tahun 2015.',
      },
    ],
  },

  archive: {
    id: 'archive',
    code: 'archive',
    zoneNumber: 1,
    areaName: 'Sayap Barat · Lemari Arsip Klasik 1956',
    title: 'Arsip Akta Notaris No. 59 & Berkas Perintis Undip',
    subtitle: 'Zona 1 — The Origin of Undip: Naskah Asli Pembentukan Yayasan Universitas Semarang (undip.ac.id/sejarah-2)',
    badgeText: 'Zona 1 — Koleksi Arsip Otentik',
    mainDescription:
      'Zona lemari arsip kayu jati antik ini mendokumentasikan warkat otentik pembentukan Yayasan Universitas Semarang: Akta Notaris R.M. Soeprapto No. 59 tanggal 4 Desember 1956, susunan kepengurusan yayasan dan dewan kurator pertama, buku registrasi mahasiswa 1957, serta risalah pendirian fakultas-fakultas perintis.',
    historicalContext:
      'Akta Notaris No. 59 inilah yang secara hukum melegitimasi pembentukan perguruan tinggi mandiri di Semarang. Dalam akta ini tercantum pembagian tugas para perintis: Mr. Sudarto sebagai Ketua Yayasan, Mr. Dan Soelaiman sebagai Wakil Ketua, Mr. Soesanto Kartoatmodjo sebagai Panitera, Achmad Tjokrokoesoemo sebagai Bendahara, serta Mr. Imam Bardjo yang diangkat sebagai Presiden Universitas pertama.',
    significance:
      'Arsip ini membuktikan legalitas hukum dan tata kelola profesional yang diletakkan para perintis sejak hari pertama berdirinya almamater.',
    stats: [
      { label: 'Nomor Akta Notaris', value: 'No. 59 Th. 1956' },
      { label: 'Tanggal Akta', value: '4 Desember 1956' },
      { label: 'Notaris Pembuat', value: 'R.M. Soeprapto' },
      { label: 'Presiden Rektor I', value: 'Mr. Imam Bardjo' },
    ],
    items: [
      {
        id: 'akta-notaris-59-undip',
        title: 'Akta Notaris R.M. Soeprapto No. 59 Tanggal 4 Desember 1956',
        subtitle: 'Pendirian Resmi Yayasan Universitas Semarang',
        dateOrYear: '4 Desember 1956',
        imageKey: 'archive_deed',
        description:
          'Naskah legal otentik bermeterai yang menyatakan berdirinya Yayasan Universitas Semarang dengan tujuan memajukan pendidikan tinggi di Kota Semarang dan membantu pemerintah mencetak tenaga ahli pembangunan daerah.',
        details: [
          'Memuat susunan pengurus yayasan dan dewan kurator pertama.',
          'Menjadi dasar hukum pembukaan perkuliahan tanggal 9 Januari 1957.',
          'Mencantumkan komitmen gotong royong pendanaan dari masyarakat Semarang.',
        ],
      },
      {
        id: 'notulen-sidang-perintis',
        title: 'Notulen Rapat Perintis di Pengadilan Negeri Semarang',
        subtitle: 'Musyawarah Para Tokoh Hukum, Kedokteran, dan Birokrasi',
        dateOrYear: '1956',
        imageKey: 'archive_minutes',
        description:
          'Risalah pertemuan para perintis yang mematangkan rencana peminjaman gedung kuliah di GRIS Jl. Pemuda dan kurikulum awal fakultas hukum, ekonomi, dan teknik.',
      },
      {
        id: 'buku-induk-mahasiswa-1957',
        title: 'Buku Induk Registrasi Mahasiswa Angkatan Pertama (1957)',
        subtitle: 'Dokumen Mahasiswa Perintis No. 001 s.d. 142',
        dateOrYear: 'Januari 1957',
        imageKey: 'archive_register',
        description:
          'Buku arsip tebal bersampul kulit hitam mencatat putra-putri bangsa yang pertama kali terdaftar sebagai mahasiswa Universitas Semarang.',
      },
    ],
  },

  photos: {
    id: 'photos',
    code: 'photos',
    zoneNumber: 2,
    areaName: 'Dinding Utara · Galeri Foto Kampus Awal',
    title: 'Foto Kampus Awal Undip (Pleburan, GRIS, dan Dies Natalis III)',
    subtitle: 'Zona 1 — The Origin of Undip: Dokumentasi Visual Suasana Perkuliahan dan Momen Bersejarah Undip (1957–1965)',
    badgeText: 'Zona 1 — Galeri Foto Bersejarah Undip',
    mainDescription:
      'Dinding dokumentasi utara memamerkan foto-foto langka kehidupan kampus Undip pada dekade pertama: gedung kuliah kolonial di Pleburan, suasana kuliah perdana di Gedung Rakyat Indonesia Semarang (GRIS) di Jalan Pemuda, upacara Dies Natalis ke-3 dihadiri Presiden Soekarno, dan praktikum laboratorium teknik.',
    historicalContext:
      'Sebelum dibangunnya Kampus Tembalang, seluruh kegiatan akademik berpusat di gedung GRIS dan komplek Pleburan. Foto-foto ini merekam tekad para mahasiswa angkatan pertama yang belajar di bawah lampu temaram dengan fasilitas sederhana namun penuh rasa cinta tanah air.',
    significance:
      'Dokumentasi ini adalah bukti sejarah visual yang menghubungkan generasi sekarang dengan perjuangan para pendahulu Undip.',
    stats: [
      { label: 'Kampus Pertama', value: 'Pleburan, Semarang' },
      { label: 'Aula Kuliah Awal', value: 'GRIS Jl. Pemuda' },
      { label: 'Era Foto', value: '1957 – 1965' },
      { label: 'Koleksi', value: 'Foto Langka Terpilih' },
    ],
    items: [
      {
        id: 'foto-gedung-pleburan',
        title: 'Gedung Utama Kampus Pleburan — 1957',
        subtitle: 'Pusat Kehidupan Akademik Awal Universitas Diponegoro',
        dateOrYear: '1957',
        imageKey: 'photo_campus_pleburan',
        description:
          'Gedung berpilar putih kokoh dengan arsitektur kolonial tropis di Pleburan, Semarang Selatan, yang menjadi markas rektorat dan perkuliahan awal Undip.',
      },
      {
        id: 'foto-aula-gris',
        title: 'Aula GRIS Jl. Pemuda — 1957',
        subtitle: 'Gedung Rakyat Indonesia Semarang, Tempat Peresmian Universitas',
        dateOrYear: '9 Januari 1957',
        imageKey: 'photo_campus_gris',
        description:
          'Aula GRIS di Jalan Pemuda menjadi saksi peresmian Universitas Semarang dan kuliah perdana. Gedung ini dipinjamkan pemerintah kotapraja untuk kegiatan akademik awal.',
      },
      {
        id: 'foto-kuliah-perdana',
        title: 'Suasana Kuliah Perdana di GRIS — 1957',
        subtitle: 'Mahasiswa Angkatan Pertama dan Orasi Mr. Imam Bardjo',
        dateOrYear: '1957',
        imageKey: 'photo_historic_lecture',
        description:
          'Para mahasiswa angkatan pertama menyimak orasi ilmiah pembukaan dari Presiden Universitas Mr. Imam Bardjo dengan fasilitas yang sederhana namun penuh semangat.',
      },
      {
        id: 'foto-dies-natalis-3-undip',
        title: 'Dies Natalis III & Amanat Presiden Soekarno — 1960',
        subtitle: 'Penganugerahan Nama Universitas Diponegoro',
        dateOrYear: '9 Januari 1960',
        imageKey: 'photo_dies_soekarno',
        description:
          'Presiden Soekarno berpidato di hadapan ribuan warga dan sivitas akademika, meresmikan pengubahan nama menjadi Universitas Diponegoro.',
      },
      {
        id: 'foto-lab-teknik-undip',
        title: 'Laboratorium & Ukur Tanah Fakultas Teknik — 1962',
        subtitle: 'Praktikum Insinyur Perintis di Pleburan',
        dateOrYear: '1962',
        imageKey: 'photo_historic_lab',
        description:
          'Mahasiswa teknik sipil awal melakukan pengukuran kontur tanah menggunakan theodolite optik manual di bawah bimbingan insinyur DPU.',
      },
      {
        id: 'foto-penegerian-ptn',
        title: 'Naskah Penegerian PP No. 7 Tahun 1961',
        subtitle: 'Pengukuhan Status PTN & Dies Natalis 15 Oktober 1957',
        dateOrYear: '1961',
        imageKey: 'history_ptn',
        description:
          'Peraturan Pemerintah No. 7 Tahun 1961 mengukuhkan status Universitas Diponegoro sebagai perguruan tinggi negeri dengan berlaku surut sejak 15 Oktober 1957.',
      },
    ],
  },

  documents: {
    id: 'documents',
    code: 'documents',
    zoneNumber: 4,
    areaName: 'Sayap Timur · Etalase Dokumen Resmi Negara',
    title: 'Dokumen SK Presiden No. 226/1960 & Penegerian Undip',
    subtitle: 'Zona 1 — The Origin of Undip: Naskah Keputusan Penegerian, PP No. 7 Tahun 1961 & Stempel Lilin',
    badgeText: 'Zona 1 — Dokumen Resmi Negara',
    mainDescription:
      'Di dalam etalase kaca vitrine museum ini dipamerkan salinan naskah resmi Surat Keputusan Presiden Republik Indonesia No. 226 Tahun 1960 tentang penegerian Universitas Diponegoro, Peraturan Pemerintah No. 7 Tahun 1961, piagam lambang panji Diponegoro, serta stempel segel lilin merah kuningan dan pena bulu bertinta sepia.',
    historicalContext:
      'Penegerian Undip merupakan pengakuan resmi dari negara atas sumbangsih universitas ini dalam mendidik putra-putri bangsa. Melalui PP No. 7 Tahun 1961, Undip secara definitif bergabung dalam jaringan perguruan tinggi negeri di Indonesia.',
    significance:
      'Naskah ini adalah tonggak yuridis formal yang memperkuat posisi Undip sebagai pilar keilmuan nasional.',
    stats: [
      { label: 'Surat Keputusan', value: 'SK Presiden No. 226/1960' },
      { label: 'Regulasi Pemerintah', value: 'PP No. 7 Th. 1961' },
      { label: 'Tanggal Berlaku Surut', value: '15 Oktober 1957' },
      { label: 'Meterai Resmi', value: 'Segel Lilin Garuda' },
    ],
    items: [
      {
        id: 'sk-presiden-226-doc',
        title: 'Surat Keputusan Presiden RI No. 226 Tahun 1960',
        subtitle: 'Tentang Penegerian Universitas Diponegoro di Semarang',
        dateOrYear: '1960',
        imageKey: 'doc_presidential_decree',
        description:
          'Naskah ketikan resmi kantor kepresidenan dengan lambang Garuda, menetapkan penegerian dan pengesahan nama kehormatan "Universitas Diponegoro".',
      },
      {
        id: 'pp-7-1961-doc',
        title: 'Peraturan Pemerintah No. 7 Tahun 1961',
        subtitle: 'Lembaran Negara RI Tahun 1961 No. 21',
        dateOrYear: '1961',
        imageKey: 'doc_govt_regulation',
        description:
          'Dasar hukum pembentukan fakultas-fakultas negeri dalam naungan Universitas Diponegoro dan jaminan anggaran operasional negara.',
      },
      {
        id: 'piagam-lambang-doc',
        title: 'Piagam Pengukuhan Lambang dan Panji Diponegoro',
        subtitle: 'Makna Simbolik Ksatria Menunggang Kuda Membawa Keris',
        dateOrYear: '1960',
        imageKey: 'doc_crest_charter',
        description:
          'Naskah penjelasan lambang: Pangeran Diponegoro menunggang kuda dengan keris pusaka, melambangkan kepemimpinan yang berani membela keadilan, berintegritas, dan bertakwa kepada Tuhan Yang Maha Esa.',
      },
    ],
  },

  founders: {
    id: 'founders',
    code: 'founders',
    zoneNumber: 3,
    areaName: 'Dinding Selatan · Galeri Rektor & Pimpinan Rektorat',
    title: 'Galeri Rektor & Pimpinan Universitas Diponegoro',
    subtitle: 'Zona 1 — The Origin of Undip: Suksesi Tokoh Kepemimpinan Rektorat dari Masa ke Masa (1957 — Kini)',
    badgeText: 'Zona 1 — Suksesi Kepemimpinan Rektorat',
    mainDescription:
      'Galeri Rektorat Universitas Diponegoro mendokumentasikan jejak estafet kepemimpinan sejak berdirinya Universitas Semarang pada 9 Januari 1957 hingga bertransformasi menjadi Perguruan Tinggi Negeri Badan Hukum (PTN-BH) berkelas dunia di Kampus Tembalang. Dua belas tokoh pemimpin ini telah mengabdikan dedikasi, visi, dan integritas untuk mengibarkan panji almamater Pangeran Diponegoro.',
    historicalContext:
      'Setiap era kepemimpinan membawa tonggak sejarah berharga: mulai dari perintisan kuliah perdana di GRIS Jl. Pemuda oleh Mr. Imam Bardjo, pembangunan terpadu Kampus Tembalang oleh Mr. Soedarto dan Prof. Muladi, pembumian humanisme berwawasan lingkungan oleh Prof. Eko Budihardjo dan Prof. Sudharto P. Hadi, hingga akselerasi World Class University oleh Prof. Yos Johan Utama dan Prof. Suharnomo.',
    significance:
      'Deretan pimpinan rektorat ini menjadi suri teladan bagi seluruh civitas akademika dalam mewujudkan Undip Bermartabat, Undip Bermanfaat bagi bangsa dan kemanusiaan.',
    stats: [
      { label: 'Presiden Universitas I', value: 'Prof. Mr. Imam Bardjo' },
      { label: 'Rektor Era Tembalang', value: 'Prof. Mr. Soedarto, S.H.' },
      { label: 'Status Kelembagaan', value: 'PTN-BH Mandiri' },
      { label: 'Rektor Petahana', value: 'Prof. Dr. Suharnomo, S.E., M.Si.' },
    ],
    items: [
      {
        id: 'rector-1-imam-bardjo',
        title: '1. Prof. Mr. Imam Bardjo',
        subtitle: 'Presiden Universitas Semarang Pertama (Rektor Perintis 1957–1961)',
        dateOrYear: '1903 – 1969',
        leadershipPeriod: 'Presiden Universitas 1957–1961',
        imageKey: 'rector_imam_bardjo',
        description:
          'Ketua Pengadilan Negeri Semarang yang diangkat sebagai Presiden Universitas (Rektor) pertama saat pembukaan resmi pada 9 Januari 1957 di Gedung Rakyat Indonesia Semarang (GRIS) Jl. Pemuda. Beliau meletakkan landasan akademik awal bagi fakultas hukum, ekonomi, teknik, dan akademi tata praja.',
        details: [
          'Presiden Universitas pertama memimpin kuliah perdana di aula GRIS dan Pleburan.',
          'Mengajar langsung mata kuliah hukum perdata dan pidana bagi angkatan pertama.',
          'Namanya diabadikan sebagai Jalan Prof. Mr. Imam Bardjo dan Gedung Pertemuan di Kampus Pleburan.',
        ],
        quote: '“Keadilan hukum dan keluhuran ilmu adalah dua pilar mutlak yang menjaga martabat kemanusiaan dan kedaulatan bangsa.”',
      },
      {
        id: 'rector-2-soedarto',
        title: '2. Prof. Mr. Soedarto, S.H.',
        subtitle: 'Rektor Undip Ke-2 & Peletak Dasar Visi Kampus Tembalang',
        dateOrYear: '1923 – 1986',
        leadershipPeriod: 'Rektor Undip 1961–1962 & 1977–1986',
        imageKey: 'rector_soedarto',
        description:
          'Ketua Yayasan perintis 1956 dan mahaguru hukum pidana nasional yang memimpin Undip dalam dua periode krusial. Beliau memprakarsai pembebasan lahan perbukitan Tembalang dan merancang cetak biru kepindahan kampus terpadu Undip dari Pleburan ke Tembalang.',
        details: [
          'Menjabat Rektor pada masa awal penegerian (1961–1962) dan masa ekspansi besar (1977–1986).',
          'Pakar hukum pidana nasional terkemuka dan salah satu perancang KUHP Nasional Indonesia.',
          'Memprakarsai pembangunan kampus terpadu Tembalang; diabadikan sebagai Gedung "Auditorium Prof. Soedarto, S.H.".',
        ],
        quote: '“Pendidikan tinggi harus berakar pada kebutuhan riil bangsa dan memiliki visi strategis jauh ke masa depan.”',
      },
      {
        id: 'rector-3-jakub-rais',
        title: '3. Prof. Dr. Ir. Jakub Rais, M.Sc.',
        subtitle: 'Caretaker Rektor Undip & Tokoh Pemetaan Geospasial Nasional',
        dateOrYear: '1928 – 2021',
        leadershipPeriod: 'Caretaker Rektor Undip 1965–1966',
        imageKey: 'rector_jakub_rais',
        description:
          'Guru besar teknik geodesi berwawasan internasional yang memegang amanah kepemimpinan Undip pada masa transisi tahun 1965–1966. Beliau berhasil menjaga stabilitas akademik kampus dan memantapkan kurikulum Fakultas Teknik Undip.',
        details: [
          'Caretaker Rektor Universitas Diponegoro pada periode kritis 1965–1966.',
          'Pelopor survei hidrografi dan Badan Koordinasi Survei dan Pemetaan Nasional (Bakosurtanal).',
          'Membangun fondasi kuat bagi riset teknologi kelautan dan keteknikan di Undip.',
        ],
        quote: '“Akurasi ilmu dan keteguhan integritas adalah kompas utama insan cendekia dalam membangun peradaban.”',
      },
      {
        id: 'rector-4-moeljono-sostro',
        title: '4. Drs. Moeljono Sostrohadikoesoemo',
        subtitle: 'Rektor Undip Ke-4 & Konsolidator Struktur Akademik Negeri',
        dateOrYear: '1920 – 1993',
        leadershipPeriod: 'Rektor Undip 1966–1973',
        imageKey: 'rector_moeljono_sostro',
        description:
          'Memimpin Universitas Diponegoro selama tujuh tahun dalam fase penataan tata kelola dan kelembagaan perguruan tinggi negeri. Di bawah kepemimpinannya, fakultas-fakultas baru dikembangkan dan kapasitas penerimaan mahasiswa ditingkatkan.',
        details: [
          'Rektor Undip selama 7 tahun kepemimpinan (1966–1973).',
          'Menata administrasi sentral, pengadaan laboratorium sains dasar, dan perpustakaan pusat.',
          'Memperkokoh posisi Undip sebagai universitas pembina utama di wilayah Jawa Tengah.',
        ],
        quote: '“Pendidikan yang tertib, berdisiplin, dan inklusif melahirkan generasi pemikir yang tangguh dan mandiri.”',
      },
      {
        id: 'rector-5-soenarjo',
        title: '5. Prof. Dr. Soenarjo, S.H.',
        subtitle: 'Rektor Undip Ke-5 & Tokoh Hukum Tata Negara Nasional',
        dateOrYear: '1918 – 1996',
        leadershipPeriod: 'Rektor Undip 1973–1977',
        imageKey: 'rector_soenarjo',
        description:
          'Mahaguru ilmu hukum yang memimpin Undip pada pertengahan era 1970-an. Beliau mendorong keterlibatan akademisi Undip dalam pengkajian hukum kemasyarakatan dan memperluas hubungan kerja sama antarkampus nasional.',
        details: [
          'Rektor Universitas Diponegoro periode 1973–1977.',
          'Mendorong penelitian empiris dan pengabdian masyarakat dosen di desa-desa binaan.',
          'Memperkuat wibawa akademik dan etika keilmuan civitas akademika.',
        ],
        quote: '“Kampus adalah benteng moral yang harus senantiasa menyuarakan kebenaran ilmiah demi kemaslahatan rakyat.”',
      },
      {
        id: 'rector-6-muladi',
        title: '6. Prof. Dr. H. Muladi, S.H.',
        subtitle: 'Rektor Undip Ke-6 & Tokoh Hukum Pidana serta Negarawan RI',
        dateOrYear: '1943 – 2020',
        leadershipPeriod: 'Rektor Undip 1986–1994 (Dua Periode)',
        imageKey: 'rector_muladi',
        description:
          'Pakar hukum pidana dan kriminologi bereputasi internasional yang memimpin Undip selama dua periode kepemimpinan. Beliau mempercepat pemindahan kampus ke Tembalang secara besar-besaran dan mengangkat prestise Undip di kancah nasional.',
        details: [
          'Rektor Undip dua periode berturut-turut (1986–1994).',
          'Mengakselerasi pembangunan sarana fisik, laboratorium, dan rektorat di Kampus Tembalang.',
          'Dipercaya mengemban amanah negara sebagai Menteri Kehakiman RI dan Menteri Sekretaris Negara RI.',
        ],
        quote: '“Demokrasi dan supremasi hukum harus ditegakkan dengan keberanian moral tanpa kompromi.”',
      },
      {
        id: 'rector-7-eko-budihardjo',
        title: '7. Prof. Ir. Eko Budihardjo, M.Sc.',
        subtitle: 'Rektor Undip Ke-7 & Begawan Arsitektur serta Budayawan Nasional',
        dateOrYear: '1944 – 2014',
        leadershipPeriod: 'Rektor Undip 1994–1998',
        imageKey: 'rector_eko_budihardjo',
        description:
          'Pakar arsitektur dan perencanaan kota yang sangat dicintai karena kepemimpinannya yang santun, humoris, dan humanis. Beliau mencetuskan konsep kampus hijau asri dan membumikan nilai-nilai kebudayaan lokal dalam tata ruang kampus.',
        details: [
          'Rektor Undip periode 1994–1998 dan Guru Besar Arsitektur Perkotaan.',
          'Pelopor konsep Eco-Culture Campus dan pemeliharaan ruang terbuka hijau di Tembalang.',
          'Penulis produktif puluhan buku arsitektur, lingkungan, dan kolom kebudayaan nasional.',
        ],
        quote: '“Kota tanpa taman bagai raga tanpa sukma; universitas tanpa nurani kemanusiaan adalah kehampaan.”',
      },
      {
        id: 'rector-8-temijo',
        title: '8. Prof. Dr. Temijo, S.H.',
        subtitle: 'Rektor Undip Ke-8 & Pengawal Era Reformasi Menuju Kemandirian',
        dateOrYear: '1939 – kini',
        leadershipPeriod: 'Rektor Undip 1998–2006 (Dua Periode)',
        imageKey: 'rector_temijo',
        description:
          'Memimpin Undip pada masa genting transisi reformasi 1998 dengan suasana kampus yang tetap kondusif, kritis, dan demokratis. Beliau meletakkan landasan penjaminan mutu akademik dan penataan otonomi perguruan tinggi.',
        details: [
          'Rektor Undip dua periode kepemimpinan (1998–2006).',
          'Mengembangkan sistem manajemen informasi akademik digital dan modernisasi perpustakaan.',
          'Mempersiapkan Undip bertransformasi menuju Perguruan Tinggi Berbadan Hukum Milik Negara (BHMN).',
        ],
        quote: '“Kemandirian berpikir dan integritas adalah bekal utama mahasiswa dalam menyongsong gelombang perubahan zaman.”',
      },
      {
        id: 'rector-9-susilo-wibowo',
        title: '9. Prof. Dr. dr. H. Susilo Wibowo, M.S.Med., Sp.And.',
        subtitle: 'Rektor Undip Ke-9 & Inisiator Rumah Sakit Nasional Diponegoro',
        dateOrYear: '1948 – kini',
        leadershipPeriod: 'Rektor Undip 2006–2010',
        imageKey: 'rector_susilo_wibowo',
        description:
          'Dokter spesialis andrologi dan pakar kedokteran reproduksi yang memacu kapasitas riset biomedis Undip. Beliau adalah inisiator utama pembangunan Rumah Sakit Nasional Diponegoro (RSND) dan pengembangan fakultas kesehatan terpadu.',
        details: [
          'Rektor Undip periode 2006–2010.',
          'Memprakarsai pendirian Rumah Sakit Nasional Diponegoro (RSND) di Kampus Tembalang.',
          'Meningkatkan intensitas riset internasional, sitasi ilmiah, dan kerja sama luar negeri.',
        ],
        quote: '“Kesehatan masyarakat dan kemajuan sains kedokteran adalah wujud bakti luhur universitas bagi kemanusiaan.”',
      },
      {
        id: 'rector-10-sudharto-hadi',
        title: '10. Prof. Ir. Sudharto P. Hadi, MES, Ph.D.',
        subtitle: 'Rektor Undip Ke-10 & Pelopor Penetapan PTN-BH serta Green Campus',
        dateOrYear: '1954 – kini',
        leadershipPeriod: 'Rektor Undip 2010–2015',
        imageKey: 'rector_sudharto_hadi',
        description:
          'Pakar sosiologi lingkungan hidup yang berhasil mengantarkan Undip meraih status prestisius sebagai Perguruan Tinggi Negeri Badan Hukum (PTN-BH) lewat PP No. 81/2014, serta menjadikan Kampus Tembalang sebagai Green Campus peringkat atas nasional.',
        details: [
          'Rektor Undip periode 2010–2015.',
          'Membawa Undip resmi ditetapkan sebagai PTN Badan Hukum (PTN-BH) oleh Presiden RI.',
          'Membangun waduk edukasi Tembalang, hutan kampus, dan fasilitas ramah lingkungan berkelanjutan.',
        ],
        quote: '“Kelestarian lingkungan bukan pilihan sampingan, melainkan komitmen moral utama peradaban modern.”',
      },
      {
        id: 'rector-11-yos-johan',
        title: '11. Prof. Dr. Yos Johan Utama, S.H., M.Hum.',
        subtitle: 'Rektor Undip Ke-11 & Arsitek World Class University Bereputasi Global',
        dateOrYear: '1962 – kini',
        leadershipPeriod: 'Rektor Undip 2015–2024 (Dua Periode)',
        imageKey: 'rector_yos_johan',
        description:
          'Memimpin transformasi besar Undip selama dua periode masa bakti sebagai PTN-BH mandiri. Di bawah kepemimpinannya, Undip melesat ke ranking top dunia (QS World University Rankings), meraih akreditasi unggul, serta memperluas fasilitas riset mutakhir.',
        details: [
          'Rektor Undip dua periode masa jabatan (2015–2024).',
          'Melesatkan Undip menjadi universitas riset unggul bereputasi internasional berakreditasi A/Unggul.',
          'Membangun gedung kuliah bersama terpadu, laboratorium sentral, dan stadion megah Tembalang.',
        ],
        quote: '“Undip Bermartabat, Undip Bermanfaat: mencetak cendekia berkarakter tangguh yang siap mengabdi bagi kemajuan nusantara.”',
      },
      {
        id: 'rector-12-suharnomo',
        title: '12. Prof. Dr. Suharnomo, S.E., M.Si.',
        subtitle: 'Rektor Undip Ke-12 (Petahana 2024–2029) — Akselerasi Transformasi & Kemanfaatan',
        dateOrYear: '1970 – kini',
        leadershipPeriod: 'Rektor Undip 2024–2029 (Petahana)',
        imageKey: 'rector_suharnomo',
        description:
          'Pakar manajemen sumber daya manusia dan kepemimpinan bisnis yang dilantik pada 29 April 2024. Beliau mengusung program akselerasi hilirisasi riset, link-and-match dengan industri global, transformasi digital cerdas, serta peneguhan budaya inovasi sivitas akademika.',
        details: [
          'Rektor Universitas Diponegoro masa bakti aktif 2024–2029.',
          'Fokus pada hilirisasi produk inovasi riset dosen dan mahasiswa ke dunia industri.',
          'Memperkuat program beasiswa mahasiswa dan kesejahteraan sivitas akademika almamater.',
        ],
        quote: '“Perguruan tinggi harus hadir memberi solusi konkret, menjunjung integritas ilmu, dan menebarkan kemanfaatan nyata bagi peradaban bangsa.”',
      },
    ],
  },
}
