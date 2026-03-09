
import CodeBlock from "@/app/docs/components/CodeBlock";
import Callout from "@/app/docs/components/Callout";
import Endpoint from "@/app/docs/components/Endpoint";
import ParamTable, { ParamRow } from "@/app/docs/components/ParamTable";
import ResponseTabs from "@/app/docs/components/ResponseTabs";
import DocsPrevNext from "@/app/docs/components/DocsPrevNext";

export const metadata = { title: "Enterprise Setup" };

export default function Page() {
    return (
        <div>
            <h1>Enterprise Setup</h1>
<p>Comprehensive guide and breakdown for Enterprise Setup. Ensure your setup follows security protocols natively.</p>

            <DocsPrevNext prev={{ title: 'Financial Reports', href: '/docs/guides/financial' }} next={{ title: 'CI/CD Integration', href: '/docs/guides/cicd' }} />
        </div>
    );
}
    