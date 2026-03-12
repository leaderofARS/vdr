import TableOfContents from './TableOfContents';

export default function DocLayout({ children, headings }) {
    return (
        <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto px-4 py-12">
            <article className="flex-1 min-w-0 prose prose-invert prose-purple max-w-none 
                prose-headings:scroll-mt-screen prose-headings:font-bold prose-h1:text-4xl prose-h1:mb-8
                prose-h2:text-2xl prose-h2:mt-16 prose-h2:mb-4 prose-h2:border-b prose-h2:border-white/5 prose-h2:pb-2
                prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-purple-400 prose-a:no-underline hover:prose-a:text-purple-300
                prose-code:text-purple-300 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-black/60 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:p-6 prose-pre:mb-8
                prose-ol:text-gray-300 prose-ul:text-gray-300
                prose-li:mb-2
                prose-table:w-full prose-table:text-sm prose-th:text-gray-400 prose-th:font-medium prose-td:text-gray-300
            ">
                {children}
            </article>
            <TableOfContents headings={headings} />
        </div>
    );
}
