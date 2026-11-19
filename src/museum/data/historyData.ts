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
  code:
    | 'history'
    | 'archive'
    | 'photos'
    | 'documents'
    | 'founders'
    | 'z2_miniature'
    | 'z2_faculties'
    | 'z2_campus_transformation'
    | 'z2_research'
    | 'z2_achievements'
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

export interface MuseumZoneInfo {
  id: string
  zoneNumber: number
  code: string
  name: string
  subtitle: string
  theme: string
  status: 'available' | 'coming-soon'
  spawnPos: [number, number, number]
  spawnRotationY: number
}

export const MUSEUM_ZONES: MuseumZoneInfo[] = [
  {
    id: 'zone-1',
    zoneNumber: 1,
    code: 'origin',
    name: 'Zona 1 — The Origin of Undip',
    subtitle: 'Kronik Pendirian, Arsip Otentik & Galeri Pimpinan Rektorat 1957',
    theme: 'Sejarah Awal & Warisan Pendiri',
    status: 'available',
    spawnPos: [0, 1.68, 3.4],
    spawnRotationY: 0,
  },
  {
    id: 'zone-2',
    zoneNumber: 2,
    code: 'growth',
    name: 'Zona 2 — The Growth of Knowledge',
    subtitle: 'Perkembangan Fakultas, Transformasi Kampus & Riset Kelautan',
    theme: 'Evolusi Keilmuan & Perluasan Kampus',
    status: 'available',
    spawnPos: [0, 1.68, 5.2],
    spawnRotationY: 0,
  },
  {
    id: 'zone-3',
    zoneNumber: 3,
    code: 'heritage',
    name: 'Zona 3 — The Heritage of Undip',
    subtitle: 'Koleksi Pusaka, Nilai Kejuangan & Tradisi Almamater',
    theme: 'Warisan Nilai Budaya Almamater',
    status: 'coming-soon',
    spawnPos: [0, 1.68, 0],
    spawnRotationY: 0,
  },
  {
    id: 'zone-4',
    zoneNumber: 4,
    code: 'today',
    name: 'Zona 4 — Undip Today',
    subtitle: 'Prestasi Global, PTN-BH Mandiri & World Class University',
    theme: 'Reputasi Internasional Masa Kini',
    status: 'coming-soon',
    spawnPos: [0, 1.68, 0],
    spawnRotationY: 0,
  },
  {
    id: 'zone-5',
    zoneNumber: 5,
    code: 'future',
    name: 'Zona 5 — Undip Future',
    subtitle: 'Inovasi Digital, Green Energy & Visi Menuju Indonesia Emas',
    theme: 'Cetak Biru Masa Depan Almamater',
    status: 'coming-soon',
    spawnPos: [0, 1.68, 0],
    spawnRotationY: 0,
  },
]

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

  // =========================================================================
  // ZONA 2 — THE GROWTH OF KNOWLEDGE
  // =========================================================================

  z2_miniature: {
    id: 'z2_miniature',
    code: 'z2_miniature',
    zoneNumber: 2,
    areaName: 'Pusat Ruangan · Meja Vitrine Miniatur Arsitektur Kampus',
    title: 'Miniatur 3D Transformasi Kawasan Kampus Undip',
    subtitle: 'Zona 2 — The Growth of Knowledge: Dari Pleburan Menuju Kampus Terpadu Tembalang & Teluk Awur',
    badgeText: 'Zona 2 — Central 3D Miniature',
    mainDescription:
      'Diorama miniatur arsitektur 3D di tengah ruangan ini merepresentasikan lompatan spasial dan fisik Universitas Diponegoro. Dari cikal bakal kampus sewaan di Gedung GRIS Jl. Pemuda (1957) dan Kampus Pleburan, hingga terwujudnya kampus terpadu seluas lebih dari 180 hektar di perbukitan Tembalang serta kampus pesisir kelautan seluas 52 hektar di Teluk Awur, Jepara.',
    historicalContext:
      'Gagasan pemindahan kampus dari Pleburan ke perbukitan Tembalang digagas oleh Rektor Prof. Mr. Soedarto, S.H. pada akhir dekade 1970-an karena daya tampung Pleburan sudah tidak mencukupi laju pertumbuhan mahasiswa. Rencana tersebut dilanjutkan dan diresmikan oleh Prof. Dr. Muladi, S.H., menjadikan Tembalang salah satu kawasan kampus hijau terpadu terbesar di Indonesia.',
    significance:
      'Miniatur ini memvisualisasikan harmoni antara arsitektur ikonik (Gedung Rektorat Widya Puraya berciri atap limas bertingkat), danau resapan waduk pendidikan, hutan kampus tropis, dan kompleks fakultas modern.',
    stats: [
      { label: 'Luas Kampus Tembalang', value: '± 180 Hektar' },
      { label: 'Perintis Pembebasan', value: 'Prof. Mr. Soedarto, S.H.' },
      { label: 'Landmark Ikonik', value: 'Gedung Widya Puraya' },
      { label: 'Kampus Bahari', value: 'Teluk Awur Jepara (52 Ha)' },
    ],
    items: [
      {
        id: 'z2-mini-widya-puraya',
        title: '1. Gedung Rektorat Widya Puraya & Menara Jam',
        subtitle: 'Pusat Administrasi Sentral & Ikon Kemegahan Tembalang',
        dateOrYear: 'Diresmikan 1989',
        imageKey: 'z2_img_widya_puraya',
        description:
          'Gedung Widya Puraya dengan arsitektur limas piramida bertingkat tiga dan menara jam sentral merupakan landmark paling ikonik di Kampus Tembalang. Gedung ini menaungi rektorat, aula wisuda agung, dan biro administrasi utama.',
        details: [
          'Arsitektur mengadopsi falsafah punden berundak dan joglo ksatria Jawa bernuansa megah.',
          'Dikelilingi pelataran upacara luas, kolam refleksi air mancur, dan jalur pedestrian rindang.',
          'Menjadi titik pusat poros tata ruang orientasi seluruh klaster fakultas di Tembalang.',
        ],
        quote: '“Widya Puraya melambangkan istana ilmu pengetahuan tempat bertemunya dedikasi riset dan keluhuran budi pekerti.”',
      },
      {
        id: 'z2-mini-waduk-pendidikan',
        title: '2. Waduk Pendidikan & Sistem Tata Air Mandiri',
        subtitle: 'Konservasi Lingkungan Hidup, Green Campus & Pengendali Air Terpadu',
        dateOrYear: '2013 – kini',
        imageKey: 'z2_img_waduk',
        description:
          'Waduk buatan terpadu di kawasan barat laut kampus yang dibangun sebagai sarana edukasi hidrologi, resapan air bawah tanah, pencegah banjir limpasan, serta wahana rekreasi ekologis bagi sivitas akademika.',
        details: [
          'Kapasitas tampung air ratusan ribu meter kubik untuk menjaga muka air tanah Tembalang.',
          'Dikelilingi jogging track, hutan pinus kampus, dan pos pengamatan burung liar.',
          'Mendukung Undip meraih peringkat ke-2 nasional perguruan tinggi hijau berkelanjutan versi UI GreenMetric.',
        ],
        quote: '“Menjaga air dan tanah adalah wujud nyata penghormatan universitas kepada kelestarian alam semesta.”',
      },
      {
        id: 'z2-mini-klaster-fakultas',
        title: '3. Klaster Fakultas Sains, Teknologi, Kedokteran & Soshum',
        subtitle: 'Zonasi Terencana untuk Kolaborasi Keilmuan Antardisiplin',
        dateOrYear: '1986 – kini',
        imageKey: 'z2_img_faculty_cluster',
        description:
          'Kampus Tembalang ditata dalam klaster keilmuan yang saling terhubung: klaster teknik & MIPA di sayap timur, klaster agrokompleks & kedokteran di sayap utara, serta klaster sosial humaniora di sayap selatan.',
        details: [
          'Setiap fakultas dilengkapi laboratorium khusus, perpustakaan cabang, dan ruang kuliah multimedia.',
          'Jaringan jalan lingkar kampus (Inner & Outer Ring Road) memudahkan mobilitas transportasi ramah lingkungan.',
          'Terintegrasi dengan bus kampus gratis (Diponegoro Shuttle Bus) berbahan bakar ramah lingkungan.',
        ],
      },
      {
        id: 'z2-mini-rsnd',
        title: '4. Rumah Sakit Nasional Diponegoro (RSND)',
        subtitle: 'Pusat Pendidikan Kedokteran Terpadu & Rumah Sakit Rujukan Jawa Tengah',
        dateOrYear: 'Diresmikan 2014',
        imageKey: 'z2_img_rsnd',
        description:
          'Rumah Sakit Pendidikan utama milik Undip tipe B dengan kapasitas lebih dari 300 tempat tidur, dilengkapi fasilitas radioterapi canggih, cath lab jantung, ruang isolasi negatif, dan pusat riset klinis.',
        details: [
          'Sarana praktik utama mahasiswa Fakultas Kedokteran, Keperawatan, Gizi, dan Farmasi.',
          'Berfungsi sebagai rumah sakit tanggap darurat utama pada masa pandemi dan pusat pengabdian kesehatan masyarakat.',
          'Melayani masyarakat umum dan sivitas akademika dengan sistem digital terintegrasi.',
        ],
      },
      {
        id: 'z2-mini-teluk-awur',
        title: '5. Kampus & Marine Science Techno Park Teluk Awur Jepara',
        subtitle: 'Pusat Keunggulan Eksplorasi Kelautan, Bioteknologi Pesisir & Konservasi',
        dateOrYear: '1987 – kini',
        imageKey: 'z2_img_teluk_awur',
        description:
          'Kampus tepi pantai seluas 52 hektar di Kabupaten Jepara yang menjadi basis penelitian Fakultas Perikanan dan Ilmu Kelautan, dilengkapi dermaga riset kapal latih, tambak percontohan, dan laboratorium basah oseanografi.',
        details: [
          'Pusat implementasi Pola Ilmiah Pokok (PIP) Pengembangan Wilayah Pesisir dan Kelautan.',
          'Menjadi rujukan nasional riset terumbu karang, mangrove, budidaya udang vaname, dan mikroalga.',
          'Menghubungkan akademisi Undip dengan nelayan tradisional pesisir pantai utara Jawa.',
        ],
      },
    ],
  },

  z2_faculties: {
    id: 'z2_faculties',
    code: 'z2_faculties',
    zoneNumber: 2,
    areaName: 'Sayap Barat · Panel & Galeri Perkembangan Fakultas',
    title: 'Evolusi & Perkembangan Fakultas Universitas Diponegoro',
    subtitle: 'Zona 2 — The Growth of Knowledge: Transformasi 4 Fakultas Perintis Menjadi 11 Fakultas & 2 Sekolah',
    badgeText: 'Zona 2 — Faculty Development',
    mainDescription:
      'Area pameran sayap barat mendokumentasikan estafet pemekaran struktur akademik Undip. Bermula dari empat unit pendidikan perintis pada tahun 1957 (Hukum, Ekonomi, Teknik, dan Akademi Tata Praja), Undip secara konsisten menumbuhkan cabang-cabang keilmuan strategis hingga kini menaungi 11 Fakultas, 1 Sekolah Pascasarjana, dan 1 Sekolah Vokasi.',
    historicalContext:
      'Pendirian setiap fakultas selalu merespons kebutuhan nyata pembangunan nasional: kebutuhan insinyur sipil dan perkapalan melahirkan Fakultas Teknik; kebutuhan tenaga medis mendorong berdirinya Fakultas Kedokteran bersama RS Dr. Kariadi; dan keunggulan maritim Indonesia melahirkan Fakultas Perikanan dan Ilmu Kelautan.',
    significance:
      'Keragaman 11 fakultas dan 2 sekolah ini mencerminkan komitmen Undip dalam merawat keutuhan ilmu pengetahuan dari sains dasar, teknologi terapan, hingga seni dan humaniora.',
    stats: [
      { label: 'Fakultas Perintis 1957', value: 'Hukum, Ekonomi, Teknik' },
      { label: 'Jumlah Fakultas Kini', value: '11 Fakultas Mandiri' },
      { label: 'Sekolah Khusus', value: 'Pascasarjana & Vokasi' },
      { label: 'Program Studi', value: '170+ Program Studi' },
    ],
    items: [
      {
        id: 'z2-fac-hukum',
        title: '1. Fakultas Hukum (FH) — 1957',
        subtitle: 'Fakultas Tertua & Kawah Candradimuka Pakar Hukum Nasional',
        dateOrYear: 'Berdiri 1957',
        imageKey: 'z2_img_fac_hukum',
        description:
          'Fakultas tertua di Undip yang melahirkan tokoh-tokoh hukum terkemuka Republik Indonesia seperti Prof. Mr. Soedarto, Prof. Muladi, Prof. Satjipto Rahardjo (pencetus Hukum Progresif), dan Prof. Barda Nawawi Arief.',
        details: [
          'Memiliki reputasi akreditasi internasional FIBAA dan akreditasi Unggul BAN-PT.',
          'Mencetuskan mazhab "Hukum Progresif" yang mengedepankan keadilan substantif kemanusiaan.',
          'Pencetak hakim agung, menteri, jaksa, advokat, dan akademisi hukum terkemuka nasional.',
        ],
        quote: '“Hukum adalah untuk manusia, bukan manusia untuk hukum.” — Prof. Satjipto Rahardjo, S.H.',
      },
      {
        id: 'z2-fac-feb',
        title: '2. Fakultas Ekonomika dan Bisnis (FEB) — 1957',
        subtitle: 'Pusat Kajian Manajemen, Akuntansi, dan Kebijakan Perekonomian',
        dateOrYear: 'Berdiri 1957',
        imageKey: 'z2_img_fac_feb',
        description:
          'Dirintis sejak era Universitas Semarang, FEB Undip telah meraih akreditasi prestisius internasional AACSB (Association to Advance Collegiate Schools of Business), menempatkannya dalam jajaran sekolah bisnis elit dunia.',
        details: [
          'Menyelenggarakan program studi Manajemen, Akuntansi, Ilmu Ekonomi, dan Ekonomi Islam.',
          'Memiliki laboratorium Bloomberg Financial Terminal dan ruang sidang simulasi bursa efek.',
          'Mencetak bankir, ekonom pemerintah, wirausahawan, dan pengambil kebijakan fiskal nasional.',
        ],
      },
      {
        id: 'z2-fac-teknik',
        title: '3. Fakultas Teknik (FT) — 1957',
        subtitle: 'Perintis Inovasi Rekayasa Infrastruktur, Kemaritiman & Energi Hijau',
        dateOrYear: 'Berdiri 1957',
        imageKey: 'z2_img_fac_teknik',
        description:
          'Bermula dari Jurusan Teknik Sipil di Pleburan pada 1957, Fakultas Teknik kini memiliki 12 departemen termasuk Teknik Perkapalan, Geodesi, Arsitektur, Kimia, Mesin, Elektro, Lingkungan, dan Geologi.',
        details: [
          'Laboratorium rekayasa perkapalan dan tangki uji tarik model kapal berstandar internasional.',
          'Pelopor mobil formula listrik mahasiswa dan kapal tanpa awak (autonomous surface vehicle).',
          'Berperan aktif dalam perancangan infrastruktur jalan tol, jembatan, bendungan, dan pelabuhan nasional.',
        ],
      },
      {
        id: 'z2-fac-kedokteran',
        title: '4. Fakultas Kedokteran (FK) — 1961',
        subtitle: 'Pusat Keunggulan Ilmu Biomedis, Kedokteran Tropis & Keperawatan Terpadu',
        dateOrYear: 'Berdiri 1961',
        imageKey: 'z2_img_fac_kedokteran',
        description:
          'Diresmikan melalui kerja sama dengan RSUP Dr. Kariadi Semarang, FK Undip berkembang pesat menjadi institusi pendidikan dokter spesialis dan subspesialis terkemuka di tanah air.',
        details: [
          'Memiliki jejaring rumah sakit pendidikan: RSUP Dr. Kariadi dan Rumah Sakit Nasional Diponegoro (RSND).',
          'Pusat riset genetika molekuler, onkologi, penyakit infeksi tropis, dan kesehatan reproduksi.',
          'Menghasilkan ribuan dokter spesialis yang mengabdi di daerah 3T (Terdepan, Terluar, Tertinggal).',
        ],
      },
      {
        id: 'z2-fac-fpp',
        title: '5. Fakultas Peternakan dan Pertanian (FPP) — 1964',
        subtitle: 'Kedaulatan Pangan, Pemuliaan Ternak Tropis & Agribisnis Berkelanjutan',
        dateOrYear: 'Berdiri 1964',
        imageKey: 'z2_img_fac_fpp',
        description:
          'Berperan penting dalam riset pemuliaan sapi potong Jawa, unggas lokal, dan teknologi pengolahan hasil panen berbasis kearifan lokal Jawa Tengah.',
        details: [
          'Memiliki Teaching Farm dan instalasi kandang modern seluas belasan hektar di Tembalang.',
          'Mengembangkan pakan fermentasi konsentrat murah untuk meningkatkan bobot ternak rakyat.',
          'Inovator varietas padi organik tahan hama dan pupuk hayati ramah lingkungan.',
        ],
      },
      {
        id: 'z2-fac-fib',
        title: '6. Fakultas Ilmu Budaya (FIB) — 1965',
        subtitle: 'Pelestari Bahasa, Sastra, Sejarah Nusantara & Arkeologi Maritim',
        dateOrYear: 'Berdiri 1965',
        imageKey: 'z2_img_fac_fib',
        description:
          'Memayungi kajian sastra Indonesia, Inggris, Jepang, sejarah, ilmu perpustakaan, dan antropologi budaya guna meneguhkan identitas kebangsaan Indonesia.',
        details: [
          'Pusat pengkajian naskah kuno (filologi) pesisir dan manuskrip Jawa Pegon.',
          'Eksplorasi arkeologi pelabuhan kuno di pesisir utara Pulau Jawa.',
          'Membina sanggar seni gamelan, tari tradisional Diponegoro, dan diplomasi budaya internasional.',
        ],
      },
      {
        id: 'z2-fac-fisip',
        title: '7. Fakultas Ilmu Sosial dan Ilmu Politik (FISIP) — 1968',
        subtitle: 'Kajian Kebijakan Publik, Tata Kelola Pemerintahan & Komunikasi Strategis',
        dateOrYear: 'Berdiri 1968',
        imageKey: 'z2_img_fac_fisip',
        description:
          'Berasal dari Akademi Tata Praja 1957, FISIP Undip membina kader pemimpin birokrasi, diplomat luar negeri, akademisi politik, dan profesional media massa.',
        details: [
          'Menyelenggarakan program Administrasi Publik, Ilmu Komunikasi, Hubungan Internasional, dan Pemerintahan.',
          'Laboratorium audio-visual penyiaran dan media center komunikasi modern.',
          'Rujukan analisis kebijakan pemilu, otonomi daerah, dan studi diplomasi regional Asia Tenggara.',
        ],
      },
      {
        id: 'z2-fac-fpik',
        title: '8. Fakultas Perikanan dan Ilmu Kelautan (FPIK) — 1968/1994',
        subtitle: 'Ujung Tombak Pola Ilmiah Pokok Bahari & Bioteknologi Kelautan',
        dateOrYear: '1968 / 1994',
        imageKey: 'z2_img_fac_fpik',
        description:
          'Menjadi tulang punggung Pola Ilmiah Pokok (PIP) Undip dalam mengelola potensi kemaritiman Indonesia melalui riset oseanografi, budidaya perairan, dan teknologi hasil perikanan.',
        details: [
          'Mengelola Stasiun Riset Maritim Teluk Awur seluas 52 Ha di Kabupaten Jepara.',
          'Memiliki armada kapal latih riset KM Diponegoro untuk ekspedisi oseanografi laut dalam.',
          'Pionir formulasi kosmetik dan farmasi berbahan baku senyawa aktif rumput laut dan alga mikro.',
        ],
      },
      {
        id: 'z2-fac-fsm',
        title: '9. Fakultas Sains dan Matematika (FSM) — 1988/1993',
        subtitle: 'Fondasi Sains Murni, Komputasi Cerdas & Rekayasa Nanoteknologi',
        dateOrYear: '1988 / 1993',
        imageKey: 'z2_img_fac_fsm',
        description:
          'Mengembangkan riset sains fundamental (Matematika, Fisika, Kimia, Biologi, Statistika, Informatika) sebagai tulang punggung penemuan teknologi masa depan.',
        details: [
          'Pusat Riset Plasma & Nanoteknologi (Center for Plasma Research) berpaten internasional.',
          'Mengembangkan aplikasi kecerdasan buatan (AI), data science, dan komputasi awan berkecepatan tinggi.',
          'Penghasil publikasi jurnal internasional terindeks Scopus terbanyak di lingkungan Undip.',
        ],
      },
      {
        id: 'z2-fac-fkm',
        title: '10. Fakultas Kesehatan Masyarakat (FKM) — 1993/2001',
        subtitle: 'Pencegahan Penyakit, Promosi Kesehatan & Epidemiologi Tropis',
        dateOrYear: '1993 / 2001',
        imageKey: 'z2_img_fac_fkm',
        description:
          'Berfokus pada promotif dan preventif kesehatan masyarakat, kesehatan lingkungan kerja, dan manajemen rumah sakit.',
        details: [
          'Laboratorium surveilans epidemiologi penyakit tular vektor (DBD, malaria, leptospirosis).',
          'Aktif merumuskan pedoman gizi seimbang untuk penanganan stunting di wilayah pedesaan.',
          'Pusat kajian Keselamatan dan Kesehatan Kerja (K3) pada sektor industri manufaktur dan maritim.',
        ],
      },
      {
        id: 'z2-fac-psikologi',
        title: '11. Fakultas Psikologi — 2007',
        subtitle: 'Pengembangan Potensi Manusia, Psikometri & Kesehatan Mental Komunitas',
        dateOrYear: 'Berdiri 2007',
        imageKey: 'z2_img_fac_psikologi',
        description:
          'Mempelajari dinamika kepribadian, asesmen psikologis klinis, psikologi industri organisasi, dan pendampingan trauma healing pascabencana.',
        details: [
          'Pusat layanan psikologi terpadu bagi mahasiswa dan masyarakat umum.',
          'Inovasi alat ukur psikometri adaptif berbasis komputer untuk seleksi sumber daya manusia.',
          'Program pendampingan kesehatan mental sekolah ramah anak dan inklusi disabilitas.',
        ],
      },
      {
        id: 'z2-fac-pasca-vokasi',
        title: '12. Sekolah Pascasarjana & Sekolah Vokasi',
        subtitle: 'Pendidikan Interdisiplin & Penguatan Keterampilan Industri Terapan',
        dateOrYear: '1999 & 2016',
        imageKey: 'z2_img_fac_vokasi',
        description:
          'Sekolah Pascasarjana mengelola studi multidisiplin seperti Ilmu Lingkungan dan Energi, sedangkan Sekolah Vokasi menyelenggarakan sarjana terapan (D4) link-and-match dengan industri manufaktur dan jasa.',
        details: [
          'Sekolah Vokasi memiliki Teaching Factory modern kerja sama dengan industri multinasional.',
          'Sekolah Pascasarjana membidani riset disertasi lintas ilmu berorientasi solusi strategis bangsa.',
          'Tingkat keterserapan lulusan vokasi mencapai 90% sebelum upacara wisuda.',
        ],
      },
    ],
  },

  z2_campus_transformation: {
    id: 'z2_campus_transformation',
    code: 'z2_campus_transformation',
    zoneNumber: 2,
    areaName: 'Dinding Utara · Galeri Transformasi Kampus dari Masa ke Masa',
    title: 'Dokumentasi Transformasi Infrastruktur & Lanskap Kampus',
    subtitle: 'Zona 2 — The Growth of Knowledge: Dari GRIS Jl. Pemuda, Pleburan Hingga Megaproyek Tembalang',
    badgeText: 'Zona 2 — Campus Transformation',
    mainDescription:
      'Dinding pameran utara menyajikan foto-foto komparatif metamorfosis fisik Universitas Diponegoro selama lebih dari enam dekade. Penataan ruang kampus merefleksikan dinamika pertambahan mahasiswa dan visi jangka panjang untuk mewujudkan kawasan riset terintegrasi berwawasan lingkungan.',
    historicalContext:
      'Sebelum terpusat di Tembalang, aktivitas perkuliahan terpencar di puluhan lokasi di Kota Semarang: Gedung GRIS di Jalan Pemuda, Kampus Pleburan di Jl. Hayam Wuruk, Jl. Imam Bardjo, hingga Jl. Dr. Soetomo. Integrasi fisik ke Tembalang pada dekade 1980-an hingga 2000-an menyatukan seluruh fakultas ke dalam satu ekosistem akademik yang solid.',
    significance:
      'Transformasi kampus dari fasilitas darurat menjadi salah satu kota kampus terindah di Asia Tenggara membuktikan ketangguhan dedikasi para pimpinan dan sivitas akademika Undip.',
    stats: [
      { label: 'Era Perintisan', value: 'GRIS & Pleburan (1957)' },
      { label: 'Masterplan Tembalang', value: '180 Hektar (1977)' },
      { label: 'Relokasi Penuh', value: 'Tahun 1990-an — 2010' },
      { label: 'Status Kawasan', value: 'Kota Kampus Berkelanjutan' },
    ],
    items: [
      {
        id: 'z2-trans-gris',
        title: '1. Gedung GRIS Jl. Pemuda (1957) — Titik Awal',
        subtitle: 'Gedung Rakyat Indonesia Semarang, Tempat Kuliah Perdana 142 Mahasiswa',
        dateOrYear: '1957',
        imageKey: 'z2_img_trans_gris',
        description:
          'Foto arsip memperlihatkan aula GRIS Jl. Pemuda yang dipinjamkan oleh Pemerintah Kotapraja Semarang. Di ruangan beratap genteng tinggi inilah mahasiswa pertama menyimak orasi Mr. Imam Bardjo dengan penerangan lampu gantung klasik.',
      },
      {
        id: 'z2-trans-pleburan',
        title: '2. Kampus Pleburan Masa Keemasan (1960–1980-an)',
        subtitle: 'Kompleks Gedung Kolonial Tropis di Semarang Bawah',
        dateOrYear: '1960-an',
        imageKey: 'z2_img_trans_pleburan',
        description:
          'Kampus Pleburan dengan ciri khas gedung putih berdaun jendela krepyak kayu dan halaman rumput luas menjadi saksi tumbuhnya fakultas-fakultas awal sebelum kepindahan ke Tembalang.',
      },
      {
        id: 'z2-trans-blueprint-tembalang',
        title: '3. Cetak Biru & Pembebasan Lahan Tembalang (1977)',
        subtitle: 'Visi Berani Rektor Soedarto Membuka Perbukitan Selatan Semarang',
        dateOrYear: '1977',
        imageKey: 'z2_img_trans_blueprint',
        description:
          'Peta masterplan rancangan awal pembebasan lahan perbukitan Tembalang seluas 180 hektar. Saat itu kawasan Tembalang masih berupa tegalan tandus dan perkebunan karet yang sepi.',
      },
      {
        id: 'z2-trans-widya-puraya-build',
        title: '4. Konstruksi Gedung Widya Puraya (1986–1989)',
        subtitle: 'Pembangunan Megastruktur Limas dan Menara Jam Sentral',
        dateOrYear: '1986 – 1989',
        imageKey: 'z2_img_trans_widya_build',
        description:
          'Dokumentasi langka proses pengecoran beton bertulang atap limas bertingkat Gedung Widya Puraya yang dikerjakan oleh para insinyur alumni Fakultas Teknik Undip.',
      },
      {
        id: 'z2-trans-rsnd-inauguration',
        title: '5. Pembangunan Rumah Sakit Nasional Diponegoro (2010–2014)',
        subtitle: 'Pusat Riset Kesehatan & Pelayanan Medis Paripurna',
        dateOrYear: '2014',
        imageKey: 'z2_img_trans_rsnd',
        description:
          'Pembangunan gedung rumah sakit pendidikan modern 8 lantai di kawasan barat Kampus Tembalang yang memperkuat kapasitas riset kedokteran dan layanan rujukan medis di Jawa Tengah.',
      },
      {
        id: 'z2-trans-green-eco',
        title: '6. Lanskap Kampus Hijau & Danau Resapan Edukasi',
        subtitle: 'Integrasi Hutan Kampus Tropis, Jalur Sepeda, dan Energi Surya',
        dateOrYear: 'Era Modern',
        imageKey: 'z2_img_trans_eco',
        description:
          'Panorama udara Kampus Tembalang masa kini yang dikelilingi pepohonan rimbun, waduk air edukasi, dan instalasi panel surya atap gedung kuliah.',
      },
    ],
  },

  z2_research: {
    id: 'z2_research',
    code: 'z2_research',
    zoneNumber: 2,
    areaName: 'Sayap Timur · Ruang Arsip Akademik & Riset Keilmuan',
    title: 'Pengembangan Pendidikan, Riset Kelautan & Laboratorium Unggulan',
    subtitle: 'Zona 2 — The Growth of Knowledge: Pola Ilmiah Pokok Pesisir (Coastal Eco-Development) & Inovasi Sains',
    badgeText: 'Zona 2 — Research & Education',
    mainDescription:
      'Sayap timur museum menampilkan rekam jejak riset dan pengembangan keilmuan Universitas Diponegoro. Sebagai perguruan tinggi berwawasan maritim, Undip menetapkan Pola Ilmiah Pokok (PIP) bertema "Pengembangan Wilayah Pesisir dan Lautan" (Coastal Region Eco-Development) yang menjadi rujukan riset kemaritiman tropis nasional.',
    historicalContext:
      'Sejak ditetapkan pada tahun 1974, Pola Ilmiah Pokok memandu kolaborasi antarfakultas: Fakultas Teknik meneliti konstruksi pelabuhan dan gelombang laut; FPIK meneliti ekosistem mangrove dan perikanan tangkap; Fakultas Hukum merumuskan hukum laut dan batas maritim; sedangkan FEB mengkaji ekonomi maritim dan kesejahteraan nelayan.',
    significance:
      'Kiprah riset ini diperkuat dengan fasilitas laboratorium sentral terpadu berstandar internasional, stasiun riset Teluk Awur, serta puluhan jurnal ilmiah terakreditasi internasional yang mempublikasikan ribuan karya ilmiah sivitas akademika setiap tahunnya.',
    stats: [
      { label: 'Pola Ilmiah Pokok', value: 'Coastal Region Eco-Development' },
      { label: 'Stasiun Riset Laut', value: 'Teluk Awur Jepara (52 Ha)' },
      { label: 'Laboratorium Sentral', value: 'Integrated Lab Tembalang' },
      { label: 'Publikasi Ilmiah', value: 'Ribuan Artikel Scopus/WOS' },
    ],
    items: [
      {
        id: 'z2-res-pip-charter',
        title: '1. Piagam Pola Ilmiah Pokok (PIP) Pengembangan Pesisir — 1974',
        subtitle: 'Landasan Filosofis Riset Kemaritiman Universitas Diponegoro',
        dateOrYear: '1974',
        imageKey: 'z2_img_res_pip',
        description:
          'Naskah penetapan Pola Ilmiah Pokok yang mengarahkan tridharma perguruan tinggi Undip untuk menggali potensi, mengonservasi, dan menyejahterakan masyarakat wilayah pesisir nusantara.',
      },
      {
        id: 'z2-res-marine-station',
        title: '2. Stasiun Oseanografi & Konservasi Terumbu Karang Teluk Awur',
        subtitle: 'Laboratorium Basah Eksplorasi Hayati Laut Dangkal & Pesisir',
        dateOrYear: '1987 – kini',
        imageKey: 'z2_img_res_station',
        description:
          'Fasilitas riset tepi pantai di Jepara yang menjadi laboratorium alam bagi peneliti dunia dalam mempelajari pemulihan terumbu karang (coral transplantation), ekologi lamun, dan pemetaan dinamika arus laut Jawa.',
      },
      {
        id: 'z2-res-integrated-lab',
        title: '3. Laboratorium Terpadu & Clean Room Sentral Tembalang',
        subtitle: 'Peralatan Spektroskopi, Mikroskopi Elektron & Analisis Kimia Presisi',
        dateOrYear: '2015 – kini',
        imageKey: 'z2_img_res_intlab',
        description:
          'Gedung laboratorium modern berstandar ISO 17025 yang dilengkapi instrumen uji mutakhir (SEM, TEM, XRD, HPLC, GC-MS) untuk mendukung penelitian sains dasar, rekayasa material maju, dan formulasi obat.',
      },
      {
        id: 'z2-res-scopus-journals',
        title: '4. Galeri Jurnal Ilmiah Bereputasi Internasional (Scopus Q1/Q2)',
        subtitle: 'Diseminasi Pengetahuan Global Karya Dosen dan Peneliti Undip',
        dateOrYear: 'Koleksi Publikasi',
        imageKey: 'z2_img_res_journals',
        description:
          'Pameran jurnal-jurnal ilmiah kebanggaan Undip yang terindeks bereputasi dunia, seperti Bulletin of Chemical Reaction Engineering & Catalysis (BCREC) dan Journal of Coastal Development.',
      },
      {
        id: 'z2-res-clean-energy',
        title: '5. Inovasi Desalinisasi Air Laut & Pembangkit Energi Ramah Lingkungan',
        subtitle: 'Teknologi Tepat Guna untuk Masyarakat Pulau Terpencil',
        dateOrYear: 'Inovasi Terapan',
        imageKey: 'z2_img_res_energy',
        description:
          'Alat destilasi air laut bertenaga surya dan turbin angin pesisir skala mikro karya periset teknik Undip yang telah dioperasikan di pulau-pulau kecil di Kepulauan Karimunjawa.',
      },
    ],
  },

  z2_achievements: {
    id: 'z2_achievements',
    code: 'z2_achievements',
    zoneNumber: 2,
    areaName: 'Dinding Selatan · Galeri Prestasi & Pengabdian Masyarakat',
    title: 'Prestasi Akademik, Inovasi Mahasiswa & Pelopor KKN Pengabdian Masyarakat',
    subtitle: 'Zona 2 — The Growth of Knowledge: Dari KKN Perintis Desa Hingga Rekor Employability Dunia',
    badgeText: 'Zona 2 — Achievements & Contribution',
    mainDescription:
      'Dinding pameran selatan mempersembahkan bukti nyata kontribusi Universitas Diponegoro bagi bangsa dan dunia. Sejak era 1970-an, Undip telah menjadi pionir program Kuliah Kerja Nyata (KKN) mahasiswa di perdesaan, sekaligus menorehkan prestasi gemilang dalam kompetisi inovasi teknologi, keberlanjutan kampus, dan rekor daya serap lulusan.',
    historicalContext:
      'Semangat kepahlawanan Pangeran Diponegoro menjiwai setiap mahasiswa Undip untuk tidak sekadar unggul di ruang kuliah, melainkan turun langsung ke masyarakat membawa solusi atas persoalan riil di desa-desa nelayan, pegunungan, dan perkotaan.',
    significance:
      'Prestasi ini membuktikan mutu lulusan Undip yang adaptif, berkarakter tangguh, dan memiliki daya saing tinggi di kancah industri global.',
    stats: [
      { label: 'Pelopor KKN Tematik', value: 'Sejak Dekade 1970-an' },
      { label: 'Employability Ranking', value: 'Juara #1 & #2 di Indonesia (QS)' },
      { label: 'Prestasi Robotik', value: 'Juara Nasional & Internasional' },
      { label: 'Predikat Green Campus', value: 'Peringkat 2 Nasional' },
    ],
    items: [
      {
        id: 'z2-ach-kkn-pioneer',
        title: '1. Pelopor Kuliah Kerja Nyata (KKN) Tematik Nasional',
        subtitle: 'Pengabdian Mahasiswa Menembus Ribuan Desa di Jawa Tengah & Nusantara',
        dateOrYear: '1971 – kini',
        imageKey: 'z2_img_ach_kkn',
        description:
          'Undip merupakan salah satu dari tiga perguruan tinggi perintis program KKN di Indonesia bersama UGM dan Unhas. Ribuan mahasiswa setiap tahun diterjunkan ke desa untuk pemberdayaan UMKM, sanitasi lingkungan, dan edukasi hukum.',
      },
      {
        id: 'z2-ach-qs-employability',
        title: '2. Peringkat Tertinggi Lulusan Cepat Mendapat Kerja (QS GER)',
        subtitle: 'Keterserapan Alumni Undip di Dunia Kerja Tingkat Nasional & Asia',
        dateOrYear: '2020 – 2024',
        imageKey: 'z2_img_ach_qs',
        description:
          'Lembaga pemeringkatan dunia Quacquarelli Symonds menempatkan Undip di peringkat #1 dan #2 nasional dalam kategori Graduate Employability Rankings, membuktikan tingginya kepercayaan industri terhadap lulusan Undip.',
      },
      {
        id: 'z2-ach-robotic-eco',
        title: '3. Inovasi Mobil Hemat Energi & Robotik Bawah Air Diponegoro',
        subtitle: 'Juara Shell Eco-Marathon Asia & Kontes Robot Bawah Air Nasional',
        dateOrYear: '2016 – kini',
        imageKey: 'z2_img_ach_robot',
        description:
          'Kendaraan prototipe hemat energi bertenaga listrik dan etanol karya tim mahasiswa Fakultas Teknik yang mencetak rekor efisiensi jarak tempuh ratusan kilometer per kilowatt-hour di sirkuit internasional.',
      },
      {
        id: 'z2-ach-bionic-hand',
        title: '4. Tangan Bionik & Kaki Palsu Robotik untuk Disabilitas',
        subtitle: 'Pusat Riset Biomekatronika CBIOM3S Undip Berpenghargaan Nasional',
        dateOrYear: '2018 – kini',
        imageKey: 'z2_img_ach_bionic',
        description:
          'Inovasi tangan palsu prostetik bionik dengan sensor mioelektrik sensor otot yang dijual dengan harga terjangkau bagi para penyandang disabilitas dan korban kecelakaan kerja di seluruh Indonesia.',
      },
      {
        id: 'z2-ach-disaster-relief',
        title: '5. Tim Medis Darurat & Tanggap Bencana Diponegoro (Disaster Relief)',
        subtitle: 'Bakti Kemanusiaan Dokter, Relawan, dan Logistik Cepat Tanggap',
        dateOrYear: 'Bakti Kemanusiaan',
        imageKey: 'z2_img_ach_disaster',
        description:
          'Tim tanggap darurat sivitas akademika Undip yang secara konsisten terjun dalam penanganan medis darurat bencana gempa bumi, banjir lahar, dan tsunami di berbagai penjuru nusantara.',
      },
    ],
  },
}
