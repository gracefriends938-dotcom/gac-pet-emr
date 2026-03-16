"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronLeft, Save, Trash2, Printer, Search, Plus } from "lucide-react";
import Link from "next/link";



// Master Data (Mock)
const MASTER_ITEMS = [
	{ code: "110010", category: "基本料金", name: "初診料（オンライン）", price: 1500 },
	{ code: "110020", category: "基本料金", name: "再診料（オンライン）", price: 800 },
	{ code: "110030", category: "基本料金", name: "同日再診料", price: 400 },
	{ code: "120010", category: "相談・指導", name: "セカンドオピニオン相談料", price: 3000 },
	{ code: "120020", category: "相談・指導", name: "行動・しつけ相談料", price: 2000 },
	{ code: "120030", category: "相談・指導", name: "栄養指導料", price: 1500 },
	{ code: "210010", category: "お薬", name: "処方料（内服薬・外用薬）", price: 300 },
	{ code: "220010", category: "お薬", name: "ネクスガードスペクトラ 11.3", price: 2200 },
	{ code: "220020", category: "お薬", name: "ネクスガードスペクトラ 22.5", price: 2500 },
	{ code: "220030", category: "お薬", name: "ネクスガードスペクトラ 45", price: 2800 },
	{ code: "220100", category: "お薬", name: "ウェルメイト点耳薬", price: 1800 },
	{ code: "310010", category: "諸経費", name: "郵送検査キット代（便）", price: 1500 },
	{ code: "310020", category: "諸経費", name: "郵送検査キット代（尿）", price: 1500 },
	{ code: "320010", category: "諸経費", name: "システム利用料", price: 300 },
	{ code: "900010", category: "配送料", name: "オンライン処方配送料", price: 330 },
];

export default function BillingPage({ params }) {
	const { id } = params;
	const [patientData, setPatientData] = useState({
		id: "PT-----",
		name: "読み込み中...",
		owner: "---",
		date: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }),
		doctor: "獣医師 デモ"
	});
	const invoiceRef = useRef();

	// Fetch patient data on mount
	useEffect(() => {
		async function fetchPatient() {
			try {
				const res = await fetch('/api/patients');
				const patients = await res.json();
				const patient = patients.find(p => p.id === id) || patients[0];
				if (patient) {
					setPatientData({
						id: patient.id,
						name: patient.name,
						owner: patient.owner,
						date: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }),
						doctor: "獣医師 デモ"
					});
				}
			} catch (error) {
				console.error("Failed to fetch patient:", error);
			}
		}
		fetchPatient();
	}, [id]);

	const [items, setItems] = useState([
		{ id: 1, code: "110020", category: "基本料金", name: "再診料（オンライン）", price: 800, qty: 1 },
		{ id: 2, code: "210010", category: "お薬", name: "処方料（内服薬・外用薬）", price: 300, qty: 1 },
		{ id: 3, code: "220030", category: "お薬", name: "ネクスガードスペクトラ 45", price: 2800, qty: 6 },
		{ id: 4, code: "900010", category: "配送料", name: "オンライン処方配送料", price: 330, qty: 1 },
	]);

	const [searchQuery, setSearchQuery] = useState("");
	const [filterCategory, setFilterCategory] = useState("すべて");

	// 2. Filter Master Items
	const filteredMasterItems = useMemo(() => {
		return MASTER_ITEMS.filter(item => {
			const matchCategory = filterCategory === "すべて" || item.category === filterCategory;
			const matchSearch = item.name.includes(searchQuery) || item.code.includes(searchQuery);
			return matchCategory && matchSearch;
		});
	}, [searchQuery, filterCategory]);

	// 3. Add Item Logic
	const addItemFromMaster = (masterItem) => {
		// If shipping fee is added, check if it already exists to avoid duplication
		if (masterItem.code === "900010" && items.some(i => i.code === "900010")) {
			return;
		}
		setItems([...items, { ...masterItem, id: Date.now(), qty: 1 }]);
	};

	const addCustomItemRow = () => {
		setItems([...items, { id: Date.now(), code: "", category: "未分類", name: "", price: 0, qty: 1 }]);
	};

	const updateItem = (id, field, value) => {
		setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
	};

	const removeItem = (id) => {
		setItems(items.filter(item => item.id !== id));
	};

	// 4. Calculation
	const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
	const tax = Math.floor(subtotal * 0.1);
	const total = subtotal + tax;

	// 5. Staff PDF Generation (Hidden usually, but kept for printing duty)
	const handleGeneratePDF = async () => {
		// Dynamically import html2pdf to avoid Next.js SSR "self is not defined" error
		const html2pdf = (await import('html2pdf.js')).default;

		const element = invoiceRef.current;
		element.style.display = 'block'; // Make visible just for printing
		const opt = {
			margin: 10,
			filename: `明細書_${patientData.id}_${patientData.date}.pdf`,
			image: { type: 'jpeg', quality: 0.98 },
			html2canvas: { scale: 2, useCORS: true },
			jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
		};
		html2pdf().set(opt).from(element).save().then(() => {
			element.style.display = 'none'; // Hide again
		});
	};

	return (
		<div className="space-y-4 max-w-[1600px] mx-auto pb-8 h-[calc(100vh-4rem)] flex flex-col">
			{/* Header Info Banner like Anirece */}
			<div className="bg-emerald-600 text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
				<div className="flex items-center gap-6 text-sm">
					<h1 className="font-bold text-lg tracking-wider">診療明細編集</h1>
					<div className="flex items-center gap-3 bg-white/10 px-3 py-1.5 rounded">
						<span className="opacity-80">カルテNo.:</span> <span className="font-mono font-bold text-base">{patientData.id}</span>
					</div>
					<div className="flex items-center gap-3">
						<span className="opacity-80">患者名:</span> <span className="font-bold text-base">{patientData.name}</span>
					</div>
					<div className="flex items-center gap-3">
						<span className="opacity-80">飼主名:</span> <span className="font-bold text-base">{patientData.owner}様</span>
					</div>
				</div>
				<div className="flex gap-2 text-sm">
					<div className="bg-white/10 px-3 py-1.5 rounded flex items-center gap-2">
						担当医: <select className="bg-transparent font-bold focus:outline-none"><option>{patientData.doctor}</option></select>
					</div>
					<Link href={`/patients/1`} className="bg-white text-emerald-700 hover:bg-emerald-50 px-4 py-1.5 rounded font-bold transition-colors">
						カルテに戻る
					</Link>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">

				{/* Left: Master Data Explorer (Search & Add) */}
				<div className="lg:col-span-4 xl:col-span-3 bg-white border border-emerald-200 rounded-lg shadow-sm flex flex-col h-full overflow-hidden">
					<div className="p-3 bg-slate-50 border-b border-emerald-200 space-y-3">
						<div className="flex gap-2">
							<select
								value={filterCategory}
								onChange={e => setFilterCategory(e.target.value)}
								className="flex-1 text-sm border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
							>
								<option>すべて</option>
								<option>基本料金</option>
								<option>相談・指導</option>
								<option>お薬</option>
								<option>諸経費</option>
								<option>配送料</option>
							</select>
						</div>
						<div className="relative">
							<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
							<input
								type="text"
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
								placeholder="診療項目の検索..."
								className="pl-8 text-sm w-full border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500 py-1.5"
							/>
						</div>
					</div>

					<div className="flex-1 overflow-y-auto bg-white">
						<table className="w-full text-xs text-left">
							<thead className="bg-slate-100 sticky top-0 border-b border-emerald-200 z-10">
								<tr>
									<th className="py-2 px-2 text-slate-600 font-medium">No.</th>
									<th className="py-2 px-2 text-slate-600 font-medium w-full">診療項目</th>
									<th className="py-2 px-2 text-slate-600 font-medium text-right whitespace-nowrap">単価</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{filteredMasterItems.map((item, idx) => (
									<tr
										key={idx}
										onClick={() => addItemFromMaster(item)}
										className="hover:bg-emerald-50 cursor-pointer transition-colors group"
									>
										<td className="py-2 px-2 text-slate-500 font-mono">{item.code}</td>
										<td className="py-2 px-2 font-medium text-slate-700 group-hover:text-emerald-700">{item.name}</td>
										<td className="py-2 px-2 text-right text-slate-600 whitespace-nowrap">¥{item.price.toLocaleString()}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					{/* Add Custom Empty Row Button */}
					<div className="p-2 border-t border-emerald-200 bg-slate-50">
						<button
							onClick={addCustomItemRow}
							className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-1.5 rounded text-sm flex items-center justify-center gap-1 transition-colors"
						>
							<Plus size={16} /> 自由記述行を追加
						</button>
					</div>
				</div>

				{/* Right: Working Invoice Table */}
				<div className="lg:col-span-8 xl:col-span-9 bg-white border border-emerald-200 rounded-lg shadow-sm flex flex-col h-full">
					<div className="overflow-x-auto flex-1">
						<table className="w-full text-sm text-left">
							<thead className="bg-emerald-50 border-b-2 border-emerald-200 sticky top-0 z-10">
								<tr>
									<th className="py-2 px-3 text-slate-700 font-bold border-r border-emerald-100">No.</th>
									<th className="py-2 px-3 text-slate-700 font-bold border-r border-emerald-100 w-1/3">診療項目</th>
									<th className="py-2 px-3 text-slate-700 font-bold border-r border-emerald-100">診療区分</th>
									<th className="py-2 px-3 text-slate-700 font-bold border-r border-emerald-100 text-right">単価</th>
									<th className="py-2 px-3 text-slate-700 font-bold border-r border-emerald-100 text-center w-20">数量</th>
									<th className="py-2 px-3 text-slate-700 font-bold border-r border-emerald-100 text-right">計</th>
									<th className="py-2 px-2 text-center w-12"></th>
								</tr>
							</thead>
							<tbody className="divide-y divide-emerald-100">
								{items.map((item, index) => (
									<tr key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-emerald-50/30`}>
										<td className="py-2 px-3 border-r border-emerald-50 font-mono text-xs text-slate-500">
											{item.code || "---"}
										</td>
										<td className="py-1 px-1 border-r border-emerald-50">
											<input
												type="text"
												value={item.name}
												onChange={e => updateItem(item.id, 'name', e.target.value)}
												className="w-full px-2 py-1 bg-transparent border border-transparent hover:border-slate-300 focus:bg-white focus:border-emerald-500 rounded outline-none font-medium"
											/>
										</td>
										<td className="py-1 px-1 border-r border-emerald-50">
											<input
												type="text"
												value={item.category}
												onChange={e => updateItem(item.id, 'category', e.target.value)}
												className="w-full px-2 py-1 bg-transparent border border-transparent hover:border-slate-300 focus:bg-white focus:border-emerald-500 rounded outline-none text-xs text-slate-600"
											/>
										</td>
										<td className="py-1 px-1 border-r border-emerald-50">
											<input
												type="number"
												value={item.price}
												onChange={e => updateItem(item.id, 'price', Number(e.target.value))}
												className="w-full px-2 py-1 bg-transparent border border-transparent hover:border-slate-300 focus:bg-white focus:border-emerald-500 rounded outline-none text-right font-mono"
											/>
										</td>
										<td className="py-1 px-1 border-r border-emerald-50">
											<input
												type="number"
												value={item.qty}
												onChange={e => updateItem(item.id, 'qty', Number(e.target.value))}
												className="w-full px-2 py-1 bg-white border border-emerald-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded outline-none text-center font-bold text-emerald-700"
											/>
										</td>
										<td className="py-2 px-3 border-r border-emerald-50 text-right font-bold text-slate-700">
											¥{(item.price * item.qty).toLocaleString()}
										</td>
										<td className="py-1 px-1 text-center">
											<button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-rose-500 p-1 mx-auto block transition-colors bg-white rounded shadow-sm border border-slate-200">
												<Trash2 size={14} />
											</button>
										</td>
									</tr>
								))}
								{/* Empty rows to fill space and look like a spreadsheet */}
								{[...Array(Math.max(0, 8 - items.length))].map((_, i) => (
									<tr key={`empty-${i}`} className="h-10 border-b border-emerald-50 bg-white">
										<td className="border-r border-emerald-50"></td>
										<td className="border-r border-emerald-50"></td>
										<td className="border-r border-emerald-50"></td>
										<td className="border-r border-emerald-50"></td>
										<td className="border-r border-emerald-50"></td>
										<td className="border-r border-emerald-50"></td>
										<td></td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Bottom Action Bar & Totals */}
					<div className="bg-emerald-50 border-t-2 border-emerald-200 p-4 shrink-0">
						<div className="flex justify-between items-end gap-6">

							{/* Save Buttons & Print Action */}
							<div className="flex gap-2">
								<button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded shadow flex items-center gap-2 font-bold transition-colors">
									<Save size={18} /> 明細を保存して終了
								</button>
								{/* Staff Print Button: Only visible to staff role typically, but provided here for demo */}
								<button onClick={handleGeneratePDF} className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded shadow-sm flex items-center gap-2 font-medium transition-colors ml-4">
									<Printer size={18} /> スタッフ用 明細出力(PDF)
								</button>
							</div>

							{/* Subtotal & Total display */}
							<div className="flex gap-4">
								<div className="bg-yellow-100 border border-yellow-300 rounded px-6 py-2 min-w-[200px]">
									<div className="flex justify-between text-sm text-yellow-800 mb-1">
										<span>小計 (税抜):</span>
										<span className="font-mono">¥ {subtotal.toLocaleString()}</span>
									</div>
									<div className="flex justify-between text-sm text-yellow-800 mb-1">
										<span>消費税:</span>
										<span className="font-mono">¥ {tax.toLocaleString()}</span>
									</div>
									<div className="flex justify-between items-baseline mt-1 border-t border-yellow-300 pt-1">
										<span className="text-yellow-900 font-bold">合計:</span>
										<span className="text-2xl font-bold font-mono text-yellow-900">¥ {total.toLocaleString()}</span>
									</div>
								</div>
							</div>

						</div>
					</div>
				</div>

			</div>

			{/* Hidden Printable Invoice for Staff */}
			<div style={{ display: 'none' }}>
				<div
					ref={invoiceRef}
					className="bg-white min-w-[700px] w-[210mm] min-h-[297mm] p-12 flex flex-col text-black"
					style={{ fontFamily: "'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif" }}
				>
					<div className="flex justify-between items-start border-b-2 border-black pb-4 mb-8">
						<div>
							<h1 className="text-2xl font-bold tracking-widest mb-1">診療明細書 兼 領収書</h1>
							<p className="font-medium text-sm">発行日: {patientData.date}</p>
						</div>
						<div className="text-right text-sm">
							<h2 className="font-bold text-lg mb-1">みるペット オンライン動物病院</h2>
							<p>〒100-0000 東京都千代田区1-1-1</p>
							<p>TEL: 03-XXXX-XXXX / 登録: T1234567890</p>
						</div>
					</div>

					<div className="flex justify-between items-end mb-8">
						<div className="border-b border-black pb-1 w-1/2">
							<p className="text-xl font-bold">{patientData.owner} <span className="text-base font-normal">様</span></p>
						</div>
						<div className="border border-black p-3 text-sm w-1/3">
							<div className="grid grid-cols-2 gap-y-1">
								<span>患者ID:</span><span className="font-medium">{patientData.id}</span>
								<span>ペット名:</span><span className="font-bold">{patientData.name}</span>
							</div>
						</div>
					</div>

					<table className="w-full mb-8 text-sm border-collapse border border-black">
						<thead>
							<tr className="bg-gray-100">
								<th className="border border-black text-left font-bold py-2 px-2">診療項目</th>
								<th className="border border-black text-right font-bold py-2 px-2 w-20">単価</th>
								<th className="border border-black text-center font-bold py-2 px-2 w-16">数量</th>
								<th className="border border-black text-right font-bold py-2 px-2 w-24">金額</th>
							</tr>
						</thead>
						<tbody>
							{items.map((item, index) => (
								<tr key={index}>
									<td className="border border-black py-2 px-2">{item.name}</td>
									<td className="border border-black py-2 px-2 text-right">¥{item.price.toLocaleString()}</td>
									<td className="border border-black py-2 px-2 text-center">{item.qty}</td>
									<td className="border border-black py-2 px-2 text-right">¥{(item.price * item.qty).toLocaleString()}</td>
								</tr>
							))}
						</tbody>
					</table>

					<div className="flex justify-end mb-16">
						<div className="w-1/3 text-sm">
							<div className="flex justify-between py-1 border-b border-black">
								<span>小計</span><span>¥ {subtotal.toLocaleString()}</span>
							</div>
							<div className="flex justify-between py-1 border-b border-black">
								<span>消費税 (10%)</span><span>¥ {tax.toLocaleString()}</span>
							</div>
							<div className="flex justify-between py-2 border-b-2 border-black text-base font-bold">
								<span>合計金額</span><span>¥ {total.toLocaleString()}</span>
							</div>
						</div>
					</div>

					<div className="mt-auto text-center text-xs text-gray-600 border-t border-gray-300 pt-4">
						ペット保険をご利用の際は、本明細書を保険会社にご提出ください。<br />
						オンライン診療をご利用いただき、誠にありがとうございました。
					</div>
				</div>
			</div>

		</div>
	);
}
