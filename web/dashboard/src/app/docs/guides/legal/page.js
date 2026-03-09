
import CodeBlock from "@/app/docs/components/CodeBlock";
import Callout from "@/app/docs/components/Callout";
import Endpoint from "@/app/docs/components/Endpoint";
import ParamTable, { ParamRow } from "@/app/docs/components/ParamTable";
import ResponseTabs from "@/app/docs/components/ResponseTabs";
import DocsPrevNext from "@/app/docs/components/DocsPrevNext";

export const metadata = { title: "Legal Documents" };

export default function Page() {
    return (
        <div>
            <h1>Legal Documents</h1>
<p>Comprehensive guide and breakdown for Legal Documents. Ensure your setup follows security protocols natively.</p>

            <DocsPrevNext prev={{ title: 'Usage & Analytics', href: '/docs/api/usage' }} next={{ title: 'Financial Reports', href: '/docs/guides/financial' }} />
        </div>
    );
}
    