export default function DocLayout({ children }) {
    return (
        <article className="flex-1 min-w-0 prose prose-invert prose-purple max-w-none 
            prose-headings:scroll-mt-screen prose-headings:font-bold prose-h1:text-3xl prose-h1:mb-8
            prose-h2:text-xl prose-h2:mt-16 prose-h2:mb-4 prose-h2:border-b prose-h2:border-white/5 prose-h2:pb-2
            prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-[#888888] prose-p:leading-relaxed prose-p:mb-6 prose-p:text-[14px]
            prose-a:text-[#9B6EFF] prose-a:no-underline hover:prose-a:text-purple-300
            prose-code:text-[#9B6EFF] prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-[#111111] prose-pre:border prose-pre:border-[#2A2A2A] prose-pre:rounded-xl prose-pre:p-6 prose-pre:mb-8
            prose-ol:text-[#888888] prose-ul:text-[#888888] prose-li:text-[14px]
            prose-li:mb-2
            prose-table:w-full prose-table:text-sm prose-th:text-[#888888] prose-th:font-medium prose-td:text-[#EDEDED]
        ">
            {children}
        </article>
    );
}
