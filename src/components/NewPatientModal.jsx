'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NewPatientModal() {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const [formData, setFormData] = useState({
		name: '',
		breed: '',
		gender: '♂',
		age: '',
		owner: '',
		emoji: '🐕'
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await fetch('/api/patients', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});
			if (res.ok) {
				setIsOpen(false);
				setFormData({ name: '', breed: '', gender: '♂', age: '', owner: '', emoji: '🐕' });
				router.refresh(); // Refresh the list
			}
		} catch (error) {
			console.error('Error adding patient:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
			>
				<Plus size={18} /> 新規患者登録
			</button>

			{isOpen && (
				<div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
						<div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
							<h2 className="font-bold text-slate-800">新規患者登録</h2>
							<button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
								<X size={20} />
							</button>
						</div>

						<form onSubmit={handleSubmit} className="p-6 space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="col-span-1">
									<label className="block text-xs font-bold text-slate-500 mb-1">ペット名</label>
									<input
										required
										type="text"
										value={formData.name}
										onChange={(e) => setFormData({ ...formData, name: e.target.value })}
										className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 text-sm"
										placeholder="レオ"
									/>
								</div>
								<div className="col-span-1">
									<label className="block text-xs font-bold text-slate-500 mb-1">アイコン</label>
									<select
										value={formData.emoji}
										onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
										className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 text-sm"
									>
										<option value="🐕">🐕 犬</option>
										<option value="🐈">🐈 猫</option>
										<option value="🐇">🐇 ウサギ</option>
										<option value="🐥">🐥 鳥</option>
										<option value="🐾">🐾 その他</option>
									</select>
								</div>
							</div>

							<div>
								<label className="block text-xs font-bold text-slate-500 mb-1">種類・犬種</label>
								<input
									required
									type="text"
									value={formData.breed}
									onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
									className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 text-sm"
									placeholder="柴犬、ミックスなど"
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-xs font-bold text-slate-500 mb-1">性別</label>
									<div className="flex bg-slate-100 p-1 rounded-lg">
										{['♂', '♀', '不明'].map((g) => (
											<button
												key={g}
												type="button"
												onClick={() => setFormData({ ...formData, gender: g })}
												className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${formData.gender === g ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
											>
												{g}
											</button>
										))}
									</div>
								</div>
								<div>
									<label className="block text-xs font-bold text-slate-500 mb-1">年齢</label>
									<input
										type="text"
										value={formData.age}
										onChange={(e) => setFormData({ ...formData, age: e.target.value })}
										className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 text-sm"
										placeholder="3歳"
									/>
								</div>
							</div>

							<div>
								<label className="block text-xs font-bold text-slate-500 mb-1">飼い主名</label>
								<input
									required
									type="text"
									value={formData.owner}
									onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
									className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 text-sm"
									placeholder="田中 太郎"
								/>
							</div>

							<div className="pt-4 flex gap-3">
								<button
									type="button"
									onClick={() => setIsOpen(false)}
									className="flex-1 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
								>
									キャンセル
								</button>
								<button
									type="submit"
									disabled={loading}
									className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-emerald-200"
								>
									{loading ? '保存中...' : '登録する'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
}
