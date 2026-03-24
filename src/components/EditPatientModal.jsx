'use client';

import { useState } from 'react';
import { Edit3, X, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EditPatientModal({ patient }) {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const [formData, setFormData] = useState({
		name: patient.name,
		emoji: patient.emoji,
		gender: patient.gender,
		age: patient.age,
		owner: patient.owner,
		breed: patient.breed,
		status: patient.status
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await fetch(`/api/patients/${patient.dbId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});
			if (res.ok) {
				setIsOpen(false);
				router.refresh(); // Refresh Server Component to fetch new patient data
			} else {
                alert("保存に失敗しました");
            }
		} catch (error) {
			console.error('Error updating patient:', error);
            alert("エラーが発生しました");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className="w-full py-2 flex items-center justify-center gap-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors font-medium mt-4"
			>
				<Edit3 size={16} /> 基本情報を編集
			</button>

			{isOpen && (
				<div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
						<div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
							<h2 className="font-bold text-slate-800 flex items-center gap-2">
								<User className="text-emerald-500" size={18} /> 患者情報の編集
							</h2>
							<button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
								<X size={20} />
							</button>
						</div>

						<form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
							<div className="grid grid-cols-2 gap-4">
								<div className="col-span-2">
									<label className="text-xs font-bold text-slate-500 mb-1 block">ペット名</label>
									<input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
								</div>
								<div>
									<label className="text-xs font-bold text-slate-500 mb-1 block">絵文字 (アイコン)</label>
									<input required type="text" value={formData.emoji} onChange={e => setFormData({...formData, emoji: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-center text-xl" />
								</div>
								<div>
									<label className="text-xs font-bold text-slate-500 mb-1 block">性別</label>
									<select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white">
                                        <option>オス</option>
                                        <option>メス</option>
                                        <option>去勢オス</option>
                                        <option>避妊メス</option>
                                        <option>不明</option>
                                    </select>
								</div>
								<div>
									<label className="text-xs font-bold text-slate-500 mb-1 block">年齢</label>
									<input required type="text" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
								</div>
								<div>
									<label className="text-xs font-bold text-slate-500 mb-1 block">種類・品種</label>
									<input required type="text" value={formData.breed} onChange={e => setFormData({...formData, breed: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
								</div>
								<div className="col-span-2">
									<label className="text-xs font-bold text-slate-500 mb-1 block">飼い主名</label>
									<input required type="text" value={formData.owner} onChange={e => setFormData({...formData, owner: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
								</div>
								<div className="col-span-2">
									<label className="text-xs font-bold text-slate-500 mb-1 block">ステータス</label>
									<select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white">
                                        <option>健康</option>
                                        <option>治療中</option>
                                        <option>経過観察</option>
                                        <option>入院中</option>
                                        <option>アーカイブ</option>
                                    </select>
								</div>
							</div>

							<div className="pt-4 flex gap-3">
								<button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">
									キャンセル
								</button>
								<button type="submit" disabled={loading} className="flex-[2] py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-200 flex items-center justify-center">
									{loading ? '保存中...' : '更新する'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
}
