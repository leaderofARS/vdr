
import CodeBlock from "@/app/docs/components/CodeBlock";
import Callout from "@/app/docs/components/Callout";
import Endpoint from "@/app/docs/components/Endpoint";
import ParamTable, { ParamRow } from "@/app/docs/components/ParamTable";
import ResponseTabs from "@/app/docs/components/ResponseTabs";
import DocsPrevNext from "@/app/docs/components/DocsPrevNext";

export const metadata = { title: "Webhook Integration" };

export default function Page() {
    return (
        <div>
            <h1>Webhook Integration</h1>
<p>Comprehensive guide and breakdown for Webhook Integration. Ensure your setup follows security protocols natively.</p>

            <DocsPrevNext prev={{ title: 'CI/CD Integration', href: '/docs/guides/cicd' }} next={{ title: 'JavaScript SDK', href: '/docs/sdks/javascript' }} />
        </div>
    );
}
    