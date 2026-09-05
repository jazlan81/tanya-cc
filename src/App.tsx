import React, { useState, useMemo } from 'react';
import { MessageCircle, Calculator, Home, User, UploadCloud, Search, FileCheck, Clock, ChevronRight, File, ArrowLeft, Bell, MoreVertical, Send, Paperclip, CheckCircle2, Download, BookOpen, Shield, Award, Play, Minus, Plus, Newspaper, Sparkles, House, Wallet, Percent } from 'lucide-react';

const PRIMARY = "#0A2A5A";
const GOLD = "#FFD700";

type Tab = "home" | "chat" | "kalkulator" | "berita" | "profil" | "upload" | "gcr" | "lppsa" | "timeline";
type KalkulatorSub = "medical" | "gcr" | "lppsa";
type JenisPersaraan = "medical" | "pilihan" | "wajib";

const formatRM = (n: number) => new Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR', maximumFractionDigits: 0 }).format(n).replace('MYR', 'RM');
const formatRM2 = (n: number) => new Intl.NumberFormat('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [kalkSub, setKalkSub] = useState<KalkulatorSub>("medical");
  const [showAllGrid, setShowAllGrid] = useState(false);
  const [gajiAkhir, setGajiAkhir] = useState(4500);
  const [tahunServis, setTahunServis] = useState(22);
  const [tahunServisB, setTahunServisB] = useState(30);
  const [compareMode, setCompareMode] = useState(false);
  const [jenisPersaraan, setJenisPersaraan] = useState<JenisPersaraan>("medical");
  const [gcrGaji, setGcrGaji] = useState(4500);
  const [bakiCuti, setBakiCuti] = useState(75);
  const [tahunBerkhidmat, setTahunBerkhidmat] = useState(22);
  const [hargaRumah, setHargaRumah] = useState(400000);
  const [depositRM, setDepositRM] = useState(40000);
  const [depositPct, setDepositPct] = useState(10);
  const [depositMode, setDepositMode] = useState<"rm" | "pct">("rm");
  const [tempohLPPSA, setTempohLPPSA] = useState(30);
  const [kadarLPPSA, setKadarLPPSA] = useState(4.0);
  const [gajiPokokLPPSA, setGajiPokokLPPSA] = useState(4500);
  const [bakiHutang, setBakiHutang] = useState(600);

  const calcPencen = (tahun: number, gaji: number) => {
    const bulan = Math.max(0, Math.min(35, tahun)) * 12;
    const rate = Math.min(bulan / 600, 0.6);
    const pencen = rate * gaji;
    const ganjaran = 0.075 * bulan * gaji;
    const percent = rate * 100;
    return { bulan, rate, pencen, ganjaran, percent };
  };
  const mainCalc = useMemo(() => calcPencen(tahunServis, gajiAkhir), [tahunServis, gajiAkhir]);
  const compareCalc = useMemo(() => calcPencen(tahunServisB, gajiAkhir), [tahunServisB, gajiAkhir]);
  const gcrCalc = useMemo(() => {
    const kadarHarian = gcrGaji / 30;
    const jumlah = kadarHarian * bakiCuti;
    const max150 = Math.min(bakiCuti, 150);
    const jumlahMax = kadarHarian * max150;
    return { kadarHarian, jumlah, jumlahMax };
  }, [gcrGaji, bakiCuti]);
  const lppsaCalc = useMemo(() => {
    const depositActual = depositMode === "pct" ? Math.round(hargaRumah * (depositPct / 100)) : depositRM;
    const pinjaman = Math.max(0, hargaRumah - depositActual);
    const r = kadarLPPSA / 100 / 12;
    const n = tempohLPPSA * 12;
    const bayaran = r === 0 ? pinjaman / n : pinjaman * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalBayar = bayaran * n;
    const totalFaedah = totalBayar - pinjaman;
    const had60 = gajiPokokLPPSA * 0.6;
    const komitmen = bayaran + bakiHutang;
    const layak = komitmen <= had60 && pinjaman > 0;
    const bakiGaji = gajiPokokLPPSA - komitmen;
    const dti = gajiPokokLPPSA > 0 ? (komitmen / gajiPokokLPPSA) * 100 : 0;
    return { depositActual, pinjaman, bayaran, totalBayar, totalFaedah, had60, komitmen, layak, bakiGaji, dti, n };
  }, [hargaRumah, depositRM, depositPct, depositMode, tempohLPPSA, kadarLPPSA, gajiPokokLPPSA, bakiHutang]);
  const goKalk = (sub: KalkulatorSub) => {
    setKalkSub(sub);
    setActiveTab("kalkulator");
  };

  return (
    <div className="min-h-screen w-full bg-[#EEF3FB] flex flex-col items-center py-6 px-3 font-sans selection:bg-[#FFD700]/30">
      <div className="w-full max-w-[1280px] flex justify-between items-center mb-4 px-2">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-extrabold text-[14px] tracking-tight" style={{ background: PRIMARY }}>CC</div>
          <div>
            <p className="text-[13px] font-bold tracking-tight text-slate-800">Tanya CC</p>
            <p className="text-[11px] font-medium text-slate-500 -mt-0.5">AI Rujukan Penjawat Awam</p>
          </div>
        </div>
        <button onClick={() => setShowAllGrid(!showAllGrid)} className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-200 text-sm font-medium hover:bg-slate-50">
          <div className="h-2 w-2 rounded-full bg-[#0A2A5A] animate-pulse" />
          {showAllGrid ? "Lihat Prototaip Telefon" : "Lihat Semua Skrin Grid"}
        </button>
      </div>
      {showAllGrid ? (
        <GridView gajiAkhir={gajiAkhir} tahunServis={tahunServis} tahunServisB={tahunServisB} compareMode={compareMode} jenisPersaraan={jenisPersaraan} mainCalc={mainCalc} compareCalc={compareCalc} gcrGaji={gcrGaji} bakiCuti={bakiCuti} tahunBerkhidmat={tahunBerkhidmat} gcrCalc={gcrCalc} lppsaCalc={lppsaCalc} setActiveTab={setActiveTab} setShowAllGrid={setShowAllGrid} goKalk={goKalk} hargaRumah={hargaRumah} depositRM={depositRM} depositPct={depositPct} depositMode={depositMode} tempohLPPSA={tempohLPPSA} kadarLPPSA={kadarLPPSA} gajiPokokLPPSA={gajiPokokLPPSA} bakiHutang={bakiHutang} />
      ) : (
        <PhoneFrame activeTab={activeTab} setActiveTab={setActiveTab} kalkSub={kalkSub}>
          {activeTab === "home" && <HomeScreen setActiveTab={setActiveTab} goKalk={goKalk} />}
          {activeTab === "chat" && <ChatScreen setActiveTab={setActiveTab} />}
          {activeTab === "kalkulator" && (
            <KalkulatorHubScreen kalkSub={kalkSub} setKalkSub={setKalkSub} gajiAkhir={gajiAkhir} setGajiAkhir={setGajiAkhir} tahunServis={tahunServis} setTahunServis={setTahunServis} tahunServisB={tahunServisB} setTahunServisB={setTahunServisB} compareMode={compareMode} setCompareMode={setCompareMode} jenisPersaraan={jenisPersaraan} setJenisPersaraan={setJenisPersaraan} mainCalc={mainCalc} compareCalc={compareCalc} setActiveTab={setActiveTab} gcrGaji={gcrGaji} setGcrGaji={setGcrGaji} bakiCuti={bakiCuti} setBakiCuti={setBakiCuti} tahunBerkhidmat={tahunBerkhidmat} setTahunBerkhidmat={setTahunBerkhidmat} gcrCalc={gcrCalc} lppsaCalc={lppsaCalc} hargaRumah={hargaRumah} setHargaRumah={setHargaRumah} depositRM={depositRM} setDepositRM={setDepositRM} depositPct={depositPct} setDepositPct={setDepositPct} depositMode={depositMode} setDepositMode={setDepositMode} tempohLPPSA={tempohLPPSA} setTempohLPPSA={setTempohLPPSA} kadarLPPSA={kadarLPPSA} setKadarLPPSA={setKadarLPPSA} gajiPokokLPPSA={gajiPokokLPPSA} setGajiPokokLPPSA={setGajiPokokLPPSA} bakiHutang={bakiHutang} setBakiHutang={setBakiHutang} />
          )}
          {activeTab === "berita" && <BeritaScreen setActiveTab={setActiveTab} />}
          {activeTab === "gcr" && <GCRScreen gcrGaji={gcrGaji} setGcrGaji={setGcrGaji} bakiCuti={bakiCuti} setBakiCuti={setBakiCuti} tahunBerkhidmat={tahunBerkhidmat} setTahunBerkhidmat={setTahunBerkhidmat} gcrCalc={gcrCalc} setActiveTab={setActiveTab} />}
          {activeTab === "lppsa" && <LPPSAScreen setActiveTab={setActiveTab} goKalk={goKalk} lppsaCalc={lppsaCalc} hargaRumah={hargaRumah} setHargaRumah={setHargaRumah} depositRM={depositRM} setDepositRM={setDepositRM} depositPct={depositPct} setDepositPct={setDepositPct} depositMode={depositMode} setDepositMode={setDepositMode} tempohLPPSA={tempohLPPSA} setTempohLPPSA={setTempohLPPSA} kadarLPPSA={kadarLPPSA} setKadarLPPSA={setKadarLPPSA} gajiPokokLPPSA={gajiPokokLPPSA} setGajiPokokLPPSA={setGajiPokokLPPSA} bakiHutang={bakiHutang} setBakiHutang={setBakiHutang} />}
          {activeTab === "upload" && <UploadScreen setActiveTab={setActiveTab} />}
          {(activeTab === "profil" || activeTab === "timeline") && <ProfilTimelineScreen setActiveTab={setActiveTab} />}
        </PhoneFrame>
      )}
      <p className="mt-6 text-[11px] text-slate-400 text-center max-w-[420px]">Tanya CC — Kalkulator mengikut formula JPA 1/600 × bulan × gaji akhir, maks 60% (TPSI 360 bln). Bukan nasihat rasmi JPA.</p>
    </div>
  );
}

function PhoneFrame({ children, activeTab, setActiveTab, kalkSub }: any) {
  return (
    <div className="relative">
      <div className="w-[390px] max-w-[92vw] h-[844px] max-h-[88vh] bg-[#0B0B0F] rounded-[56px] p-[11px] shadow-[0_30px_80px_-20px_rgba(10,42,90,0.45),0_0_0_1px_rgba(0,0,0,0.08)]">
        <div className="w-full h-full bg-white rounded-[44px] overflow-hidden flex flex-col relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-[#0B0B0F] rounded-b-[16px] z-30 flex items-center justify-center">
            <div className="w-[54px] h-[5px] bg-[#2A2A30] rounded-full" />
          </div>
          <div className="h-[44px] flex items-center justify-between px-8 pt-2 text-[12px] font-semibold text-slate-900 z-20">
            <span>9:41</span>
            <div className="flex items-center gap-1"><div className="w-4 h-[10px] border border-slate-900 rounded-[3px] relative"><div className="absolute inset-[2px] bg-slate-900 rounded-[1px] w-[70%]" /></div></div>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#F8FAFF] scrollbar-none relative" style={{ scrollbarWidth: 'none' }}>{children}</div>
          <div className="h-[84px] bg-white/95 backdrop-blur border-t border-slate-100 px-1.5 pt-2 pb-6 flex justify-around items-start shrink-0">
            {[
              { id: "home", label: "Utama", icon: Home },
              { id: "chat", label: "Tanya CC", icon: MessageCircle },
              { id: "kalkulator", label: "Kalkulator", icon: Calculator },
              { id: "berita", label: "Berita", icon: Newspaper },
              { id: "profil", label: "Profil", icon: User },
            ].map((item) => {
              const active = activeTab === item.id || ((activeTab === "gcr" || activeTab === "lppsa") && item.id === "kalkulator") || (activeTab === "timeline" && item.id === "profil");
              return (
                <button key={item.id} onClick={() => setActiveTab(item.id)} className="flex flex-col items-center gap-1 min-w-[64px]">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center transition-all ${active ? "bg-[#0A2A5A] text-white shadow-sm" : "text-slate-400"}`}><item.icon className="w-[18px] h-[18px]" /></div>
                  <span className={`text-[10px] font-semibold tracking-tight ${active ? "text-[#0A2A5A]" : "text-slate-400"}`}>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="absolute top-[120px] -left-[3px] w-[3px] h-[32px] bg-[#1a1a1e] rounded-l" />
      <div className="absolute top-[164px] -left-[3px] w-[3px] h-[64px] bg-[#1a1a1e] rounded-l" />
      <div className="absolute top-[240px] -left-[3px] w-[3px] h-[64px] bg-[#1a1a1e] rounded-l" />
      <div className="absolute top-[168px] -right-[3px] w-[3px] h-[88px] bg-[#1a1a1e] rounded-r" />
    </div>
  );
}

function HomeScreen({ setActiveTab, goKalk }: any) {
  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-5" style={{ background: `linear-gradient(180deg, ${PRIMARY} 0%, #133775 100%)` }}>
        <div className="flex items-start justify-between text-white">
          <div>
            <div className="flex items-center gap-2"><div className="h-7 w-7 rounded-full bg-white/15 flex items-center justify-center backdrop-blur"><Shield className="w-3.5 h-3.5 text-white" /></div><p className="text-[10px] tracking-[0.18em] font-bold opacity-75">KERAJAAN MALAYSIA • JPA</p></div>
            <h1 className="text-[26px] font-extrabold leading-tight mt-3 tracking-tight">Tanya CC</h1>
            <p className="text-[12px] opacity-80 font-medium -mt-0.5">AI Rujukan Penjawat Awam</p>
          </div>
          <button className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center"><Bell className="w-4 h-4" /></button>
        </div>
        <div className="mt-4 bg-white rounded-[16px] p-3 flex items-center gap-3 shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
          <div className="h-11 w-11 rounded-full bg-[#0A2A5A] flex items-center justify-center shrink-0 text-[20px]">👨🏽‍💼</div>
          <div className="flex-1 min-w-0"><p className="text-[13px] font-bold text-[#0A2A5A] leading-tight">Selamat Pagi, Encik Ahmad 👋</p><p className="text-[11px] text-slate-500 leading-tight">CC Jazlan sedia membantu • N41 • 8 tahun</p></div>
          <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
        </div>
      </div>
      <div className="px-5 -mt-3"><div className="h-[48px] bg-white rounded-[14px] border border-slate-200 shadow-sm flex items-center px-3.5 gap-2.5"><Search className="w-4 h-4 text-slate-400" /><input placeholder="Tanya apa pasal pencen, GCR, pekeliling..." className="flex-1 text-[13px] outline-none placeholder:text-slate-400 font-medium bg-transparent" /><div className="h-6 px-2 rounded-full bg-[#0A2A5A] text-white text-[10px] font-bold flex items-center">AI</div></div></div>
      <div className="px-5 mt-4">
        <div className="flex items-center justify-between mb-2.5"><h3 className="text-[13px] font-bold text-slate-800">Akses Pantas</h3><span className="text-[11px] text-slate-400">6 perkhidmatan</span></div>
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { id: "chat", label: "Tanya CC", sub: "Chat AI", icon: MessageCircle, accent: "bg-[#0A2A5A]" },
            { id: "medical", label: "Kalkulator", sub: "Medical Board", icon: Award, accent: "bg-[#0A2A5A]" },
            { id: "lppsa", label: "Kalkulator", sub: "LPPSA", icon: House, accent: "bg-[#0E7C6B]" },
            { id: "upload", label: "Upload", sub: "Dokumen", icon: UploadCloud, accent: "bg-slate-700" },
            { id: "timeline", label: "Timeline", sub: "Perkhidmatan", icon: Clock, accent: "bg-slate-700" },
            { id: "berita", label: "Berita", sub: "Pekeliling", icon: Newspaper, accent: "bg-slate-700" },
          ].map((card) => (
            <button key={`${card.id}-${card.sub}`} onClick={() => {
              if (card.id === "medical" || card.id === "lppsa") goKalk(card.id as any);
              else setActiveTab(card.id);
            }} className="bg-white rounded-[16px] border border-slate-100 p-3 text-left shadow-[0_2px_10px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-all text-left">
              <div className={`h-9 w-9 rounded-[11px] ${card.accent} text-white flex items-center justify-center mb-2`}><card.icon className="w-5 h-5" /></div>
              <p className="text-[12px] font-bold leading-tight text-slate-800">{card.label}</p>
              <p className="text-[10px] text-slate-500 leading-tight">{card.sub}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="px-5 mt-5 space-y-3">
        <div className="bg-white rounded-[16px] border border-slate-100 p-4 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="h-8 w-8 rounded-full bg-[#0A2A5A] flex items-center justify-center text-white text-[11px] font-bold">CJ</div>
            <div><p className="text-[12px] font-bold text-slate-800 leading-none">CC Jazlan sedia membantu</p><p className="text-[10px] text-slate-500">AI persona • Bahasa Melayu santai</p></div>
            <div className="ml-auto h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          <p className="text-[11px] text-slate-600 leading-snug bg-slate-50 border rounded-[12px] p-2.5">"Assalamualaikum Encik Ahmad, saya CC Jazlan. Nak kira pencen medical board, GCR, atau semak kelayakan LPPSA? Tanya je, saya ringkaskan ikut pekeliling JPA terkini."</p>
        </div>
        <div className="bg-white rounded-[16px] border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-3"><div className="h-6 w-6 rounded-full bg-[#EEF3FF] flex items-center justify-center"><Sparkles className="w-3.5 h-3.5 text-[#0A2A5A]" /></div><p className="text-[12px] font-bold text-slate-800">Soalan Popular</p></div>
          <div className="space-y-2.5">
            {["Medical board kurang 30 tahun dapat pencen penuh ke?", "Kiraan GCR bila bersara pilihan sendiri?", "Ganjaran dikira macam mana lepas 2018?"].map((q, i) => (
              <div key={i} className="flex items-center gap-2.5 text-[12px] text-slate-600"><span className="h-5 w-5 rounded-full bg-slate-50 border flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span><span className="leading-snug">{q}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatScreen({ setActiveTab }: any) {
  const [input, setInput] = useState("");
  return (
    <div className="flex flex-col h-full">
      <div className="h-[56px] px-4 flex items-center justify-between bg-white border-b border-slate-100 shrink-0"><div className="flex items-center gap-3"><button onClick={() => setActiveTab("home")} className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center"><ArrowLeft className="w-4 h-4" /></button><div className="h-9 w-9 rounded-full bg-[#0A2A5A] flex items-center justify-center text-white text-[12px] font-bold">CJ</div><div><p className="text-[13px] font-bold text-slate-900 leading-none">CC Jazlan</p><p className="text-[11px] text-emerald-600 flex items-center gap-1"><span className="h-1.5 w-1.5 bg-emerald-500 rounded-full" /> Online • AI Rujukan Tanya CC</p></div></div><MoreVertical className="w-4 h-4 text-slate-400" /></div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#EEF3FF]">
        <div className="flex justify-center"><span className="text-[10px] bg-white border px-3 py-1 rounded-full text-slate-500 shadow-sm">Hari ini • 9:31 AM</span></div>
        <div className="flex justify-end"><div className="max-w-[78%] bg-[#0A2A5A] text-white rounded-[18px] rounded-br-[4px] px-4 py-3 shadow-sm"><p className="text-[13px] leading-snug">Medical board 21 tahun, gaji akhir 4500 berapa pencen?</p><p className="text-[10px] opacity-70 mt-1 text-right">9:31 AM ✓✓</p></div></div>
        <div className="flex gap-2"><div className="h-7 w-7 rounded-full bg-[#0A2A5A] text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-1">CJ</div><div className="max-w-[84%] space-y-2"><div className="bg-white rounded-[18px] rounded-bl-[4px] px-4 py-3 shadow-sm border border-slate-100"><p className="text-[13px] font-bold text-[#0A2A5A]">Waalaikumussalam 😊 Saya CC Jazlan</p><p className="text-[13px] text-slate-700 leading-snug mt-2">Untuk 21 tahun servis, bulan = 252 bulan.</p><div className="mt-3 rounded-[12px] bg-[#F6F8FF] border border-blue-100 p-3 text-[12px] leading-snug text-slate-700"><p className="font-bold text-[#0A2A5A]">Kiraan Ringkas</p><p className="mt-1">Pencen = 252/600 × RM4500 = RM1890 (42%)</p><p>Ganjaran = 7.5% × 252 × RM4500 = RM85,050</p><p className="mt-2 text-[11px] text-slate-500">Nota: Jika medical board cukup syarat, TPSI 360 bln boleh dipertimbang — kiraan ikut tahun sebenar anda.</p></div><div className="mt-3 rounded-[12px] bg-[#FFFBEB] border border-amber-200 p-2.5 flex gap-2"><div className="h-6 w-6 rounded-full bg-[#0A2A5A] text-white flex items-center justify-center text-[9px] font-bold shrink-0">CJ</div><p className="text-[11px] text-slate-700 leading-snug"><span className="font-bold">Ringkasan oleh CC Jazlan:</span> Kalau 21 tahun medical board, anggaran pencen dalam RM1.8k+. Tapi kalau JPA lulus TPSI, boleh jadi kiraan 30 tahun terus. Rujuk HR anda untuk pengesahan.</p></div></div></div></div>
      </div>
      <div className="bg-white border-t border-slate-100 p-3 flex items-end gap-2 shrink-0"><button className="h-9 w-9 rounded-full bg-slate-50 flex items-center justify-center"><Paperclip className="w-4 h-4 text-slate-500" /></button><div className="flex-1 min-h-[40px] bg-slate-50 rounded-[20px] border border-slate-200 flex items-center px-4"><input value={input} onChange={e => setInput(e.target.value)} placeholder="Tanya CC Jazlan..." className="flex-1 bg-transparent text-[13px] outline-none" /></div><button className="h-9 w-9 rounded-full bg-[#0A2A5A] text-white flex items-center justify-center"><Send className="w-4 h-4" /></button></div>
    </div>
  );
}

function KalkulatorHubScreen({ kalkSub, setKalkSub, gajiAkhir, setGajiAkhir, tahunServis, setTahunServis, tahunServisB, setTahunServisB, compareMode, setCompareMode, jenisPersaraan, setJenisPersaraan, mainCalc, compareCalc, setActiveTab, gcrGaji, setGcrGaji, bakiCuti, setBakiCuti, tahunBerkhidmat, setTahunBerkhidmat, gcrCalc, lppsaCalc, hargaRumah, setHargaRumah, depositRM, setDepositRM, depositPct, setDepositPct, depositMode, setDepositMode, tempohLPPSA, setTempohLPPSA, kadarLPPSA, setKadarLPPSA, gajiPokokLPPSA, setGajiPokokLPPSA, bakiHutang, setBakiHutang }: any) {
  return (
    <div className="pb-6">
      <div className="px-5 pt-3 pb-3 bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-2"><button onClick={() => setActiveTab("home")} className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center"><ArrowLeft className="w-4 h-4" /></button><div><h2 className="text-[15px] font-bold text-slate-900 leading-none">Kalkulator Penjawat Awam</h2><p className="text-[11px] text-slate-500">Pencen • GCR • LPPSA • Formula sah JPA</p></div></div>
        <div className="mt-3 grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-[14px]">
          {[
            { id: "medical", label: "Medical Board", icon: Award },
            { id: "gcr", label: "GCR", icon: Wallet },
            { id: "lppsa", label: "LPPSA", icon: House },
          ].map(o => (
            <button key={o.id} onClick={() => setKalkSub(o.id)} className={`h-9 rounded-[11px] text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${kalkSub === o.id ? "bg-[#0A2A5A] text-white shadow" : "text-slate-500"}`}><o.icon className="w-3.5 h-3.5" />{o.label}</button>
          ))}
        </div>
      </div>
      {kalkSub === "medical" && (
        <KalkulatorPencenScreen gajiAkhir={gajiAkhir} setGajiAkhir={setGajiAkhir} tahunServis={tahunServis} setTahunServis={setTahunServis} tahunServisB={tahunServisB} setTahunServisB={setTahunServisB} compareMode={compareMode} setCompareMode={setCompareMode} jenisPersaraan={jenisPersaraan} setJenisPersaraan={setJenisPersaraan} mainCalc={mainCalc} compareCalc={compareCalc} setActiveTab={setActiveTab} embedded />
      )}
      {kalkSub === "gcr" && (
        <GCRScreen gcrGaji={gcrGaji} setGcrGaji={setGcrGaji} bakiCuti={bakiCuti} setBakiCuti={setBakiCuti} tahunBerkhidmat={tahunBerkhidmat} setTahunBerkhidmat={setTahunBerkhidmat} gcrCalc={gcrCalc} setActiveTab={setActiveTab} embedded />
      )}
      {kalkSub === "lppsa" && (
        <LPPSAScreen setActiveTab={setActiveTab} lppsaCalc={lppsaCalc} hargaRumah={hargaRumah} setHargaRumah={setHargaRumah} depositRM={depositRM} setDepositRM={setDepositRM} depositPct={depositPct} setDepositPct={setDepositPct} depositMode={depositMode} setDepositMode={setDepositMode} tempohLPPSA={tempohLPPSA} setTempohLPPSA={setTempohLPPSA} kadarLPPSA={kadarLPPSA} setKadarLPPSA={setKadarLPPSA} gajiPokokLPPSA={gajiPokokLPPSA} setGajiPokokLPPSA={setGajiPokokLPPSA} bakiHutang={bakiHutang} setBakiHutang={setBakiHutang} embedded goKalk={setKalkSub} />
      )}
    </div>
  );
}

function KalkulatorPencenScreen({ gajiAkhir, setGajiAkhir, tahunServis, setTahunServis, tahunServisB, setTahunServisB, compareMode, setCompareMode, jenisPersaraan, setJenisPersaraan, mainCalc, compareCalc, setActiveTab }: any) {
  const clampTahun = (v: number) => Math.min(35, Math.max(1, Math.round(v) || 1));
  return (
    <div className="pb-6">
      {!(arguments[0] as any)?.embedded && (
        <div className="px-5 pt-3 pb-3 bg-white border-b border-slate-100 sticky top-0 z-10">
          <div className="flex items-center gap-2"><button onClick={() => setActiveTab("home")} className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center"><ArrowLeft className="w-4 h-4" /></button><div><h2 className="text-[15px] font-bold text-slate-900 leading-none">Kalkulator Pencen & Medical Board</h2><p className="text-[11px] text-slate-500">Isi tahun servis bebas • Formula JPA sah</p></div></div>
        </div>
      )}
      <div className="px-5 mt-4 space-y-4">
        <div className="rounded-[18px] p-4 text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #1c4aa0 100%)` }}>
          <div className="absolute -right-10 -top-10 w-28 h-28 bg-white/10 rounded-full blur-xl" />
          <div className="flex gap-3 relative"><div className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center"><Award className="w-5 h-5" /></div><div className="flex-1"><h3 className="text-[13px] font-bold leading-tight">Formula Rasmi JPA</h3><p className="text-[11px] opacity-80 leading-snug mt-1">Pencen = Bulan/600 × Gaji Akhir, maks 60% (360 bln). Ganjaran = 7.5% × bulan × gaji akhir.</p></div></div>
          <div className="mt-3 flex gap-2 flex-wrap"><span className="text-[10px] px-2.5 py-1 rounded-full bg-white/15 border border-white/20">TPSI 360 bulan</span><span className="text-[10px] px-2.5 py-1 rounded-full bg-[#FFD700] text-[#0A2A5A] font-bold">Live</span></div>
        </div>

        <div className="bg-white rounded-[16px] border border-slate-100 p-4 shadow-sm space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-600">Gaji Akhir (RM)</label>
            <div className="mt-1.5 flex items-center gap-2">
              <input type="range" min={1500} max={15000} step={50} value={gajiAkhir} onChange={e => setGajiAkhir(parseInt(e.target.value))} className="flex-1 accent-[#0A2A5A]" />
              <input type="number" value={gajiAkhir} onChange={e => setGajiAkhir(parseInt(e.target.value) || 0)} className="h-10 w-[100px] rounded-[12px] border border-slate-200 bg-slate-50 text-center text-[13px] font-bold" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Contoh: gaji hakiki terakhir sebelum bersara</p>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600">Tahun Servis (1-35 tahun)</label>
            <div className="mt-1.5 flex items-center gap-2">
              <button onClick={() => setTahunServis((t: number) => clampTahun(t - 1))} className="h-10 w-10 rounded-[12px] border bg-white flex items-center justify-center active:scale-95"><Minus className="w-4 h-4" /></button>
              <div className="flex-1 relative">
                <input type="number" min={1} max={35} value={tahunServis} onChange={e => setTahunServis(clampTahun(parseInt(e.target.value) || 1))} className="w-full h-10 rounded-[12px] border border-slate-200 bg-slate-50 text-center text-[15px] font-extrabold text-[#0A2A5A]" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">TAHUN</span>
              </div>
              <button onClick={() => setTahunServis((t: number) => clampTahun(t + 1))} className="h-10 w-10 rounded-[12px] border bg-[#0A2A5A] text-white flex items-center justify-center active:scale-95"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="mt-2 grid grid-cols-5 gap-1.5">
              {[10, 15, 21, 25, 30].map(n => (
                <button key={n} onClick={() => setTahunServis(n)} className={`h-7 rounded-full text-[11px] font-bold border ${tahunServis === n ? "bg-[#0A2A5A] text-white border-[#0A2A5A]" : "bg-white text-slate-600 border-slate-200"}`}>{n}thn</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600">Jenis Persaraan</label>
            <div className="mt-1.5 grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-[12px]">
              {[
                { id: "medical", label: "Medical Board" },
                { id: "pilihan", label: "Pilihan" },
                { id: "wajib", label: "Wajib" },
              ].map(o => (
                <button key={o.id} onClick={() => setJenisPersaraan(o.id)} className={`h-8 rounded-[10px] text-[11px] font-bold transition-all ${jenisPersaraan === o.id ? "bg-[#0A2A5A] text-white shadow" : "text-slate-500"}`}>{o.label}</button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-50 border rounded-[12px] p-3">
            <div><p className="text-[12px] font-bold text-slate-800">Mod Bandingan</p><p className="text-[10px] text-slate-500">Banding 2 tahun servis sebelah-sebelah</p></div>
            <button onClick={() => setCompareMode(!compareMode)} className={`h-7 w-[46px] rounded-full p-0.5 transition-all ${compareMode ? "bg-[#0A2A5A]" : "bg-slate-300"}`}><div className={`h-6 w-6 rounded-full bg-white shadow transition-all ${compareMode ? "translate-x-[18px]" : "translate-x-0"}`} /></button>
          </div>

          {compareMode && (
            <div className="animate-in fade-in">
              <label className="text-[11px] font-semibold text-slate-600">Tahun Bandingan B</label>
              <div className="mt-1.5 flex items-center gap-2">
                <button onClick={() => setTahunServisB((t: number) => clampTahun(t - 1))} className="h-10 w-10 rounded-[12px] border bg-white flex items-center justify-center"><Minus className="w-4 h-4" /></button>
                <input type="number" min={1} max={35} value={tahunServisB} onChange={e => setTahunServisB(clampTahun(parseInt(e.target.value) || 1))} className="flex-1 h-10 rounded-[12px] border border-amber-200 bg-amber-50 text-center text-[15px] font-extrabold text-amber-900" />
                <button onClick={() => setTahunServisB((t: number) => clampTahun(t + 1))} className="h-10 w-10 rounded-[12px] border bg-amber-500 text-white flex items-center justify-center"><Plus className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>

        <div className={`grid gap-3 ${compareMode ? "grid-cols-2" : "grid-cols-1"}`}>
          <ResultCard title={`Pilihan A • ${tahunServis} Tahun`} calc={mainCalc} gaji={gajiAkhir} primary />
          {compareMode && <ResultCard title={`Bandingan B • ${tahunServisB} Tahun`} calc={compareCalc} gaji={gajiAkhir} />}
        </div>

        {compareMode && (
          <div className="bg-white rounded-[16px] border border-slate-100 p-4">
            <p className="text-[12px] font-bold">Beza A vs B</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-[12px]">
              <div className="bg-slate-50 rounded-[12px] p-3 border"><p className="text-[10px] text-slate-500 font-bold tracking-wide">BEZA PENCEN</p><p className={`text-[15px] font-extrabold mt-1 ${compareCalc.pencen - mainCalc.pencen >= 0 ? "text-emerald-700" : "text-amber-700"}`}>{compareCalc.pencen - mainCalc.pencen >= 0 ? "+" : ""}{formatRM(compareCalc.pencen - mainCalc.pencen)}/bln</p></div>
              <div className="bg-slate-50 rounded-[12px] p-3 border"><p className="text-[10px] text-slate-500 font-bold tracking-wide">BEZA GANJARAN</p><p className={`text-[15px] font-extrabold mt-1 ${compareCalc.ganjaran - mainCalc.ganjaran >= 0 ? "text-emerald-700" : "text-amber-700"}`}>{compareCalc.ganjaran - mainCalc.ganjaran >= 0 ? "+" : ""}{formatRM(compareCalc.ganjaran - mainCalc.ganjaran)}</p></div>
            </div>
            <div className="mt-3 h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div className="h-full bg-[#0A2A5A]" style={{ width: `${(mainCalc.bulan/420)*100}%` }} />
              <div className="h-full bg-amber-400" style={{ width: `${(compareCalc.bulan/420)*100}%` }} />
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Graf bulan perkhidmatan vs maksimum 35 tahun (420 bln)</p>
          </div>
        )}

        <div className="rounded-[14px] bg-blue-50 border border-blue-100 p-3.5 flex gap-2.5">
          <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0"><BookOpen className="w-3.5 h-3.5 text-blue-700" /></div>
          <div className="text-[11px] leading-snug text-blue-900">
            <p className="font-bold">Nota CC Jazlan:</p>
            <p className="mt-1">Medical Board kurang 30 tahun tetap boleh dapat faedah seolah 30 tahun jika cukup syarat TPSI 360 bulan (berkuatkuasa 1 Jan 2018). Kalkulator ini ikut tahun sebenar yang anda isi — rujuk JPA untuk pengesahan kes medical board.</p>
            <p className="mt-2 font-mono text-[10px] bg-white/70 border rounded px-2 py-1 inline-block">Pencen = {mainCalc.bulan}/600 × {formatRM(gajiAkhir)} • Ganjaran = 7.5% × {mainCalc.bulan} × {formatRM(gajiAkhir)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button className="h-11 rounded-[14px] bg-[#0A2A5A] text-white text-[12px] font-bold flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(10,42,90,0.25)]"><Download className="w-4 h-4" /> Simpan Laporan</button>
          <button onClick={() => setActiveTab("chat")} className="h-11 rounded-[14px] border border-[#0A2A5A] bg-white text-[#0A2A5A] text-[12px] font-bold flex items-center justify-center gap-2"><MessageCircle className="w-4 h-4" /> Tanya CC Jazlan</button>
        </div>
      </div>
    </div>
  );
}

function ResultCard({ title, calc, gaji, primary }: any) {
  return (
    <div className={`rounded-[18px] p-4 relative overflow-hidden border ${primary ? "bg-[#0A2A5A] text-white border-[#0A2A5A] shadow-[0_12px_24px_rgba(10,42,90,0.25)]" : "bg-white border-amber-100"}`}>
      {primary && <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full" />}
      <p className={`text-[10px] font-bold tracking-widest ${primary ? "opacity-60" : "text-amber-700"}`}>{title.toUpperCase()} • {calc.bulan} BULAN</p>
      <div className="mt-3">
        <p className={`text-[11px] ${primary ? "opacity-70" : "text-slate-500"}`}>Pencen Bulanan • {calc.percent.toFixed(1)}%</p>
        <p className="text-[22px] font-extrabold tracking-tight mt-0.5">{formatRM(calc.pencen)}</p>
        <p className={`text-[10px] mt-1 ${primary ? "opacity-60" : "text-slate-400"}`}>Maks 60% = {formatRM(gaji * 0.6)}</p>
      </div>
      <div className={`mt-3 rounded-[12px] p-2.5 ${primary ? "bg-white/10" : "bg-amber-50 border border-amber-100"}`}>
        <p className={`text-[10px] font-bold ${primary ? "opacity-70" : "text-amber-800"}`}>GANJARAN SEKALIGUS</p>
        <p className="text-[15px] font-bold mt-0.5">{formatRM(calc.ganjaran)}</p>
        <p className={`text-[10px] mt-1 ${primary ? "opacity-60" : "text-slate-500"}`}>7.5% × {calc.bulan} × {formatRM(gaji)}</p>
      </div>
      <div className="mt-3">
        <div className={`h-1.5 w-full rounded-full overflow-hidden ${primary ? "bg-white/20" : "bg-slate-100"}`}><div className={`h-full ${primary ? "bg-[#FFD700]" : "bg-amber-500"}`} style={{ width: `${Math.min(100, (calc.bulan / 360) * 100)}%` }} /></div>
        <p className={`text-[10px] mt-1.5 ${primary ? "opacity-60" : "text-slate-400"}`}>{calc.bulan}/360 bulan ke 60%</p>
      </div>
    </div>
  );
}

function BeritaScreen({ setActiveTab }: any) {
  const [playingId, setPlayingId] = useState<string | null>("vid1");
  const news: any[] = [
    { id: "vid1", title: "SSPA 2024: Kenaikan Gaji Penjawat Awam", date: "1 Jan 2026", duration: "2:14", desc: "Penerangan ringkas pelarasan 8% gaji pokok & implikasi pencen.", videoPoster: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600&h=340&fit=crop", ringkasan: "Video ni cakap pasal pelarasan SSPA 2024 — kenaikan 8% gaji pokok. Kesan terus ke pencen sebab gaji akhir naik, jadi pencen & ganjaran pun naik sekali. Berkuatkuasa berperingkat." },
    { id: "vid2", title: "Medical Board: Syarat & Faedah TPSI 360 Bulan", date: "15 Dis 2024", duration: "3:42", desc: "Apa berlaku kalau servis kurang 30 tahun tapi medical board? Penjelasan JPA.", videoPoster: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=340&fit=crop", ringkasan: "Video ni cakap pasal medical board bawah 30 tahun. Kalau JPA sahkan tidak sihat kekal, boleh dapat faedah TPSI 360 bulan — dikira seolah 30 tahun servis. Kena ada laporan perubatan lengkap." },
    { id: "vid3", title: "Cara Kira GCR 150 Hari Maksimum", date: "8 Nov 2024", duration: "1:55", desc: "Formula kadar harian dan had 150 hari untuk GCR.", videoPoster: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=340&fit=crop", ringkasan: "Video ni cakap pasal GCR — Gantian Cuti Rehat. Kadar harian = gaji akhir /30. Maksimum tebus 150 hari je, walaupun baki lebih. Kena cukup 10 tahun berkhidmat." },
    { id: "vid4", title: "LPPSA: Had 60% Gaji & Kiraan Kelayakan", date: "20 Okt 2024", duration: "2:48", desc: "Macam mana LPPSA kira layak ke tak? Rule 60% gaji pokok.", videoPoster: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=340&fit=crop", ringkasan: "Video ni cakap pasal kelayakan LPPSA — ansuran rumah + hutang lain tak boleh lebih 60% gaji pokok. Kalau gaji RM4500, had hutang RM2700. Baki bersih kena positif lepas tolak semua komitmen." },
  ];
  return (
    <div className="pb-6">
      <div className="px-5 pt-3 pb-3 bg-white border-b border-slate-100 sticky top-0 z-10 flex items-center gap-2">
        <button onClick={() => setActiveTab("home")} className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center"><ArrowLeft className="w-4 h-4" /></button>
        <div><h2 className="text-[15px] font-bold leading-none">Berita CC</h2><p className="text-[11px] text-slate-500">Video + ringkasan oleh CC Jazlan</p></div>
      </div>
      <div className="px-5 mt-4 space-y-4">
        <div className="rounded-[16px] bg-[#0A2A5A] p-4 text-white relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full" />
          <div className="flex items-center gap-2.5"><div className="h-8 w-8 rounded-full bg-white text-[#0A2A5A] flex items-center justify-center text-[11px] font-extrabold">CJ</div><div><p className="text-[10px] font-bold tracking-widest opacity-70">TANYA CC • CC JAZLAN</p><p className="text-[13px] font-semibold leading-snug">Tonton video, CC Jazlan ringkaskan terus.</p></div></div>
        </div>
        {news.map((item) => (
          <div key={item.id} className="bg-white rounded-[16px] border border-slate-100 overflow-hidden shadow-sm">
            <div className="relative aspect-video bg-slate-900 overflow-hidden group cursor-pointer" onClick={() => setPlayingId(item.id)}>
              {playingId === item.id ? (
                <video className="w-full h-full object-cover" controls autoPlay poster={item.videoPoster}>
                  <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                </video>
              ) : (
                <>
                  <img src={item.videoPoster} alt={item.title} className="w-full h-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center"><div className="h-12 w-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.25)]"><Play className="w-5 h-5 text-[#0A2A5A] ml-0.5" /></div></div>
                  <div className="absolute bottom-2 right-2 text-[10px] font-bold bg-black/70 text-white px-2 py-0.5 rounded-full">{item.duration}</div>
                </>
              )}
            </div>
            <div className="p-3.5">
              <div className="flex items-center gap-2"><span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 border text-slate-600 font-bold">{item.date}</span><span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFD700]/20 text-[#0A2A5A] border border-[#FFD700]/30 font-bold">VIDEO</span></div>
              <p className="text-[13px] font-bold leading-snug mt-2 text-slate-800">{item.title}</p>
              <p className="text-[11px] text-slate-500 leading-snug mt-1">{item.desc}</p>
              <div className="mt-3 rounded-[12px] bg-[#F6F8FF] border border-blue-100 p-3">
                <div className="flex items-center gap-2 mb-1.5"><div className="h-6 w-6 rounded-full bg-[#0A2A5A] text-white flex items-center justify-center text-[9px] font-bold">CJ</div><p className="text-[11px] font-bold text-[#0A2A5A]">Ringkasan oleh CC Jazlan:</p><span className="ml-auto text-[9px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold">AI Summary</span></div>
                <p className="text-[11px] leading-snug text-slate-700">{item.ringkasan}</p>
                <div className="mt-2 flex gap-1.5">
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-white border text-slate-600">Bahasa Melayu santai</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-white border text-slate-600">Sumber: JPA</span>
                </div>
              </div>
              <button onClick={() => setPlayingId(playingId === item.id ? null : item.id)} className="mt-3 w-full h-9 rounded-[10px] bg-[#0A2A5A] text-white text-[11px] font-bold flex items-center justify-center gap-1.5"><Play className="w-3.5 h-3.5" /> {playingId === item.id ? "Tutup Video" : "Tonton Dalam App"}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GCRScreen({ gcrGaji, setGcrGaji, bakiCuti, setBakiCuti, tahunBerkhidmat, setTahunBerkhidmat, gcrCalc, setActiveTab, embedded }: any) {
  return (
    <div className="pb-6">
      {!embedded && (
        <div className="px-5 pt-3 pb-3 bg-white border-b flex items-center gap-2 sticky top-0 z-10"><button onClick={() => setActiveTab("home")} className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center"><ArrowLeft className="w-4 h-4" /></button><h2 className="text-[15px] font-bold">Kalkulator GCR</h2><span className="ml-auto text-[10px] px-2 py-1 rounded-full bg-slate-100 border">Gantian Cuti Rehat</span></div>
      )}
      <div className="px-5 mt-4 space-y-4">
        <div className="bg-white rounded-[16px] border border-slate-100 p-4 shadow-sm">
          <label className="text-[11px] font-semibold text-slate-600">Gaji Akhir (RM)</label>
          <input type="number" value={gcrGaji} onChange={e => setGcrGaji(parseInt(e.target.value) || 0)} className="mt-1.5 w-full h-10 rounded-[12px] border border-slate-200 px-3 text-[13px] font-bold bg-slate-50" />
          <div className="mt-4 grid grid-cols-2 gap-3"><div><label className="text-[11px] font-semibold text-slate-600">Baki Cuti (hari)</label><input type="range" min={0} max={180} value={bakiCuti} onChange={e => setBakiCuti(parseInt(e.target.value))} className="w-full accent-[#0A2A5A] mt-2" /><div className="text-[12px] font-bold text-[#0A2A5A] mt-1">{bakiCuti} hari {bakiCuti >= 150 && "(MAX 150)"}</div></div><div><label className="text-[11px] font-semibold text-slate-600">Tahun Berkhidmat</label><input type="number" value={tahunBerkhidmat} onChange={e => setTahunBerkhidmat(parseInt(e.target.value) || 0)} className="mt-1.5 w-full h-9 rounded-[10px] border px-3 text-[13px]" /><p className="text-[10px] text-slate-400 mt-1">Min 10 tahun layak</p></div></div>
        </div>
        <div className="rounded-[18px] bg-[#0A2A5A] text-white p-5 relative overflow-hidden"><p className="text-[11px] tracking-widest opacity-60 font-bold">ANGGARAN GCR ANDA</p><p className="text-[28px] font-extrabold mt-2 tracking-tight">{formatRM(gcrCalc.jumlahMax)}</p><p className="text-[11px] opacity-80 mt-1">Kadar harian {formatRM(gcrCalc.kadarHarian)} × {Math.min(bakiCuti, 150)} hari (maks 150)</p><div className="mt-4 grid grid-cols-2 gap-3 text-[11px]"><div className="bg-white/10 rounded-[12px] p-2.5"><p className="opacity-70">Tanpa Had</p><p className="font-bold text-[13px]">{formatRM(gcrCalc.jumlah)}</p></div><div className="bg-[#FFD700] text-[#0A2A5A] rounded-[12px] p-2.5"><p className="opacity-80 font-semibold">Had 150 hari</p><p className="font-extrabold text-[13px]">{formatRM(gcrCalc.jumlahMax)}</p></div></div></div>
        {!embedded && (
          <button onClick={() => setActiveTab("kalkulator")} className="w-full h-11 rounded-[12px] border border-slate-200 bg-white text-[12px] font-bold">Buka Kalkulator Pencen</button>
        )}
      </div>
    </div>
  );
}

function LPPSAScreen({ setActiveTab, goKalk, lppsaCalc, hargaRumah, setHargaRumah, depositRM, setDepositRM, depositPct, setDepositPct, depositMode, setDepositMode, tempohLPPSA, setTempohLPPSA, kadarLPPSA, setKadarLPPSA, gajiPokokLPPSA, setGajiPokokLPPSA, bakiHutang, setBakiHutang, embedded }: any) {
  return (
    <div className="pb-6">
      {!embedded && (
        <div className="px-5 pt-3 pb-3 bg-white border-b flex items-center gap-2 sticky top-0 z-10"><button onClick={() => setActiveTab("home")} className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center"><ArrowLeft className="w-4 h-4" /></button><h2 className="text-[15px] font-bold">Kalkulator LPPSA</h2><span className="ml-auto text-[10px] px-2 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 font-bold">Penjawat Awam</span></div>
      )}
      <div className="px-5 mt-4 space-y-4">
        <div className="rounded-[18px] p-4 text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, #0E7C6B 0%, #14967e 100%)` }}>
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          <div className="flex gap-3 relative"><div className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center"><House className="w-5 h-5" /></div><div className="flex-1"><h3 className="text-[13px] font-bold leading-tight">Formula LPPSA Rasmi</h3><p className="text-[11px] opacity-85 leading-snug mt-1">Bayaran = P·r(1+r)^n / ((1+r)^n-1). Kelayakan 60% gaji pokok (ansuran + hutang lain).</p></div></div>
        </div>
        <div className="bg-white rounded-[16px] border border-slate-100 p-3.5 shadow-sm flex gap-2">
          {[
            { label: "Rumah RM300k", val: 300000 },
            { label: "RM400k", val: 400000 },
            { label: "RM500k", val: 500000 },
          ].map(p => (
            <button key={p.val} onClick={() => setHargaRumah(p.val)} className={`flex-1 h-9 rounded-[10px] border text-[11px] font-bold ${hargaRumah===p.val?"bg-[#0A2A5A] text-white border-[#0A2A5A]":"bg-slate-50 text-slate-700 border-slate-200"}`}>{p.label}</button>
          ))}
        </div>
        <div className="bg-white rounded-[16px] border border-slate-100 p-4 shadow-sm space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-600">Harga Rumah (RM)</label>
            <input type="range" min={100000} max={1000000} step={10000} value={hargaRumah} onChange={e=>setHargaRumah(parseInt(e.target.value))} className="w-full accent-[#0E7C6B] mt-2" />
            <div className="mt-1.5 flex gap-2"><input type="number" value={hargaRumah} onChange={e=>setHargaRumah(parseInt(e.target.value)||0)} className="flex-1 h-10 rounded-[12px] border bg-slate-50 px-3 text-[13px] font-bold" /><div className="h-10 px-3 rounded-[12px] bg-slate-100 border flex items-center text-[11px] font-bold">{formatRM(hargaRumah)}</div></div>
          </div>
          <div>
            <div className="flex items-center justify-between"><label className="text-[11px] font-semibold text-slate-600">Deposit</label><div className="flex bg-slate-100 rounded-full p-0.5"><button onClick={()=>setDepositMode("rm")} className={`px-3 h-6 rounded-full text-[10px] font-bold ${depositMode==="rm"?"bg-[#0A2A5A] text-white":"text-slate-500"}`}>RM</button><button onClick={()=>setDepositMode("pct")} className={`px-3 h-6 rounded-full text-[10px] font-bold ${depositMode==="pct"?"bg-[#0A2A5A] text-white":"text-slate-500"}`}>%</button></div></div>
            {depositMode==="rm" ? (
              <input type="number" value={depositRM} onChange={e=>setDepositRM(parseInt(e.target.value)||0)} className="mt-1.5 w-full h-10 rounded-[12px] border bg-slate-50 px-3 text-[13px] font-bold" />
            ) : (
              <div className="mt-1.5 flex items-center gap-2"><input type="range" min={0} max={30} value={depositPct} onChange={e=>setDepositPct(parseInt(e.target.value))} className="flex-1 accent-[#0A2A5A]" /><div className="h-10 w-[72px] rounded-[12px] border bg-slate-50 flex items-center justify-center text-[13px] font-bold">{depositPct}%</div></div>
            )}
            <p className="text-[10px] text-slate-400 mt-1">Deposit sebenar: {formatRM(lppsaCalc.depositActual)} • Pinjaman: {formatRM(lppsaCalc.pinjaman)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[11px] font-semibold text-slate-600">Tempoh (tahun)</label><input type="range" min={5} max={35} value={tempohLPPSA} onChange={e=>setTempohLPPSA(parseInt(e.target.value))} className="w-full accent-[#0A2A5A] mt-2" /><div className="mt-1 h-9 rounded-[10px] bg-slate-50 border flex items-center justify-between px-3"><span className="text-[13px] font-bold">{tempohLPPSA} tahun</span><span className="text-[10px] text-slate-500">{lppsaCalc.n} bulan</span></div></div>
            <div><label className="text-[11px] font-semibold text-slate-600">Kadar Faedah %</label><div className="mt-1.5 flex items-center gap-1.5"><div className="h-10 w-10 rounded-[10px] bg-teal-50 border border-teal-100 flex items-center justify-center"><Percent className="w-4 h-4 text-teal-700" /></div><input type="number" step={0.05} value={kadarLPPSA} onChange={e=>setKadarLPPSA(parseFloat(e.target.value)||0)} className="flex-1 h-10 rounded-[12px] border bg-slate-50 px-3 text-[13px] font-bold" /></div><p className="text-[10px] text-slate-400 mt-1">Default LPPSA 4.00%</p></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[11px] font-semibold text-slate-600">Gaji Pokok (RM)</label><input type="number" value={gajiPokokLPPSA} onChange={e=>setGajiPokokLPPSA(parseInt(e.target.value)||0)} className="mt-1.5 w-full h-10 rounded-[12px] border bg-slate-50 px-3 text-[13px] font-bold" /></div>
            <div><label className="text-[11px] font-semibold text-slate-600">Baki Hutang Lain (RM/bln)</label><input type="number" value={bakiHutang} onChange={e=>setBakiHutang(parseInt(e.target.value)||0)} className="mt-1.5 w-full h-10 rounded-[12px] border bg-slate-50 px-3 text-[13px] font-bold" /></div>
          </div>
        </div>
        <div className={`rounded-[18px] p-5 border relative overflow-hidden ${lppsaCalc.layak ? "bg-[#0A2A5A] border-[#0A2A5A] text-white shadow-[0_12px_24px_rgba(10,42,90,0.25)]" : "bg-white border-amber-200"}`}>
          <div className="flex items-start justify-between gap-3">
            <div><p className={`text-[10px] font-bold tracking-widest ${lppsaCalc.layak ? "opacity-60" : "text-amber-700"}`}>BAYARAN BULANAN LPPSA</p><p className="text-[28px] font-extrabold mt-1 tracking-tight">{formatRM(Math.round(lppsaCalc.bayaran))}<span className="text-[14px] font-bold opacity-70">/bln</span></p><p className={`text-[11px] mt-1 ${lppsaCalc.layak?"opacity-75":"text-slate-500"}`}>Pinjaman {formatRM(lppsaCalc.pinjaman)} • {tempohLPPSA} tahun • {kadarLPPSA}%</p></div>
            <div className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold border ${lppsaCalc.layak ? "bg-emerald-400 text-emerald-950 border-emerald-300" : "bg-amber-100 text-amber-800 border-amber-200"}`}>{lppsaCalc.layak ? "✓ LAYAK" : "✗ TIDAK LAYAK"}</div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <div className={`rounded-[12px] p-2.5 border ${lppsaCalc.layak ? "bg-white/10 border-white/15" : "bg-slate-50 border-slate-200"}`}><p className={`text-[10px] font-bold ${lppsaCalc.layak ? "opacity-70" : "text-slate-500"}`}>HAD 60% GAJI</p><p className="text-[13px] font-bold mt-0.5">{formatRM(lppsaCalc.had60)}/bln</p><p className={`text-[10px] mt-0.5 ${lppsaCalc.layak ? "opacity-60" : "text-slate-400"}`}>Komitmen {formatRM(Math.round(lppsaCalc.komitmen))}</p></div>
            <div className={`rounded-[12px] p-2.5 border ${lppsaCalc.layak ? "bg-[#FFD700] text-[#0A2A5A] border-[#FFD700]" : "bg-amber-50 border-amber-200"}`}><p className="text-[10px] font-bold opacity-70">BAKI GAJI BERSIH</p><p className="text-[13px] font-extrabold mt-0.5">{formatRM(Math.round(lppsaCalc.bakiGaji))}/bln</p><p className="text-[10px] mt-0.5 opacity-70">DTI {lppsaCalc.dti.toFixed(1)}%</p></div>
          </div>
          <div className="mt-4 h-2 w-full bg-black/10 rounded-full overflow-hidden flex"><div className="h-full bg-[#FFD700]" style={{ width: `${Math.min(100, lppsaCalc.dti)}%` }} /></div>
        </div>
        <div className="bg-white rounded-[16px] border border-slate-100 p-4 shadow-sm">
          <p className="text-[12px] font-bold flex items-center gap-2"><Wallet className="w-4 h-4 text-[#0E7C6B]" /> Ringkasan Pembiayaan</p>
          <div className="mt-3 grid grid-cols-2 gap-3 text-[12px]">
            <div className="bg-slate-50 border rounded-[12px] p-3"><p className="text-[10px] text-slate-500 font-bold">JUMLAH BAYAR</p><p className="text-[14px] font-bold mt-1">{formatRM(Math.round(lppsaCalc.totalBayar))}</p><p className="text-[10px] text-slate-400 mt-1">{tempohLPPSA} tahun</p></div>
            <div className="bg-slate-50 border rounded-[12px] p-3"><p className="text-[10px] text-slate-500 font-bold">JUMLAH FAEDAH</p><p className="text-[14px] font-bold mt-1 text-amber-700">{formatRM(Math.round(lppsaCalc.totalFaedah))}</p><p className="text-[10px] text-slate-400 mt-1">{kadarLPPSA}% setahun</p></div>
          </div>
          <div className="mt-3 rounded-[12px] bg-teal-50 border border-teal-100 p-3 flex gap-2.5"><div className="h-7 w-7 rounded-full bg-[#0E7C6B] text-white flex items-center justify-center text-[10px] font-bold shrink-0">CJ</div><p className="text-[11px] leading-snug text-teal-900"><span className="font-bold">Ringkasan oleh CC Jazlan:</span> Harga {formatRM(hargaRumah)}, loan {formatRM(lppsaCalc.pinjaman)}, ansuran {formatRM(Math.round(lppsaCalc.bayaran))}/bln. {lppsaCalc.layak ? "Melepasi had 60% — layak mohon LPPSA." : "Melebihi had 60% — kurangkan harga, tambah deposit, atau pendekkan komitmen lain."} Baki bersih {formatRM(Math.round(lppsaCalc.bakiGaji))}.</p></div>
        </div>
        {!embedded && (
          <button onClick={() => setActiveTab("kalkulator")} className="w-full h-11 rounded-[12px] border border-slate-200 bg-white text-[12px] font-bold">Buka Hub Kalkulator</button>
        )}
      </div>
    </div>
  );
}

function UploadScreen({ setActiveTab }: any) {
  return (
    <div className="pb-6">
      <div className="px-5 pt-3 pb-3 bg-white border-b flex items-center gap-2 sticky top-0 z-10"><button onClick={() => setActiveTab("home")} className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center"><ArrowLeft className="w-4 h-4" /></button><h2 className="text-[15px] font-bold">Upload Dokumen</h2></div>
      <div className="px-5 mt-4 space-y-4">
        <div className="rounded-[18px] border-2 border-dashed border-[#0A2A5A]/20 bg-[#F6F8FF] p-6 text-center"><div className="h-12 w-12 rounded-full bg-white border shadow-sm flex items-center justify-center mx-auto"><UploadCloud className="w-6 h-6 text-[#0A2A5A]" /></div><p className="text-[13px] font-bold mt-3">Seret & lepas pekeliling PDF di sini</p><p className="text-[11px] text-slate-500 mt-1">Sokong PDF, JPG, PNG — maksimum 10MB</p><div className="mt-4 flex justify-center gap-2"><button className="h-9 px-4 rounded-full bg-[#0A2A5A] text-white text-[12px] font-bold">Pilih Fail</button><button className="h-9 px-4 rounded-full bg-white border text-[12px] font-bold">Imbas</button></div></div>
        <div className="bg-white rounded-[16px] border border-slate-100 p-4 shadow-sm"><p className="text-[12px] font-bold flex items-center gap-2"><FileCheck className="w-4 h-4 text-[#0A2A5A]" /> Ringkasan AI</p><div className="mt-3 rounded-[12px] bg-slate-50 border p-3"><p className="text-[11px] font-bold">Pekeliling Perkhidmatan Bil. 4/2023.pdf</p><p className="text-[11px] text-slate-600 mt-2 leading-snug">TPSI 360 bulan, kadar pencen maksimum 60%, dan penyelarasan GCR 150 hari. Berkuatkuasa 1 Jan 2018...</p></div></div>
        <div><p className="text-[12px] font-bold text-slate-700 mb-2">Muat Naik Terkini</p><div className="space-y-2">{[{ name: "Ceraian PP.1.2.5.pdf", time: "2 jam lalu", size: "2.4 MB" }, { name: "Borang Pencen JPA.pdf", time: "3 hari lalu", size: "890 KB" }].map((f, i) => (<div key={i} className="bg-white border border-slate-100 rounded-[12px] p-3 flex items-center gap-3"><div className="h-9 w-9 rounded-[10px] bg-slate-50 flex items-center justify-center"><File className="w-4 h-4 text-slate-600" /></div><div className="flex-1 min-w-0"><p className="text-[12px] font-semibold truncate">{f.name}</p><p className="text-[10px] text-slate-500">{f.time} • {f.size}</p></div><ChevronRight className="w-4 h-4 text-slate-400" /></div>))}</div></div>
      </div>
    </div>
  );
}

function ProfilTimelineScreen({ setActiveTab }: any) {
  const [tab, setTab] = useState<"profil" | "timeline">("profil");
  return (
    <div className="pb-6">
      <div className="px-5 pt-3 pb-3 bg-white border-b sticky top-0 z-10"><div className="flex items-center gap-2"><button onClick={() => setActiveTab("home")} className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center"><ArrowLeft className="w-4 h-4" /></button><h2 className="text-[15px] font-bold">Profil & Perkhidmatan</h2></div><div className="mt-3 grid grid-cols-2 bg-slate-100 rounded-full p-1"><button onClick={() => setTab("profil")} className={`h-8 rounded-full text-[12px] font-bold ${tab === "profil" ? "bg-[#0A2A5A] text-white" : "text-slate-500"}`}>Profil</button><button onClick={() => setTab("timeline")} className={`h-8 rounded-full text-[12px] font-bold ${tab === "timeline" ? "bg-[#0A2A5A] text-white" : "text-slate-500"}`}>Timeline</button></div></div>
      {tab === "profil" ? (
        <div className="px-5 mt-4 space-y-4"><div className="bg-white rounded-[18px] border border-slate-100 p-5 text-center shadow-sm"><div className="h-20 w-20 rounded-full bg-[#0A2A5A] mx-auto flex items-center justify-center text-[36px]">👨🏽‍💼</div><p className="text-[16px] font-bold mt-3">Ahmad bin Abdullah</p><p className="text-[12px] text-slate-500">N41 • JPA Putrajaya • 8 tahun berkhidmat</p><div className="mt-4 grid grid-cols-3 gap-2 text-center"><div className="bg-slate-50 rounded-[12px] p-2.5 border"><p className="text-[11px] text-slate-500">Gaji Akhir</p><p className="text-[13px] font-bold">RM4,500</p></div><div className="bg-slate-50 rounded-[12px] p-2.5 border"><p className="text-[11px] text-slate-500">Cuti</p><p className="text-[13px] font-bold">75 hari</p></div><div className="bg-[#FFD700]/20 rounded-[12px] p-2.5 border border-[#FFD700]/30"><p className="text-[11px] text-[#0A2A5A]">Pencen Layak</p><p className="text-[13px] font-bold">2039</p></div></div></div><div className="bg-white rounded-[16px] border border-slate-100 p-4 shadow-sm"><p className="text-[12px] font-bold mb-3">Tetapan</p><div className="space-y-3 text-[12px]"><div className="flex justify-between"><span>Bahasa</span><span className="font-bold">Bahasa Melayu</span></div><div className="flex justify-between"><span>Tema</span><span className="font-bold">Biru Profesional</span></div><div className="flex justify-between"><span>Notifikasi Pekeliling</span><span className="px-2 py-0.5 rounded-full bg-slate-50 text-[#0A2A5A] text-[10px] border font-bold">Aktif</span></div></div></div></div>
      ) : (
        <div className="px-5 mt-4"><div className="bg-white rounded-[16px] border border-slate-100 p-4 shadow-sm"><p className="text-[12px] font-bold flex items-center gap-2"><Clock className="w-4 h-4" /> Timeline Perkhidmatan</p><div className="mt-4 relative"><div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-slate-200" />{[{ year: "2015", title: "Lantikan Pertama", desc: "PTD N41 • JPA Putrajaya", done: true }, { year: "2018", title: "Pengesahan Jawatan", desc: "TPSI 360 bulan berkuatkuasa", done: true, highlight: true }, { year: "2022", title: "Kenaikan Pangkat", desc: "N44 (KUP)", done: true }, { year: "2026", title: "Semasa", desc: "8 tahun berkhidmat • 22 tahun lagi ke pencen", done: false, current: true }, { year: "2040", title: "Bersara Wajib", desc: "Umur 60 • Ganjaran penuh", done: false }].map((item, i) => (<div key={i} className="relative flex gap-4 pb-6 last:pb-0"><div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${item.current ? "bg-[#FFD700] border-[#FFD700] text-[#0A2A5A]" : item.done ? "bg-[#0A2A5A] border-[#0A2A5A] text-white" : "bg-white border-slate-300 text-slate-400"}`}>{item.done ? <CheckCircle2 className="w-4 h-4" /> : <div className="h-2 w-2 rounded-full bg-current" />}</div><div className={`flex-1 rounded-[12px] border p-3 ${item.current ? "bg-amber-50 border-amber-200" : item.highlight ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-100"}`}><div className="flex items-center gap-2"><span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white border">{item.year}</span>{item.current && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#0A2A5A] text-white">ANDA DI SINI</span>}</div><p className="text-[12px] font-bold mt-1.5">{item.title}</p><p className="text-[11px] text-slate-600 leading-snug">{item.desc}</p></div></div>))}</div></div></div>
      )}
    </div>
  );
}

function GridView({ gajiAkhir, tahunServis, tahunServisB, compareMode, jenisPersaraan, mainCalc, compareCalc, gcrGaji, bakiCuti, tahunBerkhidmat, gcrCalc, lppsaCalc, setActiveTab, setShowAllGrid, goKalk, hargaRumah, depositRM, depositPct, depositMode, tempohLPPSA, kadarLPPSA, gajiPokokLPPSA, bakiHutang }: any) {
  const [localGaji, setLocalGaji] = useState(gajiAkhir);
  const [localTahun, setLocalTahun] = useState(tahunServis);
  const [localTahunB, setLocalTahunB] = useState(tahunServisB);
  const [localCompare, setLocalCompare] = useState(compareMode);
  const [localJenis, setLocalJenis] = useState(jenisPersaraan);
  const [localHarga, setLocalHarga] = useState(hargaRumah || 400000);
  const calc = (t: number, g: number) => {
    const bulan = t*12; const rate = Math.min(bulan/600,0.6); return { bulan, pencen: rate*g, ganjaran: 0.075*bulan*g, percent: rate*100 };
  };
  const m = calc(localTahun, localGaji);
  const c = calc(localTahunB, localGaji);
  return (
    <div className="w-full max-w-[1280px]"><div className="flex items-center justify-between mb-4"><h2 className="text-[16px] font-bold">Semua Skrin — Grid</h2><button onClick={() => setShowAllGrid(false)} className="px-4 py-2 rounded-full bg-[#0A2A5A] text-white text-[12px] font-bold">Kembali ke Telefon</button></div><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{[{ label: "Home", id: "home" }, { label: "Tanya CC - CC Jazlan", id: "chat" }, { label: "Kalkulator Hub (MB+GCR+LPPSA)", id: "kalkulator" }, { label: "Kalkulator LPPSA", id: "lppsa" }, { label: "Berita CC + Ringkasan CJ", id: "berita" }, { label: "Profil & Timeline", id: "timeline" }, { label: "Upload", id: "upload" }].map((s) => (<div key={s.id} className="bg-white rounded-[24px] border shadow-sm overflow-hidden"><div className="h-10 px-4 flex items-center justify-between border-b bg-slate-50"><p className="text-[12px] font-bold">{s.label}</p><button onClick={() => { setActiveTab(s.id as any); setShowAllGrid(false); }} className="text-[11px] px-2.5 py-1 rounded-full bg-[#0A2A5A] text-white">Buka</button></div><div className="h-[560px] overflow-hidden scale-[0.88] origin-top"><div className="w-[390px] mx-auto h-[844px] bg-[#F8FAFF] overflow-y-auto border rounded-[32px]">{s.id === "home" && <HomeScreen setActiveTab={setActiveTab} goKalk={goKalk || ((sub:any)=>{setActiveTab("kalkulator");})} />}{s.id === "chat" && <ChatScreen setActiveTab={setActiveTab} />}{s.id === "kalkulator" && <KalkulatorPencenScreen gajiAkhir={localGaji} setGajiAkhir={setLocalGaji} tahunServis={localTahun} setTahunServis={setLocalTahun} tahunServisB={localTahunB} setTahunServisB={setLocalTahunB} compareMode={localCompare} setCompareMode={setLocalCompare} jenisPersaraan={localJenis} setJenisPersaraan={setLocalJenis} mainCalc={m} compareCalc={c} setActiveTab={setActiveTab} />}{s.id === "lppsa" && <LPPSAScreen lppsaCalc={lppsaCalc} hargaRumah={localHarga} setHargaRumah={setLocalHarga} depositRM={depositRM} setDepositRM={()=>{}} depositPct={depositPct} setDepositPct={()=>{}} depositMode={depositMode} setDepositMode={()=>{}} tempohLPPSA={tempohLPPSA} setTempohLPPSA={()=>{}} kadarLPPSA={kadarLPPSA} setKadarLPPSA={()=>{}} gajiPokokLPPSA={gajiPokokLPPSA} setGajiPokokLPPSA={()=>{}} bakiHutang={bakiHutang} setBakiHutang={()=>{}} setActiveTab={setActiveTab} embedded />}{s.id === "gcr" && <GCRScreen gcrGaji={gcrGaji} setGcrGaji={()=>{}} bakiCuti={bakiCuti} setBakiCuti={()=>{}} tahunBerkhidmat={tahunBerkhidmat} setTahunBerkhidmat={()=>{}} gcrCalc={gcrCalc} setActiveTab={setActiveTab} />}{s.id === "berita" && <BeritaScreen setActiveTab={setActiveTab} />}{s.id === "timeline" && <ProfilTimelineScreen setActiveTab={setActiveTab} />}{s.id === "upload" && <UploadScreen setActiveTab={setActiveTab} />}</div></div></div>))}</div></div>
  );
}
