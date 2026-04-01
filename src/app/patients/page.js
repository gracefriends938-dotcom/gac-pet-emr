import { getPatients } from "@/lib/sheets";
import NewPatientModal from "@/components/NewPatientModal";
import PatientSearchTable from "@/components/PatientSearchTable";

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

			<PatientSearchTable patients={patients} />
		</div>
	);
}
