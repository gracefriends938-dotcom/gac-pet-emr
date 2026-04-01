'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, ChevronRight } from 'lucide-react';

export default function PatientSearchTable({ patients: initialPatients }) {
	const [searchQuery, setSearchQuery] = useState('');
	const [filterType, setFilterType] = useState('all'); // all, dog, cat, other
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 20;

	const filteredPatients = useMemo(() => {
		let result = initialPatients;

		// テキスト検索
		if (searchQuery.trim()) {
			const q = searchQuery.trim().toLowerCase();
			result = result.filter(p =>
				p.name?.toLowerCase().includes(q) ||
				p.owner?.toLowerCase().includes(q) ||
				p.id?.toLowerCase().includes(q) ||
				p.breed?.toLowerCase().includes(q)
			);
		}

		// 種類フィルタ
		if (filterType === 'dog') {
			result = result.filter(p => p.emoji === '🐕' || p.emoji === '🐩' || p.breed?.includes('犬') || p.breed?.includes('柴') || p.breed?.includes('プードル'));
		} else if (filterType === 'cat') {
			result = result.filter(p => p.emoji === '🐈' || p.breed?.includes('猫'));
		} else if (filterType === 'other') {
			result = result.filter(p => !['🐕', '🐩', '🐈'].includes(p.emoji));
		}

		return result;
	}, [initialPatients, searchQuery, filterType]);

	// ページネーション計算
	const totalPages = Math.max(1, Math.ceil(filteredPatients.length / itemsPerPage));
	const paginatedPatients = filteredPatients.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	// フィルタが変わったら1ページ目に戻る
	const handleSearch = (value) => {
		setSearchQuery(value);
		setCurrentPage(1);
	};

	const handleFilterChange = (type) => {
		setFilterType(prev => prev === type ? 'all' : type);
		setCurrentPage(1);
	};

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
			{/* Toolbar */}
			<div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center gap-4 bg-slate-50/50">
				<div className="relative flex-1 w-full">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => handleSearch(e.target.value)}
						placeholder="ペットの名前、飼い主名、診察券番号で検索..."
						className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm"
					/>
					{searchQuery && (
						<button 
							onClick={() => handleSearch('')}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
						>
							✕
						</button>
					)}
				</div>
				<div className="flex items-center gap-2 w-full sm:w-auto">
					<button
						onClick={() => handleFilterChange('dog')}
						className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-colors w-full sm:w-auto justify-center ${filterType === 'dog' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50 bg-white'}`}
					>
						🐕 犬
					</button>
					<button
						onClick={() => handleFilterChange('cat')}
						className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-colors w-full sm:w-auto justify-center ${filterType === 'cat' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50 bg-white'}`}
					>
						🐈 猫
					</button>
					<button
						onClick={() => handleFilterChange('other')}
						className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-colors w-full sm:w-auto justify-center ${filterType === 'other' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50 bg-white'}`}
					>
						🐾 その他
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
						{paginatedPatients.length > 0 ? (
							paginatedPatients.map((pet, idx) => (
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
											pet.status === '治療中' ? 'bg-amber-100 text-amber-700' :
											pet.status === '入院中' ? 'bg-blue-100 text-blue-700' :
												'bg-slate-100 text-slate-600'
											}`}>
											{pet.status}
										</span>
									</td>
									<td className="px-6 py-4 text-center">
										<Link href={`/patients/${pet.dbId}`} className="inline-block p-2 text-emerald-600 hover:text-white bg-emerald-50 hover:bg-emerald-500 rounded-lg transition-colors font-medium text-xs shadow-sm shadow-emerald-500/10">
											詳細を開く
										</Link>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="7" className="px-6 py-12 text-center text-slate-400">
									{searchQuery ? (
										<div>
											<p className="text-lg mb-1">検索結果がありません</p>
											<p className="text-sm">「{searchQuery}」に一致する患者が見つかりませんでした</p>
										</div>
									) : (
										<p className="italic">患者データが見つかりません。スプレッドシートを確認してください。</p>
									)}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50/30">
				<span>
					全 {filteredPatients.length} 件中 {paginatedPatients.length > 0 ? `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, filteredPatients.length)}` : '0'}件を表示
					{searchQuery && ` (検索: "${searchQuery}")`}
				</span>
				<div className="flex gap-1">
					<button
						onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
						disabled={currentPage === 1}
						className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
					>
						前へ
					</button>
					{Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
						const page = i + 1;
						return (
							<button
								key={page}
								onClick={() => setCurrentPage(page)}
								className={`px-3 py-1 rounded-lg transition-colors ${currentPage === page ? 'bg-emerald-500 text-white' : 'border border-slate-200 hover:bg-white'}`}
							>
								{page}
							</button>
						);
					})}
					<button
						onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
						disabled={currentPage === totalPages}
						className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
					>
						次へ
					</button>
				</div>
			</div>
		</div>
	);
}
