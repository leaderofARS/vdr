
import CodeBlock from "@/app/docs/components/CodeBlock";
import Callout from "@/app/docs/components/Callout";
import Endpoint from "@/app/docs/components/Endpoint";
import ParamTable, { ParamRow } from "@/app/docs/components/ParamTable";
import ResponseTabs from "@/app/docs/components/ResponseTabs";
import DocsPrevNext from "@/app/docs/components/DocsPrevNext";

export const metadata = { title: "Verification Model" };

export default function Page() {
    return (
        <div>
            <h1>Verification Model</h1>
<p>Comprehensive guide and breakdown for Verification Model. Ensure your setup follows security protocols natively.</p>

            <DocsPrevNext prev={{ title: 'Anchor Lifecycle', href: '/docs/concepts/lifecycle' }} next={{ title: 'On-Chain Storage', href: '/docs/concepts/storage' }} />
        </div>
    );
}
    