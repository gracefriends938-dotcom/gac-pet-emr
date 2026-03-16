import { Activity, Clock, Users, CalendarCheck2 } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">ダッシュボード</h1>
          <p className="text-slate-500 mt-1">本日の診療状況と概要を確認できます。</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="本日の予約"
          value="12"
          icon={<CalendarCheck2 className="text-emerald-500" size={24} />}
          trend="+2"
          trendLabel="昨日比"
        />
        <StatCard
          title="診察待ち"
          value="3"
          icon={<Clock className="text-amber-500" size={24} />}
          trend="↓"
          trendLabel="順調"
        />
        <StatCard
          title="診察完了"
          value="8"
          icon={<Activity className="text-blue-500" size={24} />}
          trend="+15%"
          trendLabel="先週比"
        />
        <StatCard
          title="新規患者"
          value="2"
          icon={<Users className="text-indigo-500" size={24} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Main schedule/patients list */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">本日の診察スケジュール</h2>
            <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">すべて見る</button>
          </div>

          <div className="space-y-4">
            {mockPatients.map((patient, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all group bg-slate-50/50 hover:bg-white cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                    {/* Placeholder for pet image or icon */}
                    <span className="text-2xl">{patient.emoji}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{patient.name} <span className="text-xs font-normal text-slate-500 ml-2">{patient.species} / {patient.age}</span></h3>
                    <p className="text-sm text-slate-500 mt-0.5">{patient.owner} 様 - {patient.reason}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${patient.status === '診察中' ? 'bg-emerald-100 text-emerald-700' :
                      patient.status === '待合室' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                    }`}>
                    {patient.status}
                  </span>
                  <span className="text-sm font-medium text-slate-600">{patient.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar widgets */}
        <div className="space-y-6">
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

function StatCard({ title, value, icon, trend, trendLabel }) {
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
      {(trend || trendLabel) && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs">{trend}</span>
          <span className="text-slate-400 text-xs">{trendLabel}</span>
        </div>
      )}
    </div>
  );
}

const mockPatients = [
  { name: 'レオ', species: '犬 (柴犬)', age: '3歳', owner: '田中', reason: '定期健診・ワクチン', time: '10:00', status: '診察完了', emoji: '🐕' },
  { name: 'タマ', species: '猫 (三毛)', age: '1歳', owner: '鈴木', reason: '食欲不振', time: '11:30', status: '診察中', emoji: '🐈' },
  { name: 'ココ', species: '犬 (トイプー)', age: '4ヶ月', owner: '佐藤', reason: '初診・相談', time: '11:45', status: '待合室', emoji: '🐩' },
  { name: 'モカ', species: 'ウサギ', age: '2歳', owner: '高橋', reason: '爪切り', time: '14:00', status: '予定', emoji: '🐇' },
];
