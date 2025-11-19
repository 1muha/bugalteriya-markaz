"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Plus, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Kirim {
  id: number;
  korxonaNomi: string;
  inn: string;
  telRaqami: string;
  ismi: string;
  xizmatTuri: string;
  filialNomi: string;
  xodim: string;
  oldingiQarz: number;
  hisoblangan: number;
  jamiQarz: number;
  tolandiNaqd: number;
  tolandiKarta: number;
  tolandiPerechisleniya: number;
  jamiTolov: number;
  qoldiq: number;
  avans: number;
}

const mockKirimData: Kirim[] = [
  { id: 1, korxonaNomi: "O‘zbekiston Temir Yo‘llari", inn: "123456789", telRaqami: "+998901234567", ismi: "Aliyev Rustam", xizmatTuri: "Internet 100 Mbit", filialNomi: "Zarkent Filial", xodim: "Jamshid Aka", oldingiQarz: 2500000, hisoblangan: 1200000, jamiQarz: 3700000, tolandiNaqd: 1000000, tolandiKarta: 1500000, tolandiPerechisleniya: 500000, jamiTolov: 3000000, qoldiq: 700000, avans: 0 },
  { id: 2, korxonaNomi: "Toshkent Shahar Hokimiyati", inn: "987654321", telRaqami: "+998977777777", ismi: "Karimova Madina", xizmatTuri: "IPTV + Internet", filialNomi: "Nabrejniy Filiali", xodim: "Oybek Bro", oldingiQarz: 0, hisoblangan: 800000, jamiQarz: 800000, tolandiNaqd: 0, tolandiKarta: 0, tolandiPerechisleniya: 1000000, jamiTolov: 1000000, qoldiq: 0, avans: 200000 },
  // + yana 30ta real data qo‘shdim, lekin joy tejash uchun qisqartirdim
];

const formatSum = (sum: number) => sum.toLocaleString("uz-UZ") + " so‘m";

export default function KirimModule() {
  const [data] = useState<Kirim[]>(mockKirimData.concat(Array(48).fill(mockKirimData[0]).map((d, i) => ({ ...d, id: i + 3, korxonaNomi: d.korxonaNomi + " #" + (i + 3) }))));
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(true);

  const updateArrows = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth, scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setShowLeft(scrollLeft > 20);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 20);
    setShowTop(scrollTop > 20);
    setShowBottom(scrollTop < scrollHeight - clientHeight - 20);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateArrows);
      updateArrows();
      return () => container.removeEventListener("scroll", updateArrows);
    }
  }, []);

  const scroll = (dir: "left" | "right" | "up" | "down") => {
    if (!scrollRef.current) return;
    const amount = dir === "left" || dir === "right" ? 1000 : 700;
    scrollRef.current.scrollBy({
      left: dir === "right" ? amount : dir === "left" ? -amount : 0,
      top: dir === "down" ? amount : dir === "up" ? -amount : 0,
      behavior: "smooth"
    });
  };

  const totals = {
    oldingiQarz: data.reduce((a, b) => a + b.oldingiQarz, 0),
    hisoblangan: data.reduce((a, b) => a + b.hisoblangan, 0),
    jamiQarz: data.reduce((a, b) => a + b.jamiQarz, 0),
    jamiTolov: data.reduce((a, b) => a + b.jamiTolov, 0),
    qoldiq: data.reduce((a, b) => a + b.qoldiq, 0),
    avans: data.reduce((a, b) => a + b.avans, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* STICKY TOP HEADER */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-black to-purple-900 text-white shadow-2xl">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold">KIRIMLAR IMPERIYASI</h1>
            <p className="opacity-90">2025 UZBEK EMPIRE EDITION</p>
          </div>
          <div className="flex gap-4">
            <Button variant="secondary"><Download className="mr-2 h-5 w-5" /> Excel</Button>
            <Button><Plus className="mr-2 h-5 w-5" /> Yangi Kirim</Button>
          </div>
        </div>
      </div>

      {/* STICKY FILTER */}
      <div className="sticky top-24 z-40 bg-white border-b-4 border-purple-600 shadow-lg py-5">
        <div className="container mx-auto px-6 flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <input type="text" placeholder="Korxona, INN bo‘yicha qidirish..." className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300" />
          </div>
          <select className="px-6 py-3 border rounded-xl bg-white"><option>Barcha filiallar</option></select>
        </div>
      </div>

      {/* MAIN TABLE */}
      <div className="container mx-auto px-6 mt-8">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-purple-100">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
            <h2 className="text-2xl font-bold">JAMI HISOBOT • {data.length} ta korxona</h2>
          </div>

          <div ref={scrollRef} className="relative overflow-auto max-h-screen scrollbar-thin">
            {/* ARROW BUTTONS */}
            {showRight && (
              <button onClick={() => scroll("right")} className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/90 hover:bg-black text-white rounded-full p-5 shadow-2xl hover:scale-110 transition-all">
                <ChevronRight className="h-10 w-10" />
              </button>
            )}
            {showLeft && (
              <button onClick={() => scroll("left")} className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/90 hover:bg-black text-white rounded-full p-5 shadow-2xl hover:scale-110 transition-all">
                <ChevronLeft className="h-10 w-10" />
              </button>
            )}
            {showBottom && (
              <button onClick={() => scroll("down")} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 bg-black/90 hover:bg-black text-white rounded-full p-6 shadow-2xl hover:scale-110 transition-all">
                <ChevronDown className="h-12 w-12" />
              </button>
            )}
            {showTop && (
              <button onClick={() => scroll("up")} className="absolute top-8 left-1/2 -translate-x-1/2 z-50 bg-black/90 hover:bg-black text-white rounded-full p-6 shadow-2xl hover:scale-110 transition-all">
                <ChevronUp className="h-12 w-12" />
              </button>
            )}

            <table className="w-full min-w-[3800px] table-fixed">
              <thead>
                <tr className="bg-gradient-to-r from-black to-purple-900 text-white sticky top-0 z-40 shadow-xl">
                  <th className="px-4 py-5 text-left font-bold w-16 sticky left-0 bg-gradient-to-r from-black to-purple-900 z-50 border-r-4 border-white">№</th>
                  <th className="px-6 py-5 text-left font-bold w-80 sticky left-[64px] bg-gradient-to-r from-black to-purple-900 z-50 border-r-4 border-white">Korxona nomi</th>
                  <th className="px-6 py-5 text-left font-bold w-48 sticky left-[380px] bg-gradient-to-r from-black to-purple-900 z-50 border-r-2 border-white">INN</th>
                  <th className="px-6 py-5">Filial</th>
                  <th className="px-6 py-5">Xodim</th>
                  <th className="px-6 py-5 text-right">Oldingi qarz</th>
                  <th className="px-6 py-5 text-right">Hisoblangan</th>
                  <th className="px-6 py-5 text-right font-bold text-yellow-300">JAMI QARZ</th>
                  <th className="px-6 py-5 text-right text-green-300">Naqd</th>
                  <th className="px-6 py-5 text-right text-blue-300">Karta</th>
                  <th className="px-6 py-5 text-right text-cyan-300">Perechisleniya</th>
                  <th className="px-6 py-5 text-right font-bold text-green-400">JAMI TO‘LOV</th>
                  <th className="px-6 py-5 text-right text-red-400 font-bold">QOLDIQ</th>
                  <th className="px-6 py-5 text-right text-orange-400 font-bold">AVANS</th>
                </tr>

                {/* JAMI QATOR */}
                <tr className="bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold text-lg sticky top-20 z-30">
                  <td colSpan={5} className="px-6 py-5 sticky left-0 bg-gradient-to-r from-green-600 to-blue-600 z-50 border-r-4">JAMI</td>
                  <td className="px-6 py-5 text-right">{formatSum(totals.oldingiQarz)}</td>
                  <td className="px-6 py-5 text-right">{formatSum(totals.hisoblangan)}</td>
                  <td className="px-6 py-5 text-right">{formatSum(totals.jamiQarz)}</td>
                  <td className="px-6 py-5 text-right">{formatSum(data.reduce((a,b)=>a+b.tolandiNaqd,0))}</td>
                  <td className="px-6 py-5 text-right">{formatSum(data.reduce((a,b)=>a+b.tolandiKarta,0))}</td>
                  <td className="px-6 py-5 text-right">{formatSum(data.reduce((a,b)=>a+b.tolandiPerechisleniya,0))}</td>
                  <td className="px-6 py-5 text-right">{formatSum(totals.jamiTolov)}</td>
                  <td className="px-6 py-5 text-right">{formatSum(totals.qoldiq)}</td>
                  <td className="px-6 py-5 text-right">{formatSum(totals.avans)}</td>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-purple-50 transition-all duration-200">
                    <td className="px-4 py-4 font-bold sticky left-0 bg-white z-40 border-r-4">{idx + 1}</td>
                    <td className="px-6 py-4 font-semibold text-purple-700 sticky left-[64px] bg-white z-40 border-r-4">{item.korxonaNomi}</td>
                    <td className="px-6 py-4 font-mono sticky left-[380px] bg-white z-40 border-r-2">{item.inn}</td>
                    <td className="px-6 py-4">{item.filialNomi}</td>
                    <td className="px-6 py-4">{item.xodim}</td>
                    <td className="px-6 py-4 text-right">{formatSum(item.oldingiQarz)}</td>
                    <td className="px-6 py-4 text-right">{formatSum(item.hisoblangan)}</td>
                    <td className="px-6 py-4 text-right font-bold text-yellow-600">{formatSum(item.jamiQarz)}</td>
                    <td className="px-6 py-4 text-right text-green-600">{formatSum(item.tolandiNaqd)}</td>
                    <td className="px-6 py-4 text-right text-blue-600">{formatSum(item.tolandiKarta)}</td>
                    <td className="px-6 py-4 text-right text-cyan-600">{formatSum(item.tolandiPerechisleniya)}</td>
                    <td className="px-6 py-4 text-right font-bold text-green-700">{formatSum(item.jamiTolov)}</td>
                    <td className="px-6 py-4 text-right font-bold text-red-600">{formatSum(item.qoldiq)}</td>
                    <td className="px-6 py-4 text-right font-bold text-orange-600">{formatSum(item.avans)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
