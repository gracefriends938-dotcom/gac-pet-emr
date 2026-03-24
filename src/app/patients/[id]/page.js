import Link from "next/link";
import { ChevronLeft, Edit3, Stethoscope, ActivitySquare, FileText } from "lucide-react";
import { getPatients, getPatientRecords } from "@/lib/sheets";
import NewRecordModal from "@/components/NewRecordModal";
import EditPatientModal from "@/components/EditPatientModal";
import EditRecordModal from "@/components/EditRecordModal";

export const dynamic = 'force-dynamic';

export default async function PatientDetail({ params }) {
	const resolvedParams = await params;
	const dbId = resolvedParams.id;
	const allPatients = await getPatients();
	const patient = allPatients.find(p => p.dbId === dbId);
	const records = await getPatientRecords(dbId);

	if (!patient) {
		return (
			<div className="p-12 text-center">
				<p className="text-slate-500">患者が見つかりませんでした。</p>
				<Link href="/patients" className="text-emerald-600 hover:underline mt-4 block">一覧に戻る</Link>
			</div>
		);
	}

	return (
		<div className="space-y-6 max-w-6xl mx-auto pb-12">
			{/* Header & Breadcrumb */}
			<div className="flex items-center gap-4 text-sm text-slate-500 mb-2">
				<Link href="/patients" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
					<ChevronLeft size={16} /> 患者一覧に戻る
				</Link>
				<span>/</span>
				<span className="text-slate-800 font-medium">{patient.id} ({patient.name})</span>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

				{/* Left Column: Patient Profile */}
				<div className="xl:col-span-1 space-y-6">
					<div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
						<div className="bg-emerald-500/10 p-6 flex flex-col items-center border-b border-emerald-500/10">
							<div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center text-5xl mb-4 border-4 border-white">
								{patient.emoji}
							</div>
							<h1 className="text-2xl font-bold text-slate-800">{patient.name}</h1>
							<p className="text-emerald-700 font-medium text-sm mt-1">{patient.breed} / {patient.gender} / {patient.age}</p>
							<div className="mt-4 flex gap-2">
								<span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600">最終来院: {patient.lastVisit}</span>
							</div>
						</div>
						<div className="p-6 space-y-4 text-sm">
							<div>
								<p className="text-slate-400 text-xs mb-1">飼い主情報</p>
								<div className="font-medium text-slate-800">{patient.owner} 様</div>
							</div>
							{(patient.updatedAt || patient.updatedBy) && (
								<div className="pt-2 border-t border-slate-100 mt-2">
									<p className="text-slate-400 text-[10px] mb-1">基本情報 最終更新</p>
									<p className="text-slate-600 text-xs font-medium">{patient.updatedAt} by {patient.updatedBy || '不明'}</p>
								</div>
							)}
							<EditPatientModal patient={patient} />
						</div>
					</div>
				</div>

				{/* Right Column: Medical Records (EMR) */}
				<div className="xl:col-span-2 space-y-6">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
							<Stethoscope className="text-emerald-500" /> カルテ履歴
						</h2>
						<div className="flex gap-2">
							<Link href={`/patients/${dbId}/billing`} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2">
								<FileText size={18} /> 会計・明細を作成
							</Link>
							<NewRecordModal patientId={patient.dbId} />
						</div>
					</div>

					<div className="space-y-4">
						{records.length > 0 ? (
							records.map((record, index) => (
								<div key={record.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
									<div className={`absolute top-0 left-0 w-1.5 h-full ${index === 0 ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
									<div className="p-6 pl-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
										<div className="flex items-baseline gap-4">
											<h3 className="font-bold text-slate-800 text-lg">{record.date}</h3>
											<span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{record.diagnosis || '診察'}</span>
										</div>
										<div className="flex items-center gap-3">
											<span className="text-xs text-slate-500">体重: {record.weight}kg</span>
											<EditRecordModal record={record} />
										</div>
									</div>
									<div className="p-6 pl-8 space-y-6 text-sm">
										<div className="grid grid-cols-1 gap-4">
											<div>
												<h4 className="font-semibold text-slate-700 mb-1 border-b border-slate-100 pb-1">症状</h4>
												<p className="text-slate-600 leading-relaxed">{record.symptoms}</p>
											</div>
											<div>
												<h4 className="font-semibold text-slate-700 mb-1 border-b border-slate-100 pb-1">処置・内容</h4>
												<p className="text-slate-600 leading-relaxed">{record.treatment}</p>
											</div>
											{record.notes && (
												<div>
													<h4 className="font-semibold text-slate-700 mb-1 border-b border-slate-100 pb-1">備考</h4>
													<p className="text-slate-600 leading-relaxed">{record.notes}</p>
												</div>
											)}
											{(record.updatedAt || record.updatedBy) && (
												<div className="pt-2 text-right">
													<p className="text-slate-400 text-[11px]">最終更新: {record.updatedAt} by {record.updatedBy || '不明'}</p>
												</div>
											)}
										</div>
									</div>
								</div>
							))
						) : (
							<div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center text-slate-400 italic">
								カルテ履歴がありません。
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
