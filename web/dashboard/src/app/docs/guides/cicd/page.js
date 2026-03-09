
import CodeBlock from "@/app/docs/components/CodeBlock";
import Callout from "@/app/docs/components/Callout";
import Endpoint from "@/app/docs/components/Endpoint";
import ParamTable, { ParamRow } from "@/app/docs/components/ParamTable";
import ResponseTabs from "@/app/docs/components/ResponseTabs";
import DocsPrevNext from "@/app/docs/components/DocsPrevNext";

export const metadata = { title: "CI/CD Integration" };

export default function Page() {
    return (
        <div>
            <h1>CI/CD Integration</h1>
<p>Comprehensive guide and breakdown for CI/CD Integration. Ensure your setup follows security protocols natively.</p>

            <DocsPrevNext prev={{ title: 'Enterprise Setup', href: '/docs/guides/enterprise' }} next={{ title: 'Webhook Integration', href: '/docs/guides/webhook' }} />
        </div>
    );
}
    