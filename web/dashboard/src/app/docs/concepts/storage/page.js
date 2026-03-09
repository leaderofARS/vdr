
import CodeBlock from "@/app/docs/components/CodeBlock";
import Callout from "@/app/docs/components/Callout";
import Endpoint from "@/app/docs/components/Endpoint";
import ParamTable, { ParamRow } from "@/app/docs/components/ParamTable";
import ResponseTabs from "@/app/docs/components/ResponseTabs";
import DocsPrevNext from "@/app/docs/components/DocsPrevNext";

export const metadata = { title: "On-Chain Storage" };

export default function Page() {
    return (
        <div>
            <h1>On-Chain Storage</h1>
<p>Comprehensive guide and breakdown for On-Chain Storage. Ensure your setup follows security protocols natively.</p>

            <DocsPrevNext prev={{ title: 'Verification Model', href: '/docs/concepts/verification' }} next={{ title: 'CLI Overview', href: '/docs/cli' }} />
        </div>
    );
}
    