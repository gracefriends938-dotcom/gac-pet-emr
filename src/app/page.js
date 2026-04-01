import { Activity, Clock, Users, CalendarCheck2, ExternalLink, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { getPatients, getPatientRecords } from "@/lib/sheets";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const allPatients = await getPatients();
  const recentPatients = allPatients.slice(0, 5);
  
  // 実データから統計を算出
  const healthyCount = allPatients.filter(p => p.status === '健康').length;
  const cautionCount = allPatients.filter(p => p.status === '要注意' || p.status === '治療中').length;
  const hospitalizedCount = allPatients.filter(p => p.status === '入院中').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">ダッシュボード</h1>
          <p className="text-slate-500 mt-1">診療状況と概要を確認できます。</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="総患者数"
          value={allPatients.length}
          icon={<Users className="text-indigo-500" size={24} />}
        />
        <StatCard
          title="健康"
          value={healthyCount}
          icon={<CalendarCheck2 className="text-emerald-500" size={24} />}
          badgeColor="emerald"
        />
        <StatCard
          title="要注意・治療中"
          value={cautionCount}
          icon={<AlertTriangle className="text-amber-500" size={24} />}
          badgeColor={cautionCount > 0 ? "amber" : "slate"}
        />
        <StatCard
          title="入院中"
          value={hospitalizedCount}
          icon={<Activity className="text-rose-500" size={24} />}
          badgeColor={hospitalizedCount > 0 ? "rose" : "slate"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Main patients list */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">最近の患者</h2>
            <Link href="/patients" className="text-sm text-emerald-600 font-medium hover:text-emerald-700 hover:underline">すべて見る</Link>
          </div>

          <div className="space-y-4">
            {recentPatients.length > 0 ? recentPatients.map((patient, i) => (
              <Link key={i} href={`/patients/${patient.dbId}`} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all group bg-slate-50/50 hover:bg-white cursor-pointer block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                    <span className="text-2xl">{patient.emoji}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{patient.name} <span className="text-xs font-normal text-slate-500 ml-2">{patient.breed} / {patient.age}</span></h3>
                    <p className="text-sm text-slate-500 mt-0.5">{patient.owner} 様</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${patient.status === '健康' ? 'bg-emerald-100 text-emerald-700' :
                      patient.status === '要注意' ? 'bg-rose-100 text-rose-700' :
                      patient.status === '治療中' ? 'bg-amber-100 text-amber-700' :
                      patient.status === '入院中' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-600'
                    }`}>
                    {patient.status}
                  </span>
                  <span className="text-xs text-slate-400">最終来院: {patient.lastVisit}</span>
                </div>
              </Link>
            )) : (
              <p className="text-slate-400 text-center py-8 italic">患者が登録されていません</p>
            )}
          </div>
        </div>

        {/* Sidebar widgets */}
        <div className="space-y-6">
          {/* 要注意患者 */}
          {cautionCount > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="text-amber-500" size={20} />
                注意が必要な患者
              </h2>
              <div className="space-y-3">
                {allPatients.filter(p => p.status === '要注意' || p.status === '治療中').slice(0, 5).map((patient, i) => (
                  <Link key={i} href={`/patients/${patient.dbId}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-amber-50 transition-colors group">
                    <span className="text-lg">{patient.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{patient.name}</p>
                      <p className="text-xs text-slate-500">{patient.owner} 様</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${patient.status === '要注意' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                      {patient.status}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">重要なお知らせ</h2>
            <div className="space-y-4">
              <div className="flex gap-3 items-start border-l-2 border-rose-400 pl-3 py-1">
                <div className="w-2 h-2 mt-2 rounded-full bg-rose-400"></div>
                <div>
                  <h4 className="font-medium text-sm text-slate-800">狂犬病予防接種期間</h4>
                  <p className="text-xs text-slate-500 mt-1">今月末までに案内ハガキの発送が完了しています。</p>
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-blue-400 pl-3 py-1">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-400"></div>
                <div>
                  <h4 className="font-medium text-sm text-slate-800">システムメンテナンス</h4>
                  <p className="text-xs text-slate-500 mt-1">3月15日(日) 0:00~4:00 は「みるペット」連携が停止します。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, badgeColor }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}
