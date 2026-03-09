
import CodeBlock from "@/app/docs/components/CodeBlock";
import Callout from "@/app/docs/components/Callout";
import Endpoint from "@/app/docs/components/Endpoint";
import ParamTable, { ParamRow } from "@/app/docs/components/ParamTable";
import ResponseTabs from "@/app/docs/components/ResponseTabs";
import DocsPrevNext from "@/app/docs/components/DocsPrevNext";

export const metadata = { title: "Anchor Lifecycle" };

export default function Page() {
    return (
        <div>
            <h1>Anchor Lifecycle</h1>
<p>Comprehensive guide and breakdown for Anchor Lifecycle. Ensure your setup follows security protocols natively.</p>

            <DocsPrevNext prev={{ title: 'How Hashing Works', href: '/docs/concepts/hashing' }} next={{ title: 'Verification Model', href: '/docs/concepts/verification' }} />
        </div>
    );
}
    