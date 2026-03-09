
import CodeBlock from "@/app/docs/components/CodeBlock";
import Callout from "@/app/docs/components/Callout";
import Endpoint from "@/app/docs/components/Endpoint";
import ParamTable, { ParamRow } from "@/app/docs/components/ParamTable";
import ResponseTabs from "@/app/docs/components/ResponseTabs";
import DocsPrevNext from "@/app/docs/components/DocsPrevNext";

export const metadata = { title: "CLI Overview" };

export default function Page() {
    return (
        <div>
            <h1>CLI Overview</h1>
<p>Comprehensive guide and breakdown for CLI Overview. Ensure your setup follows security protocols natively.</p>

            <DocsPrevNext prev={{ title: 'On-Chain Storage', href: '/docs/concepts/storage' }} next={{ title: 'sipheron-vdr link', href: '/docs/cli/link' }} />
        </div>
    );
}
    