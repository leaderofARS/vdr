export default function Callout({ type = 'info', children }) {
    const styles = {
        info: 'bg-blue-900/20 border-blue-500/50 text-blue-200',
        warning: 'bg-yellow-900/20 border-yellow-500/50 text-yellow-200',
        tip: 'bg-green-900/20 border-green-500/50 text-green-200',
    };

    const icons = {
        info: <svg className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
        warning: <svg className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>,
        tip: <svg className="w-5 h-5 text-green-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
    };

    return (
        <div className={`my-6 flex gap-3 p-4 border rounded-lg not-prose ${styles[type]}`}>
            {icons[type]}
            <div className="text-sm leading-relaxed text-inherit opacity-90">
                {children}
            </div>
        </div>
    );
}
