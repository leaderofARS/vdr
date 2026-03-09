
import CodeBlock from "@/app/docs/components/CodeBlock";
import Callout from "@/app/docs/components/Callout";
import Endpoint from "@/app/docs/components/Endpoint";
import ParamTable, { ParamRow } from "@/app/docs/components/ParamTable";
import ResponseTabs from "@/app/docs/components/ResponseTabs";
import DocsPrevNext from "@/app/docs/components/DocsPrevNext";

export const metadata = { title: "Financial Reports" };

export default function Page() {
    return (
        <div>
            <h1>Financial Reports</h1>
<p>Comprehensive guide and breakdown for Financial Reports. Ensure your setup follows security protocols natively.</p>

            <DocsPrevNext prev={{ title: 'Legal Documents', href: '/docs/guides/legal' }} next={{ title: 'Enterprise Setup', href: '/docs/guides/enterprise' }} />
        </div>
    );
}
    