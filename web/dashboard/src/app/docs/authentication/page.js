
import CodeBlock from "@/app/docs/components/CodeBlock";
import Callout from "@/app/docs/components/Callout";
import Endpoint from "@/app/docs/components/Endpoint";
import ParamTable, { ParamRow } from "@/app/docs/components/ParamTable";
import ResponseTabs from "@/app/docs/components/ResponseTabs";
import DocsPrevNext from "@/app/docs/components/DocsPrevNext";

export const metadata = { title: "Authentication" };

export default function Page() {
    return (
        <div>
            <h1>Authentication</h1>
<p>Comprehensive guide and breakdown for Authentication. Ensure your setup follows security protocols natively.</p>

            <DocsPrevNext prev={{ title: 'Installation', href: '/docs/installation' }} next={{ title: 'How Hashing Works', href: '/docs/concepts/hashing' }} />
        </div>
    );
}
    