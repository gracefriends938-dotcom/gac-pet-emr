'use client';

import { useState } from 'react';
import { Edit3, X, Stethoscope, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EditRecordModal({ record }) {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const [formData, setFormData] = useState({
        patientId: record.patientId, // for updateRecord in backend
        date: record.date,
		weight: record.weight,
		symptoms: record.symptoms,
		diagnosis: record.diagnosis,
		treatment: record.treatment,
		notes: record.notes
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await fetch(`/api/records/${record.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});
			if (res.ok) {
				setIsOpen(false);
				router.refresh();
			} else {
                alert("保存に失敗しました");
            }
		} catch (error) {
			console.error('Error updating record:', error);
            alert("エラーが発生しました");
		} finally {
			setLoading(false);
		}
	};

    const handleDelete = async () => {
        if (!confirm("本当にこのカルテを削除しますか？一度削除すると元に戻せません。")) return;
        setLoading(true);
        try {
			const res = await fetch(`/api/records/${record.id}`, {
				method: 'DELETE'
			});
			if (res.ok) {
				setIsOpen(false);
				router.refresh();
			} else {
                alert("削除に失敗しました");
            }
		} catch (error) {
			console.error('Error deleting record:', error);
            alert("エラーが発生しました");
		} finally {
			setLoading(false);
		}
    };

	return (
		<>
			<button onClick={() => setIsOpen(true)} className="text-slate-400 hover:text-emerald-600 transition-colors">
                <Edit3 size={16} />
            </button>

			{isOpen && (
				<div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
						<div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
							<h2 className="font-bold text-slate-800 flex items-center gap-2">
								<Stethoscope className="text-emerald-500" size={18} /> 診察記録の編集 ({record.date})
							</h2>
							<button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
								<X size={20} />
							</button>
						</div>

						<form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto w-full text-left">
							<div className="flex items-center gap-4 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
								<label className="text-sm font-bold text-emerald-800">体重 (kg)</label>
								<input required type="text" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} className="w-24 px-3 py-1.5 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold" />
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<h4 className="flex items-center gap-2 font-semibold text-slate-700 mb-2 border-b border-slate-100 pb-1 italic">
										<span className="text-xs font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded not-italic">S</span> Subjective (主訴)
									</h4>
									<textarea required rows="3" value={formData.symptoms} onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 text-sm"></textarea>
								</div>
								<div>
									<h4 className="flex items-center gap-2 font-semibold text-slate-700 mb-2 border-b border-slate-100 pb-1 italic">
										<span className="text-xs font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded not-italic">O/A</span> Objective/Assessment
									</h4>
									<textarea rows="3" value={formData.diagnosis} onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 text-sm"></textarea>
								</div>
								<div className="md:col-span-2">
									<h4 className="flex items-center gap-2 font-semibold text-slate-700 mb-2 border-b border-slate-100 pb-1 italic">
										<span className="text-xs font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded not-italic">P</span> Plan/Treatment (処置・処方)
									</h4>
									<textarea required rows="3" value={formData.treatment} onChange={(e) => setFormData({ ...formData, treatment: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 text-sm"></textarea>
								</div>
								<div className="md:col-span-2">
									<h4 className="font-semibold text-slate-700 mb-2 border-b border-slate-100 pb-1">備考</h4>
									<textarea rows="2" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 text-sm text-slate-500"></textarea>
								</div>
							</div>

							<div className="pt-4 flex justify-between gap-3 border-t border-slate-100 mt-4">
                                <button type="button" onClick={handleDelete} disabled={loading} className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
                                    <Trash2 size={16} /> カルテを削除
                                </button>
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setIsOpen(false)} className="px-6 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">
                                        キャンセル
                                    </button>
                                    <button type="submit" disabled={loading} className="px-8 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-200 flex items-center gap-2">
                                        {loading ? '保存中...' : '更新する'}
                                    </button>
                                </div>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
}
