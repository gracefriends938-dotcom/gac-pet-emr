import Link from "next/link";
import { Search, Filter, ChevronRight } from "lucide-react";
import { getPatients } from "@/lib/sheets";
import NewPatientModal from "@/components/NewPatientModal";

export const dynamic = 'force-dynamic';

export default async function PatientsList() {
	const patients = await getPatients();

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
				<div>
					<h1 className="text-2xl font-bold text-slate-800 tracking-tight">患者一覧</h1>
					<p className="text-slate-500 mt-1">登録されているペットを検索・管理します</p>
				</div>
				<NewPatientModal />
			</div>

			<div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
				{/* Toolbar */}
				<div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center gap-4 bg-slate-50/50">
					<div className="relative flex-1 w-full">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
						<input
							type="text"
							placeholder="ペットの名前、飼い主名、診察券番号で検索..."
							className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm"
						/>
					</div>
					<div className="flex items-center gap-2 w-full sm:w-auto">
						<button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center">
							<Filter size={16} /> 絞り込み
						</button>
						<button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors bg-white w-full sm:w-auto justify-center">
							🐾 犬のみ表示
						</button>
					</div>
				</div>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead>
							<tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500">
								<th className="px-6 py-4 font-medium">診察券番号</th>
								<th className="px-6 py-4 font-medium">ペット名</th>
								<th className="px-6 py-4 font-medium">飼い主</th>
								<th className="px-6 py-4 font-medium">種類</th>
								<th className="px-6 py-4 font-medium">最終来院日</th>
								<th className="px-6 py-4 font-medium">ステータス</th>
								<th className="px-6 py-4 font-medium text-center">アクション</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{patients.length > 0 ? (
								patients.map((pet, idx) => (
									<tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
										<td className="px-6 py-4 text-slate-500 font-mono text-xs">{pet.id}</td>
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<span className="text-xl bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center">{pet.emoji}</span>
												<span className="font-bold text-slate-800">{pet.name} <span className="text-xs text-slate-500 font-normal ml-1">({pet.gender}/{pet.age})</span></span>
											</div>
										</td>
										<td className="px-6 py-4 text-slate-600">{pet.owner}</td>
										<td className="px-6 py-4 text-slate-600">{pet.breed}</td>
										<td className="px-6 py-4 text-slate-500">{pet.lastVisit}</td>
										<td className="px-6 py-4">
											<span className={`px-2.5 py-1 rounded-full text-xs font-medium ${pet.status === '要注意' ? 'bg-rose-100 text-rose-700' :
												pet.status === '健康' ? 'bg-emerald-100 text-emerald-700' :
													'bg-slate-100 text-slate-600'
												}`}>
												{pet.status}
											</span>
										</td>
										<td className="px-6 py-4 text-center">
											<Link href={`/patients/${pet.dbId}`}>
												<button className="text-slate-400 hover:text-emerald-600 p-2 rounded-lg hover:bg-emerald-50 transition-colors">
													<ChevronRight size={20} />
												</button>
											</Link>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="7" className="px-6 py-12 text-center text-slate-400 italic">
										患者データが見つかりません。スプレッドシートを確認してください。
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				<div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50/30">
					<span>全 {patients.length} 件中 {patients.length > 0 ? `1-${patients.length}` : '0'}件を表示</span>
					<div className="flex gap-1">
						<button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50" disabled>前へ</button>
						<button className="px-3 py-1 bg-emerald-500 text-white rounded-lg">1</button>
						<button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50" disabled>次へ</button>
					</div>
				</div>
			</div>
		</div>
	);
}
