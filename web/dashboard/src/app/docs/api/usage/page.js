
import CodeBlock from "@/app/docs/components/CodeBlock";
import Callout from "@/app/docs/components/Callout";
import Endpoint from "@/app/docs/components/Endpoint";
import ParamTable, { ParamRow } from "@/app/docs/components/ParamTable";
import ResponseTabs from "@/app/docs/components/ResponseTabs";
import DocsPrevNext from "@/app/docs/components/DocsPrevNext";

export const metadata = { title: "Usage & Analytics" };

export default function Page() {
    return (
        <div>
            
<h1>Usage & Analytics</h1>
<p>Interact programmatically with Usage & Analytics mechanisms utilizing standard REST paradigms.</p>
<Endpoint method="POST" path="/api/v1/usage-& analytics">
    Execute administrative control over Usage & Analytics.
</Endpoint>
<h2>Authentication</h2>
<p>All API calls require standard Bearer token authorization linked to your API Execution Key generated inside the Operations Dashboard.</p>
<h2>Request Body</h2>
<ParamTable>
    <ParamRow name="payload" type="string" required={true}>Deterministically structured parameter array.</ParamRow>
</ParamTable>
<h2>Response Examples</h2>
<ResponseTabs tabs={[
    { label: "200 Success", content: <CodeBlock language="json" filename="Success Response">{`{
  "success": true,
  "data": {}
}`}</CodeBlock> },
    { label: "401 Unauthorized", content: <CodeBlock language="json" filename="Error Response">{`{
  "error": "Invalid API token."
}`}</CodeBlock> }
]} />
        
            <DocsPrevNext prev={{ title: 'Notifications', href: '/docs/api/notifications' }} next={{ title: 'Legal Documents', href: '/docs/guides/legal' }} />
        </div>
    );
}
    