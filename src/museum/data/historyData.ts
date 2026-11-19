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
    | 'founders_5'
    | 'directors_13'
    | 'photos'
    | 'miniature'
    | 'bookshelf_z1'
    | 'bookshelf_z2'
    | 'bookshelf_z3'
    | 'bookshelf_z4'
    | 'bookshelf_z5'
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

export interface MuseumBookChapter {
  chapterNumber: number
  title: string
  pageHeader: string
  period: string
  imageKey?: string
  narrativeParagraphs: string[]
  keyMilestones?: string[]
  historicalQuote?: string
}

export interface MuseumBook {
  id: string
  shelfId: 'shelf_z1' | 'shelf_z2' | 'shelf_z3' | 'shelf_z4' | 'shelf_z5'
  shelfCategory: string
  zoneNumber: 1 | 2 | 3 | 4 | 5
  zoneName: string
  title: string
  subtitle: string
  spineLabel: string
  coverColor: string
  period: string
  synopsis: string
  chapters: MuseumBookChapter[]
  referenceUrl?: string
}

/**
 * Data 5 Pameran Fisik Utama Museum Undip
 * Wajib tampil sebagai objek fisik 3D di ruangan (tidak dimasukkan ke dalam buku)
 */
export const EXHIBIT_DATA: Record<string, ExhibitData> = {
  // 1. SEJARAH UTAMA UNDIP (Sayap Barat — Mimbar Baca & Dinding Sejarah)
  history: {
    id: 'history',
    code: 'history',
    zoneNumber: 1,
    areaName: 'Sayap Barat · Mimbar Baca & Naskah Sejarah Resmi',
    title: 'Sejarah Resmi Universitas Diponegoro (undip.ac.id/sejarah-2)',
    subtitle: 'Kronik Pendirian dari Universitas Semarang (1956/1957) hingga Penetapan PTN-BH',
    badgeText: 'Pameran Fisik 1 · Sejarah Utama Undip',
    mainDescription:
      'Berdasarkan catatan sejarah resmi Undip (undip.ac.id/sejarah-2), sekitar awal tahun 1950-an masyarakat Jawa Tengah khususnya Kota Semarang merasakan kebutuhan mendesak akan kehadiran lembaga pendidikan tinggi. Kebutuhan ini ditujukan untuk membantu pemerintah dalam penanganan pembangunan di segala bidang, sekaligus menampung para lulusan SMA di Jawa Tengah bagian utara yang saat itu jumlahnya terus meningkat pesat namun tidak tertampung di UGM Yogyakarta (satu-satunya universitas negeri di Jateng dan DIY saat itu).',
    historicalContext:
      'Guna mewujudkan cita-cita mulia tersebut, dibentuklah Yayasan Universitas Semarang berdasarkan Akta Notaris R.M. Soeprapto No. 59 tanggal 4 Desember 1956. Langkah bersejarah ini menjadi landasan formal berdirinya "Universitas Semarang" yang secara resmi dibuka pada 9 Januari 1957 dengan Mr. Imam Bardjo sebagai Presiden Universitas (Rektor) pertama. Pada upacara Dies Natalis ke-3 tanggal 9 Januari 1960, Presiden Republik Indonesia Ir. Soekarno mengubah nama Universitas Semarang menjadi "Universitas Diponegoro" sebagai bentuk penghargaan atas prestasi pembinaan pendidikan tinggi.',
    significance:
      'Status universitas negeri dikukuhkan melalui Peraturan Pemerintah No. 7 Tahun 1961 yang berlaku surut mulai 15 Oktober 1957. Tanggal 15 Oktober kemudian ditetapkan sebagai hari jadi atau Dies Natalis Undip, merujuk pada peristiwa heroik Pertempuran Lima Hari di Semarang (15–20 Oktober 1945) untuk meneladani jiwa kepahlawanan para pejuang.',
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
          'Saat itu, di seluruh wilayah Jawa Tengah dan Daerah Istimewa Yogyakarta hanya terdapat satu universitas negeri, yaitu Universitas Gadjah Mada (UGM) di Yogyakarta. Sementara itu, jumlah lulusan Sekolah Menengah Atas (SMA) di Jawa Tengah bagian utara bertambah sangat pesat.',
          'Banyak pemuda berpotensi tidak mampu melanjutkan pendidikan karena kendala jarak dan biaya merantau. Hal ini memicu kebulatan tekad dari para cendekiawan, praktisi hukum, pejuang, serta pamong praja di Semarang untuk mendirikan universitas mandiri di ibukota Jawa Tengah.',
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
          'Dukungan penuh dari tokoh pendiri berjiwa patriotik.',
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
          'Mr. Imam Bardjo, yang saat itu menjabat sebagai Ketua Pengadilan Negeri Semarang, diangkat sebagai Presiden Universitas (Rektor) pertama. Dalam orasi ilmiah perdananya, beliau menekankan bahwa universitas ini adalah kawah candradimuka bagi pembentukan watak bangsa yang berbudi luhur.',
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
          'Pemilihan tanggal 15 Oktober memiliki makna filosofis yang sangat sakral: mengenang meletusnya Pertempuran Lima Hari di Semarang (15–20 Oktober 1945), di mana para pemuda dan pejuang Semarang gugur mempertahankan kemerdekaan Indonesia dari serangan tentara Jepang.',
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
          'Seiring pesatnya penambahan fakultas dan mahasiswa, Undip melakukan langkah strategis memindahkan dan memperluas kampus utama dari kawasan Pleburan Semarang Tengah menuju dataran tinggi perbukitan Tembalang seluas 180 hektar.',
          'Kampus Tembalang kini menjadi pusat kegiatan akademik modern yang dilengkapi berbagai laboratorium riset, perpustakaan megah, gedung serbaguna Widya Puraya, RSND, serta sarana olahraga.',
          'Pada tahun 2008 Undip ditetapkan sebagai Badan Layanan Umum (BLU), dan selanjutnya pada 17 Oktober 2014 resmi bertransformasi menjadi Perguruan Tinggi Negeri Badan Hukum (PTN-BH) melalui Peraturan Pemerintah Nomor 81 Tahun 2014 dan disempurnakan dengan PP Nomor 52 Tahun 2015.',
        ],
        keyMilestones: [
          'Pembangunan kampus terpadu Tembalang berwawasan lingkungan asri.',
          'Penetapan status PTN Badan Hukum (PTN-BH) berotonomi penuh.',
          'Capaian akreditasi unggul nasional dan pemeringkatan riset internasional.',
        ],
      },
    ],
  },

  // 2. LIMA PENDIRI UTAMA UNDIP (Sayap Barat Daya — Galeri Dinding)
  founders_5: {
    id: 'founders_5',
    code: 'founders_5',
    zoneNumber: 1,
    areaName: 'Sayap Barat Daya · Galeri Dinding Lima Pendiri Utama',
    title: 'Galeri 5 Pendiri Utama Universitas Semarang / Diponegoro',
    subtitle: 'Tokoh Kunci Pembentukan Yayasan Universitas Semarang Berdasarkan Akta Notaris No. 59 Tahun 1956',
    badgeText: 'Pameran Fisik 2 · 5 Pendiri Utama',
    mainDescription:
      'Galeri dinding ini mengabadikan lima tokoh sentral yang memelopori, mendanai, dan mengorganisasi berdirinya Universitas Semarang pada tahun 1956. Berdasarkan catatan sejarah resmi, kelima tokoh ini memegang peranan kepemimpinan inti dalam Dewan Pengurus Yayasan dan kepemimpinan universitas masa perintis.',
    historicalContext:
      'Pada masa pascakemerdekaan, ketiadaan perguruan tinggi di Semarang mendorong Mr. Sudarto bersama Mr. Dan Soelaiman, Mr. Soesanto Kartoatmodjo, Achmad Tjokrokoesoemo, dan Mr. Imam Bardjo untuk menghimpun potensi daerah. Mereka berhasil meyakinkan notaris R.M. Soeprapto dan Walikota Semarang Hadi Soebeno untuk melegalkan pendirian perguruan tinggi mandiri pertama di ibukota Jawa Tengah.',
    significance:
      'Ketulusan para pendiri mengajar tanpa bayaran dan menyumbangkan sarana pribadi menjadi fondasi moral bagi karakter almamater yang luhur dan mengabdi.',
    stats: [
      { label: 'Ketua Yayasan', value: 'Mr. Sudarto' },
      { label: 'Wakil Ketua Yayasan', value: 'Mr. Dan Soelaiman' },
      { label: 'Panitera Yayasan', value: 'Mr. Soesanto Kartoatmodjo' },
      { label: 'Bendahara Yayasan', value: 'Achmad Tjokrokoesoemo' },
      { label: 'Presiden Rektor I', value: 'Mr. Imam Bardjo' },
    ],
    items: [
      {
        id: 'founder-5-sudarto',
        title: '1. Mr. Sudarto',
        subtitle: 'Ketua Dewan Pengurus Yayasan Universitas Semarang (1956)',
        dateOrYear: '1923 – 1986',
        leadershipPeriod: 'Ketua Yayasan 1956 & Rektor Undip 1961–62, 1977–86',
        imageKey: 'founder_soedarto',
        description:
          'Tokoh sentral di balik pendirian Yayasan Universitas Semarang. Beliau memimpin penyusunan anggaran dasar yayasan, menjalin komunikasi dengan para pemuka masyarakat, dan kemudian memimpin Undip dalam dua periode kepemimpinan serta merintis pembebasan lahan kampus Tembalang.',
        details: [
          'Ketua Dewan Pengurus Yayasan Akta Notaris No. 59 Tahun 1956.',
          'Pakar hukum pidana nasional dan salah satu perumus KUHP Nasional Indonesia.',
          'Namanya diabadikan sebagai Gedung Pertemuan Agung Auditorium Prof. Soedarto, S.H. di Tembalang.',
        ],
        quote: '“Membangun perguruan tinggi adalah menanam pohon peradaban yang buahnya akan dinikmati generasi berabad-abad ke depan.”',
      },
      {
        id: 'founder-5-dan-soelaiman',
        title: '2. Ir. Dan Soelaiman',
        subtitle: 'Wakil Ketua Dewan Pengurus Yayasan Universitas Semarang (1956)',
        dateOrYear: '1910 – 1978',
        leadershipPeriod: 'Wakil Ketua Yayasan 1956',
        imageKey: 'founder_danuwidjojo',
        description:
          'Insinyur senior dan tokoh teknokrat Semarang yang menjabat sebagai Wakil Ketua Yayasan. Beliau memprakarsai berdirinya Fakultas Teknik Undip dan menggalang sarana laboratorium pertama dari jawatan pekerjaan umum.',
        details: [
          'Wakil Ketua Dewan Pengurus Yayasan Universitas Semarang 1956.',
          'Perintis kurikulum pendidikan keteknikan dan sipil pertama di Semarang.',
          'Membantu penyediaan ruang-ruang kuliah awal di kawasan Pleburan dan Jl. Pemuda.',
        ],
      },
      {
        id: 'founder-5-soesanto',
        title: '3. Mr. Soesanto Kartoatmodjo',
        subtitle: 'Panitera Dewan Pengurus Yayasan Universitas Semarang (1956)',
        dateOrYear: '1912 – 1980',
        leadershipPeriod: 'Panitera / Sekretaris Yayasan 1956',
        imageKey: 'founder_goenawan',
        description:
          'Ahli hukum tata negara dan birokrat berintegritas tinggi yang bertindak sebagai Panitera (Sekretaris) Yayasan. Beliau menyusun naskah notulen rapat-rapat perintis, pendaftaran izin kementerian, serta koordinasi antarlembaga.',
        details: [
          'Panitera Dewan Pengurus Yayasan dalam Akta Notaris No. 59 Tahun 1956.',
          'Mengawal kelengkapan administrasi dan legalitas pembukaan kuliah perdana Januari 1957.',
          'Dosen perintis hukum tata negara dan hukum administrasi negara.',
        ],
      },
      {
        id: 'founder-5-tjokrokoesoemo',
        title: '4. Achmad Tjokrokoesoemo',
        subtitle: 'Bendahara Dewan Pengurus Yayasan Universitas Semarang (1956)',
        dateOrYear: '1908 – 1976',
        leadershipPeriod: 'Bendahara Yayasan 1956',
        imageKey: 'founder_tan_tjiang_bie',
        description:
          'Tokoh keuangan dan pamong praja yang dipercaya memegang amanah sebagai Bendahara Yayasan. Beliau mengelola sumbangan masyarakat, donasi sukarela pemda, serta biaya operasional awal empat fakultas perintis.',
        details: [
          'Bendahara Dewan Pengurus Yayasan Universitas Semarang 1956.',
          'Menggalang dana abadi perintis dari para pengusaha patriotik dan masyarakat Semarang.',
          'Memastikan kelancaran operasional perkuliahan dan bantuan buku-buku teks mahasiswa.',
        ],
      },
      {
        id: 'founder-5-imam-bardjo',
        title: '5. Prof. Mr. Imam Bardjo',
        subtitle: 'Presiden Universitas Semarang Pertama (Rektor I 1957–1961)',
        dateOrYear: '1903 – 1969',
        leadershipPeriod: 'Presiden Universitas 1957–1961',
        imageKey: 'founder_imam_bardjo',
        description:
          'Ketua Pengadilan Negeri Semarang yang diangkat sebagai Presiden Universitas (Rektor) pertama saat peresmian 9 Januari 1957 di Aula GRIS. Figur pemersatu yang menanamkan kejujuran budi dan keluhuran ilmu kepada mahasiswa angkatan pertama.',
        details: [
          'Presiden Universitas pertama memimpin kuliah perdana 9 Januari 1957.',
          'Dosen pengajar langsung hukum pidana dan hukum perdata bagi angkatan perintis.',
          'Namanya diabadikan sebagai Jalan Prof. Mr. Imam Bardjo dan Gedung Pertemuan di Pleburan.',
        ],
        quote: '“Keadilan hukum dan keluhuran ilmu adalah dua pilar mutlak yang menjaga martabat kemanusiaan dan kedaulatan bangsa.”',
      },
    ],
  },

  // 3. TOKOH DIREKTORAT & REKTORAT DARI PERIODE KE PERIODE (Dinding Selatan — 13 Gambar Berjarak)
  directors_13: {
    id: 'directors_13',
    code: 'directors_13',
    zoneNumber: 1,
    areaName: 'Dinding Selatan · Galeri Tokoh Direktorat & Rektorat dari Periode ke Periode',
    title: 'Galeri Tokoh Direktorat & Rektorat dari Periode ke Periode',
    subtitle: 'Suksesi Kepemimpinan Rektorat & Dewan Presidium Universitas Diponegoro (1957 — Kini)',
    badgeText: 'Pameran Fisik 3 · 13 Tokoh Direktorat',
    mainDescription:
      'Dinding pameran selatan ini menyajikan 13 tokoh direktorat dan kepemimpinan rektorat yang memimpin Universitas Diponegoro dari satu periode ke periode berikutnya. Setiap periode mencerminkan fase perjuangan penting, mulai dari perintisan di aula GRIS, pemindahan ke kampus Tembalang, reformasi otonomi kampus, hingga pencapaian universitas riset berkelas dunia.',
    historicalContext:
      'Perjalanan kepemimpinan Undip mencatat estafet kepemimpinan yang berkesinambungan: diawali Mr. Imam Bardjo (1957), diteruskan oleh Prof. Mr. Soedarto, S.H., Prof. Dr. Ir. Jakub Rais, Drs. Moeljono Sostrohadikoesoemo, Prof. Dr. Soenarjo, S.H., Prof. Dr. H. Muladi, S.H., Prof. Ir. Eko Budihardjo, M.Sc., Prof. Dr. Temijo, S.H., Prof. Dr. dr. H. Susilo Wibowo, Prof. Ir. Sudharto P. Hadi, Prof. Dr. Yos Johan Utama, Prof. Dr. Suharnomo, serta Dewan Presidium Pimpinan Kolegial Yayasan 1956.',
    significance:
      'Galeri ini dipersembahkan dengan tata letak berjarak dan teratur untuk memudahkan pengunjung mengapresiasi jasa masing-masing tokoh secara khidmat.',
    stats: [
      { label: 'Presiden Universitas I', value: 'Prof. Mr. Imam Bardjo (1957)' },
      { label: 'Arsitek Tembalang', value: 'Prof. Mr. Soedarto & Prof. Muladi' },
      { label: 'Era PTN-BH', value: 'Prof. Sudharto P. Hadi & Prof. Yos Johan' },
      { label: 'Rektor Petahana', value: 'Prof. Dr. Suharnomo (2024–2029)' },
    ],
    items: [
      {
        id: 'dir-1-imam-bardjo',
        title: '1. Prof. Mr. Imam Bardjo',
        subtitle: 'Presiden Universitas Semarang Pertama (1957–1961)',
        dateOrYear: '1903 – 1969',
        leadershipPeriod: 'Presiden Universitas 1957–1961',
        imageKey: 'rector_imam_bardjo',
        description:
          'Ketua Pengadilan Negeri Semarang yang memimpin pembukaan resmi di Aula GRIS Jl. Pemuda pada 9 Januari 1957 dan mengawal proses penganugerahan nama "Universitas Diponegoro" oleh Presiden Soekarno.',
        quote: '“Keluhuran budi dan integritas ilmu adalah lentera sejati kemanusiaan.”',
      },
      {
        id: 'dir-2-soedarto',
        title: '2. Prof. Mr. Soedarto, S.H.',
        subtitle: 'Rektor Undip Ke-2 (1961–1962 & 1977–1986)',
        dateOrYear: '1923 – 1986',
        leadershipPeriod: 'Rektor Undip 1961–1962 & 1977–1986',
        imageKey: 'rector_soedarto',
        description:
          'Tokoh hukum pidana nasional yang memprakarsai pembebasan lahan 180 hektar di perbukitan Tembalang dan merancang cetak biru kepindahan kampus terpadu Undip.',
        quote: '“Pendidikan tinggi harus berakar pada kebutuhan riil bangsa dan bervisi jauh ke depan.”',
      },
      {
        id: 'dir-3-jakub-rais',
        title: '3. Prof. Dr. Ir. Jakub Rais, M.Sc.',
        subtitle: 'Caretaker Rektor Undip (1965–1966)',
        dateOrYear: '1928 – 2021',
        leadershipPeriod: 'Caretaker Rektor Undip 1965–1966',
        imageKey: 'rector_jakub_rais',
        description:
          'Pakar teknik geodesi internasional dan pendiri Bakosurtanal yang menjaga stabilitas akademik kampus pada masa transisi 1965–1966 serta memantapkan Fakultas Teknik.',
      },
      {
        id: 'dir-4-moeljono',
        title: '4. Drs. Moeljono Sostrohadikoesoemo',
        subtitle: 'Rektor Undip Ke-4 (1966–1973)',
        dateOrYear: '1920 – 1993',
        leadershipPeriod: 'Rektor Undip 1966–1973',
        imageKey: 'rector_moeljono_sostro',
        description:
          'Menata administrasi kelembagaan universitas negeri, pengadaan laboratorium sains dasar terpadu, dan memperkokoh Undip sebagai universitas pembina utama di Jawa Tengah.',
      },
      {
        id: 'dir-5-soenarjo',
        title: '5. Prof. Dr. Soenarjo, S.H.',
        subtitle: 'Rektor Undip Ke-5 (1973–1977)',
        dateOrYear: '1918 – 1996',
        leadershipPeriod: 'Rektor Undip 1973–1977',
        imageKey: 'rector_soenarjo',
        description:
          'Pakar hukum tata negara yang memperkuat riset empiris kemasyarakatan, pengabdian desa binaan dosen, serta wibawa etika akademik almamater.',
      },
      {
        id: 'dir-6-muladi',
        title: '6. Prof. Dr. H. Muladi, S.H.',
        subtitle: 'Rektor Undip Ke-6 (1986–1994, Dua Periode)',
        dateOrYear: '1943 – 2020',
        leadershipPeriod: 'Rektor Undip 1986–1994',
        imageKey: 'rector_muladi',
        description:
          'Mengakselerasi pembangunan sarana fisik kampus Tembalang secara besar-besaran, meresmikan Gedung Rektorat Widya Puraya, dan kelak dipercaya mengemban amanah sebagai Menteri Kehakiman RI dan Mensesneg RI.',
      },
      {
        id: 'dir-7-eko-budihardjo',
        title: '7. Prof. Ir. Eko Budihardjo, M.Sc.',
        subtitle: 'Rektor Undip Ke-7 (1994–1998)',
        dateOrYear: '1944 – 2014',
        leadershipPeriod: 'Rektor Undip 1994–1998',
        imageKey: 'rector_eko_budihardjo',
        description:
          'Begawan arsitektur dan budayawan nasional yang mencetuskan konsep Eco-Culture Campus dan pemeliharaan ruang terbuka hijau asri di kawasan Tembalang.',
      },
      {
        id: 'dir-8-temijo',
        title: '8. Prof. Dr. Temijo, S.H.',
        subtitle: 'Rektor Undip Ke-8 (1998–2006, Dua Periode)',
        dateOrYear: '1939 – kini',
        leadershipPeriod: 'Rektor Undip 1998–2006',
        imageKey: 'rector_temijo',
        description:
          'Mengawal fase transisi era reformasi dengan suasana kampus yang kritis dan demokratis, serta meletakkan fondasi manajemen mutu akademik digital.',
      },
      {
        id: 'dir-9-susilo-wibowo',
        title: '9. Prof. Dr. dr. H. Susilo Wibowo, Sp.And.',
        subtitle: 'Rektor Undip Ke-9 (2006–2010)',
        dateOrYear: '1948 – kini',
        leadershipPeriod: 'Rektor Undip 2006–2010',
        imageKey: 'rector_susilo_wibowo',
        description:
          'Pakar kedokteran reproduksi yang memprakarsai pembangunan Rumah Sakit Nasional Diponegoro (RSND) dan memperluas jejaring publikasi riset biomedis internasional.',
      },
      {
        id: 'dir-10-sudharto-hadi',
        title: '10. Prof. Ir. Sudharto P. Hadi, MES, Ph.D.',
        subtitle: 'Rektor Undip Ke-10 (2010–2015)',
        dateOrYear: '1954 – kini',
        leadershipPeriod: 'Rektor Undip 2010–2015',
        imageKey: 'rector_sudharto_hadi',
        description:
          'Pakar sosiologi lingkungan yang mengantarkan Undip resmi meraih status Perguruan Tinggi Negeri Badan Hukum (PTN-BH) lewat PP No. 81/2014 dan membangun Waduk Pendidikan Tembalang.',
      },
      {
        id: 'dir-11-yos-johan',
        title: '11. Prof. Dr. Yos Johan Utama, S.H., M.Hum.',
        subtitle: 'Rektor Undip Ke-11 (2015–2024, Dua Periode)',
        dateOrYear: '1962 – kini',
        leadershipPeriod: 'Rektor Undip 2015–2024',
        imageKey: 'rector_yos_johan',
        description:
          'Melesatkan Undip ke jajaran universitas riset berkelas dunia (World Class University), memperluas gedung perkuliahan bersama terpadu, dan mengokohkan akreditasi internasional unggul.',
      },
      {
        id: 'dir-12-suharnomo',
        title: '12. Prof. Dr. Suharnomo, S.E., M.Si.',
        subtitle: 'Rektor Undip Ke-12 (Petahana 2024–2029)',
        dateOrYear: '1970 – kini',
        leadershipPeriod: 'Rektor Undip 2024–2029 (Petahana)',
        imageKey: 'rector_suharnomo',
        description:
          'Pakar manajemen sumber daya manusia yang memimpin percepatan hilirisasi produk riset, program link-and-match dengan industri multinasional, transformasi kampus digital cerdas, dan kesejahteraan sivitas akademika.',
      },
      {
        id: 'dir-13-presidium',
        title: '13. Dewan Presidium & Kurator Perintis (1956)',
        subtitle: 'Pimpinan Kolegial Yayasan Universitas Semarang',
        dateOrYear: '1956 – 1960',
        leadershipPeriod: 'Dewan Kurator & Presidium 1956',
        imageKey: 'founder_soerodjo',
        description:
          'Dipimpin oleh Walikota Semarang Hadi Soebeno Sosrowardoyo bersama Dr. Marzuki, Dr. V. Soedjito, Mr. Abdulmadjid Djojodhiningrat, dan Notaris R.M. Soeprapto yang memberikan pengayoman moral dan dukungan fasilitas pemerintah kotapraja pada masa awal pendirian.',
      },
    ],
  },

  // 4. GALERI FOTO KAMPUS AWAL (Dinding Utara — 6 Frame Dokumentasi Langka)
  photos: {
    id: 'photos',
    code: 'photos',
    zoneNumber: 1,
    areaName: 'Dinding Utara · Galeri Foto Dokumentasi Kampus Awal',
    title: 'Galeri Foto Dokumentasi Kampus Awal Undip (1957–1962)',
    subtitle: 'Arsip Visual Suasana Perkuliahan di Pleburan, Aula GRIS Jl. Pemuda, dan Dies Natalis III',
    badgeText: 'Pameran Fisik 4 · Foto Kampus Awal',
    mainDescription:
      'Dinding pameran utara memamerkan foto-foto arsip bersejarah kehidupan kampus Undip pada era 1957–1962: gedung utama Pleburan berarsitektur kolonial tropis, aula Gedung Rakyat Indonesia Semarang (GRIS) di Jalan Pemuda, orasi kuliah perdana Mr. Imam Bardjo, pidato Presiden Soekarno pada Dies Natalis III, dan praktikum laboratorium teknik.',
    historicalContext:
      'Foto-foto ini merekam masa-masa awal berdirinya universitas ketika sarana masih sangat bersahaja. Para dosen dan mahasiswa perintis belajar dengan penerangan sederhana namun dengan semangat pengabdian tanah air yang menyala-nyala.',
    significance:
      'Bukti visual tak ternilai yang menghubungkan generasi sekarang dengan akar perjuangan para pendahulu Undip.',
    stats: [
      { label: 'Kampus Pertama', value: 'Pleburan, Semarang' },
      { label: 'Aula Peresmian', value: 'GRIS Jl. Pemuda' },
      { label: 'Rentang Masa', value: '1957 – 1962' },
      { label: 'Pelestarian', value: 'Arsip Otentik Undip' },
    ],
    items: [
      {
        id: 'foto-gedung-pleburan',
        title: '1. Gedung Utama Kampus Pleburan — 1957',
        subtitle: 'Pusat Kehidupan Akademik Awal Universitas Diponegoro',
        dateOrYear: '1957',
        imageKey: 'photo_campus_pleburan',
        description:
          'Gedung berpilar putih kokoh dengan arsitektur kolonial tropis di Pleburan, Semarang Selatan, yang menjadi markas rektorat dan perkuliahan awal Undip sebelum kepindahan ke Tembalang.',
      },
      {
        id: 'foto-aula-gris',
        title: '2. Aula GRIS Jl. Pemuda — 9 Januari 1957',
        subtitle: 'Gedung Rakyat Indonesia Semarang, Tempat Peresmian Universitas',
        dateOrYear: '9 Januari 1957',
        imageKey: 'photo_campus_gris',
        description:
          'Aula GRIS di Jalan Pemuda Semarang yang dipinjamkan pemerintah kotapraja untuk upacara pembukaan resmi Universitas Semarang dan penyelenggaraan kuliah umum perdana.',
      },
      {
        id: 'foto-kuliah-perdana',
        title: '3. Suasana Kuliah Perdana di GRIS — 1957',
        subtitle: 'Mahasiswa Angkatan Pertama dan Orasi Mr. Imam Bardjo',
        dateOrYear: '1957',
        imageKey: 'photo_historic_lecture',
        description:
          'Mahasiswa angkatan pertama dari Fakultas Hukum, Ekonomi, Teknik, dan Akademi Tata Praja menyimak khidmat orasi ilmiah dari Presiden Universitas Mr. Imam Bardjo.',
      },
      {
        id: 'foto-dies-natalis-3-undip',
        title: '4. Dies Natalis III & Pidato Bung Karno — 1960',
        subtitle: 'Penganugerahan Nama Resmi "Universitas Diponegoro"',
        dateOrYear: '9 Januari 1960',
        imageKey: 'photo_dies_soekarno',
        description:
          'Presiden Soekarno berpidato di hadapan ribuan sivitas akademika dan masyarakat Semarang, meresmikan perubahan nama Universitas Semarang menjadi Universitas Diponegoro.',
      },
      {
        id: 'foto-lab-teknik-undip',
        title: '5. Praktikum Ukur Tanah Fakultas Teknik — 1962',
        subtitle: 'Praktikum Insinyur Sipil Perintis di Kawasan Pleburan',
        dateOrYear: '1962',
        imageKey: 'photo_historic_lab',
        description:
          'Mahasiswa teknik awal melakukan pengukuran kontur tanah menggunakan alat theodolite optik manual di bawah bimbingan insinyur Departemen Pekerjaan Umum.',
      },
      {
        id: 'foto-penegerian-ptn',
        title: '6. Naskah Penegerian PP No. 7 Tahun 1961',
        subtitle: 'Pengukuhan Status PTN & Penetapan Hari Jadi 15 Oktober 1957',
        dateOrYear: '1961',
        imageKey: 'history_ptn',
        description:
          'Peraturan Pemerintah Nomor 7 Tahun 1961 yang menetapkan Universitas Diponegoro sebagai perguruan tinggi negeri dengan tanggal hari jadi merujuk pada Pertempuran Lima Hari di Semarang.',
      },
    ],
  },

  // 5. MINIATUR KAMPUS 3D (Pusat Ruangan — Meja Vitrine Arsitektur)
  miniature: {
    id: 'miniature',
    code: 'miniature',
    zoneNumber: 2,
    areaName: 'Pusat Ruangan · Meja Vitrine Miniatur Arsitektur Kampus 3D',
    title: 'Miniatur 3D Transformasi Kawasan Kampus Undip',
    subtitle: 'Representasi Spasial Kawasan Kampus Terpadu Tembalang (180 Ha) & Marine Science Teluk Awur (52 Ha)',
    badgeText: 'Pameran Fisik 5 · Miniatur Kampus 3D',
    mainDescription:
      'Diorama arsitektur 3D di tengah ruangan museum ini menampilkan maket visual kawasan kampus terpadu Universitas Diponegoro di Tembalang seluas 180 hektar serta Marine Science Techno Park Teluk Awur seluas 52 hektar di Jepara.',
    historicalContext:
      'Gagasan pemindahan kampus dari Pleburan ke perbukitan Tembalang digagas oleh Rektor Prof. Mr. Soedarto, S.H. pada akhir dekade 1970-an karena daya tampung Pleburan sudah tidak mencukupi laju pertumbuhan mahasiswa. Rencana tersebut dilanjutkan dan diresmikan oleh Prof. Dr. Muladi, S.H., menjadikan Tembalang salah satu kawasan kampus hijau terpadu terbesar di Indonesia.',
    significance:
      'Miniatur ini memvisualisasikan harmoni arsitektur ikonik Gedung Rektorat Widya Puraya beratap limas bertingkat, danau resapan waduk pendidikan, hutan kampus tropis, dan kompleks fakultas modern.',
    stats: [
      { label: 'Luas Kampus Tembalang', value: '± 180 Hektar' },
      { label: 'Perintis Pembebasan', value: 'Prof. Mr. Soedarto, S.H.' },
      { label: 'Landmark Ikonik', value: 'Gedung Widya Puraya' },
      { label: 'Kampus Bahari', value: 'Teluk Awur Jepara (52 Ha)' },
    ],
    items: [
      {
        id: 'mini-widya-puraya',
        title: '1. Gedung Rektorat Widya Puraya & Menara Jam',
        subtitle: 'Pusat Administrasi Sentral & Ikon Kemegahan Tembalang',
        dateOrYear: 'Diresmikan 1989',
        imageKey: 'z2_img_widya_puraya',
        description:
          'Gedung Widya Puraya dengan arsitektur limas piramida bertingkat tiga dan menara jam sentral merupakan landmark paling ikonik di Kampus Tembalang, menaungi rektorat dan aula wisuda agung.',
      },
      {
        id: 'mini-waduk-pendidikan',
        title: '2. Waduk Pendidikan & Tata Air Terpadu',
        subtitle: 'Konservasi Lingkungan Hidup & Green Campus',
        dateOrYear: '2013 – kini',
        imageKey: 'z2_img_waduk',
        description:
          'Waduk buatan terpadu di kawasan barat laut kampus yang dibangun sebagai sarana riset hidrologi, resapan air bawah tanah, dan ruang terbuka hijau ekologis.',
      },
      {
        id: 'mini-rsnd',
        title: '3. Rumah Sakit Nasional Diponegoro (RSND)',
        subtitle: 'Pusat Pendidikan Kedokteran Terpadu & Layanan Medis',
        dateOrYear: 'Diresmikan 2014',
        imageKey: 'z2_img_rsnd',
        description:
          'Rumah sakit pendidikan tipe B berkapasitas 300 tempat tidur dengan fasilitas radioterapi mutakhir, ruang isolasi negatif, dan laboratorium riset klinis terpadu.',
      },
      {
        id: 'mini-teluk-awur',
        title: '4. Marine Science Techno Park Teluk Awur Jepara',
        subtitle: 'Pusat Riset Kelautan & Konservasi Pesisir Nusantara (52 Ha)',
        dateOrYear: '1987 – kini',
        imageKey: 'z2_img_teluk_awur',
        description:
          'Kampus tepi pantai seluas 52 hektar di Kabupaten Jepara yang menjadi basis penelitian Fakultas Perikanan dan Ilmu Kelautan, dilengkapi dermaga riset dan laboratorium basah oseanografi.',
      },
    ],
  },
}

/**
 * KOLEKSI BUKU SEJARAH INTERAKTIF PADA 5 RAK BUKU MUSEUM
 * Materi Zona 1 s/d Zona 5 disajikan melalui buku-buku yang tersusun di rak
 */
export const MUSEUM_BOOKS: MuseumBook[] = [
  // =========================================================================
  // RAK 01 — ZONA 1: THE ORIGIN OF UNDIP
  // =========================================================================
  {
    id: 'book_z1_origin',
    shelfId: 'shelf_z1',
    shelfCategory: 'Rak 01 — Zona 1: The Origin of Undip',
    zoneNumber: 1,
    zoneName: 'The Origin of Undip',
    title: 'Akta Notaris No. 59 & Kelahiran Universitas Semarang',
    subtitle: 'Warkat Otentik Pembentukan Yayasan & Kuliah Perdana di Aula GRIS',
    spineLabel: '1956 · AKTA NOTARIS NO. 59',
    coverColor: '#3a2014',
    period: '1956 – 1957',
    synopsis:
      'Dokumentasi lengkap mengenai naskah legal berdirinya Yayasan Universitas Semarang di hadapan Notaris R.M. Soeprapto pada 4 Desember 1956, susunan pengurus, dan kuliah perdana di Gedung Rakyat Indonesia Semarang.',
    referenceUrl: 'https://undip.ac.id/sejarah-2',
    chapters: [
      {
        chapterNumber: 1,
        title: 'Prakarsa Luhur Cendekiawan Semarang',
        pageHeader: 'Kebutuhan Mendesak Pendidikan Tinggi di Jawa Tengah Bagian Utara',
        period: '1950 – 1956',
        imageKey: 'history_background',
        narrativeParagraphs: [
          'Pasca pengakuan kedaulatan Republik Indonesia, aspirasi pemuda di Jawa Tengah bagian utara untuk melanjutkan pendidikan ke jenjang universitas menghadapi kendala besar karena satu-satunya perguruan tinggi negeri di wilayah ini berkedudukan di Yogyakarta (UGM).',
          'Para praktisi hukum, notaris, dokter, pamong praja, dan pejuang di Semarang sepakat mendirikan perguruan tinggi mandiri dengan semangat gotong royong.',
        ],
        keyMilestones: [
          'Pertemuan perintis di Pengadilan Negeri Semarang.',
          'Dukungan moral segenap pemuka masyarakat Kota Semarang.',
        ],
      },
      {
        chapterNumber: 2,
        title: 'Naskah Akta Notaris R.M. Soeprapto No. 59',
        pageHeader: 'Landasan Yuridis Formal Tanggal 4 Desember 1956',
        period: '4 Desember 1956',
        imageKey: 'history_founding',
        narrativeParagraphs: [
          'Pada hari Selasa tanggal 4 Desember 1956 di hadapan Notaris R.M. Soeprapto, diresmikan pembentukan Yayasan Universitas Semarang.',
          'Akta memuat susunan dewan pengurus pertama: Mr. Sudarto (Ketua), Mr. Dan Soelaiman (Wakil Ketua), Mr. Soesanto Kartoatmodjo (Panitera), Achmad Tjokrokoesoemo (Bendahara), Mr. Imam Bardjo, Mr. Goenawan Goetomo, Mr. Tan Tjing Hak, dan Mr. Koo Swan Ik.',
        ],
        historicalQuote: '“Badan hukum yayasan menjadi tonggak resmi berdirinya universitas mandiri di ibukota Jawa Tengah.”',
      },
      {
        chapterNumber: 3,
        title: 'Peresmian Khidmat di Aula GRIS Jl. Pemuda',
        pageHeader: '9 Januari 1957 — Pelantikan Mr. Imam Bardjo sebagai Presiden I',
        period: '9 Januari 1957',
        imageKey: 'photo_campus_gris',
        narrativeParagraphs: [
          'Upacara pembukaan Universitas Semarang berlangsung khidmat di Gedung Rakyat Indonesia Semarang (GRIS) di Jalan Pemuda, disaksikan para pemuka masyarakat dan pemerintah daerah.',
          'Mr. Imam Bardjo dilantik sebagai Presiden Universitas pertama dan memimpin kuliah perdana bagi empat fakultas perintis: Hukum, Ekonomi, Teknik, dan Akademi Tata Praja.',
        ],
      },
    ],
  },
  {
    id: 'book_z1_soekarno',
    shelfId: 'shelf_z1',
    shelfCategory: 'Rak 01 — Zona 1: The Origin of Undip',
    zoneNumber: 1,
    zoneName: 'The Origin of Undip',
    title: 'Amanat Bung Karno & Penganugerahan Nama "Diponegoro"',
    subtitle: 'Penganugerahan Nama Pahlawan Nasional & Penegerian PP No. 7 Tahun 1961',
    spineLabel: '1960 · AMANAT BUNG KARNO',
    coverColor: '#2b1b12',
    period: '1960 – 1961',
    synopsis:
      'Kisah penganugerahan nama Universitas Diponegoro oleh Presiden Soekarno pada Dies Natalis ke-3 tahun 1960 dan penetapan status PTN serta hari jadi 15 Oktober.',
    referenceUrl: 'https://undip.ac.id/sejarah-2',
    chapters: [
      {
        chapterNumber: 1,
        title: 'Dies Natalis III di Semarang',
        pageHeader: '9 Januari 1960 — Kunjungan Kenegaraan Presiden Soekarno',
        period: '9 Januari 1960',
        imageKey: 'photo_dies_soekarno',
        narrativeParagraphs: [
          'Presiden Soekarno berkenan hadir langsung dalam Dies Natalis ke-3 Universitas Semarang dan menyampaikan orasi kebangsaan yang membakar semangat sivitas akademika.',
          'Beliau menganugerahkan nama baru: “UNIVERSITAS DIPONEGORO” sebagai amanat agar seluruh insan akademika meneladani keberanian dan kejujuran Pangeran Diponegoro.',
        ],
        historicalQuote: '“Jadikanlah nama Diponegoro sebagai obor pengabdian kepada tanah air!” — Ir. Soekarno',
      },
      {
        chapterNumber: 2,
        title: 'Peraturan Pemerintah No. 7 Tahun 1961',
        pageHeader: 'Status Negeri Penuh & Makna Dies Natalis 15 Oktober',
        period: '15 Oktober 1957 / 1961',
        imageKey: 'history_ptn',
        narrativeParagraphs: [
          'Status universitas negeri dikukuhkan melalui Peraturan Pemerintah No. 7 Tahun 1961 yang berlaku surut sejak 15 Oktober 1957.',
          'Tanggal 15 Oktober ditetapkan sebagai hari jadi untuk mengenang meletusnya Pertempuran Lima Hari di Semarang melawan pendudukan militer Jepang.',
        ],
      },
    ],
  },

  // =========================================================================
  // RAK 02 — ZONA 2: THE GROWTH OF KNOWLEDGE
  // =========================================================================
  {
    id: 'book_z2_faculties',
    shelfId: 'shelf_z2',
    shelfCategory: 'Rak 02 — Zona 2: The Growth of Knowledge',
    zoneNumber: 2,
    zoneName: 'The Growth of Knowledge',
    title: 'Evolusi 11 Fakultas & 2 Sekolah Undip',
    subtitle: 'Dari 4 Fakultas Perintis Menuju 170+ Program Studi Unggul',
    spineLabel: 'EVOLUSI FAKULTAS UNDIP',
    coverColor: '#4a2d1d',
    period: '1957 – Kini',
    synopsis:
      'Catatan komprehensif mengenai sejarah berdirinya 11 fakultas, Sekolah Pascasarjana, dan Sekolah Vokasi di Universitas Diponegoro beserta capaian akreditasi internasional.',
    referenceUrl: 'https://undip.ac.id/fakultas',
    chapters: [
      {
        chapterNumber: 1,
        title: 'Trisula Perintis: Hukum, Ekonomi, dan Teknik (1957)',
        pageHeader: 'Kawah Candradimuka Sarjana Hukum, Ekonomi, dan Insinyur',
        period: '1957',
        imageKey: 'z2_img_fac_hukum',
        narrativeParagraphs: [
          'Fakultas Hukum, Fakultas Ekonomika dan Bisnis, serta Fakultas Teknik merupakan tiga tiang penyangga utama saat Undip berdiri tahun 1957.',
          'Fakultas Hukum melahirkan mazhab Hukum Progresif oleh Prof. Satjipto Rahardjo, FEB meraih akreditasi elit AACSB, dan Teknik memelopori rekayasa infrastruktur maritim.',
        ],
      },
      {
        chapterNumber: 2,
        title: 'Pemekaran Sains, Kedokteran, Agrokompleks, dan Soshum',
        pageHeader: 'Lahirnya FK, FPP, FIB, FISIP, FPIK, FSM, FKM, dan Psikologi',
        period: '1961 – 2007',
        imageKey: 'z2_img_fac_kedokteran',
        narrativeParagraphs: [
          'Tuntutan pembangunan nasional mendorong lahirnya Fakultas Kedokteran (1961), FPP (1964), FIB (1965), FISIP (1968), FPIK (1968), FSM (1988), FKM (1993), dan Fakultas Psikologi (2007).',
          'Kini Undip mendidik lebih dari lima puluh ribu mahasiswa dengan ratusan program studi berakreditasi Unggul.',
        ],
      },
    ],
  },
  {
    id: 'book_z2_campus',
    shelfId: 'shelf_z2',
    shelfCategory: 'Rak 02 — Zona 2: The Growth of Knowledge',
    zoneNumber: 2,
    zoneName: 'The Growth of Knowledge',
    title: 'Transformasi Spasial: Dari Pleburan Menuju Lembah Tembalang',
    subtitle: 'Cetak Biru Pembebasan Lahan 180 Hektar & Pembangunan Kampus Hijau',
    spineLabel: 'TRANSFORMASI TEMBALANG',
    coverColor: '#3d2516',
    period: '1977 – Kini',
    synopsis:
      'Kisah visioner pemindahan kampus dari kawasan sempit Pleburan ke perbukitan Tembalang oleh Rektor Soedarto dan Rektor Muladi hingga menjadi kota kampus terpadu.',
    chapters: [
      {
        chapterNumber: 1,
        title: 'Visi Berani Rektor Soedarto (1977)',
        pageHeader: 'Membebaskan Perbukitan Tandus Tembalang untuk Masa Depan Almamater',
        period: '1977 – 1986',
        imageKey: 'z2_img_trans_blueprint',
        narrativeParagraphs: [
          'Pada akhir dekade 1970-an, daya tampung kampus Pleburan sudah jenuh. Rektor Prof. Mr. Soedarto mengambil keputusan berani membebaskan lahan seluas 180 hektar di perbukitan Tembalang.',
          'Kawasan yang semula berupa tegalan sepi disulap menjadi kawasan pendidikan terintegrasi nomor satu di Jawa Tengah.',
        ],
      },
      {
        chapterNumber: 2,
        title: 'Kemegahan Gedung Widya Puraya & Waduk Pendidikan',
        pageHeader: 'Pembangunan Ikon Limas 1989 & Lanskap Eco-Green Campus',
        period: '1989 – Kini',
        imageKey: 'z2_img_widya_puraya',
        narrativeParagraphs: [
          'Gedung Rektorat Widya Puraya dengan arsitektur limas berundak dan menara jam sentral diresmikan pada 1989 sebagai simbol keagungan ilmu pengetahuan.',
          'Pembangunan waduk pendidikan dan hutan kampus tropis melengkapi visi green campus berkelanjutan.',
        ],
      },
    ],
  },
  {
    id: 'book_z2_pip',
    shelfId: 'shelf_z2',
    shelfCategory: 'Rak 02 — Zona 2: The Growth of Knowledge',
    zoneNumber: 2,
    zoneName: 'The Growth of Knowledge',
    title: 'Pola Ilmiah Pokok: Eksplorasi Kelautan & Pesisir Nusantara',
    subtitle: 'Coastal Region Eco-Development & Stasiun Riset Teluk Awur Jepara',
    spineLabel: 'PIP KELAUTAN & TELUK AWUR',
    coverColor: '#251b14',
    period: '1974 – Kini',
    synopsis:
      'Dokumentasi Pola Ilmiah Pokok (PIP) Undip yang memusatkan keunggulan riset pada bidang kelautan, bioteknologi pesisir, dan konservasi terumbu karang.',
    chapters: [
      {
        chapterNumber: 1,
        title: 'Piagam Pola Ilmiah Pokok (1974)',
        pageHeader: 'Penetapan Keunggulan Maritim dan Pesisir Tropis',
        period: '1974',
        imageKey: 'z2_img_res_pip',
        narrativeParagraphs: [
          'Sebagai universitas di pesisir utara Jawa Tengah, Undip menetapkan Pola Ilmiah Pokok (PIP) "Pengembangan Wilayah Pesisir dan Lautan" yang memandu riset seluruh fakultas.',
          'Dari ilmu hukum maritim, teknik kelautan, oseanografi, hingga ekonomi nelayan bersinergi dalam PIP ini.',
        ],
      },
      {
        chapterNumber: 2,
        title: 'Stasiun Riset Kelautan Teluk Awur Jepara',
        pageHeader: 'Laboratorium Bahari Alam 52 Hektar',
        period: '1987 – Kini',
        imageKey: 'z2_img_teluk_awur',
        narrativeParagraphs: [
          'Stasiun riset laut di Teluk Awur Jepara menjadi pusat penelitian terumbu karang, budidaya udang vaname, dan ekspedisi kapal riset KM Diponegoro.',
        ],
      },
    ],
  },

  // =========================================================================
  // RAK 03 — ZONA 3: THE HERITAGE OF UNDIP
  // =========================================================================
  {
    id: 'book_z3_heritage',
    shelfId: 'shelf_z3',
    shelfCategory: 'Rak 03 — Zona 3: The Heritage of Undip',
    zoneNumber: 3,
    zoneName: 'The Heritage of Undip',
    title: 'Pangeran Diponegoro: Jiwa Ksatria & Moralitas Keilmuan',
    subtitle: 'Falsafah Kejuangan, Kejujuran Budi, dan Keteguhan Prinsip Almamater',
    spineLabel: 'FALSAFAH PANGERAN DIPONEGORO',
    coverColor: '#382215',
    period: 'Warisan Abadi',
    synopsis:
      'Kajian mendalam tentang falsafah hidup Pangeran Diponegoro sebagai figur keteladanan moral civitas akademika: berani membela kebenaran, dekat dengan rakyat, dan berpegang teguh pada keluhuran budi.',
    chapters: [
      {
        chapterNumber: 1,
        title: 'Keteladanan Moral Sang Pangeran',
        pageHeader: 'Keteguhan Prinsip Membela Keadilan dan Wong Cilik',
        period: '1785 – 1855',
        imageKey: 'doc_crest_charter',
        narrativeParagraphs: [
          'Pangeran Diponegoro dikenal sebagai ksatria yang menolak kemewahan istana demi memperjuangkan harkat martabat rakyat tertindas.',
          'Jiwa ksatria inilah yang diadaptasi menjadi nilai dasar sivitas akademika Undip: jujur, berani, adil, dan peduli.',
        ],
        historicalQuote: '“Kejujuran budi adalah pusaka paling berharga dari insan terpelajar.”',
      },
      {
        chapterNumber: 2,
        title: 'Panji Almamater & Keris Pusaka',
        pageHeader: 'Makna Simbolik Ksatria Berkuda Membawa Keris',
        period: '1960',
        imageKey: 'doc_crest_charter',
        narrativeParagraphs: [
          'Lambang Undip menggambarkan Pangeran Diponegoro menunggang kuda putih dengan keris pusaka terhunus.',
          'Kuda melambangkan ketangkasan dan mobilitas, sedangkan keris melambangkan ketajaman budi pekerti dalam membedakan yang benar dan salah.',
        ],
      },
    ],
  },
  {
    id: 'book_z3_tradition',
    shelfId: 'shelf_z3',
    shelfCategory: 'Rak 03 — Zona 3: The Heritage of Undip',
    zoneNumber: 3,
    zoneName: 'The Heritage of Undip',
    title: 'Tradisi Almamater, Hymne & Eco-Culture Campus',
    subtitle: 'Lagu Kebanggaan, Gamelan Jawa & Konservasi Budaya Lokal',
    spineLabel: 'TRADISI & BUDAYA ALMAMATER',
    coverColor: '#422818',
    period: 'Tradisi Hidup',
    synopsis:
      'Catatan mengenai tradisi wisuda agung, penciptaan Hymne dan Mars Undip, pagelaran gamelan Jawa di kampus, serta integrasi nilai-nilai kebudayaan lokal dalam tata pergaulan akademik.',
    chapters: [
      {
        chapterNumber: 1,
        title: 'Hymne dan Mars Universitas Diponegoro',
        pageHeader: 'Lagu Sakral Pemersatu Puluhan Ribu Alumni',
        period: 'Era Perintis',
        imageKey: 'history_ptn',
        narrativeParagraphs: [
          'Hymne Undip yang agung menggemakan sumpah setia para lulusan untuk senantiasa mengamalkan ilmu pengetahuan bagi kejayaan nusa dan bangsa.',
        ],
      },
    ],
  },

  // =========================================================================
  // RAK 04 — ZONA 4: UNDIP TODAY
  // =========================================================================
  {
    id: 'book_z4_ptnbh',
    shelfId: 'shelf_z4',
    shelfCategory: 'Rak 04 — Zona 4: Undip Today',
    zoneNumber: 4,
    zoneName: 'Undip Today',
    title: 'Transformasi PTN-BH: Kemandirian & Otonomi Riset',
    subtitle: 'Peraturan Pemerintah No. 81/2014 & Statuta PP No. 52/2015',
    spineLabel: 'PTN-BH & OTONOMI RISET',
    coverColor: '#301c10',
    period: '2014 – Kini',
    synopsis:
      'Tonggak penetapan Universitas Diponegoro sebagai Perguruan Tinggi Negeri Badan Hukum yang memberikan kemandirian penuh dalam pengelolaan akademik, keuangan, dan aset riset terpadu.',
    chapters: [
      {
        chapterNumber: 1,
        title: 'Penetapan Status PTN-BH oleh Presiden RI',
        pageHeader: 'PP No. 81 Tahun 2014 dan Penguatan Otonomi Kampus',
        period: '17 Oktober 2014',
        imageKey: 'history_ptn',
        narrativeParagraphs: [
          'Pada tanggal 17 Oktober 2014, Presiden RI menandatangani PP No. 81 Tahun 2014 yang menetapkan Undip sebagai PTN-BH mandiri.',
          'Status ini mempercepat pengambilan keputusan strategis, pembangunan laboratorium bertaraf dunia, dan kemitraan industri internasional.',
        ],
      },
      {
        chapterNumber: 2,
        title: 'Rumah Sakit Nasional Diponegoro (RSND)',
        pageHeader: 'Pusat Riset Biomedis & Pelayanan Kesehatan Masyarakat',
        period: '2014 – Kini',
        imageKey: 'z2_img_rsnd',
        narrativeParagraphs: [
          'RSND berdiri megah di kawasan barat Tembalang dengan fasilitas modern 8 lantai, melayani masyarakat Jawa Tengah sekaligus menjadi sarana praktik kedokteran terpadu.',
        ],
      },
    ],
  },
  {
    id: 'book_z4_global',
    shelfId: 'shelf_z4',
    shelfCategory: 'Rak 04 — Zona 4: Undip Today',
    zoneNumber: 4,
    zoneName: 'Undip Today',
    title: 'Reputasi Dunia: Top Graduate Employability & Riset Scopus',
    subtitle: 'Juara Keterserapan Kerja Lulusan Versi QS GER & Ribuan Publikasi Dunia',
    spineLabel: 'REPUTASI GLOBAL & QS RANKING',
    coverColor: '#352115',
    period: '2020 – Kini',
    synopsis:
      'Pencapaian prestisius Undip dalam peringkat QS World University Rankings, rekor lulusan tercepat terserap kerja di Asia Tenggara, dan produktivitas publikasi ilmiah internasional.',
    chapters: [
      {
        chapterNumber: 1,
        title: 'Peringkat #1 Keterserapan Kerja Lulusan di Indonesia',
        pageHeader: 'Kepercayaan Tinggi Dunia Industri terhadap Karakter Alumni Undip',
        period: '2020 – 2024',
        imageKey: 'z2_img_ach_qs',
        narrativeParagraphs: [
          'Lembaga pemeringkatan Quacquarelli Symonds menobatkan Undip di posisi puncak Graduate Employability Rankings di Indonesia.',
          'Alumni Undip dikenal tangguh, beretika luhur, adaptif terhadap teknologi baru, dan memiliki jiwa kepemimpinan.',
        ],
      },
    ],
  },

  // =========================================================================
  // RAK 05 — ZONA 5: UNDIP FUTURE
  // =========================================================================
  {
    id: 'book_z5_smart_campus',
    shelfId: 'shelf_z5',
    shelfCategory: 'Rak 05 — Zona 5: Undip Future',
    zoneNumber: 5,
    zoneName: 'Undip Future',
    title: 'Smart Digital Campus: Kecerdasan Buatan & Robotika Maritim',
    subtitle: 'Inovasi AI, Tangan Bionik CBIOM3S & Kapal Riset Nirawak',
    spineLabel: 'SMART DIGITAL & AI CAMPUS',
    coverColor: '#271911',
    period: 'Visi Masa Depan',
    synopsis:
      'Cetak biru transformasi digital Undip menuju Smart University: penerapan big data, kecerdasan buatan, mobil formula listrik, robot bawah air, dan tangan bionik terjangkau.',
    chapters: [
      {
        chapterNumber: 1,
        title: 'Pusat Riset Biomekatronika & Robotika Cerdas',
        pageHeader: 'Tangan Bionik untuk Kemanusiaan & Robot Penjelajah Bahari',
        period: 'Inovasi Aktif',
        imageKey: 'z2_img_ach_bionic',
        narrativeParagraphs: [
          'Pusat riset CBIOM3S Undip memproduksi tangan prostetik bionik berbasis sinyal otot dengan harga sangat terjangkau bagi para penyandang disabilitas.',
          'Tim robotik mahasiswa secara berkala menjuarai kontes robot bawah air dan perancangan kendaraan hemat energi internasional.',
        ],
      },
    ],
  },
  {
    id: 'book_z5_green_energy',
    shelfId: 'shelf_z5',
    shelfCategory: 'Rak 05 — Zona 5: Undip Future',
    zoneNumber: 5,
    zoneName: 'Undip Future',
    title: 'Green Energy & Cetak Biru Menuju Indonesia Emas 2045',
    subtitle: 'Transisi Energi Terbarukan, Dekarbonisasi Pesisir & Kedaulatan Pangan',
    spineLabel: 'INDONESIA EMAS 2045',
    coverColor: '#3a2416',
    period: '2025 – 2045',
    synopsis:
      'Peta jalan strategis Universitas Diponegoro dalam menyongsong 100 tahun Republik Indonesia: mencetak sejuta inovator, kemandirian energi bersih, dan pengentasan kemiskinan pesisir.',
    chapters: [
      {
        chapterNumber: 1,
        title: 'Roadmap Menuju Indonesia Emas 2045',
        pageHeader: 'Undip Bermartabat, Undip Bermanfaat bagi Peradaban Dunia',
        period: '2025 – 2045',
        imageKey: 'z2_img_res_energy',
        narrativeParagraphs: [
          'Dengan semangat Pangeran Diponegoro yang pantang menyerah, Undip melangkah menuju satu abad kemerdekaan Indonesia.',
          'Fokus riset diarahkan pada kemandirian pangan bahari, transisi energi surya dan angin di pulau-pulau terluar, serta keadilan hukum yang berpihak pada kesejahteraan rakyat.',
        ],
        historicalQuote: '“Bekerja keras, berkarya nyata, dan menjaga keluhuran ilmu demi masa depan kejayaan peradaban nusantara.”',
      },
    ],
  },
]

/**
 * 5 Rak Buku Sejarah di Museum (Kategori Zona 1 s/d Zona 5)
 */
export interface BookshelfCategory {
  shelfId: 'shelf_z1' | 'shelf_z2' | 'shelf_z3' | 'shelf_z4' | 'shelf_z5'
  zoneNumber: 1 | 2 | 3 | 4 | 5
  zoneName: string
  label: string
  subtitle: string
  cameraFocusPos: [number, number, number]
  cameraLookPos: [number, number, number]
}

export const BOOKSHELF_CATEGORIES: BookshelfCategory[] = [
  {
    shelfId: 'shelf_z1',
    zoneNumber: 1,
    zoneName: 'The Origin of Undip',
    label: 'Rak 01 — The Origin of Undip',
    subtitle: 'Arsip Akta Notaris 1956, Peresmian GRIS & Amanat Bung Karno 1960',
    cameraFocusPos: [7.2, 1.68, -4.2],
    cameraLookPos: [9.7, 1.6, -4.2],
  },
  {
    shelfId: 'shelf_z2',
    zoneNumber: 2,
    zoneName: 'The Growth of Knowledge',
    label: 'Rak 02 — The Growth of Knowledge',
    subtitle: 'Babad 11 Fakultas, Transformasi Lembah Tembalang & PIP Kelautan',
    cameraFocusPos: [7.2, 1.68, 0],
    cameraLookPos: [9.7, 1.6, 0],
  },
  {
    shelfId: 'shelf_z3',
    zoneNumber: 3,
    zoneName: 'The Heritage of Undip',
    label: 'Rak 03 — The Heritage of Undip',
    subtitle: 'Falsafah Pangeran Diponegoro, Panji Lambang & Budaya Almamater',
    cameraFocusPos: [7.2, 1.68, 4.2],
    cameraLookPos: [9.7, 1.6, 4.2],
  },
  {
    shelfId: 'shelf_z4',
    zoneNumber: 4,
    zoneName: 'Undip Today',
    label: 'Rak 04 — Undip Today',
    subtitle: 'Status Mandiri PTN-BH, RSND & Reputasi QS Top Employability',
    cameraFocusPos: [-7.8, 1.68, -5.5],
    cameraLookPos: [-7.8, 1.6, -7.8],
  },
  {
    shelfId: 'shelf_z5',
    zoneNumber: 5,
    zoneName: 'Undip Future',
    label: 'Rak 05 — Undip Future',
    subtitle: 'Inovasi AI Cerdas, Tangan Bionik & Peta Jalan Indonesia Emas 2045',
    cameraFocusPos: [7.8, 1.68, -5.5],
    cameraLookPos: [7.8, 1.6, -7.8],
  },
]

/**
 * 5 Pameran Fisik Utama di Museum
 */
export interface PhysicalExhibitItem {
  id: string
  code: 'history' | 'founders_5' | 'directors_13' | 'photos' | 'miniature'
  title: string
  subtitle: string
  cameraFocusPos: [number, number, number]
  cameraLookPos: [number, number, number]
}

export const PHYSICAL_EXHIBITS: PhysicalExhibitItem[] = [
  {
    id: 'history',
    code: 'history',
    title: '1. Sejarah Utama Undip (undip.ac.id/sejarah-2)',
    subtitle: 'Mimbar Baca Sejarah & Dinding Linimasa 1950–1961',
    cameraFocusPos: [-7.5, 1.68, 0],
    cameraLookPos: [-9.8, 1.6, 0],
  },
  {
    id: 'founders_5',
    code: 'founders_5',
    title: '2. Galeri 5 Pendiri Utama Undip',
    subtitle: 'Mr. Sudarto, Ir. Dan Soelaiman, Mr. Soesanto, Achmad Tjokrokoesoemo, Mr. Imam Bardjo',
    cameraFocusPos: [-7.0, 1.68, 5.5],
    cameraLookPos: [-8.8, 1.8, 7.8],
  },
  {
    id: 'directors_13',
    code: 'directors_13',
    title: '3. Galeri Tokoh Direktorat & Rektorat (13 Tokoh)',
    subtitle: 'Suksesi Kepemimpinan Rektorat dari Periode ke Periode (1957 — Kini)',
    cameraFocusPos: [0, 1.68, 5.2],
    cameraLookPos: [0, 1.9, 7.9],
  },
  {
    id: 'photos',
    code: 'photos',
    title: '4. Galeri Foto Dokumentasi Kampus Awal',
    subtitle: 'Pleburan, Aula GRIS Jl. Pemuda, Kuliah Perdana, Dies Natalis 1960',
    cameraFocusPos: [0, 1.68, -5.2],
    cameraLookPos: [0, 1.9, -7.9],
  },
  {
    id: 'miniature',
    code: 'miniature',
    title: '5. Miniatur 3D Transformasi Kampus Undip',
    subtitle: 'Meja Vitrine Arsitektur Widya Puraya, Waduk Tembalang & Teluk Awur',
    cameraFocusPos: [0, 1.68, -2.6],
    cameraLookPos: [0, 1.2, 0],
  },
]
