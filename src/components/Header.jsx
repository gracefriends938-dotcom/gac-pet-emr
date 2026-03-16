export default function Header() {
	return (
		<header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center px-8 shadow-sm justify-between sticky top-0 z-10 transition-all">
			<div>
				<h2 className="text-lg font-semibold text-slate-800">本日の診察予定</h2>
				<p className="text-xs text-slate-500">2026年3月11日 (水)</p>
			</div>

			<div className="flex flex-row items-center gap-4">
				<button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
					<span className="absolute top-1 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
				</button>
				<div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
				<button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-emerald-500/20 active:scale-95 flex items-center gap-2">
					<span>+</span> 新規受付
				</button>
			</div>
		</header>
	);
}
